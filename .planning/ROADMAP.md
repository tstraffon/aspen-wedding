# Roadmap — Milestone v0.1: Interactive Guest Features

**Goal:** Add the three remaining guest-facing features (RSVP enablement, Registry, Bridal Party) so the site is feature-complete for invitations.

**Success criteria:** All three pages live, linked from the navbar, styled to the Stitch system, and tested on mobile + desktop. RSVP submissions land in Supabase reliably.

---

## Phase 1 — RSVP Enablement

**Goal:** Make the existing RSVP flow production-ready and discoverable.

**UI hint:** yes

**Scope:**

- Verify the Supabase `rsvps` table schema matches the form payload (`full_name`, `email`, `attending`, `guest_count`, `dietary_restrictions`, `note`)
- Confirm `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are wired and RLS / insert policy allows anonymous inserts
- Enable the commented-out RSVP nav link in `components/Navbar.tsx`
- Polish submission UX: success/error state copy, loading state, validation messaging, mobile spacing pass
- Add a basic RSVP submission test (happy path) or a manual smoke checklist

**Dependencies:** none

**Plans:** 4/4 plans complete

Plans:

- [x] 01-01-PLAN.md — Backend infrastructure: schema + RLS verify, anon-only API route, env var docs
- [x] 01-02-PLAN.md — Form polish: validation, focus management, success/error variants, a11y attributes
- [x] 01-03-PLAN.md — Navbar enable: uncomment RSVP link, delete dead comment slot
- [x] 01-04-PLAN.md — Smoke checklist: five-step manual verification + production env check

---

## Phase 2 — Registry Page

**Goal:** A `/registry` page that guides guests to chosen registries / linked gift items, matching the site's design system.

**UI hint:** yes

**Scope:**

- New route `app/(main)/registry/page.tsx`
- Content model: a registries list (Honeyfund / Amazon / Crate & Barrel / etc.) — decide static config vs. data file
- Card or list layout with logo, short blurb, "Visit Registry" CTA per item
- Enable commented-out Registry nav link in `components/Navbar.tsx`
- Reference Stitch design tokens for color, type, spacing

**Dependencies:** none (independent of Phase 1)

**Plans:** 3/3 plans complete

Plans:

- [x] 02-01-PLAN.md — Page scaffold: hero section + framing block (Server Component, metadata export)
- [x] 02-02-PLAN.md — Card grid: inline registries array + 3-col grid with a11y and tabnabbing mitigation
- [x] 02-03-PLAN.md — Navbar integration + end-to-end smoke checklist

---

## Phase 3 — Bridal Party Page

**Goal:** A `/bridal-party` page introducing the wedding party with photos and short bios.

**UI hint:** yes

**Scope:**

- New route `app/(main)/bridal-party/page.tsx`
- Content model: party members grouped (e.g., Bride's Side / Groom's Side) with name, role (Maid of Honor, Best Man, etc.), photo, 1-2 sentence bio
- Responsive grid; image optimization via `next/image`
- Add Bridal Party link to `components/Navbar.tsx` (new entry, not previously stubbed)
- Reference Stitch design tokens

**Dependencies:** none (independent of Phase 1 & 2)

**Plans:** 1/3 plans executed

Plans:

- [x] 03-01-PLAN.md — Page scaffold: metadata, Server Component shell, hero (verbatim 2-axis scrim recipe + locked copy), two empty section placeholders
- [ ] 03-02-PLAN.md — Magazine row body: Member type + getInitials helper + locked 16-person data arrays + Bride's Side + Groom's Side section headers and 8 alternating rows each with monogram fallback
- [ ] 03-03-PLAN.md — Navbar integration (index 4, between Things To Do and FAQ) + end-to-end 53-item smoke checklist + 7-route regression sweep

---

## Out of Scope for this Milestone

- Guest authentication / per-guest invitation codes
- Post-wedding photo gallery
- Email confirmation on RSVP submit (could be a future phase)
- Admin dashboard to view RSVPs (use Supabase Studio for now)
