# Phase 5 — Discussion Log

**Date:** 2026-06-01
**Mode:** discuss (default, no flags)
**Workflow:** `/gsd:discuss-phase 5`

This log is for human reference only — audit trail, retrospective, "what did we actually decide and why." Downstream agents read `05-CONTEXT.md`, not this file.

---

## Areas Selected for Discussion

User-selected via multiSelect from 4 candidate gray areas:

- ☑ Lookup screen treatment
- ☐ Hit/miss copy + tone (not discussed — Claude's discretion + UI-researcher to land)
- ☐ Left column across stages (not discussed — auto-decided as "stays static" per D-05)
- ☑ Form scaffold scope

The two unpicked areas defaulted to safe Claude's-discretion choices captured in CONTEXT.md.

---

## Area 1 — Lookup Screen Treatment

### Q1: Lookup stage visual chrome vs. v0.1 form-card?

**Options presented:**
- Reuse v0.1 form-card chrome
- Minimalist (no card on lookup)
- Hybrid (lighter framing on lookup)

**User chose:** **Reuse v0.1 form-card chrome** — same dark surface (`bg-surface-container-lowest`), same `p-24` desktop padding, same shadow + `border-white/5`. Stages feel visually identical; only inner content swaps.

**→ Decision L-01**

### Q2: Field arrangement inside the card?

**Options presented:**
- Just field + button — generous air
- Add a short instructional line above the field
- Add an in-card heading + instructional line

**User chose:** **Just the field + button — generous air.** No in-card heading, no in-card instructional copy. Editorial restraint — left column hero carries the context.

**→ Decision L-02**

### Q3: Where do error/miss states render?

**Options presented:**
- Reuse v0.1 errorKind banner pattern (network/server/miss all in banner)
- Network/server uses banner; miss replaces field
- All states replace card interior

**User chose:** **Reuse v0.1 errorKind banner pattern.** Network, server, AND miss all render in the same banner above the submit button. Form card never structurally changes.

**→ Decision L-03** (extended `errorKind` to include `"miss"` with neutral palette per D-03)

### Q4: Auto-focus the lookup input on mount?

**Options presented:**
- Yes — autoFocus on mount
- No — user clicks/taps to focus
- No on initial load, yes after try-again

**User chose:** **Yes — autoFocus on mount.** Removes one tap on mobile.

**→ Decision L-04**

---

## Area 2 — Form Scaffold Scope

### Q1: What does Phase 5 render on the form stage?

**Options presented:**
- Member rows visible, controls TODO-commented
- Member rows + non-functional controls + disabled submit
- Just an empty container + headline

**User chose:** **Member rows + non-functional controls + disabled submit.** Full form structure renders; Phase 6 wires the interactivity, validation, submit.

**→ Decision F-01**

### Q2: Meal-dropdown placeholder strings?

**Options presented:**
- Generic placeholder strings ("Option A/B/C")
- Phase 4's working enum ("chicken/fish/vegetarian")
- Title-cased food categories ("Chef's Chicken/Catch of the Day/Garden Plate")

**User chose:** **Generic placeholder strings ("Option A/B/C").** Forces Phase 6 (MEAL-02) to land real menu copy and makes it impossible to forget the swap at code review.

**→ Decision F-02**

### Q3: FormState shape — how much does Phase 5 commit?

**Options presented:**
- Full v0.2 state shape now
- Just lookup + household; Phase 6 adds submissions[]
- Stage + minimal hydration; Phase 6 owns the rest

**User chose:** **Full v0.2 state shape now.** Phase 6 doesn't refactor the type, only wires existing fields to controls. Avoids a mid-stream refactor moment.

**→ Decision D-02**

### Q4: When does the 'edit response' link ship?

**Options presented:**
- Phase 6 ships it
- Phase 5 ships the success stage shell (no edit link)
- Reuse v0.1 success view as-is for Phase 5

**User chose:** **Phase 6 ships it.** Phase 5 doesn't render a real success stage. Cleanest split: Phase 5 = lookup + form scaffold, Phase 6 = controls + submit + success view + edit-response link.

**→ Decision F-05**

---

## Claude's Discretion Items (not asked, decided to keep moving)

- **Miss banner copy** — working draft `We couldn't find you on the list` / `Double-check the spelling, or reach out to {support email}`. UI-researcher lands tone.
- **Server / network / validation banner copy on lookup** — reuse v0.1 verbatim with light noun swaps (`send your RSVP` → `search the list`).
- **Lookup submit button copy** — `Find My Invitation` idle, `Searching…` loading.
- **Form-stage heading** — `Your Group`.
- **Form-stage submit copy** — `Confirm Group RSVP` (disabled in Phase 5).
- **Stage-transition motion** — reuse `reveal-on-scroll` lightly on first form-stage render; respect `prefers-reduced-motion`.
- **Input type** — `type="text"` not `type="search"` (preserve v0.1 styling, avoid browser-injected clear button).
- **Hydration timing** — single `setForm` call on lookup hit sets `stage`, `household`, `submissions` atomically — no intermediate render.
- **Test approach** — no test framework installed per Phase 3 VALIDATION; manual smoke verification in the PLAN's `<verify>` blocks.
- **No splitting into subcomponents** — D-04 keeps the page as a single client island; revisit at Phase 6 if it grows unwieldy.

---

## Deferred Ideas

See `05-CONTEXT.md` `<deferred>` for the full list. Highlights:

- Form interactivity, validation, submit (Phase 6)
- Real meal copy (Phase 6 MEAL-02)
- Success view + edit-response link (Phase 6)
- URL-based stage persistence (out of scope)
- `/api/rsvp/route.ts` deletion (carries forward from Phase 4 D-16)
- Stage-aware left-column copy (D-05 explicit no)
- Subcomponent splitting (D-04 explicit no for Phase 5)

---

## Scope-Creep Redirects

None — the user stayed on-topic across both selected areas. No new capabilities surfaced that required redirection to deferred.
