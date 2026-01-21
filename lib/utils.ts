/**
 * Convert cents to reais for display
 */
export function formatCurrency(cents: number): string {
  const reais = cents / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(reais)
}

/**
 * Convert reais to cents for storage
 */
export function reaisToCents(reais: number): number {
  return Math.round(reais * 100)
}

/**
 * Validate phone number (only numbers)
 */
export function validatePhone(phone: string): boolean {
  if (phone === '') return false // empty phone is invalid
  return /^\d+$/.test(phone)
}

/**
 * Validate name (minimum 2 characters)
 */
export function validateName(name: string): boolean {
  return name.trim().length >= 2
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

/**
 * Get date range for common filters
 */
export function getDateRange(period: 'today' | '7days' | 'month'): { startDate: Date; endDate: Date } {
  const now = new Date()
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  
  let startDate: Date
  
  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
      break
    case '7days':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0)
      break
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
      break
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  }
  
  return { startDate, endDate }
}

/**
 * Format date for API (ISO string)
 */
export function formatDateForAPI(date: Date): string {
  return date.toISOString()
}

// LocalStorage utilities
const VENDOR_SESSION_KEY = 'pastelada_vendor_session'

/**
 * Save vendor session to localStorage
 */
export function saveVendorSession(vendor: { id: string; name: string; phone?: string }): void {
  try {
    const session = {
      vendor,
      loginTime: new Date().toISOString()
    }
    localStorage.setItem(VENDOR_SESSION_KEY, JSON.stringify(session))
  } catch (error) {
    console.error('Failed to save vendor session:', error)
  }
}

/**
 * Get vendor session from localStorage
 */
export function getVendorSession(): { vendor: { id: string; name: string; phone?: string }; loginTime: string } | null {
  try {
    const sessionData = localStorage.getItem(VENDOR_SESSION_KEY)
    if (!sessionData) return null
    
    const session = JSON.parse(sessionData)
    return session
  } catch (error) {
    console.error('Failed to get vendor session:', error)
    return null
  }
}

/**
 * Clear vendor session from localStorage
 */
export function clearVendorSession(): void {
  try {
    localStorage.removeItem(VENDOR_SESSION_KEY)
  } catch (error) {
    console.error('Failed to clear vendor session:', error)
  }
}

/**
 * Check if vendor is logged in
 */
export function isVendorLoggedIn(): boolean {
  const session = getVendorSession()
  return session !== null && session.vendor && !!session.vendor.id
}