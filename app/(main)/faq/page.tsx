import Link from "next/link";

const faqs = [
  {
    question: "What is the dress code for the weekend?",
    answer:
      "For the wedding ceremony and reception, the dress code is Black Tie Optional. Gentlemen are encouraged to wear tuxedos or dark suits, and ladies are invited to wear floor-length gowns or elegant cocktail dresses. For the welcome drinks, the attire is \u201cMountain Chic\u201d\u2014think dressy but comfortable for the crisp evening air.",
    icon: "checkroom",
  },
  {
    question: "Will there be transportation provided?",
    answer:
      "Yes. Shuttles will be provided for all guests staying at our recommended hotels. Pick-up times will be listed in your welcome bags upon arrival. Since Hotel Jerome is centrally located, many guests may also find it convenient to walk from nearby downtown accommodations.",
    icon: "directions_car",
  },
  {
    question: "How should I prepare for the altitude?",
    answer:
      "Aspen sits at nearly 8,000 feet. We recommend drinking plenty of water, starting several days before you arrive. Limit alcohol consumption on your first night, and consider arriving a day early to acclimate if you are sensitive to elevation. Hydration stations will be available throughout the venue.",
    icon: "landscape",
  },
  {
    question: "Are children invited to the celebration?",
    answer:
      "While we love your little ones, our wedding ceremony and reception will be an adults-only event. We hope you will understand and enjoy the night off to celebrate with us. We can provide recommendations for local childcare services if needed.",
    icon: "family_restroom",
  },
  {
    question: "What if I have dietary restrictions?",
    answer:
      "We want everyone to enjoy their meal. Please note any allergies or dietary requirements in your RSVP response. Our catering team at Hotel Jerome is well-versed in accommodating various needs, including vegan, gluten-free, and nut-free options.",
    icon: "restaurant",
  },
];

const popularTags = [
  { label: "Dress Code", icon: "checkroom" },
  { label: "Transport", icon: "directions_car" },
  { label: "Hotels", icon: "hotel" },
  { label: "Altitude", icon: "landscape" },
];

export default function FAQPage() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-background relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,163,115,0.06)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[rgba(212,163,115,0.02)] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-[rgba(212,163,115,0.02)] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <span className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-6 block hero-reveal-label">
            Guided Information
          </span>
          <h1 className="font-headline text-5xl md:text-7xl text-on-surface mb-6 hero-reveal-title">
            Common{" "}
            <span className="italic font-light text-primary/80">
              Questions
            </span>
          </h1>
          <p className="text-on-surface-variant text-lg font-light mb-12 max-w-xl mx-auto hero-reveal-subtitle">
            Everything you need to know before your trip to the mountains.
          </p>
          <div className="relative max-w-2xl mx-auto group hero-reveal-subtitle">
            <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              className="w-full bg-surface border border-outline/30 rounded-full py-5 pl-16 pr-6 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="Search for answers..."
              type="text"
            />
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <span className="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.1em] self-center mr-2">
              Popular:
            </span>
            {popularTags.map((tag) => (
              <button
                key={tag.label}
                className="faq-tag px-5 py-2 rounded-full border border-primary/40 text-primary font-label text-[10px] uppercase tracking-[0.1em] hover:bg-primary hover:text-on-primary flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">
                  {tag.icon}
                </span>
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="pb-40 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-4 faq-accordion">
            {faqs.map((faq, i) => (
              <details
                key={faq.question}
                className="faq-card group border border-outline/10 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center gap-5 p-8 cursor-pointer list-none">
                  {/* Icon badge */}
                  <span className="faq-number shrink-0 size-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg text-primary">
                      {faq.icon}
                    </span>
                  </span>
                  <span className="flex-1 font-headline text-xl text-on-surface group-hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                  <span className="material-symbols-outlined text-primary/60 expand-icon transition-transform duration-300 shrink-0">
                    expand_more
                  </span>
                </summary>
                <div className="faq-answer">
                  <div>
                    <div className="px-8 pb-8 pl-[5.25rem]">
                      <div className="border-l-2 border-primary/15 pl-5 py-1 bg-primary/[0.02] rounded-r-lg">
                        <div className="w-8 h-px bg-primary/20 mb-4 rounded-full" />
                        <p className="text-on-surface-variant leading-relaxed font-light">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="faq-cta-card mt-20 p-12 bg-[rgba(212,163,115,0.03)] border border-outline/10 text-center rounded-xl">
            <span className="material-symbols-outlined text-primary text-4xl mb-4 block">
              mail
            </span>
            <h3 className="font-headline text-2xl text-on-surface mb-4">
              Still have questions?
            </h3>
            <p className="text-on-surface-variant font-light mb-8 max-w-md mx-auto">
              If you couldn&apos;t find what you were looking for, please
              don&apos;t hesitate to reach out to our wedding coordinator or
              contact us directly.
            </p>
            <Link
              href="mailto:hello@emilyandtyler.com"
              className="link-editorial inline-flex items-center gap-3 text-primary font-headline italic text-lg pb-1"
            >
              Send us a message
              <span className="material-symbols-outlined text-sm">
                north_east
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
