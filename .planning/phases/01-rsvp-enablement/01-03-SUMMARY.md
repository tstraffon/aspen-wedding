---
phase: 01-rsvp-enablement
plan: 01-03
subsystem: ui
tags: [navigation, nextjs, link]

requires:
  - phase: 01-02
    provides: polished /rsvp page ready for discovery
provides:
  - "RSVP link visible in desktop nav and mobile dropdown menu"
  - "Active-state highlighting on /rsvp"
affects:
  - 01-04 (manual smoke checklist — final end-to-end gate)

tech-stack:
  added: []
  patterns: []

key-files:
  modified:
    - components/Navbar.tsx

key-decisions:
  - "Took the cleanest possible diff — uncommenting one line in the shared links array + deleting the placeholder comment. Both desktop and mobile dropdowns iterate the same array, so no per-surface code change was needed."

patterns-established: []

requirements-completed:
  - "REQ-05: Enable the commented-out RSVP nav link on both desktop and mobile menus"

duration: ~2min
completed: 2026-05-29
---

# Plan 01-03: Enable RSVP Nav Link — Summary

**Single uncomment + dead-comment deletion. RSVP now reachable as the last nav item on desktop and in the mobile dropdown, with active-state highlighting already covered by the existing pathname logic.**

## Performance

- **Duration:** ~2 min
- **Tasks:** 1/1
- **Files modified:** 1
- **Lines added/removed:** +1 / -2

## Accomplishments

- Removed the comment guard on the RSVP entry in the `links` array so both render paths pick it up.
- Deleted the dead "re-enable when ready" placeholder so the file has no breadcrumbs of the disabled state.

## Task Commits

1. **Task 1: Uncomment RSVP link + delete dead comment** — see HEAD commit

## Files Modified

- `components/Navbar.tsx` — Line 15: removed leading `// ` from the RSVP array entry. Line 75 area: deleted the `{/* RSVP button — re-enable when ready to collect responses */}` placeholder.

## Verification Gates Passed

| Check | Result |
|-------|--------|
| `grep -cE '^\s*//\s*\{\s*label:\s*"RSVP"'` | 0 ✓ |
| `grep -cE '\{\s*label:\s*"RSVP",\s*href:\s*"/rsvp"\s*\}'` | 1 ✓ |
| `grep -c 'RSVP button — re-enable'` | 0 ✓ |
| `npx tsc --noEmit` | exit 0 ✓ |
| `npm run build` | success ✓ |

Interactive verification (a-d in the plan: desktop nav, active state, mobile dropdown, click-through) maps cleanly to Plan 01-04's smoke checklist where they'll be exercised in a real browser.

## Plan Deviations

None.

## Known Issues (Out of Scope)

- Pre-existing lint errors in `app/(main)/itinerary/page.tsx` (unescaped apostrophes) carry over. Tech-debt for a future cleanup phase.
