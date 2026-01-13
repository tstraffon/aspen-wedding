import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to upload photos' },
        { status: 401 }
      )
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const caption = formData.get('caption') as string
    const location = formData.get('location') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Get guest ID from user email
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('id')
      .eq('email', user.email)
      .single()

    if (guestError || !guest) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const fileName = `${guest.id}/${timestamp}.${fileExt}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('guest-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('guest-photos')
      .getPublicUrl(fileName)

    // Save metadata to database
    const { data: photoData, error: dbError } = await supabase
      .from('guest_photos')
      .insert({
        guest_id: guest.id,
        photo_url: publicUrl,
        caption: caption || null,
        location: location || null,
        is_approved: false, // Requires moderation
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)

      // Clean up uploaded file
      await supabase.storage
        .from('guest-photos')
        .remove([fileName])

      return NextResponse.json(
        { error: 'Failed to save photo metadata' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      photo: photoData,
      message: 'Photo uploaded successfully! It will appear in the gallery after approval.',
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
