---
phase: 02
slug: registry-page
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-29
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — phase follows Phase 1 precedent of `lint + build + manual smoke` |
| **Config file** | none — no Jest / Vitest / Playwright configured (intentional, do not introduce in this phase) |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run lint && npm run build` |
| **Estimated runtime** | ~30 seconds (lint sub-second, build ~25–30s) |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run lint && npm run build`
- **Before `/gsd:verify-work`:** Full suite + manual smoke checklist must pass against `localhost:3000/registry`
- **Max feedback latency:** ~30 seconds (build wave gate)

---

## Per-Task Verification Map

> Phase 02 has no separate REQUIREMENTS.md. Acceptance criteria are the UI-SPEC.md "Acceptance Criteria" block (02-UI-SPEC.md lines 270–313). Per-task mapping populated by gsd-planner during planning — see this file's `Status` columns after planning completes.

| Task ID | Plan | Wave | Acceptance Criterion | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|----------------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-XX-YY | TBD | TBD | TBD (populated by planner) | — | external-link safety: `rel="noopener noreferrer"` | manual smoke + lint | `npm run lint` | yes | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] **No new test framework.** Do NOT install Jest / Vitest / Playwright as part of this phase. That decision belongs to a project-level testing phase, not a single-page UI port. (Confirmed precedent: Phase 01 RSVP shipped with `lint + build + manual smoke`.)
- [ ] **No new ESLint config.** Existing `eslint-config-next@16.2.1` already enforces `@next/next/no-img-element`; the existing `// eslint-disable-next-line` comment pattern used in `app/(main)/things-to-do/page.tsx` is the correct workaround for plain `<img>`.
- [ ] **No new image remotePatterns.** Plain `<img>` is the deliberate choice (`next.config.ts` has no `images.remotePatterns` — adding them is out of scope, matches every other `(main)` page).

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Acceptance Criterion | Why Manual | Test Instructions |
|----------|----------------------|------------|-------------------|
| `/registry` route renders 200 | UI-SPEC §Acceptance | No e2e framework | `npm run dev` → visit `http://localhost:3000/registry` → expect 200, page content renders |
| `(main)` layout inherits nav + footer | UI-SPEC §Acceptance | Visual | DOM inspect — `<Navbar />` and `<Footer />` present |
| Three card `<a>` tags with placeholder URLs | UI-SPEC §Acceptance | View source | View source — three `<a>` tags inside cards section; placeholder URLs annotated with `TODO` comment |
| `target="_blank" rel="noopener noreferrer"` on cards | UI-SPEC §Acceptance + security | DOM inspect | DOM inspect — each card `<a>` has both attributes |
| Navbar Registry link uncommented + href `/registry` | UI-SPEC §Acceptance | Visual | Visual — "Registry" link appears in nav; clicking navigates to `/registry` |
| Active state highlights "Registry" on `/registry` | UI-SPEC §Acceptance | Visual | Navigate to `/registry`; nav "Registry" text turns warm-gold (active state) |
| Hero `h-[614px]` + parallax-bg + scrim + reveal animations | UI-SPEC §Acceptance | Visual | Visual diff vs. Things-To-Do; hero matches `h-[614px]`, parallax scroll, label/title/subtitle reveal in stagger |
| Copy matches UI-SPEC verbatim | UI-SPEC §Acceptance | grep-able but content | View source / DOM — every UI-SPEC string present exactly |
| Card grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 md:gap-y-24` | UI-SPEC §Acceptance | Visual | Resize browser at 768px, 1024px breakpoints — card count per row matches |
| Card image hover: scale 1.05 → 1.10 over 1000ms + dark overlay fade | UI-SPEC §Acceptance | Hover QA | Hover each card — image scales, overlay fades, ~1s timing |
| Card order: Honeyfund → Amazon → Crate & Barrel | UI-SPEC §Acceptance | DOM inspect | View source — array order matches D-01 + Specifics |
| `<h1>` on hero, `<h2>` on grid, `<h3>` on cards | UI-SPEC §Acceptance | a11y tree | View source / a11y devtools tree — heading levels correct |
| `aria-label` includes "(opens in new tab)" on each card | UI-SPEC §Acceptance | View source | View source — each card `<a>` has descriptive `aria-label` ending with "(opens in new tab)" |
| Decorative divs `aria-hidden="true"` | UI-SPEC §Acceptance | View source | View source — scrim div and gradient overlay divs have `aria-hidden="true"` |
| `<img>` `alt` describes scene, not brand | UI-SPEC §Acceptance | View source | View source — each `<img>` alt describes the imagery content (e.g., "Mountain vista at sunset"), not the registry brand |
| Reduced motion: animations disabled | UI-SPEC §Acceptance | OS-level setting | Toggle OS reduce-motion → reload `/registry` → hero reveals do not animate; card hover scale disabled or instant |
| Vercel preview deploy renders correctly | UI-SPEC §Acceptance | Production parity | Push branch → Vercel preview URL → smoke checklist on preview |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify (lint + build) or fall under Manual-Only block above
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify (lint runs every commit, so this is automatic)
- [ ] Wave 0 covers all MISSING references (Wave 0 has no test deltas — Phase 1 precedent matches)
- [ ] No watch-mode flags in automated commands (`npm run lint` and `npm run build` are one-shot)
- [ ] Feedback latency < 30s (build is the ceiling; lint is sub-second)
- [ ] `nyquist_compliant: true` set in frontmatter once planner populates the per-task map and all sign-off boxes check

**Approval:** pending
