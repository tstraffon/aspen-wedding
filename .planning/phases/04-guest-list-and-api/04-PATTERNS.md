# Phase 4: Guest List Schema & Lookup API — Pattern Map

**Mapped:** 2026-05-30
**Files analyzed:** 3 new (1 SQL artifact + 2 route handlers)
**Analogs found:** 3 / 3 (all map to Phase 1 artifacts)

## Scope Recap

Backend-only phase. The existing `app/(main)/api/rsvp/route.ts` (v0.1) is the **primary structural analog** for both new route handlers — same Next.js 16 Route Handler shape, same anon Supabase client, same module-call-time env reads, same sanitized 5xx responses. The `SCHEMA.sql` artifact is a phase document, not deployed code; its analog is composite (Phase 1 SUMMARY for the GRANT pattern, Phase 1 PATTERNS for the env contract, the inline SQL Tyler ran in Studio for the original `rsvps` table).

The `/api/rsvp/route.ts` v0.1 file is **explicitly NOT modified** in this phase (D-16). It is referenced here only as the analog source.

## File Classification

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|----------------|---------------|
| `.planning/phases/04-guest-list-and-api/SCHEMA.sql` | migration (phase artifact, not deployed) | n/a | composite: Phase 1 SUMMARY §"RLS → GRANT-based" + Phase 1 inline Studio SQL | partial (no prior schema artifact exists in repo) |
| `app/(main)/api/rsvp/lookup/route.ts` | route handler | request-response (read-side) | `app/(main)/api/rsvp/route.ts` | exact (same Next.js 16 POST handler shape; differs only in business logic — SELECT vs INSERT) |
| `app/(main)/api/rsvp/submit/route.ts` | route handler | request-response (batch upsert) | `app/(main)/api/rsvp/route.ts` | exact (same shape; differs in payload validation + upsert call) |

| Touched (Not Modified) | Role | Status |
|------------------------|------|--------|
| `app/(main)/api/rsvp/route.ts` | route handler | **Do not modify in this phase (D-16).** Phase 5 swaps the form away from it; Phase 5+ may delete it. |

---

## Pattern Assignments

### `.planning/phases/04-guest-list-and-api/SCHEMA.sql` (migration artifact)

**Analog (composite):**
- **GRANT-vs-RLS pattern:** `.planning/phases/01-rsvp-enablement/01-01-SUMMARY.md` §"Plan Deviations #1: RLS → GRANT-based write-only access (security-equivalent)"
- **Env contract / column shape:** `app/(main)/api/rsvp/route.ts` lines 29-36 (the insert payload defines the columns the original `rsvps` table provides)
- **Helper SQL convention:** Phase 1 had no analog for a tracked SQL artifact; this is the first

**No code excerpt to copy verbatim** — this is a phase document. The migration content is dictated by CONTEXT D-01..D-07 and D-19. The structural template:

```sql
-- Phase 4: Guest List Schema & Lookup API
-- Apply via Supabase Studio → SQL Editor
-- Idempotent where possible (IF NOT EXISTS / DROP IF EXISTS)

-- ============================================================
-- 1. CREATE TABLE guests (D-01)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.guests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL,
  full_name    text NOT NULL,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS guests_full_name_lower_idx
  ON public.guests (lower(trim(full_name)));

CREATE INDEX IF NOT EXISTS guests_household_id_idx
  ON public.guests (household_id);

-- ============================================================
-- 2. ALTER TABLE rsvps — add/drop columns (D-03)
-- ============================================================
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS household_id uuid;
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS guest_id     uuid;
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS meal_choice  text;
ALTER TABLE public.rsvps DROP COLUMN IF EXISTS guest_count;

-- Partial unique index — lets v0.1 NULL rows coexist (D-03)
CREATE UNIQUE INDEX IF NOT EXISTS rsvps_guest_id_uniq
  ON public.rsvps (guest_id) WHERE guest_id IS NOT NULL;

-- ============================================================
-- 3. GRANT layer — carry forward Phase 1 pattern (D-06, D-07)
-- ============================================================
-- guests: anon reads (lookup is the gate), authenticated full access (Studio)
GRANT SELECT ON public.guests TO anon;
GRANT ALL    ON public.guests TO authenticated;

-- rsvps: anon writes only (Phase 1 grants); verify after ALTER
GRANT INSERT, UPDATE ON public.rsvps TO anon;
REVOKE SELECT         ON public.rsvps FROM anon;
GRANT ALL             ON public.rsvps TO authenticated;

-- ============================================================
-- 4. Helper for Tyler's household_id generation (D-19)
-- ============================================================
-- Paste this into Studio to generate a uuid per household:
--   SELECT gen_random_uuid();
-- Run once per household, copy the result into your CSV's household_id column.

-- ============================================================
-- 5. DEV SEED — DO NOT RUN IN PROD
-- ============================================================
-- INSERT INTO public.guests (household_id, full_name) VALUES
--   ('11111111-1111-1111-1111-111111111111', 'Tyler Straffon'),
--   ('11111111-1111-1111-1111-111111111111', 'Emily ...'),
--   ('22222222-2222-2222-2222-222222222222', 'Sarah Else'),
--   ('33333333-3333-3333-3333-333333333333', 'Sarah Horan');
```

**GRANT pattern source — copy verbatim approach from Phase 1 SUMMARY lines 90-98:**

> "Disable RLS on `public.rsvps`. REVOKE all default grants from anon, then GRANT only INSERT. Same security intent (anon writes, never reads/updates/deletes), enforced by Postgres GRANT layer instead of policy layer."

This phase extends the same model: `guests` gets `GRANT SELECT TO anon` (because lookup must read), `rsvps` keeps its existing INSERT/UPDATE grants (verify after ALTER), neither table has RLS enabled.

**Deviations from analog:**
- Phase 1 ran SQL inline in Studio with no tracked artifact. Phase 4 produces a tracked `SCHEMA.sql` so the migration is reviewable, version-controlled, and re-runnable. The runbook step ("paste into Studio") matches Phase 1's manual workflow.
- Dev seed block is new — no Phase 1 analog. Gated by SQL comment per CONTEXT Claude's Discretion.

**What NOT to copy from analog:**
- ❌ **No RLS policies** — Phase 1's RLS attempt failed (anon denied even by PERMISSIVE policies under `SET LOCAL ROLE anon`). D-06 carries forward GRANT-only.
- ❌ **No FK constraint** `rsvps.guest_id REFERENCES guests(id)` — D-04 explicitly skips for backward compat.
- ❌ **No `guest_count` references** — being dropped this phase.
- ❌ **No service-role grants** — Phase 1 removed the service-role code path; don't reintroduce.

---

### `app/(main)/api/rsvp/lookup/route.ts` (route handler, request-response — read-side)

**Analog:** `app/(main)/api/rsvp/route.ts` (full file, 47 lines)

**Imports + signature pattern — copy verbatim from analog lines 1-4:**

```ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  // ...destructure expected fields from body
}
```

**Input validation pattern — copy shape from analog lines 9-14:**

```ts
// analog: app/(main)/api/rsvp/route.ts lines 9-14
if (!fullName || !email || !attending) {
  return NextResponse.json(
    { error: "Missing required fields" },
    { status: 400 }
  );
}
```

Lookup variant — single required field `name`:

```ts
const { name } = body;
if (!name || typeof name !== "string" || !name.trim()) {
  return NextResponse.json(
    { error: "Invalid request" },
    { status: 400 }
  );
}
```

Note the sanitized 4xx copy per CONTEXT Claude's Discretion: `{ error: "Invalid request" }` (matches Phase 1 vocabulary).

**Env-var read + early-return pattern — copy verbatim from analog lines 16-25:**

```ts
// analog: app/(main)/api/rsvp/route.ts lines 16-25
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase env vars not configured");
  return NextResponse.json(
    { error: "Server configuration error" },
    { status: 500 }
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);
```

This block is **load-bearing per Phase 1 SUMMARY** (`patterns-established` line 42: "route handlers read env vars at module-call time, fail fast with 500 + generic error if missing"). Copy unchanged.

**Core lookup pattern — new (no in-repo SELECT analog; derived from CONTEXT D-09, D-11):**

```ts
// Step 1: case-insensitive trim match (D-09)
const trimmed = name.trim();
const { data: matches, error: lookupErr } = await supabase
  .from("guests")
  .select("id, household_id, full_name")
  .ilike("full_name", trimmed)   // OR use .rpc / raw filter; see note below
  .limit(1);
```

**Implementation note for planner:** Supabase JS client's `.ilike()` is case-insensitive but does not handle the `lower(trim(...))` symmetry from D-09. Two options:

1. **Postgres function via `.rpc()`** — define a SQL function in `SCHEMA.sql` that wraps the canonical query and call it from JS. Cleanest.
2. **Raw filter via `.filter()`** with a server-side comparison — relies on the `guests_full_name_lower_idx` index (D-01).
3. **`.eq()` after client-side normalization** — `.eq("full_name", trimmed)` will NOT use the lowercased index and will be case-sensitive. ❌

Planner picks; the index in `SCHEMA.sql` is built for option 1 or 2. Recommend option 2 with raw `.filter()` or option 1 with a `lookup_guest_by_name(p_name text)` Postgres function.

```ts
// Step 2: on hit, fetch full household (D-11)
if (matches && matches.length > 0) {
  const matched = matches[0];
  const { data: members, error: householdErr } = await supabase
    .from("guests")
    .select("id, full_name")
    .eq("household_id", matched.household_id)
    .order("full_name");

  if (householdErr) {
    console.error("Household fetch error:", householdErr);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    found: true,
    household_id: matched.household_id,
    members: (members ?? []).map(m => ({ guest_id: m.id, full_name: m.full_name })),
  });
}

// Step 3: miss — HTTP 200 with found:false (D-11)
return NextResponse.json({ found: false });
```

**Error handling pattern — copy from analog lines 38-44:**

```ts
// analog: app/(main)/api/rsvp/route.ts lines 38-44
if (error) {
  console.error("Supabase insert error:", error);
  return NextResponse.json(
    { error: "Could not save RSVP" },
    { status: 500 }
  );
}
```

Lookup variant uses generic sanitized copy per D-13:

```ts
if (lookupErr) {
  console.error("Guest lookup error:", lookupErr);
  return NextResponse.json(
    { error: "Something went wrong. Please try again." },
    { status: 500 }
  );
}
```

**Success response shape — match analog line 46 vocabulary:**

```ts
// analog: app/(main)/api/rsvp/route.ts line 46
return NextResponse.json({ success: true });
```

Lookup variant returns business state, not success flag, per D-11:

```ts
// hit
return NextResponse.json({ found: true, household_id, members });
// miss (HTTP 200 — miss is a business outcome, not an error)
return NextResponse.json({ found: false });
```

**Deviations from analog:**
- **Read instead of write** — analog inserts; this route does two SELECTs. The Supabase client is the same, but `.from("guests").select(...)` replaces `.from("rsvps").insert(...)`.
- **Two database round-trips** — one match query, one household fetch. Analog has one. Acceptable: ~150-row table, indexed lookups, both queries return < 20 rows.
- **HTTP 200 on miss** — analog returns 400/500 on failure. Lookup miss is *not* a failure; it's a business outcome. The HTTP 200 + `{ found: false }` shape is locked by D-11.
- **Semantically GET-shaped, but POST** — D-14 chose POST so the body carries `{ name }` cleanly (no URL encoding, no query-string PII in proxy logs). Document in route comment.

**What NOT to copy from analog:**
- ❌ **No `attending`, `guest_count`, `dietary_restrictions` references** — different endpoint, different payload.
- ❌ **No service-role fallback** — `SUPABASE_SERVICE_ROLE_KEY ??` was removed from analog in Phase 1; don't reintroduce.
- ❌ **No `error.message` echo** — Phase 1 explicitly removed PostgREST error leakage. Generic copy only.
- ❌ **No `'use client'` directive** — route handlers are server-only by default.

---

### `app/(main)/api/rsvp/submit/route.ts` (route handler, request-response — batch upsert)

**Analog:** `app/(main)/api/rsvp/route.ts` (full file, 47 lines)

**Imports + signature pattern — copy verbatim from analog lines 1-4** (same as lookup; see above).

**Env-var read + early-return pattern — copy verbatim from analog lines 16-25** (same as lookup; see above).

**Input validation pattern — copy shape from analog lines 9-14, extended per D-14:**

```ts
const { household_id, submissions } = body;

// (a) household_id must be a uuid
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!household_id || typeof household_id !== "string" || !UUID_RE.test(household_id)) {
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

// (b) submissions must be a non-empty array
if (!Array.isArray(submissions) || submissions.length === 0) {
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

// (c) every submission has guest_id (uuid) + attending (boolean)
const MEAL_ENUM = ["chicken", "fish", "vegetarian"] as const; // placeholder; Phase 6 locks real menu
type Submission = { guest_id: string; attending: boolean; meal_choice?: string; dietary_restrictions?: string };

for (const s of submissions as Submission[]) {
  if (!s.guest_id || !UUID_RE.test(s.guest_id)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (typeof s.attending !== "boolean") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  // (d) attending members need a meal_choice from the enum
  if (s.attending && (!s.meal_choice || !MEAL_ENUM.includes(s.meal_choice as typeof MEAL_ENUM[number]))) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
```

**Authorization check — guest_ids belong to household_id (D-14):**

```ts
// Defense against client-supplied guest_ids that don't belong to the claimed household.
const { data: householdGuests, error: authErr } = await supabase
  .from("guests")
  .select("id")
  .eq("household_id", household_id);

if (authErr) {
  console.error("Household authz lookup error:", authErr);
  return NextResponse.json(
    { error: "Something went wrong. Please try again." },
    { status: 500 }
  );
}

const validIds = new Set((householdGuests ?? []).map(g => g.id));
const allBelong = (submissions as Submission[]).every(s => validIds.has(s.guest_id));
if (!allBelong) {
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
```

**Core upsert pattern — D-15 (single round-trip, idempotent):**

```ts
const rows = (submissions as Submission[]).map(s => ({
  household_id,
  guest_id: s.guest_id,
  attending: s.attending,
  meal_choice: s.attending ? s.meal_choice ?? null : null,
  dietary_restrictions: s.dietary_restrictions ?? null,
  // full_name / email / note left null for v0.2 upserts; v0.1 rows keep their data
}));

const { error: upsertErr, count } = await supabase
  .from("rsvps")
  .upsert(rows, { onConflict: "guest_id", count: "exact" });

if (upsertErr) {
  console.error("RSVP upsert error:", upsertErr);
  return NextResponse.json(
    { error: "Something went wrong. Please try again." },
    { status: 500 }
  );
}

return NextResponse.json({ success: true, count: count ?? rows.length });
```

**Error handling pattern — copy from analog lines 38-44** (already shown above; sanitized + `console.error` for server-side diagnostics).

**Success response shape — extends analog line 46:**

```ts
// analog: app/(main)/api/rsvp/route.ts line 46
return NextResponse.json({ success: true });

// submit variant adds count per D-14
return NextResponse.json({ success: true, count });
```

**Deviations from analog:**
- **Upsert instead of insert** — analog uses `.insert()`; submit uses `.upsert({ onConflict: "guest_id" })` per D-15. Idempotent re-submission overwrites in place.
- **Batched payload** — analog handles one guest; submit handles N (one household). Single round-trip.
- **Pre-flight authorization query** — analog has no authz check (it just inserts what the client sends). Submit must verify guest_ids belong to the claimed household (D-14). Two queries: authz SELECT, then upsert.
- **App-layer enum, not DB CHECK** — meal_choice is validated in JS, not via a Postgres CHECK constraint. CONTEXT explicitly notes the constraint is at the app layer so Phase 6 can swap the enum with a one-line change.
- **No FK enforcement** — D-04 skips the FK; the authz check above is the substitute defense.

**What NOT to copy from analog:**
- ❌ **No `full_name`, `email`, `attending === "accept"` payload mapping** — v0.1 payload shape is dead for v0.2 upserts. New columns are `household_id`, `guest_id`, `meal_choice`. `attending` is already a boolean (no string coercion).
- ❌ **No `parseInt(guestCount)`** — `guest_count` column is being dropped this phase.
- ❌ **No `SUPABASE_SERVICE_ROLE_KEY` fallback** — same as lookup.
- ❌ **No `error.message` in response** — same as lookup.
- ❌ **No `'use client'`** — server-only.

---

## Shared Patterns

### Anon Supabase client (apply to both new route handlers)

**Source:** `app/(main)/api/rsvp/route.ts` lines 16-27

```ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase env vars not configured");
  return NextResponse.json(
    { error: "Server configuration error" },
    { status: 500 }
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);
```

Module-call-time reads inside the handler (not module-top-level), fail-fast with sanitized 500. Per Phase 1 SUMMARY `patterns-established`.

### Sanitized error response (apply to both new route handlers + every catch-able branch)

**Source:** Phase 1 SUMMARY §"sanitized 500 responses (no PostgREST error leakage)" + analog lines 38-44

| Status | Body | When |
|--------|------|------|
| 400 | `{ error: "Invalid request" }` | Malformed payload, missing fields, bad uuid format |
| 500 | `{ error: "Something went wrong. Please try again." }` | DB error, unexpected exception |
| 500 | `{ error: "Server configuration error" }` | Missing env vars |
| 200 | `{ found: false }` | Lookup miss (business state, not error) |
| 200 | `{ found: true, household_id, members }` | Lookup hit |
| 200 | `{ success: true, count }` | Submit success |

Always `console.error(...)` the real error server-side before returning the sanitized body. Phase 1 vocabulary; no PostgREST error fragments, no SQL fragments, no schema names in client responses.

### Next.js 16 Route Handler (apply to both new route handlers)

**Source:** `app/(main)/api/rsvp/route.ts` line 4 + AGENTS.md note

```ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  // ...
}
```

Before writing either route, read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` to verify the Next 16 Route Handler signature has not changed since the v0.1 route was written. AGENTS.md is explicit: "This is NOT the Next.js you know." Heed deprecation notices.

### GRANT-based access (apply to SCHEMA.sql)

**Source:** Phase 1 SUMMARY §"Plan Deviations #1"

```sql
-- Pattern (do not enable RLS):
GRANT <minimal-required-ops> ON public.<table> TO anon;
REVOKE <unnecessary-ops>      ON public.<table> FROM anon;
GRANT ALL                     ON public.<table> TO authenticated;
```

Phase 1's reasoning (verbatim from SUMMARY): "Disable RLS on `public.rsvps`. REVOKE all default grants from anon, then GRANT only INSERT. Same security intent (anon writes, never reads/updates/deletes), enforced by Postgres GRANT layer instead of policy layer."

Phase 4 extension: `guests` adds `GRANT SELECT TO anon` because lookup must read. `rsvps` keeps its Phase 1 grants; verify they cover the new columns (they will — column-level grants are not in use, table-level grants cover ALTERed columns automatically).

### SITE_ACCESS_CODE proxy gate (inherited; no action required)

**Source:** Phase 1 SUMMARY + CONTEXT D-08

Both new routes inherit the proxy gate at `/proxy.ts`. No per-route configuration. Document in route header comment that the route assumes a valid session cookie set by `/api/auth/login`. Smoke tests need to authenticate first (curl with `-c cookies.txt` against `/api/auth/login`, then `-b cookies.txt` against `/api/rsvp/lookup`).

---

## No Analog Found

| File | Role | Data Flow | Reason | Source to Use Instead |
|------|------|-----------|--------|-----------------------|
| `SCHEMA.sql` (tracked migration artifact) | migration | n/a | Phase 1 ran SQL inline in Studio; no tracked SQL exists in repo | CONTEXT D-01..D-07, D-19 + Phase 1 SUMMARY GRANT pattern |
| Two-step SELECT pattern (match + household fetch) | DB read | request-response | No prior SELECT-from-Supabase route handler in repo (v0.1 only inserts) | CONTEXT D-09, D-11 + Supabase JS client docs |
| Batched upsert with `onConflict` | DB write (batch) | request-response | v0.1 route is single-row insert only | CONTEXT D-15 + Supabase JS client docs (`.upsert(rows, { onConflict })`) |
| Uuid format validation in route | input validation | request-response | v0.1 only checks truthy-ness on strings | New regex per submit route; consider extracting to `lib/validators.ts` if it gets a third caller |
| Cross-resource authz check (guest_ids ⊆ household) | authorization | request-response | No prior authz-in-route pattern; SITE_ACCESS_CODE is the only gate today | CONTEXT D-14 + the snippet in `submit/route.ts` above |

---

## Preservation Guarantee

This phase ships **three new files** and modifies **zero existing files**. Specifically protected:

- `app/(main)/api/rsvp/route.ts` — D-16: untouched. Phase 5 swaps the form away from it; Phase 5+ may delete.
- `app/(main)/rsvp/page.tsx` — Phase 5's concern, not Phase 4's.
- `components/Navbar.tsx` — already enabled in Phase 1; no link changes.
- `.env.local.example` — no new env vars this phase (CONTEXT confirms `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` cover both new routes; `SITE_ACCESS_CODE` is already documented).
- `README.md` — Environment section is current; no changes.

What is new:
- `.planning/phases/04-guest-list-and-api/SCHEMA.sql` — schema migration artifact
- `app/(main)/api/rsvp/lookup/route.ts` — gated name lookup
- `app/(main)/api/rsvp/submit/route.ts` — atomic household upsert

---

## Metadata

**Analog search scope:** `app/(main)/api/`, `app/api/`, `.planning/phases/01-rsvp-enablement/`, `lib/`
**Files scanned:**
- `app/(main)/api/rsvp/route.ts` (primary analog; v0.1 POST endpoint)
- `.planning/phases/01-rsvp-enablement/01-01-PLAN.md` (Phase 1 backend hardening plan; security model + env contract)
- `.planning/phases/01-rsvp-enablement/01-01-SUMMARY.md` (load-bearing; GRANT-vs-RLS pivot, env-var pattern, sanitized 5xx)
- `.planning/phases/01-rsvp-enablement/01-PATTERNS.md` (Phase 1 pattern map; route handler conventions, env example, shared error shape)
- `.env.local.example` (verified two-var contract; no new vars needed)
- `README.md` (Environment section already documents the contract)
- `package.json` (verified `@supabase/supabase-js ^2.100.0`, `next 16.2.6`, `react 19.2.4`)
- `AGENTS.md` (Next.js 16 breaking-changes reminder; planner must check `node_modules/next/dist/docs/` for Route Handler signature)

**Pattern extraction date:** 2026-05-30

## PATTERN MAPPING COMPLETE
