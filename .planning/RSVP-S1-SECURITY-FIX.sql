-- =============================================================================
-- S1 SECURITY FIX — enforce authz inside submit_rsvps + close the anon write hole
-- =============================================================================
-- Audit finding S1 (RSVP-LAUNCH-READINESS.md):
--   The Next.js submit route does a cross-household authz check, but that check
--   is NOT enforced at the database. anon holds INSERT/UPDATE on rsvps and
--   EXECUTE on submit_rsvps (which did no authz), and the anon key is public —
--   so anyone could call the RPC (or write rsvps directly via PostgREST) and
--   overwrite/pollute RSVP rows, bypassing every guard in the route.
--
-- This migration:
--   1. Rewrites submit_rsvps to reject any (guest_id, household_id) pair that
--      does not match a real row in guests. The check runs inside the
--      SECURITY DEFINER function, so it holds even when the RPC is called
--      directly with the public anon key.
--   2. Revokes anon's direct INSERT/UPDATE on rsvps. The app only ever writes
--      through the RPC, so this is safe and forces all writes through the
--      validated path. (It also disables the dead, already-broken v0.1 route
--      at app/(main)/api/rsvp/route.ts, which references the dropped guest_count
--      column — recommend deleting that file.)
--
-- How to apply:
--   1. Supabase Studio -> SQL Editor -> "+ New query"
--   2. Paste this entire file
--   3. Run (Cmd+Enter)
--   4. Verify with the checks at the bottom.
--
-- Idempotent: CREATE OR REPLACE + REVOKE/GRANT. Safe to re-run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.submit_rsvps(p_rows jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_bad int;
BEGIN
  -- Authz: every (guest_id, household_id) pair in the payload must correspond
  -- to a real guest in that household. A forged or cross-household pairing has
  -- no matching guests row, so v_bad > 0 and the whole call is rejected before
  -- any write. This is the DB-level enforcement of the route's pre-flight check.
  SELECT count(*) INTO v_bad
  FROM jsonb_array_elements(p_rows) AS r
  LEFT JOIN public.guests g
    ON g.id = (r->>'guest_id')::uuid
   AND g.household_id = (r->>'household_id')::uuid
  WHERE g.id IS NULL;

  IF v_bad > 0 THEN
    RAISE EXCEPTION 'unauthorized guest/household pairing'
      USING ERRCODE = '42501';
  END IF;

  -- Single ON CONFLICT statement → statement-level atomic (unchanged from
  -- the original; intra-payload duplicate guest_id still rolls the batch back).
  INSERT INTO public.rsvps (household_id, guest_id, attending, meal_choice, dietary_restrictions)
  SELECT
    (r->>'household_id')::uuid,
    (r->>'guest_id')::uuid,
    (r->>'attending')::boolean,
    CASE WHEN (r->>'attending')::boolean THEN r->>'meal_choice' ELSE NULL END,
    r->>'dietary_restrictions'
  FROM jsonb_array_elements(p_rows) AS r
  ON CONFLICT (guest_id) DO UPDATE SET
    household_id         = EXCLUDED.household_id,
    attending            = EXCLUDED.attending,
    meal_choice          = EXCLUDED.meal_choice,
    dietary_restrictions = EXCLUDED.dietary_restrictions;

  RETURN jsonb_build_object('count', jsonb_array_length(p_rows));
END;
$$;

-- Re-state function grants (function owner runs the body; anon only executes).
REVOKE ALL    ON FUNCTION public.submit_rsvps(jsonb) FROM public;
REVOKE ALL    ON FUNCTION public.submit_rsvps(jsonb) FROM anon;
GRANT EXECUTE ON FUNCTION public.submit_rsvps(jsonb) TO anon;
GRANT EXECUTE ON FUNCTION public.submit_rsvps(jsonb) TO authenticated;

-- Close the direct-write hole: the app writes only via submit_rsvps, so anon
-- has no reason to hold table-level INSERT/UPDATE on rsvps.
REVOKE INSERT, UPDATE ON public.rsvps FROM anon;

-- =============================================================================
-- VERIFY (run these after applying)
-- =============================================================================
-- (a) anon should NO LONGER have insert/update on rsvps (expect 0 rows):
--   SELECT privilege_type FROM information_schema.role_table_grants
--   WHERE grantee = 'anon' AND table_name = 'rsvps'
--     AND privilege_type IN ('INSERT','UPDATE');
--
-- (b) A forged pairing must raise (expect ERROR 42501, zero rows written).
--     Replace the UUIDs with a real guest_id and a WRONG household_id:
--   SELECT public.submit_rsvps('[{"guest_id":"<real-guest>","household_id":"<wrong-household>","attending":true,"meal_choice":"Option A"}]'::jsonb);
--
-- (c) A correct pairing still works (expect {"count": 1}):
--   SELECT public.submit_rsvps('[{"guest_id":"<real-guest>","household_id":"<its-household>","attending":true,"meal_choice":"Option A"}]'::jsonb);
-- =============================================================================
