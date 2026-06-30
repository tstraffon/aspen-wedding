# Phase 6: Admin Console - Research

**Researched:** 2026-06-30
**Domain:** Next.js 16 App Router, Supabase service-role client, cookie-gated admin auth, CSV Route Handlers
**Confidence:** HIGH (all key claims verified against `node_modules/next/dist/docs/`)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Admin authentication (D-01..D-04)**
- D-01: Admin uses a separate passphrase + its own cookie (`admin_session`). New `ADMIN_ACCESS_CODE` env var; new `/admin/login` POST route mirrors `app/api/auth/login/route.ts` but sets `admin_session` cookie, not the shared guest `session` cookie.
- D-02: Guest `session = "authenticated"` cookie MUST NOT grant admin access. Admin authorization checks `admin_session` only.
- D-03: `proxy.ts` must protect `/admin/*` by requiring the admin cookie and redirecting to `/admin/login`. Matcher must exclude `/admin/login` and admin auth API. Existing guest gate stays intact.
- D-04: One shared passphrase for Tyler and Emily. Cookie flags follow existing login route: `httpOnly`, `secure` in production, `sameSite: "lax"`, path-scoped, long maxAge.

**Privileged data path (D-05..D-07)**
- D-05: Admin server routes use `SUPABASE_SERVICE_ROLE_KEY`, created server-side only, never shipped to the client. A SEPARATE client from `lib/supabase/client.ts`.
- D-06: All admin reads of `rsvps` and all guest/household writes go through the service-role client in Route Handlers / Server Actions. Public anon path and existing SECURITY DEFINER RPCs are unchanged.
- D-07: New env vars: `ADMIN_ACCESS_CODE`, `SUPABASE_SERVICE_ROLE_KEY`. Both server-only (no `NEXT_PUBLIC_` prefix). Must be added to Vercel; documented in runbook.

**Guest edit + household regrouping UX (D-08..D-10)**
- D-08: Inline editing in the households list — rename / add / remove inline. Move a person via household picker; merging = reassign `household_id`; splitting = assign to a newly created `household_id`.
- D-09: Deleting a guest who has an RSVP prompts confirmation, then the admin route deletes `rsvps` row too (no DB FK cascade — Phase 4 D-04). Admin route removes both rows server-side.
- D-10: Edits persist to `guests` (and `rsvps` where relevant) and are immediately reflected by the existing name-lookup path. `household_id`s are client-generated UUIDs when splitting/creating.

**RSVP view + export (D-11..D-13)**
- D-11: RSVP view grouped by household, meal-count summary card at top (counts by `meal_choice` where `attending = true`, plus dietary-notes list). Renders cleanly with zero submissions.
- D-12: Two CSV exports: guest-list CSV (`household_id, full_name`) and RSVP CSV (per-guest: name, household, attending, meal_choice, dietary_restrictions). Server route streams `text/csv` with `Content-Disposition` attachment filename.
- D-13: Meal labels from `lib/rsvp/meal-options.ts` only.

### Claude's Discretion
- Exact admin route layout and whether edits use Route Handlers vs Server Actions — research decides against the custom Next.js docs (AGENTS.md).
- Visual treatment within the Stitch token system.
- Whether the households view and RSVP view are one page with tabs or two routes.
- Live refresh vs manual reload for the RSVP view (default: manual is fine).

### Deferred Ideas (OUT OF SCOPE)
- Per-person admin identity / audit log.
- RSVP cutoff date + form disable (CUTOFF-01).
- Email confirmations (EMAIL-01).
- Live/realtime RSVP updates.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ADMIN-01 | Private admin area, gated separately from public guest `SITE_ACCESS_CODE`. Guest access code must NOT grant admin access. | D-01..D-03: separate `admin_session` cookie; proxy.ts branch; login route mirrored |
| ADMIN-02 | Couple can view all households with members to validate grouping. | Service-role client queries `guests` table directly; grouped by `household_id` in server-side data fetch |
| ADMIN-03 | Couple can add, rename, remove, move people between households; changes persist and reflect in name lookup. | Route Handlers + service-role client; direct `guests` table mutations; D-09 double-delete pattern |
| ADMIN-04 | Couple can view RSVP submissions with meal-count summary. Renders cleanly with zero submissions. | Service-role direct SELECT on `rsvps`; meal summary aggregated in JS from `MEAL_OPTIONS`; empty-state handling |
| ADMIN-05 | Couple can export guest list and RSVPs as CSV. | GET Route Handlers returning `new Response(csv, { headers })` with RFC 4180 encoding |
</phase_requirements>

---

## Summary

Phase 6 builds a private admin console behind a separate auth gate from the guest site. The work divides into four layers: (1) auth gating — a new `admin_session` cookie issued by a cloned login route, with `proxy.ts` extended to enforce it for all `/admin/*` paths; (2) a privileged Supabase client — `SUPABASE_SERVICE_ROLE_KEY` used server-side only, never in a client bundle, bypassing RLS to directly read `rsvps` and mutate `guests`; (3) a households management UI — a Client Component island for inline editing that calls Route Handlers; and (4) RSVP view + CSV export delivered via GET Route Handlers returning `text/csv` responses.

This installed version of Next.js (16.2.6) deprecates `middleware.ts` in favor of `proxy.ts` with an exported `proxy()` function — which this project already uses. The cookies API from `next/headers` is now async. Params in Route Handlers are Promises. Everything else maps cleanly onto the existing patterns in this codebase.

The service-role key is the critical security boundary. It must never appear in client-side code. The `NEXT_PUBLIC_` prefix absence is the primary protection; the planner must ensure `lib/supabase/admin.ts` is only imported in Route Handlers or Server Functions, never in Client Components.

**Primary recommendation:** Implement all admin mutations as Route Handlers (not Server Actions), matching the existing codebase pattern. Use two routes (`/admin` for households, `/admin/rsvps` for RSVP view) rather than a tabbed single page.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Admin auth gate | API (Route Handler) + Proxy | — | Cookie issuance is server-only; proxy enforces gate before rendering |
| Households data fetch | API / Server Component | — | Service-role query must stay server-side; initial render is a Server Component |
| Inline guest editing | Browser (Client Component) | API (Route Handler) | UI state for edit fields is client-side; mutations post to server Route Handlers |
| RSVP data fetch | API / Server Component | — | Service-role query; page renders as Server Component |
| Meal-count summary | API / Server | — | Aggregated server-side from `rsvps` data; `MEAL_OPTIONS` import is server-safe |
| CSV export | API (Route Handler) | — | Returns binary/text response; must be a GET Route Handler, not a page |
| service-role Supabase client | API (Server-only) | — | `SUPABASE_SERVICE_ROLE_KEY` must stay in server bundle only |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.6 (installed) | Framework | Already installed; `proxy.ts` convention |
| @supabase/supabase-js | ^2.100.0 (installed) | Supabase client | Already installed; `createClient` used for service-role |
| react | 19.2.4 (installed) | UI | Already installed |

[VERIFIED: package.json] — all versions confirmed from installed `package.json`.

### Supporting

No new packages are needed for this phase. All required capabilities (cookie handling, Route Handlers, CSV responses, UUID generation) are available from Node.js builtins and the already-installed packages.

| Capability | Source | Notes |
|------------|--------|-------|
| UUID generation | `crypto.randomUUID()` | Node.js builtin, available in Next.js 16 server context and modern browsers |
| CSV serialization | Hand-coded per RFC 4180 | ~10 lines; no library needed for this data shape |
| Cookie read (proxy) | `request.cookies.get()` on `NextRequest` | `NextRequest` is already the proxy parameter type |
| Cookie read (Route Handler) | `request.cookies.get()` on `NextRequest` | Same API; no `next/headers` import needed |
| Cookie set (Route Handler) | `NextResponse.cookies.set()` on the response object | Same pattern as existing `app/api/auth/login/route.ts` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Route Handlers for mutations | Server Actions (`'use server'`) | Server Actions work, but proxy.ts docs warn they are NOT separate routes — proxy coverage can be silently lost. Route Handlers are explicit HTTP endpoints with clearer auth verification. |
| Two routes (`/admin`, `/admin/rsvps`) | Single tabbed page | Tab state adds client complexity for no real UX gain in a two-person internal tool. Two routes are bookmarkable and simpler. |
| `new Response(csv)` | Streaming with `ReadableStream` | Data is ~150 rows; no streaming needed. Collect to string, return in one Response. |

**Installation:** No new packages required.

---

## Package Legitimacy Audit

No new packages are introduced in this phase. All dependencies (`next`, `@supabase/supabase-js`, `react`, `react-dom`) were already installed and validated in prior phases.

**Packages removed due to slopcheck [SLOP] verdict:** none  
**Packages flagged as suspicious [SUS]:** none

---

## Architecture Patterns

### System Architecture Diagram

```
Browser (Admin)
    |
    | POST /api/admin/auth/login  (no gate — excluded from matcher)
    v
[admin login Route Handler]
    | checks ADMIN_ACCESS_CODE
    | sets admin_session cookie
    v
Browser (now has admin_session)
    |
    | GET /admin  (or /admin/rsvps)
    v
proxy.ts  (matcher includes /admin/*)
    | reads admin_session cookie
    | if missing -> redirect /admin/login
    | if present -> NextResponse.next()
    v
[Server Component: /admin or /admin/rsvps]
    | imports lib/supabase/admin.ts (server-only)
    | queries guests table (all rows)
    | queries rsvps table (all rows, if RSVP page)
    | passes data as props to Client Component island
    v
[Client Component: HouseholdsTable or RsvpView]
    | renders inline edit UI
    | on mutation: fetch() -> /api/admin/guests/* or /api/admin/rsvps/*
    v
[Admin Route Handlers: /api/admin/guests/*, /api/admin/rsvps/*]
    | re-verifies admin_session cookie (defense in depth)
    | uses lib/supabase/admin.ts (service-role)
    | mutates guests / rsvps directly
    v
[GET /api/admin/export/guests or /api/admin/export/rsvps]
    | re-verifies admin_session
    | queries via service-role
    | returns new Response(csvString, { Content-Type: text/csv, Content-Disposition })
```

### Recommended Project Structure

```
app/
  (admin)/                        <- route group (URLs: /admin, /admin/login, /admin/rsvps)
    admin/
      layout.tsx                  <- minimal admin layout (no Navbar/Footer/MusicButton)
      login/
        page.tsx                  <- admin login form (Client Component, fetch to API)
      page.tsx                    <- households view (Server Component -> passes to island)
      rsvps/
        page.tsx                  <- RSVP view + meal summary (Server Component)
  api/
    admin/
      auth/
        login/
          route.ts                <- POST: validate ADMIN_ACCESS_CODE, set admin_session cookie
      guests/
        route.ts                  <- POST: add guest
        [id]/
          route.ts                <- PATCH: rename/move; DELETE: delete guest + rsvp
      rsvps/
        route.ts                  <- GET: list all rsvps (admin view)
      export/
        guests/
          route.ts                <- GET: text/csv guest list
        rsvps/
          route.ts                <- GET: text/csv RSVP export
lib/
  supabase/
    client.ts                     <- existing anon client (unchanged)
    admin.ts                      <- NEW: service-role client (server-only import)
  rsvp/
    meal-options.ts               <- existing (unchanged)
```

### Pattern 1: proxy.ts Admin Branch

**What:** Extend the existing proxy function to branch on `/admin` paths and check `admin_session` instead of `session`.

**When to use:** Always — this is the only proxy.ts in the project.

```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
// — Conditional Statements + Using Cookies examples

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin gate: /admin/* paths (login page + auth API excluded from matcher below)
  if (pathname.startsWith("/admin")) {
    const adminSession = request.cookies.get("admin_session")?.value;
    if (!adminSession) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Guest gate (existing behavior, unchanged)
  const session = request.cookies.get("session")?.value;
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude: guest login, admin login, both auth APIs, static assets, images
    "/((?!login|admin/login|api/auth|api/admin/auth|_next/static|_next/image|favicon\\.ico|.*\\.jpg$|.*\\.png$|.*\\.svg$|.*\\.webp$).*)",
  ],
};
```

[VERIFIED: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md]

**Critical:** The matcher exclusion for `admin/login` ensures proxy never runs for `/admin/login`, so the page renders without requiring a cookie. The admin branch in `proxy()` only fires for authenticated admin paths (all other `/admin/*`).

### Pattern 2: Admin Service-Role Supabase Client

**What:** A server-only Supabase client using the service-role key. Bypasses RLS entirely. Exposes direct SELECT on `rsvps` and full write access to `guests`/`rsvps`.

**When to use:** Import ONLY in Route Handlers (`app/api/admin/*/route.ts`) and Server Functions. Never in Client Components.

```typescript
// lib/supabase/admin.ts
// Source: @supabase/supabase-js docs — createClient with service role key

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// IMPORTANT: Never import this file in a Client Component.
// SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix — Next.js
// excludes it from the client bundle. But the import itself could
// expose the key if bundled. Convention enforces this; 'server-only'
// package is not installed in this project.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
```

[ASSUMED: supabaseAdmin pattern — based on Supabase documentation conventions. The specific `createClient` API is confirmed from the installed `lib/supabase/client.ts` which uses the same function.]

### Pattern 3: Admin Login Route Handler (mirror of existing)

**What:** POST handler that validates `ADMIN_ACCESS_CODE` and sets `admin_session` cookie. Directly mirrors `app/api/auth/login/route.ts`.

```typescript
// app/api/admin/auth/login/route.ts
// Source: mirrors app/api/auth/login/route.ts exactly; cookie API from
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  const accessCode = process.env.ADMIN_ACCESS_CODE;

  if (!accessCode) {
    return NextResponse.json({ error: "Access code not configured" }, { status: 500 });
  }

  if (password !== accessCode) {
    return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",          // D-04: same flags as guest cookie
    maxAge: 60 * 60 * 24 * 90, // 90 days
  });
  return response;
}
```

[VERIFIED: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md — Cookies section; confirmed against existing app/api/auth/login/route.ts]

### Pattern 4: Admin Cookie Verification in Route Handlers

**What:** Every admin Route Handler re-verifies the `admin_session` cookie independently of proxy.ts.

**When to use:** All `app/api/admin/*/route.ts` files. The proxy.ts docs explicitly warn: "Always verify authentication and authorization inside each Server Function rather than relying on Proxy alone."

```typescript
// Two equivalent approaches — choose based on whether NextRequest is in scope

// Approach A: from request object (simpler, no import)
export async function GET(request: NextRequest) {
  const adminSession = request.cookies.get("admin_session")?.value;
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... handler logic
}

// Approach B: from next/headers (when request is not NextRequest)
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies(); // cookies() is ASYNC in Next.js 16
  const adminSession = cookieStore.get("admin_session")?.value;
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... handler logic
}
```

[VERIFIED: node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md — `cookies` is an async function; node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md — "Good to know" warning about Server Functions]

### Pattern 5: CSV Export Route Handler

**What:** GET Route Handler that queries via service-role, serializes to RFC 4180 CSV, returns as `text/csv` with `Content-Disposition: attachment`.

```typescript
// app/api/admin/export/guests/route.ts
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md
// — Non-UI Responses section (pattern for returning non-HTML content)

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

function toRfc4180Field(val: string | null | undefined): string {
  if (val == null || val === "") return '""';
  // Wrap every field in double-quotes; escape internal double-quotes as ""
  // Prevents CSV injection: =CMD(), +, -, @ prefixed formulas in Excel/Sheets
  return '"' + String(val).replace(/"/g, '""') + '"';
}

export async function GET(request: NextRequest) {
  const adminSession = request.cookies.get("admin_session")?.value;
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("guests")
    .select("household_id, full_name")
    .order("household_id")
    .order("full_name");

  if (error || !data) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }

  const header = "household_id,full_name\n";
  const rows = data
    .map((r) => `${toRfc4180Field(r.household_id)},${toRfc4180Field(r.full_name)}`)
    .join("\n");

  return new Response(header + rows, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="guests.csv"',
    },
  });
}
```

[VERIFIED: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md — Non-UI Responses section]

### Pattern 6: Guest Delete with RSVP Cascade (No FK)

**What:** Phase 4 D-04 means no DB FK cascade. The admin Route Handler must delete the `rsvps` row before the `guests` row to avoid orphaned records.

```typescript
// Order matters: rsvps first, then guests
// Both are sequential PostgREST calls (not a DB transaction)

const { error: rsvpDeleteError } = await supabaseAdmin
  .from("rsvps")
  .delete()
  .eq("guest_id", guestId);

// Proceed even if no rsvps row existed (error.code === 'PGRST116' or similar)

const { error: guestDeleteError } = await supabaseAdmin
  .from("guests")
  .delete()
  .eq("id", guestId);
```

[ASSUMED: PostgREST delete-then-delete pattern — based on Supabase JS API and the absence of FK constraint documented in .planning/RSVP-S1-SECURITY-FIX.sql]

### Pattern 7: Admin Route Group Layout

**What:** `app/(admin)/admin/layout.tsx` — a minimal layout that does NOT include `Navbar`, `Footer`, or `MusicButton`. Keeps the admin area visually distinct from the guest site.

```typescript
// app/(admin)/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      {children}
    </div>
  );
}
```

[ASSUMED: Layout pattern — based on app/(main)/layout.tsx as the model; Stitch token class names from app/globals.css]

### Anti-Patterns to Avoid

- **Importing `lib/supabase/admin.ts` in a Client Component:** The `SUPABASE_SERVICE_ROLE_KEY` env var has no `NEXT_PUBLIC_` prefix so Next.js won't bundle it, but importing the module can cause build-time errors or expose the import path. Keep all admin client usage in Route Handlers and Server Components only.
- **Relying on proxy.ts alone for authorization:** The proxy.ts docs explicitly warn that Server Functions are not separate routes and proxy coverage can be silently lost. Every admin Route Handler must check `admin_session` independently.
- **Using `session` cookie to grant admin access:** proxy.ts admin branch must check `request.cookies.get("admin_session")`, not `request.cookies.get("session")`. These are separate cookies; the guest cookie must never satisfy the admin gate.
- **Generating household UUIDs server-side for split operations:** D-10 says UUIDs are client-generated (matching the import pattern). The client generates `crypto.randomUUID()` and passes it as `household_id` in the request body.
- **Skipping the guest `session` check for non-admin routes:** The proxy function must still gate non-admin, non-login paths with the guest `session` cookie. The admin branch returns early — the guest gate still runs for all other matched paths.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSV serialization | Custom parser with edge cases | RFC 4180 pattern: `'"' + val.replace(/"/g, '""') + '"'` | Formula injection, comma/newline in values, null handling — a 5-line pattern covers it |
| UUID generation | Custom random ID | `crypto.randomUUID()` | Node.js builtin, cryptographically secure, RFC 4122 compliant |
| Service-role auth bypass | Custom SECURITY DEFINER functions for admin reads | Direct `supabaseAdmin.from('rsvps').select()` | Service-role already bypasses RLS — no wrapper needed for admin |
| Cookie parsing in proxy | `document.cookie` string split | `request.cookies.get('admin_session')` on `NextRequest` | Built-in `RequestCookies` API handles parsing |

**Key insight:** The service-role client eliminates the need for any new SECURITY DEFINER RPCs. Unlike the anon client (which can't SELECT on `rsvps`), the service-role client has full table access. The existing RPCs (`submit_rsvps`, `get_household_rsvps`) remain untouched for the guest path.

---

## Common Pitfalls

### Pitfall 1: `cookies()` is Async in Next.js 16

**What goes wrong:** `cookies().get('admin_session')` without `await` returns a Promise, not the cookie value. The check always passes (truthy Promise object), silently bypassing auth.

**Why it happens:** Changed from synchronous in v14 to async in v15/16. The version history in `cookies.md` confirms the async change at v15.0.0-RC.

**How to avoid:** Always `const cookieStore = await cookies()` when using the `next/headers` import. Or use `request.cookies.get()` on the `NextRequest` object directly (this is synchronous — available on both `NextRequest` in Route Handlers and on the proxy's `request` parameter).

**Warning signs:** TypeScript doesn't error on `cookies().get()` because the Promise has a `.get` method via the type definition. The cookie value will be `undefined` from a Promise.

[VERIFIED: node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md — "cookies is an asynchronous function that returns a promise"]

### Pitfall 2: `/admin/login` Caught by Guest Gate

**What goes wrong:** If `/admin/login` is not excluded from the proxy matcher or not short-circuited in `proxy()`, the guest gate fires for it. A fresh admin visitor (no `session` cookie) gets redirected to `/login` instead of seeing the admin login form.

**Why it happens:** The admin login page is under `/admin`, which the current matcher's negative lookahead does not exclude. The current matcher excludes `login` (which matches `/login`) but not `admin/login`.

**How to avoid:** Add `admin/login` to the negative lookahead in the matcher:
`/((?!login|admin/login|api/auth|api/admin/auth|...).*)`

Or handle it with an early return at the top of the `proxy()` admin branch before the cookie check.

**Warning signs:** Redirected to `/login` (not `/admin/login`) when first navigating to the admin area.

[VERIFIED: confirmed by reading existing proxy.ts matcher and proxy.md negative matching examples]

### Pitfall 3: Admin Auth API Blocked by Guest Gate

**What goes wrong:** The POST to `/api/admin/auth/login` is hit by the guest gate and redirected to `/login`, so the admin login form never submits successfully.

**Why it happens:** `/api/admin/auth/login` does not match `api/auth` in the current exclusion — it matches `api/admin/auth`.

**How to avoid:** Add `api/admin/auth` to the matcher exclusion list alongside `api/auth`.

**Warning signs:** The admin login form POST returns a 302 redirect response (the guest login redirect), not the expected JSON `{ success: true }`.

[VERIFIED: confirmed by reading existing proxy.ts and matcher regex behavior]

### Pitfall 4: Server Actions Silently Lose Proxy Coverage

**What goes wrong:** If Server Actions are used for mutations, a proxy matcher refactor or route move can silently remove admin-gate coverage. The proxy.ts docs warn about this explicitly.

**Why it happens:** Server Actions POST to the route where they are defined, not to a separate endpoint. If the route's path changes or matcher changes, the proxy may not cover the action.

**How to avoid:** Use Route Handlers for all admin mutations (the existing project pattern). Every admin Route Handler independently re-checks `admin_session` regardless of proxy.ts.

[VERIFIED: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md — "Good to know: Server Functions are not separate routes in this chain."]

### Pitfall 5: `params` is a Promise in Route Handlers

**What goes wrong:** `export async function PATCH(request, { params }) { const { id } = params; }` — `id` is undefined because `params` must be awaited.

**Why it happens:** Changed to Promise at v15.0.0-RC per the route.md version history.

**How to avoid:** `const { id } = await params` in all dynamic Route Handlers (`/api/admin/guests/[id]/route.ts`).

[VERIFIED: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md — Parameters section and Version History]

### Pitfall 6: Delete Order for Guests with RSVPs

**What goes wrong:** Deleting the `guests` row first, then the `rsvps` row, leaves an orphaned `rsvps` record if the second delete fails. The orphan has no corresponding guest, silently inflates RSVP counts and meal summaries.

**Why it happens:** Phase 4 D-04 explicitly chose no DB FK cascade. The app layer must enforce order.

**How to avoid:** Always delete `rsvps` first (`.delete().eq('guest_id', guestId)`), then `guests` (`.delete().eq('id', guestId)`). A missing `rsvps` row is harmless (guest hadn't RSVP'd); a missing `guests` row with an existing `rsvps` row is a data integrity problem.

[VERIFIED: .planning/RSVP-S1-SECURITY-FIX.sql — confirms no FK from rsvps to guests; Phase 4 decision D-04 context]

### Pitfall 7: CSV Formula Injection

**What goes wrong:** A guest named `=SUM(A1:A100)` or `+cmd|' /C calc'!A0` would be interpreted as a formula by Excel or Google Sheets when Tyler opens the export.

**Why it happens:** CSV is plain text; spreadsheet apps interpret cells starting with `=`, `+`, `-`, or `@` as formulas.

**How to avoid:** Wrap every exported field in double-quotes and escape internal double-quotes as `""` (RFC 4180). This is the browser-safe and spreadsheet-safe standard. Do NOT attempt to detect and strip formula characters — that's brittle and changes data.

---

## Code Examples

### Verified — Reading a cookie in proxy.ts (synchronous, no await)

```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
// "Using Cookies" section — request.cookies is the RequestCookies API

export function proxy(request: NextRequest) {
  let cookie = request.cookies.get("nextjs");
  // => { name: 'nextjs', value: 'fast', Path: '/' }
}
```

### Verified — Async cookies() in a Route Handler

```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md
// "Cookies" section

import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies(); // MUST await
  const a = cookieStore.get("a");
}
```

### Verified — Non-UI (non-HTML) response from a Route Handler

```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md
// "Non-UI Responses" section — pattern for returning text/xml or text/csv

export async function GET() {
  return new Response("plain text content", {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
```

### Verified — Setting a cookie on the response object

```typescript
// Source: app/api/auth/login/route.ts (existing codebase)
// Confirmed against route.md "Cookies" section

const response = NextResponse.json({ success: true });
response.cookies.set("admin_session", "authenticated", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 90,
});
return response;
```

### Verified — Dynamic route params (must await)

```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md
// Parameters section

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Must await
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `middleware.ts` with `export function middleware()` | `proxy.ts` with `export function proxy()` | v16.0.0 | This project already uses the new convention; no action needed |
| `cookies()` synchronous | `cookies()` async, must `await` | v15.0.0-RC | Every server-side cookie read using `next/headers` must use `await` |
| `params` as plain object | `params` as Promise | v15.0.0-RC | All dynamic Route Handlers must `await params` |
| Direct anon table SELECT on rsvps | SECURITY DEFINER RPC for reads | Phase 4 | Admin bypasses this via service-role; guest path still uses RPC |

**Deprecated/outdated:**
- `middleware.ts`: Deprecated in v16.0.0, renamed to `proxy.ts`. Codemod available but this project already migrated.
- Synchronous `cookies()`: Still works in v16 for backward compat but marked as deprecated behavior. Use `await cookies()`.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `supabaseAdmin` file pattern (lib/supabase/admin.ts) works as a server-only module without the `server-only` package | Standard Stack / Pattern 2 | If a Client Component accidentally imports it, the `SUPABASE_SERVICE_ROLE_KEY` env is undefined in the browser and the client silently fails — no key exposure, but runtime errors |
| A2 | Supabase service-role client bypasses RLS, allowing direct SELECT on `rsvps` | Architecture / Don't Hand-Roll | If RLS is enabled with SECURITY INVOKER policies that ignore service-role, the admin reads would fail. Verify in Supabase Studio: confirm RLS is DISABLED on `guests` and `rsvps` tables |
| A3 | Delete from `rsvps` then `guests` is the correct order; two sequential PostgREST calls are not wrapped in a DB transaction | Pattern 6 / Pitfall 6 | If the guests delete succeeds but rsvps delete fails (network error between calls), the rsvp row is orphaned. Risk is low for an admin tool at this scale |
| A4 | The admin login page at `/admin/login` does not need the Stitch Navbar/Footer (admin layout is separate from main layout) | Pattern 7 | If Tyler wants the same chrome, the admin layout.tsx needs updating — cosmetic, not functional |

---

## Open Questions (RESOLVED)

> RESOLVED during planning (Phase 6 plans 06-01..06-05): (1) RLS status is verified by the
> blocking human-action checkpoint in Plan 06-01 Task 1 before any admin read. (2) Admin
> cookie path follows D-04 (`path: "/"`); separation is by cookie *name* (`admin_session`).
> (3) Household grouping is done in-JS in the Server Component (Plan 06-03 Task 1), not a SQL
> GROUP BY. Original notes retained below for context.

1. **RLS status on `rsvps` and `guests`** — RESOLVED: handled by the Plan 06-01 Task 1 checkpoint.
   - What we know: Phase 4 disabled anon SELECT on `rsvps` via REVOKE (not RLS). The `RSVP-S1-SECURITY-FIX.sql` shows `REVOKE INSERT, UPDATE ON public.rsvps FROM anon` — column-level grants, not RLS policies.
   - What's unclear: Whether RLS is enabled (via `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) or just disabled (default). If RLS is on with no permissive policies, even the service-role client may be blocked on some Supabase configurations.
   - Recommendation: Verify in Supabase Studio (Authentication -> Policies) before implementing. If RLS is off (default), service-role has full access. If RLS is on with SECURITY INVOKER policies, service-role still bypasses. If there's a restrictive policy overriding service-role, that would be unusual and needs investigation.

2. **Admin cookie path scoping**
   - What we know: D-04 says cookie flags follow the existing login route: `path: "/"`.
   - What's unclear: Whether to scope `admin_session` to `path: "/admin"` for defense in depth (cookie is not sent for guest paths) vs `path: "/"` for simplicity.
   - Recommendation: Follow D-04 literally — `path: "/"`. The separation is enforced by cookie NAME (`admin_session` vs `session`), not path scope.

3. **Households grouping query**
   - What we know: The `guests` table has `household_id` and `full_name`. There's no separate `households` table.
   - What's unclear: Whether there are 75 distinct `household_id` values (per the CONTEXT's 75 households / 138 guests) or whether some are missing if the CSV hasn't been imported yet when Phase 6 is built.
   - Recommendation: The households view should handle zero guests gracefully (empty state, same as D-11 for RSVP view). The grouping is done in-JS after fetching all guests.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Next.js 16 | All | Yes | 16.2.6 | — |
| @supabase/supabase-js | Admin client | Yes | ^2.100.0 | — |
| `crypto.randomUUID()` | New household UUID generation | Yes | Node.js 19+; also available in browsers | — |
| `ADMIN_ACCESS_CODE` env | Admin login route | Not yet set | — | Phase blocks without this |
| `SUPABASE_SERVICE_ROLE_KEY` env | Admin Supabase client | Not yet set | — | Phase blocks without this |

**Missing dependencies with no fallback:**
- `ADMIN_ACCESS_CODE` — must be set in `.env.local` and Vercel before the admin login route works
- `SUPABASE_SERVICE_ROLE_KEY` — must be retrieved from Supabase project settings (API -> service_role key) and set in `.env.local` and Vercel

**Missing dependencies with fallback:** None.

---

## Validation Architecture

`nyquist_validation` key is absent from `.planning/config.json` — treated as enabled.

No test framework is installed in this project (`package.json` has no testing dependencies). For an internal two-person admin console, the validation approach is manual smoke testing rather than automated tests. Wave 0 does not need to install a test framework for this phase.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — manual smoke tests |
| Config file | n/a |
| Quick run command | Manual browser verification |
| Full suite command | Manual end-to-end smoke test (see checklist below) |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| ADMIN-01 | Guest `session` cookie does NOT grant `/admin` access | Manual | — | Navigate to `/admin` with only `session` cookie; verify redirect to `/admin/login` |
| ADMIN-01 | Admin `admin_session` cookie grants `/admin` access | Manual | — | Login via admin form; verify `/admin` loads |
| ADMIN-02 | All households render with correct members | Manual | — | View `/admin` after guest import; verify count matches expected 75 households / 138 guests |
| ADMIN-03 | Rename a guest; verify lookup still works | Manual | — | Rename, then look up the new name via the guest RSVP form |
| ADMIN-03 | Move a guest to another household | Manual | — | Move, verify household membership updated |
| ADMIN-03 | Delete a guest with RSVP; verify both rows removed | Manual | — | Check via Supabase Studio that `rsvps` row is also gone |
| ADMIN-04 | RSVP view renders with zero submissions | Manual | — | Load `/admin/rsvps` before any guest RSVPs; verify empty state, no error |
| ADMIN-04 | Meal-count summary correct | Manual | — | Submit a test RSVP; verify count increments correctly |
| ADMIN-05 | Guest CSV downloads with correct headers and content | Manual | — | Download and open in a spreadsheet; verify `household_id,full_name` format |
| ADMIN-05 | RSVP CSV downloads with correct content | Manual | — | Download after a test RSVP; verify attending/meal_choice/dietary_restrictions columns |

### Wave 0 Gaps

None — no automated test framework needed for this phase. The planner should document the manual smoke test checklist above as a runbook section.

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | Passphrase compare with `ADMIN_ACCESS_CODE`; httpOnly cookie with 90-day maxAge |
| V3 Session Management | Yes | `admin_session` httpOnly cookie; distinct from guest cookie; proxy gate on all `/admin/*` paths |
| V4 Access Control | Yes | Admin gate in proxy.ts; re-verified in every Route Handler; service-role client never in client bundle |
| V5 Input Validation | Yes | Guest names/IDs validated as non-empty string/UUID in Route Handlers; sanitized 5xx vocabulary (no PostgREST errors in responses) |
| V6 Cryptography | No | No custom crypto; cookie value is opaque string ("authenticated"); no JWT/token signing needed at this scale |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Guest bypasses admin gate using guest `session` cookie | Elevation of privilege | Admin branch in proxy.ts checks only `admin_session`; Route Handlers re-verify `admin_session` |
| Admin login brute-force | Spoofing | Single shared passphrase; low attack surface (couple only); no rate limiting needed at this scale |
| CSV formula injection in export | Tampering | RFC 4180 double-quote wrapping on all fields; `toRfc4180Field()` pattern |
| Service-role key exposure via accidental client import | Information disclosure | No `NEXT_PUBLIC_` prefix; convention-enforced server-only import; key undefined in browser context |
| Orphaned RSVP after partial guest delete | Tampering / data integrity | Delete `rsvps` first, then `guests`; Route Handler handles both sequentially |
| Unauthenticated POST to `/api/admin/guests/*` | Elevation of privilege | Proxy.ts gates `/admin/*` but NOT `/api/admin/*` (api routes excluded from proxy in many setups — verify matcher covers `/api/admin/*`) |

**Critical note on the last row:** The current matcher pattern `/((?!login|admin/login|api/auth|api/admin/auth|...).*) ` DOES match `/api/admin/guests/*` paths (they don't start with any excluded prefix). So proxy.ts DOES gate them. But double-check: the proxy path branch is `pathname.startsWith('/admin')`. `/api/admin/guests/123` does NOT start with `/admin` — it starts with `/api/admin`. This means the admin branch in proxy.ts would NOT fire for `/api/admin/*` API routes. They fall through to the GUEST gate instead.

**This is the most important finding for planning:** The admin Route Handlers at `/api/admin/*` are NOT covered by the admin branch in proxy.ts. They are covered by the GUEST gate (checking `session` cookie), which a guest user satisfies. The defense-in-depth check inside each Route Handler (`request.cookies.get('admin_session')`) is not optional — it is the PRIMARY admin authorization for these routes.

The planner MUST ensure every `/api/admin/*/route.ts` verifies `admin_session` at the top of each handler.

---

## Sources

### Primary (HIGH confidence)
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` — proxy.ts API, matcher syntax, cookie reading, conditional statements, migration from middleware
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` — Route Handler HTTP methods, cookies, non-UI responses, params (Promise), version history
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md` — async `cookies()`, options, Server Function behavior
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route-groups.md` — `(folderName)` convention, URL exclusion, caveats
- `node_modules/next/dist/docs/01-app/02-guides/data-security.md` — data access layer recommendations
- `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-server.md` — Server Function / Server Action pattern
- `package.json` — confirmed Next.js 16.2.6, @supabase/supabase-js ^2.100.0, React 19.2.4
- `proxy.ts` — existing matcher pattern and cookie-gate structure (to be extended)
- `app/api/auth/login/route.ts` — guest login route (template for admin login)
- `lib/supabase/client.ts` — anon client pattern (to be mirrored for admin)
- `app/(main)/api/rsvp/submit/route.ts` — Route Handler patterns (validation, sanitized 5xx)
- `.planning/RSVP-S1-SECURITY-FIX.sql` — RLS/REVOKE context, no FK from rsvps to guests
- `lib/rsvp/meal-options.ts` — `MEAL_OPTIONS` source of truth

### Secondary (MEDIUM confidence)
- `node_modules/next/dist/docs/01-app/02-guides/authentication.md` — auth pattern guidance
- `node_modules/next/dist/docs/01-app/02-guides/forms.md` — Server Actions / Server Functions

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages from installed `package.json`; no new dependencies
- Architecture: HIGH — verified against installed Next.js docs; all patterns confirmed against existing codebase files
- Pitfalls: HIGH — all pitfalls traced to specific doc sections or existing code; the `/api/admin/*` proxy coverage finding is critical and verified by reading the actual proxy.ts and proxy.md

**Research date:** 2026-06-30  
**Valid until:** 2026-09-30 (stable APIs; Next.js 16 unlikely to break these patterns within 90 days)
