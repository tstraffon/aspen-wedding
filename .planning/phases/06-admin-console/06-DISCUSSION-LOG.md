# Phase 6: Admin Console — Discussion Log

**Date:** 2026-06-30
**Mode:** discuss (batched — 4 decisions in one pass)

Human-reference only. Not consumed by downstream agents (researcher/planner/executor
read 06-CONTEXT.md).

## Pre-discussion: roadmap surgery

The admin console was inserted as Phase 6 (group form renumbered to Phase 7; the former
thin Phase 7 "Tyler-Facing Handoff" folded in). ROADMAP.md, REQUIREMENTS.md (ADMIN-01..05,
coverage 16/16), and STATE.md updated. v0.2's "no built-in admin UI" out-of-scope decision
was explicitly reversed.

## Areas discussed

### 1. Admin authentication
- **Options:** (a) separate admin passphrase + own cookie, (b) Supabase Auth + 2-email
  allowlist, (c) Vercel password protection.
- **Selected:** (a) separate passphrase + own cookie.
- **Notes:** Lightest; mirrors the existing `proxy.ts` + `/login` pattern. The shared guest
  `session` cookie must not grant admin → distinct `admin_session` cookie + `ADMIN_ACCESS_CODE`.
  → D-01..D-04.

### 2. Privileged data path (anon has no SELECT on rsvps)
- **Options:** (a) service-role key server-only, (b) admin SECURITY DEFINER RPCs,
  (c) Supabase Auth + RLS.
- **Selected:** (a) service-role key, server-only.
- **Notes:** Deliberate admin-scoped reversal of the Phase 1/4 "no service-role" posture,
  justified by the admin gate. Separate server-only client; never shipped to the browser.
  New env var `SUPABASE_SERVICE_ROLE_KEY`. → D-05..D-07.

### 3. Guest edit + household regrouping UX
- **Options:** (a) inline editing in the households list, (b) per-household edit pages.
- **Selected:** (a) inline list editing.
- **Notes:** Fast for validating 75 households. Move via household picker; merge = reassign
  household_id; split = new household. Deleting a guest with an existing RSVP confirms +
  cascades the rsvp row (no DB FK, so done server-side). → D-08..D-10.

### 4. RSVP view + export
- **Options:** (a) grouped-by-household + summary card + two CSVs, (b) flat per-guest table
  + one combined CSV.
- **Selected:** (a) grouped + summary + two CSVs.
- **Notes:** Guest-list CSV matches the import format for round-trip. Meal-count summary uses
  `lib/rsvp/meal-options.ts`. Empty state renders cleanly. → D-11..D-13.

## Claude's discretion
Admin route layout (one page w/ tabs vs separate routes), Route Handlers vs Server Actions,
visual polish (internal tool), live-refresh vs manual reload. See CONTEXT "Claude's Discretion".

## Deferred
Per-person identity/audit log, RSVP cutoff (CUTOFF-01), email confirmations (EMAIL-01),
realtime updates.
