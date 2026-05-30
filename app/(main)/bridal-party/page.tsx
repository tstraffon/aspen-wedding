import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bridal Party — Emily & Tyler",
  description: "The 16 people standing with us on our Aspen wedding weekend.",
};

export default function BridalPartyPage() {
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
                "url('https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1600&q=80')",
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
              Our People
            </p>
            <h1 className="font-headline text-5xl md:text-8xl text-on-surface leading-[0.85] tracking-tighter mb-6 hero-reveal-title">
              The Ones{" "}
              <span className="italic font-light text-primary/80">
                Standing With Us
              </span>
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl font-light leading-relaxed hero-reveal-subtitle">
              Eight on each side — the people we&apos;ve leaned on, laughed with, and could not picture this weekend without.
            </p>
          </div>
        </div>
      </section>

      {/* Bride's Side — populated in Plan 03-02 */}
      <section id="bride-side" className="py-24 md:py-32 bg-background">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          {/* TODO(03-02): Bride's Side section header + 8 magazine rows */}
        </div>
      </section>

      {/* Groom's Side — populated in Plan 03-02 */}
      <section id="groom-side" className="py-24 md:py-32 bg-background">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          {/* TODO(03-02): Groom's Side section header + 8 magazine rows */}
        </div>
      </section>
    </main>
  );
}
