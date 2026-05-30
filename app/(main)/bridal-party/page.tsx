import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bridal Party — Emily & Tyler",
  description: "The 16 people standing with us on our Aspen wedding weekend.",
};

type Member = {
  name: string;
  role: string;
  photo: string | null;
  bio: string;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const brideSide: Member[] = [
  {
    name: "Sarah Else",
    role: "MAID OF HONOR",
    photo: "/bridal-party/sarah-else.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
  {
    name: "Emily Asinger",
    role: "BRIDESMAID",
    photo: "/bridal-party/emily-asinger.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
  {
    name: "Lindsay Carr",
    role: "BRIDESMAID",
    photo: "/bridal-party/lindsay-carr.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
  {
    name: "Sarah Horan",
    role: "BRIDESMAID",
    photo: "/bridal-party/sarah-horan.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
  {
    name: "Sam Jones",
    role: "BRIDESMAID",
    photo: "/bridal-party/sam-jones.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
  {
    name: "Shannon Robins",
    role: "BRIDESMAID",
    photo: "/bridal-party/shannon-robins.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
  {
    name: "Michelle Spencer",
    role: "BRIDESMAID",
    photo: "/bridal-party/michelle-spencer.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
  {
    name: "Ryan Hindle",
    role: "BRIDESMAID",
    photo: "/bridal-party/ryan-hindle.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
];

const groomSide: Member[] = [
  {
    name: "Dylan Straffon",
    role: "BEST MAN",
    photo: "/bridal-party/dylan-straffon.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
  {
    name: "Aaron Sorge",
    role: "GROOMSMAN",
    photo: "/bridal-party/aaron-sorge.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
  {
    name: "Jack Cardello",
    role: "GROOMSMAN",
    photo: "/bridal-party/jack-cardello.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
  {
    name: "Ken Kinoshita",
    role: "GROOMSMAN",
    photo: "/bridal-party/ken-kinoshita.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
  {
    name: "Jon Metz",
    role: "GROOMSMAN",
    photo: "/bridal-party/jon-metz.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
  {
    name: "Ian Adams",
    role: "GROOMSMAN",
    photo: "/bridal-party/ian-adams.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
  {
    name: "Collin DeMatt",
    role: "GROOMSMAN",
    photo: "/bridal-party/collin-dematt.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
  {
    name: "Josh Tallman",
    role: "GROOMSMAN",
    photo: "/bridal-party/josh-tallman.jpg",
    // TODO: replace with real bio
    bio: "A dear friend to both of us — we're so glad they're standing with us.",
  },
];

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="reveal-on-scroll">
      <div className="aspect-[4/5] bg-surface-variant/50 overflow-hidden relative max-w-xs mx-auto mb-6">
        {member.photo ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`Portrait of ${member.name}`}
              className="w-full h-full object-cover"
              src={member.photo}
            />
          </>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-surface-container"
            aria-hidden="true"
          >
            <span
              className="font-headline italic text-4xl md:text-5xl text-primary"
              aria-hidden="true"
            >
              {getInitials(member.name)}
            </span>
          </div>
        )}
      </div>
      <div className="max-w-xs mx-auto text-center">
        <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary mb-3 block">
          {member.role}
        </span>
        <h3 className="font-headline text-xl md:text-2xl text-on-surface mb-3">
          {member.name}
        </h3>
        <p className="text-on-surface-variant text-base font-light leading-relaxed">
          {member.bio}
        </p>
      </div>
    </div>
  );
}

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

      {/* Wedding Party — side-by-side columns */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-20 md:gap-y-0">
            {/* Bride's Side column */}
            <div id="bride-side">
              <div className="mb-12 md:mb-16 text-center reveal-on-scroll">
                <span className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-4 block">
                  THE BRIDE&apos;S SIDE
                </span>
                <h2 className="font-headline text-3xl md:text-5xl text-on-surface">
                  Bride&apos;s{" "}
                  <span className="italic font-light text-primary/80">Side</span>
                </h2>
              </div>
              <div className="flex flex-col gap-y-16 md:gap-y-20">
                {brideSide.map((member) => (
                  <MemberCard key={member.name} member={member} />
                ))}
              </div>
            </div>

            {/* Groom's Side column */}
            <div id="groom-side">
              <div className="mb-12 md:mb-16 text-center reveal-on-scroll">
                <span className="font-label text-xs uppercase tracking-[0.4em] text-primary mb-4 block">
                  THE GROOM&apos;S SIDE
                </span>
                <h2 className="font-headline text-3xl md:text-5xl text-on-surface">
                  Groom&apos;s{" "}
                  <span className="italic font-light text-primary/80">Side</span>
                </h2>
              </div>
              <div className="flex flex-col gap-y-16 md:gap-y-20">
                {groomSide.map((member) => (
                  <MemberCard key={member.name} member={member} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
