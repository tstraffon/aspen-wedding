import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="cinematic-section">
        <div
          className="full-bleed-bg hero-parallax-bg"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCcr-qtAAxsD5Xkwdcc6jbCLs9ivZTu2jZWmkC3CV98hvtzOcxtnEWJs7fLZxcWVZB0cQkeFZe4oR4wbUgSLWv6TdDKbmEGMBhnknOx0mFSZrQ165wYfczgPXSvc9jvR8Nsb8V9qeHFPY56MmTk3NQBhvnmUXjJnZsQHQEODu0fgtrwWBSicoXxNnXkPcdqpOIjd737wKHGg3FE7bOyHUFvjzXfpUXrJ7ghkMYHBj4V-uYgRGc4z_DF-M4aHer44QKE4Ed-L6gsZLM')",
          }}
        />
        <div className="absolute inset-0 scrim-dark" />
        <div className="content-overlay flex flex-col items-center justify-center text-center">
          <p className="font-label text-xs md:text-sm uppercase tracking-[0.5em] text-primary mb-8 md:mb-10 hero-reveal-label">
            September 19, 2026 &bull; Aspen, Colorado
          </p>
          <h1 className="font-headline text-7xl md:text-9xl lg:text-[11rem] text-on-surface leading-[0.85] tracking-tighter mb-10 md:mb-14 hero-reveal-title">
            Emily{" "}
            <span className="italic font-light text-primary/80 ampersand-breathe">&amp;</span>
            <br />
            Tyler
          </h1>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center hero-reveal-subtitle">
            <Link
              href="/#details"
              className="bg-outline/40 backdrop-blur-md text-on-surface border border-outline px-12 py-5 font-label text-xs uppercase tracking-[0.3em] hover:bg-primary hover:text-on-primary transition-all btn-press"
            >
              View Wedding Details
            </Link>
            <Link
              href="/#our-story"
              className="text-on-surface-variant font-headline italic text-xl editorial-underline flex items-center gap-3 group"
            >
              The Journey Starts Here
              <span className="material-symbols-outlined text-primary group-hover:translate-y-2 transition-transform arrow-bounce-hint">
                arrow_downward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="cinematic-section items-start pt-24 pb-16 md:items-center md:pt-0 md:pb-0" id="details">
        <div
          className="full-bleed-bg parallax-bg"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCJjfg4ImyvJtJFa2A63FIWLYdqf5ui4wPsdt8DnC9Z0R5lpfYc9UyPJ30iIpTE5HTFi0aDyfp3SNNr45_DNifF1MkijtauLpmqTHaoFmLXlTeDfDkU3znqAwvMznPCN8qlXA32I_a0cbutFJzdtfOvNa-09z7X_ywsqAbuwxGULQ_u0LmThfkzoroqetg7Pi-ogGGIWJedQfKsSLAWtR8gmGeYwPNH_Tz9e2SkK7maWoVZaJv6vIbcPMY_rc8Ben3Xbo8mIhFihLc')",
          }}
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="content-overlay reveal-on-scroll">
          <div className="flex flex-col items-center text-center mb-12 md:mb-20">
            <span className="font-label text-xs uppercase tracking-[0.5em] text-primary mb-4 md:mb-6 hidden md:block">
              Join Us In
            </span>
            <h2 className="font-headline text-4xl md:text-7xl text-on-surface">
              A Weekend of Celebration
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto reveal-on-scroll-stagger">
            <Link
              href="/travel"
              className="bg-surface-variant/20 backdrop-blur-xl border border-outline/20 p-8 md:p-12 hover:bg-surface-variant/40 transition-all cursor-pointer group"
            >
              <h3 className="font-headline text-3xl text-primary mb-6">
                Travel &amp; Stay
              </h3>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                Everything you need to navigate your journey to the Rocky
                Mountains, from flights to lodging.
              </p>
              <span className="material-symbols-outlined text-primary group-hover:translate-x-3 transition-transform">
                arrow_forward
              </span>
            </Link>
            <Link
              href="/itinerary"
              className="bg-surface-variant/20 backdrop-blur-xl border border-outline/20 p-8 md:p-12 hover:bg-surface-variant/40 transition-all cursor-pointer group"
            >
              <h3 className="font-headline text-3xl text-primary mb-6">
                The Itinerary
              </h3>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                A full schedule of the weekend&apos;s events, from the welcome
                dinner to the farewell brunch.
              </p>
              <span className="material-symbols-outlined text-primary group-hover:translate-x-3 transition-transform">
                arrow_forward
              </span>
            </Link>
            <Link
              href="/things-to-do"
              className="bg-surface-variant/20 backdrop-blur-xl border border-outline/20 p-8 md:p-12 hover:bg-surface-variant/40 transition-all cursor-pointer group"
            >
              <h3 className="font-headline text-3xl text-primary mb-6">
                Things to Do
              </h3>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                Explore Aspen beyond the wedding — hiking, dining, and our
                favorite local spots.
              </p>
              <span className="material-symbols-outlined text-primary group-hover:translate-x-3 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="cinematic-section items-start pt-24 pb-16 md:items-center md:pt-24 md:pb-16" id="our-story">
        <div
          className="full-bleed-bg parallax-bg"
          style={{ backgroundImage: "url('/propose.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        <div className="content-overlay reveal-on-scroll flex justify-start">
          <div className="max-w-xl text-left flex flex-col items-start">
            <span className="font-label text-xs uppercase tracking-[0.5em] text-primary mb-8 hidden md:block">
              Our Story
            </span>
            <h2 className="font-headline text-5xl md:text-8xl text-on-surface mb-12 leading-tight">
              It All Began With{" "}
              <span className="italic text-primary">Bourbon...</span>
            </h2>
            <div className="space-y-8 text-on-surface text-xl font-light leading-relaxed">
              <p>
                After living parallel lives in Cleveland/Pittsburgh and Washington, D.C., Em and Tyler independently made their way to Colorado (quarter-life crisis  ?!?!). They met through an elite friend group (hi guys!) and spent a year skiing, biking, hiking, and camping as fantastic friends.
              </p>
              <p>
                Then - thanks to a little bourbon - that changed...
              </p>
              <p>
                Two adventure-packed years (plus a DJ debut as Empty Juicebox) later, 
                Tyler planned a picture-perfect proposal in Santa Barbara. Since then, 
                they’ve been busy planning the wedding weekend of the century for their 
                favorite people - YOU!
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Gallery Section */}
      <section className="relative w-full bg-background py-24 md:py-32 overflow-hidden" id="gallery">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center text-center mb-16 reveal-on-scroll">
            <span className="font-label text-xs uppercase tracking-[0.5em] text-primary mb-6 block">
              Photo Gallery
            </span>
            <h2 className="font-headline text-5xl md:text-7xl text-on-surface">
              Our Favorite Moments
            </h2>
          </div>

          <div className="gallery-grid grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[240px] gap-2 md:gap-3">
            {/* Row 1–2: proposal tall | mountains + beach wide | kiss tall */}
            <div className="gallery-item md:row-span-2">
              <img src="/images/gallery/IMG_3040.JPG" alt="Dressed up for an evening out" className="w-full h-full object-cover object-[50%_20%]" />
            </div>
            <div className="gallery-item">
              <img src="/images/gallery/IMG_2883.jpeg" alt="Mountain adventure together" className="w-full h-full object-cover" />
            </div>
            <div className="gallery-item">
              <img src="/images/gallery/IMG_5433.jpeg" alt="Exploring the outdoors" className="w-full h-full object-cover" />
            </div>
            <div className="gallery-item md:row-span-2">
              <img src="/images/gallery/IMG_3203.jpeg" alt="Toasting together" className="w-full h-full object-cover" />
            </div>
            <div className="gallery-item md:col-span-2">
              <img src="/images/gallery/IMG_1823.JPG" alt="A scenic moment together" className="w-full h-full object-cover" />
            </div>

            {/* Row 3 */}
            <div className="gallery-item">
              <img src="/images/gallery/cpm35 2023-07-24 204531.756_Original.JPG" alt="Candid moment at an event" className="w-full h-full object-cover object-[50%_40%]" />
            </div>
            <div className="gallery-item">
              <img src="/images/gallery/IMG_5891.jpeg" alt="Emily and Tyler smiling" className="w-full h-full object-cover object-[50%_50%]" />
            </div>
            <div className="gallery-item">
              <img src="/images/gallery/IMG_7812.jpeg" alt="Tyler DJing as Empty Juicebox" className="w-full h-full object-cover object-[50%_30%]" />
            </div>
            <div className="gallery-item">
              <img src="/images/gallery/IMG_5236.jpeg" alt="Fun selfie together" className="w-full h-full object-cover object-[50%_40%]" />
            </div>

            {/* Row 4 */}
            <div className="gallery-item">
              <img src="/images/gallery/IMG_7397.jpeg" alt="Hiking through a canyon" className="w-full h-full object-cover" />
            </div>
            <div className="gallery-item md:col-span-2">
              <img src="/images/gallery/alps.JPG" alt="Adventures in the Alps" className="w-full h-full object-cover object-[50%_43%]" />
            </div>
            <div className="gallery-item">
              <img src="/images/gallery/PXL_20230729_001921991.PORTRAIT_Original.JPG" alt="Evening portrait together" className="w-full h-full object-cover object-[50%_70%]" />
            </div>

            {/* Row 5 */}
            <div className="gallery-item">
              <img src="/images/gallery/IMG_0010.JPG" alt="At a local brewery" className="w-full h-full object-cover" />
            </div>
            <div className="gallery-item">
              <img src="/images/gallery/IMG_8256.jpeg" alt="Tyler spinning tunes at a bar" className="w-full h-full object-cover object-[50%_25%]" />
            </div>
            <div className="gallery-item">
              <img src="/images/gallery/IMG_5869.jpeg" alt="On the ski slopes" className="w-full h-full object-cover object-[50%_45%]" />
            </div>
            <div className="gallery-item">
              <img src="/images/gallery/IMG_5455.jpeg" alt="Fun selfie together" className="w-full h-full object-cover object-[50%_20%]" />
            </div>
          </div>
        </div>
      </section>

      {/* RSVP CTA Section */}
      <section className="cinematic-section" id="registry">
        <div
          className="full-bleed-bg parallax-bg"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC-e3F8GEmzgR-G5Gc-vp2iUhgKaffv0tIlOuaXlgxwhbwi7R3XUN9YOg1NHp-vCtIFsSq5nfA3pQsjx690JubuFycS3gPLt7hWzI7PpNK1c1DqCMPbD3T6PpkHL8bwvjNZZo09igMyL2GgkpDOAAEkZ0DQiXEhG2Y0z8wxIl9sRJexkNkOZXDSYZwH8pEvQ9ooasIFJVCn0ZnoH4-r-dGVHuyN9bZwZkm8XhI_wy20bTwu1ocVIVYEuepWHX56mWF90g4_9qOgFBk')",
          }}
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="content-overlay reveal-on-scroll text-center">
          <h2 className="font-headline text-5xl md:text-9xl text-on-surface mb-12 leading-[1.1]">
            See You in <br />
            <span className="italic text-primary">September.</span>
          </h2>
          <p className="text-on-surface-variant text-2xl md:text-3xl mb-20 italic font-headline font-light">
            &ldquo;The mountains are calling, and I must go.&rdquo;
          </p>
          {/* RSVP CTA — re-enable when ready to collect responses */}
        </div>
      </section>
    </>
  );
}
