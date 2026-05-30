import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registry — Emily & Tyler",
  description: "A few places we've registered for our Aspen wedding.",
};

const registries = [
  {
    title: "Honeyfund",
    description:
      "Our honeymoon adventure fund. Help us celebrate by contributing to the trip of a lifetime.",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
    alt: "Mountain landscape with a passport and journal evoking honeymoon travel",
    // TODO: replace with real registry URL
    link: "#",
  },
  {
    title: "Amazon",
    description:
      "From everyday essentials to home upgrades — our Amazon wishlist has a little of everything.",
    image:
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80",
    alt: "Wrapped gift box with neutral linen ribbon on a wooden surface",
    // TODO: replace with real registry URL
    link: "#",
  },
  {
    title: "Crate & Barrel",
    description:
      "Tableware, linens, and kitchen goods we've been eyeing for our first home together.",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    alt: "Curated tabletop with linen napkins, glassware, and warm afternoon light",
    // TODO: replace with real registry URL
    link: "#",
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
              A few places we&apos;ve put together — but truly, just being there is enough.
            </p>
          </div>
        </div>
      </section>

      {/* Framing Block */}
      <section className="py-16 bg-background">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="max-w-2xl mx-auto text-center reveal-on-scroll">
            <p className="text-on-surface-variant text-lg font-light leading-relaxed">
              Your presence is the greatest gift. If you&apos;d like to celebrate with something more, here are a few places we&apos;ve registered.
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
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
          <div className="mb-12 md:mb-24 reveal-on-scroll">
            <span className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 block">
              Gift Registries
            </span>
            <h2 className="font-headline text-4xl md:text-6xl text-on-surface">
              A Few of Our{" "}
              <span className="italic font-light text-primary/80">Favorites</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 md:gap-y-24 reveal-on-scroll-stagger">
            {registries.map((r) => (
              <a
                key={r.title}
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${r.title} registry (opens in new tab)`}
                className="group cursor-pointer block"
              >
                <div className="aspect-[4/5] bg-surface-variant/50 mb-8 overflow-hidden relative">
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
                </div>
                <h3 className="font-headline text-2xl md:text-4xl text-on-surface mb-3 group-hover:text-primary transition-colors">
                  {r.title}
                </h3>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-6 font-light">
                  {r.description}
                </p>
                <span className="font-headline italic text-primary text-sm editorial-underline inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Visit Registry
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
