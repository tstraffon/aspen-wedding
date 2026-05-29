---
phase: 01-rsvp-enablement
plan: 01-01
subsystem: api
tags: [supabase, rls, postgres, env-vars, security]

requires:
  - phase: bootstrap
    provides: existing /api/rsvp route, proxy auth gate, Supabase project credentials (provided by user)
provides:
  - "Verified `public.rsvps` schema (8 columns, correct types)"
  - "Anon-write-only access via GRANT (INSERT to anon, full CRUD to authenticated)"
  - "Route handler reads only NEXT_PUBLIC_SUPABASE_ANON_KEY (no service-role fallback)"
  - "Sanitized 500 responses (no PostgREST error leakage)"
  - ".env.local.example committed; .env.local gitignored; README documents the env contract"
affects:
  - 01-02 (form polish — relies on /api/rsvp returning 200 on valid payload)
  - 01-03 (navbar — discoverable only after backend works)
  - 01-04 (manual smoke checklist — full end-to-end)

tech-stack:
  added: []
  patterns:
    - "GRANT-based write-only access (table grants instead of RLS policy)"

key-files:
  created:
    - .env.local.example
    - .env.local (gitignored — local credentials)
  modified:
    - app/(main)/api/rsvp/route.ts
    - .gitignore
    - README.md

key-decisions:
  - "Switched from RLS-based write-only access to GRANT-based after Supabase platform quirk: anon role hit RLS denial even for PERMISSIVE policies targeting TO public under SET LOCAL ROLE anon. Security intent preserved — anon has only INSERT grant; SELECT/UPDATE/DELETE returns 401."
  - "Kept legacy anon JWT for .env.local rather than the new sb_publishable_* key. Both formats verified to work (201 on INSERT, 401 on SELECT) but legacy JWT matches the plan's NEXT_PUBLIC_SUPABASE_ANON_KEY semantics with zero env-var-name churn."
  - "Set a temporary SITE_ACCESS_CODE=aspen2026 in .env.local for proxy gate during local dev. Documented as deliberately out of phase scope; production SITE_ACCESS_CODE is set independently."

patterns-established:
  - "Pattern: anon-key writes through GRANT layer, no RLS dependency — sidesteps the Supabase RLS-on-new-projects quirk while keeping write-only semantics."
  - "Pattern: route handlers read env vars at module-call time, fail fast with 500 + generic error if missing."

requirements-completed:
  - "REQ-01: Verify Supabase rsvps table schema matches form payload"
  - "REQ-02: Confirm anon env vars wired and access policy allows anon insert"
  - "REQ-03: Tighten security model: drop service-role fallback"

duration: ~75min
completed: 2026-05-28
---

# Plan 01-01: RSVP Backend Hardening — Summary

**Production-correct RSVP backend on Supabase: verified schema, write-only anon access (via GRANT after RLS platform quirk), anon-only route handler, sanitized error responses, committed env contract.**

## Performance

- **Duration:** ~75 min (~30 min on Supabase RLS diagnostics)
- **Started:** 2026-05-28 (early evening)
- **Completed:** 2026-05-29 (early morning UTC)
- **Tasks:** 5/5 (3 human checkpoints + 2 code tasks)
- **Files modified:** 4 (1 created tracked, 1 created gitignored, 2 edited)

## Accomplishments

- Confirmed the live `public.rsvps` table has the exact 8 columns the form payload expects, with correct types and nullability — no patch needed.
- Locked down anon access to INSERT only (write-only public path) via Postgres GRANTs after a Supabase platform quirk made RLS unworkable for the anon role on new projects.
- Tightened `route.ts` so the production code path is identical to the verified anon path: no service-role fallback, no PostgREST error message leakage.
- Established a single source of truth for env vars (`.env.local.example`) and proved end-to-end via real auth + real POST + real row in Supabase.

## Task Commits

1. **Task 1 (human-action): Confirm Supabase project + capture credentials** — no commit (credentials never tracked)
2. **Task 2 (human-action): Verify and patch rsvps schema** — no commit (lives in Supabase, not repo)
3. **Task 3 (human-action): Verify access policy** — no commit (lives in Supabase, not repo). Originally RLS-based; pivoted to GRANT-based mid-task.
4. **Task 4: Tighten API route to anon-only + sanitize errors** — `9db3953` (feat)
5. **Task 5: Env contract (.env.local, .env.local.example, .gitignore, README)** — `c6df72e` (chore)

## Files Created/Modified

- `app/(main)/api/rsvp/route.ts` — Dropped `SUPABASE_SERVICE_ROLE_KEY ??` fallback (line 17). Replaced `error.message` echo with generic "Could not save RSVP" + server-side `console.error`.
- `.env.local.example` (tracked) — Two-var contract: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. No service-role var listed.
- `.env.local` (gitignored) — Real credentials for local dev. Includes a temporary `SITE_ACCESS_CODE=aspen2026` for the proxy gate so the smoke test could pass.
- `.gitignore` — Added `!.env.local.example` negation after the `.env*` rule.
- `README.md` — Added `## Environment` section pointing to `.env.local.example` and Supabase Studio.

## Plan Deviations

### 1. RLS → GRANT-based write-only access (security-equivalent)

The plan called for an RLS PERMISSIVE policy `CREATE POLICY ... FOR INSERT TO anon WITH CHECK (true)`. The policy was created exactly as specified, but every INSERT attempt — including direct `SET LOCAL ROLE anon` from the Supabase SQL Editor — failed with `42501: new row violates row-level security policy`, even when the policy was rebuilt with `TO public`. Diagnostics confirmed: PERMISSIVE policy, `with_check = true`, no RESTRICTIVE policies, no `force_row_level_security`, `SET LOCAL ROLE anon` correctly set `current_user = anon`. The platform was denying the operation despite the policy permitting it. A POSTGRES-as-owner INSERT succeeded, isolating the failure to the anon role + RLS path.

**Resolution:** Disable RLS on `public.rsvps`. REVOKE all default grants from anon, then GRANT only INSERT. Same security intent (anon writes, never reads/updates/deletes), enforced by Postgres GRANT layer instead of policy layer. Verified end-to-end:
- Anon INSERT via REST API: 201 (success, with `Prefer: return=minimal`)
- Anon SELECT via REST API: 401 "permission denied for table" (read blocked)
- Both legacy `eyJ...` JWT and new `sb_publishable_*` formats produce identical behavior.

**Future:** If Supabase fixes the RLS-for-anon-on-new-projects quirk, re-enable RLS and the original write-only policy. This is purely an implementation swap; the security boundary is unchanged.

### 2. SITE_ACCESS_CODE added to `.env.local` (out of plan scope)

Plan Task 5 explicitly excluded `SITE_ACCESS_CODE` from the env contract. However, Next.js 16's `proxy.ts` redirects every non-`/login`/non-`/api/auth` request to `/login` without a session cookie — including `/api/rsvp`. Task 5's smoke test (curl POST to `/api/rsvp`) needed a session, which required `SITE_ACCESS_CODE` to be set for `/api/auth/login` to issue one. Set a temporary `aspen2026` value in `.env.local` only; not added to `.env.local.example`, not committed.

## Test Results

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| `grep -c SUPABASE_SERVICE_ROLE_KEY app/(main)/api/rsvp/route.ts` | 0 | 0 | ✓ |
| `grep -c "error.message" app/(main)/api/rsvp/route.ts` | 0 | 0 | ✓ |
| `grep -c "Could not save RSVP" app/(main)/api/rsvp/route.ts` | 1 | 1 | ✓ |
| `npx tsc --noEmit` | exit 0 | exit 0 | ✓ |
| `npm run lint` (route.ts only) | exit 0 | clean for route.ts | ✓ |
| `git check-ignore .env.local.example` | non-zero | non-zero (tracked) | ✓ |
| `git check-ignore .env.local` | 0 | 0 (ignored) | ✓ |
| Anon INSERT via REST (`return=minimal`) | 201 | 201 | ✓ |
| Anon SELECT via REST | 401 | 401 "permission denied" | ✓ |
| Local dev: auth → POST `/api/rsvp` (empty) | 400 | `{"error":"Missing required fields"}` | ✓ |
| Local dev: auth → POST `/api/rsvp` (valid) | 200 | `{"success":true}` (row in Supabase) | ✓ |

## Known Issues (Out of Scope)

- **Pre-existing lint errors:** `npm run lint` shows 4 `react/no-unescaped-entities` errors in `app/(main)/page.tsx`, `app/(main)/travel/page.tsx`, etc. These pre-date this plan; none are in files I touched. Track as tech-debt for a future cleanup phase.
- **`SUPABASE_SERVICE_ROLE_KEY` not in env example:** Intentional — the route no longer reads it, and listing it invites accidental usage.

## Cleanup Required

The Supabase `rsvps` table has ~7 test rows from RLS diagnostics. Run in Studio SQL Editor:

```sql
DELETE FROM public.rsvps WHERE email IN (
  'smoke@example.com', 'sqldirect@test.com', 'test@example.com',
  'rebuild@test.com', 'pubpolicy@test.com', 'session@test.com',
  'final-legacy_anon@example.com', 'final-publishable@example.com',
  'pg@test.com', 'local-smoke@example.com', 'role@test.com'
);
```

This cleanup is also reflected in Plan 01-04's smoke checklist.

## Production Deployment Notes (for Vercel)

On the Vercel dashboard → Project Settings → Environment Variables, add:

- `NEXT_PUBLIC_SUPABASE_URL` = `https://buemmczwbuvzzjqnulsk.supabase.co` (Production, Preview)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `<legacy anon JWT from Supabase Studio>` (Production, Preview)
- `SITE_ACCESS_CODE` = `<production value, NOT aspen2026>` (Production, Preview)

`SUPABASE_SERVICE_ROLE_KEY` must NOT be set anywhere (defense in depth — the route no longer reads it).
