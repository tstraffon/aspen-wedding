# Aspen Wedding Website 🏔️

A beautiful, interactive wedding website built with Next.js 14, Supabase, and Tailwind CSS featuring Aspen fall colors.

## Features

- 🔐 Email-based authentication
- 📝 Multi-step RSVP system (Rehearsal Dinner, Ceremony, Reception, Brunch)
- 🎯 Interactive quizzes ("How well do you know us?" and "Wedding Predictions")
- 🗺️ Interactive map with venues, hotels, restaurants, and activities
- 📸 Photo gallery with reactions
- 👰🤵 Wedding party profiles
- 📖 Our story timeline
- 🎨 Aspen fall color palette with mountain themes
- 📱 Fully responsive design
- ⚡ Performance optimized with Next.js 14

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Maps**: Mapbox GL
- **Forms**: React Hook Form + Zod
- **Email**: Resend
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier)
- A Mapbox account (free tier)
- A Resend account (free tier) - optional for emails

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - In the SQL Editor, run the database schema from `docs/database-schema.sql` (see below)
   - Enable Row Level Security (RLS) on all tables
   - Get your project URL and anon key from Settings > API

3. **Set up Mapbox**
   - Go to [mapbox.com](https://mapbox.com) and create an account
   - Create a new access token
   - Copy your access token

4. **Configure environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase and Mapbox credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Guests table
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  household_group TEXT,
  plus_one_allowed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RSVPs table
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  rehearsal_dinner BOOLEAN DEFAULT false,
  ceremony BOOLEAN DEFAULT false,
  reception BOOLEAN DEFAULT false,
  brunch BOOLEAN DEFAULT false,
  meal_preference TEXT,
  dietary_restrictions TEXT,
  guest_count INTEGER DEFAULT 1,
  plus_one_name TEXT,
  message TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Quiz responses
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  quiz_type TEXT NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Gallery reactions
CREATE TABLE gallery_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  photo_id TEXT NOT NULL,
  reaction TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Guests can read their own data
CREATE POLICY "Users can view own guest data"
  ON guests FOR SELECT
  USING (auth.uid()::text = id::text);

-- Guests can read and update their own RSVPs
CREATE POLICY "Users can view own rsvps"
  ON rsvps FOR SELECT
  USING (guest_id::text = auth.uid()::text);

CREATE POLICY "Users can insert own rsvps"
  ON rsvps FOR INSERT
  WITH CHECK (guest_id::text = auth.uid()::text);

CREATE POLICY "Users can update own rsvps"
  ON rsvps FOR UPDATE
  USING (guest_id::text = auth.uid()::text);
```

## Project Structure

```
aspen-wedding/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   ├── (public)/
│   │   │   ├── our-story/
│   │   │   ├── wedding-party/
│   │   │   ├── details/
│   │   │   ├── travel/
│   │   │   ├── gallery/
│   │   │   ├── quiz/
│   │   │   └── registry/
│   │   ├── (protected)/
│   │   │   └── rsvp/
│   │   ├── admin/
│   │   └── api/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── animations/
│   ├── lib/
│   │   ├── supabase/
│   │   └── utils.ts
│   ├── types/
│   └── hooks/
├── public/
│   └── images/
└── docs/
```

## Development Timeline

See the full [4-week development schedule](docs/DEVELOPMENT_SCHEDULE.md) for detailed day-by-day tasks.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy!

Vercel will automatically deploy on every push to main branch.

## Customization

### Colors
Edit the color palette in `tailwind.config.js` to match your preferences.

### Content
- Update couple names in `src/app/layout.tsx` metadata
- Add your story content in `src/app/(public)/our-story/page.tsx`
- Upload photos to Supabase Storage or use Vercel Blob
- Customize quiz questions in the quiz page components

### Features
Optional features to add:
- Spotify playlist integration
- Guest photo uploads
- Live stream for remote guests
- Gift registry API integration

## Contributing

This is a personal project, but feel free to fork and adapt for your own wedding!

## License

MIT License - feel free to use this for your own wedding website!

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for a mountain wedding in Aspen 🏔️
