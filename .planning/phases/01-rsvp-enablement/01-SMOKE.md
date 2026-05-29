# Phase 1 — RSVP Smoke Checklist

**Executed:** pending
**Environment:** local
**Tester:** Tyler
**Result:** pending

---

## 1. Happy-path accept

- [ ] Run `npm run dev`. Visit http://localhost:3000/rsvp (sign in with the access code at /login first if the proxy redirects you).
- [ ] Fill: Full Name = "Smoke Accept", Email = "smoke-accept@example.com".
- [ ] Pick "Delightfully Accept".
- [ ] Select "2 Guests".
- [ ] Dietary = "Gluten-free".
- [ ] Note = "Excited to celebrate!"
- [ ] Click Submit Response.
- [ ] **Expect:** "Thank You" view with body copy "We can't wait to celebrate with you in Aspen. We'll send venue and timing details closer to the wedding."
- [ ] **Verify in Supabase Studio:** open Table Editor → rsvps. New row exists with `full_name = "Smoke Accept"`, `attending = true`, `guest_count = 2`, `dietary_restrictions = "Gluten-free"`, `note = "Excited to celebrate!"`, `created_at` within the last minute.
- [ ] **Cleanup:** delete the row in Studio.

**Result:** pending

---

## 2. Happy-path decline

- [ ] Visit http://localhost:3000/rsvp.
- [ ] Fill: Full Name = "Smoke Decline", Email = "smoke-decline@example.com".
- [ ] Pick "Regretfully Decline".
- [ ] Confirm Guest Details (number + dietary) is hidden — the conditional reveal collapses.
- [ ] Note placeholder changes to "We'll miss you! Leave a note if you'd like..."
- [ ] Add note = "Wishing you both the best."
- [ ] Click Submit Response.
- [ ] **Expect:** "Thank You" view with body copy "We'll miss you in Aspen, but thank you for letting us know. We're holding good thoughts for you."
- [ ] **Verify in Studio:** row with `attending = false`, `guest_count = 1` (form default — not reset when hidden), `dietary_restrictions = null`, `note = "Wishing you both the best."`
- [ ] **Cleanup:** delete the row.

**Result:** pending

---

## 3. Validation error path

- [ ] Visit http://localhost:3000/rsvp.
- [ ] Click Submit Response with empty form.
- [ ] **Expect:** NO native browser popup (proves `noValidate` is on the form).
- [ ] Inline error under Full Name: "We need your name to find your invitation."
- [ ] Inline error under Email: "Where should we reach you with details?"
- [ ] Inline error under the radio group: "Let us know if you can make it."
- [ ] Focus is on the Full Name input.
- [ ] Type "notanemail" into Email, fill Name = "x", pick Accept, click Submit.
- [ ] Inline error under Email changes to: "That email doesn't look right — double-check the spelling."

**Result:** pending

---

## 4. Network failure path

- [ ] Open devtools → Network → set throttling to "Offline".
- [ ] Fill a valid form (Name + Email + Accept).
- [ ] Click Submit Response.
- [ ] **Expect:** Error banner appears above the submit button. Heading reads "We couldn't send your RSVP". Body references `hello@emilyandtyler.com` as a mailto link.
- [ ] **Expect:** Focus lands on the error banner heading (verify by tabbing — next tab moves to the submit button).
- [ ] Re-enable network (set throttling to "No throttling"). Click Submit Response again.
- [ ] **Expect:** Form transitions to success view (already validated in Step 1, no need to re-check the copy).
- [ ] **Cleanup:** delete the row in Studio.

**Result:** pending

---

## 5. Mobile viewport (375px)

- [ ] Open devtools → Device toolbar (Cmd+Shift+M in Chrome).
- [ ] Set viewport to 375 × 812 (iPhone 13 mini).
- [ ] Visit http://localhost:3000/rsvp.
- [ ] **Expect:** No horizontal scroll. Form fields are full-width. Section gaps preserved (~48px between sections).
- [ ] **Expect:** Accept/Decline radios stack vertically (one above the other).
- [ ] Tap into the Full Name input.
- [ ] **Expect:** No iOS-style zoom on focus (font-size is 16px — proves the `text-base` rule was preserved).
- [ ] Click the hamburger menu icon top-right.
- [ ] **Expect:** RSVP appears as the last item in the dropdown.
- [ ] Fill the form, submit.
- [ ] **Expect:** Success view fits the viewport with no horizontal scroll.
- [ ] **Cleanup:** delete the row in Studio.

**Result:** pending

---

## 6. Production env var check

- [ ] Confirm the production deploy target: **Vercel** (per Plan 01-01 Task 1).
- [ ] Open Vercel dashboard → aspen-wedding project → Settings → Environment Variables.
- [ ] Confirm `NEXT_PUBLIC_SUPABASE_URL` is set to `https://buemmczwbuvzzjqnulsk.supabase.co` for Production AND Preview.
- [ ] Confirm `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set to the same legacy anon JWT used in `.env.local` for Production AND Preview.
- [ ] Confirm `SITE_ACCESS_CODE` is set to a production value (NOT `aspen2026` — pick something stronger).
- [ ] **Expect:** `SUPABASE_SERVICE_ROLE_KEY` is NOT set anywhere on Vercel — the route no longer reads it, and listing it invites accidental privilege.
- [ ] If NOT deployed yet: mark this section as `skipped` and add a note: "not deployed yet — re-run before production launch."

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

- [ ] All 6 sections pass.
- [ ] Final Result: ___ (pass / fail / partial — explain if not pass)

Confirm Plan 01-04 is complete and `01-rsvp-enablement` phase can close.
