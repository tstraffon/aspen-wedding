# Guest Photo Upload Setup Guide

This guide will help you set up the guest photo upload feature for your wedding website.

## Prerequisites

- Supabase project already created
- Database schema already deployed
- Environment variables configured

## Step 1: Run Database Migration

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `docs/guest-photos-migration.sql`
4. Click **Run** to execute the migration

This will create:
- `guest_photos` table
- Row Level Security policies
- Indexes for performance

## Step 2: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Configure the bucket:
   - **Name**: `guest-photos`
   - **Public**: ✅ Enabled (so photos can be viewed without auth)
   - Click **Create bucket**

## Step 3: Configure Storage Policies

### Allow Authenticated Users to Upload

1. Click on the `guest-photos` bucket
2. Go to **Policies** tab
3. Click **New policy**
4. Select **For full customization**
5. Configure:
   - **Policy name**: `Allow authenticated uploads`
   - **Allowed operation**: `INSERT`
   - **Policy definition**:
     ```sql
     (bucket_id = 'guest-photos' AND auth.role() = 'authenticated')
     ```
6. Click **Review** then **Save policy**

### Allow Anyone to View Photos

1. Click **New policy** again
2. Select **For full customization**
3. Configure:
   - **Policy name**: `Public read access`
   - **Allowed operation**: `SELECT`
   - **Policy definition**:
     ```sql
     (bucket_id = 'guest-photos')
     ```
4. Click **Review** then **Save policy**

### Allow Users to Delete Their Own Photos

1. Click **New policy** again
2. Select **For full customization**
3. Configure:
   - **Policy name**: `Users can delete own photos`
   - **Allowed operation**: `DELETE`
   - **Policy definition**:
     ```sql
     (bucket_id = 'guest-photos' AND auth.uid() IS NOT NULL)
     ```
4. Click **Review** then **Save policy**

## Step 4: Configure Bucket Settings (Optional)

1. Go to **Configuration** for the `guest-photos` bucket
2. Set file size limit: **5MB** (recommended)
3. Allowed MIME types:
   - `image/jpeg`
   - `image/png`
   - `image/webp`
   - `image/heic`

## Step 5: Test the Upload

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/gallery`

3. Click **Share Your Memory** button

4. Try uploading a test photo:
   - Must be logged in as a guest
   - File size under 5MB
   - Image format (JPG, PNG, WEBP)

5. Check Supabase:
   - Storage: Photo should appear in `guest-photos` bucket
   - Database: Record should appear in `guest_photos` table with `is_approved = false`

## Step 6: Photo Moderation

Guest photos require approval before appearing in the gallery. To approve photos:

### Option 1: Using Supabase Dashboard

1. Go to **Table Editor** > `guest_photos`
2. Find the photo you want to approve
3. Edit the row and set `is_approved` to `true`
4. Save the changes

### Option 2: Using SQL

```sql
-- Approve a specific photo
UPDATE guest_photos
SET is_approved = true
WHERE id = 'photo-uuid-here';

-- Approve all photos from a specific guest
UPDATE guest_photos
SET is_approved = true
WHERE guest_id = 'guest-uuid-here';

-- Approve all pending photos (use with caution!)
UPDATE guest_photos
SET is_approved = true
WHERE is_approved = false;
```

### Option 3: Build an Admin Panel (Future)

Consider building an admin page at `/admin/photos` where you can:
- View all pending photos
- Approve/reject with one click
- Delete inappropriate photos
- View photo details (who uploaded, when, caption)

## Troubleshooting

### "Unauthorized" Error
- Make sure the guest is logged in with Supabase Auth
- Check that the guest exists in the `guests` table with matching email

### Upload Fails
- Check file size (must be under 5MB)
- Check file type (must be an image)
- Verify storage policies are correctly configured
- Check browser console for detailed error messages

### Photos Don't Appear in Gallery
- Photos must be approved (`is_approved = true`) to appear
- Check the database to confirm the photo was saved
- Verify the public URL is accessible

### Storage Quota Issues
- Supabase free tier: 1GB storage
- Monitor usage in Dashboard > Storage
- Consider upgrading to Pro plan if needed

## Security Considerations

### Current Security Measures

1. **Authentication Required**: Only logged-in guests can upload
2. **RLS Policies**: Database access is restricted by user
3. **File Validation**: Size and type checked server-side
4. **Moderation Queue**: Photos require approval before public display
5. **Guest-Specific Folders**: Photos organized by guest ID

### Additional Security (Optional)

1. **Rate Limiting**: Limit uploads per user per day
2. **Image Scanning**: Use a service to detect inappropriate content
3. **Virus Scanning**: Scan files for malware
4. **Watermarking**: Add subtle watermarks to uploaded photos

## Next Steps

Once guest photo uploads are working:

1. **Test with Real Guests**: Have friends/family test the upload feature
2. **Monitor Storage Usage**: Keep an eye on Supabase storage quota
3. **Set Up Moderation Workflow**: Decide how you'll review photos
4. **Consider Automated Approval**: For trusted guests, you could auto-approve
5. **Add Photo Download**: Let guests download all photos after the wedding

## Support

If you encounter issues:
1. Check Supabase logs in Dashboard
2. Check browser console for errors
3. Review the API route logs
4. Test with curl/Postman to isolate frontend vs backend issues

---

Congratulations! Guest photo uploads are now set up for your wedding website. 📸
