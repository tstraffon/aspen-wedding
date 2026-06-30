# Phase 6: Admin Console - Pattern Map

**Mapped:** 2026-06-30
**Files analyzed:** 12 new/modified files
**Analogs found:** 12 / 12

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `proxy.ts` | middleware | request-response | `proxy.ts` (self) | exact — extend, don't rewrite |
| `app/api/admin/auth/login/route.ts` | controller | request-response | `app/api/auth/login/route.ts` | exact |
| `lib/supabase/admin.ts` | utility | CRUD | `lib/supabase/client.ts` | role-match (different key) |
| `app/api/admin/guests/route.ts` | controller | CRUD | `app/(main)/api/rsvp/submit/route.ts` | role-match |
| `app/api/admin/guests/[id]/route.ts` | controller | CRUD | `app/(main)/api/rsvp/submit/route.ts` | role-match |
| `app/api/admin/rsvps/route.ts` | controller | CRUD | `app/(main)/api/rsvp/lookup/route.ts` | role-match — NOT created; subsumed by the Server Component direct read in Plan 06-04 (`/admin/rsvps` page reads `supabaseAdmin` directly) |
| `app/api/admin/export/guests/route.ts` | controller | file-I/O | `app/(main)/api/rsvp/lookup/route.ts` | partial (no CSV analog exists) |
| `app/api/admin/export/rsvps/route.ts` | controller | file-I/O | `app/(main)/api/rsvp/lookup/route.ts` | partial (no CSV analog exists) |
| `app/(admin)/admin/layout.tsx` | layout | request-response | `app/(main)/layout.tsx` | role-match |
| `app/(admin)/admin/login/page.tsx` | component | request-response | `app/(main)/rsvp/page.tsx` | role-match (fetch + state pattern) |
| `app/(admin)/admin/page.tsx` | component | CRUD | `app/(main)/rsvp/page.tsx` | role-match (Server Component + client island) |
| `app/(admin)/admin/rsvps/page.tsx` | component | CRUD | `app/(main)/rsvp/page.tsx` | role-match |

---

## Pattern Assignments

### `proxy.ts` (middleware, request-response) — MODIFY

**Analog:** `proxy.ts` (self, current state)

**Current file in full** (lines 1-20):
```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except /login, static files, and Next.js internals
    "/((?!login|api/auth|_next/static|_next/image|favicon\\.ico|.*\\.jpg$|.*\\.png$|.*\\.svg$|.*\\.webp$).*)",
  ],
};
```

**What to change — admin branch before guest gate:**
Insert an early-return admin branch at the top of `proxy()`, before the existing guest-gate block. The admin branch checks `admin_session`, not `session`. Guest gate is unchanged.

**Updated proxy function shape:**
```typescript
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin gate: /admin/* (login page + auth API are excluded from matcher below)
  if (pathname.startsWith("/admin")) {
    const adminSession = request.cookies.get("admin_session")?.value;
    if (!adminSession) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Guest gate (existing behavior — unchanged)
  const session = request.cookies.get("session")?.value;
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
```

**Updated matcher — add `admin/login` and `api/admin/auth` exclusions:**
```typescript
export const config = {
  matcher: [
    "/((?!login|admin/login|api/auth|api/admin/auth|_next/static|_next/image|favicon\\.ico|.*\\.jpg$|.*\\.png$|.*\\.svg$|.*\\.webp$).*)",
  ],
};
```

**Critical notes:**
- `request.cookies.get()` on `NextRequest` is synchronous — no `await` needed.
- `/api/admin/guests/*` paths do NOT start with `/admin` so they fall through to the guest gate. The guest gate passes for any visitor with a valid `session` cookie. This means every `/api/admin/*/route.ts` must independently verify `admin_session` — that check is the PRIMARY admin authorization for API routes.
- `admin/login` must appear in the matcher exclusion or the guest gate will intercept fresh admin visitors (who have neither cookie) and redirect to `/login` instead of `/admin/login`.

---

### `app/api/admin/auth/login/route.ts` (controller, request-response) — CREATE

**Analog:** `app/api/auth/login/route.ts` (lines 1-31)

**Full analog to mirror:**
```typescript
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  const accessCode = process.env.SITE_ACCESS_CODE;   // <-- change to ADMIN_ACCESS_CODE

  if (!accessCode) {
    return NextResponse.json(
      { error: "Access code not configured" },
      { status: 500 }
    );
  }

  if (password !== accessCode) {
    return NextResponse.json(
      { error: "Invalid access code" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("session", "authenticated", {  // <-- change to "admin_session"
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });

  return response;
}
```

**Two changes from the analog:**
1. `process.env.SITE_ACCESS_CODE` -> `process.env.ADMIN_ACCESS_CODE`
2. Cookie name `"session"` -> `"admin_session"`

Everything else (flags, maxAge, response shape) copies verbatim from the analog.

---

### `lib/supabase/admin.ts` (utility, CRUD) — CREATE

**Analog:** `lib/supabase/client.ts` (lines 1-6)

**Analog for reference:**
```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**New file — two changes: key env var, export name:**
```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// IMPORTANT: Never import this file in a Client Component.
// SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix — Next.js excludes it
// from the client bundle. But the import itself should stay in Route Handlers
// and Server Components only. The 'server-only' package is not installed in
// this project — convention enforces this boundary.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
```

**Import path in all admin routes:** `import { supabaseAdmin } from "@/lib/supabase/admin";`

---

### `app/api/admin/guests/route.ts` (controller, CRUD) — CREATE

**Analog:** `app/(main)/api/rsvp/submit/route.ts`

**Imports pattern** (analog lines 28-30):
```typescript
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { isMealChoice } from "@/lib/rsvp/meal-options";
```

**Admin version imports:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
```

**Admin cookie check pattern (PRIMARY authz — not optional):**
```typescript
export async function POST(request: NextRequest) {
  const adminSession = request.cookies.get("admin_session")?.value;
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... handler logic
}
```

**Input validation pattern** (analog lines 45-51):
```typescript
let body: unknown;
try {
  body = await request.json();
} catch {
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
if (!body || typeof body !== "object") {
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
```

**Sanitized 5xx pattern** (analog lines 172-188):
```typescript
if (rpcErr) {
  console.error(
    "RSVP submit_rsvps error:",
    JSON.stringify({
      code: (rpcErr as { code?: string }).code,
      message: rpcErr.message,
    })
  );
  return NextResponse.json(
    { error: "Something went wrong. Please try again." },
    { status: 500 }
  );
}
```

**UUID validation** (analog lines 32-33):
```typescript
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
```

**supabaseAdmin mutation pattern (no env-var check needed — admin.ts handles it):**
```typescript
const { data, error } = await supabaseAdmin
  .from("guests")
  .insert({ household_id, full_name })
  .select()
  .single();

if (error) {
  console.error("Guest insert error:", error);
  return NextResponse.json(
    { error: "Something went wrong. Please try again." },
    { status: 500 }
  );
}
return NextResponse.json({ success: true, guest: data });
```

---

### `app/api/admin/guests/[id]/route.ts` (controller, CRUD) — CREATE

**Analog:** `app/(main)/api/rsvp/submit/route.ts` (same validation + error pattern)

**Dynamic params pattern — params is a Promise in Next.js 16 (RESEARCH Pitfall 5):**
```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminSession = request.cookies.get("admin_session")?.value;
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;  // Must await — params is a Promise in Next.js 16

  // ... handler logic
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminSession = request.cookies.get("admin_session")?.value;
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;  // Must await
  // ... handler logic
}
```

**Guest delete order — rsvps first, then guests (RESEARCH Pattern 6, Pitfall 6):**
```typescript
// Delete rsvps row first (no FK cascade — Phase 4 D-04)
const { error: rsvpDeleteError } = await supabaseAdmin
  .from("rsvps")
  .delete()
  .eq("guest_id", id);

// A missing rsvps row (guest never RSVP'd) is harmless — proceed regardless

const { error: guestDeleteError } = await supabaseAdmin
  .from("guests")
  .delete()
  .eq("id", id);

if (guestDeleteError) {
  console.error("Guest delete error:", guestDeleteError);
  return NextResponse.json(
    { error: "Something went wrong. Please try again." },
    { status: 500 }
  );
}
return NextResponse.json({ success: true });
```

---

### `app/api/admin/rsvps/route.ts` (controller, CRUD read) — NOT CREATED (subsumed by Plan 06-04 Server Component direct read)

**Analog:** `app/(main)/api/rsvp/lookup/route.ts`

**GET handler with admin cookie check + service-role direct SELECT:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const adminSession = request.cookies.get("admin_session")?.value;
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("rsvps")
    .select("guest_id, household_id, attending, meal_choice, dietary_restrictions")
    .order("household_id");

  if (error) {
    console.error("Admin RSVPs fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ rsvps: data ?? [] });
}
```

Note: Unlike the guest-facing path (`app/(main)/api/rsvp/lookup/route.ts` lines 103-106 which uses `get_household_rsvps` RPC because anon has no SELECT on rsvps), the admin route uses `supabaseAdmin` direct SELECT — the service-role key bypasses RLS.

---

### `app/api/admin/export/guests/route.ts` (controller, file-I/O) — CREATE

**Analog:** `app/(main)/api/rsvp/lookup/route.ts` (error handling shape) + RESEARCH Pattern 5 (CSV response)

**Full pattern — non-HTML response with RFC 4180 CSV:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

function toRfc4180Field(val: string | null | undefined): string {
  if (val == null || val === "") return '""';
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
    console.error("Guest CSV export error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
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

Note: Uses `new Response(...)` not `NextResponse.json(...)` — the non-HTML response pattern from `node_modules/next/dist/docs/.../route.md` "Non-UI Responses" section.

---

### `app/api/admin/export/rsvps/route.ts` (controller, file-I/O) — CREATE

**Analog:** Same pattern as `export/guests/route.ts` above

Shares the same `toRfc4180Field` helper, admin cookie check, and `new Response(csv, { headers })` shape. Columns: `name, household_id, attending, meal_choice, dietary_restrictions`. Joins `guests` and `rsvps` via `supabaseAdmin`.

---

### `app/(admin)/admin/layout.tsx` (layout, request-response) — CREATE

**Analog:** `app/(main)/layout.tsx` (lines 1-24)

**Analog for reference:**
```typescript
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MusicButton from "@/components/MusicButton";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a href="#main-content" className="sr-only ...">Skip to content</a>
      <Navbar />
      <div id="main-content">{children}</div>
      <Footer />
      <MusicButton />
    </>
  );
}
```

**Admin layout — omit Navbar, Footer, MusicButton (internal tool, function over polish):**
```typescript
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      {children}
    </div>
  );
}
```

Stitch token classes to use: `bg-background`, `text-on-surface`, `bg-surface-container-lowest`, `bg-surface-container-low`, `text-primary`, `text-on-surface-variant`, `border-white/10`.

---

### `app/(admin)/admin/login/page.tsx` (component, request-response) — CREATE

**Analog:** `app/(main)/rsvp/page.tsx` — client island pattern with `fetch()` to a Route Handler

**"use client" + useState + fetch pattern** (analog lines 16-55, 62-128):
```typescript
"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status >= 500) {
        setError("Something went wrong on our end. Try again.");
        return;
      }
      if (!res.ok) {
        setError("Incorrect access code.");
        return;
      }
      // Redirect to admin home on success
      window.location.href = "/admin";
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  }
  // ... render
}
```

**Button pattern** (analog lines 635-645):
```typescript
<button
  type="submit"
  disabled={isSubmitting}
  className="w-full py-6 bg-primary text-on-primary font-label text-sm uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 group flex items-center justify-center space-x-4 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
>
  <span>{isSubmitting ? "Signing in…" : "Enter"}</span>
</button>
```

---

### `app/(admin)/admin/page.tsx` (component, CRUD) — CREATE

**Analog:** `app/(main)/rsvp/page.tsx` — Server Component wrapper passing data to a Client Component island

**Server Component pattern (no "use client" at top):**
```typescript
// No "use client" — this is a Server Component
import { supabaseAdmin } from "@/lib/supabase/admin";
import HouseholdsTable from "./HouseholdsTable"; // Client Component island

export default async function AdminPage() {
  const { data: guests, error } = await supabaseAdmin
    .from("guests")
    .select("id, household_id, full_name")
    .order("household_id")
    .order("full_name");

  if (error) {
    // Server Components render error UI, not throw (no error boundary by default)
    return <div className="p-8 text-error">Failed to load guests.</div>;
  }

  return <HouseholdsTable guests={guests ?? []} />;
}
```

**Client Component island — "use client" at the top of the separate island file:**
The `HouseholdsTable` component receives data as props and manages inline edit state. Mutation calls go to `/api/admin/guests/*` via `fetch()`. Mirrors the `handleSubmit` pattern from `app/(main)/rsvp/page.tsx` lines 147-191.

**UUID generation for new household (D-10):**
```typescript
const newHouseholdId = crypto.randomUUID(); // Client-generated, matches import format
```

---

### `app/(admin)/admin/rsvps/page.tsx` (component, CRUD read) — CREATE

**Analog:** `app/(main)/rsvp/page.tsx` structure + `lib/rsvp/meal-options.ts`

**Server Component with meal-count summary pattern:**
```typescript
import { supabaseAdmin } from "@/lib/supabase/admin";
import { MEAL_OPTIONS } from "@/lib/rsvp/meal-options";

export default async function AdminRsvpsPage() {
  const { data: rsvps, error } = await supabaseAdmin
    .from("rsvps")
    .select("guest_id, household_id, attending, meal_choice, dietary_restrictions")
    .order("household_id");

  if (error) {
    return <div className="p-8 text-error">Failed to load RSVPs.</div>;
  }

  const attending = (rsvps ?? []).filter((r) => r.attending);

  // Meal-count summary — keyed from MEAL_OPTIONS (D-13: single source of truth)
  const mealCounts = Object.fromEntries(MEAL_OPTIONS.map((m) => [m, 0]));
  for (const r of attending) {
    if (r.meal_choice && r.meal_choice in mealCounts) {
      mealCounts[r.meal_choice]++;
    }
  }

  // Empty state: renders cleanly with zero submissions (D-11)
  // ... render
}
```

**MEAL_OPTIONS import** (from `lib/rsvp/meal-options.ts` lines 10-18):
```typescript
export const MEAL_OPTIONS = [
  "Option A",
  "Option B",
  "Option C",
] as const;

export type MealChoice = (typeof MEAL_OPTIONS)[number];
```

---

## Shared Patterns

### Admin Cookie Verification
**Source:** RESEARCH Pattern 4 + `proxy.ts` lines 5-6 (synchronous `request.cookies.get()`)
**Apply to:** ALL `app/api/admin/*/route.ts` files (primary authz for API routes)

```typescript
// At the top of every admin Route Handler — before any other logic
const adminSession = request.cookies.get("admin_session")?.value;
if (!adminSession) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

Use `request.cookies.get()` on `NextRequest` (synchronous). Only use `await cookies()` from `next/headers` if the handler's request parameter is typed as `Request` (not `NextRequest`). The async pitfall: `cookies()` without `await` returns a truthy Promise, silently bypassing auth (RESEARCH Pitfall 1).

### Sanitized 5xx Error Vocabulary
**Source:** `app/(main)/api/rsvp/submit/route.ts` lines 176-188; `app/(main)/api/rsvp/lookup/route.ts` lines 69-75
**Apply to:** All admin Route Handlers

```typescript
// Log the real error (with code + message), return generic copy to the client
if (error) {
  console.error("Admin [operation] error:", error);
  return NextResponse.json(
    { error: "Something went wrong. Please try again." },
    { status: 500 }
  );
}
```

Never echo PostgREST/Postgres error fragments in the response body (Phase 4 D-13).

### Supabase Admin Client Usage
**Source:** `lib/supabase/admin.ts` (new) + pattern from `lib/supabase/client.ts`
**Apply to:** All `app/api/admin/*/route.ts` files and admin Server Components

No env-var check needed inside individual Route Handlers — `admin.ts` uses `!` non-null assertion. The client is created once at module scope (same as `lib/supabase/client.ts` line 6). Import as `import { supabaseAdmin } from "@/lib/supabase/admin"`.

### Input Validation Shape
**Source:** `app/(main)/api/rsvp/submit/route.ts` lines 45-51 (try/catch json parse) + lines 53-55 (object check)
**Apply to:** All admin POST/PATCH Route Handlers

```typescript
let body: unknown;
try {
  body = await request.json();
} catch {
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
if (!body || typeof body !== "object") {
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
```

### UUID Validation
**Source:** `app/(main)/api/rsvp/submit/route.ts` lines 32-33
**Apply to:** Any admin Route Handler receiving `household_id` or `guest_id`

```typescript
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
```

### Stitch Token Class Names
**Source:** `app/globals.css` lines 35-56
**Apply to:** All admin UI components

| Token | Value | Use |
|-------|-------|-----|
| `bg-background` | `#0d1b1e` | Page background |
| `bg-surface-container-lowest` | `#0d1b1e` | Card backgrounds |
| `bg-surface-container-low` | `#122023` | Input backgrounds |
| `text-on-surface` | `#e2e8e4` | Body text |
| `text-on-surface-variant` | `#a0ada9` | Secondary text |
| `text-primary` | `#d4a373` | Warm gold accent, labels, headings |
| `text-error` | `#f87171` | Error states |
| `border-white/10` | 10% white | Subtle borders |

Typography classes from existing pages: `font-headline`, `font-label`, `font-body`, `uppercase`, `tracking-[0.3em]`, `tracking-widest`.

### fetch() to Route Handler (Client Components)
**Source:** `app/(main)/rsvp/page.tsx` lines 72-78 (lookup) and 162-172 (submit)
**Apply to:** Admin Client Component islands (HouseholdsTable, login page)

```typescript
const res = await fetch("/api/admin/guests", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
if (res.status >= 500) {
  setError("Something went wrong. Try again.");
  return;
}
if (!res.ok) {
  setError("Invalid request.");
  return;
}
```

Error state: check `>= 500` first (server error), then `!res.ok` (client/validation error), then parse JSON. Mirrors the exact pattern from `rsvp/page.tsx`.

---

## No Analog Found

All files have analogs. The CSV export Route Handlers (`export/guests`, `export/rsvps`) have no existing file-I/O Route Handler in this codebase, but the pattern is well-covered by RESEARCH Pattern 5 and the standard `new Response(...)` documented in `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`.

---

## Critical Findings for Planner

1. **`/api/admin/*` routes are NOT covered by the admin proxy branch.** The proxy `pathname.startsWith("/admin")` check does not match `/api/admin/...` paths. Those routes fall through to the guest gate. Any visitor with a valid `session` cookie (i.e., any authenticated guest) can reach them at the proxy layer. The `admin_session` check inside each Route Handler is the PRIMARY and only admin authorization for these routes. The planner must make this explicit in every plan that creates an admin API route.

2. **`params` is a Promise in Next.js 16.** Dynamic Route Handlers like `[id]/route.ts` must `const { id } = await params` — not destructure directly. TypeScript does not catch this at compile time.

3. **`cookies()` from `next/headers` is async in Next.js 16.** Prefer `request.cookies.get()` on `NextRequest` (synchronous) for admin Route Handlers — simpler and avoids the async pitfall.

4. **Delete order for guests with RSVPs:** `rsvps` row first, then `guests` row. No DB FK cascade (Phase 4 D-04). An orphaned `rsvps` row (guest_id with no matching guest) silently inflates meal counts.

5. **Service-role client is server-only.** `lib/supabase/admin.ts` must never be imported in a Client Component (`"use client"` file). The planner should note this constraint in any plan that creates a Client Component alongside a Server Component for the same admin page.

---

## Metadata

**Analog search scope:** `app/`, `lib/`, `proxy.ts` (root)
**Files scanned:** 9 source files read in full
**Pattern extraction date:** 2026-06-30
