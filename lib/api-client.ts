/**
 * Enhanced API client with retry logic and error handling
 */

import { retryWithBackoff, isRetryableError, parseError, logError } from './error-handler'

export interface FetchOptions extends RequestInit {
  retry?: boolean
  maxRetries?: number
  timeout?: number
  onRetry?: (attempt: number, error: unknown) => void
}

/**
 * Enhanced fetch with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = 30000, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Requisição expirou. Tente novamente.')
    }
    throw error
  }
}

/**
 * Enhanced API client with automatic retry and error handling
 */
export async function apiClient<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    retry = true,
    maxRetries = 3,
    onRetry,
    ...fetchOptions
  } = options

  const makeRequest = async (): Promise<T> => {
    try {
      const response = await fetchWithTimeout(url, fetchOptions)

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error = {
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          code: errorData.code || 'HTTP_ERROR',
          statusCode: response.status,
          details: errorData.details,
        }
        throw error
      }

      // Parse JSON response
      const data = await response.json()
      return data as T
    } catch (error) {
      // Log error for debugging
      logError(error, `API Request: ${url}`)
      throw error
    }
  }

  // Retry logic for retryable errors
  if (retry) {
    return retryWithBackoff(makeRequest, {
      maxRetries,
      onRetry,
    })
  }

  return makeRequest()
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T = any>(url: string, options?: FetchOptions) =>
    apiClient<T>(url, { ...options, method: 'GET' }),

  post: <T = any>(url: string, data?: any, options?: FetchOptions) =>
    apiClient<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(url: string, data?: any, options?: FetchOptions) =>
    apiClient<T>(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(url: string, data?: any, options?: FetchOptions) =>
    apiClient<T>(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(url: string, options?: FetchOptions) =>
    apiClient<T>(url, { ...options, method: 'DELETE' }),
}
