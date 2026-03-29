import Link from "next/link";

const faqs = [
  {
    question: "What is the dress code for the weekend?",
    answer:
      "For the wedding ceremony and reception, the dress code is Black Tie Optional. Tuxes are absolutely welcome, but the groom will be in a dark suit - so a nice suit is just as perfect. Ladies are invited to wear floor-length gowns or elegant cocktail dresses. \n\nFor the welcome party, the attire is Western Elegance - think dressy but comfortable, and finally giving those cowboy boots, hats, or bolo ties (!) the moment they deserve at Aspen’s oldest saloon!",
    icon: "checkroom",
  },
  {
    question: "Will there be transportation provided?",
    answer:
      "In short, no. Downtown Aspen is very walkable and our recommended hotels are all within a 10 min walk of all the weekend's events. With Aspen's beautiful fall weather, walking too and from each venue will be idyllic!",
    icon: "directions_car",
  },
  {
    question: "How should I prepare for the altitude?",
    answer:
      "Aspen sits at nearly 8,000 feet. We recommend drinking plenty of water, starting several days before you arrive. Limit alcohol consumption on your first night, and consider arriving a day early to acclimate if you are sensitive to elevation.",
    icon: "landscape",
  },
  {
    question: "What will the weather be like in September?",
    answer:
      "Mid-September in Aspen is absolutely gorgeous. Expect daytime highs in the mid-60s\u00b0F and cooler evenings dipping into the low 40s\u00b0F. The aspen trees should be starting to turn gold, making for a stunning backdrop. We recommend bringing layers\u2014a light jacket or wrap for the evening will be your best friend.",
    icon: "partly_cloudy_day",
  },
  {
    question: "What airport should I fly into?",
    answer:
      "The closest airport is Aspen/Pitkin County Airport (ASE), just a few minutes from downtown. Denver International Airport (DEN) is another option, about a four-hour scenic drive. Visit our Travel & Stay page for more details on getting here.",
    link: { label: "Travel & Stay", href: "/travel" },
    icon: "flight",
  },
  {
    question: "Where should I stay?",
    answer:
      "We recommend staying in downtown Aspen to be within walking distance of both the ceremony and reception venues. Head over to our Travel & Stay page for our top hotel picks and booking details.",
    link: { label: "Travel & Stay", href: "/travel" },
    icon: "hotel",
  },
  {
    question: "Are children invited to the celebration?",
    answer:
      "While we love your little ones, our wedding ceremony and reception will be an adults-only event. We hope you will understand and enjoy the night off to celebrate with us.",
    icon: "family_restroom",
  },
  {
    question: "What if I have dietary restrictions?",
    answer:
      "We want everyone to enjoy their meal. Please note any allergies or dietary requirements in your RSVP response. Our catering team at Hotel Jerome is well-versed in accommodating various needs, including vegan, gluten-free, and nut-free options.",
    icon: "restaurant",
  },
];

export default function FAQPage() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20 bg-background relative overflow-hidden">
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
          <p className="text-on-surface-variant text-lg font-light mb-0 max-w-xl mx-auto hero-reveal-subtitle">
            Everything you need to know before your trip to the mountains.
          </p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="pb-28 md:pb-36 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-3 md:space-y-4 faq-accordion">
            {faqs.map((faq, i) => (
              <details
                key={faq.question}
                className="faq-card group border border-outline/10 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center gap-4 md:gap-5 px-6 py-5 md:p-8 cursor-pointer list-none">
                  {/* Icon badge */}
                  <span className="faq-number shrink-0 size-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg text-primary">
                      {faq.icon}
                    </span>
                  </span>
                  <span className="flex-1 font-headline text-lg md:text-xl text-on-surface group-hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                  <span className="material-symbols-outlined text-primary/60 expand-icon transition-transform duration-300 shrink-0">
                    expand_more
                  </span>
                </summary>
                <div className="faq-answer">
                  <div>
                    <div className="px-6 pb-6 pl-16 md:px-8 md:pb-8 md:pl-[5.25rem]">
                      <div className="border-l-2 border-primary/15 pl-5 py-1 bg-primary/[0.02] rounded-r-lg">
                        <div className="w-8 h-px bg-primary/20 mb-4 rounded-full" />
                        <p className="text-on-surface-variant leading-relaxed font-light whitespace-pre-line">
                          {faq.answer}
                          {"link" in faq && faq.link && (
                            <>
                              {" "}
                              <Link href={faq.link.href} className="text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-colors">
                                {faq.link.label} &rarr;
                              </Link>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="faq-cta-card mt-16 md:mt-20 p-8 md:p-12 bg-[rgba(212,163,115,0.03)] border border-outline/10 text-center rounded-xl">
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
              href="mailto:tylerstraffon@gmail.com"
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
