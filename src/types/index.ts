import { Guest, Rsvp, MealPreference } from './database'

// RSVP Form Types
export interface RsvpFormData {
  // Step 1: Attendance
  rehearsalDinner: boolean
  ceremony: boolean
  reception: boolean
  brunch: boolean
  guestCount: number
  plusOneName: string | null
  
  // Step 2: Meal Preferences
  mealPreference: MealPreference | null
  dietaryRestrictions: string | null
  plusOneMealPreference: MealPreference | null
  
  // Step 3: Message
  message: string | null
}

// Quiz Types
export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer?: number // For "know us" quiz
  type: 'multiple-choice' | 'text'
}

export interface KnowUsQuizAnswers {
  [questionId: string]: number
}

export interface PredictionsQuizAnswers {
  [questionId: string]: string | number
}

// Map/Travel Types
export interface Location {
  id: string
  name: string
  address: string
  description: string
  category: 'venue' | 'hotel' | 'restaurant' | 'activity'
  coordinates: {
    latitude: number
    longitude: number
  }
  priceRange?: string // For hotels/restaurants
  website?: string
  distanceFromVenue?: string
  imageUrl?: string
}

// Timeline/Story Types
export interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  imageUrl?: string
}

// Wedding Party Types
export interface WeddingPartyMember {
  id: string
  name: string
  role: 'bridesmaid' | 'groomsman' | 'maid-of-honor' | 'best-man'
  bio: string
  funFact: string
  imageUrl: string
}

// Gallery Types
export interface GalleryPhoto {
  id: string
  url: string
  caption: string
  category?: string
  order: number
}

// Admin Dashboard Types
export interface RsvpStats {
  totalGuests: number
  totalResponded: number
  totalAttending: number
  rehearsalDinnerCount: number
  ceremonyCount: number
  receptionCount: number
  brunchCount: number
  mealPreferences: {
    beef: number
    chicken: number
    vegetarian: number
    vegan: number
  }
  dietaryRestrictions: string[]
}

export interface QuizStats {
  knowUsQuiz: {
    totalResponses: number
    averageScore: number
    topScorers: { guestName: string; score: number }[]
  }
  predictionsQuiz: {
    totalResponses: number
    responses: { [questionId: string]: { [answer: string]: number } }
  }
}

// Auth Types
export interface AuthUser {
  id: string
  email: string
  guest: Guest
}
