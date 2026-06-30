---
phase: 06-admin-console
plan: "05"
subsystem: admin-runbook
tags: [admin, runbook, smoke, operator, csv-import, meal-report]
dependency_graph:
  requires: [06-01, 06-02, 06-03, 06-04]
  provides: [operator-runbook, e2e-smoke-checklist]
  affects: [.planning/phases/06-admin-console/RUNBOOK.md]
tech_stack:
  added: []
  patterns: [operator runbook, end-to-end smoke checklist]
key_files:
  created:
    - .planning/phases/06-admin-console/RUNBOOK.md
  modified: []
decisions:
  - Logout link in admin layout has no backend route — documented as workaround (clear admin_session cookie) rather than auto-fixing; Phase 6 scope is runbook only
  - RSVP seeding for smoke Leg 4 documented via Supabase Studio direct insert (guest form is Phase 7)
  - Smoke Leg 3 cascade-delete test deferred to after Leg 4 seed so there is an RSVP row to verify
metrics:
  duration: ~10min
  completed: "2026-06-30T19:19:00Z"
  tasks_completed: 1
  tasks_total: 2
  files_created: 1
  files_modified: 0
---

# Phase 06 Plan 05: Operator Runbook + E2E Smoke Summary

## One-liner

Operator runbook covering env setup, guests-import.csv Studio import, household regroup ops, meal-count reading, and CSV exports — plus a 5-leg end-to-end smoke checklist for Tyler to run.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Write the operator runbook | ec64fb1 | .planning/phases/06-admin-console/RUNBOOK.md |

## Tasks Pending

| Task | Name | Status |
|------|------|--------|
| 2 | Execute end-to-end smoke | Awaiting human-verify — Tyler must run the 5-leg checklist |

## What Was Built

**RUNBOOK.md** — 10-section operator reference covering:

1. Env setup: `ADMIN_ACCESS_CODE` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` and Vercel; RLS-disabled prerequisite.
2. CSV import: Studio import of `.planning/guests-import.csv` (138 guests / 75 households, `household_id,full_name` format); swap procedure (delete rsvps -> delete guests -> reimport).
3. Households validation: count check (75/138), known edge rows (Veeck Sr./Jr., two "And Guest" plus-ones).
4. Fix-a-household: inline rename, move (with UUID sourcing from Studio), household split/merge, add person, cascade delete.
5. Meal-count report: how to read the summary card at `/admin/rsvps` and the dietary notes list.
6. Exports: `guests.csv` (re-importable format) and `rsvps.csv` from the toolbar on `/admin/rsvps`.
7. Admin login flow: `admin_session` cookie, 90-day TTL, guest code rejection, logout workaround.
8. Meal menu label update: edit `lib/rsvp/meal-options.ts` as the single source of truth.
9. Troubleshooting table: 7 symptom/cause/fix rows.
10. End-to-end smoke checklist (5 legs, Task 2).

## Decisions Made

- The admin layout's Logout nav link (`/api/admin/auth/logout`) has no backend handler — not implemented in Phase 6. Documented as a known gap with the clear-cookies workaround. Out of scope for this plan.
- RSVP seeding for smoke Leg 4 uses Supabase Studio direct insert rather than curl (the submit endpoint requires a guest `session` cookie from the SITE_ACCESS_CODE gate; Studio is simpler and equally valid for smoke purposes).

## Deviations from Plan

### Out-of-scope discoveries (logged, not fixed)

**1. [Deferred] Logout route not implemented**
- Found during: Task 1 runbook writing
- Issue: `app/(admin)/admin/layout.tsx` links to `/api/admin/auth/logout` but no `route.ts` handler exists for that path. Clicking Logout from the admin nav will 404.
- Action: Documented workaround in Section 7 of the runbook (clear `admin_session` cookie via browser DevTools). Not auto-fixed — outside Phase 6 task scope.
- Logged to: deferred-items.md (candidate for Phase 7 or a standalone fix)

## Auth Gates

None — all Phase 6 plans authenticated manually during development. Env vars must be set before smoke.

## Known Stubs

None in RUNBOOK.md — all routes, file paths, env var names, and procedures reference shipped code.

## Threat Flags

None — no new network endpoints, auth paths, or schema changes in this plan.

## Self-Check: PASSED

- .planning/phases/06-admin-console/RUNBOOK.md: FOUND (commit ec64fb1)
- References `guests-import.csv`: confirmed
- References `ADMIN_ACCESS_CODE`: confirmed (multiple sections)
- References `SUPABASE_SERVICE_ROLE_KEY`: confirmed (Section 1 + troubleshooting)
- References `lib/rsvp/meal-options.ts`: confirmed (Section 5 + Section 8)
- Contains all required sections: env setup, CSV import, regroup, meal-count, export, troubleshooting, smoke checklist

## Phase 6 Status

- Task 2 (end-to-end smoke) is a `checkpoint:human-verify` gate.
- ROADMAP Phase 6 remains **In Progress** until Tyler confirms smoke results.
- STATE.md updated to reflect: runbook written, smoke pending user verification.
