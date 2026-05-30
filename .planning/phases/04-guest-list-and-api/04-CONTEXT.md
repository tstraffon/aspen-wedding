# Phase 4: Guest List Schema & Lookup API - Context

**Gathered:** 2026-05-30
**Status:** Ready for planning
**Milestone:** v0.2 — Gated RSVP & Meal Selection

<domain>
## Phase Boundary

Backend-only phase. Ships a new `guests` table, a schema migration on the existing `rsvps` table, and two new API routes (`/api/rsvp/lookup` and `/api/rsvp/submit`) that gate the RSVP flow by name lookup and accept atomic per-household submissions. Tyler loads the guest list via CSV import in Supabase Studio at handoff. No UI changes in this phase — Phase 5 revamps `/rsvp`. The existing `/api/rsvp/route.ts` from v0.1 stays untouched until Phase 5 swaps the form over.

</domain>

<decisions>
## Implementation Decisions

### Database schema (GUEST-01, GUEST-04, MEAL-03)

- **D-01:** **New `guests` table** with columns:
  - `id` — `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
  - `household_id` — `uuid NOT NULL` (indexed; multiple guests share one household_id)
  - `full_name` — `text NOT NULL`
  - `created_at` — `timestamptz DEFAULT now()`
  - Index: `CREATE INDEX guests_full_name_lower_idx ON guests (lower(trim(full_name)))` — enables the case-insensitive trim lookup without a full table scan
  - Index: `CREATE INDEX guests_household_id_idx ON guests (household_id)` — enables fast "fetch all members of this household"
- **D-02:** **NO `email` column on guests in this phase.** YAGNI — add later if the deferred EMAIL-01 (confirmation email) gets promoted to a milestone. Documented in REQUIREMENTS.md "Future Requirements". Reverting this decision = single ALTER TABLE.
- **D-03:** **`rsvps` schema delta** (single migration, applied via Supabase Studio SQL editor):
  - **ADD:** `household_id uuid NULL` (FK to nothing in particular — just a reference), `guest_id uuid NULL`, `meal_choice text NULL`
  - **DROP:** `guest_count` (integer; no longer meaningful when household size is server-defined)
  - **KEEP:** `full_name`, `email`, `attending`, `dietary_restrictions`, `note`
  - **Unique constraint:** `CREATE UNIQUE INDEX rsvps_guest_id_uniq ON rsvps (guest_id) WHERE guest_id IS NOT NULL` (partial unique — lets v0.1 NULL rows coexist while enforcing one rsvp per guest going forward)
- **D-04:** **No FK constraint on `rsvps.guest_id → guests.id`.** Trade-off: cleaner backward compat with v0.1 rows + flexibility if guests gets re-imported with new UUIDs. Risk: orphan rsvps rows if a guest row is deleted post-RSVP. Accepted — Tyler controls the guests table and won't be deleting people post-RSVP. If a guest is removed pre-RSVP, no orphans exist yet.
- **D-05:** **v0.1 `rsvps` backward compat = nullable new columns; orphan rows accepted.** Existing v0.1 rsvps rows lack `household_id` / `guest_id` / `meal_choice`. They remain queryable but won't match the new upsert logic. Tyler can delete v0.1 test rows manually in Studio at any time before invites go out — they're not load-bearing.

### Access control (carry forward + extend)

- **D-06:** **Carry forward Phase 1's GRANT-based access pattern.** No RLS — Phase 1 hit a Supabase RLS quirk where anon was denied even by PERMISSIVE policies under `SET LOCAL ROLE anon`. Replicate that pattern here.
- **D-07:** **GRANT layer for new tables:**
  - `GRANT SELECT ON guests TO anon` — lookup is the gate; reads must be public for the lookup endpoint to work
  - `GRANT INSERT, UPDATE ON rsvps TO anon` — already present from Phase 1; verify it still covers the new columns
  - `REVOKE SELECT ON rsvps FROM anon` — verify still in place (anon should not read submitted rsvps)
  - `GRANT ALL ON guests, rsvps TO authenticated` — for Tyler's Studio access
- **D-08:** **No SITE_ACCESS_CODE changes.** The existing `SITE_ACCESS_CODE=aspen2026` proxy gate (from Phase 1) already fronts every route. New API routes inherit that. Document but don't modify.

### Lookup matching policy (GUEST-04)

- **D-09:** **Strict case-insensitive trim match.** Lookup SQL: `SELECT id, household_id, full_name FROM guests WHERE lower(trim(full_name)) = lower(trim($1)) LIMIT 1`. Guest types their full name exactly as Tyler entered it (case + whitespace forgiving). Misses route to Phase 5's "we can't find you" UX with support email + try-again.
- **D-10:** **No fuzzy matching.** No pg_trgm extension, no partial / substring / last-name fallback, no Levenshtein. Trade-off: friendlier UX (catches typos like "Sara Else" → "Sarah Else") rejected because false positives ("Sarah" matching both Sarah Else and Sarah Horan) would deliver wrong-household guests to each other. Strict + clear miss UX is the right posture for a small invite list.
- **D-11:** **Lookup returns the full household.** On hit, the endpoint executes a second query: `SELECT id, full_name FROM guests WHERE household_id = $matched_household_id ORDER BY full_name`. Returns `{ found: true, household_id, members: [{ guest_id, full_name }] }`. On miss: `{ found: false }`, HTTP 200 (miss is an expected business outcome, not an error).

### Oracle / enumeration risk

- **D-12:** **Accept the risk. No rate limiting, no CAPTCHA, no invitation codes.** Rationale: ~100-150 person invite list, the only PII returned is names already on Tyler's invite list (no addresses, no emails, no phones), and everything sits behind the existing `SITE_ACCESS_CODE` proxy gate which already deters drive-by traffic. Revisit if the invite list grows past ~500 or if the data shape changes (e.g., if EMAIL-01 promotes and email is returned in the lookup response).
- **D-13:** **Sanitize 5xx responses.** Carry forward Phase 1's pattern — no PostgREST error leakage, no SQL fragments in error bodies, generic "Something went wrong, try again" copy. Server logs the real error for debugging.

### API endpoint structure (GROUP-02, GROUP-03)

- **D-14:** **Two new POST routes, leave `/api/rsvp/route.ts` v0.1 untouched in this phase.** New routes:
  - `app/(main)/api/rsvp/lookup/route.ts` — POST `{ name: string }` → `{ found: true, household_id, members: [...] }` or `{ found: false }`. HTTP 200 on both. HTTP 400 on missing/empty `name`. HTTP 500 (sanitized) on DB error.
  - `app/(main)/api/rsvp/submit/route.ts` — POST `{ household_id: uuid, submissions: [{ guest_id, attending, meal_choice?, dietary_restrictions? }] }` → `{ success: true, count: N }` or sanitized 4xx/5xx. Validates: household_id is a uuid; every submission has a matching guest_id; attending members have a meal_choice from the allowed enum (`["chicken","fish","vegetarian"]` — see Claude's Discretion below); guest_ids in submissions all belong to the household_id.
- **D-15:** **Submit performs batched upsert via Supabase JS client.** Single round-trip:
  ```ts
  supabase.from("rsvps").upsert(rows, { onConflict: "guest_id" })
  ```
  Idempotent — same payload re-submitted updates in place. Returns the count of rows affected.
- **D-16:** **`/api/rsvp/route.ts` v0.1 stays alive but unused after Phase 5.** Phase 5's UI swap removes the form that calls it. Phase 5 SUMMARY should note the route can be deleted in a cleanup task or left in place as inert code. Not Phase 4's call.

### Tyler's data entry workflow (GUEST-01)

- **D-17:** **CSV import via Supabase Studio.** Tyler builds the guest list in Google Sheets / Numbers / Excel with columns:
  - `full_name` (text, exactly as it should match what guests will type)
  - `household_id` (uuid; generated via spreadsheet formula or pre-filled `gen_random_uuid()` SQL helper; same UUID for all members of one household — couples, families)
  - Exports to CSV. In Studio: open `guests` table → Insert → Import from CSV.
- **D-18:** **Phase 7 (handoff phase) ships the runbook.** Phase 4's job is to make the table importable and document the column shape in this CONTEXT plus the schema SQL artifact. Phase 7 writes the human-facing steps for Tyler.
- **D-19:** **A helper SQL snippet ships with the migration:** a `SELECT gen_random_uuid()` example Tyler can paste into a Sheets cell-by-cell (via QUERY or copy-paste from Studio's SQL output) to pre-generate household UUIDs. Documented in the schema SQL artifact for Phase 7 to lift into the runbook.

### Claude's Discretion

- **Specific meal enum values** — `["chicken","fish","vegetarian"]` as a working placeholder for D-14's submit validation. Phase 6 (where MEAL-02 actually lands) will lock the real menu copy. Phase 4 just needs *some* enum to validate against; the constraint is at the app layer per MEAL-02 (not a DB CHECK constraint), so updating the enum in Phase 6 = a one-line code change.
- **Request body shape for submit** — uses `submissions: [{ guest_id, attending, meal_choice?, dietary_restrictions? }]` rather than `members: [...]` for vocabulary precision (a submission is the act of submitting; members come from the lookup response).
- **No idempotency-key header** — the `(guest_id)` unique constraint plus upsert semantics give natural idempotency. Adding an `Idempotency-Key` header pattern would be overkill.
- **No request body size limit** — Vercel default (4.5 MB) is fine; even a 16-person household submission is < 10KB.
- **No structured logging** — `console.log` for errors is good enough at this scale. Vercel captures stdout.
- **Sanitized error responses** match Phase 1's vocabulary: `{ error: "Something went wrong. Please try again." }` for 5xx; `{ error: "Invalid request" }` for 4xx; specific user-facing messages only for known business cases (e.g., lookup miss is `{ found: false }`, not an error).
- **Local dev seed data** — a small SQL `INSERT` block with 2-3 test households (including Tyler & Emily) for `dev` use. Lives in the schema SQL artifact, gated by a `-- DEV SEED, DO NOT RUN IN PROD` comment.
- **Test approach** — no test framework installed (per Phase 3 VALIDATION). Verification is curl-based smoke tests against `npm run dev`. The PLAN's `<verify>` blocks will use curl + jq to assert response shapes. Phase 7 covers the human-facing end-to-end smoke.

</decisions>

<deferred>
## Deferred Ideas (out of scope for Phase 4)

- **Email column on guests** — D-02 explicitly defers. Add when EMAIL-01 promotes.
- **Rate limiting / CAPTCHA** — D-12 explicitly accepts the oracle risk. Revisit if scale or threat model changes.
- **Foreign-key constraint on `rsvps.guest_id → guests.id`** — D-04 explicitly skips for backward compat + flexibility.
- **Admin endpoint for guest list import** — out of scope; Supabase Studio CSV is enough.
- **`/api/rsvp/route.ts` deletion** — Phase 5 or later; not Phase 4's concern.
- **Real meal enum** — Phase 6 (MEAL-02). Phase 4 ships a placeholder.
- **Migration tooling (e.g., `supabase/migrations/` folder)** — out of scope; matches v0.1 pattern of manual Studio SQL.
- **Audit log of RSVP changes** — would be a separate `rsvp_audit` table; not requested.

</deferred>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and project anchors
- `.planning/ROADMAP.md` §"Phase 4 — Guest List Schema & Lookup API" — phase goal, success criteria, scope
- `.planning/PROJECT.md` — v0.2 milestone section, Stitch design system, palette, constraints
- `.planning/REQUIREMENTS.md` §v0.2 — full text of GUEST-01, GUEST-04, GROUP-02, GROUP-03, MEAL-03

### Prior phase artifacts (Phase 1 — RSVP backend patterns to extend)
- `.planning/phases/01-rsvp-enablement/01-01-PLAN.md` — Phase 1 backend hardening plan
- `.planning/phases/01-rsvp-enablement/01-01-SUMMARY.md` — **CRITICAL** — documents the GRANT-vs-RLS Supabase quirk that forced GRANT-based writes, the env-var contract, sanitized 5xx response pattern, and the SITE_ACCESS_CODE proxy gate
- `.planning/phases/01-rsvp-enablement/01-PATTERNS.md` — Phase 1 patterns map; check for backend route + Supabase client patterns

### Existing code to read before drafting
- `app/(main)/api/rsvp/route.ts` — **PRIMARY ANALOG** — the existing v0.1 RSVP POST endpoint. New `/lookup` and `/submit` routes match this shape: module-call-time env reads, anon Supabase client, sanitized errors, status codes.
- `.env.local` (gitignored) — verify presence of `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SITE_ACCESS_CODE`
- `.env.local.example` — env contract reference
- `README.md` — Phase 1 documented env contract here; new env vars (if any) get added
- `package.json` — verify `@supabase/supabase-js` version + Next.js 16 compatibility
- `AGENTS.md` — Next.js 16 breaking-changes reminder

### Schema artifacts (created in this phase)
- `.planning/phases/04-guest-list-and-api/SCHEMA.sql` (NEW — PLAN should create this) — single source of truth for the schema migration. Includes:
  - CREATE TABLE guests
  - ALTER TABLE rsvps (add/drop columns)
  - CREATE INDEX statements
  - GRANT statements
  - DEV SEED INSERT block (gated by comment)
  - Helper: `SELECT gen_random_uuid()` example for Tyler's household_id generation

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Anon Supabase client** (`app/(main)/api/rsvp/route.ts` from Phase 1): `createClient(SUPABASE_URL, SUPABASE_ANON_KEY)` pattern. New routes import the same client. No service-role key anywhere.
- **Env-var read pattern** (`app/(main)/api/rsvp/route.ts`): read at module-call time inside the route handler, fail fast with sanitized 500 if missing. Phase 1 SUMMARY documents this explicitly.
- **Sanitized 5xx response** (`app/(main)/api/rsvp/route.ts`): `{ error: "Something went wrong" }` with HTTP 500; never echo PostgREST error bodies to clients.
- **SITE_ACCESS_CODE proxy** (existing project chrome): fronts every route. New API routes inherit; no per-route configuration needed.
- **Next.js 16 Route Handler pattern**: `export async function POST(request: Request) { ... }` in `app/.../route.ts`. Read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` before writing — AGENTS.md warns about breaking changes from training data.

### Patterns to NOT Reuse
- **RLS policies** — Phase 1 hit a Supabase quirk; do NOT add RLS. Use GRANT only.
- **Service-role key fallback** — Phase 1 explicitly removed any service-role code path. The anon key is the only credential used at runtime.
- **`guest_count` integer on rsvps** — being dropped this phase; do not reference in new code.

### Integration Points
- **Phase 5 (downstream)** — will call `/api/rsvp/lookup` and `/api/rsvp/submit` from the revamped `/rsvp` page. Phase 4's API contracts (D-14) lock the request/response shapes Phase 5 builds against.
- **Phase 7 (downstream)** — will document Tyler's CSV import workflow (D-17/D-18/D-19), build the meal-count report SQL, and provide the runbook.

</code_context>

---

**Next:** `/gsd:plan-phase 4` (no UI = no `/gsd:ui-phase` needed). The planner has explicit schema + API contracts to work from; estimated 2-3 plans (schema migration + lookup route + submit route, with the SCHEMA.sql artifact serving as a single source of truth).
