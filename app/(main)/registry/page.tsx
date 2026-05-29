import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registry — Emily & Tyler",
  description: "A few places we've registered for our Aspen wedding.",
};

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
                "linear-gradient(to bottom, rgba(13,27,30,0.05), rgba(13,27,30,0.3))",
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
    </main>
  );
}
