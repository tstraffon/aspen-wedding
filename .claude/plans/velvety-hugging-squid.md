# Update Navbar Links + Sync to Stitch

## Context
The navbar currently has 4 links (Our Story, Details, RSVP, Registry) plus a standalone RSVP button. The user wants 6 specific nav items in a new order: **Home, Our Story, Itinerary, Travel & Stay, Registry, RSVP**. The Stitch designs should also be updated to reflect this new navigation.

## Changes

### 1. Update `components/Navbar.tsx`

Replace the `links` array with the new items:
```ts
const links = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/#our-story" },
  { label: "Itinerary", href: "/#itinerary" },
  { label: "Travel & Stay", href: "/#travel" },
  { label: "Registry", href: "/#registry" },
  { label: "RSVP", href: "/rsvp" },
];
```

With 6 nav links, the standalone RSVP button on the right becomes redundant (RSVP is already in the links). Remove it and use `justify-between` with just the logo + links. Reduce link spacing to `space-x-4 lg:space-x-8` so 6 items fit at desktop widths.

Fix the `isActive` logic to handle both `/rsvp` page routes and `/#section` anchors properly.

### 2. Update `app/page.tsx` section IDs

Rename/add section IDs to match the new anchor hrefs:
- Bento grid "Our Story" card → wrap or add `id="our-story"` to the bento grid section
- Welcome section (Arrival/Ceremony/Farewell timeline) → `id="itinerary"`
- Travel & Stay card → `id="travel"` on the bento grid section or the Location section
- Registry card already has `id="registry"` (keep as-is)

### 3. Update Stitch designs

Use `mcp__stitch__edit_screens` on both the Home and RSVP screens to update the navigation bar text from "Our Story, Details, RSVP, Registry" to "Home, Our Story, Itinerary, Travel & Stay, Registry, RSVP".

- Home screen ID: `388e232bc9634d5bbe1c5c27b4a5b620`
- RSVP screen ID: `1da707ceaf19464292ced6eae7741bc1`
- Project ID: `7638647324156070713`

### 4. Update `components/Footer.tsx`

Update the footer links to be consistent with the new nav terminology (e.g., "Gift Registry" → "Registry").

## Verification
1. Preview home page — verify all 6 nav links render without overflow at 1280px
2. Click each anchor link — verify smooth scroll to correct section
3. Navigate to `/rsvp` — verify RSVP link shows active state
4. Verify Stitch screens updated with new nav items
