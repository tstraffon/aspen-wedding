import Link from "next/link";

const activities = [
  {
    title: "Hiking Maroon Bells",
    description:
      "Witness the most photographed peaks in North America. We recommend the Scenic Loop trail for stunning alpine reflections.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC-e3F8GEmzgR-G5Gc-vp2iUhgKaffv0tIlOuaXlgxwhbwi7R3XUN9YOg1NHp-vCtIFsSq5nfA3pQsjx690JubuFycS3gPLt7hWzI7PpNK1c1DqCMPbD3T6PpkHL8bwvjNZZo09igMyL2GgkpDOAAEkZ0DQiXEhG2Y0z8wxIl9sRJexkNkOZXDSYZwH8pEvQ9ooasIFJVCn0ZnoH4-r-dGVHuyN9bZwZkm8XhI_wy20bTwu1ocVIVYEuepWHX56mWF90g4_9qOgFBk",
    alt: "Hiking Maroon Bells",
  },
  {
    title: "Aspen Art Museum",
    description:
      "Explore contemporary exhibitions in a stunning Shigeru Ban-designed building, complete with a rooftop café offering valley views.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkvNV5x45z9n5rCEw8jIzboRSqXFAawatABZTQK1slsMXO_ogVrwt4v4QZEAWHt8by5BQ5coeYQPiwKEacs2IhIn8HYnqlpuXEhVG0SlCs9NUvPtJdAJXIgOIZ8Bu1Piyr7S--Aunh6bA8Cxn4RgYpUAFOkwACGstRq8esbBhbE_6fV59X7a_scT_jeXzDZJ0Aet9qhMoKDYNM4ptesyQDckhO1h9jPF6G-xWHrkug9jfuCNOnlIjhBIXvkzq4bugxi6CFvuQoiDY",
    alt: "Aspen Art Museum",
  },
  {
    title: "Downtown Stroll",
    description:
      "Spend an afternoon exploring the high-end boutiques and historic architecture of downtown Aspen, just steps from Hotel Jerome.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoQRodNydJa8qkzxEvnoXDtaG77XbFK8x-SSbk81iAZQlMOBn5myJqX3E7IoC8pEXokXOnGBAFOIiyPBLfzLVA2rCYUu0qAg_wYLK6DXoMkhJqlNgKX-VkrGBYkX4ZR6NARdEX1P82Wa6S5RhrWMtDPOm-81h4INJU_HTHy1picKt3fdftuxJiRDve-CMbvkTyEkacLGixH2khvudeJqjjHwGiXvK49XUzE5gDEP8xCO-PugBKBQxohiQSISRVxCKb47b3zgMLQjc",
    alt: "Shopping on Main St",
  },
  {
    title: "Mountain Riding",
    description:
      "Experience the high country on horseback. Guided tours take you through golden aspen groves and meadow vistas.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKWlGrvgurZSyj-PFHZk2-OLsdM3qSKjEs0Nb80ux_2MYr6jjnecmdcjW3lG0RNMvQzC5ukpApGcaPzJXLdo_bKek1ieBB8pnMxyHtzLbGgg3tk3Wg07XhxJWgVtU7PQWQTpgamYzr4SL5_SnqiPIvMms3jwRzEJIT4mUGoUwGb2AaaDLF5NNGgfp00DF45cEGMQJcHcLWncg6dj-Pt3d-MMc2o8Q1zcM8Id3NW6OC73oZlJAFqLZiwya3-RAAwehyRFy66SGatRY",
    alt: "Horseback Riding",
  },
  {
    title: "Fly Fishing",
    description:
      "The Roaring Fork River offers world-class fly fishing. Local guides can tailor a trip for beginners and experts alike.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDAQjylx4TMUfjgV6hdL3nsCJ0BPIeTVdbIiMjQU_10E10SXCzdj82cUXewoILawb3G7P0kUQ6FQqv8lOJGt6yMwnuOzISrjF6dghMkwbYNheYGvfjxO1BFZy7ZpOZ63KF6zCtQ7dAdmTjz_ytjWLjMCWZ0nXkMikF1MA4_KmJgviFcFsYhzsLACqQqI_vzWYfcHdxivpNPGe-dMb1xen5Zirt88Z1i2OKpgPmTGWxMD4qpCJ9y90J6qGTdHTiCQZ1-_hgkUX02OSM",
    alt: "Fly Fishing",
  },
  {
    title: "Gondola Summit",
    description:
      "Ride the Silver Queen Gondola to the top of Aspen Mountain for panoramic views, hiking trails, and the Sundeck restaurant.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJjfg4ImyvJtJFa2A63FIWLYdqf5ui4wPsdt8DnC9Z0R5lpfYc9UyPJ30iIpTE5HTFi0aDyfp3SNNr45_DNifF1MkijtauLpmqTHaoFmLXlTeDfDkU3znqAwvMznPCN8qlXA32I_a0cbutFJzdtfOvNa-09z7X_ywsqAbuwxGULQ_u0LmThfkzoroqetg7Pi-ogGGIWJedQfKsSLAWtR8gmGeYwPNH_Tz9e2SkK7maWoVZaJv6vIbcPMY_rc8Ben3Xbo8mIhFihLc",
    alt: "Silver Queen Gondola",
  },
];

export default function ThingsToDoPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[614px] w-full overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
 <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/foliage-from-above.jpeg')" }}
          />
          {/* <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 vignette-overlay" /> */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(13,27,30,0.05), rgba(13,27,30,0.3))",
            }}
          />
        </div>
        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-20">
          <div className="max-w-4xl">
            <p className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6">
              Explore the Area
            </p>
            <h1 className="font-headline text-5xl md:text-8xl text-on-surface leading-[0.85] tracking-tighter mb-4">
              Things{" "}
              <span className="italic font-light text-primary/80">To Do</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Activity Grid Section */}
      <section className="py-16 bg-background relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <span className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 block">
                Curated Experiences
              </span>
              <h2 className="font-headline text-4xl md:text-6xl text-on-surface">
                Discover Aspen
              </h2>
            </div>
            <p className="text-on-surface-variant max-w-sm text-sm font-light leading-relaxed">
              We&apos;ve gathered a few of our favorite local spots and
              activities to help you make the most of your mountain getaway.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {activities.map((activity) => (
              <div key={activity.title} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-surface-variant/50 mb-8 overflow-hidden relative">
                  <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={activity.alt}
                    className="w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-110"
                    src={activity.image}
                  />
                </div>
                <h3 className="font-headline text-2xl text-on-surface mb-3 group-hover:text-primary transition-colors">
                  {activity.title}
                </h3>
                <p className="text-on-surface-variant text-base leading-relaxed mb-6 font-light">
                  {activity.description}
                </p>
                <span className="font-headline italic text-primary text-sm editorial-underline inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn More
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Jerome Section */}
      <section className="py-40 bg-surface border-y border-outline/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="bg-surface-variant/40 border border-outline/15 overflow-hidden flex flex-col lg:flex-row shadow-2xl">
            <div className="flex-1 p-12 md:p-24 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
              <span className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 block">
                The Home Base
              </span>
              <h2 className="font-headline text-5xl md:text-6xl text-on-surface mb-10 leading-tight">
                Hotel Jerome
              </h2>
              <p className="text-on-surface-variant text-lg mb-12 max-w-md font-light">
                A landmark of mountain luxury since 1889, this historic hotel
                provides a timeless backdrop for our celebration in downtown
                Aspen.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <span className="material-symbols-outlined text-primary">
                    location_on
                  </span>
                  <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface">
                    330 E Main St, Aspen, CO
                  </span>
                </div>
              </div>
              <Link
                href="/#travel"
                className="mt-16 inline-block bg-outline text-on-surface px-12 py-4 font-label text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-all"
              >
                View Wedding Details
              </Link>
            </div>
            <div className="flex-1 min-h-[400px] relative">
              <div
                className="w-full h-full bg-cover bg-center grayscale-[0.1]"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDAQjylx4TMUfjgV6hdL3nsCJ0BPIeTVdbIiMjQU_10E10SXCzdj82cUXewoILawb3G7P0kUQ6FQqv8lOJGt6yMwnuOzISrjF6dghMkwbYNheYGvfjxO1BFZy7ZpOZ63KF6zCtQ7dAdmTjz_ytjWLjMCWZ0nXkMikF1MA4_KmJgviFcFsYhzsLACqQqI_vzWYfcHdxivpNPGe-dMb1xen5Zirt88Z1i2OKpgPmTGWxMD4qpCJ9y90J6qGTdHTiCQZ1-_hgkUX02OSM')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* RSVP CTA Section */}
      <section className="py-40 bg-background text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,163,115,0.02)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="font-headline text-6xl md:text-8xl text-on-surface mb-10 leading-[1.1]">
            See You in <br />
            <span className="italic text-primary">September.</span>
          </h2>
          <p className="text-on-surface-variant text-xl mb-16 italic font-headline font-light">
            &ldquo;Where the air is thin and the hearts are full.&rdquo;
          </p>
          <div className="flex justify-center">
            <Link
              href="/rsvp"
              className="bg-primary text-on-primary px-16 py-5 font-label text-xs uppercase tracking-[0.3em] hover:brightness-110 shadow-xl transition-all"
            >
              Confirm Attendance
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
