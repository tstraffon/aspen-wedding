---
phase: 06-admin-console
plan: 02
subsystem: admin-api
tags: [admin, guests, CRUD, auth, service-role]
dependency_graph:
  requires: [06-01]
  provides: [POST /api/admin/guests, PATCH /api/admin/guests/[id], DELETE /api/admin/guests/[id]]
  affects: []
tech_stack:
  added: []
  patterns: [admin_session cookie gate, supabaseAdmin service-role, Next.js 16 await params, rsvps-before-guests delete]
key_files:
  created:
    - app/api/admin/guests/route.ts
    - app/api/admin/guests/[id]/route.ts
  modified: []
decisions:
  - "admin_session verified in every handler as PRIMARY authz — proxy.ts does not cover /api/admin/* paths"
  - "params awaited per Next.js 16 Promise requirement"
  - "rsvps row deleted before guests row (D-09, no DB FK cascade)"
  - "rsvpDeleteError logged but non-fatal — guest may never have RSVP'd"
metrics:
  duration: "~10m"
  completed: "2026-06-30T17:50:00Z"
  tasks_completed: 2
  files_created: 2
requirements: [ADMIN-03]
---

# Phase 06 Plan 02: Admin Guest Mutation API Summary

Admin guest CRUD endpoints — POST add, PATCH rename/move, DELETE cascade — all service-role gated and admin-session verified.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | POST /api/admin/guests — add guest | 3ff9711 | app/api/admin/guests/route.ts |
| 2 | PATCH/DELETE /api/admin/guests/[id] — rename, move, cascade-delete | 6dcd5a4 | app/api/admin/guests/[id]/route.ts |

## What Was Built

### app/api/admin/guests/route.ts

POST handler for adding a guest to a household. Logic flow:

1. `request.cookies.get("admin_session")?.value` — 401 if absent (PRIMARY authz; proxy.ts guest gate passes for any visitor with a `session` cookie and does NOT enforce admin identity on `/api/admin/*` paths)
2. Body parse with try/catch + object check — 400 on failure
3. `household_id` validated against `UUID_RE`; `full_name` validated as non-empty trimmed string — 400 on either
4. `supabaseAdmin.from("guests").insert({...}).select().single()` — service-role bypasses RLS
5. Sanitized 5xx on DB error; `{ success: true, guest: data }` on success

### app/api/admin/guests/[id]/route.ts

PATCH handler (rename / move):

1. `admin_session` cookie check — 401 if absent
2. `const { id } = await params` — awaited per Next.js 16 (params is a Promise)
3. `id` validated against `UUID_RE` — 400 if malformed
4. Body parsed; `full_name` (rename, D-10) and/or `household_id` (move to existing or new UUID, D-08) extracted; at least one must be present — 400 if neither
5. `supabaseAdmin.from("guests").update(fields).eq("id", id)`
6. Sanitized 5xx on error; `{ success: true }` on success

DELETE handler (D-09 cascade):

1. `admin_session` cookie check — 401 if absent
2. `await params` — same as PATCH
3. `id` validated against `UUID_RE`
4. `supabaseAdmin.from("rsvps").delete().eq("guest_id", id)` — rsvps FIRST (no DB FK cascade per Phase 4 D-04; prevents orphaned rows that inflate meal counts). Error logged but non-fatal (guest may never have RSVP'd)
5. `supabaseAdmin.from("guests").delete().eq("id", id)` — guest second. Error here fails the request with sanitized 500
6. `{ success: true }` on success

## Security Assertions

All three handlers pass the following checks (verified by grep):

- `request.cookies.get("admin_session")` — present in POST, PATCH, and DELETE as first logic gate
- `UUID_RE` validation on `household_id` (POST), `id` (PATCH, DELETE), and optional `household_id` (PATCH move)
- Sanitized 5xx vocabulary — PostgREST errors logged via `console.error`, never in response body
- `await params` — used in both PATCH and DELETE (prevents undefined `id` from Promise destructure)
- `from("rsvps").delete` appears at line 100, `from("guests").delete` at line 111 — rsvps-before-guests order confirmed

## Threat Mitigations Applied

| Threat ID | Mitigation |
|-----------|------------|
| T-06-05 | admin_session verified at top of every handler; returns 401 when absent |
| T-06-06 | rsvps row deleted before guests row in DELETE handler |
| T-06-07 | UUID_RE on household_id/id; non-empty full_name; empty update body rejected 400 |
| T-06-08 | Sanitized 5xx copy returned; real error logged server-side only |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — these are pure API handlers with no UI rendering.

## Threat Flags

None — no new network surface beyond what the plan's threat model describes.

## Self-Check: PASSED

- app/api/admin/guests/route.ts: exists
- app/api/admin/guests/[id]/route.ts: exists
- Commit 3ff9711: confirmed in git log
- Commit 6dcd5a4: confirmed in git log
- `npm run build` and `npm run lint`: both pass (lint shows 21 pre-existing warnings, 0 errors, 0 new warnings from these files)
