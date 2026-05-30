---
phase: 3
slug: bridal-party
status: draft
shadcn_initialized: false
preset: none
created: 2026-05-30
---

# Phase 3 — UI Design Contract

> Visual and interaction contract for the Bridal Party page. New route `app/(main)/bridal-party/page.tsx`. Carries forward the Phase 2 Registry hero recipe and type/motion vocabulary; departs from the Registry card grid in favor of a **magazine row** layout (text on one side, portrait on the other, alternating left/right per row on desktop). 16-person roster split into two symmetric sections (Bride's Side, Groom's Side). No backend, no auth, no outbound links, no new dependencies.

---

## Domain / Goal

A `/bridal-party` page that introduces the 16 members of the wedding party (8 Bride's Side + 8 Groom's Side) with a portrait, role label, name, and 1–2 sentence couple-voice bio per person. Tone is warm-gracious, matching the Registry framing block. The page must feel like a single editorial spread — not a directory, not a card grid.

**Source of truth:** `.planning/phases/03-bridal-party/03-CONTEXT.md` (13 locked decisions, D-01 through D-12). All visual and interaction choices below either implement those decisions or fill the discretion gaps the CONTEXT explicitly left to UI research.

---

## Design Pillars / Principles

1. **Editorial over inventory.** Every member gets a full row, not a grid cell. No card chrome, no "Visit" CTA — just photo, name, role, and voice.
2. **Carry-forward, not reinvention.** Hero recipe, type tiers, color tokens, and motion utilities are direct ports from Phase 2 Registry. New decisions are the magazine row, monogram fallback, and section cadence — nothing else.
3. **Alternation creates rhythm, stacking preserves clarity.** Desktop alternates text/photo left/right per row (visual cadence); mobile collapses to text-above-photo every row (reading clarity).
4. **Graceful when assets are missing.** Missing portraits render a warm-gold monogram on a dark surface block — looks intentional, not broken. Tyler can ship before all 16 photos exist.
5. **Restraint with the accent.** Warm gold is reserved for role eyebrows, italicized accent words, and the monogram-fallback initials. Nothing else gets the accent.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (manual Tailwind v4 `@theme` tokens — carry from Phase 1/2) |
| Preset | not applicable |
| Component library | none (native HTML + Tailwind utility classes) |
| Icon library | Material Symbols Outlined (loaded in `app/layout.tsx`) — **not used on this page** (no icons render in the bridal-party layout) |
| Font | Noto Serif (headlines, `font-headline`) + Manrope (body and labels, `font-body` / `font-label`) |

**Source of truth:** `app/globals.css` `@theme` block. Do not introduce new color, font, radius, or animation tokens. Do not import a UI component library. Carry forward from Phase 2.

Source: `app/globals.css` + `03-CONTEXT.md` canonical refs + `02-UI-SPEC.md` §Design System

---

## Spacing Scale

Declared values (multiples of 4, Tailwind defaults — direct carry-forward from Phase 2):

| Token | Value | Usage in this phase |
|-------|-------|---------------------|
| sm | 8px (`mb-2`) | Role-eyebrow-to-name gap |
| md | 16px (`mb-4`) | Name-to-bio gap; hero eyebrow-to-headline gap (`mb-6` per Registry recipe) |
| lg | 24px (`mb-6`) | Hero eyebrow-to-headline + headline-to-subtitle gap (verbatim Registry recipe) |
| xl | 32px (`mb-8`) | Section header eyebrow-to-h2 gap |
| 2xl | 48px (`gap-x-12`, `mb-12`) | Desktop column gap between text column and photo column (small breakpoint); mobile section-header bottom margin |
| 3xl | 64px (`gap-x-16`, `mb-16`) | Desktop column gap at `md+`; row-stack vertical gap at mobile (`gap-y-16`) |
| 4xl | 96px (`gap-y-24`, `mb-24`) | Desktop row-stack vertical gap (`md:gap-y-24`); section-header bottom margin at `md+` |
| 5xl | 128px (`md:gap-y-32`, `py-32`) | Desktop row-stack vertical gap at large breakpoint (`lg:gap-y-32`); section vertical padding |
| hero-bottom | 80px (`pb-20`) | Hero content bottom padding — direct carry-forward |

**Section cadence:**
- Hero: `relative h-[614px]` with bottom content justified at `pb-20`
- Bride's Side section: `py-24 md:py-32 bg-background` (more breathing room than Registry's `py-16` because each section has 8 rows, not a 3-up grid — per CONTEXT discretion note)
- Groom's Side section: `py-24 md:py-32 bg-background` (identical cadence to Bride's Side for symmetry)

**Row layout grid (each member row):**
- Wrapper: `grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-12 lg:gap-x-16 items-center reveal-on-scroll`
- Text column: `md:col-span-7` (text-left rows) or `md:col-span-7 md:col-start-6` (text-right rows)
- Photo column: `md:col-span-5` (photo-right rows, default position) or `md:col-span-5 md:col-start-1 md:row-start-1` (photo-left rows)
- Alternation rule: row index `i` even (0, 2, 4, 6) = text-left/photo-right; row index `i` odd (1, 3, 5, 7) = text-right/photo-left. **Honor attendant (index 0) always renders text-left/photo-right** for both sections — keeps Sarah Else and Dylan Straffon visually anchored in the same position.
- Mobile (`<md`): `grid-cols-1` flattens the alternation; text always renders above photo every row.

**Row stack vertical gap:**
- Mobile: `gap-y-16` (64px) between rows
- Desktop: `md:gap-y-24` (96px) between rows
- Large: `lg:gap-y-32` (128px) between rows

**Container:** `max-w-[1440px] mx-auto px-6 md:px-12` — standard outer wrapper, identical to Registry.

**Exceptions (carry-forward):**
- Hero label tracking: `tracking-[0.4em]` (editorial Stitch convention)
- Hero title tracking: `tracking-tighter` with `leading-[0.85]`
- Role eyebrow tracking: `tracking-[0.4em]` (matches hero eyebrow recipe)

Source: `02-UI-SPEC.md` §Spacing Scale + `03-CONTEXT.md` discretion notes (Section spacing, Per-row spacing)

---

## Typography

Existing Stitch type system — same 4 tiers as Phase 2, with one **carry-forward merge**: card titles become member names. No new sizes are introduced.

| Tier | Role | Class | Size | Weight | Line Height | Use |
|------|------|-------|------|--------|-------------|-----|
| Display | Hero title | `font-headline text-5xl md:text-8xl` | 48 / 96px responsive | 400 regular | `leading-[0.85] tracking-tighter` | Page `<h1>` hero title |
| Heading | Section heading | `font-headline text-4xl md:text-6xl` | 36 / 60px | 400 regular | `leading-tight` | "Bride's Side" / "Groom's Side" `<h2>` |
| Heading | Member name | `font-headline text-2xl md:text-4xl` | 24 / 36px responsive | 400 regular | default (~1.3) | Per-row `<h3>` member name — same tier as Registry card titles |
| Body | Prose copy | `font-body text-lg font-light leading-relaxed` | 18px | 300 | ~1.625 | Hero subtitle, member bio prose |
| Small | Eyebrow / role label | `font-label text-xs uppercase tracking-[0.4em]` | 12px | 400 | default | Hero eyebrow, section eyebrow, per-member role label above name |
| Display fallback | Monogram initials | `font-headline italic text-5xl md:text-7xl` | 48 / 72px responsive | 400 italic | default | Two-letter initials inside missing-photo placeholder block |

**Distinct pixel values declared:** 12px (eyebrow), 18px (body), 24–36px (Heading tier), 48–96px (Display tier). Four tiers, two weights (300, 400) — identical to Phase 2.

**Carry-forward merge (one):**
- The "card title" tier from Phase 2 (`text-2xl md:text-4xl`) is reused verbatim for the per-row member name `<h3>`. The bridal-party page is the second consumer of this responsive pair — its purpose now reads as a true "Member Name" tier, not just a card title.

**Departure from Phase 2 (one):**
- Eyebrow size drops back to `text-xs` (12px) to match the **hero eyebrow on shipped Registry code** (`page.tsx:67` reads `text-xs`, not `text-sm`). Phase 2 UI-SPEC §Typography described a `text-sm` merge that the shipped code did not adopt — Phase 3 mirrors the shipped reality. Tracking `[0.4em]` is preserved.

**Weight policy:** 300 (font-light for body copy), 400 (regular for headlines, eyebrows, and monogram initials). No 600/700/800 introduced — those remain RSVP-form-only.

Source: `app/(main)/registry/page.tsx` lines 67, 70, 105, 133 (shipped reality) + `02-UI-SPEC.md` §Typography (tier system carry)

---

## Color

**Palette (60 / 30 / 10) — direct carry-forward:**

| Role | Token | Hex | Usage in this phase |
|------|-------|-----|---------------------|
| Dominant (60%) | `bg-background` / `text-on-surface` | `#0d1b1e` / `#e2e8e4` | Page background, both section backgrounds, member name text, body |
| Secondary (30%) | `bg-surface-container` | `#1a2c2f` | Monogram fallback container block background |
| Accent (10%) | `text-primary` | `#d4a373` | See reserved list below |
| Muted | `text-on-surface-variant` | `#a0ada9` | Hero subtitle, member bio prose |
| Image placeholder | `bg-surface-variant/50` | rgba(26,44,47,0.5) | Photo container background while image loads (matches Registry recipe) |
| Hero scrim (vertical) | `rgba(13,27,30,…)` gradient | — | Hero darkening scrim, bottom-heavy |
| Hero scrim (horizontal) | `rgba(13,27,30,…)` gradient | — | Hero left-edge darkening for text legibility |

**Accent reserved for (exact list — do not extend):**
1. Hero eyebrow label text (`text-primary`)
2. The italic accent word in the hero headline (`<span class="italic font-light text-primary/80">`)
3. Section-header eyebrow label text ("THE BRIDE'S SIDE" / "THE GROOM'S SIDE")
4. The italic accent word in each section heading (e.g., "Bride's *Side*", "Groom's *Side*")
5. Per-row role eyebrow label text above each member name (e.g., "MAID OF HONOR", "BRIDESMAID")
6. Monogram fallback initials text color (`text-primary` on `bg-surface-container`)

**No accent on:** hero subtitle, member name `<h3>`, member bio body text, page background, section backgrounds, photo containers, photo border (no border).

**No radial gradient overlay this phase.** The Registry/Things-To-Do radial gradient (`bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,163,115,0.04)_0%,transparent_60%)]`) is intentionally omitted — the page is already long (16 rows + 2 section headers + hero), and adding a per-section gradient overlay would compete with the editorial cadence. Section backgrounds stay flat `bg-background`.

**Color contrast verification (carry from Phase 2 — same palette, same backgrounds):**
- `text-primary` (#d4a373) on `bg-background` (#0d1b1e) = ~5.5:1 (WCAG AA)
- `text-on-surface` (#e2e8e4) on `bg-background` (#0d1b1e) = ~14:1 (AAA)
- `text-on-surface-variant` (#a0ada9) on `bg-background` (#0d1b1e) = ~5.9:1 (AA)
- `text-primary` (#d4a373) on `bg-surface-container` (#1a2c2f) = ~4.9:1 (AA) — used by monogram fallback

Source: `app/globals.css` @theme + `02-UI-SPEC.md` §Color + `03-CONTEXT.md` D-07 (monogram color treatment)

---

## Hero Spec

**Dimensions:** `relative h-[614px] w-full overflow-hidden bg-background` — verbatim carry from Registry/Things-To-Do/Travel.

**Background image:** Placeholder URL during execution. Tyler swaps in the final image before ship. Suggested stock subject: a candid group shot of friends in alpine setting, or warm portrait-style imagery (candle-lit dinner, mountain golden hour) — evokes intimacy and gathering without being on-the-nose "wedding party." Applied as inline `background-image` style on the `hero-parallax-bg` div.

Placeholder URL to use during execution (Unsplash, same query family as Phase 2): `https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1600&q=80` (a generic warm-gathering composition). Add inline comment: `{/* TODO: replace with /public local hero image */}`.

**Scrim (verbatim carry from Registry `e82d7d4` 2-axis recipe):**
```css
background:
  linear-gradient(to bottom, rgba(13,27,30,0.15) 0%, rgba(13,27,30,0.5) 55%, rgba(13,27,30,0.85) 100%),
  linear-gradient(to right, rgba(13,27,30,0.45) 0%, rgba(13,27,30,0.15) 45%, transparent 70%);
```

**Structure (carry from Registry):**
```jsx
<section className="relative h-[614px] w-full overflow-hidden bg-background">
  <div className="absolute inset-0 z-0">
    {/* TODO: replace with /public local hero image */}
    <div
      className="w-full h-full bg-cover bg-center hero-parallax-bg"
      style={{ backgroundImage: "url('...')" }}
      aria-hidden="true"
    />
    <div className="absolute inset-0" aria-hidden="true" style={{ background: "<scrim recipe above>" }} />
  </div>
  <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-20">
    <div className="max-w-4xl">
      <p className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 hero-reveal-label">
        Our People
      </p>
      <h1 className="font-headline text-5xl md:text-8xl text-on-surface leading-[0.85] tracking-tighter mb-6 hero-reveal-title">
        The Ones <span className="italic font-light text-primary/80">Standing With Us</span>
      </h1>
      <p className="text-on-surface-variant text-lg max-w-2xl font-light leading-relaxed hero-reveal-subtitle">
        Eight on each side — the people we've leaned on, laughed with, and could not picture this weekend without.
      </p>
    </div>
  </div>
</section>
```

**Motion classes (carry-forward):**
- Eyebrow: `hero-reveal-label` (fade-up, 800ms, 200ms delay)
- Title: `hero-reveal-title` (fade-up, 800ms, 400ms delay)
- Subtitle: `hero-reveal-subtitle` (fade-up, 800ms, 600ms delay)
- Background: `hero-parallax-bg` (scale 1.08 → 1.0 over scroll)

**Reduced motion:** Covered by the global `@media (prefers-reduced-motion: reduce)` block in `app/globals.css:613-621` — disables `hero-reveal-*`, `hero-parallax-bg`, `reveal-on-scroll`, `reveal-on-scroll-stagger`, and `parallax-bg`. No per-page handling needed.

Source: `03-CONTEXT.md` Claude's Discretion (Hero treatment, Hero scrim) + `app/(main)/registry/page.tsx` lines 45-81 + `app/globals.css:613-621`

---

## Section Header Spec

Both sections use an identical header pattern (only the eyebrow and accent word change). Renders inside each section's `max-w-[1440px] mx-auto px-6 md:px-12` container.

**Wrapper:** `<div class="mb-16 md:mb-24 reveal-on-scroll">` (less than Registry's `mb-12 md:mb-24` because the page has two section headers and 16 rows — more rhythm-conscious spacing).

**Markup:**
```jsx
<div className="mb-16 md:mb-24 reveal-on-scroll">
  <span className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 block">
    {sectionEyebrow}
  </span>
  <h2 className="font-headline text-4xl md:text-6xl text-on-surface">
    {sectionLeadingWord}{" "}
    <span className="italic font-light text-primary/80">{sectionAccentWord}</span>
  </h2>
</div>
```

**Content per section:**

| Section | Eyebrow | Heading leading word | Heading accent word (italic, warm gold) |
|---------|---------|----------------------|------------------------------------------|
| Bride's Side | `THE BRIDE'S SIDE` | `Bride's` | `Side` |
| Groom's Side | `THE GROOM'S SIDE` | `Groom's` | `Side` |

**Order:** Bride's Side renders first (per D-01).

Source: `03-CONTEXT.md` Claude's Discretion (Bride's Side first, Heading hierarchy) + `app/(main)/registry/page.tsx:101-109` (section header pattern)

---

## Magazine Row Spec

Each member is a full-width row with text column and photo column. Eight rows per section, two sections, sixteen rows total.

**Row wrapper:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-12 lg:gap-x-16 items-center reveal-on-scroll">
```

**Text column markup:**
```jsx
<div className={`md:col-span-7 ${isTextRight ? "md:col-start-6" : ""}`}>
  <span className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-4 block">
    {member.role}
  </span>
  <h3 className="font-headline text-2xl md:text-4xl text-on-surface mb-4">
    {member.name}
  </h3>
  <p className="text-on-surface-variant text-lg font-light leading-relaxed">
    {member.bio}
  </p>
</div>
```

**Photo column markup (with monogram fallback — see Monogram Fallback Spec below):**
```jsx
<div className={`md:col-span-5 ${isTextRight ? "md:col-start-1 md:row-start-1" : ""}`}>
  <div className="aspect-[4/5] bg-surface-variant/50 overflow-hidden relative">
    {member.photo ? (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={`Portrait of ${member.name}`}
          className="w-full h-full object-cover"
          src={member.photo}
        />
      </>
    ) : (
      <div className="absolute inset-0 flex items-center justify-center bg-surface-container">
        <span aria-hidden="true" className="font-headline italic text-5xl md:text-7xl text-primary">
          {getInitials(member.name)}
        </span>
      </div>
    )}
  </div>
</div>
```

**Alternation rule (desktop, `md+`):**
- Row index `i` even (0, 2, 4, 6) → `isTextRight = false` → text in left 7 columns, photo in right 5 columns
- Row index `i` odd (1, 3, 5, 7) → `isTextRight = true` → text in right 7 columns, photo in left 5 columns
- Both sections start with `i = 0` (text-left/photo-right) — keeps Sarah Else (MOH) and Dylan Straffon (Best Man) visually anchored in the same position at the top of each section

**Mobile collapse (`<md`):**
- `grid-cols-1` flattens the 12-column layout
- Text column renders first (DOM order), photo column renders second — text always above photo on mobile, regardless of desktop alternation (per CONTEXT discretion note: "text always above photo on `<md`, not below. Reading order stays consistent (name → bio → face).")
- Achieve this by always putting text column **first in source order** in JSX, and using `md:row-start-1` on the photo column for text-right rows so it appears alongside the text on desktop

**No hover effects on rows.** No scale, no overlay, no color change. Rows are static editorial — not clickable, not interactive. (Departure from Registry cards, which had hover scale + overlay fade.)

**No card chrome.** No border, no shadow, no padding around the row wrapper. The row IS the editorial spread — adding card chrome would re-introduce the grid feel the layout explicitly rejects.

**Photo crop:** `aspect-[4/5]` — direct carry from Registry (D-06).

**Image element:** Plain `<img>` with `{/* eslint-disable-next-line @next/next/no-img-element */}` immediately above. Matches site-wide pattern (D-08). Supersedes ROADMAP's "image optimization via `next/image`" — explicitly noted as a deliberate deviation.

**Image path convention:** `/bridal-party/<slug>.jpg` where `<slug>` = `lowercase-kebab(name)`. Examples: `/bridal-party/sarah-else.jpg`, `/bridal-party/dylan-straffon.jpg`, `/bridal-party/jack-cardello.jpg`.

**Row reveal motion:** `reveal-on-scroll` (single fade-slide-up entrance per row, triggered when row enters viewport). **Do not** use `reveal-on-scroll-stagger` — staggering full-width rows feels chaotic. Each row reveals as a single unit.

Source: `03-CONTEXT.md` D-05, D-06, D-07, D-08 + Claude's Discretion (Per-row spacing, Row reveal animation, Mobile collapse direction)

---

## Monogram Fallback Spec

Used when `member.photo` is `null` or the file at `/bridal-party/<slug>.jpg` is missing. The component logic checks `member.photo` directly — there is no runtime existence check; if a member should ship without a photo, set their `photo` field to `null` in the inline data array.

**Container:** Inherits the same `aspect-[4/5]` wrapper as the photo container (so layout doesn't shift). Inner div fills with `absolute inset-0 flex items-center justify-center bg-surface-container`.

**Background:** `bg-surface-container` (`#1a2c2f`) — distinct from `bg-background` (`#0d1b1e`) so the fallback block reads as a deliberate placeholder, not a hole.

**Initials text:**
- Class: `font-headline italic text-5xl md:text-7xl text-primary`
- Content: two-letter uppercase initials derived as `name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()` — e.g., "Sarah Else" → `SE`, "Dylan Straffon" → `DS`, "Jack Cardello" → `JC`
- `aria-hidden="true"` on the initials span — the row's `<h3>` name and bio carry the semantic identity; the monogram is purely decorative when there's no real photo

**No border, no inner padding, no shadow.** The block sits flush inside the `aspect-[4/5]` wrapper. The `bg-surface-variant/50` of the outer wrapper is overridden by the inner `bg-surface-container` — that's intentional, the inner is slightly lighter to feel like an intentional placeholder.

**Helper function:** Implement `getInitials(name: string): string` as a top-of-file pure function in `page.tsx`. Two lines, no exports, no separate file.

Source: `03-CONTEXT.md` D-07 (monogram color + container) + Claude's Discretion (Mobile collapse direction informed source order)

---

## Copywriting Contract

### Hero

| Element | Copy |
|---------|------|
| Hero eyebrow | `Our People` |
| Hero headline | `The Ones *Standing With Us*` — "Standing With Us" as `<span class="italic font-light text-primary/80">` |
| Hero subtitle | `Eight on each side — the people we've leaned on, laughed with, and could not picture this weekend without.` |

### Section Headers

| Section | Eyebrow | Heading |
|---------|---------|---------|
| Bride's | `THE BRIDE'S SIDE` | `Bride's *Side*` (accent on "Side") |
| Groom's | `THE GROOM'S SIDE` | `Groom's *Side*` (accent on "Side") |

### Per-Member Role Labels (rendered as the warm-gold eyebrow above each member's name)

| Member | Role label |
|--------|-----------|
| Sarah Else | `MAID OF HONOR` |
| Emily Asinger | `BRIDESMAID` |
| Lindsay Carr | `BRIDESMAID` |
| Sarah Horan | `BRIDESMAID` |
| Sam Jones | `BRIDESMAID` |
| Shannon Robins | `BRIDESMAID` |
| Michelle Spencer | `BRIDESMAID` |
| Ryan Hindle | `BRIDESMAID` |
| Dylan Straffon | `BEST MAN` |
| Aaron Sorge | `GROOMSMAN` |
| Jack Cardello | `GROOMSMAN` |
| Ken Kinoshita | `GROOMSMAN` |
| Jon Metz | `GROOMSMAN` |
| Ian Adams | `GROOMSMAN` |
| Collin DeMatt | `GROOMSMAN` |
| Josh Tallman | `GROOMSMAN` |

### Placeholder Bios (Tyler swaps in real bios before ship)

Use **one shared placeholder line for all 16 members** to keep the diff and code review easy. Each bio object carries:
```
// TODO: replace with real bio
bio: "A dear friend to both of us — we're so glad they're standing with us."
```

The same line repeats verbatim across all 16 entries. This is deliberate:
- 16 different placeholder variations would mask "still placeholder" status during review
- A single line makes the TODOs visually unmistakable in code search
- Real bios at handoff will naturally vary; the placeholder uniformity is the signal

Tone reminder for the real bios (for Tyler at handoff):
- First-person from the couple ("we", "us") — D-09
- 1–2 sentences max — D-10
- Warm-gracious, not heroic. Specific to the relationship, not a resume.
- Example (from CONTEXT D-09): "Sarah is Emily's sister and has been her best friend since the day she was born — we couldn't imagine standing up there without her."

### Photo Alt Text

Each `<img>` carries `alt={\`Portrait of ${member.name}\`}` — e.g., `Portrait of Sarah Else`. Tyler can swap in scene descriptions later if desired; the default name-based alt is correct and accessible.

### States Not Applicable

- **Empty state:** N/A — the page always renders 16 hardcoded rows.
- **Error state:** N/A — no data fetching, no dynamic state.
- **Destructive confirmation:** N/A — no destructive actions, no outbound links, no forms.

### Tone Reminder

Warm and gracious. No exclamation marks anywhere on this page (carry-forward from Phase 2 Registry tone discipline). The hero is reverent, the bios are intimate — both registers reject the "celebratory invite" voice in favor of the editorial-portrait voice.

Source: `03-CONTEXT.md` D-03, D-04, D-09, D-10, D-11 + Claude's Discretion (Hero eyebrow/title/subtitle, Placeholder bios)

---

## Navbar Integration

**Change:** Add a new entry to the `links` array in `components/Navbar.tsx:7-16` at position 5 (between `Things To Do` and `FAQ`):

```ts
{ label: "Bridal Party", href: "/bridal-party" },
```

**Final desktop nav order after change (left-to-right after logo):**
`Home` · `Travel & Stay` · `Itinerary` · `Things To Do` · `Bridal Party` · `FAQ` · `Registry` · `RSVP`

**Mobile menu:** Inherits the same order automatically — `Navbar.tsx:83-104` reuses the same `links` array.

**Styling:** Same `font-label text-[10px] uppercase tracking-[0.2em]` as all other desktop nav links. No accent color in idle state. Active state (`pathname.startsWith("/bridal-party")`) uses `text-primary` via existing branching at `Navbar.tsx:43-48` (desktop) / `:84-89` (mobile) — no logic change needed.

**Placement rationale:** Bridal Party sits with the discovery items (Travel, Itinerary, Things To Do) rather than the action items (Registry, RSVP). FAQ stays adjacent because both serve "wanting to know more" — but Bridal Party precedes FAQ because the people frame the event.

Source: `03-CONTEXT.md` D-12

---

## Accessibility Contract

| Requirement | Implementation |
|-------------|----------------|
| Page landmark | `<main>` wraps all sections |
| Hero heading | `<h1>` for the hero title ("The Ones Standing With Us") |
| Section headings | `<h2>` for each of `Bride's Side` and `Groom's Side` |
| Member name headings | `<h3>` for each of the 16 member names |
| Hero parallax div | `aria-hidden="true"` (decorative, no content) |
| Hero scrim div | `aria-hidden="true"` (decorative gradient) |
| Monogram fallback initials span | `aria-hidden="true"` — the visible `<h3>` name carries the semantic identity; the monogram is purely decorative |
| Image alt text | Each `<img>` has `alt={\`Portrait of ${member.name}\`}` |
| Outbound links | None on this page — no `target="_blank"`, no tabnabbing surface, no `rel="noopener noreferrer"` requirement |
| Focus visible | No interactive elements other than the navbar (which inherits its existing focus behavior). The page itself has no `<button>`, no `<a>`, no form input — focus styling is N/A for the bridal-party content |
| Reduced motion | Global `@media (prefers-reduced-motion: reduce)` block in `app/globals.css:613-621` disables `hero-parallax-bg`, `hero-reveal-*`, `reveal-on-scroll`, and `reveal-on-scroll-stagger` automatically. No per-page handling needed. |
| Color contrast | All text/background pairings meet WCAG AA — see contrast verification in §Color above |
| Heading hierarchy semantic flow | `h1` (hero) → `h2` (Bride's Side) → `h3 × 8` (Bride's Side members) → `h2` (Groom's Side) → `h3 × 8` (Groom's Side members). One h1, two h2s, sixteen h3s, no skipped levels. |

**No `focus:ring-0` allowed anywhere on this page** (carry-forward from Phase 2 a11y posture). Browser default focus ring is preserved on the navbar links; there are no other interactive elements on this page to suppress.

Source: `03-CONTEXT.md` Claude's Discretion (Heading hierarchy, Accessibility) + `02-UI-SPEC.md` §Accessibility Contract + `app/globals.css:613-621`

---

## Component Inventory (Reuse Map)

| Component / Pattern | Source | Notes |
|---------------------|--------|-------|
| `Navbar` | `components/Navbar.tsx` | Add one entry to `links` array between Things To Do and FAQ |
| `Footer` | `components/Footer.tsx` | No change |
| `(main)` layout | `app/(main)/layout.tsx` | Auto-wraps the new page — no change |
| Hero pattern | `app/(main)/registry/page.tsx:45-81` | Direct port; swap copy and image URL; reuse 2-axis scrim verbatim |
| Section header pattern | `app/(main)/registry/page.tsx:101-109` | Direct port; swap eyebrow and heading per section |
| `aspect-[4/5]` photo container | `app/(main)/registry/page.tsx:121-132` | Reuse aspect ratio + `bg-surface-variant/50` placeholder + plain `<img>` with eslint-disable |
| `.hero-parallax-bg` | `app/globals.css:364-368` | Already exists, no change |
| `.hero-reveal-label/title/subtitle` | `app/globals.css:346-356` | Already exists, no change |
| `.reveal-on-scroll` | `app/globals.css:433-437` | Already exists, no change; applied to each row + each section header |
| `getInitials(name)` helper | New, inline in `page.tsx` | 2-line pure function, top of file, not exported |

**No new components.** No `shadcn add`. No `npm install`. Implementation is purely additive — one new file (`app/(main)/bridal-party/page.tsx`) + one one-line addition to the navbar.

**Patterns explicitly NOT reused (recap from CONTEXT §Patterns to NOT Reuse):**
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ...` card grid — replaced by the magazine row layout
- `editorial-underline` class — no outbound CTAs on this page
- `target="_blank" rel="noopener noreferrer"` — no outbound anchors at all
- `group-hover:*` image scale / overlay fade — rows are static editorial, not interactive
- `reveal-on-scroll-stagger` — row reveals are individual `reveal-on-scroll`, not staggered children
- Radial gradient overlay (`bg-[radial-gradient(...)]`) — omitted to keep the long page visually calm

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not applicable (no shadcn in project) |
| Third-party | none | not applicable |

No external component imports, no registry installs. Implementation uses native HTML + Tailwind utilities + existing Stitch CSS classes exclusively.

---

## Acceptance Criteria (Implementation Phase Must Hit)

### A. Functional

- [ ] **A1** — `app/(main)/bridal-party/page.tsx` exists and renders at `localhost:3000/bridal-party`
- [ ] **A2** — Page inherits the `(main)` layout (shared `Navbar`, `Footer`, `MusicButton`) automatically
- [ ] **A3** — Page renders **exactly 16 member rows** (8 in Bride's Side, 8 in Groom's Side)
- [ ] **A4** — Members render in the exact source order declared in CONTEXT D-03 (honor attendant first, then attendants in the user-given order — no alphabetization)
- [ ] **A5** — Each member object carries `name`, `role`, `bio`, `photo` fields; `photo` may be a string path or `null`
- [ ] **A6** — Each of the 16 bios is preceded by `// TODO: replace with real bio` and contains the verbatim placeholder line `"A dear friend to both of us — we're so glad they're standing with us."`
- [ ] **A7** — `components/Navbar.tsx` `links` array has a new entry `{ label: "Bridal Party", href: "/bridal-party" }` at index 4 (between Things To Do and FAQ)
- [ ] **A8** — Navbar active state highlights "Bridal Party" when the user is on `/bridal-party` (no logic change required — verify visually)

### B. Visual — Hero

- [ ] **B1** — Hero is `h-[614px]` with `bg-cover bg-center hero-parallax-bg` background and the 2-axis scrim recipe exactly as specified
- [ ] **B2** — Hero eyebrow text reads `Our People`, class `font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 hero-reveal-label`
- [ ] **B3** — Hero `<h1>` reads `The Ones Standing With Us` with "Standing With Us" wrapped in `<span class="italic font-light text-primary/80">`
- [ ] **B4** — Hero `<h1>` class is `font-headline text-5xl md:text-8xl text-on-surface leading-[0.85] tracking-tighter mb-6 hero-reveal-title`
- [ ] **B5** — Hero subtitle reads verbatim: `Eight on each side — the people we've leaned on, laughed with, and could not picture this weekend without.`
- [ ] **B6** — Hero subtitle class is `text-on-surface-variant text-lg max-w-2xl font-light leading-relaxed hero-reveal-subtitle`

### C. Visual — Sections + Headers

- [ ] **C1** — Bride's Side section renders **above** Groom's Side section (Bride's Side first)
- [ ] **C2** — Each section uses `py-24 md:py-32 bg-background`
- [ ] **C3** — Each section's container is `max-w-[1440px] mx-auto px-6 md:px-12`
- [ ] **C4** — Bride's Side header reads eyebrow `THE BRIDE'S SIDE` then `<h2>` `Bride's Side` with "Side" italicized in warm gold via `<span class="italic font-light text-primary/80">`
- [ ] **C5** — Groom's Side header reads eyebrow `THE GROOM'S SIDE` then `<h2>` `Groom's Side` with "Side" italicized in warm gold
- [ ] **C6** — Each `<h2>` class is `font-headline text-4xl md:text-6xl text-on-surface`
- [ ] **C7** — Each section header wrapper has `mb-16 md:mb-24 reveal-on-scroll`

### D. Visual — Magazine Rows

- [ ] **D1** — Each row uses `grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-12 lg:gap-x-16 items-center reveal-on-scroll`
- [ ] **D2** — Desktop alternation: row index 0/2/4/6 = text-left/photo-right (text in `md:col-span-7`, photo in `md:col-span-5`); row index 1/3/5/7 = text-right/photo-left (text in `md:col-span-7 md:col-start-6`, photo in `md:col-span-5 md:col-start-1 md:row-start-1`)
- [ ] **D3** — Both sections start with row index 0 = text-left/photo-right (Sarah Else and Dylan Straffon both render text-left)
- [ ] **D4** — Mobile (`<md`): every row collapses to single-column with text DOM-order-first (text above photo on every row)
- [ ] **D5** — Row vertical gap is `gap-y-16` mobile, `md:gap-y-24` desktop, `lg:gap-y-32` large
- [ ] **D6** — Each row's photo container uses `aspect-[4/5] bg-surface-variant/50 overflow-hidden relative`
- [ ] **D7** — Each row's role eyebrow is `font-label text-xs uppercase tracking-[0.4em] text-primary mb-4 block`
- [ ] **D8** — Each row's `<h3>` name is `font-headline text-2xl md:text-4xl text-on-surface mb-4`
- [ ] **D9** — Each row's bio `<p>` is `text-on-surface-variant text-lg font-light leading-relaxed`
- [ ] **D10** — No `group-hover:*`, no `scale-*`, no overlay div, no transition classes on rows or row children (rows are fully static)
- [ ] **D11** — Each row carries `reveal-on-scroll` (not `reveal-on-scroll-stagger`) on its grid wrapper

### E. Visual — Monogram Fallback

- [ ] **E1** — When `member.photo` is `null` (or in any test of the fallback path), the photo container renders `<div class="absolute inset-0 flex items-center justify-center bg-surface-container">` with a centered initials span
- [ ] **E2** — Initials span class is `font-headline italic text-5xl md:text-7xl text-primary` with `aria-hidden="true"`
- [ ] **E3** — Initials text is exactly two uppercase letters derived from the first letter of the first word and the first letter of the last word of `member.name`
- [ ] **E4** — `getInitials(name)` is an inline pure function at the top of `page.tsx`, not a separate component file

### F. Visual — Images

- [ ] **F1** — Each `<img>` uses plain `<img>` (no `next/image`), preceded by `{/* eslint-disable-next-line @next/next/no-img-element */}`
- [ ] **F2** — Each `<img>` class is `w-full h-full object-cover`
- [ ] **F3** — Each `<img>` `src` is `/bridal-party/<slug>.jpg` where `<slug>` is `lowercase-kebab(name)`
- [ ] **F4** — Each `<img>` `alt` is `Portrait of ${member.name}`

### G. Copy

- [ ] **G1** — No exclamation marks anywhere in the rendered copy (hero, sections, roles, bios)
- [ ] **G2** — All hero copy strings match the Copywriting Contract verbatim
- [ ] **G3** — All 16 placeholder bios use the identical line `"A dear friend to both of us — we're so glad they're standing with us."` (uniformity is the signal)
- [ ] **G4** — Only Sarah Else and Dylan Straffon have honor-attendant role labels (`MAID OF HONOR` / `BEST MAN`); the other 7 Bride's Side members all read `BRIDESMAID` and the other 7 Groom's Side members all read `GROOMSMAN`

### H. Interaction / Motion

- [ ] **H1** — Hero entrance: eyebrow at 200ms delay, title at 400ms delay, subtitle at 600ms delay (via the three `hero-reveal-*` classes)
- [ ] **H2** — Hero background scales from 1.08 → 1.0 on scroll via `hero-parallax-bg`
- [ ] **H3** — Each section header fades up via `reveal-on-scroll` when entering viewport
- [ ] **H4** — Each row fades up via `reveal-on-scroll` when entering viewport (individual reveal, not staggered children)
- [ ] **H5** — All animations honor `@media (prefers-reduced-motion: reduce)` via the global block in `globals.css:613-621` (no per-page override)

### I. Accessibility

- [ ] **I1** — Exactly one `<h1>` on the page (the hero title)
- [ ] **I2** — Exactly two `<h2>` elements (`Bride's Side` and `Groom's Side`)
- [ ] **I3** — Exactly sixteen `<h3>` elements (one per member, in source order)
- [ ] **I4** — Every decorative div (hero parallax, hero scrim, monogram inner block) carries `aria-hidden="true"`; the monogram initials span carries `aria-hidden="true"`
- [ ] **I5** — Every `<img>` has descriptive `alt` text in the form `Portrait of ${member.name}`
- [ ] **I6** — No `focus:ring-0` anywhere in the new `page.tsx`
- [ ] **I7** — No outbound `<a>` tags on this page (no tabnabbing surface to verify)

### J. Build + Lint

- [ ] **J1** — `npm run build` exits 0; `/bridal-party` appears as a static route in the build output
- [ ] **J2** — `npm run lint` baseline preserved — no new errors or warnings in `app/(main)/bridal-party/page.tsx` or `components/Navbar.tsx` beyond the sanctioned `eslint-disable-next-line @next/next/no-img-element` inline directives
- [ ] **J3** — TypeScript compiles for the new page (typed member object shape; `photo: string | null`)

---

## Out of Scope

Carried forward from CONTEXT.md §Deferred Ideas — explicitly excluded from this phase:

- Individual member detail pages (e.g., `/bridal-party/sarah-else`)
- Contact info per member (email, social handles)
- Group photo at top of each section
- Parents / Officiant / Ring Bearer / Flower Girl ("Honored Guests" section)
- Hover-reveal bio overlay (bios are always visible per the magazine layout)

Also out of scope for this phase:

- Real bios — Tyler fills these at handoff; placeholders are intentional and uniform
- Real member portraits — Tyler drops these into `/public/bridal-party/<slug>.jpg` at handoff; monogram fallback handles missing files gracefully
- Radial gradient section overlay (used on Things-To-Do and Registry but omitted here)
- Any interactivity on rows (no hover, no click, no modal)

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
