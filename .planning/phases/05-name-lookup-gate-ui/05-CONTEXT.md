# Phase 5: Name-Lookup Gate UI - Context

**Gathered:** 2026-06-01
**Status:** Ready for planning
**Milestone:** v0.2 — Gated RSVP & Meal Selection

<domain>
## Phase Boundary

Frontend-only phase. Revamps `app/(main)/rsvp/page.tsx` into a three-stage controlled flow (`lookup → form → success`) where stage 1 is a name-lookup gate calling Phase 4's `POST /api/rsvp/lookup`, and a hit advances to a fully-scaffolded (but not-yet-interactive) group form. Phase 5 owns: the lookup screen, hit/miss UX, the v0.2 FormState shape, and the rendered form skeleton (member rows + non-functional controls + disabled submit). Phase 6 wires the form's interactivity, validation, submit, and success view. No backend changes — Phase 4's `/api/rsvp/lookup` and `/api/rsvp/submit` routes stay locked. The v0.1 `app/(main)/api/rsvp/route.ts` is NOT modified or deleted in this phase (carry forward from Phase 4 D-16).

</domain>

<decisions>
## Implementation Decisions

### Stage state machine (carry forward + extend)

- **D-01:** **Three-stage controlled flow.** Local component state drives `stage: "lookup" | "form" | "success"`. Stage transitions are component-local — no URL params, no `next/navigation` routing, no resumability across reloads. Matches v0.1's pattern of single-page `status` state.
- **D-02:** **Phase 5 commits the full v0.2 FormState shape now.** Phase 6 will not refactor the type — it only wires controls to existing fields. Shape:
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
    lookupName: string;                   // input value on the lookup stage
    household: { id: string; members: { guest_id: string; full_name: string }[] } | null;
    submissions: Submission[];            // hydrated 1:1 from household.members on hit
    errorKind: ErrorKind | null;
  };
  ```
- **D-03:** **`errorKind` extended with `"miss"`.** v0.1 used `network | server | validation`; Phase 5 adds `"miss"` as a fourth variant so the same banner component renders all non-hit outcomes uniformly (per L-03 below). The miss variant uses a NEUTRAL palette (`text-on-surface-variant` + `bg-surface-container-low`) not the destructive palette — miss is a business outcome, not a server failure. Phase 6 will likely reuse `errorKind` for submit-side errors too.

### Lookup screen treatment (GUEST-02)

- **L-01:** **Reuse the v0.1 form-card chrome on the lookup stage.** The right column on stage 1 uses the same surface, padding, and shadow as the v0.1 submit form: `lg:col-span-7 bg-surface-container-lowest p-8 md:p-16 lg:p-24 shadow-2xl border border-white/5`. Stages feel visually identical — only the inner content swaps. The left column ("Join Us in Aspen / Kindly Respond / September 1st / Maroon Bells image") stays untouched across all three stages.
- **L-02:** **Lookup card interior = just the field + button. No in-card heading. No in-card instructional copy.** Editorial restraint — the left column's "Kindly Respond" hero + September 1st intro paragraph already provide context. The card itself contains: eyebrow label ("Your Full Name"), the input, the submit button. Generous empty vertical space inside the `lg:p-24` padding is intentional.
- **L-03:** **All non-hit outcomes render in the v0.1 errorKind banner pattern.** Network errors, server errors (5xx from `/api/rsvp/lookup`), AND the "we can't find you" miss state render in the same banner slot above the submit button — `flex items-start gap-3 p-4 ... border rounded-lg mb-6`, `role="alert"`. The form card NEVER structurally changes — only the banner appears/disappears. This means:
  - One banner component, four `errorKind` variants (`network`, `server`, `validation`, `miss`)
  - `miss` variant uses neutral colors (per D-03) to distinguish from real errors
  - "Try again" affordance on miss is implemented as a button inside the banner that clears `lookupName`, clears `errorKind`, and refocuses the input
- **L-04:** **`autoFocus` on the lookup input on mount.** Cursor is in the name field the moment `/rsvp` loads. Removes one tap/click. Implementation: `<input autoFocus />` on the lookup input, NOT a `useEffect` ref dance. Trade-off: screen readers may skip the hero on initial focus; mitigation: the left column's `<h1 id="rsvp-heading">` is referenced via `aria-labelledby` on the form, so the SR still has a path to the hero. Re-focus after try-again uses the same path.
- **L-05:** **Lookup submission flow.** On submit: `e.preventDefault()` → `setErrorKind(null)` → trim + non-empty check (client-side gate, mirrors API's 400) → `setIsSearching(true)` → `fetch("/api/rsvp/lookup", { method: "POST", body: JSON.stringify({ name: form.lookupName }) })`. Response handling:
  - HTTP 200 + `{ found: true, household_id, members }`: hydrate `household` + `submissions` (one per member, `attending: null`, `meal_choice: null`, `dietary_restrictions: ""`), set `stage: "form"`, focus moves to the form-stage heading or first row (let UI-researcher land specifics).
  - HTTP 200 + `{ found: false }`: set `errorKind: "miss"`, leave `stage: "lookup"`, leave `household: null`.
  - HTTP 4xx (validation): set `errorKind: "validation"`, stay on lookup.
  - HTTP 5xx: set `errorKind: "server"`.
  - Network failure (caught exception): set `errorKind: "network"`.
- **L-06:** **Submit button copy.** Idle: `Find My Invitation` (warmer than `Submit Response` from v0.1 — this is a search, not a submission). Loading: `Searching…` with the button disabled + `aria-disabled="true"` + `aria-busy="true"` on the form. Same `bg-primary → bg-white over 500ms` hover treatment, same `tracking-[0.4em]` uppercase font-label, same `east` icon. Full-width, `py-6` (matches v0.1).
- **L-07:** **Lookup input attributes.** `type="text"` (NOT `type="search"` — preserves the v0.1 input styling), `autoComplete="name"`, `autoFocus`, `placeholder="E.g. Tyler Straffon"`. Same hairline-bottom-border treatment as v0.1: `bg-surface-container-low border-none border-b border-white/10 focus:ring-0 focus:border-primary transition-all duration-300 py-4 px-4 font-body text-on-surface placeholder:text-on-surface-variant/40`.

### Form scaffold scope (GUEST-04 hydration; Phase 6 wires interactivity)

- **F-01:** **Phase 5 renders the FULL form structure with non-functional controls + disabled submit.** On a successful lookup, the form-stage card contains:
  - A per-member row for every entry in `household.members` (one row per member, rendered via `submissions.map(...)`)
  - Each row shows: member's `full_name` (display-only, NOT an editable input — eyebrow + headline treatment), attending Y/N radio pair (visually rendered, `onChange` is a no-op for Phase 5 OR sets `submissions[i].attending` if trivial), meal `<select>` (visually rendered, three placeholder `<option>`s, no-op), dietary `<input>` (visually rendered, no-op)
  - A submit `<button>` at the bottom, visually present but `disabled={true}` with the copy `Confirm Group RSVP` — Phase 6 unlocks it
- **F-02:** **Meal `<option>` placeholders are GENERIC strings.** Three options: `Option A` / `Option B` / `Option C`. Forces Phase 6 to land real menu copy and makes it impossible to forget the swap at code-review. Phase 4's Discretion item used `chicken/fish/vegetarian` as a backend-validation placeholder; Phase 5 deliberately diverges to obviously-placeholder strings on the UI side so they're visibly TODO. Phase 6 (MEAL-02) replaces both — the codebase becomes the single source of truth at the same moment.
- **F-03:** **Member rows visually render with full editorial treatment.** Each row uses the warm-gold eyebrow + headline pattern: member name as an `h3` (or styled `<div>`) in `font-headline text-2xl` or similar, member-specific controls below in `font-label`-styled labels matching v0.1. Tight vertical rhythm between members (`space-y-12` between rows, mirrors v0.1's form-section rhythm).
- **F-04:** **No live region announcement on form-stage entry beyond the standard heading focus.** When `stage: "lookup" → "form"`, focus moves to the form card's primary heading (e.g., "Your Group") via a `ref` + `useEffect`. The roadmap scope's a11y requirement ("focus moves to the form's first field on hit") is interpreted as moving focus to the form's labeled heading/landmark — the first interactive field is a disabled radio in this phase, which is not a focusable target. Phase 6 will refine focus to the first attending radio once those are interactive.
- **F-05:** **No success-stage UI in Phase 5.** The `Stage` type includes `"success"` (per D-02), but Phase 5 never transitions to it — there is no submit handler in this phase. The `if (stage === "success")` branch in the page component either renders nothing or a single-line placeholder comment block: `{/* Phase 6: success view + edit-response link (GROUP-03) */}`. Phase 6 owns the entire success view, the submit→success transition, and the edit-response link that returns to `stage: "lookup"`.

### Component structure (carry forward Phase 1 patterns)

- **D-04:** **Single `"use client"` page file at `app/(main)/rsvp/page.tsx`.** Phase 5 does NOT split into separate `LookupStage.tsx` / `FormStage.tsx` components. The whole page is the client island. Trade-off: a ~300-line file vs. four ~75-line files. Chose monolith because: (a) state shape is shared across stages, (b) extracting components forces prop-drilling of setters, (c) matches the v0.1 single-file pattern, (d) Phase 6 needs to add more inside the same file — extracting now creates a refactor moment. Re-evaluate at Phase 6 if it becomes unwieldy.
- **D-05:** **Editorial left column stays identical across all three stages.** No subtitle swap, no eyebrow change, no progress-indicator. Reasons: (a) sticky positioning + dynamic content would cause jumps on viewport-shorter desktops, (b) "Kindly Respond" + the September 1st copy already speaks to the entire flow, (c) editorial restraint matches the site's voice. If the user later wants stage-aware left-column messaging, that's a future enhancement.
- **D-06:** **No navbar changes.** RSVP link is already enabled in `components/Navbar.tsx:16`. The page URL stays `/rsvp` across all stages.

### Claude's Discretion

- **Lookup eyebrow + headline inside the form card** — keep card body to "Your Full Name" eyebrow + input + button per L-02. UI-researcher may add the warm `Your Full Name` eyebrow with the exact `font-label text-[11px] uppercase tracking-widest text-primary opacity-80` treatment from v0.1.
- **Miss banner copy** — working draft: heading `We couldn't find you on the list` / body `Double-check the spelling, or reach out to {support email} and we'll sort it out.` + a `Try again` button inside the banner that clears the input. UI-researcher lands the final warm-gracious tone.
- **Server-error banner copy on lookup stage** — reuse v0.1's `server` variant copy verbatim with a small swap (`We couldn't send your RSVP` → `We couldn't search the list`). Same support email + same warm fallback path.
- **Network-error banner copy on lookup stage** — reuse v0.1's `network` variant verbatim.
- **Validation-error banner copy on lookup stage** — short, warm: `Something didn't look right — try again.` Distinct from the miss variant so the user knows to retry their input vs. consider themselves not on the list.
- **Stage-transition motion** — reuse the v0.1 hero-reveal motion vocabulary lightly (e.g., `reveal-on-scroll` for the form-stage rows on first render). No new motion utilities introduced. Respects `prefers-reduced-motion`.
- **Form-stage heading** — `Your Group` (warm + plain) in `font-headline text-4xl md:text-5xl text-on-surface`. Sits at the top of the form card.
- **Submit-button copy on form stage** — `Confirm Group RSVP` (disabled in Phase 5). Phase 6 may refine.
- **Hydration of `submissions` on hit** — performed inline in the lookup-response handler, NOT in a `useEffect`. State update is synchronous from the response, so a single `setForm` call sets `stage`, `household`, AND `submissions` at once to avoid intermediate renders.
- **`type="search"` vs `type="text"`** — chose `type="text"` to keep the v0.1 input styling. `type="search"` adds a clear (×) button on some browsers that conflicts with the editorial restraint.
- **Loading state on the lookup card** — only the button changes (disabled + `Searching…`). No skeleton, no shimmer, no full-card overlay. The button state is enough at the latency this lookup has (a single indexed Postgres `SELECT`).
- **Test approach** — no test framework installed (per Phase 3 VALIDATION, carried forward through Phase 4). Verification is manual: load `/rsvp`, type a known guest name (e.g., Tyler Straffon), watch the form scaffold render with that household's members. The PLAN's `<verify>` blocks will spell out the manual smoke steps.

</decisions>

<deferred>
## Deferred Ideas (out of scope for Phase 5)

- **Form interactivity** — attending Y/N onChange handlers, conditional show/hide of meal dropdown when attending=no, validation, submit handler, error handling on submit. Phase 6 (GROUP-01, GROUP-04, MEAL-01, MEAL-02).
- **Real meal-option copy** — Phase 6 (MEAL-02) replaces `Option A/B/C` placeholders with the final menu copy.
- **Success view** — Phase 6 owns the entire success stage (post-submit confirmation panel listing each attending member's name + meal choice).
- **Edit-response link** — Phase 6 (GROUP-03 UI affordance); returns from success stage to `stage: "lookup"` and re-runs the lookup.
- **Submit-side errorKind variants** — Phase 6 will likely add `errorKind: "submit_validation"` or similar for the submit endpoint's 4xx responses. Phase 5 only handles lookup-side outcomes.
- **URL-based stage persistence** — out of scope; component-local state per D-01. If a user reloads mid-flow, they restart from lookup.
- **`/api/rsvp/route.ts` deletion** — Phase 4 D-16 explicitly defers; not Phase 5's concern.
- **Stage-aware left-column copy** — D-05 explicitly skips; future enhancement if desired.
- **Splitting the page into LookupStage / FormStage / SuccessStage components** — D-04 explicitly defers; revisit at Phase 6 if monolith file becomes unwieldy.
- **Auto-resume from localStorage** — if a guest closes the tab mid-flow, they restart from lookup. No persistence layer.

</deferred>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and project anchors
- `.planning/ROADMAP.md` §"Phase 5 — Name-Lookup Gate UI" — phase goal, scope, success criteria, UI hint=yes
- `.planning/PROJECT.md` — v0.2 milestone section, Stitch design system, palette, audience constraints
- `.planning/REQUIREMENTS.md` §v0.2 — full text of GUEST-02, GUEST-03

### Prior phase artifacts (Phase 4 — locked API contracts)
- `.planning/phases/04-guest-list-and-api/04-CONTEXT.md` — **CRITICAL** — D-09 through D-16 lock the lookup endpoint contract Phase 5 calls
- `.planning/phases/04-guest-list-and-api/04-VERIFICATION.md` — confirms `/api/rsvp/lookup` shipped and is verified PASS

### Prior phase artifacts (Phase 1 — UI patterns + a11y to extend)
- `.planning/phases/01-rsvp-enablement/01-UI-SPEC.md` — **CRITICAL** — design tokens, spacing scale, typography roles, color palette, copywriting contract, accessibility contract, error banner pattern (`errorKind` shape), focus-management pattern. Phase 5 extends this contract.
- `.planning/phases/01-rsvp-enablement/01-01-SUMMARY.md` — GRANT-vs-RLS quirk + SITE_ACCESS_CODE proxy gate (Phase 5 inherits, no changes)
- `.planning/phases/01-rsvp-enablement/01-PATTERNS.md` — pattern map for the v0.1 RSVP page

### Existing code to read before drafting
- `app/(main)/rsvp/page.tsx` — **PRIMARY VISUAL BASELINE** — current v0.1 single-stage RSVP form. Phase 5 replaces this file's contents while preserving: layout grid, left column (editorial + Maroon Bells image), form-card chrome (right column), error banner component, focus-management pattern, submit button styling.
- `app/(main)/api/rsvp/lookup/route.ts` — endpoint Phase 5 calls (locked contract from Phase 4 D-11/D-14)
- `app/(main)/api/rsvp/submit/route.ts` — endpoint Phase 6 will call (Phase 5 commits the FormState.submissions shape that matches this route's expected request body)
- `app/(main)/api/rsvp/route.ts` — v0.1 endpoint; NOT modified or deleted in Phase 5 (Phase 4 D-16)
- `app/globals.css` — full token set (`--color-primary`, `--color-surface-*`, font families, motion utilities `.hero-reveal-*` / `.reveal-on-scroll`, link utilities `.editorial-underline`)
- `components/Navbar.tsx` — RSVP link already at line 16; no changes
- `AGENTS.md` — Next.js 16 breaking-changes reminder (read `node_modules/next/dist/docs/...` before assuming App Router APIs)
- `.env.local.example` — confirm `NEXT_PUBLIC_SUPABASE_*` + `SITE_ACCESS_CODE` are already documented (carry forward from Phase 1)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Two-column grid** (`app/(main)/rsvp/page.tsx:163`): `max-w-screen-2xl mx-auto px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start` — copy verbatim for Phase 5.
- **Editorial left column** (`page.tsx:165-190`): `lg:col-span-5 lg:sticky lg:top-40` + eyebrow + headline + intro paragraph + Maroon Bells image with gradient overlay. Phase 5 reuses this block verbatim across all three stages (D-05).
- **Form-card chrome** (`page.tsx:193`): `lg:col-span-7 bg-surface-container-lowest p-8 md:p-16 lg:p-24 shadow-2xl border border-white/5` — L-01 reuses this exact treatment on the lookup stage card.
- **errorKind banner pattern** (`page.tsx:124-159, 404-429`): icon + heading + body banner with `role="alert"` + `aria-live` + focus-on-mount. Phase 5 extends with `errorKind: "miss"` variant (neutral palette per D-03).
- **Submit-button styling** (`page.tsx:430-444`): `w-full py-6 bg-primary text-on-primary font-label text-sm uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 group flex items-center justify-center space-x-4 font-bold disabled:opacity-60 disabled:cursor-not-allowed` + `east` arrow icon. Reuse verbatim on lookup submit button; reuse with `disabled` on form-stage submit.
- **Input hairline-border styling** (`page.tsx:223`): `bg-surface-container-low border-none border-b border-white/10 focus:ring-0 focus:border-primary transition-all duration-300 py-4 px-4 font-body text-on-surface placeholder:text-on-surface-variant/40`. Use for the lookup name input (L-07).
- **Focus-management pattern** (`page.tsx:89-92`): `useEffect` + `ref.current?.focus()` triggered by status change. Phase 5 reuses this pattern for stage transitions and try-again refocus.
- **Sticky left column** (`page.tsx:165` — `lg:sticky lg:top-40`): works out of the box across the variable-height right column.

### Established Patterns
- **Single client island per page** — `"use client"` at the top of `page.tsx`. No subcomponents extracted. (D-04 carries this forward.)
- **`noValidate` + manual validation** — form has `noValidate` and validation logic runs in `handleSubmit`. Phase 5 lookup uses the same pattern: client-side `name.trim()` non-empty check before fetch.
- **Inline `errorCopy` object** — v0.1 maps `errorKind` to `{ heading, body }` inline in the component. Phase 5 extends with the `miss` variant per L-03.
- **Plain `<img>` + eslint-disable** — site-wide convention (`page.tsx:182`). Phase 5 doesn't add new images, but the Maroon Bells image stays.
- **Material Symbols Outlined icons** — `<span className="material-symbols-outlined" aria-hidden="true">east</span>` pattern; `favorite`, `format_quote`, `error`, `east` already in use.

### Integration Points
- **Phase 4 lookup endpoint** — `/api/rsvp/lookup` returns `{ found: true, household_id, members: [{ guest_id, full_name }] }` or `{ found: false }`. Phase 5 hydrates `household` directly from this response shape.
- **Phase 4 submit endpoint** — `/api/rsvp/submit` accepts `{ household_id, submissions: [{ guest_id, attending, meal_choice?, dietary_restrictions? }] }`. Phase 5's FormState.submissions shape (D-02) matches this exactly so Phase 6 can call it without a transform.
- **Phase 6 (downstream)** — will wire attending toggles, meal dropdown options (replacing `Option A/B/C`), submit handler, success view, edit-response link. Phase 5's FormState shape is the contract Phase 6 builds against.
- **SITE_ACCESS_CODE proxy gate** — already fronts the page and the API routes. No per-page configuration needed.

### Patterns to NOT Reuse
- **`form.attending` as `"accept" | "decline" | null`** (v0.1 shape) — Phase 5 changes this to per-member `attending: "yes" | "no" | null` inside `submissions[]` (D-02). The single page-level `attending` value is gone.
- **`form.guestCount`** (v0.1 shape) — eliminated (Phase 4 dropped the `guest_count` column). Group size is derived from `household.members.length`.
- **Single email field at page level** — v0.1 had `form.email`. Phase 5 doesn't gather an email (the guest list IS the identity); Phase 6 may add an optional household-level contact email per ROADMAP scope. Phase 5 does NOT render an email input.

</code_context>

---

**Next:** `/gsd:ui-phase 5` to produce UI-SPEC.md (the roadmap flags UI hint=yes), then `/gsd:plan-phase 5`. The planner has explicit state shape (D-02), error banner contract (D-03/L-03), and Phase 6 boundary (F-01..F-05) to work from. Estimated 2 plans (lookup stage + form scaffold + state machine wiring; could be one plan if scope is tight).
