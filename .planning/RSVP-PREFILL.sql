-- =============================================================================
-- RSVP PREFILL — controlled read path for existing household responses
-- =============================================================================
-- Feature: when a guest looks up their household, the form should show the
-- answers already submitted (with a note) so they can edit and resubmit.
--
-- Problem: anon has NO SELECT on public.rsvps (revoked so responses stay
-- private — audit B3 / S1). The lookup route uses the public anon key and
-- therefore cannot read rsvps directly.
--
-- Fix: a SECURITY DEFINER function that returns ONLY the response fields for
-- ONE household_id, granted EXECUTE to anon. This mirrors the submit_rsvps
-- write path: anon never touches the table directly, only a validated function
-- that runs as the table owner.
--
-- Exposure note: any caller who can resolve a household_id (via the name
-- lookup, which already hands out guest_ids) can read that household's
-- attending / meal_choice / dietary_restrictions. Bounded by the site access
-- gate; consistent with the accepted enumeration risk (S3). Household UUIDs are
-- random, so blind enumeration is infeasible.
--
-- How to apply:
--   1. Supabase Studio -> SQL Editor -> "+ New query"
--   2. Paste this entire file
--   3. Run (Cmd+Enter)
--   4. Verify with the checks at the bottom.
--
-- Idempotent: CREATE OR REPLACE + REVOKE/GRANT. Safe to re-run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_household_rsvps(p_household_id uuid)
RETURNS TABLE (
  guest_id             uuid,
  attending            boolean,
  meal_choice          text,
  dietary_restrictions text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT r.guest_id, r.attending, r.meal_choice, r.dietary_restrictions
  FROM public.rsvps r
  WHERE r.household_id = p_household_id
    AND r.guest_id IS NOT NULL;  -- exclude legacy v0.1 rows (NULL guest_id)
$$;

-- Function owner runs the body; anon only executes (no direct table read).
REVOKE ALL    ON FUNCTION public.get_household_rsvps(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_household_rsvps(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_household_rsvps(uuid) TO authenticated;

-- =============================================================================
-- VERIFY (run after applying)
-- =============================================================================
-- (a) anon still has NO direct SELECT on rsvps (expect 0 rows):
--   SELECT privilege_type FROM information_schema.role_table_grants
--   WHERE grantee = 'anon' AND table_name = 'rsvps' AND privilege_type = 'SELECT';
--
-- (b) The function returns a household's responses (expect the rows you
--     submitted for that household; replace with a real household_id):
--   SELECT * FROM public.get_household_rsvps('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
--
-- (c) An unknown household returns zero rows, not an error:
--   SELECT * FROM public.get_household_rsvps('00000000-0000-4000-8000-000000000000');
-- =============================================================================
