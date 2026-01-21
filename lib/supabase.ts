import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Check if we're in build mode
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SUPABASE_URL

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Client for public operations (anonymous access)
// Used for reading public data like active flavors, app settings
export const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Client for server-side operations with service role
// Used in API routes for write operations and admin functions
export const supabaseAdmin: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Client specifically for admin authentication
// Used in admin panel with full auth capabilities
export const supabaseAuth: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Authentication utilities for admin users
export const authHelpers = {
  // Sign in admin user
  async signInAdmin(email: string, password: string) {
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out admin user
  async signOutAdmin() {
    const { error } = await supabaseAuth.auth.signOut()
    return { error }
  },

  // Get current admin session
  async getAdminSession() {
    const { data: { session }, error } = await supabaseAuth.auth.getSession()
    return { session, error }
  },

  // Get current admin user
  async getAdminUser() {
    const { data: { user }, error } = await supabaseAuth.auth.getUser()
    return { user, error }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabaseAuth.auth.onAuthStateChange(callback)
  }
}

// Type exports for convenience
export type { Database } from '@/types/supabase'
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']