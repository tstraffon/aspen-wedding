# Phase 02: Registry Page — Pattern Map

**Mapped:** 2026-05-29
**Files analyzed:** 2 (1 create, 1 modify)
**Analogs found:** 2 / 2 (both exact-match in role and data flow)

---

## File Classification

| New/Modified File | Action | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|--------|------|-----------|----------------|---------------|
| `app/(main)/registry/page.tsx` | CREATE | App Router static page (RSC) | static-render (inline data array) | `app/(main)/things-to-do/page.tsx` | exact (structural twin) |
| `components/Navbar.tsx` | MODIFY (1 line) | client nav component | request-response (route map) | self (line 13 is already a commented entry of the target shape) | trivial — uncomment + href swap |

**Secondary references** consumed for partial patterns:
- `app/(main)/travel/page.tsx` — for `import type { Metadata }` + `export const metadata` precedent (Things-To-Do omits this; UI-SPEC adopts the Travel precedent).
- `app/(main)/faq/page.tsx` — for the centered `max-w-2xl` editorial framing block treatment (the framing block sits between hero and grid; FAQ does not have this exact element but its centered headline/paragraph pattern is the closest sibling).
- `app/(main)/layout.tsx` — passive: confirms `<Navbar /> + skip-link + <Footer /> + <MusicButton />` wrap every `(main)` route. No edits.

---

## Pattern Assignments

### `app/(main)/registry/page.tsx` (Server Component, static-render)

**Primary analog:** `app/(main)/things-to-do/page.tsx`
**Secondary analog (for `metadata` only):** `app/(main)/travel/page.tsx`

This file is a structural port of Things-To-Do with two UI-SPEC deviations called out below.

---

#### 1. Imports + Metadata Export

**Analog (Travel) — `app/(main)/travel/page.tsx` lines 1–9:**

```tsx
import type { Metadata } from "next";
import AltitudeCounter from "@/components/AltitudeCounter";
import HotelTabs from "@/components/HotelTabs";

export const metadata: Metadata = {
  title: "Travel & Stay — Emily & Tyler",
  description:
    "Everything you need to navigate your journey to Aspen for the wedding.",
};
```

**Pattern to copy for Registry:**
- Use `import type { Metadata } from "next";` as the only import (no `next/link`, no client components, no helpers).
- Export `metadata` with `title: "Registry — Emily & Tyler"` and a one-sentence description per RESEARCH §Open Questions Q1.
- Things-To-Do (line 1) imports `Link` but never uses it in JSX — do not blindly carry that import over.

**Deviation:** Registry needs zero additional component imports — no `AltitudeCounter`, no `HotelTabs`, no `Link`.

---

#### 2. Inline Data Array

**Analog — `app/(main)/things-to-do/page.tsx` lines 3–58:**

```tsx
const activities = [
  {
    title: "Hike The Maroon Bells",
    description:
      "Witness the most photographed peaks in North America. We recommend the Scenic Loop trail for stunning alpine reflections.",
    image:
      "https://lh3.googleusercontent.com/aida-public/...",
    alt: "Hiking Maroon Bells",
    link: "https://www.aspensnowmass.com/discover/...",
  },
  // ...
];
```

**Pattern to copy for Registry:**
- Same object shape: `{ title, description, image, alt, link }` — already locked in CONTEXT D-03.
- Inline `const registries = [...]` above the page component, no separate file.
- Three entries in order: **Honeyfund → Amazon → Crate & Barrel** (CONTEXT Specifics, UI-SPEC §Card Grid Spec).

**Deviation from analog (UI-SPEC §Copywriting Contract + RESEARCH Pitfall 3):**
- All three `link` values must be `"#"` with an immediately preceding `// TODO: replace with real registry URL` comment. Things-To-Do uses real outbound URLs; Registry does not (D-12 defers URLs to Tyler).
- Card descriptions use the locked copy from UI-SPEC §Copywriting Contract (not the freeform copy in Things-To-Do).

---

#### 3. Page Shell + Hero

**Analog — `app/(main)/things-to-do/page.tsx` lines 60–92:**

```tsx
export default function ThingsToDoPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[614px] w-full overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center hero-parallax-bg"
            style={{ backgroundImage: "url('/foliage-from-above.jpeg')" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(13,27,30,0.05), rgba(13,27,30,0.3))",
            }}
          />
        </div>
        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-20">
          <div className="max-w-4xl">
            <p className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 hero-reveal-label">
              Explore the Area
            </p>
            <h1 className="font-headline text-5xl md:text-8xl text-on-surface leading-[0.85] tracking-tighter mb-6 hero-reveal-title">
              Things{" "}
              <span className="italic font-light text-primary/80">To Do</span>
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl font-light leading-relaxed hero-reveal-subtitle">
              From curated outdoor adventures to our favorite restaurants, here&apos;s everything you need to make the most of your mountain getaway.
            </p>
          </div>
        </div>
      </section>
```

**Pattern to copy for Registry:** verbatim structure (`<main>` -> `<section relative h-[614px]>` -> `hero-parallax-bg` div + scrim div -> centered `relative z-10` content block -> eyebrow / `<h1>` / subtitle).

**Deviations mandated by UI-SPEC §Copywriting Contract and §Hero Spec:**
- Eyebrow text: `For Our Guests` (replaces `Explore the Area`).
- Headline: `Our <span ...>Registries</span>` (replaces `Things <span>To Do</span>`).
- Subtitle: `A few places we've put together — but truly, just being there is enough.` (replaces existing subtitle).
- Background image: placeholder URL during execution (curated home tabletop suggestion). Add `// TODO: replace with /public local hero image` comment beside the `backgroundImage` style per RESEARCH §Open Questions Q2.
- The hero `<div>` should NOT add `aria-hidden="true"` blindly — but the two decorative children (parallax-bg div and scrim div) SHOULD per UI-SPEC §Accessibility Contract. Things-To-Do currently omits these `aria-hidden` attributes — Registry must add them (RESEARCH Pattern 2 includes them in the corrected excerpt).

---

#### 4. Framing Block (between hero and grid) — UI-SPEC-specific, no direct codebase analog

**Closest analog — `app/(main)/faq/page.tsx` lines 66–79 (centered text block treatment):**

```tsx
<div className="max-w-4xl mx-auto px-6 text-center relative">
  <span className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 block hero-reveal-label">
    Guided Information
  </span>
  <h1 className="font-headline text-5xl md:text-7xl text-on-surface mb-6 hero-reveal-title">
    Common{" "}
    <span className="italic font-light text-primary/80">Questions</span>
  </h1>
  <p className="text-on-surface-variant text-lg font-light mb-0 max-w-xl mx-auto hero-reveal-subtitle">
    Everything you need to know before your trip to the mountains.
  </p>
</div>
```

**Pattern to apply for Registry framing block** (per UI-SPEC §Framing Block Spec):

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

**Deviations from FAQ analog:**
- **No eyebrow label** — UI-SPEC §Framing Block Spec: "An eyebrow would over-formalize the warm-and-gracious tone."
- Use `reveal-on-scroll` (not `hero-reveal-*`) because this block scrolls into view rather than rendering on initial paint.
- `max-w-2xl` (not FAQ's `max-w-4xl`) — tighter container per UI-SPEC.
- Single `<p>` only; no `<h1>` / eyebrow / accent span. Plain body prose.

---

#### 5. Card Grid Section (with radial gradient overlay)

**Analog — `app/(main)/things-to-do/page.tsx` lines 107–143:**

```tsx
<section id="activities" className="py-16 bg-background relative overflow-hidden scroll-mt-32">
  <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
    <div className="mb-12 md:mb-24 reveal-on-scroll">
      <span className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 block">
        Curated Experiences
      </span>
      <h2 className="font-headline text-4xl md:text-6xl text-on-surface">
        Discover Aspen
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 md:gap-y-24 reveal-on-scroll-stagger">
      {activities.map((activity) => (
        <a key={activity.title} href={activity.link} target="_blank" rel="noopener noreferrer" className="group cursor-pointer block">
          <div className="aspect-[4/5] bg-surface-variant/50 mb-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={activity.alt}
              className="w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-110"
              src={activity.image}
            />
          </div>
          <h3 className="font-headline text-2xl text-on-surface mb-3 group-hover:text-primary transition-colors">
            {activity.title}
          </h3>
          <p className="text-on-surface-variant text-base leading-relaxed mb-6 font-light">
            {activity.description}
          </p>
          <span className="font-headline italic text-primary text-sm editorial-underline inline-flex items-center gap-2 group-hover:gap-3 transition-all">
            Learn More
          </span>
        </a>
      ))}
    </div>
  </div>
</section>
```

**Radial gradient overlay reference — `app/(main)/things-to-do/page.tsx` line 147** (drawn from the Restaurants section, NOT the Activities section):

```tsx
<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,163,115,0.04)_0%,transparent_60%)] pointer-events-none" />
```

**Pattern to copy for Registry grid** (composite of Activities structure + Restaurants radial gradient):

- Section wrapper: `<section className="py-16 bg-background relative overflow-hidden">` — drop the `id="activities"` and `scroll-mt-32` (no in-page jump-links on Registry per CONTEXT/UI-SPEC).
- Inject the radial gradient `<div>` as the first child of the section, before the `max-w-[1440px]` content wrapper. The content wrapper needs `relative z-10` to sit above it. Add `aria-hidden="true"` to the gradient div per UI-SPEC §Accessibility Contract — Things-To-Do omits this; Registry must add it.
- Header block: keep `mb-12 md:mb-24 reveal-on-scroll`; swap copy to `Gift Registries` eyebrow + `A Few of Our <span italic ...>Favorites</span>` headline per UI-SPEC §Copywriting Contract.
- Grid + card map: copy verbatim from lines 118–141 with the data array renamed `registries`.

**Three deviations from the Things-To-Do card markup mandated by UI-SPEC §Typography and §Card Grid Spec:**

| Element | Things-To-Do (analog line) | Registry (UI-SPEC) |
|---------|----------------------------|--------------------|
| Card title classes | `text-2xl` (line 130) | `text-2xl md:text-4xl` — responsive Heading tier |
| Card blurb classes | `text-base` (line 133) | `text-lg` — body tier merged up to 18px |
| CTA copy | `Learn More` (line 137) | `Visit Registry` — identical across all three cards |
| `aria-label` on `<a>` | absent (line 120) | required: `Visit ${title} registry (opens in new tab)` per UI-SPEC §Accessibility Contract |
| Decorative overlay div | no `aria-hidden` (line 122) | `aria-hidden="true"` required |

Do not refactor `app/(main)/things-to-do/page.tsx` to match these new tier rules — UI-SPEC §Typography "Merges applied" only applies to Registry.

---

### `components/Navbar.tsx` (client nav component, MODIFY)

**Self-analog** — the existing commented entry at line 13 already has the correct shape; this is a one-line edit, not a porting exercise.

**Current state (lines 7–16):**

```tsx
const links = [
  { label: "Home", href: "/" },
  // { label: "Our Story", href: "/#our-story" },
  { label: "Travel & Stay", href: "/travel" },
  { label: "Itinerary", href: "/itinerary" },
  { label: "Things To Do", href: "/things-to-do" },
  // { label: "Registry", href: "/#registry" },
  { label: "FAQ", href: "/faq" },
  { label: "RSVP", href: "/rsvp" },
];
```

**Required change (line 13 only):**

```tsx
  { label: "Registry", href: "/registry" },
```

Net effect: uncomment the line and change `/#registry` → `/registry`. Line position preserved (between Things To Do and FAQ), matching UI-SPEC §Navbar Integration order: Home · Travel & Stay · Itinerary · Things To Do · FAQ · Registry · RSVP. Verify visually after edit — the comment removal shifts adjacent line numbers but the array order is unchanged.

**Active-state logic — DO NOT TOUCH** (lines 42–48, 83–89). The existing branching already handles `/registry`:

```tsx
const isActive =
  href === "/"
    ? pathname === "/"
    : href.startsWith("/#")
      ? pathname === "/"
      : pathname.startsWith(href);
```

Because `/registry` does not start with `/#` and is not `/`, it falls through to `pathname.startsWith("/registry")`, which is exact-match true when the user is on `/registry`. The subsequent `isActive && href === pathname` check (line 54) then applies `text-primary`. RESEARCH Pitfall 5 explicitly warns against refactoring this — heed it.

**No other navbar changes.** Don't add icons, don't reorder, don't touch the mobile menu loop (it re-uses the same `links` array).

---

## Shared Patterns

These are cross-cutting utilities the Registry page consumes. All are already present in `app/globals.css` — do not re-implement.

### Hero entrance animations

**Source:** `app/globals.css` lines 346–356

```css
.hero-reveal-label    { animation: hero-fade-up 800ms ease-out 200ms both; }
.hero-reveal-title    { animation: hero-fade-up 800ms ease-out 400ms both; }
.hero-reveal-subtitle { animation: hero-fade-up 800ms ease-out 600ms both; }
```

**Apply to:** Hero eyebrow / `<h1>` / subtitle in `app/(main)/registry/page.tsx` (exact assignment per UI-SPEC §Hero Spec — `hero-reveal-label` on eyebrow, `hero-reveal-title` on h1, `hero-reveal-subtitle` on subtitle).

---

### Hero parallax background

**Source:** `app/globals.css` lines 364–368

```css
.hero-parallax-bg {
  animation: hero-parallax ease-out both;
  animation-timeline: view();
  animation-range: contain 0% contain 100%;
}
```

**Apply to:** The hero background `<div>` with the `style={{ backgroundImage: ... }}` inline style.

---

### Scroll-driven reveal

**Source:** `app/globals.css` lines 433–446

```css
.reveal-on-scroll {
  animation: fade-slide-up ease-out both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}

.reveal-on-scroll-stagger > * {
  animation: fade-slide-up ease-out both;
  animation-timeline: view();
  animation-range: entry 0% entry 35%;
}
.reveal-on-scroll-stagger > *:nth-child(2) { animation-delay: 80ms; }
.reveal-on-scroll-stagger > *:nth-child(3) { animation-delay: 160ms; }
```

**Apply to:**
- `reveal-on-scroll` → framing block inner div, grid section header block (`mb-12 md:mb-24`)
- `reveal-on-scroll-stagger` → the `grid` container that holds the three cards (stagger is per-child)

Three cards exactly maps to the `:nth-child(2)` / `:nth-child(3)` delays — no manual stagger overrides needed.

---

### Editorial CTA underline

**Source:** `app/globals.css` lines 155–168

```css
.editorial-underline { position: relative; }
.editorial-underline::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: currentColor;
  opacity: 0.5;
}
```

**Apply to:** The "Visit Registry" `<span>` on each card. Exact class string per UI-SPEC §Card Grid Spec:
`font-headline italic text-primary text-sm editorial-underline inline-flex items-center gap-2 group-hover:gap-3 transition-all`.

---

### Outbound link convention

**Source:** Every external link in `app/(main)/things-to-do/page.tsx` (lines 120, 179, 183, 187, etc.) and `app/(main)/faq/page.tsx` (lines 32, 39 — internal links, but illustrates the project's `Link` vs `<a>` split).

**Pattern:**
- External links use plain `<a href="..." target="_blank" rel="noopener noreferrer">`.
- Internal links use `next/link`'s `<Link href="...">`.
- Registry cards are external -> use `<a>`, never `<Link>`.

**Accessibility add (UI-SPEC §Accessibility Contract, not present in Things-To-Do):** every card `<a>` must carry `aria-label="Visit ${title} registry (opens in new tab)"`.

---

### Reduced-motion handling

**Source:** `app/globals.css` lines 613–621 (already in project)

```css
@media (prefers-reduced-motion: reduce) {
  .hero-reveal-label, .hero-reveal-title, .hero-reveal-subtitle,
  .reveal-on-scroll, .reveal-on-scroll-stagger > *, .gallery-grid > *,
  .parallax-bg, .hero-parallax-bg, /* ... */
}
```

**Apply to:** Nothing new in the page file — the global rule already disables every motion class used by Registry. UI-SPEC §Hero Spec confirms: "no extra handling needed."

---

### Layout chrome (passive)

**Source:** `app/(main)/layout.tsx` lines 11–23 — `Navbar` + `Footer` + `MusicButton` + skip-link wrap every `(main)` route automatically.

**Apply to:** Nothing — placement of the new page at `app/(main)/registry/page.tsx` inherits this for free. Do NOT add `pt-20` to `<main>` (RESEARCH Pitfall under Hero Spec; FAQ uses `pt-20` only because it lacks a full-bleed hero, Registry has one).

---

## No Analog Found

| File | Reason |
|------|--------|
| (none) | Every pattern needed by Registry has an exact or near-exact analog in `(main)/things-to-do`, `(main)/travel`, or `(main)/faq`. |

The framing block has no direct codebase analog (Things-To-Do does not have one), but its construction is a trivial composition of standard tokens (`max-w-2xl mx-auto text-center`, `text-on-surface-variant text-lg font-light leading-relaxed`, `reveal-on-scroll`) — no greenfield surface.

---

## Metadata

**Analog search scope:** `app/(main)/` (six routes: page.tsx, layout.tsx, faq, itinerary, things-to-do, travel, rsvp), `components/`, `app/globals.css`.
**Files scanned:** 7 (4 read in full for excerpt extraction, 3 surveyed by path).
**Pattern extraction date:** 2026-05-29
**Validity:** Until the design system or Stitch token set changes. The Things-To-Do analog is the most recently modified comparable page; preferring it over FAQ/Travel for the card-grid pattern is the correct call.
