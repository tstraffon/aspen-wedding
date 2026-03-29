import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background py-16 ">
      <div className="divider-diamond  max-w-[1440px] mx-auto bg-background">
        <span className="material-symbols-outlined py-8 text-primary/50 text-sm diamond-scroll-reveal">diamond</span>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-16">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-8 text-primary">
            <svg
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <span className="font-headline text-2xl font-bold tracking-tight text-on-surface">
            E&amp;T
          </span>
        </Link>

        <p className="font-label text-xs uppercase tracking-[0.5em] text-on-surface-variant/90">
          Emily &amp; Tyler &bull; September 19, 2026
        </p>

      </div>
    </footer>
  );
}
