# Admin Console Operator Runbook

**Aspen Wedding — Phase 6 Operator Reference**
Last updated: 2026-06-30

This runbook covers every recurring admin task: initial env setup, importing the real guest list, validating household groupings, fixing mistakes on request, reading the meal-count report, exporting CSVs, and the end-to-end smoke checklist.

---

## Table of Contents

1. [Env Setup](#1-env-setup)
2. [CSV Import — Load the Guest List](#2-csv-import--load-the-guest-list)
3. [Validate Groupings in the Households View](#3-validate-groupings-in-the-households-view)
4. [Fix a Wrong Household on Request](#4-fix-a-wrong-household-on-request)
5. [Read the Meal-Count Report at the Catering Deadline](#5-read-the-meal-count-report-at-the-catering-deadline)
6. [Export CSVs](#6-export-csvs)
7. [Admin Login Flow](#7-admin-login-flow)
8. [Update the Meal Menu Labels](#8-update-the-meal-menu-labels)
9. [Troubleshooting](#9-troubleshooting)
10. [End-to-End Smoke Checklist](#10-end-to-end-smoke-checklist)

---

## 1. Env Setup

Two environment variables are required for the admin console. Both are **server-only** and must never appear in any `NEXT_PUBLIC_*` variable.

| Variable | Purpose | Where to get it |
|---|---|---|
| `ADMIN_ACCESS_CODE` | Passphrase for the admin login page (`/admin/login`) | You choose it — any strong passphrase |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged Supabase key for server-side reads/writes on `guests` and `rsvps` | Supabase dashboard -> Project Settings -> API -> service_role key |

### Local development

Add both to `.env.local` in the project root:

```
ADMIN_ACCESS_CODE=your-chosen-passphrase
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key...
```

Restart the dev server after editing `.env.local`.

### Vercel (production)

1. Go to your Vercel project dashboard.
2. Settings -> Environment Variables.
3. Add `ADMIN_ACCESS_CODE` and `SUPABASE_SERVICE_ROLE_KEY` — set both for Production, Preview, and Development environments.
4. Redeploy (Vercel applies env changes only on the next deployment).

### RLS prerequisite

The `guests` table must have Row Level Security **disabled** (the admin routes use the service-role key which bypasses RLS, but RLS being enabled can block the anon key's SELECT grants). This was applied during Phase 4. Verify in Supabase Studio: Table Editor -> `guests` -> RLS should show "Disabled."

---

## 2. CSV Import — Load the Guest List

The guest list lives at `.planning/guests-import.csv` in this repo. It contains 138 guests across 75 households in this exact format:

```
household_id,full_name
6a255210-f25e-488b-8e61-812e867d69c8,Aaron Sorge
6a255210-f25e-488b-8e61-812e867d69c8,Andi Stuk
...
```

### First-time import

1. Open Supabase Studio -> Table Editor -> select the `guests` table.
2. Click **Import Data** (or the CSV icon in the toolbar).
3. Choose `.planning/guests-import.csv`.
4. Confirm the column mapping: `household_id` -> `household_id`, `full_name` -> `full_name`. The `id` column auto-generates a UUID for each row — do not map a column to `id`.
5. Click **Import**. Wait for the confirmation toast.
6. Verify: run `SELECT COUNT(*) FROM guests;` in the SQL editor — expect **138 rows**.

### Swapping the test list for the real list

If you imported a test/sample list first and need to replace it with the real one:

1. In Supabase Studio SQL editor, run:
   ```sql
   DELETE FROM rsvps;
   DELETE FROM guests;
   ```
   Order matters — rsvps references guests; delete rsvps first.
2. Re-import `.planning/guests-import.csv` using the steps above.
3. Reload `/admin` — should show 75 households / 138 guests.

### Known edge rows

These rows were resolved by hand during the Phase 6 preparation:

- **Alan Veeck Sr. / Nancy Veeck** — share household `8faa13bf-831f-4268-8ef1-5d69117fe3d1`; Alan Veeck Jr. (if invited) would need a separate household.
- **Two "And Guest" plus-ones** — each is in its own single-member household paired with the named invitee. Spot-check them in the households view after import.
- **Two "Family" households** — different `household_id` UUIDs; the display name disambiguates them by the primary family member's name showing in the household group.

---

## 3. Validate Groupings in the Households View

1. Log in at `/admin` (see [Section 7](#7-admin-login-flow)).
2. The header row shows `{N} households · {M} guests`. After a clean import, this reads **75 households · 138 guests**.
3. Scroll through the list. Each household card shows all members. Confirm:
   - Multi-person households have the right names grouped together.
   - Singles (plus-ones, solo guests) appear as one-member households.
4. If the count is wrong, re-check the import (duplicate rows? partial import?). The SQL editor query `SELECT household_id, COUNT(*) FROM guests GROUP BY household_id ORDER BY COUNT(*) DESC;` shows the distribution.

---

## 4. Fix a Wrong Household on Request

All edits happen in the Households view at `/admin`. Changes take effect immediately in the database and are reflected the next time a guest does a name lookup at `/rsvp`.

### Rename a person

A typo in a guest's name or a legal name correction:

1. Find the person's household card.
2. Click the **Rename** button next to the person's name.
3. Edit the name in the inline input field that appears.
4. Click **Save**. The row updates in place.
5. Confirm at `/rsvp`: type the new name in the lookup — the household should be found.

### Move a person to a different household

Two guests are grouped wrong (e.g., they live at different addresses):

1. Find the person you want to move.
2. Click **Move** next to their name.
3. A text input appears — enter the `household_id` UUID of the target household. (Find it in Supabase Studio: `SELECT household_id FROM guests WHERE full_name = 'Target Person';`)
4. Click **Save**. The person's `household_id` is updated to the target.
5. Reload `/admin` to confirm the person appears in the correct household.

### Split a household into two

Two people are grouped together but should be separate (e.g., a couple broke up):

1. One person stays in the original household — no action needed.
2. For the person who should move out, click **Move** and enter a **new UUID** as their `household_id`.

   Generate a new UUID in the SQL editor:
   ```sql
   SELECT gen_random_uuid();
   ```
   Copy the result and paste it into the Move input.
3. The second person is now in a new single-member household.

### Merge two households into one

Two entries represent the same household (e.g., a couple's address was entered twice):

1. Decide which `household_id` to keep.
2. For every person in the household being dissolved, click **Move** and enter the keeper's `household_id`.
3. After all members are moved, the old household disappears from the list automatically (it has no members).

### Add a person (late add)

A guest was missed or a plus-one was approved after the initial import:

1. Find the target household in `/admin`.
2. Click **Add Person** at the bottom of that household's card.
3. Type the full name and click **Add**. A new `guests` row is created under the same `household_id`.

### Delete a person

1. Find the person and click **Remove**.
2. A confirmation prompt fires (browser `confirm()`) — this is intentional because deletion cascades to that person's RSVP row if one exists.
3. Confirm. Both the `guests` row and the corresponding `rsvps` row (if any) are deleted.

---

## 5. Read the Meal-Count Report at the Catering Deadline

1. Log in and navigate to `/admin/rsvps` (the "RSVPs" nav link at the top right).
2. The **Meal Count Summary** card at the top lists each meal option with its count — attending guests only (non-attending guests are excluded from counts).
3. The **Total Attending** line is the headline number to give the caterer.
4. The **Dietary Notes** card (below the summary) lists every attending guest who entered a dietary restriction, with their name and the note text. Give this to the caterer verbatim.
5. If the meal labels are wrong (placeholder text from development), see [Section 8](#8-update-the-meal-menu-labels).

The current menu labels are defined in `lib/rsvp/meal-options.ts`:
- Grilled Filet of Angus Beef with Green Peppercorn Sauce
- Pan-Roasted Sea Bass with Ginger-Miso Glaze
- Vegetarian

---

## 6. Export CSVs

Both export links are in the toolbar at the top right of `/admin/rsvps`.

### Guest list CSV

Click **Export Guest List**. The browser downloads `guests.csv`.

Format: `household_id,full_name` — identical to the import format. This file is re-importable via Supabase Studio for a clean round-trip. All fields are RFC 4180-quoted to neutralize any formula injection if opened in Excel.

### RSVP CSV

Click **Export RSVPs**. The browser downloads `rsvps.csv`.

Format: `name,household_id,attending,meal_choice,dietary_restrictions`. Only guests who have submitted an RSVP appear. Non-respondents are not included. All fields are RFC 4180-quoted.

---

## 7. Admin Login Flow

1. Navigate to `/admin` in a browser.
2. The proxy redirects to `/admin/login` if no `admin_session` cookie is present.
3. Enter `ADMIN_ACCESS_CODE` in the **Access Code** field and click **Enter**.
4. On success, you are redirected to `/admin` (households view).
5. The session cookie (`admin_session`) lasts 90 days and is `httpOnly` — it is not accessible to JavaScript.

**Guest codes do not grant admin access.** The guest `SITE_ACCESS_CODE` creates a `session` cookie. Admin pages check only for `admin_session`. Entering the guest code on the admin login page returns "Incorrect access code."

**Logout:** The Logout nav link currently has no backend route handler (a known gap — not implemented in Phase 6). To sign out, clear browser cookies: browser DevTools -> Application -> Cookies -> delete `admin_session`. The cookie expires automatically after 90 days.

---

## 8. Update the Meal Menu Labels

The meal options shown in the RSVP form, validated by the submit endpoint, and displayed in the admin meal-count report all come from a **single file**:

```
lib/rsvp/meal-options.ts
```

Edit the strings in the `MEAL_OPTIONS` array there. Whatever strings are in that array are the exact values that land in `rsvps.meal_choice` and appear in the reports and exports. Change them once in this file and both the guest-facing form and the admin view update automatically.

After editing: redeploy the site. RSVPs submitted before the label change will retain their original string value in the database — the count keying still works as long as the old and new values match exactly.

---

## 9. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `/admin` keeps redirecting to `/admin/login` even after entering the correct code | `ADMIN_ACCESS_CODE` env var not set, or set incorrectly (extra whitespace, wrong environment) | Check `.env.local` or Vercel env var; restart dev server |
| Households view shows "No guests found" | `guests` table is empty — CSV not imported yet, or import targeted the wrong table | Re-run import into `public.guests` |
| Households view shows a database error with a note about `SUPABASE_SERVICE_ROLE_KEY` | `SUPABASE_SERVICE_ROLE_KEY` not set or expired | Set in `.env.local` and Vercel; restart; redeploy |
| Guest name lookup at `/rsvp` doesn't find a name you just added/renamed | Page cached — try a hard reload or wait for Next.js cache to revalidate | Reload `/rsvp`; check the name is saved in Supabase Studio |
| Guest `session` cookie doesn't grant access to `/admin` | Expected — separate cookie required | Log in at `/admin/login` with `ADMIN_ACCESS_CODE` |
| Export downloads an empty CSV (header only) | No guests / no RSVPs in the database | Import the guest list first; RSVPs are empty until guests submit via the form |
| Generic "Something went wrong" on an admin page | Sanitized 5xx — check server logs (`npm run dev` output or Vercel function logs) | Identify the underlying Supabase error in the logs |

---

## 10. End-to-End Smoke Checklist

Run this checklist after importing the real guest list to verify the entire admin console works end-to-end. Each leg maps to a Phase 6 success criterion.

**Prerequisites before starting:**
- `.env.local` has `ADMIN_ACCESS_CODE` and `SUPABASE_SERVICE_ROLE_KEY` set.
- Dev server is running: `npm run dev`.
- Build is clean: `npm run build && npm run lint` (must complete with zero errors).
- `guests` table is populated (import from `.planning/guests-import.csv` per Section 2 if not already done).

---

### Leg 1 — Admin Gate (ADMIN-01)

1. Open a **fresh browser window** (or use an incognito window with no cookies).
2. Visit `http://localhost:3000/admin`.
3. **Expected:** Immediate redirect to `http://localhost:3000/admin/login`. You never see the households view.
4. On the login page, enter the guest site access code (`SITE_ACCESS_CODE`, not the admin code).
5. **Expected:** "Incorrect access code." error message. You remain on the login page. The guest code does NOT grant admin access.
6. Enter `ADMIN_ACCESS_CODE`.
7. **Expected:** Redirect to `http://localhost:3000/admin` — the Households view loads, showing the count header.

Leg 1 passes when: unauthenticated redirect fires, guest code is rejected, admin code grants access.

---

### Leg 2 — Import + Households View (GUEST-01 / ADMIN-02)

1. If you haven't imported the guest list yet, do so now: Section 2 of this runbook.
2. Reload `http://localhost:3000/admin`.
3. **Expected:** Header reads **75 households · 138 guests** (or your actual counts if you are using a subset for testing).
4. Spot-check these specific households:
   - Search the list for **Alan Veeck Sr.** and **Nancy Veeck** — they should be in the same household card.
   - Find any "And Guest" entry — it should appear as a two-member household (the named guest + the plus-one).
5. **Expected:** All households render with their correct members. No error banners.

Leg 2 passes when: 75/138 counts match, spot-check households look correct.

---

### Leg 3 — Regroup + Lookup Reflection (ADMIN-03)

1. Pick any test guest (use someone near the bottom of the list to avoid confusion).
2. Click **Rename** next to their name. Change it to `[Original Name] Test` (e.g., "Aaron Sorge Test").
3. **Expected:** Name updates inline with no page reload.
4. Open a second browser tab and go to `http://localhost:3000/rsvp`. Enter the test name you just set.
5. **Expected:** Lookup finds the household and shows all members including the renamed person — confirming admin edits reflect immediately in the guest-facing lookup.
6. Return to `/admin`. Click **Rename** again and restore the original name.
7. Pick a guest with only one household member. Click **Move** and enter a different household's UUID (get it from Supabase Studio or from the URL copy trick: the household_id shown in the admin view is the raw UUID).
8. **Expected:** After saving, the moved person appears under the target household. Both households reflect the change after reload.
9. To test cascade delete: first seed an RSVP for this person (Section 2 of the smoke, Leg 4 below), then return here and click **Remove** on that person.
10. **Expected:** Browser `confirm()` dialog fires. Confirm. The guest disappears from the households view. Verify in Supabase Studio: `SELECT * FROM guests WHERE full_name = 'Test Name';` returns 0 rows. `SELECT * FROM rsvps WHERE guest_id = '<the-id>';` returns 0 rows. Both the guest and their RSVP are gone.

Leg 3 passes when: rename reflects in lookup, move persists on reload, delete cascades to rsvps.

---

### Leg 4 — RSVP View: Empty State + Populated (ADMIN-04)

**Empty state:**

1. Before seeding any RSVPs, go to `http://localhost:3000/admin/rsvps`.
2. **Expected:** Meal Count Summary card shows all meal labels with count **0**. Total Attending = **0**. The submissions section shows "No RSVPs submitted yet." No errors or broken layout.

**Seed 1-2 RSVPs via Supabase Studio:**

The guest group form (Phase 7) is not yet built. Seed RSVPs directly in Supabase Studio.

1. In Supabase Studio, find a household in the `guests` table. Pick a `household_id` and one or two `id` values from that household.
2. Go to Table Editor -> `rsvps` -> click **Insert row**.
3. Fill in these columns for each guest you want to seed:
   - `household_id`: the UUID from step 1
   - `guest_id`: the guest's `id` UUID from step 1
   - `attending`: `true`
   - `meal_choice`: exactly one of the strings from `lib/rsvp/meal-options.ts` (e.g., `Vegetarian`)
   - `dietary_restrictions`: any text or leave empty
4. Repeat for a second guest in the same household.

**Populated state:**

5. Reload `http://localhost:3000/admin/rsvps`.
6. **Expected:**
   - Meal Count Summary shows a non-zero count for the meal(s) you chose.
   - Total Attending matches the number of attending RSVPs you seeded.
   - The household you seeded appears in "Submissions by Household" with the correct attending status and meal choice per member.
   - If you added a dietary restriction, the Dietary Notes card appears with the guest's name and note.

Leg 4 passes when: empty state renders cleanly, seeded RSVPs appear correctly with accurate meal counts.

---

### Leg 5 — Exports: Correct Content + Injection Safety (ADMIN-05)

1. From `http://localhost:3000/admin/rsvps`, click **Export Guest List**.
2. Open the downloaded `guests.csv` in a text editor (not Excel — open raw).
3. **Expected:**
   - First line (header): `household_id,full_name`
   - Each data row: `"<uuid>","<name>"` — all fields double-quoted.
   - Row count = total guests in the database.
   - File is re-importable: try importing it back into a blank `guests` table (test environment only) and confirm the same rows appear.
4. Now click **Export RSVPs**.
5. Open `rsvps.csv` in a text editor.
6. **Expected:**
   - Header: `name,household_id,attending,meal_choice,dietary_restrictions`
   - Each row covers one RSVP submission. The `name` column shows the guest's full name (resolved from `guest_id`). The `attending` column is `"true"` or `"false"` (quoted string).
   - Row count = number of RSVPs in the database (same as what `/admin/rsvps` shows).
7. **Formula injection check:** If any guest name or dietary restriction starts with `=`, `+`, `-`, or `@`, open the CSV in Excel/Sheets and confirm that cell renders as text, not as a formula. The RFC 4180 double-quoting handles this automatically; this check confirms it end-to-end.

Leg 5 passes when: both CSVs download, column headers match, data is accurate, injection-safe quoting confirmed.

---

### Smoke Summary

| Leg | Criterion | Pass / Fail |
|-----|-----------|-------------|
| 1 — Admin Gate | Unauthenticated redirect; guest code rejected; admin code grants access | |
| 2 — Import + Households | 75 households / 138 guests count; spot-check households correct | |
| 3 — Regroup + Reflection | Rename/move/delete persist; rename reflects in `/rsvp` lookup; cascade delete confirmed | |
| 4 — RSVP View | Empty state clean; seeded RSVPs appear with correct counts | |
| 5 — Exports | Both CSVs download; headers and data correct; injection-safe | |

All five legs must pass before the admin console is considered verified.
