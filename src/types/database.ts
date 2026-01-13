export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      guests: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          household_group: string | null
          plus_one_allowed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          household_group?: string | null
          plus_one_allowed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          household_group?: string | null
          plus_one_allowed?: boolean
          created_at?: string
        }
      }
      rsvps: {
        Row: {
          id: string
          guest_id: string
          rehearsal_dinner: boolean
          ceremony: boolean
          reception: boolean
          brunch: boolean
          meal_preference: string | null
          dietary_restrictions: string | null
          guest_count: number
          plus_one_name: string | null
          message: string | null
          submitted_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guest_id: string
          rehearsal_dinner?: boolean
          ceremony?: boolean
          reception?: boolean
          brunch?: boolean
          meal_preference?: string | null
          dietary_restrictions?: string | null
          guest_count?: number
          plus_one_name?: string | null
          message?: string | null
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guest_id?: string
          rehearsal_dinner?: boolean
          ceremony?: boolean
          reception?: boolean
          brunch?: boolean
          meal_preference?: string | null
          dietary_restrictions?: string | null
          guest_count?: number
          plus_one_name?: string | null
          message?: string | null
          submitted_at?: string
          updated_at?: string
        }
      }
      quiz_responses: {
        Row: {
          id: string
          guest_id: string
          quiz_type: 'know_us' | 'predictions'
          answers: Json
          score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          guest_id: string
          quiz_type: 'know_us' | 'predictions'
          answers: Json
          score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          guest_id?: string
          quiz_type?: 'know_us' | 'predictions'
          answers?: Json
          score?: number | null
          created_at?: string
        }
      }
      gallery_reactions: {
        Row: {
          id: string
          guest_id: string
          photo_id: string
          reaction: string
          created_at: string
        }
        Insert: {
          id?: string
          guest_id: string
          photo_id: string
          reaction: string
          created_at?: string
        }
        Update: {
          id?: string
          guest_id?: string
          photo_id?: string
          reaction?: string
          created_at?: string
        }
      }
    }
  }
}

// Helper types
export type Guest = Database['public']['Tables']['guests']['Row']
export type Rsvp = Database['public']['Tables']['rsvps']['Row']
export type QuizResponse = Database['public']['Tables']['quiz_responses']['Row']
export type GalleryReaction = Database['public']['Tables']['gallery_reactions']['Row']

export type MealPreference = 'beef' | 'chicken' | 'vegetarian' | 'vegan'
export type ReactionType = 'love' | 'laugh' | 'wow'
