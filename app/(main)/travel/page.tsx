import type { Metadata } from "next";
import AltitudeCounter from "@/components/AltitudeCounter";
import HotelTabs from "@/components/HotelTabs";

export const metadata: Metadata = {
  title: "Travel & Stay — Emily & Tyler",
  description:
    "Everything you need to navigate your journey to Aspen for the wedding.",
};

export default function TravelPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[614px] w-full overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center hero-parallax-bg"
            style={{ backgroundImage: "url('/travel-hero-crop.jpg')" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(13,27,30,0.1), rgba(13,27,30,0.5))",
            }}
          />
        </div>
        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-20">
          <div className="max-w-4xl">
            <p className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 hero-reveal-label">
              Practical Traveler&apos;s Guide
            </p>
            <h1 className="font-headline text-5xl md:text-8xl text-on-surface leading-[0.85] tracking-tighter mb-6 hero-reveal-title">
              Travel{" "}
              <span className="italic font-light text-primary/80">&amp;</span>
              <br />
              Lodging
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl font-light leading-relaxed hero-reveal-subtitle">
              Everything you need to navigate your journey to the Rocky
              Mountains. We recommend booking early, as September is a beautiful
              and popular time in Aspen.
            </p>
          </div>
        </div>
      </section>

      {/* Getting There + Where to Stay */}
      <section className="py-16 bg-background">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
            {/* Getting There — left column */}
            <div className="lg:col-span-5 space-y-20">
              <div className="reveal-on-scroll">
                <div className="flex items-center gap-4 mb-8">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    flight
                  </span>
                  <h2 className="font-headline text-3xl text-on-surface">
                    Getting There
                  </h2>
                </div>

                <div className="space-y-10 reveal-on-scroll-stagger">
                  {/* Air Travel */}
                  <div>
                    <h3 className="font-label text-xs uppercase tracking-[0.2em] text-primary mb-3">
                      Air Travel
                    </h3>
                    <p className="text-on-surface-variant leading-relaxed mb-4">
                      Flying directly into{" "}
                      <span className="text-on-surface">
                        Aspen/Pitkin County Airport (ASE)
                      </span>{" "}
                      is undoubtedly the easiest option, located just 10 minutes
                      from downtown Aspen and Hotel Jerome. No need to rent a car, downtown Aspen is very walkable!
                    </p>
                    <p className="text-on-surface-variant leading-relaxed italic">
                      Most major carriers offer connecting flights through
                      Denver, Chicago, or Los Angeles.
                    </p>
                  </div>

                  {/* Scenic Route */}
                  <div>
                    <h3 className="font-label text-xs uppercase tracking-[0.2em] text-primary mb-3">
                      The Scenic Route
                    </h3>
                    <p className="text-on-surface-variant leading-relaxed mb-4">
                      For those with a bit more time, the drive from{" "}
                      <span className="text-on-surface">
                        Denver International Airport (DEN)
                      </span>{" "}
                      to Aspen is roughly 3.5 to 4 hours and is 
                      <span className="text-primary"> one of our
                      absolute favorite drives</span> in the country.
                    </p>
                    <p className="text-on-surface-variant leading-relaxed">
                      The route via I-70 West and Independence Pass (Hwy 82)
                      offers breathtaking continental divide vistas.
                    </p>

                    {/* Route timeline */}
                    <div className="mt-8 flex items-stretch gap-4">
                      <div className="flex flex-col items-center">
                        <div className="size-3 rounded-full bg-primary" />
                        <div className="w-px flex-1 bg-gradient-to-b from-primary via-primary/40 to-primary" />
                        <div className="size-3 rounded-full bg-primary" />
                      </div>
                      <div className="flex flex-col justify-between py-0.5">
                        <div>
                          <p className="font-label text-xs uppercase tracking-widest text-on-surface">Denver (DEN)</p>
                          <p className="text-[10px] text-on-surface-variant">5,280 ft</p>
                        </div>
                        <div className="py-3">
                          <p className="text-[10px] text-on-surface-variant italic">~ 3.5 hrs via I-70 W &amp; Independence Pass</p>
                        </div>
                        <div>
                          <p className="font-label text-xs uppercase tracking-widest text-on-surface">Aspen</p>
                          <p className="text-[10px] text-on-surface-variant">8,000 ft</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Car Rentals */}
                  {/* <div>
                    <h3 className="font-label text-xs uppercase tracking-[0.2em] text-primary mb-3">
                      Car Rentals &amp; Shuttles
                    </h3>
                    <p className="text-on-surface-variant leading-relaxed mb-4">
                      If flying into ASE, you likely won&apos;t need a car as
                      Aspen is very walkable and the hotel provides local
                      transport. For those driving from Denver, we recommend an
                      AWD vehicle.
                    </p>
                    <div className="mt-6 flex flex-col gap-4">
                      <a
                        className="link-editorial text-on-surface text-sm font-label uppercase tracking-widest flex items-center gap-3 hover:text-primary transition-colors"
                        href="#"
                      >
                        <span className="material-symbols-outlined text-xs">
                          open_in_new
                        </span>{" "}
                        Epic Mountain Express
                      </a>
                      <a
                        className="link-editorial text-on-surface text-sm font-label uppercase tracking-widest flex items-center gap-3 hover:text-primary transition-colors"
                        href="#"
                      >
                        <span className="material-symbols-outlined text-xs">
                          open_in_new
                        </span>{" "}
                        Hertz Aspen Rental
                      </a>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Interactive Route Map */}
              <div className="aspect-[4/5] bg-surface-variant/30 border border-outline/20 relative overflow-hidden group">
                <img
                  alt="Scenic mountain road to Aspen"
                  className="w-full h-full object-cover opacity-60 grayscale-[0.3] group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000"
                  src="/travel-scenic-road.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="bg-background/80 backdrop-blur-md p-8 border border-outline/30 max-w-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="material-symbols-outlined text-primary">
                        map
                      </span>
                      <span className="font-label text-xs uppercase tracking-widest text-on-surface">
                        Interactive Route Map
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-loose mb-6">
                      Explore our curated road trip map with stops at our
                      favorite cafes and viewpoints along I-70 and Hwy 82.
                    </p>
                    <a
                      className="link-editorial inline-block text-[10px] uppercase tracking-[0.2em] text-primary pb-1 hover:opacity-80 transition-all"
                      href="#"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Where to Stay — right column */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-12 reveal-on-scroll">
                <span className="material-symbols-outlined text-primary text-3xl">
                  bed
                </span>
                <h2 className="font-headline text-3xl text-on-surface">
                  Where to Stay
                </h2>
              </div>

              <div className="reveal-on-scroll">
                <HotelTabs />
              </div>

              {/* Altitude note */}
              <div className="reveal-on-scroll mt-16 p-8 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex gap-6">
                  <span className="material-symbols-outlined text-primary altitude-icon">
                    landscape
                  </span>
                  <div>
                    <h4 className="font-label text-xs uppercase tracking-widest text-primary mb-2">
                      A Note on Altitude
                    </h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      Aspen sits at <AltitudeCounter /> feet. We recommend drinking plenty of
                      water and taking it easy on your first day to help
                      acclimate to the mountain air!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Need Assistance */}
      {/* <section className="py-32 bg-surface text-center">
        <div className="max-w-2xl mx-auto px-6 reveal-on-scroll">
          <h2 className="font-headline text-4xl text-on-surface mb-8">
            Need Assistance?
          </h2>
          <p className="text-on-surface-variant mb-12">
            If you have questions about travel arrangements or need
            recommendations tailored to your trip, please don&apos;t hesitate to
            reach out to our wedding planners.
          </p>
          <a
            className="link-editorial font-label text-[10px] uppercase tracking-[0.4em] text-primary pb-2 transition-opacity"
            href="mailto:hello@example.com"
          >
            Contact Planning Team
          </a>
        </div>
      </section> */}
    </main>
  );
}
