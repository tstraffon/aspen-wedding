# RSVP Launch Readiness Audit

Adapted from the BeatCamp `bc-loop` approach: a verification contract scoped to
this site's real risk, a checker pass, a security pass, and a Full-Green stop
condition. Generated 2026-06-24.

Goal: 100% confidence the site can accept RSVPs before formal invites go out.

Status after this pass: **B1, B2 fixed in code; S1 migration written (you run it);
B3 documented; B4 + manual verification are yours to confirm.** See "Remaining"
at the bottom.

---

## The verification contract (what "Full Green" means here)

Unlike BeatCamp, this site ships once. Confidence collapses to one path: a guest
looks themselves up, submits, and the response reliably lands somewhere readable —
on a phone, without being able to corrupt another household's data. The gates:

| Gate | Tool | State |
|------|------|-------|
| `verify-typecheck` | `tsc --noEmit` | added as `npm run typecheck` |
| `verify-lint` | `eslint` | exists (`npm run lint`) |
| `verify-build` | `next build` | exists; run before deploy |
| `verify-rsvp-e2e` | manual runbook (lookup → submit → success, + double-submit, + mobile) | runbook below; automated Playwright optional |
| `verify-rsvp-db` | submit writes correct row; anon CANNOT read `rsvps`; cross-household guest_id rejected | enforced by the S1 migration |
| security checkpoint | RLS/GRANT review, SECURITY DEFINER review, access gate, abuse | done below |
| go-live checklist | menu correct, guest list loaded, responses readable | see Remaining |

---

## BLOCKERS

### B1 — The RSVP form could not be submitted (FIXED in code)

`app/(main)/rsvp/page.tsx` rendered the form but never wired it: the submit button
was `disabled` with no handler, the radios/meal/dietary inputs weren't bound to
state, and the success stage was `return null`. The server endpoint
`/api/rsvp/submit` was fully built but nothing ever called it.

Fixed: controlled inputs bound via `updateSubmission`, `handleSubmit` maps
`"yes"|"no" → boolean` and POSTs to `/api/rsvp/submit`, a success view, a
double-submit guard (`isSubmitting` disables the button while in-flight), and a
form-stage error banner (network / server / validation). Meal + dietary fields
show only for attendees.

### B2 — Meal options were placeholders and the two layers disagreed (FIXED)

Frontend offered `Option A/B/C`; the server only accepted `chicken/fish/vegetarian`.
Fixed: both now import a single `MEAL_OPTIONS` constant from
`lib/rsvp/meal-options.ts`. **Still placeholders** — swap the three strings there
for the real menu (one edit, both layers update). See B-menu in Remaining.

### B3 — No in-app way to read responses (DOCUMENTED)

`rsvps` correctly revokes SELECT from anon, so responses are visible only to an
authenticated reader, and rows store `guest_id` (a UUID), not names. Read them in
Supabase Studio → SQL Editor with this join (also exports to CSV from the result
grid):

```sql
select g.full_name, r.attending, r.meal_choice, r.dietary_restrictions, r.created_at
from public.rsvps r
join public.guests g on g.id = r.guest_id
order by r.created_at desc;
```

### B4 — Real guest list must be loaded (YOURS — data task)

The DEV SEED in `SCHEMA.sql` is commented out; production path is a CSV import
(D-17). Confirm every invited person is in `public.guests`, grouped by
`household_id`, or lookup returns "not found" for real guests. See the UX note.

---

## SECURITY

### S1 — Route authz was bypassable; anon could write rsvps directly (FIX WRITTEN — you run it)

The route's cross-household authz, meal validation, and atomicity were not
enforced at the DB. anon held INSERT/UPDATE on `rsvps` + EXECUTE on `submit_rsvps`
(which did no authz), and the anon key is public — so anyone could overwrite or
pollute RSVPs via the RPC or PostgREST, bypassing the route. `guest_id`s are
handed out by the lookup endpoint. Exfiltration not possible (anon can't read
`rsvps`).

Fix: `.planning/RSVP-S1-SECURITY-FIX.sql` — adds guest↔household authz inside
`submit_rsvps` and revokes anon's direct table writes. **Run it in Supabase
Studio** (steps + verification queries are in the file). Until it runs, the hole
is open.

### S2 — Access gate is presence-only (LOW, accepted)

`proxy.ts` accepts any non-empty `session` cookie; login sets a static
`session=authenticated`. Keeps the URL semi-private; not real security. The real
boundary is the Postgres GRANT layer. Acceptable for a wedding — know it's soft.

### S3 — No rate limiting / guest enumeration (LOW, accepted)

`/api/rsvp/lookup` returns a household's names on a match, no rate limit — the
guest list is enumerable by name-guessing. `/api/rsvp/submit` has no rate limit
(abuse bounded by the S1 fix). Low stakes for a wedding; logged as accepted.

### Reviewed and OK

- `lookup_guest_by_name`: parameterized, STABLE, runs as anon with existing SELECT
  grant — no injection, no escalation.
- `submit_rsvps` has `SET search_path = public` (prevents search_path hijack).
- Atomicity (single ON CONFLICT statement) is genuinely statement-atomic.
- anon cannot read `rsvps` (SELECT revoked).

### Cleanup recommended

- `app/(main)/api/rsvp/route.ts` (v0.1) is dead and already broken — it inserts
  the dropped `guest_count` column. The S1 REVOKE disables it entirely. Delete it.

---

## UX risk worth a look

- **Exact-match lookup only** (D-10, no fuzzy). "Mike" vs "Michael", maiden vs.
  married names, and typos all return "not found." Guests will hit this. Mitigate
  by loading common name variants as extra `guests` rows in the same household.

---

## End-to-end verification runbook (the "prove it" pass)

Do this once against a TEST household before trusting it, then clear the test rows.

1. Apply `.planning/RSVP-S1-SECURITY-FIX.sql` in Studio.
2. Seed a test household in Studio SQL Editor:
   `insert into public.guests (household_id, full_name) values
    ('99999999-9999-9999-9999-999999999999','Test Guestone'),
    ('99999999-9999-9999-9999-999999999999','Test Guesttwo');`
3. `npm run dev`, open `http://localhost:3000/rsvp` (log in with SITE_ACCESS_CODE first).
4. Look up "Test Guestone" → both members render. Mark one Yes (+ meal), one No.
5. Submit → success view appears. Click rapidly to confirm the double-submit guard.
6. Run the B3 join query → confirm one row per guest with the right values.
7. Resubmit (look up again, change a choice) → confirm the row UPDATES, not duplicates.
8. Repeat step 3–5 in a mobile viewport (DevTools device toolbar or a real phone).
9. Clear test data:
   `delete from public.rsvps where household_id = '99999999-9999-9999-9999-999999999999';
    delete from public.guests where household_id = '99999999-9999-9999-9999-999999999999';`

---

## Remaining before invites go out

- [ ] **B-menu** — replace placeholders in `lib/rsvp/meal-options.ts` with the real menu.
- [ ] **S1** — run `.planning/RSVP-S1-SECURITY-FIX.sql` in Supabase Studio.
- [ ] **B4** — import the real guest list (CSV) into `public.guests`; add name variants.
- [ ] **Runbook** — complete the end-to-end pass above (incl. mobile).
- [ ] **Cleanup** — delete the dead v0.1 route `app/(main)/api/rsvp/route.ts`.
- [ ] **Deploy** — `npm run typecheck && npm run lint && npm run build` green, then ship.
- [ ] Optional: automated Playwright e2e; a small admin page for responses; rate limiting.

Full Green = every box above checked.
