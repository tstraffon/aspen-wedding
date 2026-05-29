# Aspen Wedding

## What This Is

The wedding website for Tyler & Emily's Aspen wedding. A guest-facing Next.js site that delivers event info (travel, itinerary, things to do, FAQ) and collects RSVPs into Supabase. Currently shipped pages are static info; the next milestone adds interactive guest features.

## Core Value

Guests get every answer they need about the wedding from one polished site, and submit their RSVP in under a minute.

## Requirements

### Validated

- Home, Travel & Stay, Itinerary, Things To Do, FAQ pages
- RSVP form and `/api/rsvp` Supabase POST endpoint (built, not yet exposed in nav)

### Active

- [ ] RSVP: enable in nav, verify Supabase schema, polish submission UX
- [ ] Registry: `/registry` page with linked gift items, enable nav link
- [ ] Bridal Party: `/bridal-party` page with member cards and photos

### Out of Scope

- Guest accounts / authentication — magic-link RSVP lookup is enough; full auth adds friction with no upside for one-off guests
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
| RSVP without guest auth | Email + name is enough identity for a wedding; no login friction | ✓ Good |

---
*Last updated: 2026-05-28 after milestone scoping*
