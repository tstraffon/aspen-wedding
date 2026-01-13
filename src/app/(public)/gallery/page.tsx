'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui'
import { Camera, X, Heart, Laugh, Sparkles, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhotoUpload } from '@/components/gallery/PhotoUpload'
import { createClient } from '@/lib/supabase/client'
import type { GuestPhoto } from '@/types/database'

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [guestPhotos, setGuestPhotos] = useState<GuestPhoto[]>([])
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true)

  // Fetch guest photos
  useEffect(() => {
    fetchGuestPhotos()
  }, [])

  const fetchGuestPhotos = async () => {
    setIsLoadingPhotos(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('guest_photos')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setGuestPhotos(data)
    }

    setIsLoadingPhotos(false)
  }

  const categories = [
    { id: 'all', label: 'All Photos', icon: '📸' },
    { id: 'engagement', label: 'Engagement', icon: '💍' },
    { id: 'adventures', label: 'Adventures', icon: '🏔️' },
    { id: 'us', label: 'Just Us', icon: '💕' },
    { id: 'family', label: 'Family & Friends', icon: '👨‍👩‍👧‍👦' },
    { id: 'guest', label: 'Guest Photos', icon: '📷' },
  ]

  const photos = [
    {
      id: 1,
      category: 'engagement',
      title: 'The Proposal',
      location: 'Maroon Bells, Colorado',
      date: 'October 2024',
      caption: 'When Tyler got down on one knee with the most beautiful backdrop',
      aspectRatio: 'tall',
      color: 'from-aspen-gold to-aspen-amber',
    },
    {
      id: 2,
      category: 'us',
      title: 'Our First Date',
      location: 'Downtown Denver',
      date: 'March 2022',
      caption: 'Coffee turned into dinner, and the rest is history',
      aspectRatio: 'wide',
      color: 'from-aspen-sage to-aspen-forest',
    },
    {
      id: 3,
      category: 'adventures',
      title: 'Hiking in Aspen',
      location: 'Aspen, Colorado',
      date: 'Summer 2023',
      caption: 'Where we fell in love with the mountains',
      aspectRatio: 'square',
      color: 'from-aspen-copper to-aspen-rust',
    },
    {
      id: 4,
      category: 'us',
      title: 'Cozy at Home',
      location: 'Our Apartment',
      date: 'Winter 2023',
      caption: 'Movie nights and homemade pizza',
      aspectRatio: 'square',
      color: 'from-aspen-burgundy to-aspen-rust',
    },
    {
      id: 5,
      category: 'adventures',
      title: 'Road Trip',
      location: 'Pacific Coast Highway',
      date: 'August 2023',
      caption: 'Our epic California coast adventure',
      aspectRatio: 'wide',
      color: 'from-aspen-gold to-aspen-copper',
    },
    {
      id: 6,
      category: 'family',
      title: 'Family Gathering',
      location: 'Thanksgiving',
      date: 'November 2023',
      caption: 'Our families meeting for the first time',
      aspectRatio: 'tall',
      color: 'from-aspen-forest to-aspen-pine',
    },
    {
      id: 7,
      category: 'adventures',
      title: 'Skiing in Aspen',
      location: 'Aspen Mountain',
      date: 'January 2024',
      caption: 'Tyler teaching Emily to ski (lots of laughs)',
      aspectRatio: 'square',
      color: 'from-aspen-sage to-aspen-gold',
    },
    {
      id: 8,
      category: 'us',
      title: 'Sunset at the Lake',
      location: 'Lake Dillon',
      date: 'June 2023',
      caption: 'Where Tyler said "I love you" for the first time',
      aspectRatio: 'wide',
      color: 'from-aspen-amber to-aspen-burgundy',
    },
    {
      id: 9,
      category: 'family',
      title: 'Meeting the Parents',
      location: 'Denver',
      date: 'May 2022',
      caption: 'A nervous but perfect first impression',
      aspectRatio: 'square',
      color: 'from-aspen-copper to-aspen-forest',
    },
    {
      id: 10,
      category: 'adventures',
      title: 'Concert Night',
      location: 'Red Rocks Amphitheatre',
      date: 'July 2023',
      caption: 'Dancing under the stars at our favorite venue',
      aspectRatio: 'tall',
      color: 'from-aspen-rust to-aspen-burgundy',
    },
    {
      id: 11,
      category: 'us',
      title: 'Morning Coffee',
      location: 'Our Kitchen',
      date: 'Every Day',
      caption: 'Our favorite daily ritual',
      aspectRatio: 'square',
      color: 'from-aspen-amber to-aspen-copper',
    },
    {
      id: 12,
      category: 'engagement',
      title: 'Ring Shopping',
      location: 'Denver',
      date: 'September 2024',
      caption: 'Emily thought we were "just looking"',
      aspectRatio: 'wide',
      color: 'from-aspen-gold to-aspen-rust',
    },
  ]

  const filteredPhotos = selectedCategory === 'guest'
    ? []
    : selectedCategory === 'all'
    ? photos
    : photos.filter(photo => photo.category === selectedCategory)

  const getAspectRatioClass = (aspectRatio: string) => {
    switch (aspectRatio) {
      case 'tall':
        return 'md:row-span-2'
      case 'wide':
        return 'md:col-span-2'
      case 'square':
      default:
        return ''
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-aspen-cream to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-aspen-copper to-aspen-gold py-20 px-4">
        <div className="container-custom text-center">
          <div className="flex justify-center mb-4">
            <Camera className="w-12 h-12 text-white" />
          </div>
          <h1 className="heading-xl text-white mb-4">
            Our Gallery
          </h1>
          <p className="body-text text-white/90 max-w-2xl mx-auto">
            A collection of our favorite moments together
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-gradient-to-b from-aspen-sage/10 to-white py-12 px-4">
        <div className="container-custom text-center">
          <Users className="w-12 h-12 text-aspen-copper mx-auto mb-4" />
          <h2 className="heading-md text-aspen-forest mb-3">
            Share Your Memories
          </h2>
          <p className="body-text text-aspen-stone max-w-2xl mx-auto mb-6">
            Have a favorite photo with Emily & Tyler? Share it with us and it will appear in the gallery!
          </p>
          <PhotoUpload onUploadSuccess={fetchGuestPhotos} />
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-[72px] z-40 bg-white shadow-md py-4 px-4">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'px-5 py-2.5 rounded-full font-sans text-sm font-medium transition-all duration-300',
                  selectedCategory === category.id
                    ? 'bg-aspen-copper text-white shadow-lg scale-105'
                    : 'bg-aspen-cream text-aspen-forest hover:bg-aspen-gold/30'
                )}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container-custom py-16 px-4">
        {selectedCategory === 'guest' ? (
          // Guest Photos Grid
          <div>
            <div className="text-center mb-8">
              <h2 className="heading-md text-aspen-forest mb-2">
                Guest Memories
              </h2>
              <p className="body-text text-aspen-stone">
                Photos shared by our wonderful guests
              </p>
            </div>

            {isLoadingPhotos ? (
              <div className="text-center py-16">
                <Camera className="w-16 h-16 text-aspen-stone/30 mx-auto mb-4 animate-pulse" />
                <p className="body-text text-aspen-stone">Loading photos...</p>
              </div>
            ) : guestPhotos.length === 0 ? (
              <div className="text-center py-16">
                <Camera className="w-16 h-16 text-aspen-stone/30 mx-auto mb-4" />
                <p className="body-text text-aspen-stone mb-4">
                  No guest photos yet
                </p>
                <p className="body-sm text-aspen-stone">
                  Be the first to share your favorite memory!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {guestPhotos.map((photo) => (
                  <Card
                    key={photo.id}
                    className="group relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={photo.photo_url}
                        alt={photo.caption || 'Guest photo'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      />

                      {/* Hover Overlay */}
                      {photo.caption && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                          <p className="text-white text-sm line-clamp-3">
                            {photo.caption}
                          </p>
                          {photo.location && (
                            <p className="text-white/70 text-xs mt-1">
                              {photo.location}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Our Photos Grid
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px]">
            {filteredPhotos.map((photo) => (
            <Card
              key={photo.id}
              className={cn(
                'group relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl',
                getAspectRatioClass(photo.aspectRatio)
              )}
              onClick={() => setSelectedImage(photo.id)}
            >
              {/* Photo Placeholder with Gradient */}
              <div className={cn(
                'absolute inset-0 bg-gradient-to-br',
                photo.color,
                'flex items-center justify-center'
              )}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />

                {/* Photo Icon */}
                <div className="relative z-10 text-white/40 group-hover:text-white/60 transition-all duration-300">
                  <Camera className="w-16 h-16" />
                </div>

                {/* Hover Overlay with Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                  <h3 className="font-serif text-white text-lg font-semibold mb-1">
                    {photo.title}
                  </h3>
                  <p className="text-white/80 text-sm mb-1">
                    {photo.location}
                  </p>
                  <p className="text-white/60 text-xs">
                    {photo.date}
                  </p>
                </div>
              </div>
            </Card>
          ))}
          </div>
        )}

        {/* Empty State */}
        {selectedCategory !== 'guest' && filteredPhotos.length === 0 && (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 text-aspen-stone/30 mx-auto mb-4" />
            <p className="body-text text-aspen-stone">
              No photos in this category yet
            </p>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-aspen-gold transition-colors p-2"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const photo = photos.find(p => p.id === selectedImage)
              if (!photo) return null

              return (
                <>
                  {/* Photo */}
                  <div className={cn(
                    'h-96 bg-gradient-to-br',
                    photo.color,
                    'flex items-center justify-center relative'
                  )}>
                    <div className="absolute inset-0 bg-black/10" />
                    <Camera className="w-24 h-24 text-white/30" />
                  </div>

                  {/* Info */}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="heading-sm text-aspen-forest mb-2">
                          {photo.title}
                        </h2>
                        <p className="text-aspen-copper font-medium mb-1">
                          {photo.location}
                        </p>
                        <p className="text-aspen-stone text-sm">
                          {photo.date}
                        </p>
                      </div>
                    </div>

                    <p className="body-text text-aspen-stone italic mb-6">
                      &quot;{photo.caption}&quot;
                    </p>

                    {/* Reaction Buttons (placeholder) */}
                    <div className="flex gap-3 pt-4 border-t border-aspen-cream">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-aspen-gold/20 text-aspen-copper hover:bg-aspen-gold/30 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-medium">Love</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-aspen-sage/20 text-aspen-forest hover:bg-aspen-sage/30 transition-colors">
                        <Laugh className="w-4 h-4" />
                        <span className="text-sm font-medium">Laugh</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-aspen-copper/20 text-aspen-rust hover:bg-aspen-copper/30 transition-colors">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Wow</span>
                      </button>
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Coming Soon Section */}
      <div className="bg-aspen-sage/10 py-16 px-4">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-md text-aspen-forest mb-4">
              More Photos Coming Soon!
            </h2>
            <p className="body-text text-aspen-stone mb-6">
              We&apos;re still adding more photos from our adventures together. Check back soon for updates!
            </p>
            <p className="body-sm text-aspen-stone">
              After the wedding, we&apos;ll share all the professional photos from our special day here.
            </p>
          </div>
        </div>
      </div>

      {/* Mountain Footer */}
      <div className="py-12 text-center">
        <p className="text-6xl mb-4">📸</p>
        <p className="body-sm text-aspen-stone">
          Creating memories together
        </p>
      </div>
    </main>
  )
}
