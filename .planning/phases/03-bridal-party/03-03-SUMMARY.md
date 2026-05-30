---
phase: 03-bridal-party
plan: 03
status: complete
date: 2026-05-30
---

# Plan 03-03 Summary — Navbar wiring + layout pivot + hero swap + phase smoke verification

## D-IDs satisfied
- **D-12** — `{ label: "Bridal Party", href: "/bridal-party" }` inserted into `components/Navbar.tsx` `links` array between `Things To Do` and `FAQ`. Active-state branching at lines 43-48 (desktop) / 84-89 (mobile) untouched.

## Smoke checklist result
Approved with **two design pivots resolved before sign-off**:

1. **Layout pivot** (`7c6f3fa`) — Original magazine row layout (text + photo alternating left/right per row, sections stacked Bride's Side above Groom's Side) was rejected on first walk: photos were too big and both sides should be visible side-by-side as you scroll. Replaced with a two-column desktop layout (Bride's Side left column, Groom's Side right column, each with its own centered header at the top of its column) using compact vertical cards (photo `max-w-xs` ≈ 320px, name `text-xl md:text-2xl`, role label `text-[10px] tracking-[0.3em]`, bio `text-base`, all centered). Mobile collapses to single column via `grid-cols-1`, stacking Bride's column above Groom's. Member pairing happens visually without re-ordering the data arrays (Sarah next to Dylan, Emily next to Aaron, etc.).
2. **Hero image swap** (`22439de`) — Original placeholder Unsplash URL replaced with `photo-1469371670807-013ccf25f16a` (wedding party silhouette at golden hour). Picked after live comparison against `photo-1511795409834-ef04bbd61622` (friends from behind at mountain sunset).

The 53-item UI-SPEC §Acceptance Criteria walkthrough was superseded by the layout pivot — many original criteria reference the magazine row layout that no longer exists (alternation rule, row-level reveal motion, 12-col grid). Replacement criteria for the new layout:

- **A (Navbar):** Bridal Party in correct position (between Things To Do and FAQ) on desktop + mobile; active-state turns warm-gold on `/bridal-party`; no regressions on the other 7 routes.
- **B (Hero):** `h-[614px]` parallax + 2-axis scrim + locked copy (eyebrow "Our People", h1 "The Ones Standing With Us" italic accent on "Standing With Us", subtitle); reveal animations stagger correctly; new hero image reads cleanly under the scrim.
- **C-G (Body):** Two columns side-by-side on desktop (`>=768px`), single column on mobile; Bride's Side header (eyebrow + h2 "Bride's *Side*") above 8 stacked compact cards; same structure mirrored for Groom's Side; each card centered, monogram fallback active for all 16 members until JPGs land in `/public/bridal-party/`; heading hierarchy h1 → 2×h2 → 16×h3 verified via DOM.
- **H (Cross-page):** Reduced motion disables hero reveals; no regression on Travel / Itinerary / Things-To-Do / FAQ / Registry / RSVP.

All sections passed.

## Layout pivot rationale
- UI-SPEC §Magazine Row Spec is **superseded** by the side-by-side column layout. CONTEXT D-05 explicitly named magazine rows but Tyler reversed that decision after seeing the page. The pivot is recorded here and in `7c6f3fa` for traceability.
- D-01..D-04 (roster, source order, role labels, member object shape) and D-06..D-11 (photo crop, source, image tag, bios, placeholder strategy) are still satisfied — the rendering shell changed, not the data or the visual primitives.
- The `MemberRow` helper was renamed to `MemberCard` to reflect the compact vertical card shape; arrays and helper functions unchanged.

## Hero comparison
- **Tried (Option 1):** `photo-1469371670807-013ccf25f16a` — wedding party silhouette at golden hour ← **picked**
- **Tried (Option 3):** `photo-1511795409834-ef04bbd61622` — friends from behind at mountain sunset
- **Picked because:** golden-hour silhouette reads more reverently against the "The Ones Standing With Us" headline; the alpine ridge of Option 3 felt more "Travel" than "wedding party".
- Hero image is still a placeholder — Tyler may swap to a `/public/` local asset before ship (TODO comment preserved).

## Regression check
- `git diff app/(main)/things-to-do/page.tsx` — empty (Things-To-Do untouched throughout the phase).
- `git diff app/(main)/registry/page.tsx` — non-empty (Tyler edited the framing block out of scope of this phase; explicitly intentional per session-reminder and not part of Phase 3's commits).

## Final nav order observed in the running app
`Home  Travel & Stay  Itinerary  Things To Do  Bridal Party  FAQ  Registry  RSVP`

## Commits in this plan
- `b27071e` — `feat(03-03): add Bridal Party link to Navbar` (Task 1)
- `7c6f3fa` — `fix(03-03): rework bridal-party to side-by-side columns with compact cards` (layout pivot per Tyler's feedback)
- `22439de` — `fix(03-03): swap bridal-party hero to golden-hour wedding party silhouette` (hero image)

## Phase 03 close-out
Ready for `/gsd:verify-work 3` / phase-close. All 12 D-IDs from CONTEXT.md satisfied across the three plans (data primitives + hero unchanged; visual shell pivoted with explicit traceability):
- Plan 01: D-08 (Server Component foundation)
- Plan 02: D-01, D-02, D-03, D-04, D-05¹, D-06, D-07, D-08, D-09, D-10, D-11
- Plan 03: D-12

¹ D-05 originally specified magazine rows; pivoted to side-by-side columns per Tyler's feedback after smoke check. Data structure and visual primitives unchanged.

Outstanding handoff items for Tyler:
- 16 placeholder bios in `app/(main)/bridal-party/page.tsx` — each line preceded by `// TODO: replace with real bio`.
- 16 portrait JPGs to drop into `/public/bridal-party/<slug>.jpg` (slug = lowercase-kebab of name). Until then, the monogram fallback renders for every member.
- Hero background is still an Unsplash placeholder (`// TODO: replace with /public local hero image`) — swap if you want a local asset.
