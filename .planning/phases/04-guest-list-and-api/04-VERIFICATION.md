---
phase: 04-guest-list-and-api
verified: 2026-06-01T00:00:00Z
status: passed
score: 5/5 must-haves verified
overrides_applied: 0
verdict: PASS
---

# Phase 4: Guest List Schema & Lookup API — Verification Report

**Phase Goal:** Database and server endpoints can answer "is this name on the list?" and "save this household's RSVPs atomically."

**Verified:** 2026-06-01
**Status:** PASS
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (Roadmap Success Criteria)

| # | Truth (Roadmap SC) | Status | Evidence |
|---|---|---|---|
| 1 | Tyler can insert a guest row in Studio and see it via `curl POST /api/rsvp/lookup` with the exact name | VERIFIED | `guests` table created in `SCHEMA.sql:40-45`; lookup route `lookup/route.ts:51-100` reads via `lookup_guest_by_name` RPC; Smoke #1/#2 in 04-02-SUMMARY confirmed Tyler Straffon hit returns full household |
| 2 | Lookup miss returns `{ found: false }` HTTP 200 (not 404) | VERIFIED | `lookup/route.ts:68-71` returns `NextResponse.json({ found: false })` with default 200; Smoke #4 confirmed |
| 3 | POST submit with N members writes N rows in one round-trip; re-submit updates in place | VERIFIED | `submit/route.ts:175-177` calls `submit_rsvps(p_rows)` RPC which runs single `INSERT ... ON CONFLICT (guest_id) DO UPDATE` (SCHEMA.sql:174-186); Smoke #1 (count=2) + Smoke #2 (idempotent re-submit returns count=2 with no duplicate rows) verified |
| 4 | `rsvps` no longer has `guest_count`; does have `household_id`, `guest_id`, `meal_choice` | VERIFIED | SCHEMA.sql:63-69 — three ADDs + one DROP; Plan 04-01 Studio Query 3 confirmed |
| 5 | Anon can SELECT guests, INSERT/UPDATE rsvps; cannot SELECT rsvps | VERIFIED | SCHEMA.sql:114-136: `DISABLE RLS`, `REVOKE ALL FROM anon` then `GRANT SELECT` on guests; `GRANT INSERT,UPDATE` + `REVOKE SELECT` on rsvps; Plan 04-01 Query 5 verified the GRANT matrix in Studio |

**Score:** 5/5 truths verified

---

## Per-REQ-ID Status

| REQ-ID | Description | Status | Evidence |
|---|---|---|---|
| GUEST-01 | `guests` table exists with documented shape; Tyler populates via Studio CSV import | PASS | `SCHEMA.sql:40-56` creates table with id/household_id/full_name/created_at + indexes; D-17 documents the Studio CSV import path; D-19 ships the `gen_random_uuid()` helper. Phase 7's runbook is operational polish, not a missing requirement. |
| GUEST-04 | Lookup endpoint returns full household on hit | PASS | `lookup/route.ts:76-99` — second query fetches all household members; returns `{found:true, household_id, members:[{guest_id, full_name},...]}`; Smoke #1 confirmed Emily+Tyler both returned |
| GROUP-02 | Submit writes one row per household member in single atomic operation | PASS | `submit_rsvps(p_rows)` (SCHEMA.sql:167-190) is a single SQL statement: `INSERT ... SELECT FROM jsonb_array_elements(...) ON CONFLICT DO UPDATE`. Statement-level atomicity is the Postgres guarantee. Smoke #9 verified zero partial writes on intra-payload duplicate guest_id (Studio confirmed 0 rows in household 3333 post-failure). |
| GROUP-03 | Submit is upsert by guest_id (re-submission updates in place) | PASS | `rsvps_guest_id_uniq UNIQUE (guest_id)` constraint (SCHEMA.sql:92) + ON CONFLICT clause; Smoke #2 (idempotency) and Smoke #3 (Tyler attending=false update) both returned `count=2` with no duplicate rows |
| MEAL-03 | `meal_choice` column on rsvps; written by submit endpoint | PASS | Column added in SCHEMA.sql:65; submit route writes it conditionally on `attending` (submit/route.ts:158); Studio query post-Smoke-#3 confirmed `Emily.meal_choice = 'chicken'`, `Tyler.meal_choice = NULL` (correctly null-on-decline) |

---

## Per-D-ID Status

| D-ID | Decision | Status | Evidence |
|---|---|---|---|
| D-01 | guests table with documented columns + 2 indexes | PASS | SCHEMA.sql:40-56 — columns + `guests_full_name_lower_idx` + `guests_household_id_idx` |
| D-02 | No `email` column on guests | PASS | SCHEMA.sql guests definition has no email; deferred per CONTEXT |
| D-03 | rsvps schema delta (add 3, drop guest_count, keep 5) | PASS | SCHEMA.sql:63-69 — ADD household_id/guest_id/meal_choice; DROP guest_count |
| D-04 | No FK on rsvps.guest_id → guests.id | PASS | SCHEMA.sql:94-97 — explicit `NOTE: No FK constraint`; substitute pre-flight authz in submit/route.ts:122-147 |
| D-05 | v0.1 backward compat via nullable v0.2 columns | PASS | New columns added nullable; SCHEMA.sql amendment also relaxed NOT NULL on v0.1 columns (full_name/email) so v0.2 upserts coexist |
| D-06 | No RLS — Phase 1 GRANT pattern | PASS+AMENDED | SCHEMA.sql:114 now explicitly `ALTER TABLE public.guests DISABLE ROW LEVEL SECURITY` (mid-phase amendment #1). rsvps RLS off from Phase 1. Plan 04-01 amendment documents the discovery + fix. |
| D-07 | GRANT layer (anon SELECT guests, INSERT/UPDATE rsvps, REVOKE SELECT rsvps) | PASS+AMENDED | SCHEMA.sql:121-136 — full matrix encoded. Amendment #2: `REVOKE ALL ON public.guests FROM anon` precedes `GRANT SELECT` to strip Supabase's default ALL grant. Plan 04-01 Studio Query 5 verified. |
| D-08 | No SITE_ACCESS_CODE changes | PASS | No `proxy.ts` or env changes in commits this phase; Smoke #0 (both routes) confirmed 307 redirect to /login for unauthed requests |
| D-09 | Strict case-insensitive trim match via `lower(trim(full_name)) = lower(trim($1))` | PASS | `lookup_guest_by_name` function (SCHEMA.sql:219-227) applies symmetric `lower(trim(...))`. Index `guests_full_name_lower_idx` matches the expression. Smoke #2 confirmed `"  TYLER STRAFFON  "` normalizes to match. |
| D-10 | No fuzzy matching | PASS | Function uses `=` not `ILIKE`/trigram. Smokes #3/#3b confirmed Sarah Else vs Sarah Horan disambiguate correctly. |
| D-11 | Lookup returns full household on hit, `{found:false}` HTTP 200 on miss | PASS | lookup/route.ts:68-99 implements both paths exactly |
| D-12 | Oracle risk accepted (no rate limit, no CAPTCHA) | PASS | No rate-limit code, no CAPTCHA dependency; documented in route comments |
| D-13 | Sanitized 5xx responses (no PostgREST leakage) | PASS | Both routes return generic `{ error: "Something went wrong. Please try again." }` (lookup:62-65, submit:179-191); errors are `console.error`-logged only. Smoke #8 spot-checked zero PostgREST/hint/details/code leakage in 4xx bodies. |
| D-14 | API contracts (POST routes, response shapes) | PASS | Both routes match spec. lookup: `{name}` → `{found, household_id, members}` or `{found:false}`. submit: `{household_id, submissions[...]}` → `{success, count}`. |
| D-15 | Batched upsert via `onConflict:guest_id` | PASS+REVISED | Amendment #6: route refactored from `.upsert()` to `.rpc("submit_rsvps",...)` because anon lacks SELECT on rsvps (PG INSERT...ON CONFLICT requires SELECT on conflict-target column). Function (SCHEMA.sql:167-190) preserves the batched upsert semantics inside a SECURITY DEFINER wrapper. Statement-level atomicity preserved (single INSERT...ON CONFLICT statement). Smoke #9 verified zero partial writes. The contract from D-15 (idempotent batched upsert keyed on guest_id) is preserved; the implementation path is revised. |
| D-16 | `app/(main)/api/rsvp/route.ts` UNMODIFIED | PASS | `git diff 9db3953 -- app/(main)/api/rsvp/route.ts` returns empty. Last touching commit is Phase 1's `9db3953`. |
| D-17 | CSV import via Supabase Studio | PASS (documentary) | Documented in SCHEMA.sql + DEV-SEED-IDS.md + 04-CONTEXT.md. Operational walkthrough is Phase 7's deliverable per D-18. |
| D-18 | Phase 7 ships runbook | DEFERRED (Phase 7) | Out of Phase 4 scope by design |
| D-19 | gen_random_uuid helper snippet | PASS | SCHEMA.sql:232-245 — usage block + comment |

---

## Mid-Phase Amendments — Encoding Verification

| # | Amendment | Encoded? | Evidence |
|---|---|---|---|
| 1 | `ALTER TABLE public.guests DISABLE ROW LEVEL SECURITY` | YES | SCHEMA.sql:114 |
| 2 | `REVOKE ALL ON public.guests FROM anon` before `GRANT SELECT` | YES | SCHEMA.sql:121-122 (REVOKE precedes GRANT) |
| 3 | Relax NOT NULL on rsvps.full_name + rsvps.email | YES | SCHEMA.sql:77-78 |
| 4 | Swap partial unique index for plain UNIQUE constraint on rsvps.guest_id | YES | SCHEMA.sql:91-92 — `DROP CONSTRAINT IF EXISTS rsvps_guest_id_uniq` then `ADD CONSTRAINT rsvps_guest_id_uniq UNIQUE (guest_id)`. Comments (SCHEMA.sql:85-90) explain the PostgREST/42P10 motivation. |
| 5 | Add SECURITY DEFINER function `submit_rsvps(p_rows jsonb)` + EXECUTE grants | YES | SCHEMA.sql:167-195 — function definition + `REVOKE ALL FROM public/anon` + `GRANT EXECUTE TO anon/authenticated` |
| 6 | Submit route refactored from `.upsert()` to `.rpc("submit_rsvps",...)` | YES | submit/route.ts:175-177 — `supabase.rpc("submit_rsvps", { p_rows: rows })`. Inline comments (submit/route.ts:167-174) document the asymmetric privilege rationale. |

All 6 amendments are encoded correctly in the live artifacts.

---

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|---|---|---|---|
| Lookup route exists + exports POST | `grep "export async function POST" app/(main)/api/rsvp/lookup/route.ts` | line 29 | PASS |
| Submit route exists + exports POST | `grep "export async function POST" app/(main)/api/rsvp/submit/route.ts` | line 45 | PASS |
| v0.1 route unchanged since Phase 1 | `git diff 9db3953 -- "app/(main)/api/rsvp/route.ts"` | empty diff | PASS |
| TypeScript clean | `npx tsc --noEmit` | exit 0, no output | PASS |
| ESLint baseline preserved | `npm run lint` | 4 errors / 21 warnings (all in pre-Phase-4 files: itinerary, faq, page.tsx, layout, travel, things-to-do) | PASS |

Note: end-to-end smokes (lookup 7/7, submit 9/9 including atomicity #9) were executed by the Wave 2 plan executors and documented in 04-02-SUMMARY + 04-03-SUMMARY amendments. Re-running them requires a live dev server + Supabase auth; per the task brief, smokes do not need re-execution.

---

## Smoke Evidence Cross-Check (SUMMARYs vs actual code)

**Lookup endpoint (Plan 04-02 smokes):**
- Smoke #1 (Tyler Straffon, household 1111, 2 members returned): the lookup route fetches the matched guest via `lookup_guest_by_name` (line 57-58), then queries all members via `.from("guests").select("id, full_name").eq("household_id", ...)` (lines 76-80) and maps to `{guest_id, full_name}` (lines 90-93). Behavior matches.
- Smoke #2 (`"  TYLER STRAFFON  "` normalizes): trimming happens at the JS layer (line 53) AND inside the RPC function via `lower(trim(...))` symmetry — SCHEMA.sql:225. Both layers match D-09.
- Smoke #3/#3b (Sarah Else / Sarah Horan disambiguate): function uses strict `=` (SCHEMA.sql:225); no fuzzy match. Matches D-10.
- Smoke #4 (miss → `{found:false}` HTTP 200): lookup/route.ts:68-71. Matches.
- Smoke #5/#6 (empty body / empty name → 400): lookup/route.ts:33-38. Matches.

**Submit endpoint (Plan 04-03 amendment — all 9 PASS):**
- Smoke #0 (proxy 307): inherits SITE_ACCESS_CODE proxy; no per-route config.
- Smoke #1 (Tyler+Emily, count=2): submit/route.ts:175-193. Matches.
- Smoke #2 (idempotency): UNIQUE(guest_id) + ON CONFLICT DO UPDATE — re-submit updates same rows. SCHEMA.sql:92, 182-186. Matches.
- Smoke #3 (update Tyler attending=false): same upsert mechanism; meal_choice nulled when attending=false via the CASE expression (SCHEMA.sql:179). Studio confirms Tyler.meal_choice=NULL post-update.
- Smoke #4/#5 (attending no meal / invalid meal): submit/route.ts:93-103 — MEAL_ENUM check. Matches.
- Smoke #6 (cross-household authz): submit/route.ts:135-147 — pre-flight `validIds` set + `every()` check. Matches D-04.
- Smoke #7 (bad uuid): submit/route.ts:63-69. Matches.
- Smoke #8 (empty body): submit/route.ts:47-55. Matches.
- Smoke #9 (atomicity, duplicate guest_id): the function (SCHEMA.sql:174-186) does ONE INSERT...ON CONFLICT statement; Postgres raises 21000 when a single statement tries to UPDATE the same conflict-target row twice → entire statement rolls back → zero rows written to household 3333 (verified in Studio per 04-03 amendment).

The verified rsvps state in 04-01-SUMMARY (household 1111 = 2 rows with documented values; household 3333 = 0 rows) is consistent with the smoke sequence and the code paths above.

---

## Anti-Patterns Found

None in Phase 4 deliverables.

Scanned files: `SCHEMA.sql`, `app/(main)/api/rsvp/lookup/route.ts`, `app/(main)/api/rsvp/submit/route.ts`.

- No `TBD`/`FIXME`/`XXX` debt markers
- No `TODO`/`HACK`/`PLACEHOLDER` warning markers
- No empty handlers / stub returns
- No PostgREST error leakage in 4xx/5xx response bodies (Plan 04-03 Smoke #8 spot-checked)

Notable: The placeholder meal enum (`["chicken","fish","vegetarian"]` in submit/route.ts:35) is intentional per CONTEXT Claude's Discretion — Phase 6 / MEAL-02 swaps it. Documented in code comments. Not a stub.

---

## Regression Check

| Check | Status | Evidence |
|---|---|---|
| `app/(main)/api/rsvp/route.ts` unchanged since Phase 1 (D-16) | PASS | `git diff 9db3953 -- app/(main)/api/rsvp/route.ts` → empty |
| Pre-existing uncommitted UI changes (rsvp/page.tsx, registry/page.tsx) | IGNORED | Per task brief — user's earlier-session edits, not Phase 4 work |
| Phase 1 GRANT pattern on rsvps preserved | PASS | SCHEMA.sql:134-136 re-states `GRANT INSERT,UPDATE` + `REVOKE SELECT` on rsvps from anon |
| v0.1 rsvps rows still coexist | PASS | New columns added nullable; legacy NOT NULL on full_name/email relaxed (Amendment #3); v0.1 rows have NULL guest_id which UNIQUE constraint treats as distinct |

---

## Build Gate

| Gate | Expected Baseline | Actual | Status |
|---|---|---|---|
| `npx tsc --noEmit` | exit 0 | exit 0, no output | PASS |
| `npm run lint` | 4 errors (itinerary), 21 warnings, zero new from Phase 4 | 4 errors (all `app/(main)/itinerary/page.tsx`), 21 warnings (faq, itinerary x2, page.tsx x14, things-to-do, travel, layout) | PASS |

Zero new errors or warnings introduced by Phase 4 files. The Phase 4 routes (`lookup/route.ts`, `submit/route.ts`) and SCHEMA.sql produce no lint findings.

---

## Outstanding Handoff Items for Phase 5/6/7

These are not Phase 4 gaps — they are explicitly deferred items the SUMMARYs flag for the next phases:

1. **Phase 7 — Tyler's CSV import workflow (D-17 / D-18):** SCHEMA.sql + DEV-SEED-IDS.md document the data shape. Phase 7's runbook must spell out the exact Studio click-path (Table Editor → guests → Insert → Import from CSV), the household_id pre-generation workflow using `gen_random_uuid()`, and the cleanup commands listed in DEV-SEED-IDS.md lines 32-43.

2. **Phase 7 — Dev-seed cleanup SQL:** Per 04-01 amendment "Wave 2 verified state" and DEV-SEED-IDS.md "Phase 7 cleanup obligation", before real invitations ship Phase 7 must run:
   ```sql
   DELETE FROM public.rsvps WHERE household_id IN ('11111111-...', '22222222-...', '33333333-...');
   DELETE FROM public.guests WHERE household_id IN ('11111111-...', '22222222-...', '33333333-...');
   ```
   plus delete the orphan probe row from 04-03-SUMMARY Blocking Issues §3:
   ```sql
   DELETE FROM public.rsvps WHERE full_name = 'probe' AND household_id = '99999999-9999-9999-9999-999999999999';
   ```
   (04-03 amendment notes the probe may have been cleaned up via the existing `__schema_verify_delete_me__` sweep; Phase 7 should verify before / re-run if needed.)

3. **Phase 5/6 — SECURITY DEFINER pattern decision (informational):** Phase 4 introduced one asymmetric pattern: lookup uses a non-DEFINER function (anon has SELECT on guests, no privilege escalation needed); submit uses SECURITY DEFINER (anon has no SELECT on rsvps so ON CONFLICT cannot run as caller). Phase 5/6 do not need to add new RPCs — the existing two cover the v0.2 contract — but future phases creating new server-side writes against tables anon cannot read should follow the same pattern (function wrapper + EXECUTE grant + REVOKE PUBLIC/anon ALL on the function) rather than granting anon broader table privileges.

4. **Phase 5 — D-16 cleanup window:** Phase 5's UI swap removes the v0.1 form that calls `/api/rsvp/route.ts`. Phase 5 may delete the route or leave it as inert code. CONTEXT D-16 explicitly defers the decision to Phase 5.

---

## Gaps Summary

None. All 5 roadmap success criteria are met. All 19 D-IDs are honored (D-18 explicitly deferred to Phase 7 by design). All 5 REQ-IDs are satisfied with code + schema evidence. All 6 mid-phase amendments are encoded in the live artifacts. v0.1 route is byte-identical to its Phase 1 baseline. Build gates green at the documented baselines.

The phase delivers exactly what it promised — a `guests` table that anon can read, a `rsvps` schema that v0.2 upserts can hit, two new POST routes that gate by name lookup and write per-household RSVPs atomically — plus six well-documented amendments that emerged from real Supabase / PostgREST behavior (RLS-by-default, default-ALL-to-anon, partial-index/on_conflict mismatch, and the ON-CONFLICT-needs-SELECT privilege constraint).

---

_Verified: 2026-06-01_
_Verifier: Claude (gsd-verifier)_
