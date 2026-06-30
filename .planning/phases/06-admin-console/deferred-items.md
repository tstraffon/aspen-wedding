# Deferred Items — Phase 06 Admin Console

Items discovered during execution that are out of scope for Phase 6 tasks.

## Logout Route Missing

**Discovered during:** 06-05 Task 1 (runbook writing)
**File:** `app/(admin)/admin/layout.tsx`
**Issue:** The Logout nav link points to `/api/admin/auth/logout` but no `route.ts` handler exists at that path. Clicking the link produces a 404.
**Impact:** Low — the `admin_session` cookie expires after 90 days. Workaround: clear the cookie manually via browser DevTools (Application -> Cookies -> delete `admin_session`).
**Workaround documented in:** RUNBOOK.md Section 7
**Candidate for:** Phase 7 or a standalone fix before launch. Implementation would be a simple GET handler that calls `response.cookies.delete("admin_session")` and redirects to `/admin/login`.
