# Requirements — Aspen Wedding

## Milestone v0.2 — Gated RSVP & Meal Selection

**Goal:** Lock the RSVP flow to invited guests only, let one guest RSVP for their entire household, and capture each attendee's meal choice.

---

### Guest List + Lookup (GUEST-XX)

- [ ] **GUEST-01:** Tyler can populate the guest list via Supabase Studio with one row per invited person, grouped by a shared `household_id`. Source format: CSV import or direct table insert.
- [ ] **GUEST-02:** Guest can look themselves up by typing their name on the RSVP entry screen and receive a clear hit/miss response.
- [ ] **GUEST-03:** On a miss, the guest sees a "we can't find you" message with a support email contact and a "try again" affordance.
- [ ] **GUEST-04:** On a hit, the lookup endpoint returns every other person in the same household so the form can render the full group.

### Group RSVP Flow (GROUP-XX)

- [ ] **GROUP-01:** After successful lookup, guest sees one form row per household member with an "attending Y/N" toggle defaulting to unselected.
- [ ] **GROUP-02:** Submitting the form writes one `rsvps` row per household member in a single atomic operation (transactional / batched insert).
- [ ] **GROUP-03:** Guest can re-look up their household and update their submission before the RSVP cutoff — submissions are upsert by `(guest_id, household_id)`, not insert-only.
- [ ] **GROUP-04:** Each member's row carries a per-person dietary notes free-text field (reusing the existing `dietary_restrictions` column).

### Meal Selection (MEAL-XX)

- [ ] **MEAL-01:** Each attending member must select one of 3 meal options before the form will submit. Non-attending members do not see or need the meal selector.
- [ ] **MEAL-02:** The 3 meal options are statically defined in the codebase (not Tyler-editable via Studio) — keeps the form contract stable through ship.
- [ ] **MEAL-03:** Each attendee's meal choice is written to the `rsvps` table in a new `meal_choice` column so Tyler can run a meal-count report in Supabase Studio.

---

## Validated Requirements (shipped in prior milestones)

### v0.1 (Interactive Guest Features)
- [x] **INFO-01..05:** Home, Travel & Stay, Itinerary, Things To Do, FAQ pages render with Stitch design system *(pre-existed)*
- [x] **RSVP-01:** RSVP form posts to `/api/rsvp` with live Supabase wiring and anon-only write access *(Phase 1)*
- [x] **RSVP-02:** RSVP form has polished UX with validation, focus management, success/error states, and full a11y pass *(Phase 1)*
- [x] **RSVP-03:** RSVP nav link enabled and surfaced in main navigation *(Phase 1)*
- [x] **REG-01:** `/registry` page renders three editorial cards (Honeyfund, Amazon, Crate & Barrel) with hero, framing block, and outbound `Visit Registry` CTAs *(Phase 2)*
- [x] **REG-02:** Registry cards use `target="_blank" rel="noopener noreferrer"` tabnabbing mitigation *(Phase 2)*
- [x] **REG-03:** Registry nav link enabled *(Phase 2)*
- [x] **BP-01:** `/bridal-party` page renders 16 wedding party members in side-by-side Bride's Side / Groom's Side columns with monogram fallback for missing photos *(Phase 3)*
- [x] **BP-02:** Bridal Party nav link added *(Phase 3)*

---

## Future Requirements (deferred — not committed to a milestone)

- **EMAIL-01:** RSVP confirmation email to the submitter — would require Resend/SendGrid integration; deferred unless Tyler decides he needs send confirmations.
- **ADMIN-01:** Built-in admin UI to view / edit / export RSVPs — Supabase Studio is enough for a one-off wedding.
- **CUTOFF-01:** Soft RSVP cutoff date with form disable post-cutoff — useful but adds complexity; deferred unless Tyler wants to enforce.

---

## Out of Scope (explicit exclusions)

- **Guest accounts / passwords / magic links / per-guest invitation codes** — name-lookup gate is the lightest version of identity. No email infrastructure, no password reset flows, no signed-token URL parsing.
- **Plus-one self-add** — Tyler defines the household membership in Supabase; guests can't add new people to their household via the form. Keeps headcount under Tyler's control.
- **Meal options editable post-deploy** — meal list lives in code, not the database. Avoids needing a meals table or admin UI.
- **Per-meal allergen warnings / ingredient lists** — covered by the per-person dietary notes free-text field instead.
- **i18n** — all guests English-speaking.
- **Photo gallery / post-wedding uploads** — separate concern, after the event.

---

## Traceability

(Filled by roadmap — each requirement maps to exactly one phase.)
