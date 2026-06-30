---
phase: 06-admin-console
plan: "03"
subsystem: admin-ui
tags: [admin, households, inline-edit, server-component, client-island]
completed_date: "2026-06-30"
duration_minutes: 25

dependency_graph:
  requires: [06-01, 06-02]
  provides: [admin-households-view, inline-edit-ui]
  affects: [admin-page, guest-lookup]

tech_stack:
  added: []
  patterns:
    - Server Component reads supabaseAdmin, groups guests by household_id in JS, passes to client island
    - Client Component island holds local state; all mutations via fetch to 06-02 Route Handlers
    - window.confirm for D-09 delete confirmation (internal admin tool)
    - crypto.randomUUID() client-side for D-10 household split

key_files:
  created:
    - app/(admin)/admin/page.tsx
    - app/(admin)/admin/HouseholdsTable.tsx
  modified: []

decisions:
  - Stub HouseholdsTable.tsx created in Task 1 to allow page.tsx to build independently; replaced in Task 2
  - HouseholdsTable accepts only `households` prop (flat allGuests derivable via flatMap; not a separate prop)
  - Empty households pruned from local state when last member is removed
  - Move picker option labels truncated at 60 chars to fit select width

metrics:
  completed_tasks: 2
  total_tasks: 2
  files_created: 2
  files_modified: 0
---

# Phase 06 Plan 03: Households Management View Summary

**One-liner:** Server Component groups guests by household_id and passes to a "use client" island with inline rename/add/remove/move backed by the Plan 02 Route Handlers.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Households Server Component page | 55fc03c | app/(admin)/admin/page.tsx, HouseholdsTable.tsx (stub) |
| 2 | HouseholdsTable client island — inline edit + regroup | 359cb94 | app/(admin)/admin/HouseholdsTable.tsx |

## What Was Built

**app/(admin)/admin/page.tsx** — async Server Component (no `"use client"`):
- Reads all guests via `supabaseAdmin.from("guests").select("id, household_id, full_name").order("household_id").order("full_name")`
- Groups flat rows by `household_id` in JS using a `Map`; preserves per-DB sort order (alpha by household UUID, then alpha by name within each household)
- Renders a count header: "N households · M guests"
- Error branch returns a `text-error` div (no throw — Server Components have no default error boundary)
- Empty-state branch for zero guests
- Imports and renders `HouseholdsTable` with grouped `households` prop

**app/(admin)/admin/HouseholdsTable.tsx** — `"use client"` island:
- Accepts `{ households: HouseholdGroup[] }` and holds it in local `useState` so mutations update the view without a full page reload
- Per member: **Rename** (PATCH `/api/admin/guests/[id]` with `{ full_name }`), **Move** (PATCH with `{ household_id }` — existing ID for merge, `crypto.randomUUID()` for split), **Remove** (`window.confirm` D-09 gate then DELETE `/api/admin/guests/[id]`)
- Per household: **Add person** (POST `/api/admin/guests` with `{ household_id, full_name }`)
- Fetch error ordering mirrors `rsvp/page.tsx`: check `res.status >= 500` first, then `!res.ok`, then parse JSON
- `crypto.randomUUID()` called client-side for split (D-10)
- Does NOT import `@/lib/supabase/admin` — all writes through Plan 02 Route Handlers (T-06-09 mitigate)
- Stitch token classes throughout (`bg-surface-container-lowest`, `text-primary`, `text-error`, `border-white/10`, etc.)

## Security (Threat Model Coverage)

| Threat | Status |
|--------|--------|
| T-06-09: service-role key exposure via client import | Mitigated — no `@/lib/supabase/admin` in `"use client"` file (grep verified) |
| T-06-10: accidental destructive delete | Mitigated — `window.confirm` copy notes RSVP cascade before DELETE fires |
| T-06-11: unauthenticated /admin access | Mitigated — proxy.ts admin gate (Plan 01); Plan 02 Route Handlers re-verify `admin_session` |

## Deviations from Plan

**1. [Rule 3 - Blocking] Stub HouseholdsTable created in Task 1**
- Found during: Task 1
- Issue: `page.tsx` imports `HouseholdsTable` from `./HouseholdsTable`, but the plan creates that file in Task 2. Build would fail if Task 1 is verified independently.
- Fix: Created a minimal stub `HouseholdsTable.tsx` (displays household count, exports the shared types) in Task 1 so `npm run build` passes. Replaced with full implementation in Task 2.
- Files modified: app/(admin)/admin/HouseholdsTable.tsx
- Commits: 55fc03c (stub), 359cb94 (full)

**2. [Minor] `allGuests` flat prop omitted**
- The plan text mentioned passing "the grouped data and the flat guests as props." The flat list is trivially derivable from `households` via `flatMap`. Passing it separately adds no value and creates a sync concern after mutations. The island derives what it needs from its own `households` state.

## Known Stubs

None — the inline edit UI is fully implemented. All four operations (rename/add/remove/move) wire to the Plan 02 endpoints.

## Self-Check

- [x] `app/(admin)/admin/page.tsx` exists and contains `supabaseAdmin`
- [x] `app/(admin)/admin/HouseholdsTable.tsx` exists and starts with `"use client"`
- [x] No `@/lib/supabase/admin` import in HouseholdsTable.tsx (grep verified)
- [x] `fetch("/api/admin/guests` calls present in HouseholdsTable.tsx (lines 112, 142, 172, 226)
- [x] `window.confirm` present (line 136)
- [x] `crypto.randomUUID()` present (line 168)
- [x] `npm run build && npm run lint` — 0 errors, 21 warnings (all pre-existing in other files)
- [x] Commits 55fc03c and 359cb94 exist

## Self-Check: PASSED
