---
phase: 03-bridal-party
plan: 01
subsystem: bridal-party
tags:
  - bridal-party
  - hero
  - scaffold
  - server-component
requirements:
  satisfied: []
  foundation_for:
    - D-08  # Server Component without next/image — Plan 02 enacts D-08 by adding the first plain <img>
dependency-graph:
  requires:
    - app/(main)/layout.tsx  # auto-wraps Navbar/Footer/MusicButton
    - app/globals.css        # hero-parallax-bg, hero-reveal-* motion utilities
  provides:
    - route: /bridal-party (static)
    - artifact: app/(main)/bridal-party/page.tsx (Server Component shell)
    - shells: two empty <section> placeholders (#bride-side, #groom-side) for Plan 02
  affects:
    - none
tech-stack:
  added: []
  patterns:
    - Next.js 16 Server Component (no "use client", no hooks)
    - 2-axis cinematic scrim (Registry e82d7d4 verbatim carry)
    - hero-reveal-* + hero-parallax-bg motion classes
key-files:
  created:
    - app/(main)/bridal-party/page.tsx
  modified: []
decisions:
  - hero_copy: "Locked verbatim per UI-SPEC §Copywriting Contract — 'The Ones Standing With Us' with italic accent on the full phrase 'Standing With Us' (deliberate departure from Registry single-word italic)"
  - placeholder_image: "Used UI-SPEC suggested Unsplash URL (photo-1529626455594-4ff0802cfb7e) — Tyler swaps to /public local asset pre-ship"
  - section_shells: "Inserted two <section py-24 md:py-32 bg-background> placeholders with max-w-[1440px] containers + TODO(03-02) markers so Plan 02 only writes content, not chrome"
metrics:
  duration: 1m13s
  completed: 2026-05-30
  tasks_completed: 1
  files_changed: 1
  lines_added: 65
---

# Phase 03 Plan 01: Bridal Party Scaffold Summary

Created `app/(main)/bridal-party/page.tsx` as a Next.js 16 Server Component with metadata, the verbatim Phase-2 cinematic hero (2-axis scrim from Registry `e82d7d4`), locked Phase-3 hero copy, and two empty `<section>` shells where Plan 02 will populate the Bride's Side and Groom's Side magazine rows.

## What was built

**One new file:** `app/(main)/bridal-party/page.tsx` (65 lines)

Contents top-to-bottom:
1. `import type { Metadata } from "next";` — sole import for this plan
2. `export const metadata` with title `Bridal Party — Emily & Tyler` and description `The 16 people standing with us on our Aspen wedding weekend.`
3. `export default function BridalPartyPage()` returning a `<main>` with three children:
   - Hero `<section className="relative h-[614px] w-full overflow-hidden bg-background">` — parallax bg, 2-axis scrim, locked eyebrow + h1 + subtitle, all three `hero-reveal-*` motion classes
   - `<section id="bride-side" className="py-24 md:py-32 bg-background">` shell with `max-w-[1440px]` container and `{/* TODO(03-02): Bride's Side section header + 8 magazine rows */}` marker
   - `<section id="groom-side" className="py-24 md:py-32 bg-background">` shell with `max-w-[1440px]` container and `{/* TODO(03-02): Groom's Side section header + 8 magazine rows */}` marker

## Hero content (verbatim, locked)

| Element  | Copy                                                                                                |
|----------|-----------------------------------------------------------------------------------------------------|
| Eyebrow  | `Our People`                                                                                        |
| Headline | `The Ones ` + `<span class="italic font-light text-primary/80">Standing With Us</span>`             |
| Subtitle | `Eight on each side — the people we&apos;ve leaned on, laughed with, and could not picture this weekend without.` |

Placeholder hero image: `https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1600&q=80` (per UI-SPEC §Hero Spec) — flagged for `/public/` swap pre-ship via the inline `{/* TODO: replace with /public local hero image */}` comment.

## Verification

- `npm run lint` -> exit 0; new file emits zero errors and zero warnings. The 4 pre-existing errors in `app/(main)/itinerary/page.tsx` and 21 pre-existing warnings elsewhere predate this phase and are unchanged.
- `npm run build` -> exit 0; TypeScript compiled clean (`Finished TypeScript in 981ms`).
- Build route manifest lists `/bridal-party` as `○ (Static)` — confirming the page is pre-rendered as expected for a no-data Server Component.
- `git diff` for the commit is restricted to the single new file (no other mutations).

## D-IDs

- **Foundation laid for D-08** (plain `<img>` over `next/image`): page imports neither `next/image` nor `Image`. Plan 02 enacts D-08 directly by adding the first `<img>` with `eslint-disable-next-line @next/next/no-img-element`.
- **No D-IDs fully satisfied** in this plan — Plan 01 is pure scaffolding. D-01 (Bride's Side first), D-05 (alternating magazine rows), D-06 (`aspect-[4/5]`), D-07 (monogram fallback), D-08 (plain `<img>` enacted) all land in Plan 02. D-09 (Navbar entry) lands in Plan 03.

## Hero UI-SPEC acceptance criteria — observed green

| Criterion | Status | Evidence |
|-----------|--------|----------|
| A1 — page route 200 at `/bridal-party` under (main) layout | green | Build manifest lists `/bridal-party` as static; (main) layout auto-wraps |
| A2 — tab title `Bridal Party — Emily & Tyler` | green | `metadata.title` literal match |
| B1 — hero dimensions `relative h-[614px] w-full overflow-hidden bg-background` | green | grep match on outer section className |
| B2 — parallax bg div with `hero-parallax-bg` class + inline Unsplash URL | green | grep `hero-parallax-bg` count = 1; URL literal present |
| B3 — 2-axis scrim with both gradient strings verbatim | green | both `linear-gradient(to bottom, ...)` and `linear-gradient(to right, ...)` substrings present |
| B4 — eyebrow `Our People` with `hero-reveal-label` class | green | grep counts = 1 each |
| B5 — h1 `The Ones` + italic-warm-gold span `Standing With Us` with `hero-reveal-title` | green | grep `italic font-light text-primary/80` count = 1; literal `Standing With Us` present |
| B6 — subtitle verbatim with `hero-reveal-subtitle` class | green | both `Eight on each side` and `could not picture this weekend without.` present |
| H1 — single `<h1>` on page | green | `<h1` count = 1; `<h2` and `<h3` counts = 0 |
| H2 — both parallax-bg div and scrim div carry `aria-hidden="true"` | green | `aria-hidden="true"` count = 2 |
| H5 — no client hooks, no `next/image`, no `next/link`, no `"use client"` | green | grep for `useState\|useEffect\|usePathname\|next/image\|next/link\|"use client"` returns empty |

## Deviations from Plan

None — plan executed exactly as written. Hero ported verbatim, both section shells inserted with the exact TODO markers prescribed, no auto-fixes triggered (no bugs, no missing functionality, no blocking issues).

## Known Stubs

The two `<section>` shells (`#bride-side`, `#groom-side`) are intentional stubs — they render empty whitespace below the hero. Plan 02 owns populating them with section headers + 16 magazine rows. The stubs are bounded by `{/* TODO(03-02): ... */}` markers and are documented in this plan's `<must_haves>` truths. The page goal at this checkpoint (route renders with hero) is achieved; the page goal at the phase level (visible bridal party content) explicitly requires Plan 02.

## Handoff to Plan 02

The file `app/(main)/bridal-party/page.tsx` contains two `<section>` shells with `{/* TODO(03-02): ... */}` markers ready for content insertion:

- `<section id="bride-side" className="py-24 md:py-32 bg-background">` → outer chrome done; the `max-w-[1440px] mx-auto px-6 md:px-12` container is ready. Plan 02 fills it with the Bride's Side header (`THE BRIDE'S SIDE` eyebrow + `Bride's *Side*` h2) and 8 magazine rows.
- `<section id="groom-side" className="py-24 md:py-32 bg-background">` → same setup. Plan 02 fills with Groom's Side header + 8 rows.

**Plan 02 should NOT modify:**
- The hero section (locked)
- The `<main>` element or its outer structure
- The metadata export (matches phase contract)
- The section wrappers themselves — only their inner `<div>` contents

**Plan 02 will need to add imports** for any data-driven row helpers (e.g., the `getInitials` pure helper described in UI-SPEC §Monogram Fallback Spec).

## Untouched (per plan contract)

- `components/Navbar.tsx` — Plan 03 wires the Bridal Party nav entry. No changes here.
- `app/globals.css` — motion utilities already exist from Phase 2; this plan only references them by class name.
- All other pages (`/registry`, `/travel`, `/things-to-do`, `/itinerary`, `/faq`, `/rsvp`, `/`) — zero edits.

## Commit

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Scaffold bridal-party page with hero + section shells | `decb6af` | `app/(main)/bridal-party/page.tsx` |

## Self-Check: PASSED

- File exists: `app/(main)/bridal-party/page.tsx` -> FOUND
- Commit exists: `decb6af` -> FOUND
- Lint: exit 0 (no new errors)
- Build: exit 0 (`/bridal-party` listed as static `○` route)
- TypeScript: clean (`Finished TypeScript in 981ms`)
