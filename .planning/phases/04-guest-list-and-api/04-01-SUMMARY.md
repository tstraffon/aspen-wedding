---
phase: 04-guest-list-and-api
plan: 01
status: complete
date: 2026-06-01
---

# Plan 04-01 Summary — SCHEMA.sql + Studio apply + dev-seed capture

## D-IDs / REQ-IDs satisfied

- **GUEST-01** — `guests` table exists with the documented column shape (`full_name`, `household_id`, `email`-omitted-per-D-02). Tyler can use Supabase Studio's built-in 'Import CSV' button against this table today. Phase 7's runbook is operational polish (the exact Studio click-path, the `gen_random_uuid` helper integration, the cleanup steps) — not a missing requirement.
- **MEAL-03** — `rsvps.meal_choice` column added (text, nullable; constraint at app layer per MEAL-02).
- **D-01** through **D-07**, **D-09**, **D-17**, **D-19** — schema decisions from CONTEXT enacted verbatim in `SCHEMA.sql`.

## Outputs

- `.planning/phases/04-guest-list-and-api/SCHEMA.sql` — migration artifact, 175 lines after the REVOKE patch
- `.planning/phases/04-guest-list-and-api/DEV-SEED-IDS.md` — captured guest UUIDs for Wave 2 fixtures

## Studio apply result

All 10 verification queries ran. **7/8 passed first try; Query 5 surfaced a real security failure that was fixed before Wave 2 unlocked.**

| Query | Verifies | Result |
|---|---|---|
| 1 | `guests` table shape | ✅ 4 columns, correct types, `id` defaults to `gen_random_uuid()` |
| 2 | `guests` indexes | ✅ PK + `lower(trim(full_name))` functional index + `household_id` index |
| 3 | `rsvps` schema delta | ✅ `guest_count` dropped, 3 new nullable columns added (`household_id`, `guest_id`, `meal_choice`); v0.1 columns intact |
| 4 | Partial unique on `rsvps(guest_id)` | ✅ `WHERE (guest_id IS NOT NULL)` present |
| 5 | GRANT matrix | ❌ → ✅ after REVOKE (see "Security failure caught & fixed" below) |
| 6 | Dev seed UUIDs | ✅ 4 rows captured, transcribed to `DEV-SEED-IDS.md` |
| 7 | `gen_random_uuid()` fires | ✅ INSERT returned `7bb51679-…`; cleanup row deleted post-capture |
| 8 | `lookup_guest_by_name('  TYLER STRAFFON  ')` | ✅ Returned Tyler Straffon with `household_id=11111111-…` — proves `lower(trim(...))` symmetry on both sides |

## Security failure caught & fixed

**Bug:** SCHEMA.sql originally contained `GRANT SELECT ON public.guests TO anon` but did not REVOKE the default privileges. Supabase grants anon **full CRUD on new public tables by default**. After the initial migration, Query 5 revealed `anon` had DELETE / INSERT / UPDATE / REFERENCES / TRIGGER / TRUNCATE / SELECT on `guests`. Any guest with the `SITE_ACCESS_CODE` could have wiped the entire guest list via the Supabase REST API (`DELETE /rest/v1/guests`).

**Root cause:** Phase 1 explicitly REVOKE'd anon privileges on `rsvps` before granting INSERT/UPDATE — exactly to avoid this default. Phase 4 SCHEMA.sql forgot to do the same for `guests`. Plan-checker did not catch this because the GRANT verification was a positive-only check (`anon has SELECT`), not a negative-only check (`anon has only SELECT`).

**Fix:**
1. User ran in Studio: `REVOKE DELETE, INSERT, REFERENCES, TRIGGER, TRUNCATE, UPDATE ON public.guests FROM anon;` — restored anon to SELECT-only.
2. Patched SCHEMA.sql to add `REVOKE ALL ON public.guests FROM anon;` *before* the `GRANT SELECT`, with a comment explaining the Supabase default behavior. Future re-applies of SCHEMA.sql are correct by construction.
3. Re-ran Query 5 — confirmed `anon`/`guests` now has SELECT only; `authenticated`/`guests` has full CRUD; `anon`/`rsvps` has INSERT + UPDATE only (Phase 1 REVOKE intact).

**Lesson for Phase 7 / future phases:** GRANT matrix verification must check for the *absence* of privileges, not just the presence. Plan 04-01 Task 2 Step 5 had the right query but ambiguous expectations — should have explicitly listed the forbidden privileges.

## Threat model — actual outcomes

- **T-04-AUTH-BYPASS** (mitigated): the GRANT bug above was a real exploit path, caught at verification, fixed before Wave 2 unlocked. The Supabase REST API + anon key + SITE_ACCESS_CODE = full guest-list DELETE was possible until the REVOKE.
- **T-04-PGCRYPTO-MISSING** (mitigated): Step 9 INSERT returned a real uuid (not null) — `gen_random_uuid()` works on this project without `pgcrypto` patching.
- **T-04-RPC-PRIVILEGE** (mitigated): function is `LANGUAGE sql STABLE`, not `SECURITY DEFINER`; runs with caller's privileges. Query 8 confirmed end-to-end.
- Carry-forward Phase 1 mitigations (sanitized 5xx, no service-role) — not exercised this plan; will be verified in Wave 2's curl smokes.

## Handoff to Wave 2

Plans 04-02 and 04-03 can now run in parallel. Both read `DEV-SEED-IDS.md` to construct fixture payloads:

- **04-02 (lookup route):** smoke against `Tyler Straffon` (household `1111…`), `  TYLER STRAFFON  ` (whitespace + case normalization), `Sarah Else` (disambiguation from Sarah Horan), and a miss case
- **04-03 (submit route):** smoke positive submission for household `1111…`, idempotency re-submission, atomicity proof via duplicate-guest_id payload (using `e3be61dd-…` × 2 against the clean Sarah Horan baseline household `3333…`), and cross-household authz rejection

## Commits in this plan

- `6704469` — `feat(04-01): author SCHEMA.sql v0.2 migration artifact` (initial draft, 174 lines)
- *(this commit)* — `feat(04-01): patch SCHEMA.sql REVOKE + write DEV-SEED-IDS.md + SUMMARY`

## Outstanding pre-Wave-2 cleanup

- User asked to run `DELETE FROM public.guests WHERE full_name = '__schema_verify_delete_me__';` to remove the Step 7 INSERT residue. This row is harmless (orphan household `99999999…` referenced by no rsvps row), but cleaner without it.
