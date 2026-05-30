---
phase: 03-bridal-party
verified: 2026-05-30T00:00:00Z
status: gaps_found
score: 11/12 D-IDs verified (1 REVISED, 1 BLOCKER)
overrides_applied: 0
gaps:
  - truth: "D-07 — Warm-gold initial-monogram fallback renders when a portrait photo is missing"
    status: failed
    reason: "Every roster entry has a non-null `photo` string. The fallback ternary `member.photo ? <img/> : <monogram/>` evaluates truthy for all 16 members, so the runtime renders 16 `<img>` tags pointing at JPGs that do not exist in `/public/bridal-party/` (folder is absent). Result: 16 broken-image icons in the browser, not the warm-gold monogram. SUMMARY claim 'monogram fallback active for all 16 members until JPGs land' is observably false."
    artifacts:
      - path: "app/(main)/bridal-party/page.tsx:144"
        issue: "Conditional `{member.photo ? <img/> : monogram}` checks string truthiness, not file existence. All 16 `photo` fields are non-null strings."
      - path: "public/bridal-party/"
        issue: "Folder does not exist; 16 expected JPGs absent. Confirmed via `ls public/bridal-party` → 'No such file or directory'. Prerendered HTML emits 16 `<img>` tags with broken `src` paths and zero monogram spans."
    missing:
      - "Either (a) set `photo: null` on all 16 members until real JPGs ship and Tyler flips each to its real path during handoff, OR (b) replace the `member.photo ? ... : ...` truthy check with an actual file-existence guard (e.g., `try/catch` around `import.meta`, build-time `fs.existsSync` on a Server Component, or `<img onError>` with client-side fallback swap)"
      - "Until the fallback path is corrected, the page renders broken portraits in production despite the SUMMARY claim to the contrary"
---

# Phase 3: Bridal Party Verification Report

**Phase Goal:** Build a single `/bridal-party` route under `app/(main)/bridal-party/page.tsx` that introduces the 16-person wedding party with names, roles, photos, and short couple-voice bios, styled to the Stitch dark-editorial system and exposed in the main nav.

**Verified:** 2026-05-30
**Status:** gaps_found (1 BLOCKER on D-07 fallback wiring)
**Re-verification:** No — initial verification

## Per-D-ID Status

| D-ID  | Requirement | Status | Evidence |
| ----- | ----------- | ------ | -------- |
| D-01  | Symmetric two-section structure, Bride's Side first | PASS | `page.tsx:229,247` — `<div id="bride-side">` precedes `<div id="groom-side">` in source. Prerendered HTML heading order: h2 "Bride's" → 8×h3 → h2 "Groom's" → 8×h3 |
| D-02  | Source-order ranking (honor attendant first, then user-given order) | PASS | Arrays at `page.tsx:22-79` (brideSide) and `:81-138` (groomSide) declared in CONTEXT-locked order; Sarah Else is `brideSide[0]`, Dylan Straffon is `groomSide[0]`. Prerendered DOM h3 order matches exactly |
| D-03  | 16-member roster (8 + 8) with exact names | PASS | All 16 names grep-matched in `page.tsx`; both arrays length 8; prerendered DOM emits 16 `<h3>` in expected order |
| D-04  | Role labels (only Sarah Else=MOH, Dylan Straffon=Best Man; rest default) | PASS | Grep counts: `MAID OF HONOR`=1, `BEST MAN`=1, `BRIDESMAID`=7, `GROOMSMAN`=7 |
| D-05  | (Original) Magazine row layout with alternating left/right | **REVISED** | Original magazine row layout was rejected by Tyler at smoke check; replaced with side-by-side two-column layout (Bride's column left, Groom's column right, compact vertical cards) at commit `7c6f3fa`. Pivot documented in `03-03-SUMMARY.md` lines 14-19. New layout verified at `page.tsx:227` (`grid-cols-1 md:grid-cols-2`) and `MemberCard` component at `:140-180` (centered vertical card, `max-w-xs`, photo above text+bio). Data structure and visual primitives (`aspect-[4/5]`, plain `<img>`, monogram fallback shell) unchanged. |
| D-06  | `aspect-[4/5]` portrait crop on every photo container | PASS | One templated literal at `page.tsx:143`; rendered 16× via `brideSide.map` + `groomSide.map` |
| D-07  | Local `/public/bridal-party/<slug>.jpg` paths + warm-gold initial-monogram fallback when photo is missing | **FAIL (BLOCKER)** | Photo paths correct (16 paths grep-verified, kebab-case slugs correct including `collin-dematt`, `ken-kinoshita`). **Fallback is broken:** ternary `{member.photo ? <img/> : monogram}` at `page.tsx:144` checks string truthiness, not file existence. All 16 entries have non-null `photo` strings, so all 16 render as `<img>` tags pointing at JPGs that do not exist (the `/public/bridal-party/` folder is absent). Prerendered HTML confirms: 16 `<img>` tags with `alt="Portrait of …"`, 0 monogram spans. In the running app, guests will see 16 broken-image icons. SUMMARY claim "monogram fallback active for all 16 members until JPGs land" is observably false. |
| D-08  | Plain `<img>` with eslint-disable (NOT next/image) | PASS | `page.tsx:146-151` — one templated `<img>` with `eslint-disable-next-line @next/next/no-img-element` directive; grep for `next/image` returns 0 matches |
| D-09  | Bios in couple's first-person voice (placeholder OK) | PASS | Placeholder `"A dear friend to both of us — we're so glad they're standing with us."` uses first-person plural "us". Real bios are Tyler's handoff per CONTEXT D-11. |
| D-10  | Strict 1-2 sentences per bio | PASS | Placeholder is a single sentence (one em-dash, no terminal-period break). Upper bound is set for handoff. |
| D-11  | 16 `// TODO: replace with real bio` comments in source | PASS | Grep count = 16 |
| D-12  | New nav entry "Bridal Party" between "Things To Do" and "FAQ"; active-state branching untouched | PASS | `components/Navbar.tsx:13` — `{ label: "Bridal Party", href: "/bridal-party" }` sits between Things To Do (`:12`) and FAQ (`:14`). Active-state branching at `:42-49` (desktop) and `:83-90` (mobile) untouched — `pathname.startsWith("/bridal-party")` works out of the box |

## Accessibility Verification

| Check | Status | Evidence |
| ----- | ------ | -------- |
| Heading hierarchy: 1×h1 → 2×h2 → 16×h3 | PASS | Prerendered HTML grep: 1 `<h1>` (hero "The Ones"), 2 `<h2>` ("Bride's" / "Groom's"), 16 `<h3>` (one per member, in locked source order) |
| Every `<img>` carries `alt={\`Portrait of ${member.name}\`}` | PASS | Prerendered HTML: 16 `<img>` tags, 16 matching `alt="Portrait of …"` strings (one per member) |
| Monogram fallback would carry `aria-hidden="true"` | PASS (defensive code) | `page.tsx:154,160` — both wrapper div and inner span carry `aria-hidden="true"`. Note: this code path does not execute at runtime today due to the D-07 wiring gap, but the markup is correctly defensive when it does fire |
| Decorative scrim/parallax-bg divs `aria-hidden="true"` | PASS | Prerendered HTML: 2 `aria-hidden="true"` attributes total — both on hero parallax-bg and 2-axis scrim divs |
| No outbound `target="_blank"` links / no tabnabbing surface | PASS | Grep for `target="_blank"` in `page.tsx` returns 0 |

## Regression Check

| Check | Status | Evidence |
| ----- | ------ | -------- |
| `app/(main)/things-to-do/page.tsx` untouched in phase 3 | PASS | `git log` on the file across phase-3 commit range returns empty. `git diff HEAD` against working tree also empty. |
| `app/(main)/registry/page.tsx` working-tree edit is OUT OF SCOPE for phase 3 | PASS (noted, not a phase-3 regression) | Working tree shows `M app/(main)/registry/page.tsx`, but `git log` of phase-3 commits (`decb6af`..`ba878d8`) shows zero commits touching the file. Tyler's uncommitted edits to the framing block are not part of phase 3 and are explicitly excluded per the verification brief. |
| Phase 3 commit log shows expected `feat(03-XX):` / `fix(03-XX):` / `docs(03-XX):` prefixes | PASS | 9 phase commits found: `decb6af`, `e19955f` (01); `4f7d6d8`, `9870396`, `9de23e0` (02); `b27071e`, `7c6f3fa`, `22439de`, `ba878d8` (03) — including the documented layout pivot (`7c6f3fa`) and hero swap (`22439de`). All conform to the `feat/fix/docs(03-XX):` convention. |

## Build Gate

| Check | Status | Evidence |
| ----- | ------ | -------- |
| `npm run lint` baseline preserved | PASS | Lint exits with 25 problems (4 errors + 21 warnings), all pre-existing in `itinerary/page.tsx`, `faq/page.tsx`, `page.tsx` (home), `things-to-do/page.tsx`, `travel/page.tsx`, `layout.tsx`. Zero issues in `app/(main)/bridal-party/page.tsx` or `components/Navbar.tsx`. |
| `npm run build` exits 0 | PASS | Build completes: "Compiled successfully in 1367ms", TypeScript clean, 14/14 static pages generated. |
| `/bridal-party` listed as static (○) route | PASS | Build manifest: `├ ○ /bridal-party` |

## Outstanding Handoff Items

The following are explicitly documented as Tyler's responsibility at handoff (per CONTEXT.md D-11 and 03-03-SUMMARY.md close-out), NOT phase-3 gaps:

1. **16 real bios** — replace each placeholder `"A dear friend to both of us — we're so glad they're standing with us."` with real first-person couple-voice bios; delete each `// TODO: replace with real bio` comment as you go
2. **16 portrait JPGs** — drop into `/public/bridal-party/<slug>.jpg` (folder needs to be created):
   - `sarah-else.jpg`, `emily-asinger.jpg`, `lindsay-carr.jpg`, `sarah-horan.jpg`, `sam-jones.jpg`, `shannon-robins.jpg`, `michelle-spencer.jpg`, `ryan-hindle.jpg`
   - `dylan-straffon.jpg`, `aaron-sorge.jpg`, `jack-cardello.jpg`, `ken-kinoshita.jpg`, `jon-metz.jpg`, `ian-adams.jpg`, `collin-dematt.jpg`, `josh-tallman.jpg`
3. **Hero background swap** — replace the placeholder Unsplash URL at `page.tsx:193` with a `/public/` local asset (the `{/* TODO: replace with /public local hero image */}` marker at `:188` is in place)

## Gaps Summary

**One BLOCKER, one revision-as-designed.**

The data array claims a `photo` path for every member, and the fallback ternary only fires when `photo === null`. Since all 16 entries are non-null strings pointing at JPGs that don't exist, the page currently renders 16 broken-image icons in any browser — not the warm-gold monogram fallback that D-07 promises and that 03-02-SUMMARY explicitly claimed is "active for all 16 members until JPGs land." Two clean fixes:

- **Option A (low effort, matches the handoff narrative):** Set all 16 `photo` fields to `null` for now; Tyler flips each one to its real path as he drops the JPG into `/public/bridal-party/`. The monogram fallback then renders for every unfilled member by construction.
- **Option B (more durable):** Replace the truthy check with build-time `fs.existsSync` in the Server Component (e.g., compute `photo` field by checking the public folder at module scope), or wire a client-side `<img onError>` swap. More moving parts; less aligned with the codebase's "no abstractions" posture.

Recommend Option A — flip 16 `photo: "…"` strings to `photo: null` in a single commit, document in the SUMMARY that real photo paths are written one-by-one at JPG-drop time, and the fallback wiring works as advertised.

D-05's documented pivot (magazine rows → side-by-side columns) is an authorized design change captured cleanly in `7c6f3fa` and `03-03-SUMMARY.md`. Not a gap.

Everything else is green: roster, ordering, role labels, crop, image tag pattern, voice, length, TODO count, navbar entry, accessibility, regression isolation, lint baseline, build, static-route generation.

---

**Overall Verdict: CONDITIONAL PASS**

Phase 3's user-visible goal ("introduce the 16-person wedding party in a styled, navigable page") is structurally complete and ships as static. But the D-07 fallback wiring needs to be corrected before the page is presentable to guests, or those guests will see 16 broken-image icons instead of monograms. The fix is a one-line edit per member (16 lines total) and does not require any restructuring.

_Verified: 2026-05-30_
_Verifier: Claude (gsd-verifier)_
