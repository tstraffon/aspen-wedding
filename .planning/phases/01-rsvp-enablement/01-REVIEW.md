---
phase: 01-rsvp-enablement
reviewed: 2026-05-29T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - app/(main)/api/rsvp/route.ts
  - app/(main)/rsvp/page.tsx
  - components/Navbar.tsx
findings:
  critical: 1
  warning: 6
  info: 5
  total: 12
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-05-29
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

Backend route is small and follows the documented anon-write-only pattern, but it does almost no input hardening: payload size, field types, string lengths, and value ranges are all unchecked, and one field (`guestCount`) gets coerced via `parseInt` in a way that can silently insert `NaN` into the database. The form is well-scoped for accessibility and error UX, with several small gaps around the conditional guest section and a stale-error UX issue when the user toggles attendance. Navbar has a dead-code anti-pattern in its active-link logic that quietly disables hash-link highlighting.

No secrets, no XSS sinks, no injection vectors via raw SQL — Supabase parameterizes inserts. The main risk surface is the absence of server-side validation/bounding on a public, unauthenticated POST endpoint.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01: `parseInt(guestCount)` writes `NaN` to database for decliners and unexpected values

**File:** `app/(main)/api/rsvp/route.ts:33`
**Issue:** The route always calls `parseInt(guestCount)` regardless of the `attending` value. The form sends `guestCount` as the string `"1 Guest"`, `"2 Guests"`, etc. — `parseInt("1 Guest")` happens to return `1`, so the happy path works, but:

1. When the user declines, the form still ships whatever `guestCount` is in state (default `"1 Guest"`), so declines silently get `guest_count: 1` rather than `null` or `0` — distorting the count.
2. `parseInt` is called with no radix; if the option strings are ever changed (e.g., to "One Guest"), the result becomes `NaN`, and depending on the column type this either inserts `NaN` (text) or fails with a Postgres error that the user sees as a generic 500.
3. If a malicious client posts `{"guestCount": "0; DROP"}` or `{"guestCount": null}`, `parseInt` returns `0` or `NaN` with no validation feedback.

There is also no upper bound — a client can post `{"guestCount": "9999"}` and it will be written verbatim.

**Fix:**
```ts
// Validate and clamp on the server. Treat declines as null.
const isAttending = attending === "accept";
let guestCountValue: number | null = null;
if (isAttending) {
  const parsed = parseInt(String(guestCount ?? ""), 10);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 4) {
    return NextResponse.json(
      { error: "guestCount must be between 1 and 4" },
      { status: 400 }
    );
  }
  guestCountValue = parsed;
}

const { error } = await supabase.from("rsvps").insert({
  full_name: fullName,
  email,
  attending: isAttending,
  guest_count: guestCountValue,
  dietary_restrictions: dietaryRestrictions || null,
  note: note || null,
});
```

## Warnings

### WR-01: No length or type bounds on free-text fields — public endpoint accepts arbitrary payload size

**File:** `app/(main)/api/rsvp/route.ts:5-36`
**Issue:** `request.json()` parses unbounded input. `fullName`, `email`, `dietaryRestrictions`, and `note` are passed straight through to the insert with no length cap and no type check. An attacker can post a 50 MB JSON body or megabyte-sized strings, and the only ceiling is whatever the Next.js runtime imposes. There is also no `typeof x === "string"` guard, so `{"fullName": {"$ne": null}}` or `{"email": ["a","b"]}` flow through to Supabase, which may either coerce or reject with a confusing 500.

**Fix:** Add a small validation block before the insert:
```ts
function isNonEmptyString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= max;
}
if (!isNonEmptyString(fullName, 200) || !isNonEmptyString(email, 320)) {
  return NextResponse.json({ error: "Invalid name or email" }, { status: 400 });
}
if (dietaryRestrictions != null && (typeof dietaryRestrictions !== "string" || dietaryRestrictions.length > 500)) {
  return NextResponse.json({ error: "Invalid dietary restrictions" }, { status: 400 });
}
if (note != null && (typeof note !== "string" || note.length > 2000)) {
  return NextResponse.json({ error: "Note too long" }, { status: 400 });
}
```

### WR-02: No email format validation on the server

**File:** `app/(main)/api/rsvp/route.ts:9-14`
**Issue:** The server only checks truthiness on `email`. Client-side validation is bypassable — a direct POST with `{"email": " "}` (truthy after JSON parse, untrimmed) or `{"email": "not-an-email"}` succeeds and pollutes the table. The server should re-validate the same regex the client uses (or stricter) since this is a public unauthenticated endpoint.

**Fix:**
```ts
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (typeof email !== "string" || !emailRegex.test(email.trim())) {
  return NextResponse.json({ error: "Invalid email" }, { status: 400 });
}
```

### WR-03: No request body try/catch — malformed JSON returns an unhandled 500

**File:** `app/(main)/api/rsvp/route.ts:5`
**Issue:** `await request.json()` throws on malformed input. There is no surrounding try/catch, so a request with `Content-Type: application/json` and body `not json` produces an unhandled exception and a generic 500. The client-side error handling classifies any 500 as "server" — the user sees "Something went wrong on our end" for what is actually a malformed client request. Beyond UX, this also makes the route easier to flood for log noise.

**Fix:**
```ts
let body: unknown;
try {
  body = await request.json();
} catch {
  return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
}
if (!body || typeof body !== "object") {
  return NextResponse.json({ error: "Invalid body" }, { status: 400 });
}
```

### WR-04: No rate limiting or duplicate-submission protection on a public RSVP endpoint

**File:** `app/(main)/api/rsvp/route.ts:4-47`
**Issue:** The endpoint is unauthenticated (only the session-cookie proxy gate stands between the open internet and this insert). Nothing prevents a single client from submitting 10,000 RSVPs in a loop, and the same email can RSVP unlimited times because the schema (per summary) does not appear to enforce a unique constraint on `email`. The proxy gate is a soft barrier — anyone with the session cookie (i.e., any invited guest who shares the URL) can spam.

**Fix:** At minimum, add a Postgres unique constraint on `lower(email)` and surface the duplicate-key error as a friendly 409 ("It looks like you've already responded — email us to update"). For broader protection, add a basic IP-based rate limit (e.g., Upstash Ratelimit) of N submissions per minute.

### WR-05: Stale validation errors persist when user changes their answers

**File:** `app/(main)/rsvp/page.tsx:220-222, 252-254, 293-295, 308-310`
**Issue:** Field-level errors live in `errors` state but are only cleared on next submit (via `setErrors({})` at line 70 after re-validation passes). If a user submits with an empty name, sees the error, types into the name field, the `aria-invalid="true"` and red error message stay visible until they hit submit again. Screen readers will continue to announce the field as invalid while the user is correcting it. This is mildly hostile and contradicts the "polished per UI-SPEC" claim.

**Fix:** Clear a field's error on change:
```tsx
onChange={(e) => {
  setForm((f) => ({ ...f, fullName: e.target.value }));
  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
}}
```
(Repeat for email and the two radios.)

### WR-06: Hidden guest-detail fields still ship their values; declines silently include `dietaryRestrictions`

**File:** `app/(main)/rsvp/page.tsx:76, 332-377`
**Issue:** When `attending === "decline"`, the guest-detail block unmounts visually, but `form.dietaryRestrictions` and `form.guestCount` remain in state and are sent in the POST body. If a user types a dietary restriction, then switches to "Regretfully Decline" and submits, the row in Supabase carries leftover dietary text that the user can no longer see or edit. Combined with CR-01, `guest_count: 1` is also written for every decline.

**Fix:** Either reset those fields when toggling to decline, or strip them in the submit body:
```tsx
const payload = form.attending === "decline"
  ? { ...form, guestCount: "", dietaryRestrictions: "" }
  : form;
body: JSON.stringify(payload),
```
And mirror the same gating on the server (CR-01 already covers `guestCount`).

## Info

### IN-01: Navbar `isActive` check is dead-code defensive — `href === pathname` is always false for child routes

**File:** `components/Navbar.tsx:53-54, 95-96`
**Issue:** The active-link className uses `isActive && href === pathname`. But `isActive` is already computed with `pathname.startsWith(href)`, which is satisfied by both exact matches *and* descendants. The extra `href === pathname` clause then re-narrows to exact matches only, making the `startsWith` branch unreachable. Net effect: `/travel/flights` does not highlight the "Travel & Stay" link. Also, the hash-link branches (lines 46-47, 87-88) are wrapped in a comment-out so they currently do nothing.

**Fix:** Drop the redundant clause and let `isActive` stand on its own:
```tsx
className={`... ${isActive ? "text-primary" : "text-on-surface-variant hover:text-primary"}`}
```

### IN-02: Duplicated link-rendering logic in Navbar

**File:** `components/Navbar.tsx:41-63, 77-106`
**Issue:** Desktop and mobile menus duplicate the active-link computation and the link-className expression. Any fix to IN-01 has to be applied in two places; bugs will diverge.

**Fix:** Extract a `NavLink` subcomponent or compute the className via a shared helper.

### IN-03: Image is loaded from a Google user-content URL

**File:** `app/(main)/rsvp/page.tsx:186`
**Issue:** The Maroon Bells image is fetched from `lh3.googleusercontent.com/aida-public/...`, presumably a Google AI Studio export URL. These URLs are not contractually stable and have been known to expire or rotate. The eslint-disable comment hides that this should probably be a `next/image` with a local asset.

**Fix:** Save the asset under `public/images/` and use `<Image>` from `next/image`. If kept remote, add the host to `next.config` `images.remotePatterns` and switch to `<Image>` so it's optimized and at least monitored.

### IN-04: Success message conditional reads `attending === "decline"` after submit, not the persisted value

**File:** `app/(main)/rsvp/page.tsx:96-98`
**Issue:** Functionally correct today, but the success branch derives copy from `form.attending`. If anything in the codebase ever re-renders the page state (e.g., a future "edit your RSVP" feature, or the success state is shared across submissions), the displayed copy may not match the response that was actually saved. Lower priority than the bugs above.

**Fix:** Carry the submitted `attending` value into a local `submittedAttending` state on success, or have the API echo it back and key the success copy off the response.

### IN-05: `errorKind` updater uses `prev ?? "network"` after `setErrorKind(null)` at submit start

**File:** `app/(main)/rsvp/page.tsx:52, 79, 84`
**Issue:** `setErrorKind(null)` runs at the top of `handleSubmit`, then `setErrorKind(res.status >= 500 ? "server" : "validation")` runs synchronously inside the same handler before any throw. In the catch, `setErrorKind((prev) => prev ?? "network")` is meant to preserve the more specific reason. This works because React batches and the queued updater reads the latest queued value — but the intent is opaque. A future maintainer who refactors the try/catch may break the ordering.

**Fix:** Use a local variable to track the kind inside the handler and call `setErrorKind` once:
```tsx
let kind: ErrorKind | null = null;
try {
  const res = await fetch(...);
  if (!res.ok) {
    kind = res.status >= 500 ? "server" : "validation";
    throw new Error("Submission failed");
  }
  setStatus("success");
} catch {
  setErrorKind(kind ?? "network");
  setStatus("error");
}
```

---

_Reviewed: 2026-05-29_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
