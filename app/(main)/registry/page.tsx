import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registry — Emily & Tyler",
  description: "A few places we've registered for our Aspen wedding.",
};

const registries = [
  {
    title: "Honeyfund",
    kicker: "Honeymoon Fund",
    description:
      "Our honeymoon adventure fund. Help us celebrate by contributing to the trip of a lifetime.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    alt: "Turquoise waves rolling onto a white sand tropical Hawaiian beach",
    link: "https://www.honeyfund.com/site/straffon-veeck-09-19-2026",
  },
  {
    title: "Amazon",
    kicker: "Registry",
    description:
      "From everyday essentials to home upgrades — our Amazon wishlist has a little of everything.",
    image: "/registry-amazon.jpg",
    alt: "Assortment of personalized wedding gifts",
    link: "https://www.amazon.com/wedding/guest-view/2ND8G333Q8MCF",
  },
];

export default function RegistryPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[614px] w-full overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          {/* TODO: replace with /public local hero image */}
          <div
            className="w-full h-full bg-cover bg-center hero-parallax-bg"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80')",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(to bottom, rgba(13,27,30,0.15) 0%, rgba(13,27,30,0.5) 55%, rgba(13,27,30,0.85) 100%), linear-gradient(to right, rgba(13,27,30,0.45) 0%, rgba(13,27,30,0.15) 45%, transparent 70%)",
            }}
          />
        </div>
        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-20">
          <div className="max-w-4xl">
            <p className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 hero-reveal-label">
              For Our Guests
            </p>
            <h1 className="font-headline text-5xl md:text-8xl text-on-surface leading-[0.85] tracking-tighter mb-6 hero-reveal-title">
              Our{" "}
              <span className="italic font-light text-primary/80">
                Registries
              </span>
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl font-light leading-relaxed hero-reveal-subtitle">
              A few places we&apos;ve registered, for anyone who&apos;d like to celebrate with a gift.
            </p>
          </div>
        </div>
      </section>

      {/* Registry Card Grid */}
      <section className="py-16 bg-background relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,163,115,0.04)_0%,transparent_60%)] pointer-events-none"
          aria-hidden="true"
        />
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">
          <div className="space-y-20 md:space-y-32 reveal-on-scroll-stagger">
            {registries.map((r, i) => {
              const flipped = i % 2 === 1;
              return (
                <div key={r.title} className="reveal-on-scroll">
                  {i > 0 && (
                    <div
                      className="h-px w-full bg-outline/10 mb-20 md:mb-32"
                      aria-hidden="true"
                    />
                  )}
                  <div className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                    {/* Image */}
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={-1}
                      aria-hidden="true"
                      className={`lg:col-span-7 block overflow-hidden bg-surface-variant/50 relative aspect-[3/2] ${
                        flipped ? "lg:order-2" : ""
                      }`}
                    >
                      <div
                        className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500 z-10"
                        aria-hidden="true"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={r.alt}
                        className="w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-110"
                        src={r.image}
                      />
                    </a>

                    {/* Text */}
                    <div
                      className={`lg:col-span-5 ${
                        flipped ? "lg:order-1" : ""
                      }`}
                    >
                      <span className="font-label text-xs uppercase tracking-[0.4em] text-primary/70 mb-5 block">
                        {String(i + 1).padStart(2, "0")} &middot; {r.kicker}
                      </span>
                      <h3 className="font-headline text-4xl md:text-6xl text-on-surface mb-5 leading-[0.95]">
                        {r.title}
                      </h3>
                      <p className="text-on-surface-variant text-lg leading-relaxed mb-8 font-light max-w-md">
                        {r.description}
                      </p>
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${r.title} registry (opens in new tab)`}
                        className="font-headline italic text-primary text-base editorial-underline inline-flex items-center gap-2 hover:gap-3 transition-all"
                      >
                        Visit Registry
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
