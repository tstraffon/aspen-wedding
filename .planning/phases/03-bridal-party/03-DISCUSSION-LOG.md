# Phase 3 Discussion Log — Bridal Party

**Date:** 2026-05-30
**Areas discussed:** Roster + Grouping · Card layout + photo style · Bio tone + length
**Areas skipped (Claude's discretion):** Hero treatment

---

## Pre-discussion analysis

### Carry-forward decisions (not re-asked)
- Stitch palette + tokens (dark teal + warm gold, Noto Serif + Manrope) — locked in PROJECT.md and verified across Phases 1 & 2.
- Plain `<img>` + eslint-disable instead of `next/image` — every shipped page uses this. Flagged for explicit confirmation in Area 2 because ROADMAP §Phase 3 says `next/image`.
- Card grid pattern, hero pattern, navbar pattern — used as starting points for variant decisions.

### Gray areas surfaced to user
- Roster + grouping
- Card layout + photo style
- Hero treatment
- Bio tone + length

### User selection
Discussed: Roster + grouping, Card layout + photo style, Bio tone + length.
Skipped (Claude's discretion): Hero treatment.

---

## Area 1: Roster + Grouping

### Q1 — Structure
**Options:**
- Symmetric sides (recommended) — Bride's Side + Groom's Side sections
- Single party, role-grouped
- Single flat grid
- Symmetric sides + extras (Honored Guests)

**Selected:** Symmetric sides.
**Why noted:** Traditional, scans cleanly, lets guests find someone by who they know.

### Q2 — Roster (freeform)
**User-provided roster verbatim:**
- Bride's Side: Sarah Else (MOH), Emily Asinger, Lindsay Carr, Sarah Horan, Sam Jones, Shannon Robins, Michelle Spencer, Ryan Hindle
- Groom's Side: Dylan Straffon (Best Man), Aaron Sorge, Jack Cardello, Ken Kinoshita, Jon Metz, Ian Adams, Collin DeMatt, Josh Tallman

Derived role labels:
- Sarah Else → "Maid of Honor"
- Dylan Straffon → "Best Man"
- All other Bride's Side → "Bridesmaid"
- All other Groom's Side → "Groomsman"

### Q3 — Order within each section
**Options:**
- As listed above (recommended)
- Honor attendant first, then alphabetical
- Honor attendant first, then random per render

**Selected:** As listed above.
**Why noted:** User's order is intentional ranking — honor attendant first, then closest relationships next.

---

## Area 2: Card Layout + Photo Style

### Q1 — Layout style
**Options (with ASCII previews):**
- Editorial card (reuse Registry pattern) — vertical card, image top, name/role/bio below.
- Portrait-overlay card — full image fills card, name overlay on bottom-third, hover reveals bio.
- Magazine: name + role row, photo to the side — wide editorial spread, alternating left/right.

**Selected:** Magazine layout.
**Why noted:** Wider, more text-forward, editorial spread feel. Distinct from Registry's 3-up card grid by design.

### Q2 — Photo crop
**Options:**
- Portrait 4:5 (recommended)
- Portrait 3:4
- Square 1:1
- Landscape 16:9

**Selected:** 4:5 portrait.
**Why noted:** Matches Registry card crop — keeps editorial portrait feel consistent across site.

### Q3 — Photo source / missing-photo handling
**Options:**
- Local `/public/bridal-party/<name>.jpg` + neutral placeholder (recommended)
- Unsplash stock placeholders now, real at handoff
- Cloudinary / image CDN

**Selected:** Local `/public/bridal-party/<name>.jpg` + neutral initial-monogram placeholder.
**Why noted:** Same Tyler-fills-at-handoff pattern Registry uses for URLs. Stock faces on a wedding-party page would be weird if forgotten. Cloudinary is overkill for 16 photos.

### Q4 — Image tag (`next/image` vs `<img>`)
**Options:**
- Plain `<img>` + eslint-disable (recommended)
- `next/image`
- `next/image` only on bridal-party, plain `<img>` elsewhere

**Selected:** Plain `<img>` + eslint-disable.
**Why noted:** Match the codebase pattern. ROADMAP's wording is superseded by the team's de-facto decision shipped across Phases 1 & 2.

---

## Area 3: Bio Tone + Length

### Q1 — Tone
**Options:**
- Warm + personal from the couple (recommended)
- Casual + playful with inside jokes
- Formal third-person bio
- Mixed: couple voice for honor attendants, third-person for rest

**Selected:** Warm + personal from the couple.
**Why noted:** Matches the Registry framing voice (warm-gracious) — coherent with the rest of the site.

### Q2 — Length
**Options:**
- Strict 1-2 sentences (recommended)
- Short paragraph (2-4 sentences)
- Variable — honor attendants longer, attendants shorter

**Selected:** Strict 1-2 sentences.
**Why noted:** Caps page length, forces evocative tight writing, easier to draft 16 of them.

---

## Claude's Discretion (decided without asking)

- **Hero treatment** — full cinematic hero matching Registry/Things-To-Do, using the 2-axis scrim recipe that landed at `e82d7d4`. Eyebrow / headline / subtitle copy to be landed by UI-researcher.
- **Section ordering** — Bride's Side first (matches "Bride's Side / Groom's Side" naming order).
- **Navbar position** — `Bridal Party` slotted between `Things To Do` and `FAQ`. Reasoning: discovery/get-to-know item belongs with `Things To Do`, not with logistics (FAQ) or transactional items (Registry/RSVP).
- **Section spacing** — `py-32 md:py-48` (more breathing room than Registry's `py-16` because the page is longer).
- **Row reveal motion** — `reveal-on-scroll` per row, not `reveal-on-scroll-stagger` (rows are full-width; stagger feels chaotic at row scale).
- **Mobile collapse** — text always above photo on `<md` (consistent reading order, no zigzag).
- **Placeholder bios** — generic 1-2 sentence safe copy ("A dear friend to both of us — we're so glad they're standing with us.") with `// TODO: replace with real bio` comment per member.
- **Heading hierarchy** — h1 (hero) → h2 (each section) → h3 (each member name). 16 h3s expected.
- **Accessibility** — `alt={\`Portrait of ${member.name}\`}`. Decorative divs `aria-hidden="true"`. No outbound links = no tabnabbing surface.

---

## Deferred Ideas (preserved for future)

- Individual member detail pages (`/bridal-party/sarah-else` etc.)
- Contact info per member (email, social handles)
- Group photo per section (Bride's Side and Groom's Side group shots at top of each section)
- Honored Guests section (parents, officiant, ring bearer, flower girl)
- Hover-reveal bio overlay (option B in layout question — rejected in favor of always-visible magazine layout)

---

## Scope creep redirected

None — discussion stayed inside the phase boundary throughout.
