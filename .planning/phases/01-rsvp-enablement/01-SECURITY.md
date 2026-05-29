---
phase: 01
slug: rsvp-enablement
status: verified
threats_total: 6
threats_closed: 6
threats_open: 0
asvs_level: 1
audited: 2026-05-29
created: 2026-05-29
---

# Phase 01 — Security

> Per-phase security contract for RSVP enablement: anon-key writes to Supabase, sanitized error responses, env contract, and write-only public access boundary.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Browser -> `/api/rsvp` | Untrusted form payload crosses here; client validation can be bypassed | RSVP fields: full_name, email, attending, guest_count, dietary_restrictions, note (PII: name + email) |
| `/api/rsvp` -> Supabase PostgREST | Anon-key authenticated insert; GRANT layer is the authorization gate | INSERT row payload over HTTPS |
| Public web -> Supabase `rsvps` table | GRANT write-only (anon: INSERT only) | New row only; no read path for anon |
| Repo contributors -> env files | `.env.local` never committed; `.env.local.example` documents contract | Supabase URL + anon JWT (public) locally; never service-role |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status | Evidence |
|-----------|----------|-----------|-------------|------------|--------|----------|
| T-01-SR | Spoofing | `app/(main)/api/rsvp/route.ts` service-role fallback | mitigate | Anon-only env read; no `SUPABASE_SERVICE_ROLE_KEY ??` fallback | closed | `route.ts:17` reads only `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`; `grep -c SUPABASE_SERVICE_ROLE_KEY app/(main)/api/rsvp/route.ts` returns 0 |
| T-01-IL | Information leakage | `app/(main)/api/rsvp/route.ts` 500 response body | mitigate | Generic "Could not save RSVP" returned to client; raw error logged server-side via `console.error` | closed | `route.ts:39` `console.error("Supabase insert error:", error);` (server-side); `route.ts:41` returns `{ error: "Could not save RSVP" }` (generic); no `error.message` echo |
| T-01-TI | Tampering | Anon role inserts arbitrary rows into `public.rsvps` | accept | Wedding context; <200 expected guests; manual cleanup acceptable via Supabase Studio; spam mitigation deferred (hCaptcha/Turnstile as a future phase if needed) | closed | Logged in Accepted Risks below |
| T-01-EP | Elevation of Privilege | Anon role reading existing RSVPs | mitigate | Write-only access enforced via Postgres GRANT layer (RLS unworkable due to Supabase platform quirk on new projects — implementation swap preserves security intent) | closed | Plan 01-01 SUMMARY records end-to-end verification: anon INSERT returns 201, anon SELECT returns 401 "permission denied for table"; `.planning/phases/01-rsvp-enablement/01-01-SUMMARY.md` §Plan Deviations §1 |
| T-01-EX | Information disclosure | `.env.local` committed to git | mitigate | `.gitignore` excludes `.env*` with `!.env.local.example` negation; example file contains no secrets | closed | `.gitignore` lines 33-35; `git check-ignore .env.local` exits 0; `git check-ignore .env.local.example` exits non-zero; `.env.local.example` contains only `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (no service-role) |
| T-01-SC | Tampering | npm supply chain (new packages) | N/A | No new packages installed in this phase | closed | All four plan summaries declare `tech-stack.added: []`; existing `@supabase/supabase-js` vetted at project setup |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party) · N/A (not applicable)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-01 | T-01-TI | Wedding RSVP is a low-value spam target with a bounded guest list (<200). Anon writes are necessary for the public submission path. Garbage rows can be removed manually from Supabase Studio. If spam materializes post-launch, add hCaptcha/Turnstile in a follow-on phase. | Tyler Straffon (planner) | 2026-05-29 |

---

## Unregistered Flags

None. No `## Threat Flags` section appears in any of `01-01-SUMMARY.md`, `01-02-SUMMARY.md`, `01-03-SUMMARY.md`, or `01-04-SUMMARY.md`. No new attack surface was logged during implementation.

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-05-29 | 6 | 6 | 0 | gsd-security-auditor (Claude) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer / N/A)
- [x] Accepted risks documented in Accepted Risks Log (AR-01 covers T-01-TI)
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-05-29
