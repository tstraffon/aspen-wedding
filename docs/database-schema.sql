-- ============================================
-- Aspen Wedding Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Guests table: stores all wedding guests
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  household_group TEXT, -- for grouping families/couples
  plus_one_allowed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSVPs table: stores RSVP responses
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  
  -- Event attendance
  rehearsal_dinner BOOLEAN DEFAULT false,
  ceremony BOOLEAN DEFAULT false,
  reception BOOLEAN DEFAULT false,
  brunch BOOLEAN DEFAULT false,
  
  -- Meal and dietary info
  meal_preference TEXT CHECK (meal_preference IN ('beef', 'chicken', 'vegetarian', 'vegan', NULL)),
  dietary_restrictions TEXT,
  
  -- Plus one info
  guest_count INTEGER DEFAULT 1 CHECK (guest_count >= 0 AND guest_count <= 10),
  plus_one_name TEXT,
  plus_one_meal_preference TEXT CHECK (plus_one_meal_preference IN ('beef', 'chicken', 'vegetarian', 'vegan', NULL)),
  
  -- Message from guest
  message TEXT CHECK (LENGTH(message) <= 1000),
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one RSVP per guest
  UNIQUE(guest_id)
);

-- Quiz responses table: stores quiz answers
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  quiz_type TEXT NOT NULL CHECK (quiz_type IN ('know_us', 'predictions')),
  answers JSONB NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Allow one response per guest per quiz type
  UNIQUE(guest_id, quiz_type)
);

-- Gallery reactions table: stores photo reactions
CREATE TABLE IF NOT EXISTS gallery_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  photo_id TEXT NOT NULL,
  reaction TEXT NOT NULL CHECK (reaction IN ('love', 'laugh', 'wow')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One reaction per guest per photo
  UNIQUE(guest_id, photo_id)
);

-- ============================================
-- INDEXES for better query performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_household ON guests(household_group);
CREATE INDEX IF NOT EXISTS idx_rsvps_guest_id ON rsvps(guest_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_guest_id ON quiz_responses(guest_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_type ON quiz_responses(quiz_type);
CREATE INDEX IF NOT EXISTS idx_gallery_reactions_photo ON gallery_reactions(photo_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on rsvps
DROP TRIGGER IF EXISTS update_rsvps_updated_at ON rsvps;
CREATE TRIGGER update_rsvps_updated_at
  BEFORE UPDATE ON rsvps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_reactions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Guests policies
DROP POLICY IF EXISTS "Users can view own guest data" ON guests;
CREATE POLICY "Users can view own guest data"
  ON guests FOR SELECT
  USING (auth.uid()::text = id::text OR email = auth.jwt()->>'email');

DROP POLICY IF EXISTS "Service role can manage guests" ON guests;
CREATE POLICY "Service role can manage guests"
  ON guests FOR ALL
  USING (auth.role() = 'service_role');

-- RSVPs policies
DROP POLICY IF EXISTS "Users can view own rsvps" ON rsvps;
CREATE POLICY "Users can view own rsvps"
  ON rsvps FOR SELECT
  USING (
    guest_id::text = auth.uid()::text OR
    guest_id IN (SELECT id FROM guests WHERE email = auth.jwt()->>'email')
  );

DROP POLICY IF EXISTS "Users can insert own rsvps" ON rsvps;
CREATE POLICY "Users can insert own rsvps"
  ON rsvps FOR INSERT
  WITH CHECK (
    guest_id::text = auth.uid()::text OR
    guest_id IN (SELECT id FROM guests WHERE email = auth.jwt()->>'email')
  );

DROP POLICY IF EXISTS "Users can update own rsvps" ON rsvps;
CREATE POLICY "Users can update own rsvps"
  ON rsvps FOR UPDATE
  USING (
    guest_id::text = auth.uid()::text OR
    guest_id IN (SELECT id FROM guests WHERE email = auth.jwt()->>'email')
  );

-- Quiz responses policies
DROP POLICY IF EXISTS "Users can view own quiz responses" ON quiz_responses;
CREATE POLICY "Users can view own quiz responses"
  ON quiz_responses FOR SELECT
  USING (
    guest_id::text = auth.uid()::text OR
    guest_id IN (SELECT id FROM guests WHERE email = auth.jwt()->>'email')
  );

DROP POLICY IF EXISTS "Users can insert own quiz responses" ON quiz_responses;
CREATE POLICY "Users can insert own quiz responses"
  ON quiz_responses FOR INSERT
  WITH CHECK (
    guest_id::text = auth.uid()::text OR
    guest_id IN (SELECT id FROM guests WHERE email = auth.jwt()->>'email')
  );

-- Gallery reactions policies
DROP POLICY IF EXISTS "Anyone can view gallery reactions" ON gallery_reactions;
CREATE POLICY "Anyone can view gallery reactions"
  ON gallery_reactions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own reactions" ON gallery_reactions;
CREATE POLICY "Users can insert own reactions"
  ON gallery_reactions FOR INSERT
  WITH CHECK (
    guest_id::text = auth.uid()::text OR
    guest_id IN (SELECT id FROM guests WHERE email = auth.jwt()->>'email')
  );

DROP POLICY IF EXISTS "Users can delete own reactions" ON gallery_reactions;
CREATE POLICY "Users can delete own reactions"
  ON gallery_reactions FOR DELETE
  USING (
    guest_id::text = auth.uid()::text OR
    guest_id IN (SELECT id FROM guests WHERE email = auth.jwt()->>'email')
  );

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert sample guest data
/*
INSERT INTO guests (email, first_name, last_name, household_group, plus_one_allowed) VALUES
  ('john.doe@example.com', 'John', 'Doe', 'Doe Family', true),
  ('jane.smith@example.com', 'Jane', 'Smith', 'Smith Family', false),
  ('bob.wilson@example.com', 'Bob', 'Wilson', NULL, true);
*/

-- ============================================
-- ADMIN VIEWS (Optional - for analytics)
-- ============================================

-- View for RSVP statistics
CREATE OR REPLACE VIEW rsvp_statistics AS
SELECT
  COUNT(DISTINCT guest_id) as total_responses,
  COUNT(DISTINCT CASE WHEN rehearsal_dinner THEN guest_id END) as rehearsal_count,
  COUNT(DISTINCT CASE WHEN ceremony THEN guest_id END) as ceremony_count,
  COUNT(DISTINCT CASE WHEN reception THEN guest_id END) as reception_count,
  COUNT(DISTINCT CASE WHEN brunch THEN guest_id END) as brunch_count,
  COUNT(CASE WHEN meal_preference = 'beef' THEN 1 END) as beef_count,
  COUNT(CASE WHEN meal_preference = 'chicken' THEN 1 END) as chicken_count,
  COUNT(CASE WHEN meal_preference = 'vegetarian' THEN 1 END) as vegetarian_count,
  COUNT(CASE WHEN meal_preference = 'vegan' THEN 1 END) as vegan_count,
  SUM(guest_count) as total_guest_count
FROM rsvps;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE 'Database schema created successfully! 🏔️';
  RAISE NOTICE 'Tables created: guests, rsvps, quiz_responses, gallery_reactions';
  RAISE NOTICE 'Row Level Security enabled on all tables';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Import your guest list using the INSERT INTO guests command';
  RAISE NOTICE '  2. Configure your app environment variables';
  RAISE NOTICE '  3. Test authentication and RSVP flows';
END $$;
