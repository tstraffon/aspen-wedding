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
                      from downtown Aspen and Hotel Jerome. 
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
                          <p className="text-[11px] text-on-surface-variant">5,280 ft</p>
                        </div>
                        <div className="py-3">
                          <p className="text-[11px] text-on-surface-variant italic">~ 3.5 hrs via I-70 W &amp; Independence Pass</p>
                        </div>
                        <div>
                          <p className="font-label text-xs uppercase tracking-widest text-on-surface">Aspen</p>
                          <p className="text-[11px] text-on-surface-variant">8,000 ft</p>
                        </div>
                      </div>
                    </div>
                  </div>
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
                      className="link-editorial inline-block text-[11px] uppercase tracking-[0.2em] text-primary pb-1 hover:opacity-80 transition-all"
                      href="https://maps.app.goo.gl/TtyBXdxejcwhLkXe6"
                      target="_blank"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* Altitude note */}
              <div className="reveal-on-scroll p-8 bg-primary/5 border border-primary/20 rounded-lg">
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

              <div className="reveal-on-scroll mb-10 p-8 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex gap-6">
                  <span className="material-symbols-outlined text-primary">
                    location_on
                  </span>
                  <div>
                    <h4 className="font-label text-xs uppercase tracking-widest text-primary mb-2">
                      Stay Downtown
                    </h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      All of the weekend&apos;s events are within walking distance of
                      downtown Aspen. We highly recommend booking a hotel or a AirBnB/Vrbo in the
                      downtown area so you can walk to everything with ease!
                    </p>
                  </div>
                </div>
              </div>

              <div className="reveal-on-scroll">
                <HotelTabs />
              </div>

              {/* Getting Around */}
              <div className="reveal-on-scroll mt-16">
                <div className="flex items-center gap-4 mb-8">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    directions_walk
                  </span>
                  <h3 className="font-label text-xs uppercase tracking-[0.2em] text-primary">
                    Getting Around Aspen
                  </h3>
                </div>
                <div className="grid gap-4">
                  <div className="p-6 bg-surface-variant/20 border border-outline/5 rounded-lg">
                    <div className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-primary/60 text-xl mt-0.5">
                        directions_walk
                      </span>
                      <div>
                        <h4 className="font-label text-sm text-on-surface mb-1">Walking</h4>
                        <p className="text-on-surface-variant text-sm leading-relaxed font-light">
                          Downtown Aspen is very walkable! Most hotels are within 5–10 minutes of everything.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-surface-variant/20 border border-outline/5 rounded-lg">
                    <div className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-primary/60 text-xl mt-0.5">
                        electric_car
                      </span>
                      <div>
                        <h4 className="font-label text-sm text-on-surface mb-1">Downtowner</h4>
                        <p className="text-on-surface-variant text-sm leading-relaxed font-light">
                          A free, on-demand electric shuttle that will pick you up and drop you off anywhere within the downtown Aspen zone. Request a ride through the{" "}
                          <a
                            className="link-editorial text-primary hover:opacity-80 transition-all"
                            href="https://www.ridedowntowner.com/aspen"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Downtowner app
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-surface-variant/20 border border-outline/5 rounded-lg">
                    <div className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-primary/60 text-xl mt-0.5">
                        directions_bus
                      </span>
                      <div>
                        <h4 className="font-label text-sm text-on-surface mb-1">Free RFTA Buses</h4>
                        <p className="text-on-surface-variant text-sm leading-relaxed font-light">
                          Excellent public transportation throughout Aspen and surrounding areas.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-surface-variant/20 border border-outline/5 rounded-lg">
                    <div className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-primary/60 text-xl mt-0.5">
                        local_taxi
                      </span>
                      <div>
                        <h4 className="font-label text-sm text-on-surface mb-1">Rideshare</h4>
                        <p className="text-on-surface-variant text-sm leading-relaxed font-light">
                          Uber and Lyft are available, though they may be limited during peak times.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
