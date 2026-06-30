---
phase: 06-admin-console
plan: "04"
subsystem: admin-reporting
tags: [admin, rsvp-view, csv-export, meal-summary, security]
dependency_graph:
  requires: [06-01]
  provides: [admin-rsvp-view, guest-csv-export, rsvp-csv-export]
  affects: [app/(admin)/admin/rsvps, app/api/admin/export]
tech_stack:
  added: []
  patterns: [Server Component direct DB read, RFC-4180 CSV via new Response, admin_session PRIMARY authz, MEAL_OPTIONS single source of truth]
key_files:
  created:
    - app/(admin)/admin/rsvps/page.tsx
    - app/api/admin/export/guests/route.ts
    - app/api/admin/export/rsvps/route.ts
  modified: []
decisions:
  - MEAL_OPTIONS from lib/rsvp/meal-options.ts used exclusively for meal-count summary keys (D-13)
  - Guest name join performed in-JS (no DB FK between rsvps and guests)
  - Both CSV routes use new Response(csv) not NextResponse.json (Non-UI Response pattern)
  - toRfc4180Field wraps boolean attending field as string for CSV safety
metrics:
  duration: ~10min
  completed: "2026-06-30T17:54:35Z"
  tasks_completed: 3
  tasks_total: 3
  files_created: 3
  files_modified: 0
---

# Phase 06 Plan 04: RSVP Reporting + CSV Exports Summary

## One-liner

RSVP admin view grouped by household with MEAL_OPTIONS-keyed meal counts, plus two admin-gated CSV export routes with RFC-4180 formula-injection-safe quoting.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | RSVP view page + meal-count summary | a54d17c | app/(admin)/admin/rsvps/page.tsx |
| 2 | Guest-list CSV export route | 0b722d5 | app/api/admin/export/guests/route.ts |
| 3 | RSVP CSV export route | 761f929 | app/api/admin/export/rsvps/route.ts |

## What Was Built

**Task 1 — /admin/rsvps page:**
Async Server Component reads `rsvps` and `guests` tables via `supabaseAdmin`, joins guest names in-JS by `guest_id`. Builds a meal-count summary card initialized from `MEAL_OPTIONS` (the single source of truth — no hardcoded meal labels). Counts only `attending === true` rows. Collects dietary restriction notes from attending members. Groups all submissions by household with per-member attending status and meal choice. Renders a clean empty state with zero submissions. Toolbar anchors link to both CSV export routes triggering attachment downloads.

**Task 2 — /api/admin/export/guests:**
GET route verifying `admin_session` cookie (401 if absent). `toRfc4180Field` helper wraps every value in double-quotes and escapes internal `"` as `""`, neutralizing `=`/`+`/`-`/`@` formula injection. Header row is exactly `household_id,full_name` matching the import format for clean round-trip. Returns `new Response(csv)` with `text/csv; charset=utf-8` + `Content-Disposition: attachment; filename="guests.csv"`.

**Task 3 — /api/admin/export/rsvps:**
Same structure as Task 2. Fetches both `rsvps` and `guests` tables, joins by `guest_id` in-JS. Columns: `name, household_id, attending, meal_choice, dietary_restrictions`. Boolean `attending` field converted to string via the `toRfc4180Field` helper. Returns `text/csv` + `Content-Disposition: attachment; filename="rsvps.csv"`.

## Decisions Made

- MEAL_OPTIONS import from `@/lib/rsvp/meal-options` used to initialize `mealCounts` — keys are always in sync with the form and server validation (D-13)
- Guest-name resolution done in-JS via a Map keyed by `guest_id` (no DB FK, consistent with schema design from Phase 4 D-04)
- `new Response(csv, { headers })` used for both export routes per the Non-UI Responses pattern in `node_modules/next/dist/docs/.../route.md`
- `toRfc4180Field` in the RSVP export accepts `string | boolean | null | undefined` so the boolean `attending` column is safely stringified and quoted

## Deviations from Plan

None — plan executed exactly as written.

## Security Coverage

| Threat ID | Status | Implementation |
|-----------|--------|----------------|
| T-06-12 (formula injection) | Mitigated | `toRfc4180Field` wraps every field in double-quotes on both routes |
| T-06-13 (elevation of privilege) | Mitigated | `admin_session` 401 check at top of both export routes; rsvps page reads only via service-role server-side |
| T-06-14 (info disclosure) | Mitigated | Sanitized 5xx responses — no PostgREST fragments returned |
| T-06-15 (meal-count tampering) | Mitigated | Counts keyed from MEAL_OPTIONS, filtered to `attending === true` only |

## Known Stubs

None — all data is live from supabaseAdmin; empty state is rendered explicitly (not a stub).

## Threat Flags

None — no new network endpoints or auth paths beyond those in the plan's threat model.

## Self-Check: PASSED

- app/(admin)/admin/rsvps/page.tsx: FOUND (commit a54d17c)
- app/api/admin/export/guests/route.ts: FOUND (commit 0b722d5)
- app/api/admin/export/rsvps/route.ts: FOUND (commit 761f929)
- `npm run build` and `npm run lint` both pass (0 errors)
- MEAL_OPTIONS imported and used to key mealCounts in rsvps page
- admin_session 401 check present in both export routes
- Header household_id,full_name confirmed in guests route
- new Response + text/csv + Content-Disposition confirmed in both routes
