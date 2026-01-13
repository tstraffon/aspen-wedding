# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 wedding website for an Aspen, Colorado mountain wedding featuring:
- Password-protected site access
- Multi-event RSVP system (Rehearsal Dinner, Ceremony, Reception, Brunch)
- Interactive features (quizzes, photo gallery with reactions)
- Mapbox-based travel guide
- Supabase backend with PostgreSQL and Row Level Security

## Development Commands

```bash
# Development
npm run dev          # Start dev server on http://localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Set up Supabase project and run `docs/database-schema.sql`
3. Configure required environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
   - `SITE_PASSWORD` (for password protection)
   - `NEXT_PUBLIC_WEDDING_DATE` (format: YYYY-MM-DD)
   - `NEXT_PUBLIC_RSVP_DEADLINE` (format: YYYY-MM-DD)

## Architecture

### Authentication & Access Control

The site uses a **two-layer authentication approach**:

1. **Site Password Protection** (via middleware):
   - Cookie-based password gate for entire site
   - Middleware in `src/middleware.ts` checks for `site-authenticated` cookie
   - Password verification handled by `/api/auth/password` route
   - All routes protected except `/password` and `/api/*`

2. **Supabase Auth** (for RSVP system):
   - Email-based authentication for guest-specific features
   - Row Level Security policies ensure guests only access their own data
   - Guest records pre-populated in database with email addresses

### Route Groups & Structure

Next.js 14 App Router with route groups for organization:

```
src/app/
├── (auth)/login/          # Supabase authentication pages
├── (public)/              # Public pages (our-story, wedding-party, etc.)
├── (protected)/rsvp/      # Protected RSVP system
├── admin/                 # Admin dashboard
├── api/                   # API routes
├── password/              # Site password page
└── page.tsx               # Homepage with countdown
```

Route groups `(auth)`, `(public)`, and `(protected)` don't affect URL structure but organize code logically.

### Database Schema

Four main tables with RLS policies:

- **guests**: Guest list with email, names, household grouping, plus-one status
- **rsvps**: Multi-event RSVP responses with meal preferences and dietary restrictions
- **quiz_responses**: Quiz answers with JSONB storage for flexibility
- **gallery_reactions**: Photo reactions (love, laugh, wow)

Key relationships:
- All tables reference `guests.id` with CASCADE deletion
- UNIQUE constraints prevent duplicate responses per guest
- Auto-updating `updated_at` trigger on `rsvps` table
- `rsvp_statistics` view provides aggregated counts for admin

RLS policies enforce that guests can only view/modify their own data, matching by `guest_id` or email from JWT.

### Supabase Client Pattern

Two separate client instances:

1. **Client-side** (`src/lib/supabase/client.ts`):
   - Uses `createBrowserClient` from `@supabase/ssr`
   - For use in Client Components
   - Auto-handles cookie management in browser

2. **Server-side** (`src/lib/supabase/server.ts`):
   - Uses `createServerClient` from `@supabase/ssr`
   - For use in Server Components, API routes, Server Actions
   - Requires Next.js `cookies()` API for cookie handling
   - Cookie operations wrapped in try-catch since some may fail in Server Components

Always import the appropriate client based on component type.

### Styling System

Tailwind CSS with custom Aspen fall color palette:

```javascript
// Primary colors (warm tones)
aspen-gold:    #F4A460  // Golden aspen leaves
aspen-amber:   #D4A373  // Warm amber (primary)
aspen-copper:  #B87333  // Copper tones
aspen-rust:    #A0522D  // Rust red
aspen-burgundy: #800020 // Deep burgundy

// Secondary colors (green tones)
aspen-sage:    #9CAF88  // Sage green
aspen-forest:  #2D5016  // Forest green (secondary)
aspen-pine:    #01411C  // Deep pine

// Neutral colors
aspen-cream:   #F5F5DC  // Cream/beige background
aspen-stone:   #8B8680  // Mountain stone
```

Custom animations defined in `tailwind.config.js`: fade-in, slide-up, slide-down, scale-in.

Utility classes defined in `globals.css` for consistent typography and spacing:
- `.heading-xl`, `.heading-lg`, `.heading-md`, `.heading-sm`
- `.body-text`, `.body-sm`
- `.container-custom`

### Component Architecture

Reusable UI components in `src/components/ui/`:

- **Button**: 4 variants (primary, secondary, outline, ghost), 3 sizes (sm, md, lg)
- **Card**: Compound component pattern with Header, Body, Footer sub-components
- **Input**: Form input with label, error state, helper text

Pattern to follow: Use `cn()` utility from `src/lib/utils.ts` for merging Tailwind classes with proper precedence.

### Type Safety

TypeScript types split into two files:

1. **`src/types/database.ts`**: Generated database types from Supabase schema
   - `Database` type with table definitions (Row, Insert, Update)
   - Helper types: `Guest`, `Rsvp`, `QuizResponse`, `GalleryReaction`
   - Enum types: `MealPreference`, `ReactionType`

2. **`src/types/index.ts`**: Application-level types
   - Import and extend database types as needed
   - Component prop types
   - API response types

When adding new database tables or columns, update `database.ts` to match schema.

### Utility Functions

`src/lib/utils.ts` provides common helpers:

- `cn()`: Merge Tailwind classes (uses clsx + tailwind-merge)
- Date functions: `getDaysUntilWedding()`, `getDaysUntilRsvpDeadline()`, `getWeddingDate()`
- Formatting: `formatGuestName()`, `getInitials()`, `truncateText()`
- Validation: `isValidEmail()`, `isRsvpDeadlinePassed()`

These functions read from environment variables, so ensure `.env.local` is properly configured.

## Key Implementation Details

### Image Optimization

Next.js Image component configured for Supabase Storage:
- Remote pattern in `next.config.js` allows `*.supabase.co` domains
- Always use `next/image` for photo gallery and profile images
- Store images in Supabase Storage buckets, not in repo

### Form Handling

Use React Hook Form + Zod pattern:
1. Define Zod schema for validation
2. Use `@hookform/resolvers/zod` for integration
3. Handle submission with Server Actions or API routes
4. Display errors with Input component's error prop

### Animation & Motion

Framer Motion installed for advanced animations. Use for:
- Page transitions
- Interactive elements (quiz buttons, reactions)
- Scroll-based reveals
- Complex gestures

Simple animations use Tailwind's custom animation classes.

### Mapbox Integration

Travel guide uses `react-map-gl` wrapper:
- Token from `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
- Interactive markers for venues, hotels, restaurants, activities
- Custom map style recommended for brand consistency

## Database Workflows

### Initial Guest Import

1. Prepare CSV with columns: `email, first_name, last_name, household_group, plus_one_allowed`
2. Use Supabase dashboard Table Editor to import
3. Or use SQL: `INSERT INTO guests (email, first_name, last_name, household_group, plus_one_allowed) VALUES (...)`

### RSVP Flow

1. Guest authenticates with email via Supabase Auth
2. Guest data fetched based on authenticated email
3. RSVP form shows 4 event checkboxes + meal preferences + dietary restrictions
4. Submit creates/updates record in `rsvps` table
5. RLS policies ensure guest can only modify their own RSVP
6. Admin dashboard queries `rsvp_statistics` view for counts

### Admin Access

Admin dashboard should:
- Query `rsvp_statistics` view for aggregate data
- List all RSVPs with guest details (join `guests` and `rsvps`)
- Export to CSV for catering/planning
- Use service role key for unrestricted access (never expose client-side)

## Common Patterns

### Server Component Data Fetching

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('guests')
    .select('*')

  // Handle error, render data
}
```

### Client Component Data Fetching

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function Component() {
  const supabase = createClient()
  const [data, setData] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('guests').select('*')
      setData(data)
    }
    fetchData()
  }, [])

  // Render data
}
```

### Using Custom Colors

```tsx
<div className="bg-aspen-cream text-aspen-forest">
  <h1 className="text-aspen-amber">Heading</h1>
  <button className="bg-primary hover:bg-primary-dark">
    Click me
  </button>
</div>
```

### Path Aliases

Use `@/*` import alias for cleaner imports:
```typescript
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import type { Guest } from '@/types/database'
```

## Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Add all environment variables in Vercel project settings
3. Deploy automatically on push to main branch
4. Set `NEXT_PUBLIC_SITE_URL` to production URL

### Post-Deployment Checklist

- [ ] Verify Supabase RLS policies are enabled
- [ ] Test password protection
- [ ] Test RSVP submission flow
- [ ] Check image loading from Supabase Storage
- [ ] Verify Mapbox maps render correctly
- [ ] Test on mobile devices
- [ ] Confirm email notifications work (if using Resend)

## Debugging Tips

- **Middleware not working**: Check cookie name matches between middleware and API route
- **Supabase RLS errors**: Verify policies match `auth.uid()` or `auth.jwt()->>'email'`
- **Type errors**: Regenerate database types if schema changed
- **Image loading fails**: Check remote patterns in `next.config.js`
- **Date calculations wrong**: Verify `NEXT_PUBLIC_WEDDING_DATE` format (YYYY-MM-DD)
