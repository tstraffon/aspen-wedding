# Phase 1 — RSVP Smoke Checklist

**Executed:** pending
**Environment:** local
**Tester:** Tyler
**Result:** pending

---

## 1. Happy-path accept

- [x] Run `npm run dev`. Visit http://localhost:3000/rsvp (sign in with the access code at /login first if the proxy redirects you).
- [x] Fill: Full Name = "Smoke Accept", Email = "smoke-accept@example.com".
- [x] Pick "Delightfully Accept".
- [x] Select "2 Guests".
- [x] Dietary = "Gluten-free".
- [x] Note = "Excited to celebrate!"
- [x] Click Submit Response.
- [x] **Expect:** "Thank You" view with body copy "We can't wait to celebrate with you in Aspen. We'll send venue and timing details closer to the wedding."
- [x] **Verify in Supabase Studio:** open Table Editor → rsvps. New row exists with `full_name = "Smoke Accept"`, `attending = true`, `guest_count = 2`, `dietary_restrictions = "Gluten-free"`, `note = "Excited to celebrate!"`, `created_at` within the last minute.
- [x] **Cleanup:** delete the row in Studio.

**Result:** pending

---

## 2. Happy-path decline

- [x] Visit http://localhost:3000/rsvp.
- [x] Fill: Full Name = "Smoke Decline", Email = "smoke-decline@example.com".
- [x] Pick "Regretfully Decline".
- [x] Confirm Guest Details (number + dietary) is hidden — the conditional reveal collapses.
- [x] Note placeholder changes to "We'll miss you! Leave a note if you'd like..."
- [x] Add note = "Wishing you both the best."
- [x] Click Submit Response.
- [x] **Expect:** "Thank You" view with body copy "We'll miss you in Aspen, but thank you for letting us know. We're holding good thoughts for you."
- [x] **Verify in Studio:** row with `attending = false`, `guest_count = 1` (form default — not reset when hidden), `dietary_restrictions = null`, `note = "Wishing you both the best."`
- [x] **Cleanup:** delete the row.

**Result:** pending

---

## 3. Validation error path

- [x] Visit http://localhost:3000/rsvp.
- [x] Click Submit Response with empty form.
- [x] **Expect:** NO native browser popup (proves `noValidate` is on the form).
- [x] Inline error under Full Name: "We need your name to find your invitation."
- [x] Inline error under Email: "Where should we reach you with details?"
- [x] Inline error under the radio group: "Let us know if you can make it."
- [x] Focus is on the Full Name input.
- [x] Type "notanemail" into Email, fill Name = "x", pick Accept, click Submit.
- [x] Inline error under Email changes to: "That email doesn't look right — double-check the spelling."

**Result:** pending

---

## 4. Network failure path

- [x] Open devtools → Network → set throttling to "Offline".
- [x] Fill a valid form (Name + Email + Accept).
- [x] Click Submit Response.
- [x] **Expect:** Error banner appears above the submit button. Heading reads "We couldn't send your RSVP". Body references `hello@emilyandtyler.com` as a mailto link.
- [x] **Expect:** Focus lands on the error banner heading (verify by tabbing — next tab moves to the submit button).
- [x] Re-enable network (set throttling to "No throttling"). Click Submit Response again.
- [x] **Expect:** Form transitions to success view (already validated in Step 1, no need to re-check the copy).
- [x] **Cleanup:** delete the row in Studio.

**Result:** pending

---

## 5. Mobile viewport (375px)

- [x] Open devtools → Device toolbar (Cmd+Shift+M in Chrome).
- [x] Set viewport to 375 × 812 (iPhone 13 mini).
- [x] Visit http://localhost:3000/rsvp.
- [x] **Expect:** No horizontal scroll. Form fields are full-width. Section gaps preserved (~48px between sections).
- [x] **Expect:** Accept/Decline radios stack vertically (one above the other).
- [x] Tap into the Full Name input.
- [x] **Expect:** No iOS-style zoom on focus (font-size is 16px — proves the `text-base` rule was preserved).
- [x] Click the hamburger menu icon top-right.
- [x] **Expect:** RSVP appears as the last item in the dropdown.
- [x] Fill the form, submit.
- [x] **Expect:** Success view fits the viewport with no horizontal scroll.
- [x] **Cleanup:** delete the row in Studio.

**Result:** pending

---

## 6. Production env var check

- [x] Confirm the production deploy target: **Vercel** (per Plan 01-01 Task 1).
- [x] Open Vercel dashboard → aspen-wedding project → Settings → Environment Variables.
- [x] Confirm `NEXT_PUBLIC_SUPABASE_URL` is set to `https://buemmczwbuvzzjqnulsk.supabase.co` for Production AND Preview.
- [x] Confirm `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set to the same legacy anon JWT used in `.env.local` for Production AND Preview.
- [x] Confirm `SITE_ACCESS_CODE` is set to a production value (NOT `aspen2026` — pick something stronger).
- [x] **Expect:** `SUPABASE_SERVICE_ROLE_KEY` is NOT set anywhere on Vercel — the route no longer reads it, and listing it invites accidental privilege.
- [x] If NOT deployed yet: mark this section as `skipped` and add a note: "not deployed yet — re-run before production launch."

**Result:** pending

---

## Cleanup — leftover diagnostic rows

Run once in Supabase Studio SQL Editor to clear any diagnostic test rows that accumulated during Plan 01-01 RLS troubleshooting (safe to re-run, deletes only the known test emails):

```sql
DELETE FROM public.rsvps WHERE email IN (
  'smoke@example.com', 'sqldirect@test.com', 'test@example.com',
  'rebuild@test.com', 'pubpolicy@test.com', 'session@test.com',
  'final-legacy_anon@example.com', 'final-publishable@example.com',
  'pg@test.com', 'local-smoke@example.com', 'role@test.com',
  'smoke-accept@example.com', 'smoke-decline@example.com'
);
```

---

## Final Verdict

- [x] All 6 sections pass.
- [x] Final Result: partial. Everything passed except the mobile view of the rsvp page isn't quite right. As you scroll the Kindly Respond section stays in the background as the form comes on the screen, making the form difficult to read. Needs to be fixed.

Confirm Plan 01-04 is complete and `01-rsvp-enablement` phase can close.
