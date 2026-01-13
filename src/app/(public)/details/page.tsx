import { Card, CardBody } from '@/components/ui'
import { Calendar, MapPin, Clock, Shirt } from 'lucide-react'

export const metadata = {
  title: 'Event Details | Tyler & Emily Wedding',
  description: 'Details for our wedding weekend events in Aspen, Colorado',
}

const events = [
  {
    name: 'Rehearsal Dinner',
    date: 'Thursday, September 18, 2026',
    time: '6:00 PM - 9:00 PM',
    location: 'The Wild Fig',
    address: '315 E Hyman Ave, Aspen, CO 81611',
    attire: 'Smart Casual',
    description: 'Join us for an intimate dinner with the wedding party and close family.',
    inviteOnly: true,
  },
  {
    name: 'Wedding Ceremony',
    date: 'Friday, September 19, 2026',
    time: '4:00 PM',
    location: 'Aspen Mountain Summit',
    address: 'Silver Queen Gondola, Aspen, CO 81611',
    attire: 'Formal / Black Tie Optional',
    description: 'We will exchange vows at the summit of Aspen Mountain with breathtaking views of the Rocky Mountains. Guests will take the gondola up together starting at 3:00 PM.',
    inviteOnly: false,
  },
  {
    name: 'Reception',
    date: 'Friday, September 19, 2026',
    time: '6:00 PM - 11:00 PM',
    location: 'The Little Nell Grand Ballroom',
    address: '675 E Durant Ave, Aspen, CO 81611',
    attire: 'Formal / Black Tie Optional',
    description: 'Celebrate with us for dinner, dancing, and DJ-spun beats into the night!',
    inviteOnly: false,
  },
  {
    name: 'Farewell Brunch',
    date: 'Saturday, September 20, 2026',
    time: '10:00 AM - 12:00 PM',
    location: 'Hotel Jerome Garden',
    address: '330 E Main St, Aspen, CO 81611',
    attire: 'Casual Mountain Chic',
    description: 'Say goodbye over brunch before heading home or exploring more of Aspen.',
    inviteOnly: false,
  },
]

export default function DetailsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-aspen-cream to-white">
      {/* Hero Section */}
      <div className="bg-aspen-gradient py-20 px-4">
        <div className="container-custom text-center">
          <h1 className="heading-xl text-white mb-4">
            Event Details
          </h1>
          <p className="body-text text-white/90 max-w-2xl mx-auto">
            Join us for a weekend of celebration in the beautiful Rocky Mountains
          </p>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="container-custom py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {events.map((event, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="flex">
                {/* Event Number Badge */}
                <div className="bg-aspen-gradient w-24 flex-shrink-0 flex items-center justify-center">
                  <div className="text-white">
                    <div className="text-4xl font-bold">{index + 1}</div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex-1 p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="heading-md text-aspen-forest mb-1">
                        {event.name}
                      </h2>
                      {event.inviteOnly && (
                        <span className="inline-block px-3 py-1 bg-aspen-amber/20 text-aspen-copper text-xs font-medium rounded-full">
                          By Invitation Only
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="body-text text-aspen-stone mb-6">
                    {event.description}
                  </p>

                  {/* Event Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date */}
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-aspen-copper flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-aspen-forest">
                          Date
                        </div>
                        <div className="body-sm text-aspen-stone">
                          {event.date}
                        </div>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-aspen-copper flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-aspen-forest">
                          Time
                        </div>
                        <div className="body-sm text-aspen-stone">
                          {event.time}
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-aspen-copper flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-aspen-forest">
                          Location
                        </div>
                        <div className="body-sm text-aspen-stone">
                          {event.location}
                        </div>
                        <div className="body-sm text-aspen-stone/70">
                          {event.address}
                        </div>
                      </div>
                    </div>

                    {/* Attire */}
                    <div className="flex items-start gap-3">
                      <Shirt className="w-5 h-5 text-aspen-copper flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-aspen-forest">
                          Attire
                        </div>
                        <div className="body-sm text-aspen-stone">
                          {event.attire}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-aspen-sage/10 py-16 px-4">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-md text-aspen-forest mb-6 text-center">
              Important Information
            </h2>

            <div className="space-y-4">
              <Card>
                <CardBody>
                  <h3 className="font-semibold text-aspen-forest mb-2">
                    Mountain Weather
                  </h3>
                  <p className="body-sm text-aspen-stone">
                    September in Aspen can be unpredictable. Daytime temperatures range from 50-70°F,
                    but it can drop to 30-40°F at night. Bring layers, and consider a warm jacket for
                    the mountain ceremony!
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h3 className="font-semibold text-aspen-forest mb-2">
                    Altitude
                  </h3>
                  <p className="body-sm text-aspen-stone">
                    Aspen sits at 8,000 feet elevation, and the ceremony location is at 11,212 feet.
                    Give yourself time to acclimate, stay hydrated, and take it easy on the alcohol
                    for the first day.
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h3 className="font-semibold text-aspen-forest mb-2">
                    Transportation
                  </h3>
                  <p className="body-sm text-aspen-stone">
                    Shuttle service will be provided between major hotels and all event venues.
                    Detailed shuttle schedules will be sent to your email one week before the wedding.
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h3 className="font-semibold text-aspen-forest mb-2">
                    Photography
                  </h3>
                  <p className="body-sm text-aspen-stone">
                    We kindly request an unplugged ceremony - please keep phones and cameras away
                    during the ceremony so we can all be present in the moment. Feel free to snap
                    away during the reception!
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mountain Footer */}
      <div className="py-12 text-center">
        <p className="text-6xl mb-4">🏔️</p>
        <p className="body-sm text-aspen-stone">
          Can&apos;t wait to celebrate with you!
        </p>
      </div>
    </main>
  )
}
