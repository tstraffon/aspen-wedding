# Aspen Wedding

## What This Is

The wedding website for Tyler & Emily's Aspen wedding. A guest-facing Next.js site that delivers event info (travel, itinerary, things to do, FAQ, registry, bridal party) and collects RSVPs into Supabase. All v0.1 guest-facing pages are shipped; the v0.2 milestone gates the RSVP flow to invited guests only and adds household + meal handling.

## Core Value

Guests get every answer they need about the wedding from one polished site, and submit their RSVP in under a minute — only if they're on the list.

## Current Milestone: v0.2 Gated RSVP & Meal Selection

**Goal:** Lock the RSVP flow to invited guests only, let one guest RSVP for their entire household, and capture each attendee's meal choice.

**Target features:**
- Guest list table in Supabase (Tyler-managed via Studio or CSV import) with household grouping
- Name-lookup gate on `/rsvp` — guest types name → backend matches against the guest list → if found, returns everyone in their household; if not, shows "we can't find you" with a support contact
- Group RSVP form — one row per household member with attending Y/N, meal choice dropdown (3 options), per-person dietary notes
- Schema migration: add `meal_choice` + `household_id` to `rsvps`, drop the unused `guest_count` integer

## Requirements

### Validated (v0.1)

- Home, Travel & Stay, Itinerary, Things To Do, FAQ pages
- RSVP form and `/api/rsvp` Supabase POST endpoint with live Supabase wiring (anon-only route, GRANT-based write-only access), polished form with full a11y pass, nav link enabled, smoke-tested locally and Vercel env vars confirmed *(validated in Phase 1)*
- Registry: `/registry` page with three editorial cards (Honeyfund, Amazon, Crate & Barrel), tabnabbing-mitigated outbound links, hero with 2-axis contrast scrim, nav link enabled *(validated in Phase 2)*
- Bridal Party: `/bridal-party` page with 16-member side-by-side column layout, monogram fallback for missing photos, nav link enabled *(validated in Phase 3)*

### Active (v0.2)

- [ ] Guest list table with household grouping (Tyler-managed)
- [ ] Name-lookup gate on RSVP entry
- [ ] Group RSVP submission flow
- [ ] Per-attendee meal selection (3 options)

### Out of Scope

- Guest accounts / authentication — name-lookup gate is the lightest version of identity; no passwords, no magic links, no email infrastructure
- Email confirmations on RSVP submit — separate concern, can be a future milestone if needed (would add Resend/SendGrid dependency)
- Built-in admin UI for guest list management — Supabase Studio + CSV import is enough for a one-off wedding
- Photo gallery / post-wedding uploads — separate concern, after the event
- i18n — all guests English-speaking

## Context

- Next.js 16 App Router with `(main)` route group for the public site
- Tailwind v4 with the Stitch "Editorial Alpine Luxury" theme. Shipped tokens in `app/globals.css` use a dark editorial palette: deep teal surface (`#0d1b1e`), surface-container layers (`#122023`), and a warm gold/copper accent (`#d4a373`). Noto Serif headlines, Manrope body/labels.
- Supabase used for RSVP storage (`rsvps` table); anon key via `NEXT_PUBLIC_SUPABASE_*` env vars
- Stitch design project ID `7638647324156070713` is the source of truth for visual design

## Constraints

- **Tech stack**: Next.js 16, React 19, TypeScript, Tailwind v4, Supabase — fixed
- **Design system**: Stitch "Aspen Wedding" tokens (forest green / snow white, Noto Serif + Manrope) — every new page matches
- **Timeline**: Wedding date drives shipping order — RSVP first, then Registry, then Bridal Party
- **Audience**: Non-technical wedding guests on mobile and desktop — accessibility and clarity over cleverness

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 16 App Router + Supabase | Familiar stack; Supabase enough for low-volume RSVP writes | ✓ Good |
| Stitch design system as source of truth | Visual consistency without bespoke design rounds | ✓ Good |
| RSVP without guest auth | Email + name is enough identity for a wedding; no login friction | ✓ Good (v0.1) → revised in v0.2 with name-lookup gate |
| Plain `<img>` over `next/image` for all guest pages | Static page, low image count, no need for AVIF/srcset overhead; matches v0.1 shipped pattern across Registry / Things-To-Do / Travel / Bridal Party | ✓ Good |
| Name-lookup gate over magic-link / per-guest invitation codes (v0.2) | Lightest friction for non-technical wedding guests; no email infrastructure dependency; matches "no auth" stance | TBD |
| Single `rsvps` table with `meal_choice` + `household_id` columns over separate `meals` table (v0.2) | Low-volume one-off data; relational decomposition adds complexity without payoff | TBD |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-30 — starting milestone v0.2 (Gated RSVP & Meal Selection); v0.1 (Interactive Guest Features) shipped 10/10 plans across 3 phases.*
