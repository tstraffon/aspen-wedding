# Phase 2: Registry Page - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-29
**Phase:** 02-registry-page
**Areas discussed:** Registry list & data, Layout & hero treatment, Logo / brand presentation, Personal note from couple

---

## Registry list & data

### Which registries

| Option | Description | Selected |
|--------|-------------|----------|
| Honeyfund (honeymoon fund) | Cash contributions for the honeymoon / experiences | ✓ |
| Amazon | Traditional gift registry on Amazon | ✓ |
| Crate & Barrel | Home goods / kitchen registry | ✓ |
| Zola | Popular wedding registry aggregator | |

**User's choice:** Honeyfund + Amazon + Crate & Barrel. No Zola.

### Data source

| Option | Description | Selected |
|--------|-------------|----------|
| Inline array in page.tsx | Matches Things-To-Do / Travel pattern; all in one file | ✓ |
| Separate config file (`data/registries.ts`) | Cleaner separation, slight overhead | |
| Markdown / JSON data file | Non-code authoring; overkill for ~3 items | |

**User's choice:** Inline array in `page.tsx`.
**Notes:** Stays consistent with the existing `(main)` page pattern. No `data/` directory exists in the project today.

---

## Layout & hero treatment

### Layout pattern

| Option | Description | Selected |
|--------|-------------|----------|
| 3-col grid like Things-To-Do | Card grid with image + blurb + CTA | ✓ |
| Centered single-column stack | Larger curated cards stacked vertically | |
| 2-col asymmetric / featured | One featured, others as a 2-col secondary row | |
| Full-width horizontal cards | Logo left, content right per row | |

**User's choice:** 3-col grid like Things-To-Do.

### Hero treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Full-bleed image hero (match other pages) | Same cinematic pattern as Things-To-Do / Travel | ✓ |
| Compact text-only hero | Smaller hero, no image | |
| Abstract / textural background | Soft gradient / paper texture | |

**User's choice:** Full-bleed image hero matching the rest of the site.

---

## Logo / brand presentation

### Brand mark per card

| Option | Description | Selected |
|--------|-------------|----------|
| Custom image per card (like Things-To-Do) | Editorial photo above title; sets unified mood | ✓ |
| Brand logos (SVG) | Real Honeyfund / Amazon / C&B logos | |
| Material icon + brand name as headline | Generic gold icon + brand text | |
| Wordmark text only (no image) | Just the registry name, minimalist | |

**User's choice:** Custom editorial image per card.
**Notes:** Avoids brand-color clashes with the dark teal + warm gold palette; keeps page cohesive with Things-To-Do and Travel.

### Assets (URLs + images)

| Option | Description | Selected |
|--------|-------------|----------|
| User provides during planning | Tyler hands off URLs + images before plan-phase | |
| Planner uses placeholder URLs + stock images | Use `#` or `/placeholder` and Unsplash; swap later | ✓ |
| User provides URLs only, planner picks images | Tyler provides URLs; planner picks editorial imagery | |

**User's choice:** Placeholders + stock imagery during planning; Tyler swaps in real URLs/images before final ship.

---

## Personal note from couple

### Note placement

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — between hero and cards | Short editorial block framing the registry | ✓ |
| Yes — above the registry list, sectioned editorial block | More formal, own section padding | |
| Yes — below the cards, as a closing line | Cards first, then closing thank-you | |
| No — just hero + cards | Hero subhead carries the gratitude framing | |

**User's choice:** Personal note between hero and cards.

### Tone

| Option | Description | Selected |
|--------|-------------|----------|
| Warm and gracious | Soft, grateful, low-pressure | ✓ |
| Playful / personal | Casual, reflects Tyler & Emily's voice | |
| Honeymoon-forward | Leads with experience framing | |
| Minimal / no framing copy | Skip gratitude framing entirely | |

**User's choice:** Warm and gracious.

---

## Claude's Discretion

- Exact hero image asset (UI-researcher to choose something on-theme: alpine view, wrapped gifts, or curated home tabletop)
- Exact section padding / vertical rhythm — follow the Things-To-Do cadence (`py-16` / `py-32`)
- Exact framing copy wording (within the "warm and gracious" tone)
- Whether to add a subtle radial gradient under the cards section (like Things-To-Do restaurants) — UI judgment call
- Hero subhead copy to complement the framing block

## Deferred Ideas

None — discussion stayed within phase scope. (Gift tracking, RSVP-linked thank-you flow, and dedicated honeymoon-experience pickers remain out of scope per `PROJECT.md`.)
