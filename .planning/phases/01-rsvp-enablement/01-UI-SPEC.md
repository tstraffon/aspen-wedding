---
phase: 1
slug: rsvp-enablement
status: approved
shadcn_initialized: false
preset: none
created: 2026-05-28
reviewed_at: 2026-05-28
---

# Phase 1 — UI Design Contract

> Visual and interaction contract for the RSVP enablement phase. Polish + enable, not a rebuild. The existing `app/(main)/rsvp/page.tsx` form is the visual baseline; this contract codifies every state, copy element, and accessibility requirement the implementation must hit.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (manual Tailwind v4 `@theme` tokens) |
| Preset | not applicable |
| Component library | none (native HTML + Tailwind utility classes) |
| Icon library | Material Symbols Outlined (loaded in `app/layout.tsx`) |
| Font | Noto Serif (headlines, `font-headline`) + Manrope (body and labels, `font-body` / `font-label`) |

**Source of truth:** `app/globals.css` `@theme` block. Do not introduce new color, font, or radius tokens. Do not import a UI component library. Match the existing editorial alpine aesthetic established by `/`, `/travel`, `/itinerary`, `/things-to-do`, and `/faq`.

**Important visual note:** PROJECT.md describes the theme as "deep forest green primary, snow white surface," but the shipped `globals.css` uses **warm gold/copper primary (`#d4a373`) on dark teal surfaces (`#0d1b1e`)** — a darker, evening-mountain palette. This contract follows the shipped tokens. If a re-theme is desired, that is a separate phase.

---

## Spacing Scale

Declared values (multiples of 4, Tailwind defaults):

| Token | Value | Usage in this phase |
|-------|-------|---------------------|
| xs | 4px (`gap-1`, `mt-1`) | Inline icon-to-text gap inside the error banner |
| sm | 8px (`mb-2`, `gap-2`) | Label-to-input gap, radio icon gap |
| md | 16px (`p-4`, `gap-4`) | Error banner padding, mobile field padding |
| lg | 24px (`mb-6`, `gap-6`, `space-x-6`) | Radio group horizontal gap on desktop, success-page bottom margin |
| xl | 32px (`p-8`, `gap-8`, `space-y-8`) | Grid gap between Name/Email columns, form section padding (mobile) |
| 2xl | 48px (`px-12`, `gap-12`, `mb-12`) | Editorial column padding (desktop), CTA-deadline gap |
| 3xl | 64px (`p-16`, `gap-16`, `mt-16`) | Form card padding (tablet), two-column grid gap |
| 4xl | 96px (`p-24`, `lg:gap-24`) | Form card padding (desktop), two-column grid gap (desktop) |

**Form-specific vertical rhythm:** `space-y-12` (48px) between form sections (Identity / Attendance / Guest Details / Note / Submit). This is the editorial breathing room and must be preserved.

**Touch targets:** Submit button vertical padding `py-6` (24px) — total height ~64px, exceeds the 44px iOS minimum. Radio inputs are `w-4 h-4` (16px), but the surrounding `<label>` is the full click target with `space-x-3` padding, keeping the touchable area >44px tall.

**Exceptions:**
- Material Symbols `text-[11px]` and `tracking-[0.3em]` / `tracking-[0.4em]` letter-spacing for editorial labels — existing Stitch convention, preserve.
- Hero label uses `tracking-[0.3em]`, submit button uses `tracking-[0.4em]` — preserve both.

---

## Typography

Existing Stitch type system (do not introduce new sizes):

| Role | Class | Size | Weight | Line Height | Use |
|------|-------|------|--------|-------------|-----|
| Display | `font-headline text-6xl md:text-8xl` | 60 / 96px | 400 (regular) | `leading-[1.1]` | "Kindly Respond" hero on form, "Thank You" on success |
| Section heading | `font-headline text-3xl md:text-5xl` | 30 / 48px | 400 italic | `leading-relaxed` | Quote section at bottom |
| Body | `font-body text-lg` | 18px | 400 | `leading-relaxed` (~1.625) | Hero intro paragraph, success body |
| Body small | `font-body text-sm` | 14px | 400 (or 500 for error heading) | default (~1.5) | Error banner copy |
| Form input | `font-body` (inherits `text-base`) | 16px | 400 | default | All `<input>`, `<select>`, `<textarea>` values |
| Label (eyebrow) | `font-label text-[11px] uppercase tracking-widest` | 11px | 400 + `opacity-80` | default | Field labels above each input |
| Label (CTA) | `font-label text-sm uppercase tracking-[0.4em] font-bold` | 14px | 700 | default | Submit button text |
| Label (radio) | `font-label text-xs uppercase tracking-wider` | 12px | 400 | default | "Delightfully Accept" / "Regretfully Decline" |
| Eyebrow (hero) | `font-label text-xs uppercase tracking-[0.3em] font-semibold` | 12px | 600 | default | "Join Us in Aspen" above the hero headline |

**Weight policy:** Manrope 300/400/500/600/800 are all loaded in `layout.tsx`. The form uses 400 (default), 500 (error heading), 600 (eyebrow), 700 (submit CTA). Do not introduce 300 or 800 in this phase.

**16px input rule:** All form inputs must render at 16px minimum on mobile to prevent iOS Safari zoom-on-focus. The current implementation inherits `text-base` (16px) and is correct. Do not regress to `text-sm`.

---

## Color

**Palette (60 / 30 / 10):**

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Dominant (60%) | `bg-background` / `text-on-surface` | `#0d1b1e` / `#e2e8e4` | Page background, primary body text |
| Secondary (30%) | `bg-surface-container-lowest` / `bg-surface-container-low` | `#0d1b1e` / `#122023` | Form card surface, input field surface |
| Accent (10%) | `text-primary` / `bg-primary` | `#d4a373` (warm gold/copper) | See reserved list below |
| Destructive | `text-error` / `bg-error/10` / `border-error/20` | `#f87171` | Error banner only |
| Muted | `text-on-surface-variant` | `#a0ada9` | Body intro paragraph, placeholder text (at `/40` opacity), radio labels (idle) |
| Border (hairline) | `border-white/10` | `rgba(255,255,255,0.1)` | Input bottom borders (idle), form card outline (`border-white/5`) |
| Border (focus) | `border-primary` | `#d4a373` | Input bottom border on `:focus` |

**Accent reserved for (exact list — do not extend):**
1. The "Join Us in Aspen" eyebrow label above the hero headline
2. The italic word "Respond" inside the hero headline ("Kindly _Respond_")
3. The bolded "September 1st" deadline date in the intro paragraph
4. All field labels ("Full Name", "Email Address", "Will you be attending?", "Number of Guests", "Dietary Restrictions", "A Personal Note for the Couple") at `opacity-80`
5. The active radio input fill (`text-primary` on `<input type="radio">`)
6. The input bottom border on `:focus`
7. The submit button background `bg-primary` (idle state)
8. The "favorite" heart icon on the success page
9. The italic quote heading at the bottom of the page
10. The `format_quote` decorative icon next to the quote

**No accent on:** body paragraphs, idle field borders, placeholders, idle radio labels, success-page body text, error text.

**Destructive use (only one allowed in this phase):** the inline error banner shown above the submit button when `status === "error"`. Uses `text-error` + `bg-error/10` + `border-error/20`. Email fallback link inside the banner uses underline, not the accent color.

**Hover-state palette swap on submit:** `bg-primary` -> `bg-white` over 500ms is the existing pattern. Preserve. The button text remains `text-on-primary` (`#1a1c1e`) and reads correctly against both states.

---

## Copywriting Contract

All copy is in service of a warm, personal wedding voice — not a SaaS form. Tyler & Emily are real people, not "the couple." Avoid corporate words ("submit," "process," "confirmation email"). Prefer human verbs ("send," "share," "respond").

### Hero / Page Intro

| Element | Copy |
|---------|------|
| Eyebrow | `Join Us in Aspen` |
| Headline | `Kindly Respond` (with "Respond" italic + accent color) |
| Intro paragraph | `We look forward to celebrating this new chapter with our closest family and friends. Please confirm your attendance by **September 1st**.` |

### Field Labels (preserve exactly as shipped)

| Field | Label | Placeholder |
|-------|-------|-------------|
| Name | `Full Name` | `E.g. Julianne Moore` |
| Email | `Email Address` | `hello@example.com` |
| Attending | `Will you be attending?` | (radios — no placeholder) |
| Accept option | `Delightfully Accept` | — |
| Decline option | `Regretfully Decline` | — |
| Guests | `Number of Guests` | (select — "1 Guest" default) |
| Dietary | `Dietary Restrictions` | `Gluten-free, Vegan, Allergies...` |
| Note | `A Personal Note for the Couple` | If accepting: `Share a memory or a wish...` / If declining: `We'll miss you! Leave a note if you'd like...` |

### Validation Messaging (NEW — to add this phase)

Field-level error messages appear **inline below the offending field** in `text-error text-xs font-body` with a small `error` icon. Announced via `aria-describedby` + `role="alert"` on a live region.

| Field | Trigger | Message |
|-------|---------|---------|
| Full Name | Empty on submit | `We need your name to find your invitation.` |
| Email | Empty on submit | `Where should we reach you with details?` |
| Email | Invalid format | `That email doesn't look right — double-check the spelling.` |
| Attending | No radio selected on submit | `Let us know if you can make it.` |

Native `required` attributes are already in place; this phase upgrades the messaging from browser defaults to custom, warm copy via `onInvalid` handlers + a `formNoValidate` strategy (set `noValidate` on the `<form>`, run validation in `handleSubmit`, manage error state per field).

### Button States

| State | Label | Icon |
|-------|-------|------|
| Idle | `Submit Response` | `east` (arrow) |
| Submitting | `Sending…` | `east` (no spinner — keep editorial restraint; disable button + reduce opacity to 60%) |
| Disabled (during submit) | `Sending…` | same |

`aria-busy="true"` on the form during submission. Button gets `aria-disabled="true"`.

### Success State (already shipped — preserve)

| Element | Copy |
|---------|------|
| Icon | `favorite` (heart, `text-primary`, 64px) |
| Heading | `Thank You` |
| Body | `Your response has been received. We can't wait to celebrate with you in Aspen.` |

**Accept vs. Decline variant:** Currently the success copy is the same regardless of attending choice. This phase adds a small variant:

| Variant | Heading | Body |
|---------|---------|------|
| Accept | `Thank You` | `We can't wait to celebrate with you in Aspen. We'll send venue and timing details closer to the wedding.` |
| Decline | `Thank You` | `We'll miss you in Aspen, but thank you for letting us know. We're holding good thoughts for you.` |

### Error State (NEW — refine shipped copy)

The existing shipped error banner is good. Tighten the body copy and add a per-failure variant.

| Failure type | Heading | Body |
|--------------|---------|------|
| Network / fetch failed | `We couldn't send your RSVP` | `Check your connection and try again. Still stuck? Email us at hello@emilyandtyler.com.` |
| Server error (5xx) | `Something went wrong on our end` | `Try again in a minute. If it keeps happening, email us at hello@emilyandtyler.com and we'll add you manually.` |
| Validation error (4xx from API) | `One of your answers needs a tweak` | `Scroll up and check the highlighted field, then try again.` |

Banner uses `role="alert"` and `aria-live="assertive"`. On error, focus moves to the banner so screen readers announce immediately.

### Destructive Actions

**None in this phase.** RSVP is a single-write form. No deletion, no edit, no "are you sure" confirmations. Submission is reversible by emailing the couple — that path is communicated in the error fallback copy.

### Empty State

Not applicable. The form is the empty state; there is no list view, no "no results" condition.

---

## Layout & Responsive Spec

### Desktop (≥1024px / `lg:`)

- Two-column grid: `lg:grid-cols-12` with editorial left column at `lg:col-span-5` (sticky, `sticky top-40`) and form card right at `lg:col-span-7`.
- Outer container: `max-w-screen-2xl mx-auto px-12`.
- Column gap: `lg:gap-24` (96px).
- Form card interior padding: `lg:p-24` (96px).
- Page top padding: `pt-32` (128px) to clear the fixed nav.

### Tablet (768–1023px / `md:`)

- Single column (`grid-cols-1`), editorial section stacks above form.
- Outer container: `md:px-12`.
- Column gap: `gap-16` (64px between editorial and form).
- Form card interior padding: `md:p-16` (64px).

### Mobile (<768px)

- Single column.
- Outer container: `px-8` (32px) — preserve as shipped.
- Column gap: `gap-16` (64px).
- Form card interior padding: `p-8` (32px).
- Form sections stack with `space-y-12` (48px between sections).
- Radio group: `flex-col space-y-4` (16px between Accept and Decline) — vertical on mobile, `md:flex-row md:space-x-6` (24px) on tablet+.
- Identity grid (`Name` + `Email`) collapses to single column on mobile (`grid-cols-1 md:grid-cols-2`).
- Guest Details grid (`Guests` + `Dietary`) collapses to single column on mobile.

### Hero image (left column)

- Aspect ratio `aspect-[4/5]` (portrait), `rounded-lg` (8px radius), `ring-1 ring-white/10`.
- Image stays as the Maroon Bells reference, but **must be replaced with a real Tyler & Emily Aspen photo before launch** (note for executor — track as an asset task, not a code blocker).
- Gradient overlay: `bg-gradient-to-t from-background/60 to-transparent` for legibility against the editorial label.

### Quote section (bottom)

- `mt-48` (192px) top margin from the form — generous editorial pause.
- `pb-24` (96px) bottom padding before Footer.
- Centered `text-center`, `max-w-2xl`.
- `format_quote` icon positioned `-top-12 -left-16` with `opacity-60`. Decorative only; mark `aria-hidden="true"`.

---

## Interaction Patterns

### Field Focus

- Idle: `border-b border-white/10` (1px hairline bottom border, no top/left/right).
- Focus: `border-primary` over 300ms transition.
- `focus:ring-0` to remove the default browser outline ring (visual restraint), but **only because the bottom border color change is sufficient and is `#d4a373` against `#122023` at ~5.5:1 contrast**. This satisfies WCAG 2.4.7 focus visible.

### Radio Group

- 16px circle (`w-4 h-4`), `text-primary` for selected fill, `border-white/20` for unselected ring.
- Hover: surrounding label text shifts from `text-on-surface-variant` to `text-primary` over default transition.
- Keyboard: arrow keys move between radios within the group (native browser behavior). Tab moves into / out of the group as a single stop.

### Conditional Reveal

When `attending === "decline"`, hide the Guest Details section (number of guests + dietary). The note placeholder also swaps. **Use `aria-live="polite"` on the conditional section** so screen readers announce the change.

When `attending` is null or `"accept"`, show Guest Details. (Current implementation uses `form.attending !== "decline"` — keep.)

### Submit

- On `<form onSubmit>`, prevent default, set `status: "submitting"`, set `aria-busy="true"` on the form.
- On success, replace the entire `<main>` with the success state (current pattern). Focus moves to the success `<h1>` so screen readers announce arrival.
- On failure, show the error banner above the submit button, move focus to the banner heading.

### Hover Animations (preserve existing)

- Submit button: `bg-primary -> bg-white` over 500ms, arrow `translate-x-2` over default transition.
- Radio labels: color shift on hover.
- No new animations introduced in this phase. Respect `prefers-reduced-motion` — the global `globals.css` `@media (prefers-reduced-motion: reduce)` block already disables non-essential animations.

---

## Accessibility Contract

| Requirement | Implementation |
|-------------|----------------|
| Form has accessible name | `<form aria-labelledby="rsvp-heading">` referencing the `Kindly Respond` `<h1 id="rsvp-heading">` |
| All inputs labeled | Existing `<label>` elements; verify `htmlFor` is added (currently the labels are visually associated but missing `htmlFor`/`id` — fix in this phase) |
| Required field indication | Visual: none added (editorial restraint). Programmatic: `aria-required="true"` on Name, Email, Attending radios |
| Validation errors announced | `<div role="alert" aria-live="polite">` per field, populated only when error exists |
| Submit feedback announced | Form-level `<div role="status" aria-live="polite">` updates on submitting/success; error banner uses `role="alert" aria-live="assertive"` |
| Focus management on success | `useEffect` moves focus to success `<h1>` when `status === "success"` |
| Focus management on error | `useEffect` moves focus to error banner heading when `status === "error"` |
| Keyboard reachable | All interactive elements are native HTML — already keyboard accessible. Verify tab order: Name → Email → Accept radio → Decline radio → Guests → Dietary → Note → Submit |
| Color contrast | Primary `#d4a373` on `#122023` measures ~5.5:1 (passes AA for normal text and AAA for large text). Body `#e2e8e4` on `#0d1b1e` measures ~14:1. Error `#f87171` on `#0d1b1e` measures ~5.7:1. All pass. |
| Decorative icons | All Material Symbols decorations (`favorite`, `format_quote`, `east`) get `aria-hidden="true"` |
| Skip link | Out of scope — site-wide concern, handle in a later accessibility pass |

---

## Navbar Enablement

### Link Order

The shipped `components/Navbar.tsx` has commented-out entries. Final desktop order (left to right, after the E&T logo):

`Home` · `Travel & Stay` · `Itinerary` · `Things To Do` · `FAQ` · **`RSVP`** (new, last)

RSVP sits at the **end** of the desktop nav as a deliberate emphasis — the call to action. It receives the same `font-label text-[10px] uppercase tracking-[0.2em]` treatment as other links. **No special button styling, no accent color in idle state** — consistency with the editorial nav is more important than visual emphasis on this single link. The active state (when on `/rsvp`) uses `text-primary`, same as every other link.

The commented `Our Story` and `Registry` entries stay commented (out of scope this phase — Registry is Phase 2).

### Mobile Menu

Same order in the mobile dropdown. Each link is a full-width tap target via the existing `flex flex-col gap-5` layout. The RSVP link inherits the `text-xs uppercase tracking-[0.2em]` treatment.

### Active State Detection

The existing `pathname.startsWith(href)` logic in `Navbar.tsx` works for `/rsvp` without modification. `text-primary` applied when active, `text-on-surface-variant` otherwise.

### Removal of CTA Button Slot

The HTML comment `{/* RSVP button — re-enable when ready to collect responses */}` should be **deleted** in this phase — the link in the main nav list replaces it, no separate button slot needed.

---

## Component Inventory (Reuse Map)

| Component | Source | Reuse Notes |
|-----------|--------|-------------|
| `Navbar` | `components/Navbar.tsx` | Modify links array, no structural change |
| `Footer` | `components/Footer.tsx` | No change |
| Form inputs | Native `<input>`, `<select>`, `<textarea>` | Existing styling — preserve |
| Submit button | Native `<button>` | Existing styling — preserve |
| Error banner | Inline JSX in `rsvp/page.tsx` | Refine copy + add focus management |
| Success view | Inline JSX in `rsvp/page.tsx` | Add accept/decline variant + focus management |
| Material Symbols icons | CDN font in `app/layout.tsx` | Use existing tokens (`favorite`, `east`, `error`, `format_quote`) |

**No new components introduced this phase.** No extracted shared form components. The RSVP page remains self-contained.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not applicable (no shadcn) |
| Third-party | none | not applicable |

No external component imports, no registry installs, no `shadcn add` commands. Implementation uses native HTML + Tailwind utilities exclusively.

---

## Acceptance Criteria (Implementation Phase Must Hit)

The executor's work is complete only when all of the following are true:

### Functional

- [ ] Supabase `rsvps` table columns confirmed to match the form payload: `full_name TEXT`, `email TEXT`, `attending BOOLEAN`, `guest_count INTEGER`, `dietary_restrictions TEXT NULL`, `note TEXT NULL`, plus a `created_at TIMESTAMPTZ DEFAULT now()` audit column. If columns are missing or named differently, fix the schema (don't reshape the form).
- [ ] RLS policy on `rsvps` allows `INSERT` from the anon role with no `SELECT` exposure (write-only public access).
- [ ] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in `.env.local` and in the production deployment environment. `SUPABASE_SERVICE_ROLE_KEY` is **not** required for this phase — anon insert is the intended path.
- [ ] RSVP nav link is visible on both desktop and mobile menus in the final position (last item).
- [ ] Submitting a valid RSVP results in a row in the Supabase `rsvps` table and the user seeing the success view within 2 seconds on a typical connection.

### Visual

- [ ] All shipped Stitch tokens and existing form styling are preserved — no new colors, fonts, or radii introduced.
- [ ] Accent color appears only on the elements listed in the "Accent reserved for" section above.
- [ ] On mobile (<768px), the form fits the viewport with no horizontal scroll. Fields are full-width, padding is `p-8` (32px), section gaps are `space-y-12` (48px).
- [ ] On desktop (≥1024px), the editorial column is sticky and the form card sits to the right with `lg:gap-24` between them.

### Copy

- [ ] All copy in the "Copywriting Contract" section above is implemented verbatim.
- [ ] Success view has accept/decline variant copy (currently a single shared message).
- [ ] Error banner has the three failure-type variants (network, server, validation).

### Interaction

- [ ] Form sets `noValidate` and uses custom validation with per-field error messages from the validation contract above.
- [ ] Field errors appear inline below the offending field with `role="alert"`.
- [ ] On submit failure, focus moves to the error banner heading.
- [ ] On submit success, focus moves to the success `<h1>` ("Thank You").
- [ ] All Material Symbols decorative icons have `aria-hidden="true"`.
- [ ] All `<label>` elements have proper `htmlFor` matching input `id`.
- [ ] Inputs render at 16px+ on iOS Safari (no zoom-on-focus).
- [ ] Submit button is disabled and shows `Sending…` during the submit request.

### Testing

- [ ] At minimum: a manual smoke checklist documenting (1) happy-path accept submission, (2) happy-path decline submission, (3) network-error path (toggle network in devtools), (4) validation error path (submit empty form), (5) mobile viewport check at 375px width.
- [ ] Preferred: a Playwright or Vitest test covering the happy path — `POST /api/rsvp` returns 200 and writes a row.

### Out of Scope (explicit non-goals for this phase)

- Email confirmation to the guest after RSVP — deferred to a later phase.
- Admin dashboard for viewing RSVPs — use Supabase Studio.
- Per-guest invitation codes / magic link lookup — explicitly out of scope per PROJECT.md.
- Editing or deleting a submitted RSVP — guests email the couple instead.
- Replacement of the Maroon Bells stock photo with a real couple photo — track as an asset task, not a code blocker.

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
