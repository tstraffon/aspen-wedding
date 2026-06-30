---
phase: 6
slug: admin-console
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-30
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — no test framework is installed (package.json has no testing deps; consistent with v0.1/v0.2 manual-smoke pattern) |
| **Config file** | none |
| **Quick run command** | `npm run build` (compile + type check is the fastest automated signal) |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~30–60 seconds |

This is an internal, two-person back-office tool behind an admin gate. Per the research
Validation Architecture section, validation is **manual smoke testing** plus build/lint —
Wave 0 does NOT install a test framework for this phase. Automated coverage = the build
and lint gates; behavioral correctness = the manual smoke checklist below (D-06..D-13).

---

## Sampling Rate

- **After every task commit:** `npm run build` (must compile + type-check clean)
- **After every plan wave:** `npm run build && npm run lint`
- **Before `/gsd:verify-work`:** build + lint green AND the manual smoke checklist passes
- **Max feedback latency:** ~60 seconds

---

## Per-Task Verification Map

Automated proof for this phase is compile/type/lint plus source assertions; behavioral
proof is manual smoke (no unit framework). Each plan's tasks carry their own
`<acceptance_criteria>`; this maps requirements to how they are proven.

| Requirement | Plan area | Test Type | Automated signal | Manual smoke |
|-------------|-----------|-----------|------------------|--------------|
| ADMIN-01 | admin gate (proxy + /admin/login + per-route authz) | build + source assertion | `proxy.ts` admin branch present; each `/api/admin/*` handler checks `admin_session` | Hitting `/admin` without admin cookie redirects to `/admin/login`; guest `session` cookie does NOT grant admin |
| ADMIN-02 | households view | build | households list page reads via service-role client | All 75 households + members render |
| ADMIN-03 | guest CRUD + regroup | build + source assertion | add/rename/remove/move handlers exist; delete cascades rsvps row | Add/rename/remove + move person persists; reflected in name lookup |
| ADMIN-04 | rsvp view + meal-count | build | rsvp view groups by household; summary groups by meal_choice | Renders clean with 0 submissions; counts correct with seeded rows |
| ADMIN-05 | CSV export | build + source assertion | two export routes return `text/csv` + `Content-Disposition` | Guest-list CSV matches import format; rsvp CSV correct; formula-injection guard applied |

---

## Wave 0 Requirements

- [ ] `ADMIN_ACCESS_CODE` and `SUPABASE_SERVICE_ROLE_KEY` present in `.env.local` (both block the phase; no fallback) — manual env setup, not a code task.

*No test framework install. Existing build/lint infrastructure covers automated checks.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Admin gate blocks non-admins; guest cookie ≠ admin | ADMIN-01 | Auth/redirect behavior, no test framework | In a fresh browser: visit `/admin` → redirected to `/admin/login`. Log in with guest code only → still blocked. Log in with `ADMIN_ACCESS_CODE` → reaches `/admin`. |
| Households render and regroup persists | ADMIN-02/03 | DB-backed UI, manual | Load `/admin`; confirm 75 households; rename/move a test person; reload and confirm; run a name lookup to confirm reflection. |
| RSVP view + meal-count empty + populated | ADMIN-04 | Depends on live data | View with zero rsvps (clean empty state); seed 1–2 rsvps via the form; confirm grouped view + summary counts. |
| CSV exports correct + safe | ADMIN-05 | File download, manual | Download both CSVs; confirm guest-list matches `household_id,full_name`; confirm a field starting with `=`/`+`/`-`/`@` is neutralized. |

---

## Validation Sign-Off

- [ ] Every task has `<acceptance_criteria>` with a build, source-assertion, or behavior proof
- [ ] No automated test framework introduced (intentional for this internal tool)
- [ ] Manual smoke checklist (above) covers ADMIN-01..05
- [ ] Build + lint green before verify-work
- [ ] `nyquist_compliant: true` set once the plan tasks satisfy the map above

**Approval:** pending
