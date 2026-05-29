"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  // { label: "Our Story", href: "/#our-story" },
  { label: "Travel & Stay", href: "/travel" },
  { label: "Itinerary", href: "/itinerary" },
  { label: "Things To Do", href: "/things-to-do" },
  { label: "FAQ", href: "/faq" },
  { label: "Registry", href: "/registry" },
  { label: "RSVP", href: "/rsvp" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-outline/10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <span className="font-headline text-xl font-bold tracking-tight text-on-surface">
            E&amp;T
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map(({ label, href }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : href.startsWith("/#")
                  ? pathname === "/"
                  : pathname.startsWith(href);
            return (
              <Link
                key={label}
                href={href}
                className={`font-label text-[10px] uppercase tracking-[0.2em] transition-colors ${
                  isActive && href === pathname
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <button
          className="md:hidden text-on-surface"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="material-symbols-outlined text-2xl">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>

      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-2 flex flex-col gap-5 border-t border-outline/10">
          {links.map(({ label, href }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : href.startsWith("/#")
                  ? pathname === "/"
                  : pathname.startsWith(href);
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`font-label text-xs uppercase tracking-[0.2em] transition-colors ${
                  isActive && href === pathname
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
