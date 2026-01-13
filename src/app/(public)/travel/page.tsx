import { Card, CardBody } from '@/components/ui'
import { Plane, Car, MapPin, Hotel, Utensils, Mountain, Coffee } from 'lucide-react'

export const metadata = {
  title: 'Travel & Stay | Tyler & Emily Wedding',
  description: 'Travel information and accommodation recommendations for our wedding in Aspen, Colorado',
}

const hotels = [
  {
    name: 'The Little Nell',
    description: 'Luxury five-star hotel at the base of Aspen Mountain. Walking distance to everything!',
    distance: '0.1 miles from ceremony',
    price: '$$$$ - Luxury',
    amenities: ['Ski-in/ski-out', 'Spa', 'Fine dining', 'Concierge'],
    phone: '(970) 920-4600',
    website: 'thelittlenell.com',
    note: 'Wedding venue & reception location',
  },
  {
    name: 'Hotel Jerome',
    description: 'Historic luxury hotel in downtown Aspen with Victorian charm and modern amenities.',
    distance: '0.3 miles from downtown',
    price: '$$$$ - Luxury',
    amenities: ['Spa', 'Restaurant', 'Bar', 'Pool'],
    phone: '(970) 920-1000',
    website: 'hoteljerome.com',
    note: 'Brunch venue',
  },
  {
    name: 'The Limelight Hotel',
    description: 'Modern boutique hotel with a laid-back vibe and excellent location.',
    distance: 'Downtown Aspen',
    price: '$$$ - Upscale',
    amenities: ['Pool', 'Hot tubs', 'Complimentary breakfast', 'Bike rentals'],
    phone: '(970) 925-3025',
    website: 'limelighthotels.com',
    note: 'Great value for location',
  },
  {
    name: 'The St. Regis Aspen Resort',
    description: 'Elegant resort with mountain views and world-class service.',
    distance: '0.2 miles from downtown',
    price: '$$$$ - Luxury',
    amenities: ['Spa', 'Pool', 'Fine dining', 'Ski concierge'],
    phone: '(970) 920-3300',
    website: 'stregisaspen.com',
    note: '',
  },
  {
    name: 'Aspen Meadows Resort',
    description: 'Peaceful resort with studio suites, perfect for families and longer stays.',
    distance: '1.5 miles from downtown',
    price: '$$ - Moderate',
    amenities: ['Kitchenettes', 'Pool', 'Tennis', 'Free shuttle'],
    phone: '(970) 925-4240',
    website: 'aspenmeadows.com',
    note: 'Family-friendly option',
  },
  {
    name: 'Limelight Hotel Snowmass',
    description: 'Sister property in Snowmass Village, 15 minutes from Aspen.',
    distance: '10 miles from Aspen',
    price: '$$ - Moderate',
    amenities: ['Pool', 'Hot tubs', 'Restaurant', 'Ski access'],
    phone: '(970) 923-8900',
    website: 'limelighthotels.com/snowmass',
    note: 'More affordable option',
  },
]

const restaurants = [
  {
    name: 'Matsuhisa',
    cuisine: 'Japanese',
    vibe: 'Upscale',
    icon: '🍣',
  },
  {
    name: 'Element 47',
    cuisine: 'American Fine Dining',
    vibe: 'Romantic',
    icon: '🥩',
  },
  {
    name: 'Casa Tua',
    cuisine: 'Italian',
    vibe: 'Elegant',
    icon: '🍝',
  },
  {
    name: 'White House Tavern',
    cuisine: 'American Comfort',
    vibe: 'Casual',
    icon: '🍔',
  },
  {
    name: 'Ajax Tavern',
    cuisine: 'Contemporary American',
    vibe: 'Lively',
    icon: '🍷',
  },
  {
    name: 'Meat & Cheese',
    cuisine: 'Farm to Table',
    vibe: 'Rustic',
    icon: '🧀',
  },
]

const activities = [
  {
    name: 'Maroon Bells Scenic Area',
    description: 'The most photographed peaks in North America. Take the shuttle for stunning fall colors.',
    category: 'Nature',
    icon: '🏔️',
  },
  {
    name: 'Silver Queen Gondola',
    description: 'Ride to the top of Aspen Mountain for panoramic views and hiking trails.',
    category: 'Scenic',
    icon: '🚡',
  },
  {
    name: 'Downtown Aspen Shopping',
    description: 'Browse boutiques, galleries, and outdoor gear shops along historic streets.',
    category: 'Shopping',
    icon: '🛍️',
  },
  {
    name: 'Ashcroft Ghost Town',
    description: 'Explore this preserved mining town from the 1880s silver boom.',
    category: 'History',
    icon: '🏚️',
  },
  {
    name: 'Independence Pass',
    description: 'Scenic mountain drive with incredible views (open seasonally).',
    category: 'Scenic Drive',
    icon: '🚗',
  },
  {
    name: 'Aspen Art Museum',
    description: 'Free admission contemporary art museum with rooftop café.',
    category: 'Culture',
    icon: '🎨',
  },
]

export default function TravelPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-aspen-cream to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-aspen-forest to-aspen-pine py-20 px-4">
        <div className="container-custom text-center">
          <h1 className="heading-xl text-white mb-4">
            Travel & Stay
          </h1>
          <p className="body-text text-white/90 max-w-2xl mx-auto">
            Everything you need to know about getting to Aspen and making the most of your stay
          </p>
        </div>
      </div>

      {/* Getting to Aspen */}
      <div className="container-custom py-16 px-4">
        <h2 className="heading-md text-aspen-forest mb-8 text-center">
          Getting to Aspen
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          <Card>
            <CardBody>
              <div className="flex items-start gap-4">
                <div className="bg-aspen-gold/20 p-3 rounded-lg">
                  <Plane className="w-8 h-8 text-aspen-copper" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-aspen-forest mb-3 text-lg">
                    By Air
                  </h3>
                  <div className="space-y-2 body-sm text-aspen-stone">
                    <p>
                      <strong>Aspen/Pitkin County Airport (ASE)</strong> - 6 miles from downtown
                    </p>
                    <p>Direct flights from major cities. Book early for best rates!</p>
                    <p className="pt-2">
                      <strong>Alternative: Denver International (DEN)</strong> - 200 miles away
                    </p>
                    <p>Larger airport with more flight options. Scenic 3.5-4 hour drive or shuttle service available.</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start gap-4">
                <div className="bg-aspen-sage/20 p-3 rounded-lg">
                  <Car className="w-8 h-8 text-aspen-forest" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-aspen-forest mb-3 text-lg">
                    By Car
                  </h3>
                  <div className="space-y-2 body-sm text-aspen-stone">
                    <p>
                      <strong>From Denver:</strong> 3.5-4 hours via I-70 W and CO-82
                    </p>
                    <p>
                      <strong>From Grand Junction:</strong> 2.5 hours via CO-82
                    </p>
                    <p className="pt-2">
                      Car rentals available at airports. Note: Some roads may be closed or require chains in September if there&apos;s early snow.
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Getting Around */}
        <div className="max-w-3xl mx-auto mb-16">
          <Card className="bg-aspen-amber/10">
            <CardBody>
              <h3 className="font-semibold text-aspen-forest mb-3 text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-aspen-copper" />
                Getting Around Aspen
              </h3>
              <div className="space-y-2 body-sm text-aspen-stone">
                <p>
                  <strong>Free RFTA Buses:</strong> Excellent public transportation throughout Aspen and surrounding areas.
                </p>
                <p>
                  <strong>Wedding Shuttles:</strong> We&apos;ll provide shuttle service between major hotels and all event venues.
                </p>
                <p>
                  <strong>Walking:</strong> Downtown Aspen is very walkable! Most hotels are within 10-15 minutes of everything.
                </p>
                <p>
                  <strong>Rideshare:</strong> Uber and Lyft are available, though may be limited during peak times.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Hotels */}
      <div className="bg-aspen-cream/50 py-16 px-4">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-md text-aspen-forest mb-4">
              Where to Stay
            </h2>
            <p className="body-text text-aspen-stone max-w-2xl mx-auto">
              We&apos;ve selected a range of hotels to fit every budget. Book early as Aspen fills up quickly!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {hotels.map((hotel, index) => (
              <Card key={index} className="flex flex-col h-full">
                <CardBody className="flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-aspen-forest text-lg flex-1">
                      {hotel.name}
                    </h3>
                    <Hotel className="w-5 h-5 text-aspen-copper flex-shrink-0 ml-2" />
                  </div>

                  {hotel.note && (
                    <div className="inline-block px-3 py-1 bg-aspen-gold/20 text-aspen-copper text-xs font-medium rounded-full mb-3 w-fit">
                      {hotel.note}
                    </div>
                  )}

                  <p className="body-sm text-aspen-stone mb-3">
                    {hotel.description}
                  </p>

                  <div className="space-y-2 mb-4 body-sm">
                    <p className="text-aspen-forest">
                      <span className="font-medium">Distance:</span> {hotel.distance}
                    </p>
                    <p className="text-aspen-forest">
                      <span className="font-medium">Price:</span> {hotel.price}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="font-medium text-aspen-forest text-sm mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.map((amenity, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-aspen-sage/20 text-aspen-forest text-xs rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-aspen-cream space-y-1 body-sm">
                    <p className="text-aspen-stone">
                      <span className="font-medium">Phone:</span> {hotel.phone}
                    </p>
                    <p className="text-aspen-copper hover:underline">
                      <a href={`https://${hotel.website}`} target="_blank" rel="noopener noreferrer">
                        {hotel.website}
                      </a>
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Dining */}
      <div className="py-16 px-4">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-md text-aspen-forest mb-4">
              Where to Eat
            </h2>
            <p className="body-text text-aspen-stone max-w-2xl mx-auto">
              Aspen has incredible dining options. Here are some of our favorites!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {restaurants.map((restaurant, index) => (
              <Card key={index}>
                <CardBody>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{restaurant.icon}</div>
                    <div>
                      <h3 className="font-semibold text-aspen-forest">
                        {restaurant.name}
                      </h3>
                      <p className="body-sm text-aspen-stone">
                        {restaurant.cuisine}
                      </p>
                      <p className="text-xs text-aspen-copper font-medium">
                        {restaurant.vibe}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Things to Do */}
      <div className="bg-gradient-to-b from-aspen-sage/10 to-white py-16 px-4">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-md text-aspen-forest mb-4">
              Things to Do
            </h2>
            <p className="body-text text-aspen-stone max-w-2xl mx-auto">
              Make a weekend of it! Aspen has so much to offer beyond the wedding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {activities.map((activity, index) => (
              <Card key={index}>
                <CardBody>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">{activity.icon}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-aspen-forest">
                          {activity.name}
                        </h3>
                      </div>
                      <p className="text-xs text-aspen-copper font-medium mb-2">
                        {activity.category}
                      </p>
                      <p className="body-sm text-aspen-stone">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pro Tips */}
      <div className="py-16 px-4">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-md text-aspen-forest mb-8 text-center">
              Pro Tips for Visiting Aspen
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardBody>
                  <div className="flex items-start gap-3">
                    <Mountain className="w-6 h-6 text-aspen-copper flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-aspen-forest mb-2">
                        Prepare for Altitude
                      </h3>
                      <p className="body-sm text-aspen-stone">
                        Aspen is at 8,000 feet. Drink lots of water, take it easy the first day, and limit alcohol until you acclimate.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <div className="flex items-start gap-3">
                    <Coffee className="w-6 h-6 text-aspen-copper flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-aspen-forest mb-2">
                        Book Restaurants Early
                      </h3>
                      <p className="body-sm text-aspen-stone">
                        Popular restaurants fill up quickly. Make reservations as soon as you book your hotel.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <div className="flex items-start gap-3">
                    <Utensils className="w-6 h-6 text-aspen-copper flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-aspen-forest mb-2">
                        Pack Layers
                      </h3>
                      <p className="body-sm text-aspen-stone">
                        September weather can range from 70°F days to 30°F nights. Bring warm layers, a jacket, and comfortable walking shoes.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-aspen-copper flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-aspen-forest mb-2">
                        Arrive Early
                      </h3>
                      <p className="body-sm text-aspen-stone">
                        Consider arriving a day or two early to adjust to the altitude and explore the area before the wedding festivities.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-aspen-stone/10 py-16 px-4">
        <div className="container-custom">
          <h2 className="heading-md text-aspen-forest mb-8 text-center">
            Interactive Map
          </h2>
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex flex-col items-center justify-center h-64 bg-aspen-cream/50 rounded-lg">
              <MapPin className="w-16 h-16 text-aspen-copper mb-4" />
              <p className="body-text text-aspen-stone">
                Interactive Mapbox map coming soon!
              </p>
              <p className="body-sm text-aspen-stone/70 mt-2">
                View hotels, restaurants, activities, and event venues
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mountain Footer */}
      <div className="py-12 text-center">
        <p className="text-6xl mb-4">🏔️</p>
        <p className="body-sm text-aspen-stone">
          See you in the mountains!
        </p>
      </div>
    </main>
  )
}
