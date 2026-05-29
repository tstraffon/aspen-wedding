# Phase 1: RSVP Enablement — Pattern Map

**Mapped:** 2026-05-28
**Files analyzed:** 6 (4 code changes + 1 new env-example + 1 new smoke checklist)
**Analogs found:** 5 / 6 (smoke checklist has no in-repo analog; use UI-SPEC §Testing)

## Scope Recap

This is a polish-and-enable phase, not a rebuild. The existing `app/(main)/rsvp/page.tsx` is the visual baseline — preserve every shipped class string unless UI-SPEC explicitly contradicts it. The closest in-repo analog for the React additions (focus management, `htmlFor`/`id` pairing, error banner with `role="alert"`, loading-state button label, try/catch fetch flow) is `app/login/page.tsx`. Copy its conventions; do not invent new ones.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `app/(main)/rsvp/page.tsx` (modify) | page (client component, form) | request-response | `app/login/page.tsx` | exact (both: client form, fetch to route handler, try/catch, error banner with `role="alert"`, `htmlFor`/`id` labels, loading-state button label, disabled during submit) |
| `app/(main)/api/rsvp/route.ts` (modify) | route handler | request-response | `app/api/auth/login/route.ts` | exact (both: POST handler, early-return `NextResponse.json({ error }, { status })`, env var read with explicit 500 on missing config) |
| `components/Navbar.tsx` (modify) | layout component | static | self (the existing `links` array is its own pattern) | trivial — uncomment one line, delete one comment |
| `.env.local.example` (new) | config | static | none in repo (no existing example file) | no analog — follow the env var list documented in RESEARCH §Supabase Wiring |
| `.planning/phases/01-rsvp-enablement/01-SMOKE.md` (new) | docs / checklist | n/a | none in repo (no prior smoke files) | no analog — use the 5-step checklist verbatim from RESEARCH §Testing Approach |
| Supabase schema + RLS SQL | infrastructure | n/a | inline in RESEARCH (Studio paste) | n/a — not a repo file |

---

## Pattern Assignments

### `app/(main)/rsvp/page.tsx` (page, request-response)

**Primary analog:** `app/login/page.tsx`
**Secondary analog:** the file itself (existing JSX is the visual baseline — preserve)

This file is being modified, not rewritten. The diff should be surgical: add per-field error state, add refs + focus effect, add `htmlFor`/`id` pairing, add `aria-hidden` to decorative icons, swap inline error copy for the variant-aware version, branch success copy on `form.attending`. Every other class string stays as shipped.

**State pattern — copy shape from `app/login/page.tsx:8-10`:**

```tsx
// app/login/page.tsx lines 8-10
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
```

Apply the same shape (separate `useState` calls, plain primitives) for the new RSVP state additions. Do not introduce a reducer; the existing `useState<FormState>` + `useState<status>` pattern in `rsvp/page.tsx:15-25` is the convention.

**Submit handler pattern — copy try/catch + status branching from `app/login/page.tsx:12-34`:**

```tsx
// app/login/page.tsx lines 12-34
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError("That access code didn’t match. Check your invitation and try again.");
    }
  } catch {
    setError("Couldn’t connect to the server. Please check your internet connection and try again.");
  } finally {
    setLoading(false);
  }
}
```

The RSVP version must add: (1) `validate()` call before `setStatus("submitting")`, (2) `res.status` branching to set an `errorKind` of `"server" | "validation"` (and default to `"network"` in the catch). The shape — `try { fetch → branch on ok } catch { set error } finally { reset loading }` — is the project convention. Match it.

**Error banner pattern — copy structure from `app/login/page.tsx:97-104`:**

```tsx
// app/login/page.tsx lines 97-104
{error && (
  <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-lg" role="alert">
    <span className="material-symbols-outlined text-error text-lg shrink-0">error</span>
    <p className="text-error font-body text-sm">
      {error}
    </p>
  </div>
)}
```

The shipped RSVP error banner at `app/(main)/rsvp/page.tsx:228-241` is already in this shape with a slightly richer body (heading + paragraph). Preserve that two-line shape; only swap (a) the heading/body copy for the three variants from UI-SPEC §Error State, (b) add `aria-hidden="true"` to the `error` icon span, (c) add `tabIndex={-1}` and `ref={errorBannerRef}` to the heading `<p>` so focus management can target it, (d) add `aria-live="assertive"` to the wrapper `<div>`.

**`htmlFor` / `id` pairing pattern — copy from `app/login/page.tsx:80-94`:**

```tsx
// app/login/page.tsx lines 80-94
<label
  className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1"
  htmlFor="password"
>
  Access Code
</label>
<input
  className="w-full bg-surface-variant/50 border border-outline/30 ..."
  id="password"
  placeholder="Enter your access code"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>
```

Apply to all six labels in `app/(main)/rsvp/page.tsx` lines 99, 114, 132, 172, 189, 210. Use stable kebab-case IDs: `rsvp-full-name`, `rsvp-email`, `rsvp-attending` (radio group — `htmlFor` on the group label is fine even without a single matching `id`; per-radio `id` is `rsvp-attending-accept` / `rsvp-attending-decline`), `rsvp-guest-count`, `rsvp-dietary-restrictions`, `rsvp-note`. Add `aria-required="true"` to Name, Email, and the radio inputs (UI-SPEC §Accessibility Contract).

**Loading-state button label pattern — copy from `app/login/page.tsx:107-113`:**

```tsx
// app/login/page.tsx lines 107-113
<button
  className="w-full bg-primary text-on-primary py-5 font-label text-xs uppercase tracking-[0.3em] hover:brightness-110 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
  type="submit"
  disabled={loading}
>
  {loading ? "Verifying..." : "Enter Site"}
</button>
```

The RSVP submit button at `app/(main)/rsvp/page.tsx:242-253` already ships the `disabled={status === "submitting"}` + `{status === "submitting" ? "Sending…" : "Submit Response"}` pattern in the exact same shape. No changes needed beyond adding `aria-disabled={status === "submitting"}` and `aria-busy={status === "submitting"}` on the parent `<form>` per UI-SPEC §Button States.

**Focus management pattern — no analog in repo; use RESEARCH §Code Examples:**

```tsx
// New pattern (from RESEARCH.md lines 388-400, derived from UI-SPEC §Accessibility Contract)
const errorBannerRef = useRef<HTMLParagraphElement>(null);
const successHeadingRef = useRef<HTMLHeadingElement>(null);

useEffect(() => {
  if (status === "success") successHeadingRef.current?.focus();
  if (status === "error") errorBannerRef.current?.focus();
}, [status]);

// Targets:
<h1 ref={successHeadingRef} tabIndex={-1} className="font-headline text-5xl text-on-surface mb-6">Thank You</h1>
<p ref={errorBannerRef} tabIndex={-1} className="text-error text-sm font-body font-medium mb-1">
  {errorCopy.heading}
</p>
```

The `useEffect` depends only on `[status]` so it fires on transition, not every render. Both focus targets need `tabIndex={-1}` for programmatic focus.

**Decorative icon pattern — apply `aria-hidden="true"` to four icons:**

| Line | Icon | Current | Required |
|------|------|---------|----------|
| `rsvp/page.tsx:47` | `favorite` (success heart) | no `aria-hidden` | add `aria-hidden="true"` |
| `rsvp/page.tsx:230` | `error` (banner icon) | no `aria-hidden` | add `aria-hidden="true"` |
| `rsvp/page.tsx:250` | `east` (button arrow) | no `aria-hidden` | add `aria-hidden="true"` |
| `rsvp/page.tsx:263` | `format_quote` (quote section) | no `aria-hidden` | add `aria-hidden="true"` |

**Conditional reveal pattern** — wrap the `{form.attending !== "decline" && (...)}` block at `rsvp/page.tsx:169` in a container with `aria-live="polite"` so the show/hide announces. The simplest fix: change the wrapping `<div>` (line 170) to include `aria-live="polite"` and render it unconditionally, toggling visibility via state-driven Tailwind `hidden`. Alternative: keep the conditional render but ensure the parent has `aria-live="polite"`. Either matches UI-SPEC §Interaction Patterns; prefer the smaller diff (wrap the existing JSX in an always-mounted `<div aria-live="polite">`).

**Success-variant pattern — branch on `form.attending`:**

```tsx
// New (from RESEARCH.md lines 405-409, UI-SPEC §Success State variant table)
const successBody = form.attending === "decline"
  ? "We'll miss you in Aspen, but thank you for letting us know. We're holding good thoughts for you."
  : "We can't wait to celebrate with you in Aspen. We'll send venue and timing details closer to the wedding.";
```

Replace the static body at `rsvp/page.tsx:56-59` with `{successBody}`. The heading stays "Thank You" for both variants per UI-SPEC.

**Error-variant pattern — branch on `errorKind` state:**

```tsx
// New (from RESEARCH.md lines 413-431, UI-SPEC §Error State variant table)
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

Set `errorKind` in `handleSubmit`: `res.status >= 500 ? "server" : "validation"` for non-ok responses, `"network"` in the catch block. Reset to `null` at the start of every submit.

**Per-field validation pattern — no in-repo analog; use RESEARCH §Code Examples:**

```tsx
// New (from RESEARCH.md lines 332-383, UI-SPEC §Validation Messaging)
type FormErrors = Partial<Record<"fullName" | "email" | "attending", string>>;
const [errors, setErrors] = useState<FormErrors>({});

function validate(): FormErrors {
  const next: FormErrors = {};
  if (!form.fullName.trim()) next.fullName = "We need your name to find your invitation.";
  if (!form.email.trim()) next.email = "Where should we reach you with details?";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    next.email = "That email doesn't look right — double-check the spelling.";
  if (!form.attending) next.attending = "Let us know if you can make it.";
  return next;
}

// Inline field error rendering:
{errors.fullName && (
  <p id="rsvp-full-name-error" role="alert" className="mt-2 text-error text-xs font-body">
    {errors.fullName}
  </p>
)}
```

Add `noValidate` to the `<form>` element (line 95). Wire each input to its error via `aria-describedby={errors.fullName ? "rsvp-full-name-error" : undefined}` and `aria-invalid={errors.fullName ? "true" : undefined}`. After successful validation, set `errors` to `{}` before transitioning status. Focus the first invalid field after `setErrors` so the user lands on the problem (UI-SPEC §Validation Messaging).

---

### `app/(main)/api/rsvp/route.ts` (route handler, request-response)

**Analog:** `app/api/auth/login/route.ts`

**Imports + signature pattern** (login lines 1-3, rsvp lines 1-4):

```ts
// app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
```

Both files use the same shape. The RSVP route additionally imports `NextRequest` (only the type) and `createClient` from `@supabase/supabase-js`. Preserve all imports.

**Early-return missing-config pattern** (login lines 5-12, rsvp lines 16-25):

```ts
// app/api/auth/login/route.ts lines 5-12
const accessCode = process.env.SITE_ACCESS_CODE;

if (!accessCode) {
  return NextResponse.json(
    { error: "Access code not configured" },
    { status: 500 }
  );
}
```

The RSVP route ships the same pattern at lines 16-25. **Modification:** simplify line 17 from `process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` to `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`. One-line change. Drop the service-role fallback per RESEARCH §Supabase Wiring (security tightening; anon insert is the intended path).

```ts
// After modification — rsvp/route.ts line 17
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

**Validation error response pattern** (login lines 14-19, rsvp lines 9-14):

```ts
// app/api/auth/login/route.ts lines 14-19
if (password !== accessCode) {
  return NextResponse.json(
    { error: "Invalid access code" },
    { status: 401 }
  );
}
```

The RSVP route's existing `if (!fullName || !email || !attending)` at lines 9-14 follows the same shape with a `400` status. Preserve as-is. The client will branch on `res.status >= 500 ? "server" : "validation"`, so 400 maps to the validation error variant correctly.

**Optional tightening (low priority):** the current error response on Supabase insert failure (line 40) echoes `error.message` to the client. This leaks PostgREST error detail. Replace with a generic message — match the login route's style:

```ts
// Suggested rsvp/route.ts line 38-41 replacement
if (error) {
  console.error("Supabase insert error:", error);
  return NextResponse.json(
    { error: "Could not save RSVP" },
    { status: 500 }
  );
}
```

Keep `console.error` for server-side diagnostics. Drop the raw `error.message` from the response body.

---

### `components/Navbar.tsx` (layout component, static)

**Analog:** the file itself — the existing `links` array is the pattern.

**Modification 1** (line 15): uncomment the RSVP entry.

```tsx
// components/Navbar.tsx line 15 — current
// { label: "RSVP", href: "/rsvp" },

// After modification
{ label: "RSVP", href: "/rsvp" },
```

**Modification 2** (line 75): delete the dead comment.

```tsx
// components/Navbar.tsx line 75 — current
{/* RSVP button — re-enable when ready to collect responses */}

// After modification — remove the line entirely
```

No structural change. The existing desktop nav loop (lines 41-63) and mobile nav loop (lines 84-105) both iterate `links` and apply the active-state class via `pathname.startsWith(href)`. `/rsvp` will inherit the existing treatment without modification. UI-SPEC §Navbar Enablement confirms no special button styling — link parity is the goal.

**Verification step (not a code change):** confirm RSVP renders as the last item in the desktop nav (after FAQ) and the last item in the mobile menu. The shipped order in the `links` array places it correctly after uncommenting.

---

### `.env.local.example` (new, config)

**Analog:** none in repo. No `.env.local`, no example file, no `.gitignore` entry for `.env*` (verified in RESEARCH §Supabase Wiring).

**Content pattern** (derived from RESEARCH §Env vars table):

```bash
# Supabase project URL — found in Supabase Studio → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase anon (public) key — found in Supabase Studio → Project Settings → API
# Safe to expose to the browser; RLS policies enforce write-only access.
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Two vars only. Do **not** include `SUPABASE_SERVICE_ROLE_KEY` in the example — the route handler no longer reads it after the route.ts simplification, and listing it invites accidental usage. Do **not** include `SITE_ACCESS_CODE` (used by the proxy/login flow but already wired; out of phase scope).

**Concurrent task:** add `.env*` to `.gitignore` if not already present. Verify the existing `.gitignore` first; if `.env*.local` is missing, add it before committing `.env.local.example` (which is intentionally tracked).

---

### `.planning/phases/01-rsvp-enablement/01-SMOKE.md` (new, docs)

**Analog:** none in repo. No prior smoke checklists.

**Content pattern** — copy the 5-step checklist verbatim from RESEARCH §Testing Approach (lines 253-261). Structure each step as a markdown checkbox with the "Expect" and "Verify in Studio" sub-bullets. Add a header noting date executed, environment (local/prod), and result (pass/fail). One file, ~40 lines.

```markdown
# Phase 1 — RSVP Smoke Checklist

**Executed:** YYYY-MM-DD
**Environment:** local | production
**Result:** pass | fail

## 1. Happy-path accept
- [ ] Navigate to `/rsvp`, fill all fields, pick "Delightfully Accept", select 2 Guests, add dietary text, add note, submit.
- [ ] **Expect:** "Thank You" view with accept-variant copy.
- [ ] **Verify in Supabase Studio:** row with `attending = true, guest_count = 2`.

## 2. Happy-path decline
- [ ] ...

## 3. Validation error path
- [ ] ...

## 4. Network failure path
- [ ] ...

## 5. Mobile viewport (375px)
- [ ] ...
```

The executor fills in the date and result fields after running each check.

---

## Shared Patterns

### Error banner shape (applies to both `rsvp/page.tsx` and any future form)

**Source:** `app/login/page.tsx:97-104` (and the existing shape in `rsvp/page.tsx:228-241`)

```tsx
<div className="flex items-{start|center} gap-3 p-4 bg-error/10 border border-error/20 rounded-lg" role="alert">
  <span className="material-symbols-outlined text-error text-lg shrink-0" aria-hidden="true">error</span>
  <div>
    <p className="text-error text-sm font-body font-medium mb-1">{heading}</p>
    <p className="text-error/80 text-sm font-body font-light">{body}</p>
  </div>
</div>
```

The RSVP banner is the richer two-paragraph variant (heading + body); the login banner is the single-paragraph variant. Both use the same wrapper classes and `role="alert"`. Preserve the wrapper shape; only the inner copy changes per error kind.

### Fetch + try/catch + status branching (applies to any client form posting to a route handler)

**Source:** `app/login/page.tsx:12-34`

```tsx
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError("");          // clear prior error
  setLoading(true);      // set in-flight state
  try {
    const res = await fetch(URL, { method: "POST", headers: {...}, body: JSON.stringify(...) });
    if (res.ok) { /* success path */ }
    else { /* set error from server response */ }
  } catch {
    /* set error for network failure */
  } finally {
    setLoading(false);
  }
}
```

The RSVP `handleSubmit` already follows this shape; the phase work refines the error branches to set `errorKind` for variant copy.

### Material Symbols icon with `aria-hidden`

**Source:** new convention introduced this phase (no in-repo example yet)

```tsx
<span className="material-symbols-outlined ..." aria-hidden="true">{iconName}</span>
```

Apply to every decorative `<span className="material-symbols-outlined">` in `rsvp/page.tsx` (favorite, error, east, format_quote). The decision icon in the radio inputs is a native form control, not Material Symbols, so it does not need the attribute.

### Route handler — env var read + early-return shape

**Source:** `app/api/auth/login/route.ts:5-12`

```ts
const value = process.env.VAR_NAME;
if (!value) {
  return NextResponse.json({ error: "..." }, { status: 500 });
}
```

The RSVP route already follows this shape. The modification is to drop the service-role fallback on one line; the overall pattern stays.

---

## No Analog Found

| File | Role | Data Flow | Reason | Source to Use Instead |
|------|------|-----------|--------|-----------------------|
| Focus-management `useEffect` + `tabIndex={-1}` targets | a11y pattern | event-driven | No existing focus-management pattern in repo | RESEARCH §Code Examples (lines 388-400) + UI-SPEC §Accessibility Contract |
| Per-field validation with `noValidate` + inline errors | form state | request-response | Existing forms (login) only have a single error state, not per-field | RESEARCH §Code Examples (lines 332-383) + UI-SPEC §Validation Messaging |
| `aria-live="polite"` on conditional-reveal container | a11y pattern | event-driven | No existing live-region pattern in repo | UI-SPEC §Interaction Patterns (Conditional Reveal) |
| `.env.local.example` | config | static | No prior env example file | RESEARCH §Env vars table |
| Smoke checklist markdown | docs | n/a | No prior smoke files in `.planning/` | RESEARCH §Testing Approach (the 5 steps verbatim) |

---

## Preservation Guarantee

The phase is preservation-heavy. The executor should treat the shipped `app/(main)/rsvp/page.tsx` JSX as the visual baseline. Specifically, the following must not change:

- All Tailwind class strings on existing elements except where adding `aria-hidden`, `id`, `htmlFor`, `aria-required`, `aria-invalid`, `aria-describedby`, `noValidate`, `aria-busy`, `aria-live`, `tabIndex`, `ref`
- The 12-column grid layout (`lg:grid-cols-12`, `lg:col-span-5`, `lg:col-span-7`)
- The `space-y-12` form section rhythm
- The hero image block (Maroon Bells `<img>` — asset task, not code)
- The quote section at the bottom (`mt-48 px-8 md:px-12 max-w-7xl ...`)
- The submit button styling (`bg-primary hover:bg-white` hover swap, `py-6`, `tracking-[0.4em]`)
- The success view's `favorite` icon, "Thank You" heading, and editorial centered layout

What changes:
- Add refs + `tabIndex={-1}` on success `<h1>` and error banner heading `<p>`
- Add `htmlFor` / `id` pairs on six labels
- Add `noValidate` to `<form>`, `aria-busy` and `aria-labelledby` on `<form>`
- Add inline `<p role="alert">` after each invalid field
- Swap static success body for `{successBody}` (variant-aware)
- Swap static error heading + body for `{errorCopy.heading}` / `{errorCopy.body}` (kind-aware)
- Add `aria-hidden="true"` to four decorative icons
- Wrap conditional-reveal block in `aria-live="polite"` container

Everything else stays as shipped.

---

## Metadata

**Analog search scope:** `app/`, `components/`, `lib/`
**Files scanned:**
- `app/(main)/rsvp/page.tsx` (current state of the file being polished)
- `app/(main)/api/rsvp/route.ts` (current state of the route being tightened)
- `app/api/auth/login/route.ts` (sibling route handler — exact analog)
- `app/login/page.tsx` (sibling form page — exact analog for fetch + error + a11y)
- `components/Navbar.tsx` (file being modified)
- `components/HotelTabs.tsx` (other client form-ish component — useful for confirming `useState` + Tailwind class conventions; no direct pattern reuse)
- `lib/supabase/client.ts` (unused but verified; no refactor recommended)
- `proxy.ts` (verified — unrelated to RSVP path)

**Pattern extraction date:** 2026-05-28

## PATTERN MAPPING COMPLETE
