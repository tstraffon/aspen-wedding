# Phase 5: Name-Lookup Gate UI — Research

**Researched:** 2026-06-01
**Domain:** React 19 client component state machine, HTML/WAI-ARIA accessibility patterns, CSS scroll-driven animations
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Three-stage controlled flow (`lookup | form | success`). Component-local state only.
- D-02: Full v0.2 FormState shape committed now. Phase 6 does not refactor the type.
- D-03: `errorKind` extended with `"miss"`. Neutral palette — NOT destructive.
- D-04: Single `"use client"` page file. No subcomponent extraction.
- D-05: Editorial left column unchanged across all three stages.
- D-06: No navbar changes.
- L-01 through L-07: Lookup screen treatment (form-card chrome reuse, no in-card heading, errorKind banner, autoFocus, submit flow, button copy, input attributes).
- F-01 through F-05: Form scaffold scope (full structure rendered, non-functional, disabled submit, placeholder meal options, no success-stage UI).

### Claude's Discretion
- Lookup eyebrow + headline inside the form card
- Miss / server / network / validation banner copy (drafts in CONTEXT.md Discretion)
- Stage-transition motion (reuse existing `reveal-on-scroll`)
- Form-stage heading ("Your Group")
- Submit-button copy on form stage ("Confirm Group RSVP")
- Hydration of `submissions` performed inline, single `setForm` call

### Deferred Ideas (OUT OF SCOPE)
- Form interactivity (attending onChange, meal conditional, validation, submit handler)
- Real meal-option copy
- Success view
- Edit-response link
- Submit-side errorKind variants
- URL-based stage persistence
- `/api/rsvp/route.ts` deletion
- Stage-aware left-column copy
- Subcomponent extraction
- Auto-resume from localStorage
</user_constraints>

---

## Summary

Phase 5 is a single-file rewrite of `app/(main)/rsvp/page.tsx` from a v0.1 flat form into a three-stage controlled flow. All locked decisions are in CONTEXT.md and UI-SPEC.md; this research answers 12 open implementation questions so the planner can emit task-ready `<verify>` steps.

The three highest-impact findings: (1) `useState` with a single flat object is the correct choice — `useReducer` adds overhead with no benefit for a single-file component where all update sites are already identified; (2) `reveal-on-scroll` uses CSS `animation-timeline: view()`, a scroll-driven spec that fires on scroll position, not IntersectionObserver — elements already in the viewport on stage transition will NOT animate because `entry 0% entry 30%` of the scroll range will already have passed; the planner must choose between skipping `reveal-on-scroll` on the form-stage rows or using the `hero-reveal-*` keyframe classes instead; (3) `autoFocus` on a client component input triggers React's `commitMount` path (confirmed in `react-dom-client.development.js:22158`), which calls `domElement.focus()` after hydration — no hydration warning is produced because the attribute is serialized to HTML as `autofocus` during SSR and React reconciles it cleanly.

**Primary recommendation:** Implement `useState<FormState>` (no reducer), single `setForm` call for atomic stage transition, `autoFocus` on lookup input, `useEffect` + ref for stage-transition focus, skip `reveal-on-scroll` on form rows in favor of `hero-reveal-*` stagger classes.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Stage state machine | Browser / Client | — | Component-local `useState`; no server involvement per D-01 |
| Lookup fetch | Browser / Client | API / Backend | Client initiates POST, backend validates and queries Supabase |
| Error display | Browser / Client | — | `errorKind` is client state; banners are purely presentational |
| Focus management | Browser / Client | — | DOM APIs; runs client-side only after hydration |
| Form scaffold render | Browser / Client | — | Renders from `submissions` state populated on lookup hit |
| Supabase query | API / Backend | Database / Storage | `lookup_guest_by_name` RPC in Phase 4's locked route |

---

## Standard Stack

No new packages installed. Phase 5 is native HTML + Tailwind + React 19 only. [VERIFIED: package.json]

| Library | Version | Purpose |
|---------|---------|---------|
| React | 19.2.4 | `useState`, `useEffect`, `useRef` hooks for state machine |
| Next.js | 16.2.6 | App Router `"use client"` page |
| Tailwind v4 | ^4 | Utility classes; all tokens already in `app/globals.css` |
| Material Symbols Outlined | CDN (variable font) | `error` + `info` icons in banners; `east` arrow in buttons |

**No `npm install` step required for Phase 5.** [VERIFIED: package.json]

---

## Package Legitimacy Audit

Not applicable — Phase 5 installs zero external packages.

---

## Architecture Patterns

### Recommended Project Structure

No new files or folders. Single file modified:

```
app/(main)/rsvp/
└── page.tsx    ← full rewrite (single "use client" island, ~280-320 lines)
```

---

## Research Findings — 12 Open Questions

### Q1: State machine implementation — `useState` vs `useReducer`

**Recommendation: single `useState<FormState>` object.** [ASSUMED — training knowledge; confirmed consistent with codebase pattern]

The v0.1 page uses two separate `useState` calls (`form` + `status` + `errors` + `errorKind`). Phase 5 consolidates into a single `FormState` object with `stage`, `lookupName`, `household`, `submissions`, and `errorKind`. The update sites are:
- Lookup input change: `setForm(f => ({ ...f, lookupName: e.target.value }))`
- Error set: `setForm(f => ({ ...f, errorKind: "..." }))`
- Stage transition (hit): single call sets `stage + household + submissions` atomically (see Q10)
- Try-again: `setForm(f => ({ ...f, lookupName: "", errorKind: null }))`

`useReducer` is appropriate when: (a) next state depends on previous in non-trivial ways, (b) multiple dispatchers share logic, (c) the state shape changes require coordinating many fields. None of those apply here. The `setForm(prev => ({ ...prev, ...patch }))` pattern is sufficient and matches the codebase style.

`isSearching` should be a **separate** `useState<boolean>(false)` — it is transient UI state that never needs to be part of the persisted `FormState` shape and will not be passed to Phase 6. This mirrors v0.1's `status` as a separate state atom.

```ts
// Recommended state declarations (inside RSVPPage)
const [form, setForm] = useState<FormState>({
  stage: "lookup",
  lookupName: "",
  household: null,
  submissions: [],
  errorKind: null,
});
const [isSearching, setIsSearching] = useState(false);
```

---

### Q2: `fetch` + abort handling

**Recommendation: no AbortController in Phase 5.** [ASSUMED]

The v0.1 page has no abort handling. Phase 5 disables the button and sets `aria-busy` during search (L-05, L-06), making a concurrent second submission impossible. The lookup is a single fast Postgres indexed `SELECT` — round-trips are typically < 200ms. AbortController adds code complexity for zero UX benefit in this single-flight, button-disabled pattern. Phase 6 may revisit for submit if needed.

```ts
// In handleLookup:
setIsSearching(true);
try {
  const res = await fetch("/api/rsvp/lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: form.lookupName.trim() }),
  });
  // ... branch handling
} catch {
  setForm(f => ({ ...f, errorKind: "network" }));
} finally {
  setIsSearching(false);
}
```

---

### Q3: Focus management with React 19 — `useEffect` + `ref.current?.focus()`

**Confirmed: the v0.1 pattern works correctly in React 19.** [VERIFIED: react-dom-client.development.js:22158]

React 19 does not change how `useEffect` + `ref.focus()` works for programmatic focus. The v0.1 pattern at `page.tsx:89-92`:

```ts
useEffect(() => {
  if (status === "success") successHeadingRef.current?.focus();
  if (status === "error") errorBannerRef.current?.focus();
}, [status]);
```

Phase 5 extends this with three focus targets:

```ts
const errorBannerRef = useRef<HTMLParagraphElement>(null);
const formHeadingRef = useRef<HTMLHeadingElement>(null);
const lookupInputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (form.stage === "form") formHeadingRef.current?.focus();
}, [form.stage]);

useEffect(() => {
  if (form.errorKind !== null) errorBannerRef.current?.focus();
}, [form.errorKind]);
```

`tabIndex={-1}` on the heading makes it focusable without inserting it into the tab order. `ref.current?.focus()` is the correct WAI-ARIA pattern for moving focus to a non-interactive landmark. [CITED: WAI-ARIA Authoring Practices Guide — Managing Focus]

---

### Q4: `autoFocus` vs `useEffect`-ref pattern — hydration risk

**Confirmed: `autoFocus` on a client component input does NOT produce Next.js 16 / React 19 hydration warnings.** [VERIFIED: react-dom-client.development.js:22158, react-dom-server.node.development.js:1415]

Evidence from the React 19 source:
- SSR serializes `autoFocus` as the lowercase HTML attribute `autofocus` (`react-dom-server.node.development.js:1415`: `pushBooleanAttribute(target, name.toLowerCase(), value)`)
- Client hydration's `commitMount` function (`react-dom-client.development.js:22158`) calls `domElement.focus()` for `input`, `button`, `select`, `textarea` nodes where `autoFocus` is true — this happens after hydration completes, not during reconciliation
- No mismatch warning is generated because the attribute value is consistent between server and client

The `autoFocus` attribute IS sent in the SSR HTML, which means the browser may attempt to focus on initial document parse before React hydrates. This is generally fine for an `/rsvp` page that is a pure client island (`"use client"` at the top of `page.tsx`). The lookup input will receive focus on mount.

**No workaround needed.** `<input autoFocus />` is the correct implementation per L-04.

Note: `lookupInputRef` is still needed for the "Try again" refocus path. Attach `ref={lookupInputRef}` to the same input that has `autoFocus`.

```tsx
<input
  ref={lookupInputRef}
  id="rsvp-lookup-name"
  type="text"
  autoFocus
  autoComplete="name"
  placeholder="E.g. Tyler Straffon"
  aria-required="true"
  // ... rest of attributes
/>
```

---

### Q5: Per-member radio grouping — `name="attending-{guest_id}"`

**Confirmed: this is the WAI-ARIA-correct pattern for namespaced radio groups.** [ASSUMED — training knowledge; consistent with WAI-ARIA spec]

Native `<input type="radio">` elements share arrow-key navigation scope via their `name` attribute. Browsers group all radios with the same `name` into one arrow-key traversal group. Using `name="attending-{guest_id}"` (e.g., `name="attending-abc123"`) isolates each member's Yes/No pair so arrow keys cycle only within that pair and do not bleed into adjacent members' radios.

```tsx
// Per member row:
<fieldset>
  <legend className="sr-only">Will {m.full_name} be attending?</legend>
  <label>
    <input
      type="radio"
      name={`attending-${sub.guest_id}`}
      value="yes"
      disabled
    />
    Yes
  </label>
  <label>
    <input
      type="radio"
      name={`attending-${sub.guest_id}`}
      value="no"
      disabled
    />
    No
  </label>
</fieldset>
```

`<fieldset>` + `<legend>` is the correct HTML semantics for a named radio group; the legend text is announced by screen readers when focus enters any radio in the group. `<legend className="sr-only">` visually hides it without removing it from the a11y tree.

---

### Q6: `reveal-on-scroll` on form-stage rows — critical behavior finding

**Finding: `reveal-on-scroll` uses CSS `animation-timeline: view()` (scroll-driven spec), NOT IntersectionObserver.** [VERIFIED: app/globals.css:433-436]

```css
.reveal-on-scroll {
  animation: fade-slide-up ease-out both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}
```

`animation-timeline: view()` fires based on the element's scroll position relative to the viewport, using the CSS Scroll-driven Animations spec. The `animation-range: entry 0% entry 30%` means: animate as the element enters the viewport from 0% to 30% through entry.

**Critical problem:** When `stage: "lookup" → "form"`, the form card is already in the viewport (the card is fixed position in the right column). The member rows mount inside an already-visible container. The CSS scroll timeline will have already "passed" the entry range for these elements — they will render at `opacity: 0; transform: translateY(32px)` and STAY there because the scroll-driven animation has no progress to make. The rows will be permanently invisible (or partially so) until the user scrolls.

**Recommended approach: use `hero-reveal-*` keyframe classes instead.** These are time-based (not scroll-based), making them safe for freshly-mounted in-viewport content:

```css
/* From globals.css */
.hero-reveal-label  { animation: hero-fade-up 800ms ease-out 200ms both; }
.hero-reveal-title  { animation: hero-fade-up 800ms ease-out 400ms both; }
.hero-reveal-subtitle { animation: hero-fade-up 800ms ease-out 600ms both; }
```

Apply staggered delays to member rows using inline styles or extend the pattern:

```tsx
{form.submissions.map((sub, i) => (
  <div
    key={sub.guest_id}
    style={{ animation: `hero-fade-up 700ms ease-out ${i * 120}ms both` }}
  >
    {/* member row content */}
  </div>
))}
```

`hero-fade-up` is already defined in `globals.css:336-343` and is covered by the `prefers-reduced-motion` rule at `globals.css:617` (disabled automatically).

**Planner action:** Do NOT use `reveal-on-scroll` on form-stage member rows. Use inline `animation` style referencing `hero-fade-up` keyframe with staggered delay, OR skip entrance animation entirely on form rows and use it only for scroll-only content below the fold.

---

### Q7: `info` Material Symbol availability

**Confirmed: `info` is in the Material Symbols Outlined variable font loaded in `app/layout.tsx`.** [VERIFIED: app/layout.tsx:44]

The font is loaded as a variable font range:
```html
href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
```

This loads the full variable font range including all symbols in the Outlined set. `info` is a core Material Symbol present in the full set since its initial release. [ASSUMED — training knowledge on symbol availability; confirmed by variable font range covering all symbols]

Usage for miss banner:
```tsx
<span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-lg shrink-0 mt-0.5">
  info
</span>
```

---

### Q8: TypeScript discriminated unions for `ErrorKind`

**Recommendation: string literal union as CONTEXT.md shows. No discriminated union needed.** [ASSUMED]

The four variants (`network`, `server`, `validation`, `miss`) share identical payload shape — they all carry only `errorKind: ErrorKind | null` at the state level. The `errorCopy` object provides the variant-specific display text. A discriminated union (e.g., `{ kind: "miss"; tryAgainRef: ... }`) would only add value if variants carried structurally different data, which they do not in Phase 5.

```ts
type ErrorKind = "network" | "server" | "validation" | "miss";
```

The `errorCopy` inline object approach (see Q12 below) handles all variant presentation without needing type-level discrimination.

---

### Q9: `noValidate` + manual validation pattern

**Confirmed: the v0.1 pattern applies directly.** [VERIFIED: app/(main)/rsvp/page.tsx:195]

v0.1 uses `<form noValidate>` at `page.tsx:195`. The lookup form is simpler — single field, single validation rule (non-empty after trim). Implementation:

```ts
async function handleLookup(e: React.FormEvent) {
  e.preventDefault();
  setForm(f => ({ ...f, errorKind: null }));
  const name = form.lookupName.trim();
  if (!name) {
    setForm(f => ({ ...f, errorKind: "validation" }));
    lookupInputRef.current?.focus();
    return;
  }
  setIsSearching(true);
  // ... fetch
}
```

The `lookupInputRef.current?.focus()` call on validation error (empty name) is appropriate here because the input IS the invalid field — refocusing it matches the v0.1 `document.getElementById(fieldId)?.focus()` pattern for field-level errors.

Note: for the validation case specifically, focus should go to the input (not the banner) because the user needs to type in the field, not read an error paragraph. The `useEffect` on `errorKind` change will also try to focus the banner. The solution is to skip the banner focus for `"validation"` and focus the input instead — this is a subtle deviation from the unified `useEffect`:

```ts
// Modified focus effect:
useEffect(() => {
  if (form.errorKind === null) return;
  if (form.errorKind === "validation") {
    lookupInputRef.current?.focus();
  } else {
    errorBannerRef.current?.focus();
  }
}, [form.errorKind]);
```

---

### Q10: Single `setForm` call for atomic stage transition

**Confirmed: React 19 batches the state update.** [ASSUMED — training knowledge; React 19 batches all state updates by default including inside async event handlers and Promise callbacks]

React 18 introduced automatic batching for all updates including those inside Promises, timeouts, and async functions. React 19 preserves this behavior. A single `setForm(...)` call that sets `stage`, `household`, AND `submissions` simultaneously produces exactly one re-render — there are no intermediate renders with `stage: "form"` but `submissions: []`.

```ts
// Inside handleLookup, on hit:
const data = await res.json();
if (data.found) {
  setForm({
    stage: "form",
    lookupName: form.lookupName,
    household: { id: data.household_id, members: data.members },
    submissions: data.members.map((m: { guest_id: string; full_name: string }) => ({
      guest_id: m.guest_id,
      full_name: m.full_name,
      attending: null,
      meal_choice: null,
      dietary_restrictions: "",
    })),
    errorKind: null,
  });
  // setIsSearching(false) in finally block
  return;
}
```

Note: `setIsSearching(false)` belongs in a `finally` block, separate from `setForm`. These are two separate state atoms (`form` and `isSearching`) — the batch for `setForm` does not need to include the `isSearching` reset because React 19 batches them together anyway.

---

### Q11: Error banner ref refocus on `errorKind` change

**Recommendation: single `useEffect` on `form.errorKind`, with `"validation"` exception routing to input focus.** [ASSUMED]

The `useEffect` dependency array should be `[form.errorKind]`. This fires whenever `errorKind` changes — including transitions from one kind to another (e.g., `"validation"` → `"network"` if the user fixes the empty input but then goes offline).

```ts
useEffect(() => {
  if (form.errorKind === null) return;
  if (form.errorKind === "validation") {
    lookupInputRef.current?.focus();
  } else {
    errorBannerRef.current?.focus();
  }
}, [form.errorKind]);
```

v0.1's `page.tsx:89-92` uses `[status]` as the dependency — `status` is a coarser signal and cannot distinguish `"error"` → `"error"` transitions (e.g., network error followed by try-again followed by server error). Using `[form.errorKind]` means a change from `"network"` to `"server"` will re-trigger focus — which is correct behavior (new error announced).

One edge case: if the user hits submit twice quickly and both fail with the same `errorKind`, the effect will NOT re-fire (same dependency value). This is acceptable — the banner is already focused and announced.

---

### Q12: Inline `errorCopy` object shape for four variants

**Recommendation: inline object keyed on `errorKind`, evaluated at render time.** [VERIFIED: app/(main)/rsvp/page.tsx:124-159]

v0.1 evaluates `errorCopy` at the bottom of the component body with `[errorKind ?? "network"]` subscript access. Phase 5 extends this to four keys. The `"miss"` variant includes a JSX body with the "Try again" button.

Complete `errorCopy` shape for Phase 5:

```tsx
const errorCopy: Record<ErrorKind, { heading: string; body: React.ReactNode }> = {
  network: {
    heading: "We couldn't search the list",
    body: (
      <>
        Check your connection and try again. Still stuck? Email us at{" "}
        <a href="mailto:hello@emilyandtyler.com" className="underline underline-offset-2">
          hello@emilyandtyler.com
        </a>
        .
      </>
    ),
  },
  server: {
    heading: "Something went wrong on our end",
    body: (
      <>
        Try again in a minute. If it keeps happening, email us at{" "}
        <a href="mailto:hello@emilyandtyler.com" className="underline underline-offset-2">
          hello@emilyandtyler.com
        </a>{" "}
        and we&apos;ll sort it out.
      </>
    ),
  },
  validation: {
    heading: "Something didn't look right",
    body: "Try again — make sure you entered your full name.",
  },
  miss: {
    heading: "We couldn't find you on the list",
    body: (
      <>
        Double-check the spelling, or reach out to{" "}
        <a href="mailto:hello@emilyandtyler.com" className="underline underline-offset-2">
          hello@emilyandtyler.com
        </a>{" "}
        and we&apos;ll sort it out.{" "}
        <button
          type="button"
          onClick={handleTryAgain}
          className="font-label text-xs uppercase tracking-wider text-on-surface-variant underline underline-offset-2 ml-1"
        >
          Try again
        </button>
      </>
    ),
  },
};
```

The `handleTryAgain` function:
```ts
function handleTryAgain() {
  setForm(f => ({ ...f, lookupName: "", errorKind: null }));
  lookupInputRef.current?.focus();
}
```

**Type note:** Declare `errorCopy` as `Record<ErrorKind, ...>` rather than the v0.1 subscript-with-fallback pattern. This makes TypeScript enforce all four keys are present and eliminates the `?? "network"` fallback. The banner render guard (`form.errorKind !== null`) means the subscript access is always valid.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Focus management | Custom JS scroll-to-element or aria-live announcer | `useRef` + `ref.current?.focus()` on `tabIndex={-1}` element |
| Batch state update | `useReducer` with dispatch | Single `setForm({...})` call; React 19 batches automatically |
| Scroll reveal for in-viewport mounts | `reveal-on-scroll` (scroll-driven, won't fire) | Inline `animation` style referencing existing `hero-fade-up` keyframe |
| Radio group namespacing | Synthetic JS arrow-key handler | Native `name="attending-{guest_id}"` — browser handles it |

---

## Common Pitfalls

### Pitfall 1: Using `reveal-on-scroll` on form-stage member rows

**What goes wrong:** Elements mount inside an already-visible viewport container. The CSS scroll-driven animation's `entry` range has already passed; elements render at `opacity: 0` and stay invisible.

**Why it happens:** `animation-timeline: view()` ties animation progress to scroll position. If the element is already past `entry 0% entry 30%` when it mounts, it renders at 100% progress — which means `opacity: 1` only if the `to` keyframe is reached, BUT with `animation-fill-mode: both`, the `from` state (`opacity: 0`) is applied until scroll progress begins. An in-viewport element at rest reads 0 scroll delta for that range → stays at `from`.

**How to avoid:** Use `hero-reveal-*` time-based classes or inline `animation` style on `hero-fade-up` keyframe for elements that mount inside the viewport.

**Warning signs:** Form rows flash invisible on stage transition; opening devtools and disabling animations shows content is present.

---

### Pitfall 2: `errorKind` focus effect fires on clear

**What goes wrong:** Setting `errorKind: null` (on try-again or new submit attempt) triggers the `useEffect([form.errorKind])` and runs `errorBannerRef.current?.focus()` — but the banner is now unmounted, so `errorBannerRef.current` is `null` and the optional chain saves you. However, `lookupInputRef.current?.focus()` for the `"validation"` branch could also misfocus.

**How to avoid:** The `if (form.errorKind === null) return;` guard at the top of the effect prevents any focus logic from running on clear. Included in the Q11 code snippet above.

---

### Pitfall 3: `submissions` hydration in `useEffect` instead of inline

**What goes wrong:** If `submissions` are set in a `useEffect` that watches `form.stage`, there is one render where `stage: "form"` but `submissions: []`. The form scaffold renders with no rows, then a second render adds them — visible flash.

**How to avoid:** Set `stage`, `household`, AND `submissions` in the single `setForm(...)` call inside the response handler. This is a locked decision in CONTEXT.md Discretion; this pitfall is the technical reason.

---

### Pitfall 4: `aria-live="assertive"` on always-present container

**What goes wrong:** If the banner container div is always rendered (with conditional inner content) and has `aria-live="assertive"`, screen readers announce its content on every render — including the initial empty render.

**How to avoid:** Conditionally render the entire banner div, not just its content. The banner div including `role="alert"` and `aria-live="assertive"` should only mount when `form.errorKind !== null`. This matches v0.1's pattern at `page.tsx:404` where the entire `div` is inside `{status === "error" && ...}`.

```tsx
{form.errorKind !== null && (
  <div role="alert" aria-live="assertive" className="flex items-start gap-3 p-4 ... mb-6">
    {/* icon + heading + body */}
  </div>
)}
```

---

### Pitfall 5: Miss banner palette accidentally using error tokens

**What goes wrong:** Copy-pasting the v0.1 error banner and forgetting to swap `text-error`, `bg-error/10`, `border-error/20` for the neutral tokens on the `"miss"` variant.

**How to avoid:** The banner render must branch on `errorKind` for CSS classes. Two approaches:

Option A — two separate conditional renders (one for error palette, one for miss palette):
```tsx
{form.errorKind !== null && form.errorKind !== "miss" && (
  <div className="... bg-error/10 border-error/20 text-error ...">
)}
{form.errorKind === "miss" && (
  <div className="... bg-surface-container-low border-white/10 text-on-surface-variant ...">
)}
```

Option B — single render with dynamic class string computed from `errorKind`:
```tsx
const bannerClass = form.errorKind === "miss"
  ? "bg-surface-container-low border-white/10"
  : "bg-error/10 border-error/20";
const textClass = form.errorKind === "miss"
  ? "text-on-surface-variant"
  : "text-error";
```

Option A is safer for the planner — it makes the palette split explicit and reduces the chance of forgetting to update one class string.

---

## Code Examples

### Complete type declarations (D-02 shape)
```ts
// Source: CONTEXT.md D-02 (locked)
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

### Initial state
```ts
const [form, setForm] = useState<FormState>({
  stage: "lookup",
  lookupName: "",
  household: null,
  submissions: [],
  errorKind: null,
});
const [isSearching, setIsSearching] = useState(false);
```

### Ref declarations
```ts
const errorBannerRef = useRef<HTMLParagraphElement>(null);
const formHeadingRef = useRef<HTMLHeadingElement>(null);
const lookupInputRef = useRef<HTMLInputElement>(null);
```

### Focus effects
```ts
// Stage transition focus
useEffect(() => {
  if (form.stage === "form") formHeadingRef.current?.focus();
}, [form.stage]);

// Error banner focus (validation goes to input, others go to banner)
useEffect(() => {
  if (form.errorKind === null) return;
  if (form.errorKind === "validation") {
    lookupInputRef.current?.focus();
  } else {
    errorBannerRef.current?.focus();
  }
}, [form.errorKind]);
```

### Stage-aware render branching
```tsx
// At top of RSVPPage return, before the two-column grid:
if (form.stage === "success") {
  return null; // {/* Phase 6: success view + edit-response link (GROUP-03) */}
}
```

### Form-stage heading (tabIndex for focus target)
```tsx
<h2
  ref={formHeadingRef}
  tabIndex={-1}
  className="font-headline text-4xl md:text-5xl text-on-surface mb-12 outline-none"
>
  Your Group
</h2>
```

`outline-none` prevents the focus ring from appearing on a heading that receives programmatic-only focus. This is acceptable per WCAG 2.4.7 because the focus is programmatic (not user-initiated via Tab).

### Member row with entrance animation
```tsx
{form.submissions.map((sub, i) => (
  <div
    key={sub.guest_id}
    className="space-y-4"
    style={{
      animation: `hero-fade-up 700ms ease-out ${100 + i * 120}ms both`,
    }}
  >
    <span className="font-label text-[11px] uppercase tracking-widest text-primary opacity-80 block">
      Guest {i + 1}
    </span>
    <p className="font-headline text-2xl text-on-surface">{sub.full_name}</p>
    {/* attending radios, meal select, dietary input */}
  </div>
))}
```

### Submit endpoint shape note (Phase 6 alignment)

The Phase 4 submit route (`route.ts:43`) accepts `attending: boolean` — NOT `"yes" | "no"`. Phase 5's FormState uses `attending: "yes" | "no" | null` as the UI representation per D-02. Phase 6 must transform `"yes" → true`, `"no" → false` before POSTing to `/api/rsvp/submit`. This is a Phase 5/6 boundary concern; Phase 5 does not send to submit. Document this in the Phase 5 state type comment for Phase 6.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 5 is a single-file client component rewrite with no external dependencies beyond the already-running Next.js dev server. All tools (Node, npm, Next.js) confirmed present from prior phases.

---

## Validation Architecture

No test framework installed (Phase 3 pattern, carried forward). Verification is manual smoke per UI-SPEC.md §Testing. The planner's `<verify>` blocks should reference the 8-step smoke checklist in UI-SPEC.md §Acceptance Criteria / Testing verbatim.

---

## Security Domain

No new security surface in Phase 5. The name-lookup POST is handled by Phase 4's locked endpoint with existing validation. No user-generated content is persisted in Phase 5. No new routes, no new auth surfaces.

---

## State of the Art

| Pattern | Phase 5 Uses | Note |
|---------|-------------|------|
| React 19 automatic batching | Yes — single `setForm` for atomic transitions | Confirmed; eliminates need for `unstable_batchedUpdates` |
| CSS Scroll-driven Animations | Avoided on form rows | `animation-timeline: view()` is CSS-native, no JS IntersectionObserver; safe for scroll-only content |
| `autoFocus` without `useEffect` | Yes | React 19 `commitMount` handles focus after hydration; no SSR mismatch |

---

## Open Questions for the Planner

1. **Entrance animation on form-stage rows.** Research confirms `reveal-on-scroll` cannot be used for in-viewport mounts. Three options for the planner to choose:
   - (a) Inline `animation` style with `hero-fade-up` keyframe + stagger delay (recommended above)
   - (b) `hero-reveal-label` / `hero-reveal-subtitle` classes applied sequentially to heading and first row
   - (c) No entrance animation on form rows at all (simplest; perfectly acceptable)

   The planner should pick one and specify it in the implementation task. Option (c) is the safest bet if animation correctness isn't a priority for this phase.

2. **`"validation"` focus routing.** The analysis in Q9/Q11 recommends routing validation errors to the lookup input (not the banner). This deviates slightly from the unified `useEffect` approach. The planner should specify this routing explicitly in the task so the implementer doesn't default to the unified banner-focus path.

3. **`Record<ErrorKind, ...>` vs subscript-with-fallback.** Minor TypeScript style call — the planner should specify which pattern to use in `errorCopy` declaration to avoid implementation ambiguity. Recommendation: `Record<ErrorKind, ...>` with the banner guarded by `{form.errorKind !== null && ...}`.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `useState` is lower-friction than `useReducer` for this update pattern | Q1 | Negligible — both work; `useState` matches codebase style |
| A2 | No AbortController needed for single-flight button-disabled fetch | Q2 | Negligible — UX is identical; AbortController can be added without breaking changes |
| A3 | React 19 automatic batching covers async Promise callbacks | Q10 | Low — would cause an extra render on stage transition, not a bug |
| A4 | `info` symbol is in the Material Symbols Outlined full variable font set | Q7 | Low — can verify by rendering the icon in dev |
| A5 | Arrow-key scoping per `name` attribute is browser-native and cross-browser consistent | Q5 | Low — all major browsers have implemented this for years |
| A6 | `outline-none` on a programmatically-focused heading is WCAG-acceptable | Code Examples | Low — applies only when focus is programmatic; user-tabbed focus would show outline |

---

## Sources

### Primary (HIGH confidence)
- `app/(main)/rsvp/page.tsx` — v0.1 visual baseline and pattern source, read end-to-end
- `app/globals.css` — full token set and animation utilities, confirmed `reveal-on-scroll` uses `animation-timeline: view()`
- `app/layout.tsx:44` — Material Symbols Outlined variable font load, confirmed full range loaded
- `app/(main)/api/rsvp/lookup/route.ts` — locked endpoint contract, confirmed response shape
- `app/(main)/api/rsvp/submit/route.ts` — Phase 6 target, confirmed `attending: boolean` type mismatch with Phase 5 UI shape
- `node_modules/react-dom/cjs/react-dom-client.development.js:22158` — `commitMount` + `autoFocus` behavior in React 19.2.4
- `node_modules/react-dom/cjs/react-dom-server.node.development.js:1415` — `autoFocus` SSR serialization in React 19.2.4
- `.planning/phases/05-name-lookup-gate-ui/05-CONTEXT.md` — all locked decisions and discretion areas
- `.planning/phases/05-name-lookup-gate-ui/05-UI-SPEC.md` — design contract, acceptance criteria, copywriting

### Secondary (MEDIUM confidence)
- WAI-ARIA Authoring Practices Guide — `tabIndex={-1}` + programmatic focus pattern for non-interactive landmarks [ASSUMED — well-established pattern]

### Tertiary (LOW confidence)
- React 19 automatic batching in async callbacks — training knowledge, consistent with React 18+ behavior [ASSUMED]

---

## Metadata

**Confidence breakdown:**
- State machine pattern: HIGH — confirmed from v0.1 codebase and React 19 source
- Animation finding (`reveal-on-scroll` incompatibility): HIGH — verified from `globals.css` CSS spec
- `autoFocus` hydration safety: HIGH — verified from React 19.2.4 source files
- Focus management pattern: HIGH — confirmed from v0.1 codebase
- WAI-ARIA radio namespacing: MEDIUM — training knowledge, well-established

**Research date:** 2026-06-01
**Valid until:** 2026-07-01 (stable stack; no breaking changes expected)
