# Phase 1: RSVP Enablement — Research

**Researched:** 2026-05-28
**Domain:** Next.js 16 App Router + Supabase anon-key writes + form polish
**Confidence:** HIGH

## Summary

The RSVP system is already functionally complete in code: the form at `app/(main)/rsvp/page.tsx` collects all six fields the API expects, the route handler at `app/(main)/api/rsvp/route.ts` writes them to a Supabase `rsvps` table via `@supabase/supabase-js`, and the navbar has a commented-out link ready to enable. What is missing is verification (does the table exist with the right columns, are env vars set, does RLS allow the anon insert), polish (per-field validation copy, focus management, accept/decline success variants, error-type variants), and discoverability (the nav link).

The Next.js 16 baseline is already correct — App Router with a `(main)` route group, route handler at `app/(main)/api/rsvp/route.ts` resolving to `/api/rsvp`, client-component fetch submission, no use of any APIs that became async-only or were removed in v16. The Stitch theme tokens in `app/globals.css` are the source of truth; UI-SPEC.md (status: approved) locks every visual and copy decision.

**Primary recommendation:** Sequence the plan as schema-verify-first (Supabase Studio SQL snippet, since there is no migrations directory checked in), then code polish (validation + focus + variants), then nav enable, then a manual smoke checklist. Skip adding a test framework — none is configured and the phase scope explicitly accepts a manual checklist as the lower-cost path.

## User Constraints (from upstream context)

### Locked Decisions
- UI-SPEC.md is approved by gsd-ui-checker (all 6 dimensions PASS) — visual, copy, and interaction spec is final
- Stack is fixed: Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Supabase anon-key inserts
- Stitch tokens live in `app/globals.css` — no new colors, fonts, or radii
- No guest authentication, no email confirmation, no admin dashboard
- Hero image (Maroon Bells) replacement is an asset task, not a code blocker

### Claude's Discretion
- Schema verification path (Studio SQL paste vs. CLI migration) — codebase has no `supabase/` directory or migrations folder, so Studio path is the only honest choice
- Testing approach (manual checklist vs. Vitest/Playwright) — no test tooling configured; recommend manual checklist
- Validation implementation shape (per-field error state object, `onInvalid` vs. custom `validate()` in submit handler)
- Whether to centralize Supabase client usage in `lib/supabase/client.ts` (currently the API route inlines `createClient` and the shipped `lib/supabase/client.ts` is unused)

### Deferred Ideas (OUT OF SCOPE)
- Email confirmation to guests after RSVP
- Admin dashboard for viewing RSVPs (use Supabase Studio)
- Per-guest invitation codes / magic-link lookup
- Editing or deleting submitted RSVPs
- Replacing Maroon Bells stock photo (asset task)
- Re-theming the color palette (separate phase)

## Project Constraints (from CLAUDE.md / AGENTS.md)

- **Read Next.js 16 docs before writing code.** `AGENTS.md` explicitly states this is not the Next.js training-data Claude knows; APIs and conventions may differ. Consult `node_modules/next/dist/docs/01-app/` for any pattern in doubt. (This research read the relevant docs — findings below.)
- **Heed deprecation notices.** Next 16 removed `priority` on `next/image` in favor of `preload`, removed `next lint` (use ESLint CLI directly — `package.json` already does this), removed synchronous access to async request APIs, and renamed `middleware` to `proxy`. None of these affect this phase.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| REQ-01 | Verify `rsvps` table schema matches form payload | "Schema Truth" section below — exact column list derived from `route.ts:29-36` |
| REQ-02 | Confirm env vars wired and RLS allows anon insert | "Supabase Wiring" section — Studio SQL snippet + write-only policy pattern |
| REQ-03 | Enable RSVP nav link on desktop and mobile | "Current State" — exact line numbers in `Navbar.tsx` |
| REQ-04 | Polish submission UX (per-field validation, focus mgmt, accept/decline variants, error-type variants) | UI-SPEC §"Validation Messaging", §"Success State", §"Error State", §"Accessibility Contract" |
| REQ-05 | Add basic happy-path test OR manual smoke checklist | "Testing Approach" — no test framework configured, recommend checklist |

## Current State

### What exists and works

- **Form UI** (`app/(main)/rsvp/page.tsx`): client component, all six fields wired, conditional reveal of guest-detail section when `attending !== "decline"`, idle/submitting/success/error states, error banner shipped at lines 228-241 with shipped copy.
- **API route** (`app/(main)/api/rsvp/route.ts`): POSTs JSON, validates `fullName/email/attending` are non-empty, calls `createClient` directly with anon key (or service-role key if present), inserts into `rsvps` table with field mapping `fullName -> full_name`, `attending -> boolean (=== "accept")`, `guestCount -> parseInt(...)`.
- **Route group convention**: `app/(main)/api/rsvp/route.ts` resolves to URL `/api/rsvp`. Verified against `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route-groups.md`: route groups partition the route tree without affecting URL paths. Sibling `app/api/auth/login/route.ts` exists outside the `(main)` group at `/api/auth/login` — both patterns coexist fine.
- **Supabase client** (`lib/supabase/client.ts`): exports a top-level browser-context `supabase` instance. Currently unused — the API route inlines its own `createClient`.
- **Layout / theme**: `app/layout.tsx` loads `Noto_Serif` + `Manrope` via `next/font/google`, exposes CSS variables, loads Material Symbols Outlined via Google Fonts `<link>`. `(main)/layout.tsx` mounts `Navbar`, `Footer`, `MusicButton`, plus a "Skip to content" link targeted at `#main-content`.
- **Stitch tokens**: `app/globals.css` `@theme` block defines all colors, fonts, and radii. Warm gold/copper primary `#d4a373` on dark teal surfaces — UI-SPEC is correct, PROJECT.md description is stale.

### What is broken or missing

- **Nav link commented out**: `components/Navbar.tsx:15` — `// { label: "RSVP", href: "/rsvp" },` — and dead comment `{/* RSVP button — re-enable when ready to collect responses */}` at line 75.
- **Schema unverified**: no `supabase/migrations/` directory, no SQL files in repo, no `.env.local.example`. Whether the `rsvps` table exists with the right columns is unknown until checked in Supabase Studio.
- **RLS unverified**: no policy SQL checked in. Anon-insert may already work, may silently fail (RLS enabled with no policy returns no error from the client perspective but writes nothing), or may not be enabled at all.
- **Env vars unverified**: no `.env.local` or `.env.local.example` in the repo. The route handler will return a 500 `"Server configuration error"` if either var is missing (`route.ts:19-25`).
- **Labels missing `htmlFor`**: `app/(main)/rsvp/page.tsx` labels at lines 99, 114, 132, 172, 189, 210 wrap their inputs implicitly but have no `htmlFor` / `id` pairing. UI-SPEC §Accessibility requires explicit pairing.
- **Validation copy missing**: form relies on native `required` browser messages. UI-SPEC §Validation Messaging mandates four custom messages and an `onSubmit` validation flow with `noValidate` on the form.
- **Focus management missing**: no `useEffect` moves focus to the success heading or error banner heading after state transitions. UI-SPEC §Accessibility requires both.
- **Success/error variants missing**: success copy is a single shared message regardless of accept/decline; error copy is a single message regardless of failure type. UI-SPEC requires accept/decline variants and three error-type variants (network/server/validation).
- **Material Symbols `aria-hidden` missing**: decorative icons (`favorite` line 47, `format_quote` line 264, `east` line 251, `error` line 230) lack `aria-hidden="true"`. UI-SPEC requires all decorative icons to be hidden from assistive tech.
- **Conditional reveal not announced**: the `attending !== "decline"` block (line 169) hides/shows without `aria-live="polite"` on the container. UI-SPEC §Interaction Patterns requires it.

## Schema Truth

### Expected `rsvps` table shape

Derived from `app/(main)/api/rsvp/route.ts:29-36` (the insert call) and UI-SPEC §Acceptance Criteria:

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | `uuid` or `bigint` | NOT NULL (PK) | Standard Supabase default — `uuid DEFAULT gen_random_uuid()` or `bigint identity` |
| `full_name` | `text` | NOT NULL | Mapped from form `fullName` |
| `email` | `text` | NOT NULL | Mapped from form `email` |
| `attending` | `boolean` | NOT NULL | `true` if user picked "Delightfully Accept" |
| `guest_count` | `integer` | NOT NULL (form sends `1`-`4`) | Parsed from `"1 Guest"` etc. via `parseInt()` |
| `dietary_restrictions` | `text` | NULL allowed | Sent as `null` when empty |
| `note` | `text` | NULL allowed | Sent as `null` when empty |
| `created_at` | `timestamptz` | NOT NULL `DEFAULT now()` | Audit column required by UI-SPEC §Acceptance |

### Verification path

There is **no Supabase CLI usage in this repo**: no `supabase/` directory, no `supabase/migrations/`, no `supabase/config.toml`, no `supabase` dependency in `package.json`. Schema is managed exclusively through Supabase Studio. The plan must reflect a Studio paste task, not a CLI migration task.

**SQL snippet for the planner to embed in the schema-verify task** (paste into Supabase Studio → SQL Editor):

```sql
-- 1. Inspect current shape
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'rsvps'
ORDER BY ordinal_position;

-- 2. If the table does not exist OR columns are missing, create / patch:
CREATE TABLE IF NOT EXISTS public.rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  attending boolean NOT NULL,
  guest_count integer NOT NULL,
  dietary_restrictions text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. If table exists but a column is missing, ALTER instead (Supabase will not run CREATE if it exists):
-- ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS dietary_restrictions text;
-- ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS note text;
-- ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
```

The verify-then-patch pattern is intentional: this is a live database, and the planner should not assume the table is empty.

## Supabase Wiring

### Client setup

The API route inlines `createClient` from `@supabase/supabase-js` v2.100.0 (verified `package.json`). The shipped `lib/supabase/client.ts` exports a different instance for browser context but is not consumed anywhere. Two paths the planner can choose:

| Path | Description | Tradeoff |
|------|-------------|----------|
| **Keep inline (recommended)** | Leave `route.ts` self-contained; delete or leave unused `lib/supabase/client.ts` alone | Minimal diff. Route handler runs server-side and reads env vars at request time — fine for low-volume RSVP writes. |
| Refactor to `lib/supabase/server.ts` | Add a `lib/supabase/server.ts` exporting `createServerClient()` and import it from the route | Cleaner separation if more routes appear later, but pure refactor — no behavior change. Out of phase scope. |

**Recommendation: keep inline.** UI-SPEC and PROJECT.md emphasize minimal diffs; centralizing the client is a Phase 4+ refactor concern.

### Env vars

| Variable | Used in | Set in `.env.local`? | Set in production? |
|----------|---------|----------------------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `route.ts:16`, `lib/supabase/client.ts:3` | Must be created | Must be set on host |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `route.ts:17` (fallback), `lib/supabase/client.ts:4` | Must be created | Must be set on host |
| `SUPABASE_SERVICE_ROLE_KEY` | `route.ts:17` (preferred if present) | **Do not set** for this phase | **Do not set** |

The route currently prefers `SUPABASE_SERVICE_ROLE_KEY` if it exists. UI-SPEC §Acceptance Criteria explicitly states the anon path is intended for this phase. **Recommendation:** simplify `route.ts:17` to use only `NEXT_PUBLIC_SUPABASE_ANON_KEY`, removing the service-role fallback. This makes the security model explicit (no service-role usage from a route that doesn't need it) and prevents accidental privilege escalation if someone sets the service-role env var later.

`.gitignore` already excludes `.env*` patterns implicitly via `# misc` block — verified `.gitignore` excludes `.env*` line is **absent**, but `.env.local` is never committed by Next.js convention and the `create-next-app` template adds it. **Plan should include creating a `.env.local.example`** documenting the two required vars (no actual values), since none exists.

### RLS verification

No RLS policy SQL is checked in. Same Studio-only constraint as schema verification.

**SQL snippet for the planner to embed in the RLS-verify task** (paste into Supabase Studio → SQL Editor):

```sql
-- 1. Confirm RLS is enabled
SELECT relname, relrowsecurity, relforcerowsecurity
FROM pg_class WHERE relname = 'rsvps';
-- Expect relrowsecurity = true

-- 2. Inspect existing policies
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies WHERE tablename = 'rsvps';

-- 3. If RLS is off, enable it
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- 4. If no insert policy exists for the anon role, create one (write-only — no SELECT policy)
CREATE POLICY "Allow anon inserts" ON public.rsvps
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 5. (Optional but recommended) Allow inserts from authenticated role too, for future admin tooling
CREATE POLICY "Allow authenticated inserts" ON public.rsvps
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

**Critical RLS gotcha:** when RLS is enabled but no policy matches, INSERT calls **silently fail** from the client's perspective — Supabase's PostgREST returns an error in the `error` field, but if the application doesn't check the return value, the user sees "success" while no row is written. The shipped route does check (`route.ts:38-41`) — verify in the smoke test that a real row appears.

## Implementation Approach

Recommended task ordering. The sequence is built to surface infrastructure failures before code polish, and to keep the nav link off until everything works.

| # | Task | Why this order |
|---|------|----------------|
| 1 | **Verify Supabase schema** via Studio SQL snippet; patch if columns missing | Cheapest blocker check. If the table doesn't exist, every code change is wasted until it does. |
| 2 | **Verify RLS** via Studio SQL snippet; enable + write-only anon policy if missing | Same reasoning. RLS misconfiguration is the #1 silent-failure mode for Supabase anon writes. |
| 3 | **Create `.env.local`** with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase project settings; commit `.env.local.example` (no values) | Required for local dev. Documenting the example helps future contributors and the production deploy. |
| 4 | **Simplify route.ts env handling** — remove `SUPABASE_SERVICE_ROLE_KEY` fallback; anon key only | Tightens security model. One-line change. Do it before validation work so any regression is isolated. |
| 5 | **Add per-field validation state + custom messages** to `rsvp/page.tsx` — set `noValidate` on form, track `errors: Partial<Record<keyof FormState, string>>`, run validation in `handleSubmit`, render inline errors below fields with `role="alert"` | Biggest single code change. Do it before focus management so focus targets exist. |
| 6 | **Add `htmlFor` / `id` pairing on all labels** | Small, low-risk accessibility fix. Bundle with validation work since both touch the same JSX. |
| 7 | **Add focus management** — `useRef` for success heading and error banner heading; `useEffect` that moves focus when `status` transitions to `"success"` or `"error"` | Depends on (5) for the error banner heading existing. |
| 8 | **Add success/error variant copy** — branch on `form.attending` for success body, branch on error type for error banner body. Capture HTTP status from `res.status` in the catch path to distinguish 4xx / 5xx / network | UI-SPEC §Success/Error Variants. |
| 9 | **Add `aria-hidden="true"` to decorative icons** + `aria-live="polite"` on conditional reveal container | Pure accessibility pass. Bundle with focus work. |
| 10 | **Enable the nav link** in `components/Navbar.tsx` — uncomment line 15, delete dead comment line 75 | Last code change. Only flip discoverability after the form is verified working. |
| 11 | **Manual smoke checklist** — run the five checks listed in "Testing Approach" below | Final gate. Document results in a brief markdown file or commit message. |

**Why nav-enable is last:** if the nav link is enabled before the form is verified, real guests landing on the site mid-deploy could hit a broken form. Keep it dark until smoke passes.

## Risks & Landmines

### Next.js 16 specifics (verified against `node_modules/next/dist/docs/01-app/`)

| Risk | Reality | Action |
|------|---------|--------|
| Route handler nested inside route group works? | Yes — `app/(main)/api/rsvp/route.ts` resolves to `/api/rsvp`. Route groups partition layouts, not URLs. Verified in `03-api-reference/03-file-conventions/route-groups.md`. | No action. Keep current path. |
| Client `fetch('/api/rsvp')` still idiomatic vs. server actions? | Yes — `01-getting-started/15-route-handlers.md` and `02-guides/forms.md` both confirm route handlers are first-class. Server actions are an alternative, not a replacement. | Keep current pattern. Migration is out of scope. |
| `next/image` deprecations affect this phase? | The form uses a raw `<img>` (line 84, with `eslint-disable-next-line @next/next/no-img-element`), not `next/image`. No risk. UI-SPEC notes the image is an asset task. | No action. |
| Async request APIs (`headers()`, `cookies()`, `params`)? | Not used anywhere in the RSVP code path. | No action. |
| `middleware` → `proxy` rename? | No middleware file in this project. | No action. |
| `priority` → `preload` on `next/image`? | Not used in this phase. | No action. |

### Supabase landmines

| Risk | Mitigation |
|------|-----------|
| **RLS silent failure**: anon role inserts with no policy returns an error, but if no policy *exists*, the client sees the error string — easy to confuse with a generic 500 | Smoke test must check Supabase Studio table view for an actual row, not just the success UI. |
| Service-role key accidentally bypassing RLS | Remove the fallback in `route.ts:17`. Anon-only ensures the RLS policy is exercised. |
| `parseInt("1 Guest")` returning `1` works (parseInt stops at non-digit), but `parseInt("2 Guests")` returns `2` correctly. **No bug here.** Documenting because it looks fragile on review. | None needed. |
| Email format: API accepts anything truthy; no regex validation. UI-SPEC §Validation Messaging requires a "doesn't look right" message. | Add client-side email regex in the validation function. Keep server validation as-is (defense in depth, but the route doesn't reject malformed email currently — out of scope to add). |

### Accessibility / iOS landmines

| Risk | Mitigation |
|------|-----------|
| iOS Safari zoom-on-focus when input font-size < 16px | All inputs already inherit `text-base` (16px). Do not regress to `text-sm`. UI-SPEC §Typography flags this as the "16px input rule." |
| Focus management race: moving focus inside a `useEffect` that runs on every render can flicker | Use a `prevStatus` ref or the `[status]` dependency to ensure the effect only fires on transition, not on every state change. |
| Error banner appears above submit button but focus needs to *land on* the heading — `tabIndex={-1}` required on the heading element for programmatic focus | Add `tabIndex={-1}` to both the error banner `<p>` heading and the success `<h1>`. |
| Native browser validation popups appearing despite `noValidate` | Verify `noValidate` is on the `<form>` element itself (not a button or input). Test in Safari + Chrome — both honor it. |
| Decorative icon screen-reader spam | `aria-hidden="true"` on `favorite`, `format_quote`, `east`, `error` icons. UI-SPEC §Accessibility lists all four. |

### Stitch token landmines

| Risk | Mitigation |
|------|-----------|
| Tempted to add a new error color or weight | UI-SPEC explicitly forbids new tokens. Use existing `text-error` (`#f87171`) and existing Manrope weights (400/500/600/700 only this phase). |
| Hover state on submit button uses `bg-white` (CSS color, not a token) | This is the shipped behavior. Preserve. UI-SPEC documents it as a "Hover-state palette swap." |

## Testing Approach

### What's available

`package.json` has no test framework. No Vitest, no Jest, no Playwright, no Cypress configured. `devDependencies` are: `@tailwindcss/postcss`, `@types/*`, `eslint`, `eslint-config-next`, `tailwindcss`, `typescript`. Adding a test framework would mean a config file, a test setup, and CI wiring — out of phase scope.

### Recommendation: manual smoke checklist

UI-SPEC §Testing accepts this explicitly: *"At minimum: a manual smoke checklist..."*. The five checks are:

1. **Happy-path accept**: navigate to `/rsvp`, fill all fields, pick "Delightfully Accept", select 2 Guests, add dietary text, add note, submit. **Expect:** "Thank You" success view with accept-variant copy ("We can't wait to celebrate with you in Aspen..."). **Verify in Supabase Studio:** a row appears in `rsvps` with `attending = true, guest_count = 2`.
2. **Happy-path decline**: navigate to `/rsvp`, fill name + email, pick "Regretfully Decline", add a note (guest details hidden). Submit. **Expect:** "Thank You" success view with decline-variant copy ("We'll miss you..."). **Verify in Studio:** row with `attending = false, guest_count` set to the form default (`1` because the field is hidden but state is not reset).
3. **Validation error path**: navigate to `/rsvp`, leave Name and Email empty, click Submit. **Expect:** no native browser popup. Inline error under Name: "We need your name to find your invitation." Inline error under Email: "Where should we reach you with details?" Inline error under radios: "Let us know if you can make it." Focus moves to the first invalid field.
4. **Network failure path**: open devtools → Network → set to Offline. Submit a valid form. **Expect:** error banner appears with heading "We couldn't send your RSVP", body referencing `hello@emilyandtyler.com`. Focus moves to the banner heading. Re-enable network, resubmit — expect success.
5. **Mobile viewport**: open devtools → device toolbar → 375px width. **Expect:** no horizontal scroll, form fields full-width, section gaps preserved, radios stack vertically, "Sending…" button label fits.

Document results in a `SMOKE.md` inside the phase folder, or in the PR description. No code artifact required.

### If a test framework is later desired

Next 16 docs at `02-guides/testing/vitest.md` give the canonical setup. Skip for this phase.

## Validation Architecture

**Nyquist enabled (default).** Acceptance criteria below are observable behaviors that prove the phase is done. Each maps to an automated command **only if** a test framework is added (out of scope); for this phase the "automated command" column is "manual" everywhere.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | none configured |
| Config file | none |
| Quick run command | `npm run lint` (only check available) |
| Full suite command | `npm run build` (catches type + build errors) |
| Manual smoke | five-step checklist above |

### Phase Requirements → Verification Map
| Req ID | Behavior | Verification Type | Verification Step |
|--------|----------|-------------------|-------------------|
| REQ-01 | `rsvps` table has all 8 columns with correct types | manual (Studio SQL) | Step 1 of "Implementation Approach" — paste `SELECT column_name...` query, compare to Schema Truth table |
| REQ-02a | Anon env vars present | manual | `cat .env.local` → both vars set; `npm run dev` → no "Server configuration error" on submit |
| REQ-02b | RLS enabled with anon insert policy | manual (Studio SQL) | Step 2 of "Implementation Approach" — confirm `relrowsecurity = true` and policy exists for `anon` |
| REQ-03a | RSVP link visible in desktop nav, last position | manual | Smoke check 1 |
| REQ-03b | RSVP link visible in mobile menu | manual | Smoke check 5 |
| REQ-04a | Custom per-field validation messages render inline | manual | Smoke check 3 |
| REQ-04b | Focus moves to error banner on submit failure | manual | Smoke check 4 |
| REQ-04c | Focus moves to success heading on submit success | manual | Smoke checks 1 + 2 |
| REQ-04d | Accept/decline success variants render | manual | Smoke checks 1 + 2 — compare body copy |
| REQ-04e | Error variants render (network / 5xx / 4xx) | manual | Smoke check 4 (network); 5xx and 4xx require Supabase manipulation, deprioritize unless trivial |
| REQ-04f | All decorative icons have `aria-hidden` | manual (devtools) | Inspect element in devtools; `grep -n 'material-symbols-outlined' app/(main)/rsvp/page.tsx` → each has `aria-hidden="true"` |
| REQ-04g | Labels paired via `htmlFor` / `id` | manual (devtools) | Inspect element; click label → input focuses |
| REQ-04h | No iOS zoom on focus | manual | Smoke check 5 in iOS Safari simulator or real device |
| REQ-05 | Smoke checklist completed | manual | Document in `SMOKE.md` or PR description |

### Sampling Rate
- **Per task commit:** `npm run lint` + `npm run build` (catches type and ESLint regressions)
- **Per wave merge:** full smoke checklist (5 steps, ~10 minutes)
- **Phase gate:** Studio confirms a real row written by step 1 of the smoke checklist

### Wave 0 Gaps
- [ ] `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required for any task that runs `npm run dev` against Supabase
- [ ] `.env.local.example` committed to repo — documents the convention for future contributors
- [ ] `SMOKE.md` template in `.planning/phases/01-rsvp-enablement/` — captures the five-step checklist results

*(No framework install needed.)*

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `npm run dev`, `npm run build` | assumed ✓ | not probed (irrelevant to phase scope) | — |
| Supabase project | RSVP writes | unknown — must be confirmed | — | none; phase cannot ship without it |
| Supabase Studio access | Schema + RLS verification | assumed ✓ (project owner has it) | — | none |
| `@supabase/supabase-js` | API route | ✓ | `^2.100.0` per `package.json` | — |
| `next` | Everything | ✓ | `16.2.6` per `package.json` | — |

**Missing dependencies with no fallback:** Supabase project URL + anon key. The plan must include a task confirming the user has these from Supabase Studio → Settings → API.

## Code Examples

### Per-field validation with `noValidate` + custom messages

Pattern derived from UI-SPEC §Validation Messaging:

```tsx
// Source: UI-SPEC.md §Validation Messaging, §Accessibility Contract
// app/(main)/rsvp/page.tsx — replace handleSubmit and form state

type FormErrors = Partial<Record<"fullName" | "email" | "attending", string>>;

const [errors, setErrors] = useState<FormErrors>({});
const errorBannerRef = useRef<HTMLParagraphElement>(null);
const successHeadingRef = useRef<HTMLHeadingElement>(null);

function validate(): FormErrors {
  const next: FormErrors = {};
  if (!form.fullName.trim()) next.fullName = "We need your name to find your invitation.";
  if (!form.email.trim()) next.email = "Where should we reach you with details?";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    next.email = "That email doesn't look right — double-check the spelling.";
  if (!form.attending) next.attending = "Let us know if you can make it.";
  return next;
}

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  setErrors({});
  setStatus("submitting");
  try {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      // Capture status for error-variant copy
      setErrorKind(res.status >= 500 ? "server" : "validation");
      throw new Error("Submission failed");
    }
    setStatus("success");
  } catch {
    setErrorKind((kind) => kind ?? "network");
    setStatus("error");
  }
}

// On the <form>:
<form noValidate aria-labelledby="rsvp-heading" aria-busy={status === "submitting"} onSubmit={handleSubmit}>

// Inline field error:
{errors.fullName && (
  <p role="alert" className="mt-2 text-error text-xs font-body">
    {errors.fullName}
  </p>
)}
```

### Focus management on state transitions

```tsx
// Source: UI-SPEC.md §Accessibility Contract
useEffect(() => {
  if (status === "success") successHeadingRef.current?.focus();
  if (status === "error") errorBannerRef.current?.focus();
}, [status]);

// On the focus targets:
<h1 ref={successHeadingRef} tabIndex={-1} className="...">Thank You</h1>
<p ref={errorBannerRef} tabIndex={-1} className="text-error text-sm font-body font-medium mb-1">
  {errorHeading}
</p>
```

### Accept/decline success variant

```tsx
// Source: UI-SPEC.md §Success State variant table
const successCopy = form.attending === "decline"
  ? "We'll miss you in Aspen, but thank you for letting us know. We're holding good thoughts for you."
  : "We can't wait to celebrate with you in Aspen. We'll send venue and timing details closer to the wedding.";
```

### Error-type variant

```tsx
// Source: UI-SPEC.md §Error State variant table
type ErrorKind = "network" | "server" | "validation";
const [errorKind, setErrorKind] = useState<ErrorKind | null>(null);

const errorCopy = {
  network: {
    heading: "We couldn't send your RSVP",
    body: <>Check your connection and try again. Still stuck? Email us at <a href="mailto:hello@emilyandtyler.com" className="underline underline-offset-2">hello@emilyandtyler.com</a>.</>,
  },
  server: {
    heading: "Something went wrong on our end",
    body: <>Try again in a minute. If it keeps happening, email us at <a href="mailto:hello@emilyandtyler.com" className="underline underline-offset-2">hello@emilyandtyler.com</a> and we'll add you manually.</>,
  },
  validation: {
    heading: "One of your answers needs a tweak",
    body: "Scroll up and check the highlighted field, then try again.",
  },
}[errorKind ?? "network"];
```

### Nav link enable

```tsx
// Source: components/Navbar.tsx — uncomment line 15, delete dead comment line 75
const links = [
  { label: "Home", href: "/" },
  { label: "Travel & Stay", href: "/travel" },
  { label: "Itinerary", href: "/itinerary" },
  { label: "Things To Do", href: "/things-to-do" },
  { label: "FAQ", href: "/faq" },
  { label: "RSVP", href: "/rsvp" },  // <-- uncomment
];
// And remove the {/* RSVP button — re-enable when ready to collect responses */} comment.
```

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Supabase Studio is the only schema management path (no CLI in use) | Schema Truth | Low — verified by absence of `supabase/` directory, no `supabase` CLI in `package.json`. If user actually uses CLI elsewhere, plan can be adjusted to write a migration file. |
| A2 | A Supabase project already exists for this site | Environment Availability | Medium — if no project exists, the plan needs a "create Supabase project" task. User can confirm in one sentence. |
| A3 | `parseInt("2 Guests")` parsing is intentional, not a bug | Risks & Landmines | None — JavaScript parseInt behavior is stable. |
| A4 | `attending` boolean mapping (`"accept"` → true, `"decline"` → false) is the desired semantic | Schema Truth | None — matches the route handler at `route.ts:32`. |
| A5 | RLS write-only pattern (INSERT policy, no SELECT policy for anon) matches the desired security posture | Supabase Wiring | None — matches UI-SPEC §Acceptance Criteria explicitly. |
| A6 | Removing `SUPABASE_SERVICE_ROLE_KEY` fallback is acceptable | Implementation Approach (#4) | Low — UI-SPEC §Acceptance Criteria states "anon insert is the intended path." |
| A7 | Manual smoke checklist is preferred over installing Vitest/Playwright | Testing Approach | None — UI-SPEC §Testing accepts this explicitly. |

## Open Questions (RESOLVED)

1. **Does a Supabase project already exist with credentials Tyler has access to?**
   - What we know: the code expects `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. No `.env.local` is checked in (correct).
   - What's unclear: whether the project is provisioned or not.
   - **Resolution:** Plan 01-01 Task 1 is a human checkpoint that surfaces this to the user; the executor pauses for credentials before proceeding. If no project exists, the operator provisions it before resuming.

2. **Production deployment target — Vercel, Netlify, self-hosted?**
   - What we know: README is the default `create-next-app` template; no deploy config in repo.
   - What's unclear: where env vars need to be set for production.
   - **Resolution:** Plan 01-04 Task 1 §6 (production env var check) defers to the operator and documents the prod-env requirement in `01-SMOKE.md` — the nav link must not go live in production without the env vars set on the deploy target.

3. **Does the user want `lib/supabase/client.ts` deleted or kept as scaffolding for future use?**
   - What we know: it's unused right now.
   - **Resolution:** Keep. PATTERNS.md and Plan 01-01 Task 4 explicitly leave the file alone (out of phase scope to centralize). Revisit in a future cleanup phase.

## Sources

### Primary (HIGH confidence)
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route-groups.md` — confirms `(main)` route group does not affect URL path
- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` — confirms route handler convention, NextRequest/NextResponse usage
- `node_modules/next/dist/docs/01-app/02-guides/forms.md` — confirms client `fetch` + route handler is a supported pattern alongside server actions
- `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md` — confirms `NEXT_PUBLIC_*` prefix exposes vars to the browser; server-only vars do not need the prefix
- `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` — confirms breaking changes; none affect this phase
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` — confirms `priority` deprecated for `preload` in v16 (not used in this phase)
- `.planning/phases/01-rsvp-enablement/01-UI-SPEC.md` — approved visual + copy + interaction contract
- `app/(main)/rsvp/page.tsx`, `app/(main)/api/rsvp/route.ts`, `components/Navbar.tsx`, `lib/supabase/client.ts`, `app/globals.css`, `app/layout.tsx`, `app/(main)/layout.tsx`, `package.json`, `tsconfig.json` — direct file reads

### Secondary (MEDIUM confidence)
- [Supabase Row Level Security docs](https://supabase.com/docs/guides/database/postgres/row-level-security) — write-only RLS policy pattern (INSERT-only with `WITH CHECK`, no SELECT)
- [Supabase RLS Simplified troubleshooting](https://supabase.com/docs/guides/troubleshooting/rls-simplified-BJTcS8) — silent-failure behavior when no policy matches
- [Supabase API security guide](https://supabase.com/docs/guides/api/securing-your-api) — anon vs. authenticated role semantics

### Tertiary (LOW confidence)
- None — every claim above is either directly verified against shipped files or against official Next 16 / Supabase docs.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — fixed by PROJECT.md and `package.json`
- Architecture / Next 16 patterns: HIGH — verified against `node_modules/next/dist/docs/`
- Supabase wiring: HIGH for the code path, MEDIUM for live infrastructure state (needs user-side confirmation per Open Question 1)
- Pitfalls: HIGH — UI-SPEC and Next 16 docs are explicit about all relevant gotchas

**Research date:** 2026-05-28
**Valid until:** 2026-06-28 (30 days — stack is mature and locked)

## RESEARCH COMPLETE
