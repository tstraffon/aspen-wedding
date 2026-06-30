# Phase 6: Admin Console - Context

**Gathered:** 2026-06-30
**Status:** Ready for planning

<domain>
## Phase Boundary

A private, couple-only admin area (Tyler + Emily) to validate and manage the guest
list and to view and export RSVPs. Built and usable now, ahead of the guest-facing
form (Phase 7). Delivers four capabilities: (1) a households view to confirm everyone
is accounted for and correctly grouped, (2) guest CRUD + household regrouping,
(3) an RSVP view with a meal-count summary, (4) CSV export. Absorbs the former
Phase 7 "Tyler-Facing Handoff" (CSV import operationalization, meal-count report,
runbook, end-to-end smoke).

**Not in this phase:** the guest-facing group RSVP form + meal selection (that is
Phase 7), email/notifications, RSVP cutoff enforcement, per-guest invite codes.
</domain>

<decisions>
## Implementation Decisions

### Admin authentication (D-01..D-04)
- **D-01:** Admin uses a **separate passphrase + its own cookie**, distinct from the
  guest gate. New `ADMIN_ACCESS_CODE` env var; a new `/admin/login` POST route mirrors
  `app/api/auth/login/route.ts` but sets a distinct cookie (e.g. `admin_session`), not
  the shared guest `session` cookie.
- **D-02:** The guest `session = "authenticated"` cookie MUST NOT grant admin access.
  Admin authorization checks the admin cookie only. (Success criterion #1.)
- **D-03:** `proxy.ts` (this project's middleware) must protect `/admin/*` by requiring
  the admin cookie and redirecting unauthenticated visitors to `/admin/login` (not the
  guest `/login`). The matcher must exclude `/admin/login` and the admin auth API so the
  login path itself is reachable. The existing guest-gate behavior for the rest of the
  site stays intact.
- **D-04:** One shared passphrase is acceptable for both Tyler and Emily (no per-person
  identity needed). Cookie flags follow the existing login route: `httpOnly`, `secure`
  in production, `sameSite: "lax"`, path-scoped, long maxAge.

### Privileged data path (D-05..D-07)
- **D-05:** Admin server routes use the **Supabase service-role key**
  (`SUPABASE_SERVICE_ROLE_KEY`), created server-side only and NEVER shipped to the client
  or used in a Client Component. This is a deliberate, admin-scoped reversal of the
  Phase 1/4 "anon-only, no service-role" posture — justified because the path sits behind
  the admin gate (D-01..D-03). A separate server-only Supabase client (do NOT reuse the
  anon `lib/supabase/client.ts`).
- **D-06:** All admin reads of `rsvps` (which anon cannot SELECT) and all guest/household
  writes go through the service-role client in Route Handlers / Server Actions. The public
  anon path and the existing SECURITY DEFINER RPCs are unchanged by this phase.
- **D-07:** New env vars introduced by this phase: `ADMIN_ACCESS_CODE`,
  `SUPABASE_SERVICE_ROLE_KEY`. Both server-only (no `NEXT_PUBLIC_` prefix). Must be added
  to Vercel before deploy; document in the runbook.

### Guest edit + household regrouping UX (D-08..D-10)
- **D-08:** **Inline editing in the households list** — one screen lists all households
  with their members; rename / add / remove a person inline. Move a person to another
  household via a household picker; merging = reassign `household_id` to an existing
  household; splitting = assign to a newly created `household_id`.
- **D-09:** Deleting a guest who already has a submitted RSVP prompts a confirmation, and
  on confirm the admin route deletes that guest's `rsvps` row too (there is no DB FK
  cascade per Phase 4 decision D-04, so the admin route removes both rows server-side to
  avoid an orphaned RSVP).
- **D-10:** Edits persist to `guests` (and `rsvps` where relevant) and are immediately
  reflected by the existing name-lookup path (success criterion #3). `household_id`s are
  client-generated UUIDs when splitting/creating, consistent with the import.

### RSVP view + export (D-11..D-13)
- **D-11:** RSVP view is **grouped by household**, with a **meal-count summary card** at
  the top (counts by `meal_choice` among `attending = true`, plus a dietary-notes list).
  Renders cleanly with zero submissions (success criterion #4) — empty state, no errors.
- **D-12:** Export produces **two CSVs**: a guest-list CSV (`household_id, full_name`,
  matching the import format) and an RSVP CSV (per-guest: name, household, attending,
  meal_choice, dietary_restrictions). Server route(s) stream `text/csv` with a
  `Content-Disposition` attachment filename.
- **D-13:** Meal labels come from the existing single source of truth
  `lib/rsvp/meal-options.ts` (currently placeholder values) so the summary and the form
  never drift.

### Claude's Discretion
- Exact admin route layout (e.g. `/admin` = households, `/admin/rsvps` = responses) and
  whether edits use Route Handlers vs Server Actions — planner/researcher decide against
  the custom Next.js docs (AGENTS.md).
- Visual treatment within the Stitch token system (this is an internal tool — function
  over polish; a UI-SPEC is optional, `--skip-research` plausible).
- Whether the households view and RSVP view are one page with tabs or two routes.
- Live refresh vs manual reload for the RSVP view (default: manual / on-navigation is fine).
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Framework + project conventions
- `AGENTS.md` — custom Next.js; READ `node_modules/next/dist/docs/` before writing code.
  Middleware in this project is `proxy.ts` exporting `proxy()` + `config.matcher`.
- `CLAUDE.md` — points to AGENTS.md.

### Auth + gating (the pattern to mirror and extend)
- `proxy.ts` — the existing cookie gate + matcher. Must be extended to protect `/admin/*`
  with the admin cookie and route to `/admin/login` (D-03).
- `app/api/auth/login/route.ts` — the guest login route to mirror for `/admin/login` (D-01).

### Data access
- `lib/supabase/client.ts` — the anon-only client. Do NOT reuse for admin; add a separate
  server-only service-role client (D-05).
- `.planning/RSVP-S1-SECURITY-FIX.sql` — `submit_rsvps` SECURITY DEFINER write path + the
  REVOKE of anon INSERT/UPDATE on rsvps. Context for why admin needs a privileged path.
- `.planning/RSVP-PREFILL.sql` — `get_household_rsvps` SECURITY DEFINER read path; shows
  the existing controlled-read pattern (admin bypasses it via service-role).
- `lib/rsvp/meal-options.ts` — meal labels source of truth for the meal-count summary (D-13).

### Data + schema
- `.planning/guests-import.csv` — the cleaned guest list (138 guests / 75 households) the
  households view validates once imported.
- `.planning/ROADMAP.md` §"Phase 4" — `guests` (id, household_id, full_name) and `rsvps`
  (guest_id, household_id, attending, meal_choice, dietary_restrictions) column contracts.
- `.planning/phases/04-guest-list-and-api/04-CONTEXT.md` — Phase 4 decisions (D-04 no FK to
  guests; anon-only posture this phase scope-reverses for admin).
- `.planning/phases/05-name-lookup-gate-ui/05-CONTEXT.md` — the lookup UI edits must keep
  working after guest edits (D-10).
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/api/auth/login/route.ts`: clone for `/admin/login` (passphrase → cookie). Same flags.
- `proxy.ts`: extend the matcher + add an admin-cookie branch; do not rewrite the guest gate.
- `lib/rsvp/meal-options.ts`: `MEAL_OPTIONS` drives the meal-count summary.
- Stitch tokens in `app/globals.css` (dark teal surface + warm gold accent) for any UI.

### Established Patterns
- Server Components by default; `"use client"` only where interactivity requires it (the
  inline-edit households table is the one client island; data fetching stays server-side).
- Sanitized 5xx vocabulary; no PostgREST/Postgres error fragments in responses (Phase 4 D-13).
- Plain `<img>` + eslint-disable (site-wide), not `next/image`.
- Schema/DB changes applied via Supabase Studio, captured as SQL in phase artifacts
  (no `supabase/migrations/` folder).

### Integration Points
- New route group `app/(admin)` (or `app/admin`) with its own layout, behind the admin gate.
- New server-only env vars `ADMIN_ACCESS_CODE`, `SUPABASE_SERVICE_ROLE_KEY` (Vercel + local).
- Reads/writes `guests` and `rsvps` directly via the service-role client.
</code_context>

<specifics>
## Specific Ideas

- The households view is the primary near-term need: validate the just-cleaned 75
  households / 138 guests (incl. the Sr./Jr. Veeck split and the two "Guest" plus-ones)
  before invitations go out.
- Export CSV guest-list format must match the import (`household_id,full_name`) so a
  re-import round-trips cleanly.
</specifics>

<deferred>
## Deferred Ideas

- Per-person admin identity / audit log of who changed what — not needed for a two-person
  console; revisit only if it matters.
- RSVP cutoff date + form disable (CUTOFF-01) — still deferred, separate concern.
- Email confirmations (EMAIL-01) — still deferred.
- Live/realtime RSVP updates — manual reload is sufficient for this scale.
</deferred>

---

*Phase: 6-Admin Console*
*Context gathered: 2026-06-30*
