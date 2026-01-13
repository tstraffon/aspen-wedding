import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, differenceInDays, parseISO } from 'date-fns'

/**
 * Merge Tailwind classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, formatStr: string = 'MMMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

/**
 * Calculate days until wedding
 */
export function getDaysUntilWedding(): number {
  const weddingDate = parseISO(process.env.NEXT_PUBLIC_WEDDING_DATE || '2026-09-19')
  return differenceInDays(weddingDate, new Date())
}

/**
 * Calculate days until RSVP deadline
 */
export function getDaysUntilRsvpDeadline(): number {
  const deadline = parseISO(process.env.NEXT_PUBLIC_RSVP_DEADLINE || '2026-08-19')
  return differenceInDays(deadline, new Date())
}

/**
 * Check if RSVP is past deadline
 */
export function isRsvpDeadlinePassed(): boolean {
  return getDaysUntilRsvpDeadline() < 0
}

/**
 * Format guest name
 */
export function formatGuestName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`
}

/**
 * Get initials from name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Get wedding date formatted
 */
export function getWeddingDate(): string {
  return formatDate(process.env.NEXT_PUBLIC_WEDDING_DATE || '2026-09-19', 'EEEE, MMMM d, yyyy')
}

/**
 * Get RSVP deadline formatted
 */
export function getRsvpDeadline(): string {
  return formatDate(process.env.NEXT_PUBLIC_RSVP_DEADLINE || '2026-08-19', 'MMMM d, yyyy')
}
