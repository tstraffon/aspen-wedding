import Link from "next/link";

/* Venue images from the original Stitch designs */
const VENUE_IMAGES = {
  jerome: "https://images.squarespace-cdn.com/content/v1/63331a3cafeb0564c49f9f45/1666034385593-7P9IY2SZRS198OV1MXJ9/ElksBuilding.jpg",
  ceremony: "/images/itinerary/ceremony.jpg",
  reception: "/images/itinerary/reception.jpg",
  brunch:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAY5vnewEs-XeyzX02ow_KOZqGhPnvPP4y5sh8hCXxHP0eZJdzemwJNEfT1eqpYhU_zDfB_vYRWmgjZj3-wjRqlSYBW6IYjfBfmeaq-m722O7X6LrTMAYF4Ne-isWIUWnrHhZdCmpudF1Fh3Zn3hOmnibO88QnGTxXfnP2vcwowlYOyuDoAjDtFKSbQq9KQwoBRbjC-5dE_PxynjpdiHt9c_9QFcmYIIdkHvP8NhvbGdjxnqF57b9feCmHvxVq_LuJGAAgmZTzu0yU",
};

export default function ItineraryPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[614px] w-full overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center hero-parallax-bg"
            style={{ backgroundImage: "url('/images/itinerary/hero.jpg')" }}
          />
          {/* Bottom-heavy gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(13,27,30,0.1) 0%, rgba(13,27,30,0.15) 40%, rgba(13,27,30,0.5) 70%, rgba(13,27,30,0.7) 100%)",
            }}
          />
          {/* Warm vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, transparent 30%, rgba(13,27,30,0.3) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-20">
          <div className="max-w-4xl">
            <p className="hero-reveal-label font-label text-xs uppercase tracking-[0.4em] text-primary drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] mb-6">
              September 19, 2026 &bull; Aspen, Colorado
            </p>
            <h1
              className="hero-reveal-title font-headline text-5xl md:text-8xl text-on-surface leading-[0.85] tracking-tighter mb-4"
              style={{ textShadow: "0 2px 30px rgba(0,0,0,0.5), 0 4px 60px rgba(13,27,30,0.4)" }}
            >
              The{" "}
              <span className="italic font-light text-primary">Itinerary</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-background relative overflow-hidden" id="itinerary">
        {/* Ambient background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(212,163,115,0.03) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="space-y-32">
            {/* ─── Friday ─── */}
            <div className="reveal-on-scroll">
              <div className="flex items-center gap-6 mb-16">
                <h3 className="font-headline text-3xl text-on-surface">
                  Friday,{" "}
                  <span className="italic text-primary">Sept 18</span>
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
              </div>

              {/* Layout: Image right, card left */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                {/* Event details */}
                <div className="flex-1 min-w-0 group relative overflow-hidden rounded-lg border border-outline/10 shadow-[0_4px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(212,163,115,0.06)] itinerary-card">
                  <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${VENUE_IMAGES.jerome}')` }}
                  />
                  <div className="absolute inset-0 z-[1] event-card-overlay" />
                  {/* Warm top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-20" />
                  <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16">
                    <div className="md:w-48 shrink-0 p-8 md:pr-0">
                      <span className="font-headline text-5xl md:text-6xl text-on-surface group-hover:text-primary transition-colors duration-500">
                        7:00
                      </span>
                      <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant block mt-2">
                        Evening &bull; PM
                      </span>
                    </div>
                    <div className="flex-1 border-l border-primary/20 pl-8 md:pl-16 py-8 pr-8">
                      <div className="flex items-center gap-3 text-primary mb-4">
                        <span className="material-symbols-outlined text-xl itinerary-icon">restaurant</span>
                        <span className="font-label text-[10px] uppercase tracking-[0.2em]">
                          Welcome Drinks
                        </span>
                      </div>
                      <h4 className="font-headline text-3xl text-on-surface mb-4">
                        The Welcome Party
                      </h4>
                      <p className="text-on-surface-variant font-light leading-relaxed mb-6 text-lg">
                        Horderves & cocktails to kick off the weekend at Aspen's oldest mountain saloon, Silver City. Western elegance attire.
                      </p>
                      <div className="flex items-center gap-2 text-on-surface/60 font-label text-[10px] uppercase tracking-[0.1em] group-hover:text-primary/60 transition-colors duration-500">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        210 S Galena St, Aspen, CO 81611
                      </div>
                    </div>
                  </div>
                </div>
                {/* Venue image */}
                <div className="md:w-80 shrink-0 relative rounded-lg overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)] group/img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={VENUE_IMAGES.jerome}
                    alt="Hotel Jerome in the evening"
                    className="w-full h-full object-cover min-h-[280px] transition-transform duration-700 group-hover/img:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                </div>
              </div>
            </div>

            {/* ─── Saturday ─── */}
            <div className="reveal-on-scroll">
              <div className="flex items-center gap-6 mb-16">
                <h3 className="font-headline text-3xl text-on-surface">
                  Saturday,{" "}
                  <span className="italic text-primary">Sept 19</span>
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
              </div>

              <div className="space-y-16">
                {/* Ceremony — hero layout: wide image above, card below */}
                <div>
                  <div className="relative rounded-lg overflow-hidden mb-8 h-[320px] md:h-[400px] group/ceremony shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={VENUE_IMAGES.ceremony}
                      alt="St. Mary's Catholic Church in Aspen"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/ceremony:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                    {/* <div className="absolute bottom-6 left-8 z-10">
                      <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/80">
                        Aspen Mountain Club &bull; 10,000 ft
                      </span>
                    </div> */}
                  </div>
                  <div className="group relative overflow-hidden rounded-lg border border-outline/10 shadow-[0_4px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(212,163,115,0.06)] itinerary-card">
                    <div
                      className="absolute inset-0 z-0 opacity-10 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${VENUE_IMAGES.ceremony}')` }}
                    />
                    <div className="absolute inset-0 z-[1] event-card-overlay" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-20" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16">
                      <div className="md:w-48 shrink-0 p-8 md:pr-0">
                        <span className="font-headline text-5xl md:text-6xl text-on-surface group-hover:text-primary transition-colors duration-500">
                          3:00
                        </span>
                        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant block mt-2">
                          Afternoon &bull; PM
                        </span>
                      </div>
                      <div className="flex-1 border-l border-primary/20 pl-8 md:pl-16 py-8 pr-8">
                        <div className="flex items-center gap-3 text-primary mb-4">
                          <span className="material-symbols-outlined text-xl itinerary-icon">church</span>
                          <span className="font-label text-[10px] uppercase tracking-[0.2em]">
                            The Main Event
                          </span>
                        </div>
                        <h4 className="font-headline text-3xl text-on-surface mb-4">
                          The Wedding Ceremony
                        </h4>
                        <p className="text-on-surface-variant font-light leading-relaxed mb-6 text-lg">
                           A traditional Catholic wedding ceremony without a full Mass, officiated by Uncle Father Henry! Please arrive early as we will start at 3pm sharp. Black tie optional attire.
                        </p>
                        <div className="flex items-center gap-2 text-on-surface/60 font-label text-[10px] uppercase tracking-[0.1em] group-hover:text-primary/60 transition-colors duration-500">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                         533 E Main St #533, Aspen, CO 81611
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cocktail Hour — Card left, image right */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 reveal-on-scroll">
                  {/* Event details */}
                  <div className="flex-1 min-w-0 group relative overflow-hidden rounded-lg border border-outline/10 shadow-[0_4px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(212,163,115,0.06)] itinerary-card">
                    <div
                      className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: "url('/images/itinerary/hero.jpg')" }}
                    />
                    <div className="absolute inset-0 z-[1] event-card-overlay" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-20" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16">
                      <div className="md:w-48 shrink-0 p-8 md:pr-0">
                        <span className="font-headline text-5xl md:text-6xl text-on-surface group-hover:text-primary transition-colors duration-500">
                          5:00
                        </span>
                        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant block mt-2">
                          Evening &bull; PM
                        </span>
                      </div>
                      <div className="flex-1 border-l border-primary/20 pl-8 md:pl-16 py-8 pr-8">
                        <div className="flex items-center gap-3 text-primary mb-4">
                          <span className="material-symbols-outlined text-xl itinerary-icon">local_bar</span>
                          <span className="font-label text-[10px] uppercase tracking-[0.2em]">
                            Cocktail Hour
                          </span>
                        </div>
                        <h4 className="font-headline text-3xl text-on-surface mb-4">
                          Cocktails
                        </h4>
                        <p className="text-on-surface-variant font-light leading-relaxed mb-6 text-lg">
                          A magical outdoor cocktail hour in the Hotel Jerome courtyard before dinner  👀
                        </p>
                        <div className="flex items-center gap-2 text-on-surface/60 font-label text-[10px] uppercase tracking-[0.1em] group-hover:text-primary/60 transition-colors duration-500">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          330 East Main St, Aspen, CO 81611, USA.
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Venue image */}
                  <div className="md:w-80 shrink-0 relative rounded-lg overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)] group/img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/itinerary/hero.jpg"
                      alt="Cocktail hour in Aspen"
                      className="w-full h-full object-cover min-h-[280px] transition-transform duration-700 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                  </div>
                </div>

                {/* Dinner — Image left, card right */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 reveal-on-scroll">
                  {/* Venue image */}
                  <div className="md:w-80 shrink-0 relative rounded-lg overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)] group/img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={VENUE_IMAGES.reception}
                      alt="Dinner reception at Hotel Jerome"
                      className="w-full h-full object-cover min-h-[280px] transition-transform duration-700 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                  </div>
                  {/* Event details */}
                  <div className="flex-1 min-w-0 group relative overflow-hidden rounded-lg border border-outline/10 shadow-[0_4px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(212,163,115,0.06)] itinerary-card">
                    <div
                      className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${VENUE_IMAGES.reception}')` }}
                    />
                    <div className="absolute inset-0 z-[1] event-card-overlay" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-20" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16">
                      <div className="md:w-48 shrink-0 p-8 md:pr-0">
                        <span className="font-headline text-5xl md:text-6xl text-on-surface group-hover:text-primary transition-colors duration-500">
                          6:00
                        </span>
                        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant block mt-2">
                          Evening &bull; PM
                        </span>
                      </div>
                      <div className="flex-1 border-l border-primary/20 pl-8 md:pl-16 py-8 pr-8">
                        <div className="flex items-center gap-3 text-primary mb-4">
                          <span className="material-symbols-outlined text-xl itinerary-icon">restaurant</span>
                          <span className="font-label text-[10px] uppercase tracking-[0.2em]">
                            Celebration
                          </span>
                        </div>
                        <h4 className="font-headline text-3xl text-on-surface mb-4">
                          Dinner &amp; Dancing
                        </h4>
                        <p className="text-on-surface-variant font-light leading-relaxed mb-6 text-lg">
                          A formal seated dinner at Hotel Jerome followed by dancing! Bring your appetite and your dancing shoes.
                        </p>
                        <div className="flex items-center gap-2 text-on-surface/60 font-label text-[10px] uppercase tracking-[0.1em] group-hover:text-primary/60 transition-colors duration-500">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          330 East Main St, Aspen, CO 81611, USA.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Sunday ─── */}
            <div className="reveal-on-scroll">
              <div className="flex items-center gap-6 mb-16">
                <h3 className="font-headline text-3xl text-on-surface">
                  Sunday,{" "}
                  <span className="italic text-primary">Sept 20</span>
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
              </div>

              {/* Farewell Brunch — card left, image right */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                {/* Event details */}
                <div className="flex-1 min-w-0 group relative overflow-hidden rounded-lg border border-outline/10 shadow-[0_4px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(212,163,115,0.06)] itinerary-card">
                  <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${VENUE_IMAGES.brunch}')` }}
                  />
                  <div className="absolute inset-0 z-[1] event-card-overlay" />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-20" />
                  <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16">
                    <div className="md:w-48 shrink-0 p-8 md:pr-0">
                      <span className="font-headline text-5xl md:text-6xl text-on-surface group-hover:text-primary transition-colors duration-500">
                        10:00
                      </span>
                      <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant block mt-2">
                        Morning &bull; AM
                      </span>
                    </div>
                    <div className="flex-1 border-l border-primary/20 pl-8 md:pl-16 py-8 pr-8">
                      <div className="flex items-center gap-3 text-primary mb-4">
                        <span className="material-symbols-outlined text-xl itinerary-icon">bakery_dining</span>
                        <span className="font-label text-[10px] uppercase tracking-[0.2em]">
                          Farewell
                        </span>
                      </div>
                      <h4 className="font-headline text-3xl text-on-surface mb-4">
                        TBD
                      </h4>
                      <p className="text-on-surface-variant font-light leading-relaxed mb-6 text-lg">
                        Details coming soon - stay tuned.
                      </p>
                      {/* <div className="flex items-center gap-2 text-on-surface/60 font-label text-[10px] uppercase tracking-[0.1em] group-hover:text-primary/60 transition-colors duration-500">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        The Little Nell
                      </div> */}
                    </div>
                  </div>
                </div>
                {/* Venue image */}
                <div className="md:w-80 shrink-0 relative rounded-lg overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)] group/img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={VENUE_IMAGES.brunch}
                    alt="Sunny morning at The Little Nell"
                    className="w-full h-full object-cover min-h-[280px] transition-transform duration-700 group-hover/img:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>

          {/* Download PDF link */}
          {/* <div className="mt-32 pt-24 border-t border-outline/10 text-center reveal-on-scroll">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-4 cursor-pointer group/dl">
              <span className="material-symbols-outlined transition-transform duration-300 group-hover/dl:translate-y-0.5">download</span>
              Download the full itinerary PDF
            </span>
          </div> */}
        </div>
      </section>

      {/* Closing CTA */}
      {/* <section className="py-52 bg-surface text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,163,115,0.04)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute top-20 left-[15%] w-1 h-1 rounded-full bg-primary/20 altitude-icon" />
        <div className="absolute top-32 right-[20%] w-1.5 h-1.5 rounded-full bg-primary/15 altitude-icon" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-28 left-[25%] w-1 h-1 rounded-full bg-primary/20 altitude-icon" style={{ animationDelay: "2s" }} />
        <div className="max-w-3xl mx-auto px-6 relative z-10 reveal-on-scroll">
          <h2 className="font-headline text-6xl md:text-8xl text-on-surface mb-10 leading-[1.1]">
            See You in <br />
            <span className="italic text-primary">September.</span>
          </h2>
          <p className="text-on-surface-variant text-xl mb-16 italic font-headline font-light">
            &ldquo;Where the air is thin and the hearts are full.&rdquo;
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/rsvp"
              className="group/cta relative bg-primary text-on-primary px-16 py-5 font-label text-xs uppercase tracking-[0.3em] shadow-xl transition-all duration-300 hover:shadow-[0_8px_40px_rgba(212,163,115,0.25)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">Confirm Attendance</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-[#e0b88a] to-primary opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500" />
            </Link>
          </div>
        </div>
      </section> */}
    </main>
  );
}
