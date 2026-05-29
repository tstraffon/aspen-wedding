# Phase 02: Registry Page — Research

**Researched:** 2026-05-29
**Domain:** Next.js 16 App Router static content page + Stitch editorial UI port
**Confidence:** HIGH

## Summary

Phase 2 builds one new file (`app/(main)/registry/page.tsx`) and edits one line in `components/Navbar.tsx`. There is no new dependency, no backend, no data fetching, and no dynamic state. The page is a direct structural port of `app/(main)/things-to-do/page.tsx` — same hero shell, same 3-col card grid, same motion utilities — with three card entries (Honeyfund, Amazon, Crate & Barrel) and a small framing block inserted between the hero and the grid.

The UI-SPEC (`02-UI-SPEC.md`) already locks every visual decision: hero copy, framing block copy, card copy, accent reservation list, hover treatments, accessibility contract. The planner's job is to translate that spec into Wave-ordered tasks. Research surfaces three things the planner needs that the spec doesn't spell out: (1) the exact Next.js 16 page-export shape (no `params`/`searchParams` for static routes), (2) the project convention of using plain `<img>` (not `next/image`) consistent with Things-To-Do — and why that's the correct call here, and (3) the exact navbar `isActive` logic so the one-line edit is right the first time.

**Primary recommendation:** Mirror `app/(main)/things-to-do/page.tsx` structurally — one inline `const registries` array, one `<main>` with hero + framing + grid sections, plain `<img>` tags with the `@next/next/no-img-element` eslint disable comment. Add `export const metadata` (Travel page is the precedent — Things-To-Do omits it; this phase should add it for SEO consistency). Uncomment Navbar line 13, change `href` from `/#registry` to `/registry`. No other changes.

## User Constraints (from CONTEXT.md)

### Locked Decisions

**Registry list & data:**
- **D-01:** Three registries in scope: **Honeyfund** (honeymoon fund), **Amazon**, **Crate & Barrel**. No Zola.
- **D-02:** Registry data lives as an **inline `const registries` array in `app/(main)/registry/page.tsx`** — same pattern as `app/(main)/things-to-do/page.tsx`. No separate config file, no JSON.
- **D-03:** Each registry object carries: `title`, `description` (short blurb), `image` (URL), `alt`, `link` (outbound registry URL).

**Layout & hero:**
- **D-04:** 3-column responsive card grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) like Things-To-Do. Each card: curated image above, title, blurb, "Visit Registry" CTA using the `editorial-underline` link style.
- **D-05:** Full-bleed cinematic hero matching Things-To-Do / Travel — background image with scrim, `hero-reveal-label` / `hero-reveal-title` / `hero-reveal-subtitle` motion classes, `font-label` uppercase eyebrow, `font-headline` title with an italicized primary-toned word.
- **D-06:** Card image aspect ratio: `aspect-[4/5]` matching Things-To-Do. Group hover scales image to `1.10` over 1000ms with a fading dark overlay.

**Brand presentation:**
- **D-07:** Curated editorial image per card — NOT brand logos. Avoids brand-color clashes with the dark teal + warm gold palette.
- **D-08:** Registry name renders as the card headline in `font-headline` (Noto Serif). No brand logos, no wordmarks beyond the title text.

**Personal note from couple:**
- **D-09:** Include a personal framing block between the hero and the registry grid — short editorial copy (1–2 sentences) in the warm-and-gracious tone.
- **D-10:** Tone is warm and gracious — soft, grateful, low-pressure. Not playful, not honeymoon-forward.
- **D-11:** Hero subhead can carry a complementary line.

**Asset sourcing:**
- **D-12:** Planner uses placeholder URLs (`#`) for `link` and Unsplash-style stock imagery for card images during execution. Tyler swaps in real URLs and (optionally) real images before ship. Must be flagged in the code as a `// TODO` comment so it isn't forgotten at handoff.

**Nav integration:**
- **D-13:** Uncomment the Registry link at `components/Navbar.tsx:13` (`{ label: "Registry", href: "/#registry" }`) and update `href` to `/registry`. This is the only change to the navbar — no new entries.

### Claude's Discretion
- Exact hero image selection (suggest evocative: curated home tabletop / alpine view / wrapped gifts)
- Exact section padding numbers (follow Things-To-Do cadence — `py-16`)
- Exact framing copy wording (within "warm and gracious" tone)
- Whether to add subtle radial gradient under the cards section like Things-To-Do Restaurants (`bg-[radial-gradient(...)]`) — UI judgment call. **UI-SPEC resolved this as YES — apply with `pointer-events-none`.**

### Deferred Ideas (OUT OF SCOPE)
None. Discussion stayed within phase scope. Future ideas (gift tracking, RSVP-linked thank-you flow, dedicated honeymoon picker) remain out of scope per PROJECT.md.

## Project Constraints (from CLAUDE.md / AGENTS.md)

**Critical project rule:** AGENTS.md says "This is NOT the Next.js you know — read `node_modules/next/dist/docs/` before writing code." Heed deprecation notices. The shipped version is **Next.js 16.2.6 + React 19.2.4** (verified via `package.json`).

Three Next.js 16 specifics that affect this phase:

1. **`params` and `searchParams` are now Promises** in v15+. They must be `await`ed. This route has neither, so the page component takes no props — but the planner should not write `function Page({ params })` synchronously by reflex.
2. **`PageProps` helper is globally available** post-typegen (v16). Not needed for a static route, but mentioned in the official docs as the typed alternative to inline prop types.
3. **`next.config.ts`** (not `.js`) is the project's config file shape. Currently empty (`const nextConfig: NextConfig = { /* config */ };`). No `images.remotePatterns` is configured. This means `next/image` with remote URLs would fail at build time — see Image Strategy below.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Route declaration (`/registry`) | Frontend Server (RSC) | — | Default Server Component; no client state needed |
| Static content (`const registries`) | Frontend Server (RSC) | — | Inline data array, no fetch, no DB |
| Page rendering (HTML output) | Frontend Server (RSC) | — | SSG-eligible; no `'use client'` directive |
| Hover / scale interactions | Browser / Client | — | Pure CSS via Tailwind `group-hover:` — no JS handler |
| Scroll-driven reveals | Browser / Client | — | CSS `animation-timeline: view()` in `globals.css` — no JS |
| Outbound navigation | Browser / Client | — | Native `<a target="_blank">` — no `<Link>` for external |
| Nav active-state highlight | Browser / Client | — | `usePathname()` in client `Navbar.tsx` (existing) |
| SEO metadata | Frontend Server | — | `export const metadata` at top of `page.tsx` |

**Why this matters:** Nothing on this page requires `'use client'`. The page must remain a Server Component to stay SSG-eligible and to keep the bundle small. The motion is all CSS scroll-timeline; the hover is all Tailwind group-hover. The only client-side code on the page tree is `Navbar.tsx` itself, which already uses `'use client'`.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.6 | App Router page + SSG | Project standard; verified via `package.json` |
| React | 19.2.4 | Component runtime | Project standard; verified via `package.json` |
| TypeScript | ^5 | Type-safe page module | Project standard |
| Tailwind CSS | ^4 (via `@tailwindcss/postcss`) | All styling | Project standard; Stitch tokens live in `@theme` block |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next/link` | bundled | Internal links (not used on this page) | Only if linking to another `/` route |
| Material Symbols Outlined | font, loaded in `app/layout.tsx` | Icons | Not needed on registry page — UI-SPEC has no icons in the registry cards |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain `<img>` | `next/image` | Would require adding `images.remotePatterns` to `next.config.ts` for Unsplash domains. Existing pages all use plain `<img>` with eslint disable comment — **introducing `next/image` here breaks consistency with the rest of `(main)/`**. Defer to Phase 3 if image optimization becomes a project-wide concern. [VERIFIED: codebase grep — `things-to-do/page.tsx:124`, `travel/page.tsx:130`, `itinerary/page.tsx`] |
| Inline `const registries` | `data/registries.ts` module | Project has no `data/` directory; Things-To-Do and FAQ both inline. CONTEXT D-02 locks this. |
| Static `metadata` export | `generateMetadata` | No dynamic data; static `metadata` object is correct per Next.js 16 docs. [CITED: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`] |

**Installation:** None. Zero new dependencies. The entire phase is one new file + one line edit.

## Package Legitimacy Audit

Not applicable — this phase installs no external packages. Skipped per protocol.

## Architecture Patterns

### System Architecture Diagram

```
URL request: GET /registry
   │
   ▼
Next.js 16 App Router
   │ (route group passthrough: app/(main)/)
   ▼
app/(main)/layout.tsx  ──►  <Navbar /> (client) + <Footer /> + <MusicButton />
   │
   ▼
app/(main)/registry/page.tsx  (Server Component, SSG)
   │
   ├──► <section> Hero
   │       ├── hero-parallax-bg div (CSS scroll-timeline animation)
   │       ├── gradient scrim div
   │       └── eyebrow / h1 / subtitle (hero-reveal-* animations)
   │
   ├──► <section> Framing block
   │       └── max-w-2xl centered prose (reveal-on-scroll)
   │
   └──► <section> Registry grid
           ├── radial gradient overlay (decorative)
           ├── section header (eyebrow + h2)
           └── grid (reveal-on-scroll-stagger)
                 ├── <a> Honeyfund card  ──► target=_blank ──► honeyfund.com
                 ├── <a> Amazon card     ──► target=_blank ──► amazon.com/registry
                 └── <a> Crate&Barrel    ──► target=_blank ──► crateandbarrel.com
```

Data flow: route -> layout (nav/footer chrome) -> page component renders static HTML -> browser applies CSS scroll-driven animations -> user hovers/clicks -> native browser navigation opens the outbound link in a new tab.

### Recommended Project Structure
```
app/
└── (main)/
    └── registry/
        └── page.tsx       # NEW — entire phase output

components/
└── Navbar.tsx             # EDIT — one line (uncomment + href change)
```

No new components, no new directories, no shared helpers, no `lib/` additions.

### Pattern 1: Static App Router Page (Next.js 16)

**What:** Server Component default export at `app/(main)/<route>/page.tsx` with optional `metadata` export.

**When to use:** Every static content route in this project. No `'use client'` unless the page has interactive state.

**Example:**
```tsx
// Source: app/(main)/travel/page.tsx (canonical project example)
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registry — Emily & Tyler",
  description:
    "A few places we've registered for our Aspen wedding.",
};

export default function RegistryPage() {
  return <main>{/* ... */}</main>;
}
```

**Note on `params` / `searchParams`:** This route is not dynamic, so the page takes no props. If the planner ever needs them, they are `Promise<...>` types in v15+ and must be `await`ed. [CITED: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` lines 38–66]

### Pattern 2: Full-Bleed Cinematic Hero

**What:** A `relative h-[614px] w-full overflow-hidden bg-background` section with a parallax background div, a gradient scrim, and entrance-animated text positioned at the bottom of the viewport.

**When to use:** Every editorial page in this project (Travel, Things-To-Do, both already use this exact shape). Registry follows.

**Example:**
```tsx
// Source: app/(main)/things-to-do/page.tsx lines 64–92
<section className="relative h-[614px] w-full overflow-hidden bg-background">
  <div className="absolute inset-0 z-0">
    <div
      className="w-full h-full bg-cover bg-center hero-parallax-bg"
      style={{ backgroundImage: "url('/registry-hero.jpg')" }}
      aria-hidden="true"
    />
    <div
      className="absolute inset-0"
      aria-hidden="true"
      style={{
        background:
          "linear-gradient(to bottom, rgba(13,27,30,0.05), rgba(13,27,30,0.3))",
      }}
    />
  </div>
  <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-20">
    <div className="max-w-4xl">
      <p className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 hero-reveal-label">
        For Our Guests
      </p>
      <h1 className="font-headline text-5xl md:text-8xl text-on-surface leading-[0.85] tracking-tighter mb-6 hero-reveal-title">
        Our{" "}
        <span className="italic font-light text-primary/80">Registries</span>
      </h1>
      <p className="text-on-surface-variant text-lg max-w-2xl font-light leading-relaxed hero-reveal-subtitle">
        A few places we&apos;ve put together — but truly, just being there is enough.
      </p>
    </div>
  </div>
</section>
```

**Padding note:** The hero deliberately does NOT add `pt-20` on `<main>`. The Navbar is `fixed` with `glass-nav` (semi-transparent backdrop-blur), and the design intends for the hero image to float underneath the nav. This matches Travel and Things-To-Do. FAQ adds `pt-20` because it has no full-bleed hero. [VERIFIED: codebase grep of all `(main)` pages]

### Pattern 3: 3-Column Editorial Card Grid

**What:** A responsive grid that renders an array of card items as anchor tags with image, title, blurb, and editorial-underline CTA.

**Example:**
```tsx
// Source: app/(main)/things-to-do/page.tsx lines 118–141 (adapted for registry)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 md:gap-y-24 reveal-on-scroll-stagger">
  {registries.map((r) => (
    <a
      key={r.title}
      href={r.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${r.title} registry (opens in new tab)`}
      className="group cursor-pointer block"
    >
      <div className="aspect-[4/5] bg-surface-variant/50 mb-8 overflow-hidden relative">
        <div
          className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500 z-10"
          aria-hidden="true"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={r.alt}
          className="w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-110"
          src={r.image}
        />
      </div>
      <h3 className="font-headline text-2xl md:text-4xl text-on-surface mb-3 group-hover:text-primary transition-colors">
        {r.title}
      </h3>
      <p className="text-on-surface-variant text-lg leading-relaxed mb-6 font-light">
        {r.description}
      </p>
      <span className="font-headline italic text-primary text-sm editorial-underline inline-flex items-center gap-2 group-hover:gap-3 transition-all">
        Visit Registry
      </span>
    </a>
  ))}
</div>
```

**Two deltas from the Things-To-Do source:**
1. Card title uses `text-2xl md:text-4xl` (UI-SPEC promotes card titles to responsive Heading tier). Things-To-Do uses static `text-2xl`.
2. Card blurb uses `text-lg` (UI-SPEC merges body small up to `text-lg`). Things-To-Do uses `text-base`.

These changes are deliberate per UI-SPEC §Typography and apply only to the Registry page. Do not refactor Things-To-Do to match.

### Pattern 4: Framing Block (between hero and grid)

```tsx
<section className="py-16 bg-background">
  <div className="max-w-[1440px] mx-auto px-6 md:px-12">
    <div className="max-w-2xl mx-auto text-center reveal-on-scroll">
      <p className="text-on-surface-variant text-lg font-light leading-relaxed">
        Your presence is the greatest gift. If you&apos;d like to celebrate
        with something more, here are a few places we&apos;ve registered.
      </p>
    </div>
  </div>
</section>
```

No eyebrow per UI-SPEC §Framing Block ("would over-formalize the warm-and-gracious tone").

### Anti-Patterns to Avoid

- **`'use client'` at the top of the page.** Breaks SSG, breaks `export const metadata`, no functional benefit. The reveal-on-scroll and parallax animations are CSS scroll-timeline based — they run without JS.
- **`next/image` with Unsplash URLs.** Would require editing `next.config.ts` to add `images.remotePatterns`. No other `(main)` page does this — inconsistent. Use plain `<img>` + the eslint disable comment.
- **Brand logos as card images.** Explicitly rejected in D-07. The warm-gold + dark-teal palette clashes with brand colors (Amazon orange, Crate & Barrel blue, Honeyfund teal). Curated editorial photography only.
- **Marketing taglines as card titles.** UI-SPEC and CONTEXT Specifics both lock card titles as bare brand names (`Honeyfund`, `Amazon`, `Crate & Barrel`).
- **Exclamation marks in registry copy.** UI-SPEC Tone Reminder explicitly forbids these for the warm-and-gracious tone.
- **Adding `pt-20` to `<main>`.** Hero is intentionally underneath the fixed glass nav. FAQ does this only because it has no full-bleed hero.
- **Replacing the placeholder `href="#"` with a guessed real URL.** D-12 explicitly defers real URLs to Tyler at handoff. The `// TODO` comment must remain visible.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-triggered reveals | Custom IntersectionObserver hook | `reveal-on-scroll` / `reveal-on-scroll-stagger` classes in `globals.css` lines 433–446 | Already there; uses native CSS `animation-timeline: view()`; reduced-motion safe |
| Hero entrance fade-up | `framer-motion` or custom CSS | `hero-reveal-label` / `hero-reveal-title` / `hero-reveal-subtitle` classes (globals.css 346–356) | Already there; matches Travel and Things-To-Do exactly |
| Parallax background | `react-parallax` or scroll-listener | `hero-parallax-bg` class (globals.css 364–368) | Already there; uses CSS `animation-timeline: view()` — no JS, no jank |
| Animated underline on CTA | Custom span with border-bottom transition | `editorial-underline` class (globals.css 155–168) | Already there; matches Travel/Things-To-Do hover rhythm |
| Active nav highlight | `useEffect` / state | Existing `pathname.startsWith(href)` logic in `Navbar.tsx` lines 42–48, 83–89 | Already handles arbitrary routes; `/registry` will work with zero nav code changes beyond the one-line href edit |
| Reduced-motion handling | Per-component CSS | Global `@media (prefers-reduced-motion: reduce)` block in `globals.css` lines 613–621 | Already disables hero/parallax/reveal animations site-wide |
| Skip-link / a11y landmark | Add per page | Existing skip link in `app/(main)/layout.tsx` lines 12–17, `<main>` element on page | Already in place |

**Key insight:** This phase has zero greenfield surface. Every motion, every utility, every accessibility affordance already exists in the project. The risk is **drift from the established pattern**, not missing capability. The planner should write tasks that say "port lines X–Y from things-to-do/page.tsx" rather than "implement a card grid."

## Runtime State Inventory

Not applicable. This phase is purely additive — one new file, one line edit. No rename, no migration, no string replacement, no data refactor.

## Common Pitfalls

### Pitfall 1: Adding `'use client'` because the page "feels interactive"
**What goes wrong:** Page becomes a Client Component, loses SSG, breaks `export const metadata`.
**Why it happens:** The hover scale, the reveals, and the parallax all feel like "interactivity" — but they're 100% CSS.
**How to avoid:** Default to Server Component. The only client code on the page tree is the existing `Navbar.tsx` (which already has `'use client'`).
**Warning signs:** Reflexively typing `'use client'` at the top of the file; importing `useState` / `useEffect`.

### Pitfall 2: Using `next/image` for Unsplash card images
**What goes wrong:** Build fails with `Invalid src prop ... hostname "images.unsplash.com" is not configured under images in your next.config.ts`.
**Why it happens:** Next.js 16 requires every remote image host to be allowlisted in `images.remotePatterns`. The project's `next.config.ts` has none configured. [CITED: `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md` §Remote images]
**How to avoid:** Use plain `<img>` with `// eslint-disable-next-line @next/next/no-img-element` directly above the tag, matching every other page in `(main)/`. Do NOT modify `next.config.ts` as part of this phase.
**Warning signs:** Build error referencing `images.remotePatterns`; ESLint warning about `@next/next/no-img-element` without the disable comment.

### Pitfall 3: Forgetting the placeholder `href` `// TODO` comment
**What goes wrong:** Placeholder `href="#"` ships to production because the handoff prompt never surfaces the missing URLs.
**Why it happens:** D-12 places the URL-swap responsibility on Tyler, but a silent `#` is invisible at code-review time.
**How to avoid:** Each card object's `link: "#"` must be immediately preceded by a `// TODO: replace with real registry URL` comment in the inline array. UI-SPEC §Copywriting Contract requires this.
**Warning signs:** Visit-Registry CTA scrolls to top of page instead of opening a new tab (the `#` href behavior).

### Pitfall 4: Card hover ignores the dark overlay timing
**What goes wrong:** Image scale animation runs at 1000ms but the dark overlay either fades faster than the scale (jumpy feel) or doesn't fade (image stays muted).
**Why it happens:** The two transitions live on different children — `transition-transform duration-1000` on `<img>`, `transition-colors duration-500` on the overlay div.
**How to avoid:** Copy both classes verbatim from `things-to-do/page.tsx` lines 121–128. The 500ms overlay vs. 1000ms scale is the intentional choreography — overlay clears first to reveal the image as it grows.
**Warning signs:** Hover feels "muddy" or "jumpy" in QA.

### Pitfall 5: Navbar active-state logic — `pathname === href` vs. `startsWith`
**What goes wrong:** Registry link shows active styling on `/registry/foo` but not on `/registry`, or vice versa.
**Why it happens:** The Navbar uses TWO checks in sequence: `pathname.startsWith(href)` to compute `isActive`, then `isActive && href === pathname` to apply `text-primary`. The second check is exact-match. [VERIFIED: codebase, `components/Navbar.tsx:42–57`]
**How to avoid:** The existing logic already handles `/registry` cleanly because it's a top-level route and `href === pathname` matches exactly when the user is on `/registry`. No code change needed beyond the one-line href edit. Do NOT add `if (href === "/registry")` branching.
**Warning signs:** Planner is tempted to refactor the `isActive` logic. Don't.

### Pitfall 6: Drift in section padding (`py-16` vs. `py-32`)
**What goes wrong:** Registry sections use different vertical rhythm than Things-To-Do, the visual cadence breaks across pages.
**Why it happens:** Things-To-Do has TWO section paddings: `py-16` for the activity grid, `py-32` for the restaurants section. The latter is used as visual breathing for the alternate `bg-surface` section. Registry has NO alternate-background section, so both content sections (framing block + grid) use `py-16`.
**How to avoid:** UI-SPEC §Spacing Scale locks `py-16` for both content sections of registry. Do not introduce `py-32`.
**Warning signs:** Visual checker flags padding inconsistency in QA.

## Code Examples

### Complete registry data shape (inline array)

```tsx
// Source: pattern from app/(main)/things-to-do/page.tsx lines 3–58, adapted per CONTEXT D-01, D-02, D-03

const registries = [
  {
    title: "Honeyfund",
    description:
      "Our honeymoon adventure fund. Help us celebrate by contributing to the trip of a lifetime.",
    image: "https://images.unsplash.com/photo-XXXX?w=800&q=80", // placeholder — Tyler to swap
    alt: "Mountain landscape with a passport and journal evoking honeymoon travel",
    // TODO: replace with real registry URL
    link: "#",
  },
  {
    title: "Amazon",
    description:
      "From everyday essentials to home upgrades — our Amazon wishlist has a little of everything.",
    image: "https://images.unsplash.com/photo-XXXX?w=800&q=80", // placeholder
    alt: "Wrapped gift box with neutral linen ribbon on a wooden surface",
    // TODO: replace with real registry URL
    link: "#",
  },
  {
    title: "Crate & Barrel",
    description:
      "Tableware, linens, and kitchen goods we've been eyeing for our first home together.",
    image: "https://images.unsplash.com/photo-XXXX?w=800&q=80", // placeholder
    alt: "Curated tabletop with linen napkins, glassware, and warm afternoon light",
    // TODO: replace with real registry URL
    link: "#",
  },
];
```

### Navbar edit (single line)

```tsx
// Source: components/Navbar.tsx — BEFORE (line 13)
// { label: "Registry", href: "/#registry" },

// Source: components/Navbar.tsx — AFTER
{ label: "Registry", href: "/registry" },
```

That is the entire navbar change. Insertion point preserved at index 5 of the `links` array — the order in CONTEXT.md §Navbar Integration ("Home · Travel & Stay · Itinerary · Things To Do · FAQ · Registry · RSVP") is exactly what the array yields once line 13 is uncommented.

### Full section wrapper for the cards grid (with radial gradient overlay)

```tsx
// Source: pattern from app/(main)/things-to-do/page.tsx lines 146–148 (radial gradient pattern)
//         adapted for the registry grid per UI-SPEC §Color "Radial gradient (include)"

<section className="py-16 bg-background relative overflow-hidden">
  <div
    className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,163,115,0.04)_0%,transparent_60%)] pointer-events-none"
    aria-hidden="true"
  />
  <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
    <div className="mb-12 md:mb-24 reveal-on-scroll">
      <span className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 block">
        Gift Registries
      </span>
      <h2 className="font-headline text-4xl md:text-6xl text-on-surface">
        A Few of Our{" "}
        <span className="italic font-light text-primary/80">Favorites</span>
      </h2>
    </div>
    {/* grid (see Pattern 3) */}
  </div>
</section>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Synchronous `params: { slug: string }` page prop | `params: Promise<{ slug: string }>` requiring `await` | Next.js 15.0.0-RC | N/A for this static route, but planner should not regress to old shape if a dynamic route is added later [CITED: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` line 65] |
| `images.domains` array in `next.config` | `images.remotePatterns` array | Next.js 13+, `domains` fully deprecated | Not exercised in this phase (plain `<img>` is used), but flagged because a future image-optimization phase will need this |
| `useRouter` from `next/router` | `usePathname` / `useRouter` from `next/navigation` | App Router (v13) | Already correct in Navbar.tsx — flagged for awareness |
| Custom IntersectionObserver for scroll reveals | CSS `animation-timeline: view()` | Project-internal pattern, shipped in `globals.css` | This codebase has fully adopted the CSS approach; no JS scroll observers anywhere |

**Deprecated/outdated knowledge to discard:**
- The notion that App Router pages need `'use client'` to do scroll animations — they don't. Use the existing CSS scroll-timeline utilities.
- The notion that every remote image needs `next/image` — this codebase ships plain `<img>` and that is the correct pattern for the registry phase.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Tyler will personally swap real registry URLs and (optionally) real images before ship | D-12 (CONTEXT, not research) | Low — explicit in CONTEXT and UI-SPEC; `// TODO` comment surfaces the gap |
| A2 | Unsplash will remain a viable source for placeholder card imagery during development | Card image src | Low — even if Unsplash domain blocks hotlinking, planner can swap to any other stock host; plain `<img>` doesn't care about the host |

No technical assumptions in the implementation patterns themselves — every code excerpt is copied from a working, shipped file in this codebase.

## Open Questions

1. **Should `app/(main)/registry/page.tsx` export `metadata`?**
   - What's known: Travel page exports `metadata` (`title`, `description`). Things-To-Do, FAQ, Itinerary do NOT. The project is inconsistent.
   - What's unclear: Whether Tyler wants Registry indexed with custom SEO, or whether the root `app/layout.tsx` title is sufficient.
   - Recommendation: **Include `export const metadata`** with title "Registry — Emily & Tyler" and a one-line description. The cost is two lines of code; the benefit is correct Open Graph and tab title when guests share the link. Follow the Travel page precedent. UI-SPEC does not mandate this but does not forbid it.

2. **Hero image asset — `/public` file vs. Unsplash URL?**
   - What's known: Travel uses `/travel-hero-crop.jpg` (local public file). Things-To-Do uses `/foliage-from-above.jpeg` (local public file). The card images on Things-To-Do are remote URLs, but the heroes are local.
   - What's unclear: Whether Tyler will provide a local hero image before ship, or whether a placeholder remote URL is acceptable.
   - Recommendation: Use a placeholder remote URL during execution (Unsplash curated home tabletop) with a `// TODO: replace with /public local file` comment near the inline `backgroundImage` style. Matches the D-12 placeholder posture.

## Environment Availability

Not applicable. This phase has no external tool dependencies beyond what's already installed (Next.js, React, TypeScript, Tailwind). All confirmed present in `node_modules/`. No CLI utilities, no databases, no services.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None currently installed |
| Config file | none — no `jest.config.*`, no `vitest.config.*`, no `playwright.config.*` in repo |
| Quick run command | n/a — see Wave 0 |
| Full suite command | n/a — see Wave 0 |

Verified: project has only `npm scripts` for `dev`, `build`, `start`, `lint` ([VERIFIED: codebase grep — `package.json`]). Phase 1 closed with a manual smoke checklist, not automated tests. This phase will follow the same posture.

### Phase Requirements → Test Map

Phase 2 has no separate `REQUIREMENTS.md`. The acceptance criteria in `02-UI-SPEC.md` lines 270–313 are the implicit requirement set. Map them to validation:

| Req (from UI-SPEC Acceptance Criteria) | Behavior | Test Type | Automated Command | File Exists? |
|----------------------------------------|----------|-----------|-------------------|-------------|
| `/registry` route renders | Visit `localhost:3000/registry` and confirm 200 | manual smoke | n/a | n/a |
| `(main)` layout inherits (nav + footer) | Visual: nav present, footer present | manual smoke | n/a | n/a |
| Three card `<a>` tags with placeholder hrefs | Visual + view-source check | manual smoke | n/a | n/a |
| `target="_blank" rel="noopener noreferrer"` on cards | View source / DOM inspect | manual smoke | n/a | n/a |
| Navbar Registry link uncommented + href `/registry` | Visual: link appears in nav, clicks to `/registry` | manual smoke | n/a | n/a |
| Active state highlights "Registry" on `/registry` | Click Registry → text turns warm-gold | manual smoke | n/a | n/a |
| Hero `h-[614px]` + parallax-bg + scrim + reveal animations | Visual diff vs. Things-To-Do; reduced-motion check | manual smoke | n/a | n/a |
| Copy matches UI-SPEC verbatim | grep on the rendered HTML | manual smoke + lint | `npm run lint` | yes |
| Card grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 md:gap-y-24` | Resize browser, confirm breakpoint behavior | manual smoke | n/a | n/a |
| Card image hover: scale 1.05 → 1.10 over 1000ms + dark overlay fade | Hover QA on each card | manual smoke | n/a | n/a |
| Card order: Honeyfund → Amazon → Crate & Barrel | DOM inspect / visual | manual smoke | n/a | n/a |
| `<h1>` on hero, `<h2>` on grid, `<h3>` on cards | View source / a11y tree | manual smoke + lint | `npm run lint` | yes |
| `aria-label` includes "(opens in new tab)" on each card | View source | manual smoke | n/a | n/a |
| Decorative divs `aria-hidden="true"` | View source | manual smoke | n/a | n/a |
| `<img>` `alt` describes scene, not brand | View source | manual smoke | n/a | n/a |
| `npm run lint` passes | ESLint clean | automated | `npm run lint` | yes |
| `npm run build` passes | Production build clean (catches metadata, image, type errors) | automated | `npm run build` | yes |
| Reduced motion: animations disabled | Toggle OS setting, reload | manual smoke | n/a | n/a |

### Sampling Rate
- **Per task commit:** `npm run lint` (sub-second)
- **Per wave merge:** `npm run lint && npm run build` (build catches type errors, metadata shape errors, and missing-image-config errors)
- **Phase gate:** Manual smoke checklist run against `localhost:3000/registry` covering every UI-SPEC acceptance criterion, then ship to Vercel preview and re-smoke

### Wave 0 Gaps

- [ ] No automated test framework needed — this phase follows the Phase 1 precedent of `lint + build + manual smoke`. Do NOT introduce Jest/Vitest/Playwright as part of this phase; that decision belongs to a project-level testing phase, not a single-page UI port.
- [ ] No new ESLint config — existing `eslint-config-next` `16.2.1` already enforces `@next/next/no-img-element`; the existing `// eslint-disable-next-line` pattern is correct.

*(If validation is to be enforced beyond manual smoke, that's a scope expansion to discuss with Tyler — not a research finding.)*

## Sources

### Primary (HIGH confidence)
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` — page.tsx export shape, Server Component default, Next.js 15+ Promise-shaped params
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` — `export const metadata` static-vs-dynamic shape
- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md` — `next/image` remote-host allowlist requirement (justifies plain `<img>` choice)
- `app/(main)/things-to-do/page.tsx` — canonical visual / structural reference; every section pattern in this phase ports from this file
- `app/(main)/travel/page.tsx` — secondary visual reference + the `export const metadata` precedent
- `app/(main)/layout.tsx` — confirms `<Navbar />` / `<Footer />` chrome wraps every `(main)` route automatically
- `app/globals.css` — full Stitch token set + every motion/utility class this phase consumes (`hero-reveal-*`, `reveal-on-scroll-stagger`, `editorial-underline`, `hero-parallax-bg`, reduced-motion media query)
- `components/Navbar.tsx` — confirms the one-line edit point and the existing `pathname.startsWith(href)` + `isActive && href === pathname` active-state logic
- `package.json` — verifies Next.js 16.2.6, React 19.2.4, no test framework installed, no Stitch/UI-library dependencies
- `next.config.ts` — verifies no `images.remotePatterns` configured (justifies plain `<img>` decision)

### Secondary (MEDIUM confidence)
- `.planning/phases/02-registry-page/02-UI-SPEC.md` — design contract from gsd-ui-researcher, approved
- `.planning/phases/02-registry-page/02-CONTEXT.md` — user-locked decisions from `/gsd:discuss-phase`
- `.planning/PROJECT.md` — Stitch palette + audience constraints

### Tertiary (LOW confidence)
None. Every claim in this research is sourced from a file in the repo or an official Next.js doc shipped with the installed version. No WebSearch was needed.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every dependency version verified via `package.json`; no new packages
- Architecture: HIGH — direct port from a shipped sibling page; pattern is proven in production
- Pitfalls: HIGH — five of six pitfalls are grounded in concrete codebase observations (Navbar logic, image config, padding cadence, hover timing); the sixth (`use client` reflex) is a well-documented App Router footgun
- Validation: HIGH — verified that no test framework exists; recommendation matches Phase 1 precedent

**Research date:** 2026-05-29
**Valid until:** 2026-06-28 (30 days — Next.js 16 is stable, project surface is small, no fast-moving deps)
