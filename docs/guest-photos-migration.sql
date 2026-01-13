-- ============================================
-- Guest Photos Table Migration
-- Add this to your existing Supabase database
-- ============================================

-- Guest photos table: stores photos uploaded by guests
CREATE TABLE IF NOT EXISTS guest_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT CHECK (LENGTH(caption) <= 500),
  location TEXT,
  date_taken DATE,
  is_approved BOOLEAN DEFAULT false, -- for moderation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_guest_photos_guest_id ON guest_photos(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_photos_approved ON guest_photos(is_approved);

-- Enable Row Level Security
ALTER TABLE guest_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for guest_photos
-- Anyone can view approved photos
DROP POLICY IF EXISTS "Anyone can view approved photos" ON guest_photos;
CREATE POLICY "Anyone can view approved photos"
  ON guest_photos FOR SELECT
  USING (is_approved = true);

-- Guests can view their own photos (even if not approved)
DROP POLICY IF EXISTS "Users can view own photos" ON guest_photos;
CREATE POLICY "Users can view own photos"
  ON guest_photos FOR SELECT
  USING (
    guest_id::text = auth.uid()::text OR
    guest_id IN (SELECT id FROM guests WHERE email = auth.jwt()->>'email')
  );

-- Guests can upload their own photos
DROP POLICY IF EXISTS "Users can insert own photos" ON guest_photos;
CREATE POLICY "Users can insert own photos"
  ON guest_photos FOR INSERT
  WITH CHECK (
    guest_id::text = auth.uid()::text OR
    guest_id IN (SELECT id FROM guests WHERE email = auth.jwt()->>'email')
  );

-- Guests can delete their own photos
DROP POLICY IF EXISTS "Users can delete own photos" ON guest_photos;
CREATE POLICY "Users can delete own photos"
  ON guest_photos FOR DELETE
  USING (
    guest_id::text = auth.uid()::text OR
    guest_id IN (SELECT id FROM guests WHERE email = auth.jwt()->>'email')
  );

-- Service role can manage all photos (for admin approval)
DROP POLICY IF EXISTS "Service role can manage guest photos" ON guest_photos;
CREATE POLICY "Service role can manage guest photos"
  ON guest_photos FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- Storage Bucket Setup
-- ============================================
-- Run these commands in Supabase Dashboard > Storage

-- Create a bucket for guest photos (if not exists)
-- Bucket name: guest-photos
-- Public: true (so photos can be viewed without auth)
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/heic

-- Storage policies (apply in Supabase Dashboard)
-- 1. Allow authenticated users to upload:
--    Operation: INSERT
--    Policy: (bucket_id = 'guest-photos')
--
-- 2. Allow anyone to view:
--    Operation: SELECT
--    Policy: (bucket_id = 'guest-photos')

-- ============================================
-- Completion Message
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Guest photos table created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Create "guest-photos" storage bucket in Supabase Dashboard';
  RAISE NOTICE '  2. Set bucket to public';
  RAISE NOTICE '  3. Configure storage policies';
  RAISE NOTICE '  4. Update your .env.local with bucket name';
END $$;
