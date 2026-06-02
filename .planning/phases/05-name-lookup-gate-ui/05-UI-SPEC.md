---
phase: 5
slug: name-lookup-gate-ui
status: draft
shadcn_initialized: false
preset: none
created: 2026-06-01
reviewed_at: ~
---

# Phase 5 — UI Design Contract

> Visual and interaction contract for the Name-Lookup Gate UI phase. Phase 5 revamps `app/(main)/rsvp/page.tsx` into a three-stage controlled flow (`lookup | form | success`). This contract EXTENDS Phase 1's design contract — all tokens, spacing, typography, and color rules carry forward unchanged. Phase 5 adds exactly one new thing: the `"miss"` `errorKind` variant (neutral palette). No other token changes.

**Source documents:** 05-CONTEXT.md (D-01..D-06, L-01..L-07, F-01..F-05, Discretion), 01-UI-SPEC.md (base contract), app/(main)/rsvp/page.tsx (visual baseline), app/globals.css (token set).

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (manual Tailwind v4 `@theme` tokens) |
| Preset | not applicable |
| Component library | none (native HTML + Tailwind utility classes) |
| Icon library | Material Symbols Outlined (loaded in `app/layout.tsx`) |
| Font | Noto Serif (`font-headline`) + Manrope (`font-body` / `font-label`) |

**Source of truth:** `app/globals.css` `@theme` block. No new color, font, radius, or spacing tokens introduced in this phase. Phase 5 is a pure extension of Phase 1's contract.

---

## Spacing Scale

Carry-forward from Phase 1. No new tokens. Phase 5 additions noted.

| Token | Value | Usage in this phase |
|-------|-------|---------------------|
| xs | 4px (`gap-1`) | Inline icon-to-text gap inside error/miss banners |
| sm | 8px (`mb-2`) | Label-to-input gap on lookup field |
| md | 16px (`p-4`) | Error/miss banner padding |
| lg | 24px (`mb-6`, `gap-6`) | Banner bottom margin (`mb-6`) before submit button |
| xl | 32px (`p-8`) | Form card mobile padding (carry-forward) |
| 2xl | 48px (`space-y-12`) | Between member rows on form scaffold; between form sections |
| 3xl | 64px (`p-16`, `gap-16`) | Form card tablet padding, grid gap |
| 4xl | 96px (`p-24`, `lg:gap-24`) | Form card desktop padding, two-column grid gap |

**Phase 5 specific vertical rhythm:**
- Lookup card interior: single field + button, `space-y-12` between eyebrow+input block and button block. The `lg:p-24` padding provides intentional generous whitespace — no extra interior spacing added.
- Form scaffold member rows: `space-y-12` between rows (matches v0.1 form-section rhythm per F-03).
- Form-stage heading `Your Group` sits at the top of the form card before member rows; `mb-12` below heading.

**Touch targets:** Lookup submit button `py-6` (~64px total height, exceeds 44px iOS minimum). Carry-forward from Phase 1.

**Exceptions:** none beyond Phase 1 exceptions (tracking values `[0.3em]` / `[0.4em]` / `widest` on labels).

---

## Typography

Carry-forward from Phase 1. No new sizes or weights. Phase 5 applies existing roles to new elements.

| Role | Class | Size | Weight | Line Height | Phase 5 Use |
|------|-------|------|--------|-------------|-------------|
| Display | `font-headline text-6xl md:text-8xl` | 60/96px | 400 | `leading-[1.1]` | "Kindly Respond" — left column, unchanged across all stages |
| Form-stage heading | `font-headline text-4xl md:text-5xl` | 36/48px | 400 | `leading-relaxed` | "Your Group" — top of form card on stage transition |
| Member name headline | `font-headline text-2xl` | 24px | 400 | `leading-relaxed` | Per-member `full_name` display (F-03) |
| Body | `font-body text-lg` | 18px | 400 | `leading-relaxed` | Left-column intro paragraph, miss/error banner body |
| Body small | `font-body text-sm` | 14px | 400 / 500 (heading) | default (~1.5) | Banner heading (500), banner body (400) |
| Form input | `font-body` (inherits `text-base`) | 16px | 400 | default | Lookup name input; dietary textarea in scaffold |
| Label (eyebrow) | `font-label text-[11px] uppercase tracking-widest` | 11px | 400 + `opacity-80` | default | "Your Full Name" above lookup input; per-member control labels on scaffold |
| Label (CTA) | `font-label text-sm uppercase tracking-[0.4em] font-bold` | 14px | 700 | default | Lookup submit button; form-stage disabled submit button |
| Label (radio) | `font-label text-xs uppercase tracking-wider` | 12px | 400 | default | Attending Y/N radio labels in member rows |
| Eyebrow (hero) | `font-label text-xs uppercase tracking-[0.3em] font-semibold` | 12px | 600 | default | "Join Us in Aspen" — left column, unchanged |

**16px input rule:** Lookup `<input>` must render at minimum 16px on mobile (inherits `text-base`). Prevents iOS Safari zoom-on-focus.

---

## Color

Carry-forward from Phase 1. The ONLY Phase 5 addition is the `"miss"` errorKind variant which uses neutral palette tokens already defined in `globals.css`.

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Dominant (60%) | `bg-background` / `text-on-surface` | `#0d1b1e` / `#e2e8e4` | Page background, body text |
| Secondary (30%) | `bg-surface-container-lowest` / `bg-surface-container-low` | `#0d1b1e` / `#122023` | Form card surface, input field surface |
| Accent (10%) | `text-primary` / `bg-primary` | `#d4a373` | See reserved list below |
| Destructive | `text-error` / `bg-error/10` / `border-error/20` | `#f87171` | `network`, `server`, `validation` error banners only |
| Miss (neutral) | `text-on-surface-variant` / `bg-surface-container-low` / `border-white/10` | `#a0ada9` / `#122023` | `"miss"` errorKind banner only — NOT destructive palette |
| Muted | `text-on-surface-variant` | `#a0ada9` | Placeholder text (at `/40`), radio labels idle, miss banner text |
| Border (hairline) | `border-white/10` | `rgba(255,255,255,0.1)` | Input bottom borders idle, form card outline (`border-white/5`), miss banner border |
| Border (focus) | `border-primary` | `#d4a373` | Lookup input bottom border on `:focus` |

**Accent reserved for (Phase 1 list + Phase 5 additions):**

Carry-forward (1–10 from Phase 1):
1. "Join Us in Aspen" eyebrow label — left column
2. Italic "Respond" inside hero headline — left column
3. Bolded "September 1st" in intro paragraph — left column
4. All field labels (eyebrow style) at `opacity-80` — lookup label "Your Full Name"; scaffold member control labels
5. Active radio input fill (`text-primary`)
6. Input bottom border on `:focus`
7. Submit button background `bg-primary` (idle/enabled state)
8. "favorite" heart icon on success page (Phase 6 renders)
9. Italic quote heading at bottom of page
10. `format_quote` decorative icon

Phase 5 additions:
11. Lookup-stage submit button background `bg-primary` (idle) — "Find My Invitation"
12. Form-stage submit button background `bg-primary` when enabled (Phase 6 enables; button exists here as `disabled`)

**Miss banner palette (new in Phase 5):**
- Background: `bg-surface-container-low` (`#122023`)
- Border: `border-white/10`
- Heading text: `text-on-surface-variant` at standard weight
- Body text: `text-on-surface-variant/80`
- "Try again" button inside banner: `font-label text-xs uppercase tracking-wider text-on-surface-variant underline underline-offset-2`
- Icon: `info` Material Symbol, `text-on-surface-variant`, `aria-hidden="true"`

**No accent on:** miss banner text, miss banner border, miss banner try-again button.

**Destructive use:** `network`, `server`, and `validation` errorKind banners only. Uses `text-error` + `bg-error/10` + `border-error/20`. Same as Phase 1.

**Button hover-state palette swap:** `bg-primary` -> `bg-white` over 500ms. Button text `text-on-primary` (`#1a1c1e`) reads correctly against both. Applies to lookup submit button. Form-stage submit button is `disabled` in Phase 5 — hover state does not apply (`disabled:opacity-60 disabled:cursor-not-allowed`).

---

## Copywriting Contract

Voice: warm, personal, a wedding — not a SaaS product. Human verbs. Real names implied. No corporate language.

### Lookup Stage

| Element | Copy | Source |
|---------|------|--------|
| Page eyebrow (left col) | `Join Us in Aspen` | Phase 1 carry-forward |
| Page headline (left col) | `Kindly Respond` (italic + accent on "Respond") | Phase 1 carry-forward |
| Intro paragraph (left col) | `We look forward to celebrating this new chapter with our closest family and friends. Please confirm your attendance by **September 1st**.` | Phase 1 carry-forward |
| Field eyebrow label | `Your Full Name` | CONTEXT.md Discretion |
| Lookup input placeholder | `E.g. Tyler Straffon` | CONTEXT.md L-07 |
| Submit button (idle) | `Find My Invitation` | CONTEXT.md L-06 |
| Submit button (searching) | `Searching…` | CONTEXT.md L-06 |

### Error / Miss Banners (lookup stage)

All banners render in the same slot above the submit button. Icon + heading + body pattern. `role="alert"`, `aria-live="assertive"`.

| errorKind | Icon | Heading | Body |
|-----------|------|---------|------|
| `"network"` | `error` | `We couldn't search the list` | `Check your connection and try again. Still stuck? Email us at hello@emilyandtyler.com.` |
| `"server"` | `error` | `Something went wrong on our end` | `Try again in a minute. If it keeps happening, email us at hello@emilyandtyler.com and we'll sort it out.` |
| `"validation"` | `error` | `Something didn't look right` | `Try again — make sure you entered your full name.` |
| `"miss"` | `info` | `We couldn't find you on the list` | `Double-check the spelling, or reach out to hello@emilyandtyler.com and we'll sort it out.` + inline `Try again` button |

**`"miss"` banner additional detail:**
- Uses neutral palette (see Color section) — NOT the destructive error palette.
- A `Try again` button inside the banner body clears `lookupName`, clears `errorKind`, and refocuses the lookup input.
- `Try again` button renders as: `font-label text-xs uppercase tracking-wider text-on-surface-variant underline underline-offset-2 ml-1`.
- Support email link: `<a href="mailto:hello@emilyandtyler.com" class="underline underline-offset-2">hello@emilyandtyler.com</a>` — no accent color.

**`"network"` and `"server"` copy note:** Heading text swapped from Phase 1's "We couldn't send your RSVP" to "We couldn't search the list" / "Something went wrong on our end" to match the lookup context. Body email fallback preserved verbatim. (CONTEXT.md Discretion)

### Form Stage

| Element | Copy | Source |
|---------|------|--------|
| Form card heading | `Your Group` | CONTEXT.md Discretion |
| Member name treatment | Display-only: `full_name` from lookup response — no copy to define | CONTEXT.md F-03 |
| Attending label | `Will you be attending?` | Phase 1 carry-forward (adapted per-member) |
| Attending yes option | `Yes` | Phase 6 will confirm final label; scaffold uses `Yes` |
| Attending no option | `No` | Phase 6 will confirm final label; scaffold uses `No` |
| Meal label | `Meal Choice` | Scaffold label; Phase 6 replaces option copy |
| Meal options | `Option A` / `Option B` / `Option C` | Deliberate TODO placeholders per F-02 |
| Dietary label | `Dietary Restrictions` | Phase 1 carry-forward |
| Dietary placeholder | `Gluten-free, Vegan, Allergies...` | Phase 1 carry-forward |
| Submit button (disabled) | `Confirm Group RSVP` | CONTEXT.md F-01, Discretion |
| Success placeholder | `{/* Phase 6: success view + edit-response link (GROUP-03) */}` | Code comment only — no visible copy in Phase 5 |

### Empty State

Not applicable. No list views, no "no data" conditions in Phase 5. The lookup stage IS the entry point; it is never empty from the user's perspective.

### Destructive Actions

None in Phase 5. RSVP is a write-only flow at this stage. The disabled submit button is not a destructive action. No confirmations required.

---

## Layout & Responsive Spec

Carry-forward from Phase 1 verbatim. No structural changes.

### Desktop (≥1024px)

- Two-column grid: `lg:grid-cols-12`, editorial left `lg:col-span-5` (sticky `top-40`), form card right `lg:col-span-7`.
- Outer container: `max-w-screen-2xl mx-auto px-8 md:px-12`.
- Column gap: `lg:gap-24` (96px).
- Form card interior padding: `lg:p-24` (96px).
- Page top padding: `pt-32` (128px).

### Tablet (768–1023px)

- Single column; editorial stacks above form.
- Form card padding: `md:p-16` (64px).
- Column gap: `gap-16`.

### Mobile (<768px)

- Single column.
- Outer container: `px-8` (32px).
- Form card padding: `p-8` (32px).
- Member rows: `space-y-12` (48px between rows).

### Left Column (all stages)

The editorial left column `lg:col-span-5 lg:sticky lg:top-40` is identical across `lookup`, `form`, and `success` stages per D-05. Copy verbatim from `app/(main)/rsvp/page.tsx:165-190`.

### Right Column (per-stage content swap)

The form card chrome (`lg:col-span-7 bg-surface-container-lowest p-8 md:p-16 lg:p-24 shadow-2xl border border-white/5`) stays constant. Only inner content changes per stage.

| Stage | Right column inner content |
|-------|---------------------------|
| `lookup` | Field eyebrow + input + banner slot + submit button |
| `form` | "Your Group" heading + `submissions.map(...)` member rows + disabled submit button |
| `success` | Phase 6 owns entirely — Phase 5 renders comment placeholder only |

### Form scaffold member row layout

Each member row (`submissions[i]`):
```
[warm-gold eyebrow: "Guest N" or member number for context]
[font-headline text-2xl: full_name — display only]
[space-y-4 block]
  [Will you be attending? label]
  [flex gap-6: Yes radio | No radio]
  [Meal Choice label + <select> (3 placeholder options)]
  [Dietary Restrictions label + <input>]
```

`space-y-12` between each member row container.

---

## Interaction Patterns

### Stage Machine

```
lookup --[hit]--> form --[submit (Phase 6)]--> success
lookup --[miss]--> lookup (banner appears, input cleared, refocused)
lookup --[network/server/validation]--> lookup (banner appears)
```

Stage is local `useState` — no URL changes, no routing (D-01).

### Lookup Stage Interactions

**Input focus on mount:** `autoFocus` on the lookup `<input>`. Cursor lands in the name field immediately on page load (L-04).

**Submit flow (L-05):**
1. `e.preventDefault()`
2. `setErrorKind(null)`
3. Trim + non-empty client check; if empty set `errorKind: "validation"` and stop
4. `setIsSearching(true)`, button shows `Searching…` + `disabled`
5. `fetch("/api/rsvp/lookup", { method: "POST", body: JSON.stringify({ name: form.lookupName }) })`
6. Response branches:
   - `{ found: true }` → hydrate `household` + `submissions`, set `stage: "form"`, move focus to form-stage heading ref
   - `{ found: false }` → `setErrorKind("miss")`, clear `lookupName`, stay on `lookup`
   - HTTP 4xx → `setErrorKind("validation")`
   - HTTP 5xx → `setErrorKind("server")`
   - Caught exception → `setErrorKind("network")`
7. `setIsSearching(false)` in all branches

**Miss "Try again" button:** Clears `lookupName` to `""`, clears `errorKind` to `null`, calls `lookupInputRef.current?.focus()`. Renders inside the miss banner.

**`submissions` hydration on hit:** Performed inline in the response handler (NOT in `useEffect`). Single `setForm` call sets `stage`, `household`, AND `submissions` simultaneously:
```ts
submissions: response.members.map((m) => ({
  guest_id: m.guest_id,
  full_name: m.full_name,
  attending: null,
  meal_choice: null,
  dietary_restrictions: "",
}))
```

### Form Stage Interactions (scaffold only — Phase 6 wires)

**Member rows:** Rendered via `submissions.map(...)`. Controls are visually rendered. `onChange` handlers may be no-ops or trivially set `submissions[i].attending` if the wiring is trivial; Phase 6 takes ownership of all validation and submit logic.

**Attending radios:** `<input type="radio">` pairs per member. No-op or lightweight `onChange` in Phase 5.

**Meal `<select>`:** Three `<option>` elements: `Option A`, `Option B`, `Option C`. No `onChange` logic in Phase 5.

**Dietary `<input>`:** `type="text"`, same hairline-border styling as lookup input. No-op in Phase 5.

**Submit button:** `disabled={true}`, `aria-disabled="true"`, copy `Confirm Group RSVP`. Rendered at full width with same button styling but at `opacity-60 cursor-not-allowed`. No submit handler in Phase 5.

### Field Focus Styling (carry-forward)

- Idle: `border-b border-white/10`
- Focus: `border-primary` over 300ms
- `focus:ring-0` (bottom border color change provides sufficient WCAG 2.4.7 focus indication at ~5.5:1)

### Hover / Motion (carry-forward + stage transition)

- Submit button: `bg-primary -> bg-white` over 500ms; arrow `translate-x-2` on `group-hover`
- Stage transition (lookup → form): member rows use `reveal-on-scroll` class from `globals.css` for a light `fade-slide-up` entrance. This is the existing scroll-driven utility — no new motion utilities introduced (CONTEXT.md Discretion).
- `prefers-reduced-motion: reduce` is already handled in `globals.css` — `reveal-on-scroll` animations are disabled automatically.

---

## Accessibility Contract

Carry-forward from Phase 1 with Phase 5 additions.

| Requirement | Implementation |
|-------------|----------------|
| Form has accessible name | `<form aria-labelledby="rsvp-heading">` referencing the "Kindly Respond" `<h1 id="rsvp-heading">` — unchanged across stages (D-05) |
| Lookup input labeled | `<label htmlFor="rsvp-lookup-name">` with `id="rsvp-lookup-name"` on input |
| Lookup input required | `aria-required="true"` |
| autoFocus on mount | `autoFocus` on lookup `<input>` (L-04) |
| Error/miss banners announced | `role="alert"` + `aria-live="assertive"` on banner container |
| Banner focus on error | `useEffect` + `ref.current?.focus()` on `errorBannerRef` when `errorKind` changes from null to a value |
| Try-again refocuses input | Miss banner "Try again" button calls `lookupInputRef.current?.focus()` |
| Stage transition focus | On hit (`lookup → form`): `useEffect` moves focus to form-stage heading ref (`formHeadingRef.current?.focus()`). `tabIndex={-1}` on the heading element. |
| Form aria-busy during search | `aria-busy={isSearching}` on the `<form>` element |
| Disabled submit on form stage | `disabled={true}` + `aria-disabled="true"` on form-stage submit |
| Decorative icons | All Material Symbols decorations get `aria-hidden="true"` |
| Member rows keyboard order | Per-member: name (display) → Yes radio → No radio → meal select → dietary input → next member |
| Scaffold radios | Attending radios use native `<input type="radio">` with `name` namespaced per member (e.g., `name="attending-{guest_id}"`) so arrow-key navigation is scoped to each member's pair |
| Color contrast | All Phase 1 contrast ratios apply. Miss banner: `#a0ada9` on `#122023` measures ~4.6:1 (passes AA for large text; body copy at 14px is borderline — use `text-sm` at minimum and increase weight to 500 for heading to push above AA for normal text) |

**Miss banner contrast note:** `text-on-surface-variant` (`#a0ada9`) on `bg-surface-container-low` (`#122023`) is approximately 4.6:1. This passes AA for large text (18px+ or 14px bold). For the miss banner heading, apply `font-medium` (500) to push it above the 4.5:1 AA threshold for normal text. Body text at `text-sm` (14px) at weight 400 sits at the borderline — if the checker flags it, switch to `text-on-surface` (`#e2e8e4`) for body lines.

---

## Component Inventory (Reuse Map)

| Component / Pattern | Source | Phase 5 Role |
|--------------------|--------|-------------|
| Two-column grid | `rsvp/page.tsx:163` | Copy verbatim |
| Editorial left column | `rsvp/page.tsx:165-190` | Unchanged across all stages |
| Form card chrome | `rsvp/page.tsx:193` | Unchanged; inner content swaps per stage |
| Error banner pattern | `rsvp/page.tsx:404-429` | Extend with `"miss"` variant (neutral palette) |
| Submit button styling | `rsvp/page.tsx:430-444` | Reuse verbatim for lookup button; reuse with `disabled` on form-stage |
| Input hairline-border styling | `rsvp/page.tsx:223` class string | Apply to lookup name input |
| Focus-management pattern | `rsvp/page.tsx:89-92` | Extend for stage transitions and try-again |
| `noValidate` + manual validation | `rsvp/page.tsx:195` | Apply to lookup form (`noValidate`) |
| `reveal-on-scroll` | `globals.css` | Apply to form-stage member row container for entrance animation |
| Material Symbols `info` | CDN font | New icon for miss banner (already loaded font) |
| Navbar | `components/Navbar.tsx` | No changes (RSVP link already enabled at line 16) |
| Footer | `components/Footer.tsx` | No changes |

**No new components introduced.** Single `"use client"` page file per D-04. No subcomponent extraction.

---

## State Machine Contract

Phase 5 commits the full v0.2 FormState shape (D-02). Phase 6 builds against this exact type.

```ts
type Stage = "lookup" | "form" | "success";
type ErrorKind = "network" | "server" | "validation" | "miss";

type Submission = {
  guest_id: string;
  full_name: string;
  attending: "yes" | "no" | null;
  meal_choice: string | null;
  dietary_restrictions: string;
};

type FormState = {
  stage: Stage;
  lookupName: string;
  household: { id: string; members: { guest_id: string; full_name: string }[] } | null;
  submissions: Submission[];
  errorKind: ErrorKind | null;
};
```

Initial state:
```ts
{
  stage: "lookup",
  lookupName: "",
  household: null,
  submissions: [],
  errorKind: null,
}
```

**Phase 5 does NOT transition to `"success"`.** The `if (stage === "success")` branch renders a comment placeholder only.

---

## Phase Boundary (explicit out-of-scope)

The following are explicitly Phase 6 responsibilities. Phase 5 must not implement them:

- Attending Y/N `onChange` handlers with state updates
- Conditional show/hide of meal dropdown per attending value
- Meal option copy (replace `Option A/B/C`)
- Submit handler for the group form
- Submit-side error handling (new `errorKind` variants for submit failures)
- Success view UI
- Edit-response link (GROUP-03)
- Client-side validation on form stage

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not applicable (no shadcn) |
| Third-party | none | not applicable |

No external component imports. No registry installs. Implementation uses native HTML + Tailwind utilities exclusively, identical to Phase 1.

---

## Acceptance Criteria (Implementation Phase Must Hit)

### Functional

- [ ] `/rsvp` renders a single name field (no full form) on initial load.
- [ ] Submitting a name found in `guests` transitions to `stage: "form"` with member rows rendered for every household member.
- [ ] Submitting a name not found shows the miss banner (neutral palette) with support email and "Try again" button, without page reload.
- [ ] "Try again" clears the input and refocuses it.
- [ ] Network failure renders the `network` errorKind banner.
- [ ] Server 5xx renders the `server` errorKind banner.
- [ ] Empty submit renders the `validation` errorKind banner (client-side gate before fetch).
- [ ] Form-stage submit button is `disabled` with copy `Confirm Group RSVP`.
- [ ] FormState type matches D-02 exactly — `Stage`, `ErrorKind`, `Submission`, `FormState` types are all declared.
- [ ] `submissions` are hydrated inline from the lookup response (not in `useEffect`).

### Visual

- [ ] All Phase 1 design tokens preserved — no new colors, fonts, or radii.
- [ ] Miss banner uses neutral palette (`bg-surface-container-low`, `border-white/10`, `text-on-surface-variant`) — NOT the error palette.
- [ ] Error banners (`network`, `server`, `validation`) use the Phase 1 destructive palette.
- [ ] Member names render in `font-headline text-2xl`.
- [ ] Meal selects show exactly `Option A`, `Option B`, `Option C` as placeholder options.
- [ ] Left column is pixel-identical across `lookup` and `form` stages.
- [ ] Form card chrome (`bg-surface-container-lowest p-8 md:p-16 lg:p-24 shadow-2xl border border-white/5`) is unchanged between stages.
- [ ] Member rows use `space-y-12` vertical rhythm.

### Copy

- [ ] Lookup submit button idle: `Find My Invitation`.
- [ ] Lookup submit button searching: `Searching…`.
- [ ] Miss banner heading: `We couldn't find you on the list`.
- [ ] Miss banner body: `Double-check the spelling, or reach out to hello@emilyandtyler.com and we'll sort it out.` + `Try again` button.
- [ ] Network error heading: `We couldn't search the list`.
- [ ] Server error heading: `Something went wrong on our end`.
- [ ] Validation error heading: `Something didn't look right`.
- [ ] Form stage heading: `Your Group`.
- [ ] Form stage submit: `Confirm Group RSVP`.
- [ ] Meal select options: `Option A` / `Option B` / `Option C` (verbatim).

### Interaction

- [ ] Lookup input has `autoFocus` — cursor lands there on page load.
- [ ] Lookup input has `autoComplete="name"`, `type="text"`, `placeholder="E.g. Tyler Straffon"`.
- [ ] On hit, focus moves to the form-stage heading (`tabIndex={-1}`, `ref.current?.focus()`).
- [ ] On any errorKind set, focus moves to the error banner heading (`tabIndex={-1}`, `ref.current?.focus()`).
- [ ] Miss "Try again" moves focus back to lookup input.
- [ ] `aria-busy` on form during search.
- [ ] `aria-disabled="true"` on form-stage disabled submit.
- [ ] All decorative Material Symbols have `aria-hidden="true"`.
- [ ] Member attending radios namespaced per member to prevent cross-member arrow-key bleed.
- [ ] `hero-fade-up` keyframe applied via inline `animation` style on form-stage member rows with per-row stagger delay (see RESEARCH Q6 — `reveal-on-scroll` cannot fire on elements that mount already in viewport); honors `prefers-reduced-motion` via `globals.css` global rule.

### Testing

Manual smoke checklist (no test framework installed per Phase 3 pattern):

1. Load `/rsvp` — confirm single name field, no form visible.
2. Submit empty input — confirm `validation` banner appears, input refocused.
3. Submit a name not on the list — confirm `miss` banner (neutral colors), "Try again" clears input and refocuses.
4. Submit a known guest name (e.g., `Tyler Straffon`) — confirm form scaffold appears with correct household members.
5. Verify form-stage submit button shows `Confirm Group RSVP` and is disabled.
6. Verify meal selects show `Option A / B / C`.
7. Toggle network offline in devtools, submit — confirm `network` banner.
8. Mobile viewport at 375px — form fits viewport, no horizontal scroll.

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
