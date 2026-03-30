import Link from "next/link";

/* Venue images from the original Stitch designs */
const VENUE_IMAGES = {
  jerome: "https://images.squarespace-cdn.com/content/v1/63331a3cafeb0564c49f9f45/1666034385593-7P9IY2SZRS198OV1MXJ9/ElksBuilding.jpg",
  ceremony: "/images/itinerary/ceremony.jpg",
  reception: "/images/itinerary/reception.jpg",
  brunch:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAY5vnewEs-XeyzX02ow_KOZqGhPnvPP4y5sh8hCXxHP0eZJdzemwJNEfT1eqpYhU_zDfB_vYRWmgjZj3-wjRqlSYBW6IYjfBfmeaq-m722O7X6LrTMAYF4Ne-isWIUWnrHhZdCmpudF1Fh3Zn3hOmnibO88QnGTxXfnP2vcwowlYOyuDoAjDtFKSbQq9KQwoBRbjC-5dE_PxynjpdiHt9c_9QFcmYIIdkHvP8NhvbGdjxnqF57b9feCmHvxVq_LuJGAAgmZTzu0yU",
  afterparty: "https://s3-media0.fl.yelpcdn.com/bphoto/BAQarK_FU8g3vNZaxwJbNg/348s.jpg",
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
              September 19th, 2026 &bull; Aspen, Colorado
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
                  <span className="italic text-primary">September 18th</span>
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
                  <div className="relative z-10 flex flex-col md:flex-row gap-2 md:gap-16">
                    <div className="md:w-48 shrink-0 px-6 pt-6 pb-1 md:p-8 md:pr-0">
                      <span className="font-headline text-5xl md:text-6xl text-on-surface group-hover:text-primary transition-colors duration-500">
                        7:00
                      </span>
                      <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant block mt-2">
                        Evening &bull; PM
                      </span>
                    </div>
                    <div className="flex-1 md:border-l border-primary/20 px-6 pb-6 pt-2 md:pl-16 md:py-8 md:pr-8">
                      <div className="flex items-center gap-3 text-primary mb-4">
                        <span className="material-symbols-outlined text-xl itinerary-icon">restaurant</span>
                        <span className="font-label text-[11px] uppercase tracking-[0.2em]">
                          Welcome Drinks
                        </span>
                      </div>
                      <h4 className="font-headline text-3xl text-on-surface mb-4">
                        The Welcome Party - Silver City
                      </h4>
                      <p className="text-on-surface-variant font-light leading-relaxed mb-6 text-lg">
                        Hors d'oeuvres & cocktails to kick off the weekend at Aspen's oldest mountain saloon, Silver City. Western elegance attire.
                      </p>
                      <a href="https://maps.google.com/?q=210+S+Galena+St,+Aspen,+CO+81611" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-on-surface/60 font-label text-[11px] uppercase tracking-[0.1em] group-hover:text-primary/60 transition-colors duration-500 hover:text-primary/80">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        210 S Galena St, Aspen, CO 81611
                      </a>
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
                  <span className="italic text-primary">September 19th</span>
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
                  </div>
                  <div className="group relative overflow-hidden rounded-lg border border-outline/10 shadow-[0_4px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(212,163,115,0.06)] itinerary-card">
                    <div
                      className="absolute inset-0 z-0 opacity-10 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${VENUE_IMAGES.ceremony}')` }}
                    />
                    <div className="absolute inset-0 z-[1] event-card-overlay" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-20" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-2 md:gap-16">
                      <div className="md:w-48 shrink-0 px-6 pt-6 pb-1 md:p-8 md:pr-0">
                        <span className="font-headline text-5xl md:text-6xl text-on-surface group-hover:text-primary transition-colors duration-500">
                          3:00
                        </span>
                        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant block mt-2">
                          Afternoon &bull; PM
                        </span>
                      </div>
                      <div className="flex-1 md:border-l border-primary/20 px-6 pb-6 pt-2 md:pl-16 md:py-8 md:pr-8">
                        <div className="flex items-center gap-3 text-primary mb-4">
                          <span className="material-symbols-outlined text-xl itinerary-icon">church</span>
                          <span className="font-label text-[11px] uppercase tracking-[0.2em]">
                            The Main Event
                          </span>
                        </div>
                        <h4 className="font-headline text-3xl text-on-surface mb-4">
                          The Wedding Ceremony - St. Mary's Church
                        </h4>
                        <p className="text-on-surface-variant font-light leading-relaxed mb-6 text-lg">
                           A traditional Catholic wedding ceremony without a full Mass, officiated by Uncle Father Henry! Please arrive early as we will start at 3pm sharp. Black tie optional attire.
                        </p>
                        <a href="https://maps.google.com/?q=533+E+Main+St,+Aspen,+CO+81611" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-on-surface/60 font-label text-[11px] uppercase tracking-[0.1em] group-hover:text-primary/60 transition-colors duration-500 hover:text-primary/80">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                         533 E Main St #533, Aspen, CO 81611
                        </a>
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
                    <div className="relative z-10 flex flex-col md:flex-row gap-2 md:gap-16">
                      <div className="md:w-48 shrink-0 px-6 pt-6 pb-1 md:p-8 md:pr-0">
                        <span className="font-headline text-5xl md:text-6xl text-on-surface group-hover:text-primary transition-colors duration-500">
                          5:00
                        </span>
                        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant block mt-2">
                          Evening &bull; PM
                        </span>
                      </div>
                      <div className="flex-1 md:border-l border-primary/20 px-6 pb-6 pt-2 md:pl-16 md:py-8 md:pr-8">
                        <div className="flex items-center gap-3 text-primary mb-4">
                          <span className="material-symbols-outlined text-xl itinerary-icon">local_bar</span>
                          <span className="font-label text-[11px] uppercase tracking-[0.2em]">
                            Cocktail Hour
                          </span>
                        </div>
                        <h4 className="font-headline text-3xl text-on-surface mb-4">
                          Cocktails - Hotel Jerome Courtyard
                        </h4>
                        <p className="text-on-surface-variant font-light leading-relaxed mb-6 text-lg">
                          A magical (👀) outdoor cocktail hour in the Hotel Jerome courtyard before dinner. Just a 3 minute walk from St. Mary's!
                        </p>
                        <a href="https://maps.google.com/?q=330+E+Main+St,+Aspen,+CO+81611" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-on-surface/60 font-label text-[11px] uppercase tracking-[0.1em] group-hover:text-primary/60 transition-colors duration-500 hover:text-primary/80">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          330 East Main St, Aspen, CO 81611, USA.
                        </a>
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
                    <div className="relative z-10 flex flex-col md:flex-row gap-2 md:gap-16">
                      <div className="md:w-48 shrink-0 px-6 pt-6 pb-1 md:p-8 md:pr-0">
                        <span className="font-headline text-5xl md:text-6xl text-on-surface group-hover:text-primary transition-colors duration-500">
                          6:00
                        </span>
                        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant block mt-2">
                          Evening &bull; PM
                        </span>
                      </div>
                      <div className="flex-1 md:border-l border-primary/20 px-6 pb-6 pt-2 md:pl-16 md:py-8 md:pr-8">
                        <div className="flex items-center gap-3 text-primary mb-4">
                          <span className="material-symbols-outlined text-xl itinerary-icon">restaurant</span>
                          <span className="font-label text-[11px] uppercase tracking-[0.2em]">
                            Celebration
                          </span>
                        </div>
                        <h4 className="font-headline text-3xl text-on-surface mb-4">
                          Dinner &amp; Dancing - Hotel Jerome Grand Ballroom
                        </h4>
                        <p className="text-on-surface-variant font-light leading-relaxed mb-6 text-lg">
                          A formal seated dinner at Hotel Jerome followed by dancing! Bring your appetite and your dancing shoes.
                        </p>
                        <a href="https://maps.google.com/?q=330+E+Main+St,+Aspen,+CO+81611" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-on-surface/60 font-label text-[11px] uppercase tracking-[0.1em] group-hover:text-primary/60 transition-colors duration-500 hover:text-primary/80">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          330 East Main St, Aspen, CO 81611, USA.
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Afterparty — Card left, image right */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 reveal-on-scroll">
                  {/* Event details */}
                  <div className="flex-1 min-w-0 group relative overflow-hidden rounded-lg border border-outline/10 shadow-[0_4px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(212,163,115,0.06)] itinerary-card">
                    <div
                      className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${VENUE_IMAGES.afterparty}')` }}
                    />
                    <div className="absolute inset-0 z-[1] event-card-overlay" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-20" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-2 md:gap-16">
                      <div className="md:w-48 shrink-0 px-6 pt-6 pb-1 md:p-8 md:pr-0">
                        <span className="font-headline text-5xl md:text-6xl text-on-surface group-hover:text-primary transition-colors duration-500">
                          10:00
                        </span>
                        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant block mt-2">
                          Late Night &bull; PM
                        </span>
                      </div>
                      <div className="flex-1 md:border-l border-primary/20 px-6 pb-6 pt-2 md:pl-16 md:py-8 md:pr-8">
                        <div className="flex items-center gap-3 text-primary mb-4">
                          <span className="material-symbols-outlined text-xl itinerary-icon">nightlife</span>
                          <span className="font-label text-[11px] uppercase tracking-[0.2em]">
                            Late Night
                          </span>
                        </div>
                        <h4 className="font-headline text-3xl text-on-surface mb-4">
                          The Afterparty - The Buck 
                        </h4>
                        <p className="text-on-surface-variant font-light leading-relaxed mb-6 text-lg">
                          The night is still young! Keep the celebration going with drinks, music, and good company.
                        </p>
                        <a href="https://maps.google.com/?q=508+E+Cooper+Ave,+Aspen,+CO+81611" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-on-surface/60 font-label text-[11px] uppercase tracking-[0.1em] group-hover:text-primary/60 transition-colors duration-500 hover:text-primary/80">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          508 East Cooper Ave Unit 001. Aspen, CO 81611
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* Venue image */}
                  <div className="md:w-80 shrink-0 relative rounded-lg overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)] group/img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={VENUE_IMAGES.afterparty}
                      alt="The Buck in Aspen"
                      className="w-full h-full object-cover min-h-[280px] transition-transform duration-700 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Sunday ─── */}
            <div className="reveal-on-scroll">
              <div className="flex items-center gap-6 mb-16">
                <h3 className="font-headline text-3xl text-on-surface">
                  Sunday,{" "}
                  <span className="italic text-primary">September 20th</span>
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
                  <div className="relative z-10 flex flex-col md:flex-row gap-2 md:gap-16">
                    <div className="md:w-48 shrink-0 px-6 pt-6 pb-1 md:p-8 md:pr-0">
                      <span className="font-headline text-5xl md:text-6xl text-on-surface group-hover:text-primary transition-colors duration-500">
                        10:00
                      </span>
                      <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant block mt-2">
                        Morning &bull; AM
                      </span>
                    </div>
                    <div className="flex-1 md:border-l border-primary/20 px-6 pb-6 pt-2 md:pl-16 md:py-8 md:pr-8">
                      <div className="flex items-center gap-3 text-primary mb-4">
                        <span className="material-symbols-outlined text-xl itinerary-icon">bakery_dining</span>
                        <span className="font-label text-[11px] uppercase tracking-[0.2em]">
                          Farewell
                        </span>
                      </div>
                      <h4 className="font-headline text-3xl text-on-surface mb-4">
                        TBD
                      </h4>
                      <p className="text-on-surface-variant font-light leading-relaxed mb-6 text-lg">
                        We plan on hanging around downtown Aspen on Sunday for some informal fun. Stop by to share a quick bevy with us or celebrate with us all day long!  Details will be shared closer to the date &mdash; check back soon!
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                        <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                        <span className="font-label text-[11px] uppercase tracking-[0.1em] text-primary">
                          Details coming soon
                        </span>
                      </div>
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

        </div>
      </section>

    </main>
  );
}
