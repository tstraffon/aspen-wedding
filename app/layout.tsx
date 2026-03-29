import type { Metadata } from "next";
import { Noto_Serif, Manrope } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-noto-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Emily & Tyler — Aspen Wedding",
  description:
    "Emily & Tyler are getting married on September 19, 2026, in Aspen, Colorado. Join us for a weekend of love and celebration in the heart of the Rocky Mountains.",
  openGraph: {
    title: "Emily & Tyler — Aspen Wedding",
    description:
      "Emily & Tyler are getting married on September 19, 2026, in Aspen, Colorado. Join us for a weekend of celebration in the Rocky Mountains.",
    siteName: "Emily & Tyler Wedding",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${notoSerif.variable} ${manrope.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body suppressHydrationWarning className="bg-background text-on-surface font-body selection:bg-primary/30 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
