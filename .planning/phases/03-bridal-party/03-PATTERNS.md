# Phase 3: Bridal Party — Pattern Map

**Mapped:** 2026-05-30
**Files analyzed:** 2 (1 new, 1 modified)
**Analogs found:** 2 / 2

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `app/(main)/bridal-party/page.tsx` (NEW) | route (Next.js 16 Server Component, App Router) | static render of inline-data array | `app/(main)/registry/page.tsx` | exact (hero + section header + image container); deviation on grid layout |
| `components/Navbar.tsx` (MODIFY) | component (client, `"use client"`) | static config array | `components/Navbar.tsx` lines 7-16 (self-analog) | exact (insert one entry into the existing `links` array) |

---

## Pattern Assignments

### `app/(main)/bridal-party/page.tsx` (route, static-render)

**Analog:** `app/(main)/registry/page.tsx` (most recently shipped page in the same route group; uses the 2-axis hero scrim recipe that the UI-SPEC carries forward verbatim).

#### Pattern 1 — Imports + Metadata (copy from `registry/page.tsx:1-6`)

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registry — Emily & Tyler",
  description: "A few places we've registered for our Aspen wedding.",
};
```

**Translate to Phase 3** — swap title/description verbatim per UI-SPEC §Copywriting Contract:
- `title: "Bridal Party — Emily & Tyler"`
- `description: "The 16 people standing with us on our Aspen wedding weekend."` (or similar; UI-SPEC leaves this discretion)

**No client hooks.** This is a Server Component — do NOT add `"use client"`. Compare with `things-to-do/page.tsx` which has no `"use client"` and uses no hooks. The page renders 16 hardcoded rows from inline arrays — no `useState`, no `useEffect`, no `usePathname`.

#### Pattern 2 — Inline data arrays (copy structure from `registry/page.tsx:8-39`)

```tsx
const registries = [
  {
    title: "Honeyfund",
    description:
      "Our honeymoon adventure fund. Help us celebrate by contributing to the trip of a lifetime.",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
    alt: "Mountain landscape with a passport and journal evoking honeymoon travel",
    // TODO: replace with real registry URL
    link: "#",
  },
  // …
];
```

**Translate to Phase 3** — two arrays, not one. Match the field-shape pattern: object literal with string/string|null fields, `// TODO:` comment placed immediately above each placeholder field that Tyler will swap at handoff.

```tsx
type Member = {
  name: string;
  role: string;
  photo: string | null;
  bio: string;
};

const brideSide: Member[] = [
  {
    name: "Sarah Else",
    role: "MAID OF HONOR",
    photo: "/bridal-party/sarah-else.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
  // … 7 more Bridesmaid entries
];

const groomSide: Member[] = [
  {
    name: "Dylan Straffon",
    role: "BEST MAN",
    photo: "/bridal-party/dylan-straffon.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
  // … 7 more Groomsman entries
];
```

**Roster locked in CONTEXT D-03.** Order is intentional — do not alphabetize. 16 `// TODO: replace with real bio` comments total (one per bio).

#### Pattern 3 — `getInitials()` helper (NET-NEW — no codebase precedent)

No existing analog. Implement as a top-of-file pure function above the data arrays:

```tsx
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}
```

Spec confirms: two lines is fine, not exported, lives in the page module (UI-SPEC §Monogram Fallback Spec: "Implement `getInitials(name: string): string` as a top-of-file pure function in `page.tsx`. Two lines, no exports, no separate file.").

#### Pattern 4 — Page shell (copy from `registry/page.tsx:41-43, 147-149`)

```tsx
export default function RegistryPage() {
  return (
    <main>
      {/* … hero, framing, grid … */}
    </main>
  );
}
```

**Translate to Phase 3** — `function BridalPartyPage()`, `<main>` wraps hero + Bride's Side `<section>` + Groom's Side `<section>`. No framing block (the Phase 3 hero subtitle replaces Phase 2's framing block role).

#### Pattern 5 — Hero (copy verbatim from `registry/page.tsx:44-81`)

This is the **2-axis scrim recipe** that landed in Registry commit `e82d7d4` — UI-SPEC §Hero Spec explicitly carries it forward verbatim.

```tsx
{/* Hero Section */}
<section className="relative h-[614px] w-full overflow-hidden bg-background">
  <div className="absolute inset-0 z-0">
    {/* TODO: replace with /public local hero image */}
    <div
      className="w-full h-full bg-cover bg-center hero-parallax-bg"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80')",
      }}
      aria-hidden="true"
    />
    <div
      className="absolute inset-0"
      aria-hidden="true"
      style={{
        background:
          "linear-gradient(to bottom, rgba(13,27,30,0.15) 0%, rgba(13,27,30,0.5) 55%, rgba(13,27,30,0.85) 100%), linear-gradient(to right, rgba(13,27,30,0.45) 0%, rgba(13,27,30,0.15) 45%, transparent 70%)",
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
        <span className="italic font-light text-primary/80">
          Registries
        </span>
      </h1>
      <p className="text-on-surface-variant text-lg max-w-2xl font-light leading-relaxed hero-reveal-subtitle">
        A few places we&apos;ve put together — but truly, just being there is enough.
      </p>
    </div>
  </div>
</section>
```

**Translate to Phase 3** — three string swaps only (per UI-SPEC §Copywriting Contract):
- Eyebrow: `For Our Guests` → `Our People`
- Headline: `Our Registries` → `The Ones Standing With Us` (wrap `Standing With Us` in the italic-accent span, not just one word)
- Subtitle: → `Eight on each side — the people we've leaned on, laughed with, and could not picture this weekend without.`
- Hero image URL: → `https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1600&q=80` (per UI-SPEC §Hero Spec)
- Keep the `{/* TODO: replace with /public local hero image */}` comment verbatim.

**Carry forward verbatim:** scrim gradient, both `aria-hidden="true"` decorative divs, all three `hero-reveal-*` motion classes, `h-[614px]`, `max-w-[1440px] mx-auto px-6 md:px-12`, `flex flex-col justify-end pb-20`, `max-w-4xl` content cap.

#### Pattern 6 — Section header (copy from `registry/page.tsx:101-109`)

```tsx
<div className="mb-12 md:mb-24 reveal-on-scroll">
  <span className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 block">
    Gift Registries
  </span>
  <h2 className="font-headline text-4xl md:text-6xl text-on-surface">
    A Few of Our{" "}
    <span className="italic font-light text-primary/80">Favorites</span>
  </h2>
</div>
```

**Translate to Phase 3** — wrapper margin changes to `mb-16 md:mb-24` (per UI-SPEC §Section Header Spec); two section headers, not one:

- Bride's Side: eyebrow `THE BRIDE'S SIDE`, h2 `Bride's` + italic-gold `Side`
- Groom's Side: eyebrow `THE GROOM'S SIDE`, h2 `Groom's` + italic-gold `Side`

Both wrap inside a `<section className="py-24 md:py-32 bg-background">` with the standard `max-w-[1440px] mx-auto px-6 md:px-12` container. Bride's Side renders first (D-01).

#### Pattern 7 — Image-with-fallback (adapt from `registry/page.tsx:121-132`)

**Registry's image container (analog):**

```tsx
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
```

**Translate to Phase 3** — keep `aspect-[4/5] bg-surface-variant/50 overflow-hidden relative` shell, **drop** the `mb-8` (each row is a grid, not a vertical card stack), **drop** the dark overlay div and `group-hover:*` transitions (rows are static editorial per UI-SPEC §Magazine Row Spec: "No hover effects on rows."), and **add** the monogram fallback branch:

```tsx
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
      <div
        className="absolute inset-0 flex items-center justify-center bg-surface-container"
        aria-hidden="true"
      >
        <span className="font-headline italic text-5xl md:text-7xl text-primary">
          {getInitials(member.name)}
        </span>
      </div>
    )}
  </div>
</div>
```

**Image element rules carry forward verbatim from Registry:**
- Plain `<img>` (NOT `next/image`) — D-08 supersedes ROADMAP's "image optimization via `next/image`" wording. Every shipped page uses plain `<img>`. Carry this convention.
- `{/* eslint-disable-next-line @next/next/no-img-element */}` immediately above the `<img>` tag — every shipped page has this directive.
- `className="w-full h-full object-cover"` — drop the Registry-specific `transition-transform duration-1000 scale-105 group-hover:scale-110` since rows are static.

**`<img>` className simplifies** — no transition, no hover scale. Just `w-full h-full object-cover`.

#### Pattern 8 — Magazine row layout (NET-NEW — deliberate departure from analog grid)

**Analog grid (do NOT copy)** — `registry/page.tsx:111`:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 md:gap-y-24 reveal-on-scroll-stagger">
  {registries.map((r) => ( /* <a> card */ ))}
</div>
```

**Phase 3 row stack (use this instead)** per UI-SPEC §Magazine Row Spec:

```tsx
<div className="flex flex-col gap-y-16 md:gap-y-24 lg:gap-y-32">
  {brideSide.map((member, i) => {
    const isTextRight = i % 2 === 1;
    return (
      <div
        key={member.name}
        className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-12 lg:gap-x-16 items-center reveal-on-scroll"
      >
        {/* Text column — always first in DOM order so mobile collapses text-above-photo */}
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
        {/* Photo column — `md:row-start-1` keeps it on the same row as text on desktop */}
        <div className={`md:col-span-5 ${isTextRight ? "md:col-start-1 md:row-start-1" : ""}`}>
          {/* aspect-[4/5] container with img-or-fallback per Pattern 7 */}
        </div>
      </div>
    );
  })}
</div>
```

**Alternation rule** — index 0/2/4/6 = text-left/photo-right (default column positions, no `col-start`); index 1/3/5/7 = text-right/photo-left (text gets `md:col-start-6`, photo gets `md:col-start-1 md:row-start-1`). Both sections start with index 0 = text-left so Sarah Else and Dylan Straffon visually anchor in the same position.

**Mobile collapse** — `grid-cols-1` at `<md` flattens the 12-column layout. Text column being first in DOM order means text always renders above photo on mobile, regardless of desktop alternation. `md:row-start-1` on the photo column is what keeps photo-left/text-right rows on the same row on desktop while preserving the mobile text-first reading order.

#### Pattern 9 — Row reveal motion (copy from `registry/page.tsx:111` — but use `reveal-on-scroll`, NOT `-stagger`)

Registry uses `reveal-on-scroll-stagger` on its grid wrapper (lets the staggered child rule in `globals.css:439-446` cascade to the three children with 80ms offsets).

**For Phase 3 — each row gets its own `reveal-on-scroll` on the row's grid wrapper, NOT on the parent stack.** UI-SPEC explicitly forbids `reveal-on-scroll-stagger` here: "staggering full-width rows feels chaotic. Each row reveals as a single unit." The stagger CSS in `globals.css:445-446` only defines delays for `:nth-child(2)` and `:nth-child(3)` anyway — using it on a 16-row list would silently leave rows 4-16 with zero delay.

Section header wrappers also get `reveal-on-scroll` (single fade per header, matches Registry pattern at `:101`).

#### Reduced motion

Already covered by `app/globals.css:613-621`:
```css
@media (prefers-reduced-motion: reduce) {
  .hero-reveal-label, .hero-reveal-title, .hero-reveal-subtitle,
  .reveal-on-scroll, .reveal-on-scroll-stagger > *, .gallery-grid > *,
  .parallax-bg, .hero-parallax-bg,
  .ampersand-breathe, .diamond-scroll-reveal, .arrow-bounce-hint {
    animation: none !important;
  }
}
```

All four motion utilities used on this page (`hero-parallax-bg`, `hero-reveal-label/title/subtitle`, `reveal-on-scroll`) are already covered. No per-page handling needed.

---

### `components/Navbar.tsx` (component, static-config)

**Analog:** itself — `components/Navbar.tsx:7-16` (the `links` array is the only target). Active-state branching at `:43-48` (desktop) / `:84-89` (mobile) is read-only.

#### Pattern 1 — Insert new link entry (modify `components/Navbar.tsx:7-16`)

**Current `links` array:**

```ts
const links = [
  { label: "Home", href: "/" },
  // { label: "Our Story", href: "/#our-story" },
  { label: "Travel & Stay", href: "/travel" },
  { label: "Itinerary", href: "/itinerary" },
  { label: "Things To Do", href: "/things-to-do" },
  { label: "FAQ", href: "/faq" },
  { label: "Registry", href: "/registry" },
  { label: "RSVP", href: "/rsvp" },
];
```

**After modification** — insert `{ label: "Bridal Party", href: "/bridal-party" }` between `Things To Do` (index 3) and `FAQ` (index 4):

```ts
const links = [
  { label: "Home", href: "/" },
  // { label: "Our Story", href: "/#our-story" },
  { label: "Travel & Stay", href: "/travel" },
  { label: "Itinerary", href: "/itinerary" },
  { label: "Things To Do", href: "/things-to-do" },
  { label: "Bridal Party", href: "/bridal-party" },
  { label: "FAQ", href: "/faq" },
  { label: "Registry", href: "/registry" },
  { label: "RSVP", href: "/rsvp" },
];
```

**Deviation from prior Registry-phase pattern** — Phase 2 (Registry) had a commented-out stub at the same spot which was simply *uncommented* (and the `href` updated). Bridal Party has no prior stub — this is a **brand-new entry, inserted at index 4**, not an uncomment. Final desktop nav order: `Home`, `Travel & Stay`, `Itinerary`, `Things To Do`, `Bridal Party`, `FAQ`, `Registry`, `RSVP`.

#### Pattern 2 — Active-state branching (read-only reference at `:42-48` and `:83-89`)

```tsx
const isActive =
  href === "/"
    ? pathname === "/"
    : href.startsWith("/#")
      ? pathname === "/"
      : pathname.startsWith(href);
```

`pathname.startsWith("/bridal-party")` works out of the box. No code change required to either branching block. UI-SPEC A8 verifies this visually — no logic needs touching.

---

## Shared Patterns

### Layout container (apply to hero, Bride's Side section, Groom's Side section)

**Source:** `app/(main)/registry/page.tsx:65, 85, 100` (recurring three times in Registry); identical convention in Things-To-Do (`:78, 108, 148`) and Travel (`:29, 51`).

```tsx
<div className="max-w-[1440px] mx-auto px-6 md:px-12">
  {/* … */}
</div>
```

Apply verbatim. No deviation.

### Eyebrow label (apply to hero eyebrow, both section eyebrows, all 16 per-row role labels)

**Source:** `app/(main)/registry/page.tsx:67` (hero) and `:102` (section).

```tsx
<span className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 block">
  …
</span>
```

**Per-row role label uses `mb-4 block` instead of `mb-6 block`** (per UI-SPEC §Typography "Small" tier `mb-4` placement above member name `<h3>`). Hero and section headers keep `mb-6`.

### Italic-accent span (apply to hero h1, both section h2s)

**Source:** `app/(main)/registry/page.tsx:72-74` (hero) and `:106-107` (section h2).

```tsx
<span className="italic font-light text-primary/80">…</span>
```

Apply verbatim. Three usages on this page (hero "Standing With Us", h2 "Side", h2 "Side").

### `(main)` layout auto-wrap (no change required)

**Source:** `app/(main)/layout.tsx:18-21`. The new `bridal-party/page.tsx` automatically gets `<Navbar />` + `<Footer />` + `<MusicButton />` + skip-link wrapping. Do NOT add any of these in the page itself.

```tsx
<Navbar />
<div id="main-content">{children}</div>
<Footer />
<MusicButton />
```

No `pt-20` on `<main>` — hero floats under the fixed nav (verified across all three analogs).

---

## Patterns to NOT Copy from Analog

Explicit forbid list — these are present in `registry/page.tsx` and `things-to-do/page.tsx` but must NOT appear in Phase 3 code:

| Anti-pattern | Source line | Why excluded for Phase 3 |
|--------------|-------------|--------------------------|
| `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 …` 3-up card grid | `registry/page.tsx:111`, `things-to-do/page.tsx:118` | Phase 3 uses magazine row layout, not card grid. UI-SPEC §Design Pillars principle 1: "Editorial over inventory. Every member gets a full row, not a grid cell." |
| `editorial-underline` class on a CTA span | `registry/page.tsx:139` | No outbound CTAs on bridal-party rows. The 16 members do not link anywhere. |
| `target="_blank" rel="noopener noreferrer"` on `<a>` tags | `registry/page.tsx:116-117` | No outbound `<a>` tags on this page at all. No tabnabbing surface to harden. |
| `aria-label={\`Visit ${r.title} registry (opens in new tab)\`}` | `registry/page.tsx:118` | No outbound links → no "(opens in new tab)" affordance required. |
| `group cursor-pointer block` wrapping `<a>` | `registry/page.tsx:113-119` | Rows are not clickable. No `<a>` wrappers, no `group` class, no `cursor-pointer`. |
| `bg-background/20 group-hover:bg-transparent transition-colors duration-500` overlay div | `registry/page.tsx:122-125` | No hover overlay on static editorial rows. |
| `transition-transform duration-1000 scale-105 group-hover:scale-110` on `<img>` | `registry/page.tsx:129` | No hover scale on portraits. Plain `object-cover`, no transitions. |
| `group-hover:text-primary transition-colors` on `<h3>` | `registry/page.tsx:133` | Names are not interactive. No hover color change. |
| `reveal-on-scroll-stagger` on the row stack | `registry/page.tsx:111` | UI-SPEC explicitly forbids: "staggering full-width rows feels chaotic." Each row uses solo `reveal-on-scroll` on its own grid wrapper. Also: the stagger CSS only defines delays for `:nth-child(2)` and `:nth-child(3)`, so 16-row lists would silently lose stagger from row 4 onward. |
| `bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,163,115,0.04)_0%,transparent_60%)]` overlay | `registry/page.tsx:97` | UI-SPEC §Color: "No radial gradient overlay this phase. … adding a per-section gradient overlay would compete with the editorial cadence." |
| `id="activities" … scroll-mt-32` / sticky mobile jump-links nav | `things-to-do/page.tsx:95-104, 107, 146` | No in-page anchor jumps on this page. Both sections render sequentially; no sticky sub-nav. |
| `mb-8` on photo container | `registry/page.tsx:121` | Row uses a 12-col grid, not a vertical card stack — vertical card spacing is replaced by `gap-y-8` on the grid wrapper. |
| Framing block / centered-prose `<section className="py-16 …">` | `registry/page.tsx:83-92` | Hero subtitle carries the framing role for Phase 3. No separate framing block. |

---

## No Analog Found

| Element | Reason | Source guidance |
|---------|--------|-----------------|
| Magazine row layout (alternating 12-col grid) | No existing page uses a per-row alternating grid; Travel's two-column layout (`travel/page.tsx:52-54`) is the closest precedent but uses fixed columns and is single-instance, not per-row alternation | UI-SPEC §Magazine Row Spec is fully spec'd — implement directly from it |
| Monogram fallback (`getInitials` + warm-gold initials on `bg-surface-container`) | Net-new pattern. No existing page has a missing-image fallback. | UI-SPEC §Monogram Fallback Spec is fully spec'd — implement directly from it |
| `<img>` without `next/image` AND without hover-scale transitions | All shipped pages either have hover-scale (Registry, Things-To-Do, Travel route map) or no `<img>` at all. None have plain `object-cover` with no transitions. | UI-SPEC §Magazine Row Spec: plain `w-full h-full object-cover`, no transitions |

---

## Metadata

**Analog search scope:** `app/(main)/**/page.tsx` (all four shipped routes), `components/Navbar.tsx`, `app/(main)/layout.tsx`, `app/globals.css` (motion utilities).

**Files scanned (read in full):** 7 — `app/(main)/registry/page.tsx`, `app/(main)/things-to-do/page.tsx`, `app/(main)/travel/page.tsx`, `components/Navbar.tsx`, `app/(main)/layout.tsx`, and targeted ranges in `app/globals.css` (lines 340-450, 600-621). Plus CONTEXT, UI-SPEC, and the carry-forward UI-SPEC from Phase 2.

**Next.js 16 note:** AGENTS.md flags that this Next.js install has breaking changes. The analog pages (Registry, Things-To-Do, Travel) are all shipped under this version and use the standard App Router conventions: `app/(main)/<slug>/page.tsx` for routes, `export const metadata`, `export default function` for the page component, no special imports beyond `import type { Metadata } from "next"`. No deprecation surfaces touched by Phase 3 (no data fetching, no dynamic params, no `cookies()`/`headers()`/`searchParams`, no route handlers, no `Image` component, no `Link` in the page itself — `Link` is only inside the existing Navbar). Phase 3 conformity is inherited automatically from the analog files.

**Pattern extraction date:** 2026-05-30
