# Phase 2: Registry Page - Context

**Gathered:** 2026-05-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a single `/registry` route under `app/(main)/registry/page.tsx` that lists the couple's chosen gift registries with curated imagery, short blurbs, and outbound "Visit Registry" CTAs — styled to the Stitch dark-editorial system, and exposed in the main nav. Three registries: Honeyfund, Amazon, Crate & Barrel. No backend, no auth, no gift tracking.

</domain>

<decisions>
## Implementation Decisions

### Registry list & data
- **D-01:** Three registries in scope: **Honeyfund** (honeymoon fund), **Amazon**, **Crate & Barrel**. No Zola.
- **D-02:** Registry data lives as an **inline `const registries` array in `app/(main)/registry/page.tsx`** — same pattern as `app/(main)/things-to-do/page.tsx`. No separate config file, no JSON.
- **D-03:** Each registry object carries: `title`, `description` (short blurb), `image` (URL), `alt`, `link` (outbound registry URL).

### Layout & hero
- **D-04:** **3-column responsive card grid** (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) like Things-To-Do. Each card: curated image above, title, blurb, "Visit Registry" CTA using the `editorial-underline` link style.
- **D-05:** **Full-bleed cinematic hero** matching Things-To-Do / Travel — background image with scrim, `hero-reveal-label` / `hero-reveal-title` / `hero-reveal-subtitle` motion classes, `font-label` uppercase eyebrow, `font-headline` title with an italicized primary-toned word.
- **D-06:** Aspect ratio for card images: **`aspect-[4/5]`** matching Things-To-Do cards. Group hover scales image to `1.10` over 1000ms with a fading dark overlay.

### Brand presentation
- **D-07:** **Curated editorial image per card** — NOT brand logos. Avoids brand-color clashes with the dark teal + warm gold palette and keeps the page visually cohesive with the rest of the site (Honeyfund → honeymoon-evocative shot like mountains/passport; Amazon → wrapped gift / package shot; Crate & Barrel → kitchen/home goods shot).
- **D-08:** Registry name renders as the card **headline in `font-headline`** (Noto Serif). No brand logos, no wordmarks beyond the title text.

### Personal note from couple
- **D-09:** Include a **personal framing block between the hero and the registry grid** — short editorial copy (1–2 sentences) in the warm-and-gracious tone: e.g., "Your presence is the greatest gift. If you'd like to celebrate with something more, here are a few places we've registered."
- **D-10:** Tone is **warm and gracious** — soft, grateful, low-pressure. Not playful, not honeymoon-forward.
- **D-11:** Hero subhead can carry a complementary line (e.g., "A few places we've put together — but truly, just being there is enough.") — let UI-researcher land the final copy with the framing block in mind.

### Asset sourcing
- **D-12:** Planner uses **placeholder URLs (`#` or `https://...placeholder`)** and Unsplash-style stock imagery for cards during planning/execution. Tyler will swap in real registry URLs and (optionally) real images before final ship. Note this clearly in the CTA so it isn't forgotten at handoff.

### Nav integration
- **D-13:** Uncomment the Registry link at `components/Navbar.tsx:13` (`{ label: "Registry", href: "/#registry" }`) and update `href` to `/registry`. This is the only change to the navbar — no new entries.

### Claude's Discretion
- Exact hero image selection (suggest something evocative: wrapped gifts, alpine view, a curated home tabletop — UI-researcher / planner picks)
- Exact section padding numbers (follow the Things-To-Do cadence — `py-16` / `py-32`)
- Exact framing copy wording (within the "warm and gracious" tone)
- Whether to add a subtle radial gradient under the cards section like the Things-To-Do restaurants section (`bg-[radial-gradient(...)]`) — UI judgment call

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and project anchors
- `.planning/ROADMAP.md` §"Phase 2 — Registry Page" — phase goal, scope, dependencies
- `.planning/PROJECT.md` — Stitch design system summary, palette, font families, audience constraints

### Design system (Stitch tokens + utilities)
- `app/globals.css` — full token set (`--color-primary` warm gold `#d4a373`, `--color-surface` deep teal `#122023`, `--color-surface-container` etc.), font families (`font-headline` Noto Serif, `font-label` Manrope), and component utilities: `.hero-parallax-bg`, `.hero-reveal-label`, `.hero-reveal-title`, `.hero-reveal-subtitle`, `.reveal-on-scroll`, `.reveal-on-scroll-stagger`, `.editorial-underline`, `.glass-nav`

### Layout / pattern references (read before drafting)
- `app/(main)/things-to-do/page.tsx` — **primary visual reference**: hero + 3-col card grid pattern with `aspect-[4/5]` images, group hover scale, `editorial-underline` CTA, `reveal-on-scroll-stagger`
- `app/(main)/travel/page.tsx` — secondary hero + card reference (Travel & Stay)
- `app/(main)/faq/page.tsx` — alternative editorial pattern (not the layout choice here, but useful for the framing block / `bg-surface` section treatment)
- `components/Navbar.tsx` — line 13 holds the commented-out Registry link to uncomment

### Prior phase artifacts
- `.planning/phases/01-rsvp-enablement/01-UI-SPEC.md` — established design principles, motion vocabulary, and a11y posture from Phase 1 (carry forward where applicable)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Card grid pattern** (`app/(main)/things-to-do/page.tsx:118-141`): `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 md:gap-y-24` with `reveal-on-scroll-stagger` — direct fit for the registry grid.
- **Hero pattern** (`app/(main)/things-to-do/page.tsx:63-92`): `relative h-[614px]` section with `hero-parallax-bg` background image, gradient scrim, and `hero-reveal-*` motion on label / title / subtitle.
- **Editorial link CTA** (`.editorial-underline` in `app/globals.css:155-170`): use for "Visit Registry" with an italic `font-headline` text-primary line and animated underline.
- **Layout container**: `max-w-[1440px] mx-auto px-6 md:px-12` — standard outer wrapper used across `(main)` pages.
- **Section background tokens**: `bg-background` (default), `bg-surface` (alternating section like FAQ / Restaurants) for visual cadence.

### Established Patterns
- **Outbound links** open in a new tab with `target="_blank" rel="noopener noreferrer"` — matches every external link on Things-To-Do.
- **Image hover treatment**: `transition-transform duration-1000 scale-105 group-hover:scale-110` with a fading dark overlay (`bg-background/20 group-hover:bg-transparent`).
- **Inline data arrays** keep page data adjacent to the page that uses it — no separate `data/` directory exists in the project.
- **`(main)` route group** wraps every public page; new route just drops into `app/(main)/registry/page.tsx` and inherits the shared layout + nav.

### Integration Points
- `components/Navbar.tsx:13` — uncomment, update href from `/#registry` to `/registry`. Active state logic already handles arbitrary routes (`pathname.startsWith(href)`).
- No new dependencies needed — `next/link` is already imported across the project; no images/components require install.

</code_context>

<specifics>
## Specific Ideas

- Use **Honeyfund first** in the card order — couple's emphasis is on the honeymoon experience, and putting it first lets it benefit from the eye's natural left-to-right scan.
- Framing block reference copy (UI-researcher to refine within tone): "Your presence is the greatest gift. If you'd like to celebrate with something more, here are a few places we've registered."
- Card titles should be the bare brand name in `font-headline` (e.g., "Honeyfund", "Amazon", "Crate & Barrel") — no marketing taglines.
- "Visit Registry" CTA copy is the canonical link label across all three cards — keep it identical for rhythm.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. (Future ideas like gift tracking, RSVP-linked thank-you flow, or a dedicated honeymoon-experience picker remain explicitly out of scope per PROJECT.md.)

</deferred>

---

*Phase: 02-registry-page*
*Context gathered: 2026-05-29*
