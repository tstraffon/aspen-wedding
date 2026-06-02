---
phase: "05-name-lookup-gate-ui"
plan: "02"
subsystem: "rsvp-ui"
tags: ["form-scaffold", "member-rows", "attending-radios", "meal-select", "a11y", "hero-fade-up", "disabled-submit"]
requires:
  - "05-01-SUMMARY.md"  # FormState type shape + formHeadingRef anchor
  - "04-02-SUMMARY.md"  # Phase 4 lookup endpoint (locked)
  - "01-01-SUMMARY.md"  # Phase 1 UI patterns + tokens
provides:
  - "Full form-stage scaffold rendering on lookup hit (Your Group heading + N member rows + disabled Confirm Group RSVP button)"
  - "Per-member-namespaced attending radios with sr-only legend for screen-reader scoping (RESEARCH Q5)"
  - "Meal <select> placeholder enum Option A/B/C (F-02 deliberate divergence from Phase 4 backend enum so Phase 6/MEAL-02 swap is visible at code review)"
  - "hero-fade-up entrance animation via inline style with per-row stagger (RESEARCH Q6 deviation from CONTEXT line 85 motion guidance, with verified evidence)"
  - "Disabled-submit defense in depth (type=button + disabled + aria-disabled + no onClick + no enclosing form)"
  - "Belt-and-suspenders prefers-reduced-motion coverage for inline hero-fade-up animation (T-05-02-MOTION-A11Y mitigation — [style*='hero-fade-up'] rule in globals.css)"
affects:
  - "Phase 6 (consumes the form-stage scaffold to wire onChange on radios/select/input, add the <form onSubmit={...}> wrapper, transform attending: 'yes'|'no' → boolean before POSTing to /api/rsvp/submit, build the success view + GROUP-03 edit-response link)"
tech-stack:
  added: []
  patterns:
    - "Uncontrolled inputs (radios/select/dietary) in Phase 5 scaffold — Phase 6 converts to controlled against FormState"
    - "defaultValue='' with sentinel disabled option for meal select (avoids React uncontrolled warning)"
    - "Per-member fieldset+legend sr-only pattern for radio group accessibility (RESEARCH Q5)"
    - "Inline animation shorthand referencing hero-fade-up keyframe with per-row stagger delay"
key-files:
  created: []
  modified:
    - "app/(main)/rsvp/page.tsx"
    - "app/globals.css"
key-decisions:
  - "F-01: Radios, select, and dietary input are functionally inert in Phase 5 — no onChange, no value, uncontrolled"
  - "F-02: Meal options use Option A/B/C placeholder verbatim — deliberate divergence from Phase 4 backend enum to force Phase 6/MEAL-02 swap to be visible"
  - "F-03: Member names render in font-headline text-2xl; rows use space-y-12 vertical rhythm"
  - "F-04: formHeadingRef preserved from Plan 05-01; focus-on-hit effect already firing"
  - "F-05: success branch remains return null comment placeholder; Phase 6 owns"
  - "RESEARCH Q6 deviation: hero-fade-up (time-based, globals.css line 335) via inline animation style, NOT scroll-driven CSS utility"
  - "T-05-02-MOTION-A11Y: [style*='hero-fade-up'] added to prefers-reduced-motion block in globals.css"
requirements-completed: []
duration: "~10 minutes"
completed: "2026-06-01"
---

# Phase 05 Plan 02: Name-Lookup Gate UI (Form Scaffold) Summary

Full form-stage scaffold replacing the Plan 05-01 placeholder: `submissions.map(...)` member rows with warm-gold eyebrow, headline name, per-member-namespaced attending radios inside fieldset+sr-only-legend, meal select with Option A/B/C, dietary input, and disabled `Confirm Group RSVP` button at the bottom.

## What Was Built

`app/(main)/rsvp/page.tsx` — the `if (form.stage === "form")` branch was completed:

- Replaced the Plan 05-01 placeholder paragraph with a `submissions.map(...)` loop rendering one row per household member.
- Each row: `Guest {i+1}` eyebrow in warm-gold (`text-primary`, 11px uppercase tracking-widest), member `full_name` in `<h3 className="font-headline text-2xl">`.
- Attending Y/N: `<fieldset>` with `<legend className="sr-only">Will {full_name} be attending?</legend>` + visible `<span aria-hidden="true">Will you be attending?</span>` label + two `<input type="radio">` elements sharing `name={`attending-${sub.guest_id}`}` (per-member browser arrow-key scoping per RESEARCH Q5).
- Meal `<select>` with `defaultValue=""` sentinel + 3 placeholder options: `Option A`, `Option B`, `Option C` (F-02 deliberate divergence from Phase 4's `["chicken","fish","vegetarian"]` backend enum).
- Dietary `<input type="text">` with placeholder `Gluten-free, Vegan, Allergies...`, uncontrolled.
- Row entrance: `style={{ animation: 'hero-fade-up 700ms ease-out ${100 + i * 120}ms both' }}` — time-based per-row stagger (RESEARCH Q6 deviation).
- Disabled submit: `type="button"`, `disabled`, `aria-disabled="true"`, no `onClick`, no enclosing `<form>`.
- `app/globals.css` — one-line addition inside the existing `@media (prefers-reduced-motion: reduce)` block: `[style*="hero-fade-up"]` selector added to the animation-none rule (T-05-02-MOTION-A11Y mitigation — the existing block only covered named classes, not inline animation shorthand using the keyframe by name).

## Decision IDs Implemented

F-01 (inert controls), F-02 (Option A/B/C placeholder), F-03 (font-headline text-2xl + space-y-12), F-04 (formHeadingRef preserved + focus effect from Plan 05-01 already firing), F-05 (success branch stays comment).

## Deviations from Plan

### Auto-documented Deviations

**1. [Rule 2 - Missing critical functionality] `[style*="hero-fade-up"]` prefers-reduced-motion rule added to globals.css**
- **Found during:** Task 1 — the plan explicitly instructs executor to verify globals.css lines 611-625 and add a belt-and-suspenders rule if the existing block does not cover inline animation usage. Verified: the block at lines 613-621 only targets named class selectors (`.hero-reveal-label`, etc.), NOT `[style*="hero-fade-up"]` for inline animation shorthand.
- **Issue:** Without the extension, `prefers-reduced-motion: reduce` users would see the hero-fade-up entrance animation on member rows (T-05-02-MOTION-A11Y threat register item disposition: mitigate).
- **Fix:** Added `[style*="hero-fade-up"]` to the comma-separated selector list inside the existing `@media (prefers-reduced-motion: reduce)` block. One-line additive change.
- **Files modified:** `app/globals.css`
- **Commit:** `74a7041`

### Pre-existing Deviations (carried forward from Plan 05-01)

**2. [RESEARCH Q6 — Motion vocabulary] `hero-fade-up` instead of scroll-driven utility**
- CONTEXT line 85 suggested `reveal-on-scroll`. RESEARCH Q6 verified it uses `animation-timeline: view()` — scroll-driven, does not fire on in-viewport mounts. Form-stage rows mount inside the visible card on stage transition. Used `hero-fade-up` via inline `animation` style with 120ms stagger instead.

**3. [RESEARCH Q12-tail — Type boundary] `attending: "yes" | "no" | null` UI representation**
- D-02 locks this shape. Phase 4's `/api/rsvp/submit` expects boolean. Phase 6 transforms: `attending: sub.attending === "yes"`.

**4. [F-02 deliberate divergence] Option A/B/C vs Phase 4 backend enum**
- Phase 4 submit route uses `["chicken","fish","vegetarian"]`. Phase 5 uses `Option A/B/C` so the placeholder is impossible to ship accidentally. Phase 6/MEAL-02 swaps both.

## Verification Results

### Automated checks (all pass)

| Check | Result |
|-------|--------|
| `Your Group` heading present | PASS |
| `ref={formHeadingRef}` preserved | PASS |
| `submissions.map` present | PASS |
| `Confirm Group RSVP` present | PASS |
| `aria-disabled="true"` present | PASS |
| `Option A`, `Option B`, `Option C` all present | PASS |
| `hero-fade-up` present in rsvp/page.tsx | PASS |
| `attending-${sub.guest_id}` namespace pattern | PASS |
| `space-y-12` present | PASS |
| `sr-only` present | PASS |
| `<fieldset>` present | PASS |
| `<legend` present | PASS |
| `Will.*attending` present | PASS |
| `Meal Choice` present | PASS |
| `Dietary Restrictions` present | PASS |
| `Gluten-free, Vegan, Allergies` placeholder | PASS |
| `font-headline text-2xl` present | PASS |
| `Plan 05-02 renders` placeholder REMOVED | PASS |
| No `reveal-on-scroll` in rsvp/page.tsx | PASS |
| No `chicken` or `vegetarian` in rsvp/page.tsx | PASS |
| Phase 4 endpoint files untouched (git diff = 0) | PASS |
| `npx tsc --noEmit` exits 0 | PASS |
| `npx eslint 'app/(main)/rsvp/page.tsx'` — zero issues | PASS |

### Manual smoke (Task 2 — awaiting Tyler's browser verification)

The following 8 steps require browser-interactive verification at `http://localhost:3000/rsvp`.

**Prerequisites:**
1. `npm run dev` from repo root
2. Authenticate at `http://localhost:3000/login` with `aspen2026`
3. Dev seed loaded: Tyler Straffon + Emily Riley (2-member), Sarah Else (1-member), Sarah Horan (1-member)

**Step 1 — Initial render:**
- URL: `http://localhost:3000/rsvp`
- Expected: lookup card only — name field + `Find My Invitation` button. Cursor in the input. No member rows.

**Step 2 — Empty submit:**
- Click `Find My Invitation` with empty input.
- Expected: `validation` banner, destructive (red) palette, heading `Something didn't look right`, focus returns to input.

**Step 3 — Miss + Try again:**
- Type `Jane Doe`. Submit.
- Expected: `miss` banner in NEUTRAL (grey) palette, heading `We couldn't find you on the list`, body with `hello@emilyandtyler.com` + `Try again` button.
- Click `Try again`. Expected: input clears, banner gone, focus returns to input.

**Step 4 — Hit, MULTI-member household:**
- Type `Tyler Straffon`. Submit.
- Expected: `Your Group` heading + Member row 1: `Guest 1` eyebrow, `Emily Riley` in font-headline text-2xl, `Will you be attending?` with Yes/No radios, `Meal Choice` select (showing `Select a meal…`), `Dietary Restrictions` input. Member row 2: same anatomy with `Tyler Straffon`. Space between rows ~48px. Rows fade-up on entry. Disabled `Confirm Group RSVP` button (opacity-60, cursor-not-allowed), clicking does nothing.
- Arrow-key check: click Member 1's `Yes` radio, press down arrow — focus should move to Member 1's `No` (NOT Member 2's `Yes`).

**Step 5 — Hit, SINGLE-member household:**
- Refresh `/rsvp`. Type `Sarah Else`. Submit.
- Expected: form stage with `Your Group` + ONE row (`Guest 1`, `Sarah Else`) + disabled submit. No second row.

**Step 6 — Visual check: meal options:**
- From Step 5's form stage, open meal select for Sarah Else.
- Expected: `Option A`, `Option B`, `Option C`. No `chicken`, `fish`, `vegetarian`.
- Refresh, type `Nobody`, submit — miss banner should still use NEUTRAL (grey) palette, not red.

**Step 7 — Network offline:**
- Refresh `/rsvp`. Devtools Network → Offline. Type `Tyler Straffon`. Submit.
- Expected: `network` banner (destructive palette, `We couldn't search the list`).
- Re-enable network. Submit again — form stage with both Tyler + Emily rows.

**Step 8 — Mobile 375px:**
- Devtools device toolbar → 375px. Type `Tyler Straffon`. Submit.
- Expected: form card stacks below left column. Member rows stack vertically. No horizontal scroll. `Confirm Group RSVP` button full-width at bottom. Tapping a radio visually toggles it (no persistence expected).

**Status: DEFERRED TO USER — all 8 steps require browser interaction**

## AC Coverage

### UI-SPEC Acceptance Criteria — Phase 5 Coverage Closeout

Items marked with (05-02) ship in this plan; (05-01) shipped in Plan 05-01.

**Functional**
- (05-01) `/rsvp` renders single name field on initial load
- (05-02) Hit transitions to form with member rows for every household member
- (05-01) Miss shows miss banner with email + Try again
- (05-01) Try again clears + refocuses input
- (05-01) Network failure renders network banner
- (05-01) Server 5xx renders server banner
- (05-01) Empty submit renders validation banner
- (05-02) Form-stage submit button disabled with `Confirm Group RSVP`
- (05-01) FormState type matches D-02
- (05-01) submissions hydrated inline (single setForm)

**Visual**
- (05-01) All Phase 1 tokens preserved
- (05-01) Miss banner uses neutral palette
- (05-01) Error banners use destructive palette
- (05-02) Member names render in `font-headline text-2xl`
- (05-02) Meal selects show `Option A / B / C`
- (05-01) Left column pixel-identical across stages
- (05-01) Form card chrome unchanged between stages
- (05-02) Member rows use `space-y-12`

**Copy**
- (05-01) Lookup idle `Find My Invitation`
- (05-01) Lookup busy `Searching…`
- (05-01) Miss heading verbatim
- (05-01) Miss body + Try again button
- (05-01) Network heading verbatim
- (05-01) Server heading verbatim
- (05-01) Validation heading verbatim
- (05-01/02) Form heading `Your Group`
- (05-02) Form submit `Confirm Group RSVP`
- (05-02) Meal options verbatim `Option A` / `Option B` / `Option C`

**Interaction**
- (05-01) autoFocus on lookup input
- (05-01) Lookup input attributes per L-07
- (05-01) On hit, focus moves to form heading (formHeadingRef wired in 05-01, preserved in 05-02)
- (05-01) On errorKind set, focus routes correctly
- (05-01) Miss Try again refocuses input
- (05-01) aria-busy on form during search
- (05-02) aria-disabled on form-stage submit
- (05-02) All decorative Material Symbols have aria-hidden (east arrow on submit)
- (05-02) Member attending radios namespaced per member via `name="attending-${guest_id}"`
- (05-02) Form-stage rows use `hero-fade-up` (RESEARCH Q6 deviation); prefers-reduced-motion covered by globals.css addition

**Testing**
- (05-01) Steps 1, 2, 3, 7 (lookup smoke) — regression check in Task 2
- (05-01) Step 8 (mobile 375px) — re-run with form scaffold in Task 2
- (05-02) Steps 4, 5, 6 (form scaffold smoke with real rows) — Task 2
- (05-02) Step 8 (mobile 375px with form scaffold) — Task 2

**Phase 5 AC coverage is complete after Tyler approves Task 2. Every UI-SPEC checkbox is owned by Plan 05-01 or Plan 05-02. No unticked items remain.**

## Phase 5 Phase-Closing Note

Phase 5 ships GUEST-02 + GUEST-03 (Plan 05-01) and the form-stage scaffold (Plan 05-02). Phase 6 wires interactivity against the scaffold without restructuring it: add `<form onSubmit={...}>` wrapping the member rows + submit, switch the radios/select/input to controlled inputs against the existing `form.submissions` state, add validation, transform `attending: "yes"|"no"` to boolean before POSTing to `/api/rsvp/submit` (the Phase 4 endpoint expects `attending: boolean`), build the success view inside the `if (form.stage === 'success')` branch, and add the GROUP-03 edit-response affordance that returns to `stage: 'lookup'`. The FormState type does NOT change (D-02 lock).

## Handoff to Phase 6

Phase 6 entry list (four scaffold-to-interactivity work items):

1. **Controlled inputs**: Convert radios to `checked={sub.attending === "yes" | "no"}` + `onChange` that updates `form.submissions[i].attending` via setForm. Convert meal select to `value={sub.meal_choice ?? ""}` + `onChange` updating `form.submissions[i].meal_choice`. Convert dietary input to `value={sub.dietary_restrictions}` + `onChange` updating `form.submissions[i].dietary_restrictions`.
2. **Form wrapper + submit handler**: Add `<form onSubmit={handleSubmit}>` around the member rows and submit button. Change button `type="button"` back to `type="submit"`. Remove `disabled` + `aria-disabled` once validation gates enable. Implement `handleSubmit`: transform submissions (`attending: sub.attending === "yes"`) and POST to `/api/rsvp/submit`.
3. **Success view**: Replace `if (form.stage === 'success') return null;` with the full success view per F-05 + GROUP-03 edit-response link that returns to `stage: 'lookup'`.
4. **Meal options (MEAL-02)**: Replace `Option A/B/C` placeholder enum in the select with real menu copy. Also update Phase 4 submit route's placeholder enum at the same time so the two layers swap together.

## Known Stubs

- Meal options: `Option A`, `Option B`, `Option C` — intentional F-02 placeholder. Phase 6/MEAL-02 replaces with real menu copy.
- Success stage: `if (form.stage === 'success') return null;` — intentional F-05 placeholder. Phase 6 builds the full view.
- Attending, meal, dietary inputs: uncontrolled (no value/onChange) — intentional F-01 Phase 5 scaffold. Phase 6 converts to controlled.

## Threat Flags

None. No new network surface, no `dangerouslySetInnerHTML`, `full_name` rendered via React JSX text escape path. The `[style*="hero-fade-up"]` prefers-reduced-motion addition in globals.css closes T-05-02-MOTION-A11Y. All other threat register items satisfied as documented in the plan.

## Self-Check

- `app/(main)/rsvp/page.tsx` exists: FOUND
- `app/globals.css` exists (with [style*="hero-fade-up"] addition): FOUND
- Commit `74a7041` exists: FOUND
- `npx tsc --noEmit`: exits 0
- All 23 automated verify checks: PASS
- Phase 4 route files: 0 diff lines
- `npx eslint 'app/(main)/rsvp/page.tsx'`: zero issues

## Self-Check: PASSED
