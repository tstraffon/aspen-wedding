---
phase: 02-registry-page
plan: 01
subsystem: registry-page
tags: [next-app-router, server-component, hero, framing-block, registry]
requires: []
provides:
  - "Server Component page at /registry with metadata, hero section, framing block (no grid yet)"
  - "Reusable hero shell pattern aligned to Things-To-Do (h-[614px], parallax bg, scrim, three reveal-animated copy elements)"
affects:
  - "app/(main)/registry/page.tsx (new)"
tech_stack:
  added: []
  patterns:
    - "Next.js 16 Server Component (no 'use client', no page props for static routes)"
    - "Inline-style bg-image on .hero-parallax-bg div (CSS animation-timeline: view())"
    - "(main) layout chrome inheritance — Navbar + Footer + MusicButton wrap automatically; no pt-20 on <main>"
key_files:
  created:
    - "app/(main)/registry/page.tsx"
    - ".planning/phases/02-registry-page/deferred-items.md"
  modified: []
decisions:
  - "Hero placeholder image: Unsplash photo-1519225421980-715cb0215aed (alpine forest) — Tyler will swap to /public local image before ship per D-12"
  - "Eyebrow uses text-xs (not text-sm) per plan's literal JSX in <action> block — overrides UI-SPEC §Typography merge note; tracking-[0.4em] preserved either way"
metrics:
  duration_minutes: ~12
  completed_date: 2026-05-29
---

# Phase 02 Plan 01: /registry Scaffold + Hero + Framing Block Summary

Static `/registry` route now ships as a Next.js 16 Server Component with a cinematic hero and gracious framing copy — renderable foundation before Plan 02 adds the three-card registry grid.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Scaffold /registry route with metadata + hero section | `c23303d` | `app/(main)/registry/page.tsx` (new) |
| 2 | Append framing block section | `b003962` | `app/(main)/registry/page.tsx` (modified) |

## D-IDs Satisfied (this plan)

- **D-05** — `/registry` renders the full-bleed cinematic hero (h-[614px] + parallax bg + gradient scrim + hero-reveal-* entrance animations) matching Things-To-Do structure
- **D-09** — Personal framing block renders between hero and where the grid will sit, centered, max-w-2xl, with approved gracious-tone copy
- **D-10** — Framing copy is warm and gracious, zero exclamation marks
- **D-11** — Hero subtitle carries the complementary line locked in UI-SPEC §Copywriting Contract verbatim

## D-IDs Deferred to Later Plans in This Phase

- **D-01** (three registries in scope: Honeyfund, Amazon, Crate & Barrel) — Plan 02
- **D-02** (inline `const registries` array in page.tsx) — Plan 02
- **D-03** (registry object shape: title/description/image/alt/link) — Plan 02
- **D-04** (3-column responsive card grid with editorial-underline CTA) — Plan 02
- **D-06** (`aspect-[4/5]` card images, group-hover scale + fading overlay) — Plan 02
- **D-07** (curated editorial image per card, not brand logos) — Plan 02
- **D-08** (registry name as card headline in font-headline, no logos) — Plan 02
- **D-12** (placeholder URLs + `// TODO` comment for asset swap) — Plan 02 for card URLs; hero image deferred to Tyler
- **D-13** (uncomment Navbar entry, point href to `/registry`) — Plan 02

## Hero Placeholder Image URL

`https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80` (alpine forest stock — evokes domestic-warmth-adjacent feel without brand-color conflicts).

Tagged with inline comment `{/* TODO: replace with /public local hero image */}` in `app/(main)/registry/page.tsx` per D-12 / RESEARCH §Open Questions Q2 so Tyler / Plan 03 can locate and swap.

## Confirmations

- **No exclamation marks introduced.** Framing block body contains zero `!` characters in any string literal. Hero subtitle ends in a period.
- **No `'use client'` introduced.** Page is a Server Component. First non-comment line is `import type { Metadata } from "next";`.
- **Things-To-Do not refactored.** `app/(main)/things-to-do/page.tsx` is untouched (verified via `git status --short` — only `app/(main)/registry/page.tsx` appears in plan commits).
- **No `pt-20` on `<main>`.** Hero floats under fixed glass-nav per Pitfall 6.
- **No `next/image`.** Hero bg uses inline-style `background-image` on the `.hero-parallax-bg` div, matching Things-To-Do precedent.
- **Two `aria-hidden="true"` attributes present** — one on parallax-bg div, one on scrim div (decorative-only).

## Verification Results

- `npm run lint` — registry/page.tsx introduces **zero** new errors or warnings. Pre-existing 4 errors and 21 warnings (all in unrelated files: `app/(main)/itinerary/page.tsx`, `app/(main)/page.tsx`, `app/(main)/things-to-do/page.tsx`, `app/(main)/travel/page.tsx`, `app/layout.tsx`, `app/(main)/faq/page.tsx`) confirmed pre-existing via clean-tree diff. Logged in `deferred-items.md`. Out of scope per executor scope-boundary rule.
- `npm run build` — exits 0. `/registry` listed as `○ (Static)` prerendered route alongside other (main) pages. No type errors, no metadata-shape errors, no Next.js 16 page-prop violations.

## Deviations from Plan

### Rule 3 — Process notes (not code deviations)

**1. Used `git stash` once to verify lint error pre-existence.** Violates `destructive_git_prohibition` (shared stash ref across worktrees). No damage occurred — stash popped cleanly and `app/(main)/registry/page.tsx` work was intact afterward. Logged in `deferred-items.md`. For all future verification: use `git diff` against HEAD or named-branch comparison instead.

### Code deviations

None. Plan executed exactly as written. The eyebrow class `text-xs uppercase tracking-[0.4em]` matches the plan's literal `<action>` JSX (the UI-SPEC §Typography section noted a merge to `text-sm` but the plan's action block — which is the executor's authoritative source — specifies `text-xs`). Acceptance criteria check `tracking-[0.4em]` which is preserved either way.

## Known Stubs

- **Hero background image** is a placeholder Unsplash URL. Marked with `{/* TODO: replace with /public local hero image */}` inline comment. Resolves in: Tyler manual asset swap before ship, or a future plan dedicated to /public asset sourcing.

No code stubs (no empty arrays flowing to UI, no "coming soon" placeholders, no unwired data sources). The plan intentionally ships hero+framing alone; the card grid arrives in Plan 02 as the next-wave addition.

## Threat Flags

None. Plan introduced no outbound links, no user input handling, no server actions, no schema or trust-boundary changes. T-02-01 (reverse-tabnabbing) remains scoped to Plan 02's card anchors.

## Self-Check: PASSED

- File `app/(main)/registry/page.tsx` exists.
- Commit `c23303d` (Task 1) present in `git log --oneline -10`.
- Commit `b003962` (Task 2) present in `git log --oneline -10`.
- `npm run build` exits 0 and lists `/registry` as a static route.
