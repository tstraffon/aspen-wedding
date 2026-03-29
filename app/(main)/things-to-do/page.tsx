import Link from "next/link";

const activities = [
  {
    title: "Hike The Maroon Bells",
    description:
      "Witness the most photographed peaks in North America. We recommend the Scenic Loop trail for stunning alpine reflections.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC-e3F8GEmzgR-G5Gc-vp2iUhgKaffv0tIlOuaXlgxwhbwi7R3XUN9YOg1NHp-vCtIFsSq5nfA3pQsjx690JubuFycS3gPLt7hWzI7PpNK1c1DqCMPbD3T6PpkHL8bwvjNZZo09igMyL2GgkpDOAAEkZ0DQiXEhG2Y0z8wxIl9sRJexkNkOZXDSYZwH8pEvQ9ooasIFJVCn0ZnoH4-r-dGVHuyN9bZwZkm8XhI_wy20bTwu1ocVIVYEuepWHX56mWF90g4_9qOgFBk",
    alt: "Hiking Maroon Bells",
    link: "https://www.aspensnowmass.com/discover/experiences/guides/maroon-bells-101-all-you-need-to-know",
  },
  {
    title: "Aspen Art Museum",
    description:
      "Explore contemporary exhibitions in a stunning Shigeru Ban-designed building, complete with a rooftop café offering valley views.",
    image:
      "https://aspenartmuseum.org/wp-content/uploads/2024/10/CPURb2TiTxmexlgUmyFh-1920x1280.jpg",
    alt: "Aspen Art Museum",
    link: "https://www.aspenartmuseum.org",
  },
  {
    title: "Downtown Stroll",
    description:
      "Spend an afternoon exploring the high-end boutiques or taking a tour of the historic architecture of downtown Aspen, just steps from Hotel Jerome.",
    image:
      "https://www.aspensnowmass.com/-/media/aspen-snowmass/images/hero/guidehero/summer/2025/roadtrip_hero_2425.png",
    alt: "Shopping on Main St",
    link: "https://www.aspenchamber.org/explore/shopping",
  },
  {
    title: "Picnic In Herron Park",
    description:
      "Grab a sammie from our favorite local hole in the wall (Grateful Deli! 🤤) and picnic along the Roaring Fork river.",
    image:
      "https://tense-deer.transforms.svdcdn.com/production/galleries/2023_PARKS_Web_HerronPark_Aug-2023-15.jpg?w=576&h=432&q=60&fm=jpg&fit=crop&dm=1734063376&s=6037b601623cf20bd163e29b01497f45",
    alt: "Horseback Riding",
    link: "https://www.earthscapeplay.com/projects/herron-park-playground-sculpture-aspen-colorado/",
  },
  {
    title: "The John Denver Sanctuary",
    description:
      "Created in memory of legendary singer John Denver, this serene sanctuary sits beside Rio Grande Park, offering a peaceful and contemplative escape.",
    image:
      "https://johndenversanctuary.com/wp-content/uploads/2023/04/John_Denver_Sanctuary-scaled.jpg",
    alt: "The John Denver Sanctuary",
    link: "https://johndenversanctuary.com/",
  },
  {
    title: "Gondola Summit",
    description:
      "Ride the Silver Queen Gondola to the top of Aspen Mountain for panoramic views, hiking trails, and the Sundeck restaurant.",
    image:
      "https://www.uncovercolorado.com/wp-content/uploads/2021/09/aspen-snowmass-silver-queen-gondola-colorado-summer.jpeg",
    alt: "Silver Queen Gondola",
    link: "https://www.aspensnowmass.com/visit/tickets-and-passes/sightseeing-and-tickets/summer",
  },
];

export default function ThingsToDoPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[614px] w-full overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
 <div
            className="w-full h-full bg-cover bg-center hero-parallax-bg"
            style={{ backgroundImage: "url('/foliage-from-above.jpeg')" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(13,27,30,0.05), rgba(13,27,30,0.3))",
            }}
          />
        </div>
        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-20">
          <div className="max-w-4xl">
            <p className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 hero-reveal-label">
              Explore the Area
            </p>
            <h1 className="font-headline text-5xl md:text-8xl text-on-surface leading-[0.85] tracking-tighter mb-6 hero-reveal-title">
              Things{" "}
              <span className="italic font-light text-primary/80">To Do</span>
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl font-light leading-relaxed hero-reveal-subtitle">
              From curated outdoor adventures to our favorite restaurants, here&apos;s everything you need to make the most of your mountain getaway.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile jump-links */}
      <nav className="sticky top-20 z-30 bg-background/95 backdrop-blur-sm border-b border-outline/10 md:hidden">
        <div className="flex">
          <a href="#activities" className="flex-1 py-4 text-center font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors">
            Activities
          </a>
          <a href="#restaurants" className="flex-1 py-4 text-center font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors">
            Restaurants
          </a>
        </div>
      </nav>

      {/* Activity Grid Section */}
      <section id="activities" className="py-16 bg-background relative overflow-hidden scroll-mt-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
          <div className="mb-12 md:mb-24 reveal-on-scroll">
            <span className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 block">
              Curated Experiences
            </span>
            <h2 className="font-headline text-4xl md:text-6xl text-on-surface">
              Discover Aspen
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 md:gap-y-24 reveal-on-scroll-stagger">
            {activities.map((activity) => (
              <a key={activity.title} href={activity.link} target="_blank" rel="noopener noreferrer" className="group cursor-pointer block">
                <div className="aspect-[4/5] bg-surface-variant/50 mb-8 overflow-hidden relative">
                  <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={activity.alt}
                    className="w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-110"
                    src={activity.image}
                  />
                </div>
                <h3 className="font-headline text-2xl text-on-surface mb-3 group-hover:text-primary transition-colors">
                  {activity.title}
                </h3>
                <p className="text-on-surface-variant text-base leading-relaxed mb-6 font-light">
                  {activity.description}
                </p>
                <span className="font-headline italic text-primary text-sm editorial-underline inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn More
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant Recommendations */}
      <section id="restaurants" className="py-32 bg-surface border-y border-outline/10 relative overflow-hidden scroll-mt-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,163,115,0.04)_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
          <div className="mb-20 reveal-on-scroll">
            <span className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 block">
              Where To Eat
            </span>
            <h2 className="font-headline text-4xl md:text-6xl text-on-surface">
              Our Favorite{" "}
              <span className="italic font-light text-primary/80">Spots</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 reveal-on-scroll-stagger">
            {/* Casual American */}
            <div>
              <div className="group relative overflow-hidden aspect-[16/9] mb-8 cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80"
                  alt="Casual dining atmosphere"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 via-background/50 to-transparent">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">local_bar</span>
                    <span className="font-headline text-2xl text-on-surface">Casual <span className="italic text-primary">American</span></span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <a href="https://aspenwhitehouse.com/" target="_blank" rel="noopener noreferrer" className="font-headline text-xl text-on-surface mb-1 inline-block hover:text-primary transition-colors">White House Tavern</a>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed">Legendary sandwiches and elevated comfort food in a charming 1883 Victorian house on Hopkins Avenue.</p>
                </div>
                <div>
                  <a href="https://www.publichouseaspen.com/" target="_blank" rel="noopener noreferrer" className="font-headline text-xl text-on-surface mb-1 inline-block hover:text-primary transition-colors">Aspen Public House</a>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed">Laid-back gastropub with craft cocktails, hearty burgers, and a great late-night menu.</p>
                </div>
                <div>
                  <a href="https://www.aspenbrewingco.com/" target="_blank" rel="noopener noreferrer" className="font-headline text-xl text-on-surface mb-1 inline-block hover:text-primary transition-colors">Aspen Brewing Company</a>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed">Award-winning local craft brewery with artisan pizza, small bites, and a casual outdoor patio.</p>
                </div>
              </div>
            </div>

            {/* Fine Dining */}
            <div>
              <div className="group relative overflow-hidden aspect-[16/9] mb-8 cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://swiftmedia.s3.amazonaws.com/mountain.swiftcom.com/images/sites/5/2022/08/10031822/b8bb5da2-6d07-502c-a147-06d4b0ee7def.jpg"
                  alt="Fine dining table setting"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 via-background/50 to-transparent">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">stars</span>
                    <span className="font-headline text-2xl text-on-surface">Fine <span className="italic text-primary">Dining</span></span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <a href="https://www.wayan-restaurants.com/aspen" target="_blank" rel="noopener noreferrer" className="font-headline text-xl text-on-surface mb-1 inline-block hover:text-primary transition-colors">Wayan</a>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed">Indonesian-inspired cuisine with French technique in a stunning, intimate setting.</p>
                </div>
                <div>
                  <a href="https://www.steakhouse316.com/" target="_blank" rel="noopener noreferrer" className="font-headline text-xl text-on-surface mb-1 inline-block hover:text-primary transition-colors">Steakhouse No. 316</a>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed">Classic steakhouse in an 1888 Victorian building with prime cuts, an extensive wine list, and old-school elegance.</p>
                </div>
                <div>
                  <a href="https://www.matsuhisarestaurants.com/aspen/" target="_blank" rel="noopener noreferrer" className="font-headline text-xl text-on-surface mb-1 inline-block hover:text-primary transition-colors">Matsuhisa</a>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed">Nobu Matsuhisa&apos;s beloved Aspen outpost — world-class Japanese-Peruvian cuisine and legendary omakase.</p>
                </div>
              </div>
            </div>

            {/* Lunch */}
            <div>
              <div className="group relative overflow-hidden aspect-[16/9] mb-8 cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://swiftmedia.s3.amazonaws.com/mountain.swiftcom.com/images/sites/5/2022/08/10180235/d940d959-8a64-51da-9409-44e08912d658-1024x1024.jpg"
                  alt="Grateful Deli shop"
                  className="absolute inset-0 w-full h-full object-cover object-[50%_15%] transition-transform duration-1000 scale-105 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 via-background/50 to-transparent">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">lunch_dining</span>
                    <span className="font-headline text-2xl text-on-surface italic text-primary">Lunch</span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <a href="https://www.gratefuldelico.com/" target="_blank" rel="noopener noreferrer" className="font-headline text-xl text-on-surface mb-1 inline-block hover:text-primary transition-colors">Grateful Deli</a>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed">The locals&apos; go-to for massive, stacked sandwiches — perfect for a picnic by the river.</p>
                </div>
                <div>
                  <a href="https://www.clarksoysterbar.com/locations/aspen" target="_blank" rel="noopener noreferrer" className="font-headline text-xl text-on-surface mb-1 inline-block hover:text-primary transition-colors">Clark&apos;s Oyster Bar</a>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed">Fresh oysters, seafood, and a buzzy atmosphere — one of Aspen&apos;s most beloved spots.</p>
                </div>
                <div>
                  <a href="https://www.meatandcheeseaspen.com/" target="_blank" rel="noopener noreferrer" className="font-headline text-xl text-on-surface mb-1 inline-block hover:text-primary transition-colors">Meat &amp; Cheese</a>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed">Artisan charcuterie, farm-to-table small plates, and a charming farm shop to browse.</p>
                </div>
              </div>
            </div>

            {/* Breakfast */}
            <div>
              <div className="group relative overflow-hidden aspect-[16/9] mb-8 cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80"
                  alt="Breakfast spread"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 via-background/50 to-transparent">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">bakery_dining</span>
                    <span className="font-headline text-2xl text-on-surface italic text-primary">Breakfast</span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <a href="https://beardenaspen.com/" target="_blank" rel="noopener noreferrer" className="font-headline text-xl text-on-surface mb-1 inline-block hover:text-primary transition-colors">Bear Den</a>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed">Cozy bakery-cafe with hearty egg dishes, fresh pastries, and great coffee for a leisurely brunch.</p>
                </div>
                <div>
                  <a href="https://www.paradisebakeryaspen.com/" target="_blank" rel="noopener noreferrer" className="font-headline text-xl text-on-surface mb-1 inline-block hover:text-primary transition-colors">Paradise Bakery &amp; Cafe</a>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed">An Aspen institution since 1976 — fresh pastries, great espresso, and a sunny patio on the mall.</p>
                </div>
                <div>
                  <a href="https://felixroastingco.com/" target="_blank" rel="noopener noreferrer" className="font-headline text-xl text-on-surface mb-1 inline-block hover:text-primary transition-colors">Felix Roasting Co.</a>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed">Specialty coffee shop inside Hotel Jerome with expertly crafted espresso, fresh juices, and light bites.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
    </main>
  );
}
