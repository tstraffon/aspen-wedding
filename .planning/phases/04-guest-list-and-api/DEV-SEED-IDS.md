# Dev Seed Guest IDs (Phase 4)

Captured from Supabase Studio after applying `SCHEMA.sql` + the dev seed block on 2026-06-01.

**Wave 2 plans (04-02, 04-03) read this file** to construct curl payloads for the smoke tests against the lookup and submit endpoints. The UUIDs here are stable across runs because they come from the actual `gen_random_uuid()` values inserted at seed time — the row UUIDs persist until Phase 7's cleanup truncates these dev households before real invitations go out.

| full_name      | guest_id                               | household_id                           |
|----------------|----------------------------------------|----------------------------------------|
| Emily Riley    | `26a564b5-c275-413d-a706-6d361e275090` | `11111111-1111-1111-1111-111111111111` |
| Tyler Straffon | `e3be61dd-d163-4c02-9810-243dfb7a7cbf` | `11111111-1111-1111-1111-111111111111` |
| Sarah Else     | `0f36de75-0267-4ae1-94fb-439428e1adf2` | `22222222-2222-2222-2222-222222222222` |
| Sarah Horan    | `fb80d503-ce44-41ac-8cb5-73eead093da6` | `33333333-3333-3333-3333-333333333333` |

## Usage by Wave 2

**Plan 04-02 (lookup route):**
- Positive smoke: POST `{ "name": "Tyler Straffon" }` → expect `{ found: true, household_id: "11111111-…", members: [Emily, Tyler] }`
- Whitespace + case smoke: POST `{ "name": "  TYLER STRAFFON  " }` → same response (proves RPC normalization)
- Disambiguation smoke: POST `{ "name": "Sarah Else" }` → returns ONLY Sarah Else's household (`22222222…`), NOT Sarah Horan's — proves the strict full-name match (D-09/D-10)
- Miss smoke: POST `{ "name": "Nonexistent Person" }` → expect `{ found: false }` HTTP 200

**Plan 04-03 (submit route):**
- Positive smoke (Tyler & Emily attending, both pick meals): POST household `11111111-…` with both guest_ids, attending=true, meal_choice set
- Idempotency smoke: re-submit the same payload → expect upsert (no new rows, same count)
- Atomicity smoke (#9): submit two rows with duplicate `guest_id = e3be61dd-…` → expect HTTP 500 + zero new rows for household `33333333-…` (Sarah Horan's, used as the clean baseline)
- Cross-household authz smoke: submit `household_id: "11111111-…"` with `guest_id: 0f36de75-…` (Sarah Else, household `22222222…`) → expect HTTP 400

## Phase 7 cleanup obligation

Before real invitations ship, Phase 7's runbook must include:

```sql
DELETE FROM public.rsvps WHERE household_id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333'
);
DELETE FROM public.guests WHERE household_id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333'
);
```

Run BEFORE Tyler imports the real CSV — otherwise the dev households persist in the live data.
