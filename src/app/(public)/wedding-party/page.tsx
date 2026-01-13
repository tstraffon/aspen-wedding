import { Card, CardBody } from '@/components/ui'
import { Heart } from 'lucide-react'

export const metadata = {
  title: 'Wedding Party | Emily & Tyler Wedding',
  description: 'Meet the special people standing by our side on our wedding day',
}

const bridesmaids = [
  {
    name: 'Sarah Johnson',
    role: 'Maid of Honor',
    relationship: 'Sister',
    bio: 'Emily\'s sister and best friend since day one. Sarah has been there through every milestone and adventure.',
    funFact: 'Professional karaoke champion',
  },
  {
    name: 'Rachel Martinez',
    role: 'Bridesmaid',
    relationship: 'College Roommate',
    bio: 'Met Emily freshman year at CU Boulder. They\'ve been inseparable ever since, from dorm room dance parties to mountain adventures.',
    funFact: 'Can hike any 14er in flip-flops',
  },
  {
    name: 'Jessica Chen',
    role: 'Bridesmaid',
    relationship: 'Work Bestie',
    bio: 'Emily\'s partner in crime at the office and beyond. Jessica knows all of Emily\'s best coffee shop secrets.',
    funFact: 'Makes the best homemade sourdough',
  },
  {
    name: 'Amanda Thompson',
    role: 'Bridesmaid',
    relationship: 'Childhood Friend',
    bio: 'Friends since elementary school. Amanda and Emily have decades of inside jokes and shared memories.',
    funFact: 'Once won a hot dog eating contest',
  },
]

const groomsmen = [
  {
    name: 'Michael Straffon',
    role: 'Best Man',
    relationship: 'Brother',
    bio: 'Tyler\'s brother and lifelong adventure buddy. Michael has been Tyler\'s biggest supporter through thick and thin.',
    funFact: 'Can DJ any genre at any moment',
  },
  {
    name: 'Jake Wilson',
    role: 'Groomsman',
    relationship: 'College Friend',
    bio: 'Met Tyler in college and they\'ve been causing mischief together ever since. Jake introduced Tyler to skiing in Aspen.',
    funFact: 'Holds the record for most falls in one ski run',
  },
  {
    name: 'Chris Rodriguez',
    role: 'Groomsman',
    relationship: 'High School Friend',
    bio: 'Tyler\'s friend since high school. Chris and Tyler have shared countless concerts, road trips, and questionable decisions.',
    funFact: 'Has seen over 200 live concerts',
  },
  {
    name: 'David Lee',
    role: 'Groomsman',
    relationship: 'Work Colleague',
    bio: 'Started at the same company as Tyler and they instantly clicked. David is always up for a spontaneous adventure.',
    funFact: 'Can solve a Rubik\'s cube in under a minute',
  },
]

export default function WeddingPartyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-aspen-cream to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-aspen-gold to-aspen-amber py-20 px-4">
        <div className="container-custom text-center">
          <div className="flex justify-center mb-4">
            <Heart className="w-12 h-12 text-white fill-white" />
          </div>
          <h1 className="heading-xl text-white mb-4">
            Our Wedding Party
          </h1>
          <p className="body-text text-white/90 max-w-2xl mx-auto">
            The incredible friends and family who have supported us throughout our journey
          </p>
        </div>
      </div>

      {/* Bridesmaids Section */}
      <div className="container-custom py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="heading-md text-aspen-forest mb-3">
            Bridesmaids
          </h2>
          <p className="body-text text-aspen-stone">
            The amazing women standing with Emily
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {bridesmaids.map((bridesmaid, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300">
              <CardBody className="text-center">
                {/* Photo Placeholder */}
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-aspen-gold to-aspen-copper flex items-center justify-center text-white text-4xl font-serif font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {bridesmaid.name.split(' ').map(n => n[0]).join('')}
                </div>

                {/* Name & Role */}
                <h3 className="font-serif text-xl font-semibold text-aspen-forest mb-1">
                  {bridesmaid.name}
                </h3>
                <div className="inline-block px-3 py-1 bg-aspen-gold/20 text-aspen-copper text-sm font-medium rounded-full mb-3">
                  {bridesmaid.role}
                </div>

                {/* Relationship */}
                <p className="text-sm text-aspen-stone italic mb-3">
                  {bridesmaid.relationship}
                </p>

                {/* Bio */}
                <p className="body-sm text-aspen-stone mb-3 leading-relaxed">
                  {bridesmaid.bio}
                </p>

                {/* Fun Fact */}
                <div className="pt-3 border-t border-aspen-cream">
                  <p className="text-xs font-semibold text-aspen-copper mb-1">
                    Fun Fact:
                  </p>
                  <p className="text-xs text-aspen-stone italic">
                    {bridesmaid.funFact}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Decorative Divider */}
      <div className="py-8">
        <div className="text-center text-4xl">
          💕
        </div>
      </div>

      {/* Groomsmen Section */}
      <div className="bg-aspen-sage/10 py-16 px-4">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-md text-aspen-forest mb-3">
              Groomsmen
            </h2>
            <p className="body-text text-aspen-stone">
              The awesome guys standing with Tyler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {groomsmen.map((groomsman, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300">
                <CardBody className="text-center">
                  {/* Photo Placeholder */}
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-aspen-forest to-aspen-pine flex items-center justify-center text-white text-4xl font-serif font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {groomsman.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  {/* Name & Role */}
                  <h3 className="font-serif text-xl font-semibold text-aspen-forest mb-1">
                    {groomsman.name}
                  </h3>
                  <div className="inline-block px-3 py-1 bg-aspen-forest/20 text-aspen-forest text-sm font-medium rounded-full mb-3">
                    {groomsman.role}
                  </div>

                  {/* Relationship */}
                  <p className="text-sm text-aspen-stone italic mb-3">
                    {groomsman.relationship}
                  </p>

                  {/* Bio */}
                  <p className="body-sm text-aspen-stone mb-3 leading-relaxed">
                    {groomsman.bio}
                  </p>

                  {/* Fun Fact */}
                  <div className="pt-3 border-t border-aspen-cream">
                    <p className="text-xs font-semibold text-aspen-forest mb-1">
                      Fun Fact:
                    </p>
                    <p className="text-xs text-aspen-stone italic">
                      {groomsman.funFact}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Thank You Section */}
      <div className="py-16 px-4">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-md text-aspen-forest mb-6">
              Thank You
            </h2>
            <p className="body-text text-aspen-stone mb-6">
              We are so grateful to have these incredible people by our side as we begin our journey together.
              Each person has played a special role in our lives and our love story.
            </p>
            <p className="body-text text-aspen-stone mb-8">
              We also want to thank our families for their endless love and support.
              This celebration wouldn&apos;t be possible without all of you!
            </p>
            <div className="text-6xl">
              🏔️
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
