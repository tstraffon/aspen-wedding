# Phase 3: Bridal Party - Context

**Gathered:** 2026-05-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a single `/bridal-party` route under `app/(main)/bridal-party/page.tsx` that introduces the 16-person wedding party (8 Bride's Side + 8 Groom's Side) with names, roles, photos, and short couple-voice bios — styled to the Stitch dark-editorial system and exposed in the main nav. No backend, no auth, no contact info, no individual member detail pages. Photos load from `/public/bridal-party/` with a neutral monogram placeholder for any missing files.

</domain>

<decisions>
## Implementation Decisions

### Roster + Grouping
- **D-01:** **Symmetric two-section structure** — "Bride's Side" and "Groom's Side" rendered as two distinct sections with their own headings, in that source order (Bride's Side first).
- **D-02:** **Source-order ranking within each section** — honor attendant first (Maid of Honor / Best Man), then attendants in the order the user provided. The user's order is intentional; do not re-sort alphabetically or shuffle.
- **D-03:** **Full roster locked** (8 + 8 = 16 members total):
  - **Bride's Side:**
    - Sarah Else — Maid of Honor
    - Emily Asinger — Bridesmaid
    - Lindsay Carr — Bridesmaid
    - Sarah Horan — Bridesmaid
    - Sam Jones — Bridesmaid
    - Shannon Robins — Bridesmaid
    - Michelle Spencer — Bridesmaid
    - Ryan Hindle — Bridesmaid
  - **Groom's Side:**
    - Dylan Straffon — Best Man
    - Aaron Sorge — Groomsman
    - Jack Cardello — Groomsman
    - Ken Kinoshita — Groomsman
    - Jon Metz — Groomsman
    - Ian Adams — Groomsman
    - Collin DeMatt — Groomsman
    - Josh Tallman — Groomsman
- **D-04:** **Role labels** — only Sarah Else and Dylan Straffon get explicit honor-attendant labels ("Maid of Honor" / "Best Man"). All other Bride's Side members get the default `"Bridesmaid"` label; all other Groom's Side members get the default `"Groomsman"` label. Role label renders as the warm-gold uppercase eyebrow above the name (same `font-label text-xs uppercase tracking-[0.4em] text-primary` treatment used on Registry/hero eyebrows).

### Card Layout + Photo Style
- **D-05:** **Magazine row layout, not a card grid.** Each member is a full-width row with name + role + bio on one side and a portrait photo on the other side. On desktop, rows **alternate left/right per row** for visual rhythm (member 1: text-left/photo-right; member 2: text-right/photo-left; …). On mobile (`<md`), rows collapse to a single stacked direction (text above photo, every row the same direction) to avoid awkward zigzag scroll. This is a **deliberate departure** from the Registry/Things-To-Do `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` card pattern.
- **D-06:** **Photo crop = `aspect-[4/5]`** — matches Registry card crop exactly. Keeps the editorial portrait feel consistent across the site.
- **D-07:** **Local photos at `/public/bridal-party/<slug>.jpg`** where `<slug>` is `lowercase-kebab(name)` (e.g., `sarah-else.jpg`, `dylan-straffon.jpg`). Each member object carries a `photo` field with the relative path (`/bridal-party/sarah-else.jpg`). When a file is missing, render a neutral placeholder: a square block in `bg-surface-container` with the member's initials centered in `font-headline italic text-primary` (warm gold) — looks intentional, not broken. Placeholder logic lives in the page component, not a separate component, to stay consistent with the project's no-new-abstractions posture.
- **D-08:** **Plain `<img>` with `{/* eslint-disable-next-line @next/next/no-img-element */}`** — match the site-wide pattern (Registry, Things-To-Do, Travel all use this). **Supersedes the ROADMAP's "image optimization via `next/image`" wording** because every shipped page has explicitly rejected `next/image` and the codebase has its own consistency. Note this in PLAN as a deliberate deviation from ROADMAP language.

### Bio Tone + Length
- **D-09:** **First-person voice from the couple** — bios are written as Tyler & Emily speaking about each member. Example: "Sarah is Emily's sister and has been her best friend since the day she was born — we couldn't imagine standing up there without her." Same warm-gracious register as the Registry framing block.
- **D-10:** **Strict 1-2 sentences per member.** Total page text ≈ 16 × 2 sentences max. Keeps the magazine layout from becoming a wall of text; forces evocative, tight writing.
- **D-11:** **Placeholder bios during execution; Tyler fills real bios pre-ship.** Each member gets a generic 1-2 sentence placeholder during plan/execution. Each placeholder line is preceded by `// TODO: replace with real bio` — same handoff pattern Registry uses for the three `link: "#"` placeholders. The 16 TODOs are listed in the SUMMARY.md handoff items for visibility at code-review.

### Nav integration
- **D-12:** **Add new nav entry `{ label: "Bridal Party", href: "/bridal-party" }`** to the `links` array in `components/Navbar.tsx`. Position: between `Things To Do` and `FAQ` — slots in with the discovery/get-to-know items rather than logistics (FAQ) or transactional (Registry/RSVP). Final desktop nav order: Home, Travel & Stay, Itinerary, Things To Do, Bridal Party, FAQ, Registry, RSVP. Active-state branching at `Navbar.tsx:43-48` (desktop) / `:84-89` (mobile) is **NOT touched** — `pathname.startsWith("/bridal-party")` will work out of the box.

### Claude's Discretion
- **Hero treatment** — defaults to the **full cinematic hero** matching Registry/Things-To-Do (`h-[614px]` parallax bg + scrim + `hero-reveal-*` staggered fade-up on label/title/subtitle). Eyebrow = "Our People" or "The Wedding Party" (UI-researcher lands final); headline = "The Ones Standing With Us" or "Our Favorite People" with the second word italicized in warm gold (matches Registry's "Our *Registries*" pattern); subtitle = warm-gracious 1-line complementary copy.
- **Hero scrim** — start with the stronger 2-axis scrim that landed in Registry (`e82d7d4`): `linear-gradient(to bottom, rgba(13,27,30,0.15), rgba(13,27,30,0.5) 55%, rgba(13,27,30,0.85)), linear-gradient(to right, rgba(13,27,30,0.45), rgba(13,27,30,0.15) 45%, transparent 70%)` — proven readable.
- **Section spacing** — `py-32 md:py-48` between sections (more breathing room than Registry's `py-16` because the page is longer with 16 rows; UI-researcher tunes).
- **Per-row spacing** — `gap-y-24 md:gap-y-32` between rows; `gap-x-12 md:gap-x-16` between text column and photo column on desktop.
- **Row reveal animation** — apply `reveal-on-scroll` to each row container (no need for `reveal-on-scroll-stagger` since rows are full-width and stagger would feel chaotic at row scale).
- **Mobile collapse direction** — text always above photo on `<md`, not below. Reading order stays consistent (name → bio → face).
- **Bride's Side first** — render Bride's Side section above Groom's Side, matching the naming order (Bride/Groom) and roster source order. No alternative discussed.
- **Placeholder bios** — use safe generic copy like "A dear friend to both of us — we're so glad they're standing with us." with the TODO comment. Real bios are the user's job at handoff.
- **Heading hierarchy** — h1 (hero) → h2 (each section: "Bride's Side", "Groom's Side") → h3 (each member name). Matches Registry's clean a11y hierarchy.
- **Accessibility** — every photo `<img>` carries `alt={\`Portrait of ${member.name}\`}` (or a short scene description if the user provides one later). Decorative scrim/overlay divs carry `aria-hidden="true"`. No outbound links → no tabnabbing surface in this phase.

</decisions>

<deferred>
## Deferred Ideas (out of scope)

- **Individual member detail pages** (e.g., `/bridal-party/sarah-else`) — overengineering for a single-page intro. Note for future if the couple decides to add longer-form personal pages.
- **Contact info per member** (email, social handles) — privacy concern, not the page's purpose. Belongs in a separate guest-facing directory if ever needed.
- **Group photo at top of each section** — could be added later as a hero-style image for each section, but adds asset-gathering burden right now.
- **Parents / Officiant / Ring Bearer / Flower Girl ("Honored Guests" section)** — explicitly out of scope per chosen "Symmetric sides" structure (option D would have included them). Add as a future phase if the couple wants to expand.
- **Hover-reveal bio overlay** (was option B in the layout question) — not chosen; bios are always visible per the magazine layout.

</deferred>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and project anchors
- `.planning/ROADMAP.md` §"Phase 3 — Bridal Party Page" — phase goal, scope, dependencies. NOTE: the ROADMAP says "image optimization via `next/image`" but D-08 above explicitly supersedes that with plain `<img>` per site-wide pattern.
- `.planning/PROJECT.md` — Stitch design system summary, palette, font families, audience constraints

### Design system (Stitch tokens + utilities — already shipped)
- `app/globals.css` — full token set (`--color-primary` warm gold `#d4a373`, `--color-surface` deep teal `#122023`, `--color-surface-container` etc.), font families (`font-headline` Noto Serif, `font-label` Manrope), and component utilities: `.hero-parallax-bg`, `.hero-reveal-label`, `.hero-reveal-title`, `.hero-reveal-subtitle`, `.reveal-on-scroll`, `.reveal-on-scroll-stagger`, `.glass-nav`, `.editorial-underline` (the editorial-underline class is unused on this page since there are no outbound CTAs).

### Layout / pattern references (read before drafting)
- `app/(main)/registry/page.tsx` — **primary reference for hero + section header pattern + placeholder/TODO handoff pattern.** The 2-axis hero scrim that landed at `e82d7d4` is the recommended starting point. Note: do NOT reuse the 3-column card grid — Phase 3 uses a magazine row layout instead.
- `app/(main)/things-to-do/page.tsx` — secondary reference for hero structure, section padding cadence, `aspect-[4/5]` image treatment, `font-headline` heading scale.
- `app/(main)/travel/page.tsx` — additional hero + section pattern reference.
- `components/Navbar.tsx` — the `links` array (lines 7-16) is the only file the navbar plan touches. Active-state branching at `:43-48` (desktop) / `:84-89` (mobile) is read-only.

### Prior phase artifacts
- `.planning/phases/02-registry-page/02-UI-SPEC.md` — most recent UI design contract; carry forward the typography scale, motion vocabulary, and a11y contract.
- `.planning/phases/02-registry-page/02-VERIFICATION.md` — most recent verifier output; gives the bar for what "ready to ship" looks like.
- `.planning/phases/02-registry-page/02-CONTEXT.md` — pattern precedent for `// TODO: replace with real <X>` handoff pattern (D-12 in that file).

### External / image assets
- `/public/bridal-party/` — folder Tyler creates and fills with `<slug>.jpg` files before ship. Slugs are lowercase-kebab of member names (see D-07).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Hero pattern** (`app/(main)/registry/page.tsx:45-81`): full-bleed `relative h-[614px]` section with parallax bg + scrim + `hero-reveal-*` motion. Drop-in for Phase 3 hero. The Registry contrast fix (`e82d7d4`) is the proven scrim recipe.
- **Section header pattern** (`app/(main)/registry/page.tsx:101-109`): eyebrow `<span>` in `font-label text-xs uppercase tracking-[0.4em] text-primary` + h2 in `font-headline text-4xl md:text-6xl` with italicized warm-gold word. Use this for the "Bride's Side" / "Groom's Side" section headers.
- **Reveal motion** (`app/globals.css`): `.reveal-on-scroll` (single-element fade-slide-up) applied to each member row. Skip `.reveal-on-scroll-stagger` (which staggers children) since rows are full-width — staggering them would feel chaotic.
- **Layout container**: `max-w-[1440px] mx-auto px-6 md:px-12` — standard outer wrapper used across `(main)` pages.
- **Image pattern**: plain `<img className="w-full h-full object-cover ..." />` inside an `aspect-[4/5]` wrapper, preceded by `{/* eslint-disable-next-line @next/next/no-img-element */}`. See `app/(main)/registry/page.tsx:121-132`.

### Patterns to NOT Reuse
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ...` (the Registry/Things-To-Do card grid) — Phase 3 uses **flex/grid rows**, not a 3-up card grid. Use `flex flex-col gap-y-24 md:gap-y-32` (or `space-y-*`) for the section's row stack.
- `editorial-underline` class — no outbound CTAs on bridal-party cards, so no CTA underline.
- `target="_blank" rel="noopener noreferrer"` — no outbound anchors, no tabnabbing surface.

### Integration Points
- **Navbar** (`components/Navbar.tsx:7-16`) — add new entry `{ label: "Bridal Party", href: "/bridal-party" }` between `Things To Do` and `FAQ`. New entry, not previously stubbed (unlike Registry which had a commented stub).
- **(main) layout** (`app/(main)/layout.tsx`) — auto-wraps `bridal-party/page.tsx` with `<Navbar />` + `<Footer />` + `<MusicButton />`. No `pt-20` on `<main>` (hero floats under fixed nav).

</code_context>

<inferred_specifics>
## Inferred from User Conversation

### Roster Specifics (verbatim from user input)
- **Maid of Honor:** Sarah Else
- **Best Man:** Dylan Straffon
- **Other Bride's Side (7 members):** Emily Asinger, Lindsay Carr, Sarah Horan, Sam Jones, Shannon Robins, Michelle Spencer, Ryan Hindle
- **Other Groom's Side (7 members):** Aaron Sorge, Jack Cardello, Ken Kinoshita, Jon Metz, Ian Adams, Collin DeMatt, Josh Tallman
- **Total:** 16 members in two sections of 8.

### Layout Specifics (from option selection + preview)
- Magazine layout with name + role + bio on one side, photo on the other side.
- Alternating left/right per row on desktop chosen via preview.
- 4:5 portrait crop for all photos.
- Plain `<img>` with eslint-disable (matches Registry/Things-To-Do/Travel — codebase wins over ROADMAP wording).

### Voice Specifics
- Bios written in **first-person from the couple** ("we", "us") about each member.
- Strict 1-2 sentence limit per bio.
- 16 `// TODO: replace with real bio` placeholders during execution (Tyler fills at handoff).

### Navigation Specifics
- Final desktop nav order: `Home  Travel & Stay  Itinerary  Things To Do  Bridal Party  FAQ  Registry  RSVP`.
- Mobile menu inherits same order via shared `links` array.

</inferred_specifics>

---

**Next:** `/gsd:ui-phase 3` to produce the UI-SPEC.md design contract (this is a `UI hint: yes` phase). Then `/gsd:plan-phase 3` and `/gsd:execute-phase 3`.

**Estimated plan count:** 2 plans (page scaffold + row layout in one, navbar wiring + smoke checklist in the other). Less complexity than Registry because there's no outbound-link security surface.
