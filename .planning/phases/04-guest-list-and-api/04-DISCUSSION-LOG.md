# Phase 4 Discussion Log — Guest List Schema & Lookup API

**Date:** 2026-05-30
**Areas discussed:** Lookup matching tightness · Tyler's data entry workflow · Lookup oracle risk · Email column on guests
**Areas skipped (Claude's discretion):** API endpoint structure (two new routes), specific meal enum (placeholder until Phase 6), test approach (curl smoke until a test framework exists)

---

## Pre-discussion analysis

### Carry-forward decisions (not re-asked)
From Phase 1 SUMMARY (`.planning/phases/01-rsvp-enablement/01-01-SUMMARY.md`):
- GRANT-based write access (NOT RLS — Supabase quirk forced this)
- Anon JWT in `.env.local` (legacy format, not `sb_publishable_*`)
- Module-call-time env-var reads, fail fast with sanitized 500 if missing
- Sanitized 5xx response pattern (no PostgREST error leakage)
- SITE_ACCESS_CODE proxy gate (existing — new routes inherit)
- No `supabase/migrations/` folder — manual Studio SQL pattern

From Phase 4 ROADMAP scope (already locked):
- uuid pks for `guests` table
- case-insensitive trim match for lookup (refined further in Area 1 below)
- Drop `guest_count` from `rsvps`
- Nullable new columns on `rsvps` for v0.1 backward compat
- Two new API routes (`/api/rsvp/lookup`, `/api/rsvp/submit`)

### Gray areas surfaced to user
- Lookup matching tightness
- Tyler's data entry workflow
- Lookup oracle risk
- Email column on guests now or later

### User selection
All 4 areas discussed.

---

## Area 1: Lookup matching tightness

### Options
- Strict: full name, case-insensitive trim (recommended)
- Partial: case-insensitive substring with disambiguator
- Fuzzy: pg_trgm similarity ≥ 0.7
- Tiered: exact → last-name fallback → miss

### Selected
**Strict: full name, case-insensitive trim.**

### Why noted
Lowest false-positive risk. The cost of false positives in a wedding RSVP context (Sarah Else getting Sarah Horan's household form) is high — guests RSVPing for the wrong household. The cost of false negatives (Sarah Else mistyping "Sara") is mild — they see "we can't find you" + try-again + support email. Stricter is the right posture.

---

## Area 2: Tyler's data entry workflow

### Options
- CSV import via Supabase Studio (recommended)
- SQL INSERT batch (paste VALUES)
- Manual row-by-row in Studio UI
- Build an admin endpoint with bearer token

### Selected
**CSV import via Supabase Studio.**

### Why noted
Lightest tooling. Tyler builds the list in his spreadsheet of choice, generates household_id UUIDs in-sheet (formula or copy-paste from Studio's `SELECT gen_random_uuid()`), exports CSV, imports in Studio. Phase 7 ships the human-facing runbook with exact column names + UUID generation steps.

---

## Area 3: Lookup oracle risk

### Options
- Accept the risk (recommended)
- Add IP rate limit (~10 lookups/min/IP)
- Require an invitation code alongside the name
- CAPTCHA on the lookup form

### Selected
**Accept the risk.**

### Why noted
Small invite list (~100-150), low-stakes social-graph info (no addresses/emails returned, just names already on Tyler's invite list), behind the existing SITE_ACCESS_CODE proxy gate which already deters drive-by traffic. Zero new code, zero new dependencies. Documented in CONTEXT D-12 as accept-with-rationale; revisit if invite list grows past ~500 or the data shape changes.

---

## Area 4: Email column on guests now or later?

### Options
- Add email now, nullable, don't use yet (recommended)
- Skip per YAGNI
- Add email AND use as lookup field
- Add email + phone now

### Selected
**Skip per YAGNI.**

### Why noted
Tyler chose not to add the column even though it was the recommended option. Aligns with PROJECT.md's "no email infrastructure" stance and avoids adding columns that won't be queried this milestone. If EMAIL-01 promotes in a future milestone, the cost is one ALTER TABLE — trivial. Documented in CONTEXT D-02.

---

## Claude's Discretion (decided without asking)

- **API endpoint structure** — two new POST routes (`/api/rsvp/lookup`, `/api/rsvp/submit`), leave the v0.1 `/api/rsvp/route.ts` untouched in this phase. Phase 5's UI swap will retire the v0.1 form's caller. CONTEXT D-14/D-16.
- **Specific meal enum values** — `["chicken","fish","vegetarian"]` as a placeholder for submit validation in Phase 4. Phase 6 (MEAL-02) locks the real menu copy. Validation is app-layer not DB CHECK, so swapping in Phase 6 = one-line change. CONTEXT §Claude's Discretion.
- **Test approach** — curl-based smoke tests in `<verify>` blocks; no test framework introduced (matches Phase 3 VALIDATION.md "no e2e framework" posture). Phase 7 covers human-facing end-to-end smoke.
- **Unique constraint on rsvps(guest_id)** — partial unique index (`WHERE guest_id IS NOT NULL`) to coexist with v0.1 NULL rows. Cleaner than NOT NULL + backfill.
- **No FK constraint on rsvps.guest_id → guests.id** — flexibility for re-imports, simpler v0.1 backward compat. Orphan risk accepted (Tyler controls the guests table).
- **Sanitized error wording** — carry forward Phase 1's `{ error: "Something went wrong. Please try again." }` for 5xx; `{ error: "Invalid request" }` for 4xx; specific business messages only for known cases (e.g., lookup miss is `{ found: false }`, not an error).
- **Local dev seed** — schema artifact includes a small `-- DEV SEED, DO NOT RUN IN PROD` block with 2-3 test households for local dev.

---

## Deferred Ideas (preserved for future)

- Email column on guests (defer until EMAIL-01 promotion)
- Foreign-key constraint on rsvps.guest_id → guests.id
- Rate limiting / CAPTCHA on lookup
- Real meal enum (Phase 6 / MEAL-02)
- Admin endpoint for guest list import
- `/api/rsvp/route.ts` deletion (Phase 5 or cleanup task)
- Migration tooling (`supabase/migrations/` folder)
- Audit log of RSVP changes

---

## Scope creep redirected

None — discussion stayed inside the phase boundary throughout.
