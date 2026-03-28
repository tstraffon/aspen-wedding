import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="cinematic-section">
        <div
          className="full-bleed-bg"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCcr-qtAAxsD5Xkwdcc6jbCLs9ivZTu2jZWmkC3CV98hvtzOcxtnEWJs7fLZxcWVZB0cQkeFZe4oR4wbUgSLWv6TdDKbmEGMBhnknOx0mFSZrQ165wYfczgPXSvc9jvR8Nsb8V9qeHFPY56MmTk3NQBhvnmUXjJnZsQHQEODu0fgtrwWBSicoXxNnXkPcdqpOIjd737wKHGg3FE7bOyHUFvjzXfpUXrJ7ghkMYHBj4V-uYgRGc4z_DF-M4aHer44QKE4Ed-L6gsZLM')",
          }}
        />
        {/* <div
          className="full-bleed-bg"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC-e3F8GEmzgR-G5Gc-vp2iUhgKaffv0tIlOuaXlgxwhbwi7R3XUN9YOg1NHp-vCtIFsSq5nfA3pQsjx690JubuFycS3gPLt7hWzI7PpNK1c1DqCMPbD3T6PpkHL8bwvjNZZo09igMyL2GgkpDOAAEkZ0DQiXEhG2Y0z8wxIl9sRJexkNkOZXDSYZwH8pEvQ9ooasIFJVCn0ZnoH4-r-dGVHuyN9bZwZkm8XhI_wy20bTwu1ocVIVYEuepWHX56mWF90g4_9qOgFBk')",
          }}
        />  */}
        <div className="absolute inset-0 scrim-dark" />
        <div className="content-overlay flex flex-col items-center justify-center text-center">
          <p className="font-label text-xs md:text-sm uppercase tracking-[0.5em] text-primary mb-8 md:mb-10">
            September 19, 2026 &bull; Aspen, Colorado
          </p>
          <h1 className="font-headline text-7xl md:text-9xl lg:text-[11rem] text-on-surface leading-[0.85] tracking-tighter mb-10 md:mb-14">
            Emily{" "}
            <span className="italic font-light text-primary/80">&amp;</span>
            <br />
            Tyler
          </h1>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            <Link
              href="/#details"
              className="bg-outline/40 backdrop-blur-md text-on-surface border border-outline px-12 py-5 font-label text-xs uppercase tracking-[0.3em] hover:bg-primary hover:text-on-primary transition-all"
            >
              View Wedding Details
            </Link>
            <Link
              href="/#our-story"
              className="text-on-surface-variant font-headline italic text-xl editorial-underline flex items-center gap-3 group"
            >
              The Journey Starts Here
              <span className="material-symbols-outlined text-primary group-hover:translate-y-2 transition-transform">
                arrow_downward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome / Our Story Section */}
      {/* <section className="cinematic-section" id="our-story">
        <div
          className="full-bleed-bg"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCKWlGrvgurZSyj-PFHZk2-OLsdM3qSKjEs0Nb80ux_2MYr6jjnecmdcjW3lG0RNMvQzC5ukpApGcaPzJXLdo_bKek1ieBB8pnMxyHtzLbGgg3tk3Wg07XhxJWgVtU7PQWQTpgamYzr4SL5_SnqiPIvMms3jwRzEJIT4mUGoUwGb2AaaDLF5NNGgfp00DF45cEGMQJcHcLWncg6dj-Pt3d-MMc2o8Q1zcM8Id3NW6OC73oZlJAFqLZiwya3-RAAwehyRFy66SGatRY')",
          }}
        />
        <div className="absolute inset-0 bg-background/60 backdrop-grayscale-[0.5]" />
        <div className="absolute inset-0 scrim-side" />
        <div className="content-overlay">
          <div className="max-w-2xl">
            <h2 className="font-headline text-6xl md:text-8xl text-on-surface leading-[1.1] mb-12">
              Welcome to the{" "}
              <br />
              <span className="italic text-primary">Rocky Mountains.</span>
            </h2>
            <div className="space-y-10 text-on-surface text-xl md:text-2xl leading-relaxed font-light">
              <p>
                We invite you to join us in the heart of the Rocky Mountains as
                we begin our new life together. Aspen has always been our
                sanctuary—a place of quiet strength and enduring beauty.
              </p>
              <p>
                This weekend isn&apos;t just a celebration of our union, but a
                tribute to the friends and family who have walked alongside us.
              </p>
            </div>
            <div className="mt-16">
              <span className="font-headline text-2xl text-primary editorial-underline italic cursor-pointer">
                Read Our Story
              </span>
            </div>
          </div>
        </div>
      </section> */}

      {/* Itinerary Section */}
      <section className="cinematic-section" id="details">
        {/* <div
          className="full-bleed-bg"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC-e3F8GEmzgR-G5Gc-vp2iUhgKaffv0tIlOuaXlgxwhbwi7R3XUN9YOg1NHp-vCtIFsSq5nfA3pQsjx690JubuFycS3gPLt7hWzI7PpNK1c1DqCMPbD3T6PpkHL8bwvjNZZo09igMyL2GgkpDOAAEkZ0DQiXEhG2Y0z8wxIl9sRJexkNkOZXDSYZwH8pEvQ9ooasIFJVCn0ZnoH4-r-dGVHuyN9bZwZkm8XhI_wy20bTwu1ocVIVYEuepWHX56mWF90g4_9qOgFBk')",
          }}
        /> */}
        <div
          className="full-bleed-bg"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCJjfg4ImyvJtJFa2A63FIWLYdqf5ui4wPsdt8DnC9Z0R5lpfYc9UyPJ30iIpTE5HTFi0aDyfp3SNNr45_DNifF1MkijtauLpmqTHaoFmLXlTeDfDkU3znqAwvMznPCN8qlXA32I_a0cbutFJzdtfOvNa-09z7X_ywsqAbuwxGULQ_u0LmThfkzoroqetg7Pi-ogGGIWJedQfKsSLAWtR8gmGeYwPNH_Tz9e2SkK7maWoVZaJv6vIbcPMY_rc8Ben3Xbo8mIhFihLc')",
          }}
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="content-overlay">
          <div className="flex flex-col items-center text-center mb-20">
            <span className="font-label text-xs uppercase tracking-[0.5em] text-primary mb-6 block">
              Join Us In
            </span>
            <h2 className="font-headline text-5xl md:text-7xl text-on-surface">
              A Weekend of Celebration
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Link
              href="/travel"
              className="bg-surface-variant/20 backdrop-blur-xl border border-outline/20 p-12 hover:bg-surface-variant/40 transition-all cursor-pointer group"
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
              className="bg-surface-variant/20 backdrop-blur-xl border border-outline/20 p-12 hover:bg-surface-variant/40 transition-all cursor-pointer group"
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
              className="bg-surface-variant/20 backdrop-blur-xl border border-outline/20 p-12 hover:bg-surface-variant/40 transition-all cursor-pointer group"
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
          <div className="text-center mt-16">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant border-b border-on-surface-variant/30 pb-2 hover:text-primary hover:border-primary transition-colors cursor-pointer">
              Download Full Schedule
            </span>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="cinematic-section" id="our-story">
        <div
          className="full-bleed-bg"
          style={{ backgroundImage: "url('/propose.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        <div className="content-overlay flex justify-start">
          <div className="max-w-xl text-left flex flex-col items-start">
            <span className="font-label text-xs uppercase tracking-[0.5em] text-primary mb-8 block">
              Our Story
            </span>
            <h2 className="font-headline text-6xl md:text-8xl text-on-surface mb-12 leading-tight">
              It All Began With{" "}
              <span className="italic text-primary">Bourbon...</span>
            </h2>
            <div className="space-y-8 text-on-surface text-xl font-light leading-relaxed">
              <p>
                What started as a chance meeting turned into late-night
                conversations, weekend adventures, and a love neither of us saw
                coming. Somewhere between the laughter and the quiet moments, we
                knew we&apos;d found something rare.
              </p>
              <p>
                From city sidewalks to mountain trails, every chapter has led us
                here—to Aspen, to the place where we said &ldquo;yes,&rdquo; and
                now to the moment we say &ldquo;I do.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>


       {/* Venue  Section */}
      <section className="cinematic-section" id="travel">
        <div
          className="full-bleed-bg"
          style={{
            backgroundImage:
              "url('https://www.aspensnowmass.com/-/media/aspen-snowmass/images/hero/hero-image/winter/2021-22/lodging-alliance-hero-images/hotel-jerome-hero-20210824.jpg?mw=1506&mh=538&hash=F9FDE64ABF2980D7FC93B58016DA9DCF')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background/90 via-background/40 to-transparent" />
        <div className="content-overlay flex justify-end">
          <div className="max-w-xl text-right flex flex-col items-end">
            <span className="font-label text-xs uppercase tracking-[0.5em] text-primary mb-8 block">
              The Venue
            </span>
            <h2 className="font-headline text-6xl md:text-8xl text-on-surface mb-12 leading-tight">
              Hotel Jerome
            </h2>
            <p className="text-on-surface text-xl mb-12 font-light leading-relaxed">
              A landmark of mountain luxury since 1889, this historic hotel
              provides a timeless backdrop for our celebration in downtown Aspen.
            </p>
            <div className="space-y-8 flex flex-col items-end">
              <div className="flex items-center gap-5 justify-end">
                <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface">
                  330 E Main St, Aspen, CO
                </span>
                <span className="material-symbols-outlined text-primary">
                  location_on
                </span>
              </div>
              <div className="flex items-center gap-5 justify-end">
                <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface">
                  Ceremony starts at 4:30 PM
                </span>
                <span className="material-symbols-outlined text-primary">
                  schedule
                </span>
              </div>
            </div>
            <Link
              href="/#travel"
              className="mt-16 bg-primary text-on-primary px-12 py-5 font-label text-xs uppercase tracking-[0.3em] hover:brightness-110 transition-all"
            >
              Get Directions
            </Link>
          </div>
        </div>
      </section>

      {/* RSVP CTA Section */}
      <section className="cinematic-section" id="registry">
        <div
          className="full-bleed-bg"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC-e3F8GEmzgR-G5Gc-vp2iUhgKaffv0tIlOuaXlgxwhbwi7R3XUN9YOg1NHp-vCtIFsSq5nfA3pQsjx690JubuFycS3gPLt7hWzI7PpNK1c1DqCMPbD3T6PpkHL8bwvjNZZo09igMyL2GgkpDOAAEkZ0DQiXEhG2Y0z8wxIl9sRJexkNkOZXDSYZwH8pEvQ9ooasIFJVCn0ZnoH4-r-dGVHuyN9bZwZkm8XhI_wy20bTwu1ocVIVYEuepWHX56mWF90g4_9qOgFBk')",
          }}
        /> 
        <div className="absolute inset-0 bg-background/80" />
        <div className="content-overlay text-center">
          <h2 className="font-headline text-7xl md:text-9xl text-on-surface mb-12 leading-[1.1]">
            See You in <br />
            <span className="italic text-primary">September.</span>
          </h2>
          <p className="text-on-surface-variant text-2xl md:text-3xl mb-20 italic font-headline font-light">
            &ldquo;The mountains are calling, and I must go.&rdquo;
          </p>
          {/* <div className="flex justify-center">
            <Link
              href="/rsvp"
              className="bg-primary text-on-primary px-20 py-6 font-label text-sm uppercase tracking-[0.4em] hover:scale-105 shadow-2xl transition-all"
            >
              Confirm Attendance
            </Link>
          </div> */}
        </div>
      </section>
    </>
  );
}
