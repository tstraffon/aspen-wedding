---
phase: 02-registry-page
plan: 02
subsystem: registry-page
tags: [next-app-router, server-component, card-grid, registry, security-tabnabbing-mitigation]
requires:
  - "02-01: Server Component shell, hero, framing block already shipped at app/(main)/registry/page.tsx"
provides:
  - "Complete /registry page: hero + framing + 3-card grid (Honeyfund, Amazon, Crate & Barrel)"
  - "Inline const registries data array (no separate config file per D-02)"
  - "T-02-01 reverse-tabnabbing mitigation on three external card anchors (rel='noopener noreferrer')"
affects:
  - "app/(main)/registry/page.tsx (modified — append registries const + card grid section)"
tech_stack:
  added: []
  patterns:
    - "Inline data-array + .map() card rendering (Things-To-Do analog, minus type annotation)"
    - "Radial-gradient ellipse overlay on section (Things-To-Do Restaurants section analog)"
    - "Plain <img> with eslint-disable directive (per project precedent — NOT next/image)"
    - "External-link a11y pattern: aria-label suffixed with '(opens in new tab)'"
    - "T-02-01 reverse-tabnabbing mitigation: target='_blank' + rel='noopener noreferrer' on every external anchor"
key_files:
  created: []
  modified:
    - "app/(main)/registry/page.tsx (registries const + third <section> appended)"
decisions:
  - "Inferred type on registries const (no `: Registry[]` annotation) — matches Things-To-Do precedent and plan instruction"
  - "Used plain ASCII apostrophe in Crate & Barrel description string literal (not &apos;) — React handles string literal escaping at the JSX text-node level"
  - "Variable name `r` in registries.map((r) => ...) — plan-permitted shorthand vs. Things-To-Do's `activity`"
metrics:
  duration_minutes: ~2
  completed_date: 2026-05-29
---

# Phase 02 Plan 02: Registry Card Grid + Inline Data Summary

Three-card editorial registry grid now renders below the hero+framing scaffold, with reverse-tabnabbing protection baked into every external anchor and the inline `const registries` array marking placeholder URLs for Tyler's handoff swap.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Add inline `const registries` data array (Honeyfund, Amazon, Crate & Barrel) | `1a08f5c` | `app/(main)/registry/page.tsx` (modified) |
| 2 | Append card grid section with security + a11y affordances | `a2062c5` | `app/(main)/registry/page.tsx` (modified) |

## D-IDs Satisfied (this plan)

- **D-01** — Three registry entries render in left-to-right order: Honeyfund, Amazon, Crate & Barrel (verified by source-order grep at lines 10, 20, 30 of registries const)
- **D-02** — Registry data is an inline `const registries` array at the top of `app/(main)/registry/page.tsx` — no separate config file
- **D-03** — Each registry object carries `title`, `description`, `image`, `alt`, `link` (no extras, no missing fields)
- **D-04** — Cards render in `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 md:gap-y-24` with `editorial-underline` "Visit Registry" CTA
- **D-06** — Card images use `aspect-[4/5]`, scale `1.05 -> 1.10` over `duration-1000`, with `bg-background/20 -> bg-transparent` overlay fade over `duration-500`
- **D-07** — Card images are curated editorial Unsplash photography (mountain landscape, wrapped gift, tabletop), NOT brand logos. Alt text describes scenes, not brand identities
- **D-08** — Card titles are bare brand names in `font-headline` (Noto Serif): "Honeyfund", "Amazon", "Crate & Barrel" — no taglines, no wordmark imagery
- **D-12** — All three `link` fields are `"#"` placeholders, each immediately preceded by `// TODO: replace with real registry URL` (three TODO comments verified by `grep -B1 'link: "#"' | grep -c 'TODO'` = 3)

## D-IDs Deferred to Plan 03

- **D-13** — Uncomment Registry navbar entry and point `href` to `/registry`. This plan ships the destination; Plan 03 wires the navigation. The /registry route is currently reachable only by direct URL or deeplink.

## Security: T-02-01 Reverse-Tabnabbing Mitigation Confirmation

```
$ grep -c 'rel="noopener noreferrer"' app/(main)/registry/page.tsx
1

$ grep -c 'target="_blank"' app/(main)/registry/page.tsx
1
```

Both literals appear exactly once inside the `registries.map((r) => (...))` body. Since `.map()` renders three iterations, **every rendered card anchor inherits both attributes** — three live anchors, all mitigated. `window.opener` is severed (`noopener`) and the `Referer` header is stripped (`noreferrer`) for each outbound navigation. ASVS L1 §10.3.1 satisfied.

T-02-02 (referrer leak) covered by the same `noreferrer` token. T-02-XSS (React JSX text-node escaping) inherited automatically — no `dangerouslySetInnerHTML`, no user-supplied data. T-02-PLACEHOLDER (shipping `#` URLs) flagged in source via three `// TODO` comments per D-12.

## Image URLs Used (For Plan 03 / Tyler Handoff Swap)

| Card | Unsplash URL | Scene |
|------|--------------|-------|
| Honeyfund | `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80` | Mountain landscape with passport and journal (honeymoon travel) |
| Amazon | `https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80` | Wrapped gift box with neutral linen ribbon on wooden surface |
| Crate & Barrel | `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80` | Curated tabletop with linen napkins, glassware, warm afternoon light |

All three are scenic editorial photography per D-07; alt text describes the scene rather than the brand to keep screen-reader announcements neutral and human-meaningful.

## Things-To-Do Untouched Confirmation

```
$ git diff app/(main)/things-to-do/page.tsx
(empty)
```

Plan 02's UI-SPEC "Merges applied" (`text-2xl md:text-4xl` titles, `text-lg` blurbs, `Visit Registry` CTA copy) live only in the new `/registry` grid. Things-To-Do retains its `text-2xl` / `text-base` / `Learn More` originals.

## Verification Results

- `npm run lint` — `app/(main)/registry/page.tsx` produces **zero** new errors or warnings. The transient "registries assigned but never used" warning from Task 1 resolved automatically once Task 2 consumed it via `.map()`. Total project lint state: 4 errors + 21 warnings — identical to Plan 01's exit state, all in unrelated files (`itinerary/page.tsx` apostrophes, etc.) and pre-existing per phase scope boundary.
- `npm run build` — exits 0. `/registry` listed as `○ (Static)` prerendered route. No TypeScript errors, no metadata-shape errors, no Next.js 16 violations.

## Deviations from Plan

None. Plan executed exactly as written. All acceptance criteria verified via grep (template-literal aria-label confirmed via `fgrep` due to grep's backtick escaping). No Rule 1/2/3 auto-fixes invoked, no Rule 4 architectural decisions surfaced, no authentication gates encountered.

## Known Stubs

- **Three card `href` values are `"#"` placeholders.** Each is marked with `// TODO: replace with real registry URL` per D-12 — intentional per plan, deferred to Tyler's handoff before ship.

No other stubs. The `registries` array is fully wired into the rendered grid; no hardcoded empty arrays or "coming soon" placeholders flow to the UI.

## Threat Flags

None. Plan introduced exactly the three outbound external anchors the threat model anticipated — all three carry the documented T-02-01 mitigation (`target="_blank" rel="noopener noreferrer"`). No new schema surface, no new server actions, no new user input handling, no new file access paths.

## Self-Check: PASSED

- File `app/(main)/registry/page.tsx` exists at 99 lines (33 added in Task 1 + 54 added in Task 2 + 12 pre-existing from Plan 01).
- Commit `1a08f5c` (Task 1) present in `git log --oneline -5`.
- Commit `a2062c5` (Task 2) present in `git log --oneline -5`.
- `npm run build` exits 0 and lists `/registry` as a static prerendered route.
- Things-To-Do diff returns empty (`git diff app/(main)/things-to-do/page.tsx`).
