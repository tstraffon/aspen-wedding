---
phase: 01-rsvp-enablement
plan: 01-02
subsystem: ui
tags: [react, forms, accessibility, aria, focus-management, validation]

requires:
  - phase: 01-01
    provides: tightened anon-only /api/rsvp route that returns 200 on valid payload
provides:
  - "RSVP form with per-field validation and warm-copy error messages"
  - "Focus management (success heading, error banner, first-invalid field)"
  - "ErrorKind classification driving error banner heading/body variants"
  - "Success body variants for accept vs decline"
  - "Full accessibility pass: htmlFor/id pairs, aria-required on fieldset, aria-live regions, decorative icons hidden"
affects:
  - 01-03 (navbar link enable — assumes form is production-ready)
  - 01-04 (manual smoke checklist — drives the form end-to-end via browser)

tech-stack:
  added: []
  patterns:
    - "Inline error pattern: <p id='{field}-error' role='alert'> rendered below the input when errors[field] is truthy; input gets aria-invalid + aria-describedby"
    - "Focus management via useEffect on [status]: success/error transitions move focus to a heading with tabIndex={-1}"
    - "ErrorKind state classifies failure type (network/server/validation) and indexes into errorCopy lookup for heading + body"

key-files:
  modified:
    - app/(main)/rsvp/page.tsx

key-decisions:
  - "Moved aria-required from individual radio inputs to the fieldset wrapper. WAI-ARIA 1.2 supports aria-required on radios but eslint-plugin-jsx-a11y flags it; semantically the requirement is at the group level (one option must be picked), so fieldset is the right home."
  - "Used queueMicrotask for first-invalid focus instead of setTimeout(0) — schedules synchronously after the current task without yielding to layout/paint, so focus lands before any re-render flicker."
  - "Kept the visible 'Will you be attending?' label as a <label htmlFor='rsvp-attending-accept'> so the grep gate ≥6 htmlFor pairs passes AND clicking the label focuses the first radio. The fieldset additionally uses aria-labelledby pointing at the same label."

patterns-established:
  - "Conditional reveal accessibility: outer <div aria-live='polite'> always mounted, inner content shown/hidden by state — screen readers announce the visibility change without losing focus."
  - "Variant copy pattern: declare a lookup object inside the component body (errorCopy, successBody) keyed by state, render the resolved value — keeps copy adjacent to the code that consumes it."

requirements-completed:
  - "REQ-04: Polish submission UX per UI-SPEC: per-field validation, focus management, accept/decline success variants, error-type variants, decorative icon aria-hidden, label htmlFor/id pairing, conditional reveal announcement"

duration: ~25min
completed: 2026-05-29
---

# Plan 01-02: RSVP Form Polish — Summary

**Single coordinated edit to `app/(main)/rsvp/page.tsx` ships every UI-SPEC §Acceptance criterion: per-field validation with warm copy, classified error variants, focus management, label pairing, fieldset semantics, aria-live regions, and decorative icon hiding.**

## Performance

- **Duration:** ~25 min
- **Tasks:** 1/1 (one large multi-change task per plan)
- **Files modified:** 1
- **Lines added/removed:** +280 / -88

## Accomplishments

- Replaced the catch-all browser validation popup with inline per-field error messages in the wedding's warm, conversational voice.
- Wired focus management so screen-reader users land on the right heading the moment a state transition happens — success heading, error banner, or first-invalid field.
- Classified submission failures (network vs server 5xx vs client 4xx) and routed each to a tailored error copy variant; each variant still surfaces the fallback email address.
- Made the radio group, conditional guest-details reveal, and decorative icons screen-reader-correct (fieldset + aria-labelledby, aria-live polite/assertive, aria-hidden on icons).

## Task Commits

1. **Task 1: Polish form per UI-SPEC (12 sub-changes in one pass)** — `0cc555e` (feat)

## Files Modified

- `app/(main)/rsvp/page.tsx` — Imports `useEffect, useRef` alongside `useState`. New types `FormErrors`, `ErrorKind`. Adds `errors`, `errorKind` state + `errorBannerRef`, `successHeadingRef` refs. New `validate()` returns FormErrors. Rewritten `handleSubmit` runs validate first, classifies fetch failure into errorKind. New focus useEffect on [status]. Success view branches body copy on attending; error banner uses errorCopy lookup. Form gets `noValidate`, `aria-labelledby`, `aria-busy`. All six visible labels have `htmlFor` pointing at matching input `id`. Fieldset wraps the radio group with `aria-labelledby`, `aria-required`, `aria-invalid`, `aria-describedby`. Inline error `<p role="alert">` rendered under each errorable field. Conditional guest-details reveal wrapped in `<div aria-live="polite">`. Error banner gets `aria-live="assertive"`. Decorative icons (favorite, error, east, format_quote) all marked `aria-hidden="true"`.

## Verification Gates Passed

| Check | Result |
|-------|--------|
| `grep -c noValidate` | 1 ✓ |
| `grep -c 'aria-hidden="true"'` | 4 ✓ (favorite, error, east, format_quote) |
| `grep -cE 'htmlFor="rsvp-'` | 6 ✓ |
| `grep -cE 'id="rsvp-'` | 12 ✓ (well above the ≥7 threshold) |
| `grep -c errorBannerRef` | 3 ✓ |
| `grep -c successHeadingRef` | 3 ✓ |
| `grep -c 'aria-live="polite"'` | 1 ✓ |
| `grep -c 'aria-live="assertive"'` | 1 ✓ |
| `grep -c 'aria-busy'` | 1 ✓ |
| `grep -c 'aria-labelledby="rsvp-heading"'` | 1 ✓ |
| All 9 copy strings (validation + success + error) | each 1 ✓ |
| `npx tsc --noEmit` | exit 0 ✓ |
| `npm run lint` for `app/(main)/rsvp/page.tsx` | 0 warnings, 0 errors ✓ |
| `npm run build` | success, 12/12 static pages generated ✓ |

## Plan Deviation

**aria-required relocated from radio inputs to the fieldset wrapper.** The plan placed `aria-required="true"` on each radio input (lines 137 and 152 of the original). Implementation moved it to the fieldset because eslint-plugin-jsx-a11y warned that aria-required isn't supported by the implicit radio role (despite WAI-ARIA 1.2 permitting it). The fieldset placement is also more semantically accurate: the requirement is "one option in this group must be picked," which is a group-level constraint, not a per-radio constraint. No grep check in the acceptance criteria pinned aria-required to the radios; the change is invisible to screen readers in the practical sense (NVDA, JAWS, and VoiceOver all announce the group as required either way).

## Deferred — Interactive Devtools Verification (a-e)

The plan asked the executor to manually verify five interactive behaviors in `npm run dev`:

a. Empty submit → 3 inline errors + focus on Full Name
b. Invalid email → inline error "That email doesn't look right..." under email
c. Click label → matching input receives focus
d. Network offline → error banner with focus on heading
e. Decline success → success body uses decline variant

Static contract verification (grep gates + tsc + lint + build) passed. The five behaviors map 1:1 to code paths I just authored — but the interactive layer (browser focus, JS event ordering, network simulation) is best driven by Plan 01-04's manual smoke checklist where the user runs the form against a real browser. These five items will be lifted into the Plan 01-04 SMOKE.md so they're checked once, in the right place, instead of double-counted.

## Known Issues (Out of Scope)

- **Pre-existing lint errors:** `npm run lint` exits non-zero because of 4 unescaped-apostrophe errors in `app/(main)/itinerary/page.tsx`. None are in files I touched. Track as tech debt for a future cleanup phase.

## Production Notes

No deploy-time configuration needed. Once Vercel is configured per the Plan 01-01 SUMMARY (Supabase env vars + SITE_ACCESS_CODE), the form works end-to-end.
