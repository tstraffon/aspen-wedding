'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/wedding-party', label: 'Wedding Party' },
  { href: '/details', label: 'Details' },
  { href: '/travel', label: 'Travel' },
  { href: '/faq', label: 'FAQ' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/registry', label: 'Registry' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white shadow-lg py-3'
            : 'bg-white/95 backdrop-blur-sm py-4'
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo / Names */}
            <Link
              href="/"
              className="font-serif text-xl md:text-2xl font-bold text-aspen-forest hover:text-aspen-copper transition-colors"
            >
              <span className="hidden sm:inline">Emily & Tyler</span>
              <span className="sm:hidden">E & T</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-sans text-sm font-medium transition-colors relative group',
                    pathname === link.href
                      ? 'text-aspen-copper'
                      : 'text-aspen-forest hover:text-aspen-copper'
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute -bottom-1 left-0 h-0.5 bg-aspen-copper transition-all duration-300',
                      pathname === link.href
                        ? 'w-full'
                        : 'w-0 group-hover:w-full'
                    )}
                  />
                </Link>
              ))}

              {/* RSVP Button */}
              <Link
                href="/rsvp"
                className="px-6 py-2 bg-aspen-copper text-white font-sans text-sm font-semibold rounded-full hover:bg-aspen-rust transition-colors shadow-md hover:shadow-lg"
              >
                RSVP
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-aspen-forest hover:text-aspen-copper transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden transition-all duration-300',
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            'absolute top-[72px] right-0 w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 h-[calc(100vh-72px)] overflow-y-auto',
            isOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block py-3 px-4 rounded-lg font-sans text-base font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-aspen-copper text-white'
                    : 'text-aspen-forest hover:bg-aspen-cream'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* RSVP Button */}
            <Link
              href="/rsvp"
              className="block py-3 px-4 bg-aspen-copper text-white text-center font-sans text-base font-semibold rounded-lg hover:bg-aspen-rust transition-colors shadow-md"
            >
              RSVP
            </Link>

            {/* Decorative Element */}
            <div className="pt-6 mt-6 border-t border-aspen-cream text-center">
              <p className="text-4xl mb-2">🏔️</p>
              <p className="text-sm text-aspen-stone">
                September 19, 2026
              </p>
              <p className="text-sm text-aspen-stone">
                Aspen, Colorado
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-[72px]" />
    </>
  )
}
