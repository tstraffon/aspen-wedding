---
status: complete
phase: 01-rsvp-enablement
source: [01-VERIFICATION.md]
started: 2026-05-29
updated: 2026-05-29
---

## Current Test

[testing complete]

## Tests

### 1. Re-verify mobile sticky fix at 375px viewport
expected: After commit 349b6fd (`sticky top-40` → `lg:sticky lg:top-40`), the "Kindly Respond" editorial column no longer pins behind the form on mobile. Open `/rsvp` at 375 × 812 in Chrome devtools device mode — the hero scrolls naturally above the form instead of staying fixed.
result: pass

### 2. Run the cleanup SQL block in Supabase Studio
expected: Open Studio SQL Editor → new query → paste the SQL block from the bottom of `01-SMOKE.md` (or copy below) → Run. After running, `SELECT count(*) FROM public.rsvps` should return 0 (or only intentional rows).

```sql
DELETE FROM public.rsvps WHERE email IN (
  'smoke@example.com', 'sqldirect@test.com', 'test@example.com',
  'rebuild@test.com', 'pubpolicy@test.com', 'session@test.com',
  'final-legacy_anon@example.com', 'final-publishable@example.com',
  'pg@test.com', 'local-smoke@example.com', 'role@test.com',
  'smoke-accept@example.com', 'smoke-decline@example.com'
);
```

result: pass

## Summary

total: 2
passed: 2
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps
