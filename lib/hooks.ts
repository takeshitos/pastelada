'use client'

import { useState, useEffect } from 'react'
import { supabase, authHelpers } from './supabase'
import type { Tables } from './supabase'

// Hook for fetching active flavors
export function useActiveFlavors() {
  const [flavors, setFlavors] = useState<Tables<'flavors'>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFlavors = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('flavors')
        .select('*')
        .eq('active', true)
        .order('name')

      if (fetchError) {
        throw fetchError
      }

      setFlavors(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch flavors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlavors()
  }, [])

  return { flavors, loading, error, refetch: fetchFlavors }
}

// Hook for fetching app settings (price, PIX QR)
export function useAppSettings() {
  const [settings, setSettings] = useState<Tables<'app_settings'> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('app_settings')
        .select('*')
        .eq('id', 1)
        .single()

      if (fetchError) {
        throw fetchError
      }

      setSettings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return { settings, loading, error, refetch: fetchSettings }
}

// Hook for fetching active vendors
export function useActiveVendors() {
  const [vendors, setVendors] = useState<Tables<'vendors'>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVendors = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('vendors')
        .select('*')
        .eq('active', true)
        .order('name')

      if (fetchError) {
        throw fetchError
      }

      setVendors(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vendors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  return { vendors, loading, error, refetch: fetchVendors }
}

// Hook for real-time subscriptions to flavors
export function useActiveFlavorsRealtime() {
  const [flavors, setFlavors] = useState<Tables<'flavors'>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInitialFlavors() {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error: fetchError } = await supabase
          .from('flavors')
          .select('*')
          .eq('active', true)
          .order('name')

        if (fetchError) {
          throw fetchError
        }

        setFlavors(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch flavors')
      } finally {
        setLoading(false)
      }
    }

    fetchInitialFlavors()

    // Set up real-time subscription
    const subscription = supabase
      .channel('flavors_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'flavors'
        },
        () => {
          // Refetch flavors when changes occur
          fetchInitialFlavors()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { flavors, loading, error }
}

// Hook for real-time subscriptions to app settings
export function useAppSettingsRealtime() {
  const [settings, setSettings] = useState<Tables<'app_settings'> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInitialSettings() {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error: fetchError } = await supabase
          .from('app_settings')
          .select('*')
          .eq('id', 1)
          .single()

        if (fetchError) {
          throw fetchError
        }

        setSettings(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch settings')
      } finally {
        setLoading(false)
      }
    }

    fetchInitialSettings()

    // Set up real-time subscription
    const subscription = supabase
      .channel('settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'app_settings'
        },
        () => {
          // Refetch settings when changes occur
          fetchInitialSettings()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { settings, loading, error }
}
// Hook for fetching all flavors (including inactive) - for admin
export function useFlavors() {
  const [flavors, setFlavors] = useState<Tables<'flavors'>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFlavors = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('flavors')
        .select('*')
        .order('name')

      if (fetchError) {
        throw fetchError
      }

      setFlavors(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch flavors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlavors()
  }, [])

  return { flavors, loading, error, refetch: fetchFlavors }
}

// Hook for fetching all vendors (including inactive) - for admin
export function useVendors() {
  const [vendors, setVendors] = useState<Tables<'vendors'>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVendors = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('vendors')
        .select('*')
        .order('name')

      if (fetchError) {
        throw fetchError
      }

      setVendors(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vendors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  return { vendors, loading, error, refetch: fetchVendors }
}

// Hook for admin authentication state
export function useAdminAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function getInitialSession() {
      try {
        setLoading(true)
        setError(null)
        
        const { session, error: sessionError } = await authHelpers.getAdminSession()
        
        if (sessionError) {
          throw sessionError
        }
        
        setUser(session?.user || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get session')
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = authHelpers.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const { data, error: signInError } = await authHelpers.signInAdmin(email, password)
      
      if (signInError) {
        throw signInError
      }
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error: signOutError } = await authHelpers.signOutAdmin()
      
      if (signOutError) {
        throw signOutError
      }
      
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user
  }
}