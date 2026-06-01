---
phase: 04-guest-list-and-api
plan: 02
status: complete
date: 2026-06-01
---

# Plan 04-02 Summary — POST /api/rsvp/lookup route

## D-IDs / REQ-IDs satisfied

- **GUEST-04** — Lookup endpoint returns the full household on hit; HTTP 200 on both hit and miss.
- **D-09, D-10, D-11** — Case-insensitive trim match via `lower(trim(full_name)) = lower(trim($1))`; no fuzzy matching; household members returned on hit.
- **D-14** (lookup half) — POST verb, body `{ name: string }`, response `{ found: true, household_id, members: [...] }` or `{ found: false }`.

## Output

- `app/(main)/api/rsvp/lookup/route.ts` — Next.js 16 Route Handler, 100 lines, RPC-based lookup
- Carries forward Phase 1 patterns: module-call-time env reads, sanitized 5xx, no service-role key, no RLS

## Smoke results (all PASS)

| Smoke | Expected | Got |
|---|---|---|
| #0 proxy gate (unauth) | HTTP 307 → `/login` | HTTP 307 → `/login` ✅ |
| #1 exact match "Tyler Straffon" | `found:true`, household 1111, 2 members | ✅ Emily + Tyler returned |
| #2 normalization `"  TYLER STRAFFON  "` | Same as #1 (proves `lower(trim())` symmetry on both sides) | ✅ identical response |
| #3 Sarah Else disambiguates | Household 2222 only (NOT Sarah Horan) | ✅ household 2222, 1 member |
| #3b Sarah Horan disambiguates | Household 3333 only (NOT Sarah Else) | ✅ household 3333, 1 member |
| #4 miss "Nonexistent Person" | `found:false`, HTTP 200 | ✅ |
| #5 empty body | HTTP 400 | ✅ |
| #6 empty name | HTTP 400 | ✅ |

## Implementation notes

- Uses `supabase.rpc("lookup_guest_by_name", { p_name: trimmedName })` per CONTEXT D-09 — the `.ilike()` / `.filter()` alternatives don't honor whitespace symmetry (PostgREST doesn't trim stored values), so the RPC is the only correct path.
- On hit, a second query fetches all members of the household for the form scaffold to populate (Plan 06).
- Lookup endpoint deliberately returns names only (no email, no phone, no meal choices) — minimizes oracle disclosure per D-12 (accept-the-risk).

## Issues caught and resolved during execution

**Issue 1 — Dev seed missing from `guests`** (root cause: RLS-enabled-by-default Supabase quirk, see Plan 04-01 SUMMARY amendment). When agents first probed, all hits returned `{found:false}` despite the table having rows. Diagnosed via anon REST API returning empty array (silent RLS denial, not an error). Fixed by `ALTER TABLE public.guests DISABLE ROW LEVEL SECURITY`. SCHEMA.sql patched.

**Issue 2 — Port drift.** Dev server bound to `:3002` not `:3000` (BeatCamp occupied 3000). Smokes adapted to use `:3002`. No code change; documenting for future smoke runs.

## Commits in this plan

- `9136cae` — `feat(04-02): add /api/rsvp/lookup POST route` (initial implementation)
- *(SCHEMA.sql fixes attributed to Plan 04-01 and Plan 04-03 commits)*

## Threat model — actual outcomes

- **T-04-INJECTION** (mitigated): RPC parameter is typed `text`; Supabase JS client + PostgREST handles parameterization. No raw SQL interpolation.
- **T-04-ORACLE-LOOKUP** (accepted per D-12): the lookup endpoint reveals "is X invited" to anyone past the `SITE_ACCESS_CODE` proxy gate. Names only, no PII. Documented.
- **T-04-PROXY-BYPASS** (mitigated via Smoke #0): unauthenticated POST returns HTTP 307 → `/login`. Proxy gate inherits to new route.
- **T-04-PII-LEAK** (mitigated): 5xx responses sanitized; PostgREST error fragments never reach the client.
- **T-04-AUTH-BYPASS** (mitigated via Plan 04-01 GRANT layer): anon can EXECUTE `lookup_guest_by_name` (LANGUAGE sql STABLE, NOT SECURITY DEFINER) which runs against guests where anon has SELECT. No direct rsvps access.

## Lint / build status

- `npm run lint` baseline preserved (4 pre-existing errors in `app/(main)/itinerary/page.tsx`, 21 pre-existing warnings; zero new from this plan)
- `npx tsc --noEmit` exits 0
- Dev server hot-reloads the new route

## Handoff to Phase 5

Phase 5 (Name-Lookup Gate UI) will POST to `/api/rsvp/lookup` from a revamped `/rsvp` page. The contract is locked here:

- Request: `POST /api/rsvp/lookup` with `{ name: string }` body, requires `SITE_ACCESS_CODE` session cookie
- Hit response (HTTP 200): `{ found: true, household_id: uuid, members: [{ guest_id: uuid, full_name: string }, ...] }`
- Miss response (HTTP 200): `{ found: false }`
- Invalid body (HTTP 400): `{ error: "Invalid request" }`
- Server error (HTTP 500): `{ error: "Something went wrong. Please try again." }`
