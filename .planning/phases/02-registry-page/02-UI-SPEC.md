---
phase: 2
slug: registry-page
status: draft
shadcn_initialized: false
preset: none
created: 2026-05-29
---

# Phase 2 — UI Design Contract

> Visual and interaction contract for the Registry Page phase. New route `app/(main)/registry/page.tsx`. Mirrors the Things-To-Do page structure: full-bleed cinematic hero + 3-column editorial card grid. No backend, no auth, no new dependencies.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (manual Tailwind v4 `@theme` tokens) |
| Preset | not applicable |
| Component library | none (native HTML + Tailwind utility classes) |
| Icon library | Material Symbols Outlined (loaded in `app/layout.tsx`) |
| Font | Noto Serif (headlines, `font-headline`) + Manrope (body and labels, `font-body` / `font-label`) |

**Source of truth:** `app/globals.css` `@theme` block. Do not introduce new color, font, radius, or animation tokens. Do not import a UI component library. Match the dark-editorial alpine aesthetic of `/things-to-do` and `/travel`.

Source: `app/globals.css` + `02-CONTEXT.md` canonical refs

---

## Spacing Scale

Declared values (multiples of 4, Tailwind defaults — carry forward from Phase 1):

| Token | Value | Usage in this phase |
|-------|-------|---------------------|
| xs | 4px (`gap-1`) | Inline gaps inside CTA link (icon-to-text) |
| sm | 8px (`mb-2`, `gap-2`) | Card title-to-blurb gap |
| md | 16px (`mb-4`, `gap-4`) | Hero eyebrow-to-headline gap |
| lg | 24px (`mb-6`, `pb-6`) | Hero headline-to-subtitle gap |
| xl | 32px (`mb-8`, `pb-8`) | Card image-to-title gap |
| 2xl | 48px (`py-12`) | Framing block vertical padding |
| 3xl | 64px (`py-16`) | Activities section vertical padding (`py-16` top) |
| hero-bottom | 80px (`pb-20`) | Hero content bottom padding — explicit carry-forward from Things-To-Do |

**Section cadence (direct port from Things-To-Do):**
- Hero: `relative h-[614px]` with bottom content justified to `pb-20`
- Framing block: `py-16 bg-background`
- Registry grid section: `py-16 bg-background`

**Grid gaps (direct port from Things-To-Do card grid):**
- Column gap: `gap-x-12` (48px)
- Row gap mobile: `gap-y-12` (48px) → desktop: `md:gap-y-24` (96px)

**Exceptions:**
- Hero label tracking: `tracking-[0.4em]` (editorial Stitch convention — not a Tailwind default)
- Hero title tracking: `tracking-tighter` with `leading-[0.85]`

Source: `app/(main)/things-to-do/page.tsx` + `app/globals.css`

---

## Typography

Existing Stitch type system — 4 size tiers, do not introduce new sizes:

| Tier | Role | Class | Size | Weight | Line Height | Use |
|------|------|-------|------|--------|-------------|-----|
| Display | Hero title | `font-headline text-5xl md:text-8xl` | 48 / 96px (responsive pair = 1 size role) | 400 regular | `leading-[0.85] tracking-tighter` | Page `<h1>` hero title |
| Heading | Section heading | `font-headline text-4xl md:text-6xl` | 36 / 60px | 400 regular | `leading-tight` | Grid section `<h2>` (e.g., "Our Registries") |
| Heading | Card title | `font-headline text-2xl md:text-4xl` | 24 / 36px responsive | 400 regular | default (~1.3) | Registry name on each card (`<h3>`) — same size family as section heading |
| Body | Prose copy | `font-body text-lg font-light leading-relaxed` | 18px | 300 | ~1.625 | Hero subtitle, framing block prose, card description blurbs |
| Small | Eyebrow / label | `font-label text-sm uppercase tracking-[0.4em]` | 14px | 400 | default | Hero eyebrow, section eyebrow |
| Small | CTA link | `font-headline italic text-sm` | 14px | 400 italic | default | "Visit Registry" `editorial-underline` link |

**4 distinct pixel values declared:** 14px (Small tier), 18px (Body tier), 24–36px responsive (Heading tier), 48–96px responsive (Display tier).

**Merges applied vs. prior draft:**
- 12px label/eyebrow merged up to 14px (`text-sm`). Eyebrow class changes from `text-xs` to `text-sm`. Tracking `[0.4em]` is preserved — the wider tracking compensates visually.
- 16px body small merged up to 18px (`text-lg`). Card description blurbs use `font-body text-lg font-light leading-relaxed` instead of `text-base`. The difference is 2px; at card scale in this dark context it is not perceptible.
- 24px card title (`text-2xl`) given a responsive counterpart `md:text-4xl`, placing it in the same Heading tier as section headings. This is additive — card titles grow on wider viewports rather than staying fixed at 24px.

**Weight policy:** 300 (font-light for body copy), 400 (regular for headlines and labels). No 600/700/800 introduced in this phase — those appear only in the RSVP form CTA per Phase 1 contract.

Source: `app/(main)/things-to-do/page.tsx` lines 80–136 + `01-UI-SPEC.md` typography section

---

## Color

**Palette (60 / 30 / 10) — carry forward from Phase 1:**

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Dominant (60%) | `bg-background` / `text-on-surface` | `#0d1b1e` / `#e2e8e4` | Page background, card area background, body text |
| Secondary (30%) | `bg-surface` | `#122023` | Not used as a distinct section in this phase — grid stays on `bg-background` |
| Accent (10%) | `text-primary` | `#d4a373` | See reserved list below |
| Muted | `text-on-surface-variant` | `#a0ada9` | Card blurb text, hero subtitle |
| Overlay (card hover) | `bg-background/20` → `bg-transparent` | `rgba(13,27,30,0.2)` | Card image dark overlay (fades out on group-hover) |
| Image placeholder | `bg-surface-variant/50` | — | Card image container before image loads |

**Accent reserved for (exact list — do not extend):**
1. Hero eyebrow label text (`text-primary`)
2. The italic word in the hero headline (e.g., "Gifts" or "Registry" rendered as `<span class="italic font-light text-primary/80">`)
3. Card title hover color change (`group-hover:text-primary` on the `<h3>`)
4. "Visit Registry" CTA link text (`text-primary italic font-headline editorial-underline`)
5. Section eyebrow label text above the grid (`text-primary`)
6. The framing block eyebrow if one is used (optional, same `text-primary` treatment)

**No accent on:** hero subtitle body text, card description blurb, framing block body prose, page background, card image containers.

**Radial gradient (Claude discretion — include):** Apply `bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,163,115,0.04)_0%,transparent_60%)]` as a decorative overlay in the registry grid section, matching the Restaurants section treatment in Things-To-Do. This adds subtle warmth to the dark background without visible color. Mark `pointer-events-none`.

Source: `app/globals.css` @theme + `app/(main)/things-to-do/page.tsx` + `02-CONTEXT.md` D-07

---

## Hero Spec

**Dimensions:** `relative h-[614px] w-full overflow-hidden bg-background` — exact match to Things-To-Do.

**Background image:** Placeholder URL during execution. Tyler will swap in final image before ship. Suggested stock subject: curated home tabletop (linens, glassware, light) — evokes domestic warmth without brand-color conflicts. Applied as `background-image` inline style on the `hero-parallax-bg` div.

**Scrim:** `linear-gradient(to bottom, rgba(13,27,30,0.05), rgba(13,27,30,0.3))` — same light-hand scrim as Things-To-Do (text sits at bottom, image reads clearly in upper 60%).

**Content position:** `flex flex-col justify-end pb-20` inside `relative z-10 h-full max-w-[1440px] mx-auto px-6 md:px-12`.

**Motion classes:**
- Eyebrow: `hero-reveal-label` (fade-up, 800ms, 200ms delay)
- Title: `hero-reveal-title` (fade-up, 800ms, 400ms delay)
- Subtitle: `hero-reveal-subtitle` (fade-up, 800ms, 600ms delay)

**Reduced motion:** Covered by the global `@media (prefers-reduced-motion: reduce)` block in `globals.css` — no extra handling needed.

Source: `02-CONTEXT.md` D-04, D-05 + `app/(main)/things-to-do/page.tsx` lines 63–92

---

## Framing Block Spec

**Position:** Between hero and registry grid. Separate `<section>` with `py-16 bg-background`.

**Container:** `max-w-[1440px] mx-auto px-6 md:px-12`.

**Content:** Single centered prose block, `max-w-2xl mx-auto text-center reveal-on-scroll`.

**No eyebrow label** in the framing block — the copy alone carries the section. An eyebrow would over-formalize the warm-and-gracious tone.

Source: `02-CONTEXT.md` D-09, D-10

---

## Card Grid Spec

**Section wrapper:** `<section class="py-16 bg-background relative overflow-hidden">` with the radial gradient overlay div inside.

**Section header block:** `mb-12 md:mb-24 reveal-on-scroll` containing eyebrow + `<h2>`.

**Grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 md:gap-y-24 reveal-on-scroll-stagger` — direct copy from Things-To-Do line 118.

**Card element:** `<a>` tag (not `<div>`) with `target="_blank" rel="noopener noreferrer"`, class `group cursor-pointer block`.

**Card image container:** `aspect-[4/5] bg-surface-variant/50 mb-8 overflow-hidden relative`.

**Card image hover overlay:** `absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500 z-10` (dark veil fades on hover).

**Card image:** `w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-110` (parallax scale from 1.05 to 1.10 over 1000ms).

**Card title:** `font-headline text-2xl md:text-4xl text-on-surface mb-3 group-hover:text-primary transition-colors` — bare brand name only (Honeyfund / Amazon / Crate & Barrel).

**Card description:** `text-on-surface-variant text-lg leading-relaxed mb-6 font-light`.

**Card CTA:** `font-headline italic text-primary text-sm editorial-underline inline-flex items-center gap-2 group-hover:gap-3 transition-all` — text: "Visit Registry" (identical across all three cards).

**Card order:** Honeyfund (col 1), Amazon (col 2), Crate & Barrel (col 3).

Source: `02-CONTEXT.md` D-04, D-06, D-08 + `app/(main)/things-to-do/page.tsx` lines 118–141

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Hero eyebrow | `For Our Guests` |
| Hero headline | `Our *Registries*` (with "Registries" as `<span class="italic font-light text-primary/80">`) |
| Hero subtitle | `A few places we've put together — but truly, just being there is enough.` |
| Section eyebrow (above grid) | `Gift Registries` |
| Section heading (above grid) | `A Few of Our *Favorites*` (with "Favorites" as italic accent span) |
| Framing block copy | `Your presence is the greatest gift. If you'd like to celebrate with something more, here are a few places we've registered.` |
| Card CTA (all three cards) | `Visit Registry` |
| Honeyfund card description | `Our honeymoon adventure fund. Help us celebrate by contributing to the trip of a lifetime.` |
| Amazon card description | `From everyday essentials to home upgrades — our Amazon wishlist has a little of everything.` |
| Crate & Barrel card description | `Tableware, linens, and kitchen goods we've been eyeing for our first home together.` |
| Empty state | Not applicable — the page always renders the static three cards. |
| Error state | Not applicable — no data fetching, no dynamic state. |
| Destructive confirmation | Not applicable — no destructive actions on this page. |

**Asset handoff note (for executor):** Card `link` values must be set to `#` (placeholder) with a `// TODO: replace with real registry URL` comment. Tyler will swap in the live URLs before ship. This must appear in the code as a comment, not silently left as `#`.

**Tone reminder:** Warm and gracious, not celebratory or honeymoon-forward. Low-pressure. No exclamation marks in the registry copy.

Source: `02-CONTEXT.md` D-09, D-10, D-11, D-12, Specific Ideas section

---

## Navbar Integration

**Change:** Uncomment the Registry entry at `components/Navbar.tsx:13`. Update `href` from `/#registry` to `/registry`.

**Nav order after change (desktop, left-to-right after logo):**
`Home` · `Travel & Stay` · `Itinerary` · `Things To Do` · `FAQ` · `Registry` · `RSVP`

**Placement rationale:** Registry sits before RSVP — it's informational, RSVP is the final action. This preserves RSVP's terminal emphasis.

**Styling:** Same `font-label text-[10px] uppercase tracking-[0.2em]` as all other nav links. No accent color in idle state. Active state (`/registry`) uses `text-primary` via existing `pathname.startsWith(href)` logic — no code change needed.

Source: `02-CONTEXT.md` D-13

---

## Accessibility Contract

| Requirement | Implementation |
|-------------|----------------|
| Page landmark | `<main>` wraps all sections |
| Hero heading | `<h1>` for the hero title ("Our Registries") |
| Section headings | `<h2>` for grid section heading; `<h3>` for each card title |
| Outbound link disclosure | `target="_blank" rel="noopener noreferrer"` on all three card `<a>` tags; screen reader users benefit from `aria-label="Visit Honeyfund registry (opens in new tab)"` pattern on each card link |
| Decorative hero overlay | Background div `aria-hidden="true"` |
| Hero parallax div | `aria-hidden="true"` (presentational) |
| Image alt text | Each `<img>` has descriptive `alt` describing the scene, not the brand (e.g., "Mountains and passport evoking travel" not "Honeyfund logo") |
| Reduced motion | Global `globals.css` `@media (prefers-reduced-motion: reduce)` block disables all `hero-parallax-bg`, `hero-reveal-*`, and `reveal-on-scroll-stagger` animations — no extra handling needed |
| Color contrast | `text-primary` (#d4a373) on `bg-background` (#0d1b1e) = ~5.5:1 (WCAG AA). `text-on-surface` (#e2e8e4) on `bg-background` (#0d1b1e) = ~14:1. `text-on-surface-variant` (#a0ada9) on `bg-background` (#0d1b1e) = ~5.9:1 (passes AA). |
| Focus visible | Native `<a>` elements receive browser default focus ring — do not suppress with `focus:ring-0` on these links (editorial restraint applies to form inputs, not outbound links) |

---

## Component Inventory (Reuse Map)

| Component / Pattern | Source | Notes |
|---------------------|--------|-------|
| `Navbar` | `components/Navbar.tsx` | Uncomment Registry link, update href — one line change |
| `Footer` | `components/Footer.tsx` | No change |
| Hero pattern | `app/(main)/things-to-do/page.tsx` lines 63–92 | Direct port, swap copy and image URL |
| 3-col card grid | `app/(main)/things-to-do/page.tsx` lines 118–141 | Direct port, swap data array |
| `.hero-parallax-bg` | `app/globals.css` line 364 | Already exists, no change |
| `.hero-reveal-label/title/subtitle` | `app/globals.css` lines 346–356 | Already exists, no change |
| `.reveal-on-scroll` / `.reveal-on-scroll-stagger` | `app/globals.css` lines 432–446 | Already exists, no change |
| `.editorial-underline` | `app/globals.css` lines 155–168 | Already exists, no change |
| Radial gradient overlay | Inline class on section div | Pattern from Things-To-Do Restaurants section, line 147 |

**No new components.** No `shadcn add`. No `npm install`. Implementation is purely additive — one new file + one navbar line.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not applicable (no shadcn) |
| Third-party | none | not applicable |

No external component imports, no registry installs. Implementation uses native HTML + Tailwind utilities + existing Stitch CSS classes exclusively.

---

## Acceptance Criteria (Implementation Phase Must Hit)

### Functional

- [ ] `app/(main)/registry/page.tsx` exists and renders at `localhost:3000/registry`
- [ ] Page inherits the `(main)` layout (shared nav + footer) automatically
- [ ] All three registry `<a>` tags have `href="#"` with a `// TODO: replace with real registry URL` comment
- [ ] All outbound links have `target="_blank" rel="noopener noreferrer"`
- [ ] `components/Navbar.tsx` Registry link is uncommented and `href` is `/registry`
- [ ] Navbar active state highlights "Registry" when the user is on `/registry`

### Visual

- [ ] Hero is `h-[614px]` with `hero-parallax-bg` background image, gradient scrim, and `hero-reveal-*` entrance animations
- [ ] Hero eyebrow, title with italic accent span, and subtitle match copywriting contract verbatim
- [ ] Framing block renders between hero and grid, centered, `max-w-2xl`, `reveal-on-scroll`
- [ ] Card grid is `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 md:gap-y-24`
- [ ] Each card: `aspect-[4/5]` image with scale-105/scale-110 hover transition, dark overlay that fades out, title, blurb, "Visit Registry" editorial-underline CTA
- [ ] Card order: Honeyfund → Amazon → Crate & Barrel (left-to-right on desktop)
- [ ] No new color, font, radius, or animation tokens introduced
- [ ] Accent color appears only on the elements listed in the "Accent reserved for" section above

### Copy

- [ ] All copy matches the copywriting contract verbatim
- [ ] "Visit Registry" is identical across all three cards
- [ ] No exclamation marks in registry section copy
- [ ] Framing block renders the exact approved copy: "Your presence is the greatest gift. If you'd like to celebrate with something more, here are a few places we've registered."

### Interaction

- [ ] Image hover: scale from 1.05 to 1.10 over 1000ms, dark overlay fades to transparent over 500ms
- [ ] Card title: `group-hover:text-primary transition-colors`
- [ ] CTA link gap: `gap-2 group-hover:gap-3 transition-all`
- [ ] Section grid has `reveal-on-scroll-stagger` for staggered entrance of the three cards

### Accessibility

- [ ] `<h1>` on hero title, `<h2>` on grid section heading, `<h3>` on each card title
- [ ] Each card `<a>` has an `aria-label` that includes "(opens in new tab)"
- [ ] All decorative background / overlay divs are `aria-hidden="true"`
- [ ] Each card `<img>` has a descriptive `alt` text (scene description, not brand name)
- [ ] No `focus:ring-0` on the card links

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
