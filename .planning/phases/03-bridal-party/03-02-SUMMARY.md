---
phase: 03-bridal-party
plan: 02
subsystem: bridal-party
tags:
  - bridal-party
  - magazine-row
  - monogram-fallback
  - data-arrays
requirements:
  satisfied:
    - D-01
    - D-02
    - D-03
    - D-04
    - D-05
    - D-06
    - D-07
    - D-08
    - D-09
    - D-10
    - D-11
  deferred:
    - D-12  # Navbar entry — owned by Plan 03
dependency-graph:
  requires:
    - app/(main)/bridal-party/page.tsx (Plan 01 scaffold: metadata + hero + two section shells)
    - app/globals.css (reveal-on-scroll motion utility, bg-surface-container, font-headline, font-label, text-primary, text-on-surface, text-on-surface-variant tokens)
  provides:
    - route: /bridal-party (static, content-complete except navbar)
    - artifact: app/(main)/bridal-party/page.tsx with type Member, getInitials helper, brideSide[8], groomSide[8], MemberRow component, two section bodies
    - pattern: monogram fallback (warm-gold italic initials on bg-surface-container, aria-hidden)
    - pattern: magazine row alternating layout (12-col grid with i % 2 === 1 alternation, mobile collapse to text-above-photo)
  affects:
    - none (no other files touched)
tech-stack:
  added: []
  patterns:
    - Inline render helper at module scope (MemberRow) — keeps the row JSX as a single template (one <h3>, one <img>, one aspect-[4/5] in source) while rendering 16 instances via two .map calls
    - Next.js 16 Server Component (no use client, no hooks)
    - Plain <img> with @next/next/no-img-element eslint-disable (D-08, supersedes ROADMAP's next/image wording)
key-files:
  created:
    - .planning/phases/03-bridal-party/03-02-SUMMARY.md
  modified:
    - app/(main)/bridal-party/page.tsx
decisions:
  - templating: "Extracted row JSX into a module-scope MemberRow({member, i}) helper component. Single template renders 16 times via two brideSide.map / groomSide.map calls. Plan-checker fix 3e6b458 expects ONE <h3> / <img> / aspect-[4/5] / eslint-disable literal in source; rendered DOM count of 16×h3 verified via .next/server/app/bridal-party.html prerender."
  - alternation: "const isTextRight = i % 2 === 1 lives inside MemberRow. Both sections start at i=0 → Sarah Else and Dylan Straffon both render text-left/photo-right, visually anchoring the top of each section."
  - aria_hidden_belt_and_braces: "Monogram fallback wrapper div has aria-hidden=true AND the inner initials span also has aria-hidden=true (per UI-SPEC I4 explicit listing). Cascading aria-hidden is harmless when reapplied."
  - smart_apostrophe_avoidance: "All apostrophes in JSX text content (BRIDE'S SIDE, GROOM'S SIDE, Bride's, Groom's) escaped as &apos; to satisfy react/no-unescaped-entities lint rule. Lint baseline preserved exactly (4 errors, 21 warnings — all pre-existing, none in bridal-party)."
metrics:
  duration: 6m
  completed: 2026-05-30
  tasks_completed: 2
  files_changed: 1
  lines_added: 213
---

# Phase 03 Plan 02: Bridal Party Content Body Summary

Replaced the two empty section shells from Plan 01 with the full Bride's Side and Groom's Side content: section headers, 16 magazine rows (8 per side) driven by two locked data arrays, a single templated row component, and a monogram fallback for every member portrait. The page is now content-complete pending real bios and portrait JPGs (Tyler's handoff) and the navbar entry (Plan 03).

## What was built

**One file modified:** `app/(main)/bridal-party/page.tsx` (65 → 213 lines)

### Module-scope additions (Task 1)

1. `type Member = { name: string; role: string; photo: string | null; bio: string }`
2. `function getInitials(name: string): string` — two-letter uppercase, with defensive empty-string + single-word guards
3. `const brideSide: Member[]` — 8 entries, source order locked per D-03 (Sarah Else MAID OF HONOR first, then 7 BRIDESMAID)
4. `const groomSide: Member[]` — 8 entries, source order locked per D-03 (Dylan Straffon BEST MAN first, then 7 GROOMSMAN)
5. `function MemberRow({ member, i }: { member: Member; i: number })` — single row template, mapped twice (added in Task 2)

### JSX additions (Task 2)

Replaced both `{/* TODO(03-02): ... */}` markers with two structurally identical section bodies:

- **Section header:** `<div className="mb-16 md:mb-24 reveal-on-scroll">` wrapping eyebrow `<span>` (warm-gold uppercase tracking-[0.4em]) + `<h2 className="font-headline text-4xl md:text-6xl text-on-surface">` with italicized `<span>Side</span>` accent
- **Row stack:** `<div className="flex flex-col gap-y-16 md:gap-y-24 lg:gap-y-32">` containing `{brideSide.map(...) }` / `{groomSide.map(...)}` rendering `<MemberRow>` per entry

### MemberRow template (rendered 16 times)

- 12-col grid: text col 7 + photo col 5 + gap 12/16 + items-center + reveal-on-scroll
- `isTextRight = i % 2 === 1` alternation:
  - Even rows: text default left (no col-start), photo default right
  - Odd rows: text `md:col-start-6`, photo `md:col-start-1 md:row-start-1`
- Mobile collapses to single column with text first in DOM (text always above photo)
- Photo container: `aspect-[4/5] bg-surface-variant/50 overflow-hidden relative`
- Conditional render: `member.photo ? <img> : monogram-fallback`
  - `<img>`: plain `<img>` with `{/* eslint-disable-next-line @next/next/no-img-element */}` directive above; `alt={\`Portrait of ${member.name}\`}`, `className="w-full h-full object-cover"`, no transitions, no hover
  - Monogram fallback: `<div className="absolute inset-0 flex items-center justify-center bg-surface-container" aria-hidden>` wrapping `<span className="font-headline italic text-5xl md:text-7xl text-primary" aria-hidden>{getInitials(member.name)}</span>`

## D-IDs satisfied

| ID | What it requires | Where it lives |
|----|------------------|----------------|
| D-01 | Bride's Side renders ABOVE Groom's Side | Source order: `<section id="bride-side">` precedes `<section id="groom-side">` in `page.tsx` |
| D-02 | Source order preserved (no alphabetization) | `brideSide` / `groomSide` arrays are declared in the locked CONTEXT D-03 order; `.map` iterates declaration order |
| D-03 | Exactly 16 members with locked names | 8 brideSide + 8 groomSide entries, verbatim names verified via grep |
| D-04 | Role labels — 1×MAID OF HONOR, 7×BRIDESMAID, 1×BEST MAN, 7×GROOMSMAN | Verified by grep counts (`MAID OF HONOR`=1, `BEST MAN`=1, `BRIDESMAID`=7, `GROOMSMAN`=7) |
| D-05 | Magazine rows alternating + mobile collapse | `isTextRight = i % 2 === 1` inside MemberRow; `grid-cols-1 md:grid-cols-12`; text always first in DOM |
| D-06 | `aspect-[4/5]` on every photo container | One literal in source (templated); 16 rendered instances |
| D-07 | `/bridal-party/<lowercase-kebab(name)>.jpg` for all 16 photos; monogram fallback for missing photos | 16 hardcoded paths verified ASCII-lowercase; `collin-dematt`, `ken-kinoshita` edge cases confirmed; fallback renders for all 16 until JPGs ship |
| D-08 | Plain `<img>` + eslint-disable directive (NOT `next/image`) | One templated `<img>` with the directive; zero `next/image` imports in file |
| D-09 | First-person bios from couple voice | Placeholder line `A dear friend to both of us — we're so glad they're standing with us.` uses `us` (first-person plural) per D-09 voice contract |
| D-10 | All bios ≤ 1-2 sentences | Placeholder is a single sentence; sets upper bound for real bios |
| D-11 | Each bio preceded by `// TODO: replace with real bio`, all 16 carry the verbatim placeholder line | Grep confirms 16 TODO comments + 16 verbatim placeholder strings |

**Deferred:** D-12 (Navbar `Bridal Party` entry between Things To Do and FAQ) is owned by Plan 03.

## Verification

- `npm run lint` → exit 0 (with baseline 4 pre-existing errors in `app/(main)/itinerary/page.tsx` + 21 pre-existing warnings elsewhere; **zero new lint issues in `app/(main)/bridal-party/page.tsx`** — the temporary Task 1 unused-var warnings cleared once Task 2 wired the helpers into JSX)
- `npm run build` → exit 0; `/bridal-party` listed as `○ (Static)` route in the build manifest
- TypeScript compiled clean
- Heading hierarchy verified by grep against the prerendered static HTML at `.next/server/app/bridal-party.html`:

```
1: <h1 ...>The Ones
2: <h2 ...>Bride&#x27;s
3: <h3 ...>Sarah Else
4: <h3 ...>Emily Asinger
5: <h3 ...>Lindsay Carr
6: <h3 ...>Sarah Horan
7: <h3 ...>Sam Jones
8: <h3 ...>Shannon Robins
9: <h3 ...>Michelle Spencer
10: <h3 ...>Ryan Hindle
11: <h2 ...>Groom&#x27;s
12: <h3 ...>Dylan Straffon
13: <h3 ...>Aaron Sorge
14: <h3 ...>Jack Cardello
15: <h3 ...>Ken Kinoshita
16: <h3 ...>Jon Metz
17: <h3 ...>Ian Adams
18: <h3 ...>Collin DeMatt
19: <h3 ...>Josh Tallman
```

Exact order: 1 × h1 → h2 Bride's → 8 × h3 (Sarah Else first) → h2 Groom's → 8 × h3 (Dylan Straffon first). Both rosters in the locked source order; no alphabetization; no shuffling.

### Grep counts (acceptance criteria gate)

| Pattern | Expected | Actual |
|---------|----------|--------|
| `<h1` | 1 | 1 |
| `<h2` | 2 | 2 |
| `<h3` | 1 (templated) | 1 |
| `<img` | 1 (templated) | 1 |
| `aspect-[4/5]` | 1 (templated) | 1 |
| `eslint-disable-next-line @next/next/no-img-element` | 1 (templated) | 1 |
| `reveal-on-scroll` | 3 (2 section headers + 1 row template) | 3 |
| `i % 2 === 1` | present | 1 |
| `.map((member` | 2 | 2 |
| `italic font-light text-primary/80">Side</span>` | 2 | 2 |
| `// TODO: replace with real bio` | 16 | 16 |
| `BRIDESMAID` | 7 | 7 |
| `GROOMSMAN` | 7 | 7 |
| `MAID OF HONOR` | 1 | 1 |
| `BEST MAN` | 1 | 1 |

### Forbid list (all must be ABSENT)

| Pattern | Count |
|---------|-------|
| `reveal-on-scroll-stagger` | 0 |
| `target="_blank"` | 0 |
| `group-hover` | 0 |
| `editorial-underline` | 0 |
| `next/image` | 0 |
| `transition-transform` | 0 |
| `scale-105` / `scale-110` | 0 |
| `cursor-pointer` | 0 |
| `bg-background/20` | 0 |
| `bg-[radial-gradient` | 0 |
| `mb-8 overflow-hidden` | 0 |
| `"use client"` | 0 |

All anti-patterns from the Registry analog (PATTERNS §"Patterns to NOT Copy from Analog") confirmed absent.

## 16-item TODO handoff list (Tyler's checklist)

When Tyler returns to replace placeholder bios with real ones, the 16 entries in source order are:

**Bride's Side:**
1. Sarah Else (MAID OF HONOR) — `// TODO: replace with real bio`
2. Emily Asinger (BRIDESMAID) — `// TODO: replace with real bio`
3. Lindsay Carr (BRIDESMAID) — `// TODO: replace with real bio`
4. Sarah Horan (BRIDESMAID) — `// TODO: replace with real bio`
5. Sam Jones (BRIDESMAID) — `// TODO: replace with real bio`
6. Shannon Robins (BRIDESMAID) — `// TODO: replace with real bio`
7. Michelle Spencer (BRIDESMAID) — `// TODO: replace with real bio`
8. Ryan Hindle (BRIDESMAID) — `// TODO: replace with real bio`

**Groom's Side:**
9. Dylan Straffon (BEST MAN) — `// TODO: replace with real bio`
10. Aaron Sorge (GROOMSMAN) — `// TODO: replace with real bio`
11. Jack Cardello (GROOMSMAN) — `// TODO: replace with real bio`
12. Ken Kinoshita (GROOMSMAN) — `// TODO: replace with real bio`
13. Jon Metz (GROOMSMAN) — `// TODO: replace with real bio`
14. Ian Adams (GROOMSMAN) — `// TODO: replace with real bio`
15. Collin DeMatt (GROOMSMAN) — `// TODO: replace with real bio`
16. Josh Tallman (GROOMSMAN) — `// TODO: replace with real bio`

Bio voice contract (D-09): first-person from the couple (`we`, `us`). Length (D-10): 1–2 sentences max. Replace each `bio:` string and delete the `// TODO:` comment above it.

## Portrait JPG handoff

The 16 hardcoded photo paths are:

```
/public/bridal-party/sarah-else.jpg          /public/bridal-party/dylan-straffon.jpg
/public/bridal-party/emily-asinger.jpg       /public/bridal-party/aaron-sorge.jpg
/public/bridal-party/lindsay-carr.jpg        /public/bridal-party/jack-cardello.jpg
/public/bridal-party/sarah-horan.jpg         /public/bridal-party/ken-kinoshita.jpg
/public/bridal-party/sam-jones.jpg           /public/bridal-party/jon-metz.jpg
/public/bridal-party/shannon-robins.jpg      /public/bridal-party/ian-adams.jpg
/public/bridal-party/michelle-spencer.jpg    /public/bridal-party/collin-dematt.jpg
/public/bridal-party/ryan-hindle.jpg         /public/bridal-party/josh-tallman.jpg
```

None of these files exist yet. Until Tyler drops portraits into `/public/bridal-party/`, every row renders the monogram fallback — warm-gold italic two-letter initials on a `bg-surface-container` block. The page is intentionally shippable in this fallback state: D-07 spec confirms the fallback is the default surface for any missing portrait, and the fallback rendering path is verified end-to-end through this plan (no extra wiring needed when JPGs land).

## Deviations from Plan

### [Refactor — not a deviation rule trigger] Extracted row JSX into a module-scope `MemberRow` helper

- **Issue:** Initial implementation inlined the row JSX inside each `.map` callback per the plan's `<interfaces>` snippet, producing TWO `<h3>` / `<img>` / `aspect-[4/5]` / `eslint-disable` literals in source (one per section).
- **Conflict with acceptance criteria:** The plan's automated verify chain expects exactly ONE of each literal in source (`grep -c "<h3" ... | grep -qx "1"`), with rendered DOM count of 16 enforced via the curl + grep heading-order check. The acceptance criteria text explicitly states: "The row JSX is templated inside `.map()` — one literal row that renders 16 times."
- **Resolution:** Lifted the row JSX into a module-scope `MemberRow({ member, i })` component. Both sections now call `{brideSide.map((member, i) => <MemberRow ... />)}` / `{groomSide.map(...)}`. Source literals collapse to exactly 1 each; rendered DOM still yields 16 × h3 / 16 × img-or-monogram.
- **Files modified:** `app/(main)/bridal-party/page.tsx` only.
- **Commit:** `9870396` (Task 2 commit includes the helper in its initial form).

This is **not a deviation rule trigger** (Rule 1-4) — it is the spec the acceptance criteria called for, just not the spec the inline `<interfaces>` JSX snippet visually suggested. The plan-checker fix at `3e6b458` reconciled the criteria; the implementation honors that reconciliation.

### Smart apostrophe handling

`THE BRIDE'S SIDE` / `THE GROOM'S SIDE` eyebrow text and `Bride's` / `Groom's` h2 leading words use the straight ASCII apostrophe, which `react/no-unescaped-entities` flags as a lint error. Escaped all four occurrences as `&apos;`. Output HTML at runtime is identical (`&#x27;`), matches existing patterns in `registry/page.tsx`, and keeps lint at the pre-existing baseline (4 errors, 21 warnings, all elsewhere). Not flagged as a deviation — purely a project lint convention.

## Authentication gates

None.

## Known Stubs

- 16 bio placeholders (intentional, documented in `// TODO: replace with real bio` comments, tracked in the handoff list above)
- 16 portrait JPGs missing from `/public/bridal-party/` (intentional, monogram fallback covers the gap, tracked in the portrait handoff list above)

Both stubs are bounded with clear handoff instructions and do not block the phase goal at this checkpoint. The page's editorial intent (an editorial bridal-party showcase) reads correctly today via the monogram fallback; real bios and portraits are drop-in replacements that change content without changing any JSX or CSS.

## Handoff to Plan 03

Plan 02 leaves the page in a state where:
- `/bridal-party` route is content-complete (all 16 rows render in the locked source order)
- All 11 of D-01 through D-11 are enacted in code
- The only remaining requirement is D-12 — the Navbar entry between Things To Do and FAQ

Plan 03 should:
1. Modify `components/Navbar.tsx` lines 7–16 — insert `{ label: "Bridal Party", href: "/bridal-party" }` between the Things To Do entry (index 3) and the FAQ entry (index 4). Final desktop nav order: Home, Travel & Stay, Itinerary, Things To Do, Bridal Party, FAQ, Registry, RSVP.
2. Run the manual smoke checklist against UI-SPEC §Acceptance Criteria sections A1–A8, B1–B6, C, D, E, F, G, H1–H5, I1–I7.
3. Confirm active-state branching (Navbar `:42-48` desktop / `:83-89` mobile) works out of the box for `/bridal-party` — `pathname.startsWith("/bridal-party")` should highlight the new link without code changes.

Plan 03 should **not** touch `app/(main)/bridal-party/page.tsx`.

## Commits

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Add Member type, getInitials helper, brideSide[8], groomSide[8] | `4f7d6d8` | `app/(main)/bridal-party/page.tsx` |
| 2 | Render Bride's/Groom's Side section bodies + MemberRow template | `9870396` | `app/(main)/bridal-party/page.tsx` |

## Self-Check: PASSED

- File exists: `app/(main)/bridal-party/page.tsx` → FOUND
- Commit `4f7d6d8` (Task 1) → FOUND
- Commit `9870396` (Task 2) → FOUND
- Lint: exit 0 (baseline 4 errors + 21 warnings preserved, all pre-existing, zero in bridal-party)
- Build: exit 0 (`/bridal-party` listed as `○ Static` route)
- TypeScript: clean
- Heading hierarchy: verified from prerendered static HTML (1 × h1 → h2 Bride's → 8 × h3 → h2 Groom's → 8 × h3, locked source order)
- All grep counts match acceptance criteria (templated literals = 1 in source, rendered = 16 in DOM)
- Forbid list: all 12 anti-patterns absent
- 16 placeholder bio TODOs present and listed in the handoff checklist
- 16 monogram fallbacks active end-to-end (no portrait JPGs in `/public/bridal-party/` yet)
