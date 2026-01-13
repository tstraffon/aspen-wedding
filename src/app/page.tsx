import Link from 'next/link'
import { Button } from '@/components/ui'
import { getDaysUntilWedding, getWeddingDate } from '@/lib/utils'

export default function HomePage() {
  const daysUntil = getDaysUntilWedding()
  const weddingDate = getWeddingDate()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-aspen-cream via-aspen-gold/10 to-aspen-sage/10">
      <div className="container-custom text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="heading-xl text-transparent bg-clip-text bg-aspen-gradient">
            Tyler & Emily
          </h1>
          <p className="heading-sm text-aspen-copper">
            {weddingDate}
          </p>
          <p className="body-text text-aspen-forest font-medium">
            Aspen, Colorado
          </p>
        </div>

        {/* Countdown */}
        <div className="inline-block bg-white rounded-2xl shadow-xl p-8 animate-scale-in">
          <p className="text-sm text-aspen-stone uppercase tracking-wider mb-2">
            Counting down
          </p>
          <div className="heading-lg text-aspen-amber">
            {daysUntil}
          </div>
          <p className="text-sm text-aspen-stone uppercase tracking-wider mt-2">
            days until we say "I do"
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-wrap gap-4 justify-center items-center animate-slide-up">
          <Link href="/login">
            <Button variant="primary" size="lg">
              Login & RSVP
            </Button>
          </Link>
          <Link href="/our-story">
            <Button variant="outline" size="lg">
              Our Story
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="pt-8 flex flex-wrap gap-6 justify-center text-sm">
          <Link 
            href="/details" 
            className="text-aspen-forest hover:text-aspen-copper transition-colors"
          >
            Event Details
          </Link>
          <Link 
            href="/travel" 
            className="text-aspen-forest hover:text-aspen-copper transition-colors"
          >
            Travel & Stay
          </Link>
          <Link 
            href="/gallery" 
            className="text-aspen-forest hover:text-aspen-copper transition-colors"
          >
            Photo Gallery
          </Link>
          <Link 
            href="/registry" 
            className="text-aspen-forest hover:text-aspen-copper transition-colors"
          >
            Registry
          </Link>
        </div>

        {/* Mountain Decoration */}
        <div className="pt-12 text-6xl text-aspen-sage/30">
          🏔️
        </div>
      </div>
    </main>
  )
}
