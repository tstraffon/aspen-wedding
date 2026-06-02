# Roadmap — Aspen Wedding

This roadmap spans every milestone. Phase numbering is monotonic across milestones (v0.1 ended at Phase 3; v0.2 starts at Phase 4).

---

# Milestone v0.1 — Interactive Guest Features (shipped)

**Goal:** Add the three remaining guest-facing features (RSVP enablement, Registry, Bridal Party) so the site is feature-complete for invitations.

**Success criteria:** All three pages live, linked from the navbar, styled to the Stitch system, and tested on mobile + desktop. RSVP submissions land in Supabase reliably.

---

## Phase 1 — RSVP Enablement

**Goal:** Make the existing RSVP flow production-ready and discoverable.

**UI hint:** yes

**Scope:**

- Verify the Supabase `rsvps` table schema matches the form payload (`full_name`, `email`, `attending`, `guest_count`, `dietary_restrictions`, `note`)
- Confirm `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are wired and RLS / insert policy allows anonymous inserts
- Enable the commented-out RSVP nav link in `components/Navbar.tsx`
- Polish submission UX: success/error state copy, loading state, validation messaging, mobile spacing pass
- Add a basic RSVP submission test (happy path) or a manual smoke checklist

**Dependencies:** none

**Plans:** 4/4 plans complete

Plans:

- [x] 01-01-PLAN.md — Backend infrastructure: schema + RLS verify, anon-only API route, env var docs
- [x] 01-02-PLAN.md — Form polish: validation, focus management, success/error variants, a11y attributes
- [x] 01-03-PLAN.md — Navbar enable: uncomment RSVP link, delete dead comment slot
- [x] 01-04-PLAN.md — Smoke checklist: five-step manual verification + production env check

---

## Phase 2 — Registry Page

**Goal:** A `/registry` page that guides guests to chosen registries / linked gift items, matching the site's design system.

**UI hint:** yes

**Scope:**

- New route `app/(main)/registry/page.tsx`
- Content model: a registries list (Honeyfund / Amazon / Crate & Barrel / etc.) — decide static config vs. data file
- Card or list layout with logo, short blurb, "Visit Registry" CTA per item
- Enable commented-out Registry nav link in `components/Navbar.tsx`
- Reference Stitch design tokens for color, type, spacing

**Dependencies:** none (independent of Phase 1)

**Plans:** 3/3 plans complete

Plans:

- [x] 02-01-PLAN.md — Page scaffold: hero section + framing block (Server Component, metadata export)
- [x] 02-02-PLAN.md — Card grid: inline registries array + 3-col grid with a11y and tabnabbing mitigation
- [x] 02-03-PLAN.md — Navbar integration + end-to-end smoke checklist

---

## Phase 3 — Bridal Party Page

**Goal:** A `/bridal-party` page introducing the wedding party with photos and short bios.

**UI hint:** yes

**Scope:**

- New route `app/(main)/bridal-party/page.tsx`
- Content model: party members grouped (e.g., Bride's Side / Groom's Side) with name, role (Maid of Honor, Best Man, etc.), photo, 1-2 sentence bio
- Responsive grid; plain `<img>` with eslint-disable comment (site-wide convention; not `next/image`)
- Add Bridal Party link to `components/Navbar.tsx` (new entry, not previously stubbed)
- Reference Stitch design tokens

**Dependencies:** none (independent of Phase 1 & 2)

**Plans:** 3/3 plans complete

Plans:

- [x] 03-01-PLAN.md — Page scaffold: metadata, Server Component shell, hero, two empty section placeholders
- [x] 03-02-PLAN.md — Member type + getInitials helper + 16-person data arrays + section bodies (originally magazine rows; pivoted to side-by-side columns in Plan 03)
- [x] 03-03-PLAN.md — Navbar integration + layout pivot to side-by-side columns + hero swap + smoke checklist

---

# Milestone v0.2 — Gated RSVP & Meal Selection

**Goal:** Lock the RSVP flow to invited guests only, let one guest RSVP for their entire household, and capture each attendee's meal choice.

**Success criteria:** Only guests on the imported list can submit. A single guest can RSVP for every member of their household in one pass. Each attending person picks one of three meal options. Tyler can pull a meal-count report from Supabase Studio with one query.

## Phases

- [x] **Phase 4: Guest List Schema & Lookup API** — Database schema + server-side lookup/upsert endpoints (shipped 2026-06-01)
- [ ] **Phase 5: Name-Lookup Gate UI** — `/rsvp` revamp: lookup screen, hit/miss UX, group-form scaffold
- [ ] **Phase 6: Group Form & Meal Selection** — Per-member rows, attending toggle, meal dropdown, dietary notes, submit
- [ ] **Phase 7: Tyler-Facing Handoff** — CSV import flow, meal-count report query, runbook, end-to-end smoke

## Phase Details

### Phase 4 — Guest List Schema & Lookup API

**Goal:** Database and server endpoints can answer "is this name on the list?" and "save this household's RSVPs atomically."

**Depends on:** none (builds on the v0.1 Supabase project + anon-key + GRANT pattern; no UI changes yet)

**Requirements:** GUEST-01, GUEST-04, GROUP-02, GROUP-03, MEAL-03

**Scope:**

- New `guests` table in Supabase: `id` (uuid pk), `household_id` (uuid, indexed), `full_name` (text, indexed for case-insensitive lookup), `created_at`. Tyler-managed via Supabase Studio.
- Schema migration on existing `rsvps` table:
  - **Add:** `household_id` (uuid, nullable for backward compat with v0.1 rows), `guest_id` (uuid fk → guests.id, nullable), `meal_choice` (text, nullable; constrained to 3 enum values at app layer not db layer per MEAL-02)
  - **Drop:** `guest_count` (integer, no longer meaningful — group flow derives this from household size)
  - **Keep:** `full_name`, `email`, `attending`, `dietary_restrictions`, `note`
- Unique constraint on `rsvps(guest_id)` so upsert by guest is well-defined (one RSVP row per person)
- GRANT layer: anon gets SELECT on `guests` (name lookup is read-only; lookup is the gate so reads must be public), INSERT + UPDATE on `rsvps` (upsert path)
- New API route `app/(main)/api/rsvp/lookup/route.ts` — POST with `{ name: string }`, returns `{ found: true, household_id, members: [{ guest_id, full_name }] }` or `{ found: false }`. Case-insensitive trim match. No PII leakage beyond names already on the invite list.
- New API route `app/(main)/api/rsvp/submit/route.ts` (or extend existing `/api/rsvp/route.ts`) — POST with `{ household_id, submissions: [{ guest_id, full_name, attending, meal_choice, dietary_restrictions }] }`, performs batched upsert in a single Supabase call. Returns `{ success: true }` or sanitized 5xx.
- Schema migration applied manually in Supabase Studio (v0.1 pattern — no `supabase/migrations/` folder); SQL captured in phase artifacts for repeatability.
- Keep the existing `SITE_ACCESS_CODE` proxy gate in front of all new routes.

**Success Criteria** (what must be TRUE):

1. Tyler can insert a guest row in Supabase Studio with a `household_id` and see it returned via `curl POST /api/rsvp/lookup` with the exact name.
2. The same lookup call against a name not in `guests` returns `{ found: false }` with HTTP 200 (not 404 — miss is an expected business outcome, not an error).
3. A POST to the submit endpoint with N household members writes N upserted rows in a single round-trip; re-submitting the same payload updates the existing rows rather than creating duplicates.
4. The `rsvps` table no longer has `guest_count`; it does have `household_id`, `guest_id`, and `meal_choice`.
5. Anon role can SELECT `guests` and INSERT/UPDATE `rsvps`, but cannot SELECT `rsvps` (verified via direct REST call returning 401).

**Plans:** 3 plans

Plans:

- [ ] 04-01-PLAN.md — SCHEMA.sql artifact + Studio apply (CREATE TABLE guests, ALTER rsvps add/drop, partial unique index, GRANT layer, gated dev seed) [Wave 1, autonomous=false]
- [ ] 04-02-PLAN.md — `/api/rsvp/lookup` POST route: case-insensitive trim match + household fetch + curl smokes [Wave 2, autonomous=true]
- [ ] 04-03-PLAN.md — `/api/rsvp/submit` POST route: validation + cross-household authz + batched upsert via onConflict:guest_id + curl smokes [Wave 2, autonomous=true]

---

### Phase 5 — Name-Lookup Gate UI

**Goal:** A guest landing on `/rsvp` first sees a single name-lookup screen and gets a clear hit-or-miss response before any form appears.

**Depends on:** Phase 4 (lookup endpoint must exist)

**Requirements:** GUEST-02, GUEST-03

**Scope:**

- Revamp `app/(main)/rsvp/page.tsx` into a two-stage flow controlled by local component state: `stage: "lookup" | "form" | "success"`.
- Stage 1 (lookup) — single text input "Your full name," submit button, error banner slot. On submit, calls `/api/rsvp/lookup`. The existing editorial left column ("Kindly Respond," sticky photo) stays as the page chrome; the right column swaps content per stage.
- On hit, transition to `stage: "form"` and hydrate a `household` state object with the returned members. Form scaffold renders but is empty (Phase 6 fills it).
- On miss, render the "we can't find you" message inline (same right column, no navigation). Body copy: name not on the list + support email `hello@emilyandtyler.com` + a "try again" button that clears the name input and refocuses it.
- Loading state on the lookup button (disabled + "Searching…") and network/server error variants reusing the existing `errorKind` pattern.
- Server Component preferred for the page shell; the stage-switching right column is the one client island. Match the v0.1 pattern of using `"use client"` only where state requires it.
- Plain `<img>` + eslint-disable comment for any imagery (site-wide convention).
- A11y: live region announces hit vs. miss; focus moves to the form's first field on hit or back to the lookup input on miss.

**Success Criteria** (what must be TRUE):

1. A guest landing on `/rsvp` sees a single name field and no full form until they search.
2. Typing a name that exists in `guests` and submitting reveals the group form populated with every member of that household.
3. Typing a name that does not exist shows the "we can't find you" message with the support email and a "try again" button — without page reload and without leaving `/rsvp`.
4. The "try again" button clears the input and returns focus to it; screen reader announces both hit and miss states via a polite live region.
5. Loading state is visible during the network round-trip; network and server errors render the same error banner pattern v0.1 established (no white-screen failures).

**Plans:** 1/2 plans executed

**UI hint:** yes

---

### Phase 6 — Group Form & Meal Selection

**Goal:** After lookup succeeds, a single guest can mark every household member attending or not, pick a meal for each attendee, and submit the household in one click.

**Depends on:** Phase 5 (form scaffold exists), Phase 4 (submit endpoint exists)

**Requirements:** GROUP-01, GROUP-04, MEAL-01, MEAL-02

**Scope:**

- Per-household-member row rendered from the `household.members` state hydrated in Phase 5. Each row shows: member name (display only, not editable), attending Y/N toggle (defaults to unselected per GROUP-01), and — conditional on attending = Y — a meal dropdown + dietary notes input.
- Meal options statically defined in a `MEAL_OPTIONS` constant in the rsvp page (or a sibling module) per MEAL-02. Three options; final copy TBD by Tyler during planning. Dropdown is required when attending = Y; non-attending members never see the meal field.
- Per-person `dietary_restrictions` free-text input (reusing the existing column name) when attending = Y, per GROUP-04.
- Optional single household-level fields preserved from the v0.1 form: contact email (one per household, populated from the lookup-er), personal note to the couple (one per household).
- Client-side validation: at least one attendee must have made an attending choice; every attending member must have selected a meal; show field-level error messages matching the v0.1 a11y pattern (`aria-invalid`, `aria-describedby`, focus first invalid).
- Submit calls the Phase 4 submit endpoint with a batched payload. Success transitions to `stage: "success"` and renders a thank-you panel that summarizes who is attending and what they're eating (so the guest can verify before closing the tab).
- Re-look-up flow: success view includes an "edit response" link that returns to `stage: "lookup"` and re-fetches the household so updates flow through the upsert path (GROUP-03 from Phase 4 is exercised here from the UI side).
- Use Server Components everywhere structure allows; the stateful form remains the single client island.
- Plain `<img>` + eslint-disable comment if any visuals are added.

**Success Criteria** (what must be TRUE):

1. After a successful lookup for a household of N members, the guest sees N labeled rows, each with attending Y/N defaulting to unselected.
2. Selecting "attending = yes" for a member reveals a meal dropdown with exactly 3 options and a dietary notes field; selecting "attending = no" hides both.
3. Attempting to submit while any attending member has no meal selected is blocked with a clear inline error and focus moves to the offending row.
4. A successful submit shows a confirmation screen listing each attending member's name and meal choice; Tyler can verify the same rows exist in Supabase Studio.
5. The confirmation screen offers an "edit response" path that re-runs the lookup and lets the same guest update their submission without creating duplicate rows.

**Plans:** TBD

**UI hint:** yes

---

### Phase 7 — Tyler-Facing Handoff

**Goal:** Tyler can load the real guest list, pull a meal-count report, and trust the whole flow before sending invitations.

**Depends on:** Phase 6 (full flow must be functional)

**Requirements:** (no new REQ-IDs — this phase exercises and operationalizes requirements satisfied in earlier phases; it covers GUEST-01's "CSV import" pathway in concrete terms)

**Scope:**

- CSV import flow: documented format (`household_id,full_name`) plus a one-shot Node script in `scripts/` that reads a CSV and INSERTs into `guests` using the service-role key locally (never deployed, never exposed). Alternative: documented Supabase Studio "Import CSV" UI walkthrough. Pick one based on what Tyler prefers during phase planning.
- Meal-count report: a saved SQL snippet (in `.planning/phases/07-*/QUERIES.md` or a `scripts/queries/` folder) that runs `SELECT meal_choice, COUNT(*) FROM rsvps WHERE attending = true GROUP BY meal_choice`. Includes variants for per-household breakdown and dietary-notes export.
- End-to-end smoke checklist: insert 2 test households (3 members + 1 member), run lookup → form → submit for each, verify rows, run the meal-count query, then DELETE the test rows. Mirrors the v0.1 smoke pattern (`01-SMOKE.md`).
- Pre-ship runbook: how to swap the test guest list for the real one (truncate `guests`, re-import), how to roll back if a guest reports the wrong household, how to read the meal-count report on the morning of the catering deadline.
- Cleanup: drop any temporary test households, verify production env vars on Vercel still match v0.1 contract.
- No UI changes in this phase unless the smoke surfaces a defect.

**Success Criteria** (what must be TRUE):

1. Tyler can run the documented CSV import (script or Studio UI) and see the imported guests reflected in lookup calls within minutes.
2. The meal-count SQL snippet returns accurate counts when run against test data with known answers.
3. The end-to-end smoke checklist passes for at least one multi-member household and one single-person household.
4. The pre-ship runbook tells Tyler exactly which commands or Studio steps to run to replace the guest list before sending invitations, with no ambiguity.
5. After cleanup, the `rsvps` and `guests` tables contain only intended data; Vercel env vars remain the v0.1 two-var contract (no new keys added).

**Plans:** TBD

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. RSVP Enablement | 4/4 | Shipped | 2026-05-29 |
| 2. Registry Page | 3/3 | Shipped | 2026-05-30 |
| 3. Bridal Party | 3/3 | Shipped | 2026-05-30 |
| 4. Guest List Schema & Lookup API | 0/3 | Planned | — |
| 5. Name-Lookup Gate UI | 1/2 | In Progress|  |
| 6. Group Form & Meal Selection | 0/0 | Not started | — |
| 7. Tyler-Facing Handoff | 0/0 | Not started | — |

---

## Out of Scope for v0.2

- Guest accounts / passwords / magic links — name-lookup gate is the identity layer
- Email confirmations on RSVP submit — would require Resend/SendGrid; deferred
- Built-in admin UI for guest list — Supabase Studio + CSV is enough for a one-off wedding
- Plus-one self-add — Tyler controls household membership server-side
- Meal options editable post-deploy — meal list lives in code per MEAL-02
- Photo gallery / post-wedding uploads — separate concern
- i18n — all guests English-speaking
