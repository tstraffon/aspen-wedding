import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tyler & [Partner] - September 19, 2026 - Aspen, Colorado',
  description: 'Join us in celebrating our wedding in the beautiful Rocky Mountains of Aspen, Colorado on September 19, 2026',
  keywords: ['wedding', 'Aspen', 'Colorado', 'mountain wedding', 'Rocky Mountains'],
  authors: [{ name: 'Tyler & [Partner]' }],
  openGraph: {
    title: 'Tyler & [Partner] - Wedding',
    description: 'Join us in Aspen, Colorado on September 19, 2026',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  )
}
