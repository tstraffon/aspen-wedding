-- =============================================================================
-- Phase 4: Guest List Schema & Lookup API — v0.2 Migration
-- =============================================================================
-- Project:    Aspen Wedding
-- Milestone:  v0.2 — Gated RSVP & Meal Selection
-- Phase:      04 — guest-list-and-api
-- Plan:       04-01
--
-- Applies decisions: D-01 (guests table), D-02 (no email column — defer),
--                    D-03 (rsvps schema delta), D-04 (no FK to guests),
--                    D-06 (GRANT-based access, no RLS),
--                    D-07 (anon SELECT on guests; anon write-only on rsvps),
--                    D-09 (case-insensitive trim lookup semantics),
--                    D-17 (DEV SEED gated; CSV import is the production path),
--                    D-19 (gen_random_uuid helper for household_id generation).
--
-- How to apply:
--   1. Open Supabase Studio → SQL Editor → "+ New query"
--   2. Paste this entire file
--   3. Click "Run" (Cmd+Enter on Mac)
--   4. Verify with the queries in 04-01-PLAN.md Task 2 Steps 3-10
--
-- Idempotent: every statement uses IF NOT EXISTS / IF EXISTS / DROP IF EXISTS /
-- CREATE OR REPLACE. Safe to re-apply.
--
-- Security model (carried forward from Phase 1 — see 01-01-SUMMARY.md
-- "Plan Deviations #1"): no RLS on either table; access is enforced by the
-- Postgres GRANT layer. Anon has SELECT on guests (lookup gate) and
-- INSERT/UPDATE on rsvps (write-only); anon never reads rsvps.
--
-- DEV SEED block at the bottom is COMMENTED OUT BY DEFAULT. Uncomment in
-- Studio only (never in the repo file). Phase 7's runbook covers cleanup
-- before real invitations go out.
-- =============================================================================


-- ============================================================
-- 1. CREATE TABLE guests (D-01)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.guests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL,
  full_name    text NOT NULL,
  created_at   timestamptz DEFAULT now()
);

-- Functional index on lower(trim(full_name)) — enables the case-insensitive
-- trim lookup (D-09) without a sequential scan. The lookup_guest_by_name()
-- function below is written so the planner engages this index.
CREATE INDEX IF NOT EXISTS guests_full_name_lower_idx
  ON public.guests (lower(trim(full_name)));

-- Index on household_id — enables fast "fetch all members of this household"
-- which Plan 04-02's lookup route performs as its second query (D-11).
CREATE INDEX IF NOT EXISTS guests_household_id_idx
  ON public.guests (household_id);


-- ============================================================
-- 2. ALTER TABLE rsvps — schema delta (D-03)
-- ============================================================
-- ADD: nullable v0.2 columns (backward compat with v0.1 NULL rows per D-05)
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS household_id uuid;
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS guest_id     uuid;
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS meal_choice  text;

-- DROP: guest_count is no longer meaningful when household size is
-- server-defined (the lookup endpoint returns the full household).
ALTER TABLE public.rsvps DROP COLUMN IF EXISTS guest_count;

-- RELAX: v0.2 upserts identify guests by guest_id (uuid), not full_name + email.
-- The submit route's payload omits full_name and email entirely — and CONTEXT D-02
-- explicitly skipped adding email to guests. Dropping NOT NULL on these v0.1
-- columns lets v0.2 rsvps rows coexist with v0.1 rows (which still have data in
-- these columns). Discovered post-Wave-2 dispatch: original SCHEMA.sql kept the
-- columns per D-03 but didn't realize the v0.2 upsert path would NULL them.
ALTER TABLE public.rsvps ALTER COLUMN full_name DROP NOT NULL;
ALTER TABLE public.rsvps ALTER COLUMN email     DROP NOT NULL;

-- Partial unique index on guest_id — lets v0.1 NULL rows coexist while
-- enforcing one rsvp per guest going forward. Plan 04-03's submit route
-- relies on this for its upsert: .upsert(rows, { onConflict: "guest_id" }).
CREATE UNIQUE INDEX IF NOT EXISTS rsvps_guest_id_uniq
  ON public.rsvps (guest_id) WHERE guest_id IS NOT NULL;

-- NOTE: No FK constraint on rsvps.guest_id → guests.id (D-04). Trade-off
-- accepted: cleaner backward compat with v0.1 rows + flexibility if the
-- guests table is re-imported with new UUIDs. Tyler controls the guests
-- table and won't delete people post-RSVP.

-- NOTE: No CHECK constraint on rsvps.meal_choice. The meal enum lives at
-- the app layer (CONTEXT Claude's Discretion) so Phase 6 can swap the
-- enum with a one-line code change when MEAL-02 lands.


-- ============================================================
-- 3. GRANT layer — carry forward Phase 1 pattern (D-06, D-07)
-- ============================================================
-- CRITICAL: Supabase enables Row-Level Security by default on every new public
-- table via the dashboard. With RLS enabled and no policies, anon receives a
-- SILENT empty-array response on SELECT (HTTP 200, body []) — NOT an error.
-- Phase 1 documented this same quirk for rsvps and disabled RLS there. We
-- carry forward the same pattern: GRANT-based access, RLS disabled. Without
-- this DISABLE, the lookup_guest_by_name() RPC returns empty even when rows
-- exist, because the inner SELECT runs under the caller's (anon's) RLS context.
ALTER TABLE public.guests DISABLE ROW LEVEL SECURITY;

-- guests: anon reads ONLY (lookup gate), authenticated full access (Tyler in Studio).
-- IMPORTANT: Supabase's default also grants anon ALL privileges on new public tables.
-- The REVOKE below strips DELETE/INSERT/UPDATE/REFERENCES/TRIGGER/TRUNCATE before
-- granting just SELECT — same posture Phase 1 used for rsvps. Without this REVOKE,
-- anon could DELETE the entire guest list via the Supabase REST API.
REVOKE ALL    ON public.guests FROM anon;
GRANT  SELECT ON public.guests TO anon;
GRANT  ALL    ON public.guests TO authenticated;

-- rsvps: re-state Phase 1's GRANT matrix. Table-level grants cover ALTERed
-- columns automatically, but re-stating documents the intended posture and
-- guards against any silent regression during the migration.
GRANT INSERT, UPDATE ON public.rsvps TO anon;
REVOKE SELECT        ON public.rsvps FROM anon;
GRANT ALL            ON public.rsvps TO authenticated;

-- NOTE: No RLS enabled on either table (D-06). Phase 1 hit a Supabase quirk
-- where anon was denied even by PERMISSIVE policies under SET LOCAL ROLE
-- anon (see 01-01-SUMMARY.md "Plan Deviations #1"). GRANT-only is the
-- canonical security boundary for this project.


-- ============================================================
-- 4. Lookup function (W-2 fix) — public.lookup_guest_by_name(p_name text)
-- ============================================================
-- Plan 04-02's lookup route calls this via supabase.rpc('lookup_guest_by_name',
-- { p_name }). Commits to a single implementation path — no .ilike fallback in
-- the JS layer.
--
-- STABLE: no side effects, can be inlined into query plans → planner engages
--         guests_full_name_lower_idx.
-- LANGUAGE sql (not plpgsql): single SELECT, planner can fold it into the
--         caller's query rather than wrapping it in a procedural call.
-- NOT SECURITY DEFINER: runs as caller (anon), which already has SELECT on
--         guests via the GRANT above. Adding SECURITY DEFINER would be
--         unnecessary privilege escalation.
-- Trim is applied symmetrically on both sides of `=` so the comparison
-- matches the index's lower(trim(full_name)) expression exactly (D-09).
CREATE OR REPLACE FUNCTION public.lookup_guest_by_name(p_name text)
RETURNS TABLE (id uuid, household_id uuid, full_name text)
LANGUAGE sql STABLE
AS $$
  SELECT id, household_id, full_name
  FROM public.guests
  WHERE lower(trim(full_name)) = lower(trim(p_name))
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.lookup_guest_by_name(text) TO anon;


-- ============================================================
-- 5. Helper for Tyler's household_id generation (D-19)
-- ============================================================
-- Tyler runs this once per household when building the guest list in
-- Sheets/Excel/Numbers, then pastes the resulting UUID into every row of
-- that household's `household_id` column. Phase 7's runbook lifts this
-- workflow into the human-facing handoff doc.
--
-- Usage (paste into Studio SQL Editor, one run per household):
--   SELECT gen_random_uuid();
--
-- Copy the returned uuid → paste into the household_id cell for every
-- member of that household in your CSV → repeat per household → Studio
-- Table Editor → guests → Insert → Import from CSV (D-17).


-- ============================================================
-- 6. DEV SEED — DO NOT RUN IN PROD
-- ============================================================
-- This block is comment-out by default in the repo file. To run it,
-- uncomment in Studio only (never commit uncommented). Phase 7's runbook
-- includes the truncation steps to clear these test households before
-- real invitations go out.
--
-- Two Sarahs in DIFFERENT households are intentional: they prove D-10's
-- no-fuzzy-matching policy — a strict lower(trim(...)) match must NOT
-- collapse them. Tyler & Emily share household 1111... to exercise the
-- multi-guest-per-household path that Plan 04-03's submit route relies on.
--
-- INSERT INTO public.guests (household_id, full_name) VALUES
--   ('11111111-1111-1111-1111-111111111111', 'Tyler Straffon'),
--   ('11111111-1111-1111-1111-111111111111', 'Emily Riley'),
--   ('22222222-2222-2222-2222-222222222222', 'Sarah Else'),
--   ('33333333-3333-3333-3333-333333333333', 'Sarah Horan');


-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
