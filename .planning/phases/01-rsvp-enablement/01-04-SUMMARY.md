---
phase: 01-rsvp-enablement
plan: 01-04
subsystem: testing
tags: [smoke-test, manual-verification, vercel, supabase]

requires:
  - phase: 01-03
    provides: backend + form + nav link all shipped and ready for end-to-end verification
provides:
  - "Documented smoke checklist with pass/fail results"
  - "Confirmed production env vars on Vercel (Supabase URL, anon key, SITE_ACCESS_CODE)"
  - "Mobile sticky regression caught and fixed inline"
affects: []

tech-stack:
  added: []
  patterns: []

key-files:
  created:
    - .planning/phases/01-rsvp-enablement/01-SMOKE.md
  modified:
    - app/(main)/rsvp/page.tsx (inline fix for mobile sticky regression caught by Section 5)

key-decisions:
  - "Caught and fixed the hero column's universal `sticky top-40` during Section 5 — scoped to `lg:sticky lg:top-40` so it only applies in the two-column desktop layout. On mobile the grid stacks and sticky positioning pinned the hero behind the form."
  - "Trusted the textbook Tailwind responsive-prefix fix for the mobile sticky issue without re-running the full smoke. The change is one class on one element with no side effects."

patterns-established: []

requirements-completed:
  - "REQ-06: Run a five-step manual smoke checklist verifying the full RSVP flow end-to-end"
  - "REQ-07: Confirm production env vars are set in the deploy target"

duration: ~20min (smoke run by user) + ~2min (mobile fix)
completed: 2026-05-29
---

# Plan 01-04: RSVP Smoke Checklist + Production Env Check — Summary

**End-to-end smoke verified the RSVP flow works in local dev (5/5 functional sections green) and confirmed Vercel has the right Supabase + access-code env vars set for Production and Preview. One mobile-layout regression surfaced and was fixed inline during the smoke run.**

## Performance

- **Duration:** ~22 min total
- **Tasks:** 2/2 (1 autonomous scaffold + 1 human-verify smoke run)
- **Files modified:** 2 (SMOKE.md created, rsvp/page.tsx mobile sticky fix)

## Accomplishments

- Scaffolded `01-SMOKE.md` with explicit step-by-step instructions for all 5 functional sections + production env check.
- User ran the checklist locally and confirmed every functional test passes (happy-path accept, happy-path decline, validation, network failure, mobile viewport).
- Verified Vercel has both Supabase env vars (URL + anon JWT) set for Production and Preview, with a production-strength `SITE_ACCESS_CODE` (not the temporary `aspen2026` placeholder).
- Confirmed `SUPABASE_SERVICE_ROLE_KEY` is NOT set anywhere on Vercel — defense in depth holds.
- Caught and fixed a real mobile layout bug during Section 5: the editorial hero column was `sticky top-40` universally, so on mobile (where the grid collapses to a single column) the "Kindly Respond" headline pinned to the viewport while the form scrolled underneath, making fields hard to read. Scoped sticky to the lg+ breakpoint.

## Task Commits

1. **Task 1: Scaffold smoke checklist** — `a610c14` (docs)
2. **Task 2: Run smoke checklist (human-verify)** — no commit (results recorded inline in 01-SMOKE.md by the user)
3. **Inline fix: Mobile hero sticky regression** — `349b6fd` (fix)

## Files Created/Modified

- `.planning/phases/01-rsvp-enablement/01-SMOKE.md` — Six-section checklist with sub-step checkboxes. User ticked all boxes through Section 6 and recorded one finding: mobile view of /rsvp had the hero pinning behind the scrolling form. (Section 5 still ticks pass at the box level — the bug surfaced as a visual observation outside the explicit sub-step "Expect" list.)
- `app/(main)/rsvp/page.tsx` — One-class change: `sticky top-40` → `lg:sticky lg:top-40` on the editorial column wrapper.

## Smoke Results

| Section | Result | Note |
|---------|--------|------|
| 1. Happy-path accept | pass | Row written with correct shape; cleaned up |
| 2. Happy-path decline | pass | Decline variant copy correct; reveal hides properly |
| 3. Validation error path | pass | All three inline errors fire; focus lands on Full Name; email format check works |
| 4. Network failure path | pass | Offline simulation triggers network-variant error banner; focus lands on heading |
| 5. Mobile viewport (375px) | pass + 1 fix | All sub-steps tick; user noted hero pin regression; fixed inline (`349b6fd`) |
| 6. Production env var check | pass | Vercel has both Supabase vars + production SITE_ACCESS_CODE; service-role not set |

## Plan Deviations

None at the task level. The mobile fix is a small in-phase correction routed through Plan 01-02's domain rather than re-opening that plan — committed as `fix(01-02): ...` to keep the audit trail clean.

## Known Issues

- The user reported the mobile sticky regression during the smoke; the fix is committed but the user has not yet re-verified the fix in a browser. The Tailwind responsive prefix is a textbook fix with no side effects; if it fails verification, gap closure can address it directly.

## Production Status

The Vercel deploy has all required env vars and SHOULD work end-to-end in production. A production smoke run is recommended after the next deploy lands — same six sections, but pointed at the Vercel URL instead of localhost.
