---
phase: 06-admin-console
plan: 01
subsystem: auth
tags: [admin, auth, supabase, proxy, cookie]
dependency_graph:
  requires: []
  provides: [admin_session cookie, supabaseAdmin client, admin login gate]
  affects: [proxy.ts, lib/supabase/admin.ts, app/(admin)/**]
tech_stack:
  added: []
  patterns: [service-role Supabase client, separate admin cookie, proxy early-return gate, client island fetch pattern]
key_files:
  created:
    - lib/supabase/admin.ts
    - app/api/admin/auth/login/route.ts
    - app/(admin)/admin/layout.tsx
    - app/(admin)/admin/login/page.tsx
  modified:
    - proxy.ts
decisions:
  - "Admin gate uses admin_session cookie distinct from guest session cookie — guest code grants no admin access (D-02)"
  - "proxy.ts admin branch is an early-return before the guest gate — admin paths never fall through to session check"
  - "matcher exclusions added for admin/login and api/admin/auth so unauthenticated users can reach the login UI"
  - "supabaseAdmin uses SUPABASE_SERVICE_ROLE_KEY with no NEXT_PUBLIC_ prefix — server-only by convention"
metrics:
  duration: "~20 minutes"
  completed: "2026-06-30"
  tasks_completed: 2
  tasks_total: 3
  files_created: 4
  files_modified: 1
---

# Phase 6 Plan 01: Admin Auth Gate Summary

Admin authentication gate with `admin_session` cookie separate from the guest `session` cookie, proxy branch protecting `/admin/*`, service-role Supabase client, and admin login entry (layout + page + route).

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Provision admin env vars + confirm RLS disabled | (human checkpoint — pre-confirmed) | .env.local |
| 2 | Service-role client + admin login route | 69fdc91 | lib/supabase/admin.ts, app/api/admin/auth/login/route.ts |
| 3 | proxy.ts admin branch + admin layout + login page | da6ecf9 | proxy.ts, app/(admin)/admin/layout.tsx, app/(admin)/admin/login/page.tsx |

## Objective Achieved

ADMIN-01 satisfied: admin area at `/admin/*` is gated separately from the public guest `SITE_ACCESS_CODE`. A valid guest `session` cookie cannot satisfy the `admin_session` check in the proxy branch. `supabaseAdmin` is available server-side for all downstream Phase 6 plans.

## Verification

- `npm run build` passes (17/17 routes, 0 type errors)
- `npm run lint` passes (0 errors; 21 pre-existing warnings in unrelated files)
- proxy.ts contains both `admin_session` and `session` gate blocks
- matcher excludes `admin/login` and `api/admin/auth`
- `app/(admin)/admin/layout.tsx` has no `<html>`, `<body>`, Navbar, Footer, or MusicButton
- `app/(admin)/admin/login/page.tsx` starts with `"use client"` and posts to `/api/admin/auth/login`

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

- `/admin` route group has no `page.tsx` yet — that is Plan 06-02's responsibility. Visiting `/admin` after login will 404 until Plan 02 ships; the gate redirect behavior is fully functional.
- The layout includes a "Logout" link pointing to `/api/admin/auth/logout` which does not exist yet. This is an intentional forward-reference; it will become functional in a later plan or can be removed until then.

## Threat Surface Scan

No new threat surface beyond what the plan's threat model covers:
- T-06-01: admin_session gate enforced at proxy layer
- T-06-02: ADMIN_ACCESS_CODE compare with 401 on mismatch
- T-06-03: SUPABASE_SERVICE_ROLE_KEY server-only, no NEXT_PUBLIC_ prefix
- T-06-04: matcher excludes /admin/login and /api/admin/auth

## Self-Check: PASSED

- lib/supabase/admin.ts: FOUND
- app/api/admin/auth/login/route.ts: FOUND
- app/(admin)/admin/layout.tsx: FOUND
- app/(admin)/admin/login/page.tsx: FOUND
- proxy.ts: MODIFIED (verified)
- Commits 69fdc91, da6ecf9: FOUND
