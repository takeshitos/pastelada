/**
 * Centralized error handling utilities for the application
 */

export interface AppError {
  message: string
  code?: string
  statusCode?: number
  details?: Record<string, any>
}

/**
 * Parse error from various sources into a consistent format
 */
export function parseError(error: unknown): AppError {
  // Handle Error objects
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'ERROR',
    }
  }

  // Handle API error responses
  if (typeof error === 'object' && error !== null) {
    const err = error as any
    return {
      message: err.message || 'Ocorreu um erro inesperado',
      code: err.code || 'UNKNOWN_ERROR',
      statusCode: err.statusCode,
      details: err.details,
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
      code: 'STRING_ERROR',
    }
  }

  // Fallback for unknown error types
  return {
    message: 'Ocorreu um erro inesperado',
    code: 'UNKNOWN_ERROR',
  }
}

/**
 * Get user-friendly error message based on error type
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const parsedError = parseError(error)

  // Network errors
  if (parsedError.message.includes('fetch') || parsedError.message.includes('network')) {
    return 'Erro de conexão. Verifique sua internet e tente novamente.'
  }

  // Timeout errors
  if (parsedError.message.includes('timeout')) {
    return 'A requisição demorou muito. Tente novamente.'
  }

  // Authentication errors
  if (parsedError.statusCode === 401 || parsedError.statusCode === 403) {
    return 'Você não tem permissão para realizar esta ação.'
  }

  // Not found errors
  if (parsedError.statusCode === 404) {
    return 'Recurso não encontrado.'
  }

  // Server errors
  if (parsedError.statusCode && parsedError.statusCode >= 500) {
    return 'Erro no servidor. Tente novamente mais tarde.'
  }

  // Return the original message if no specific case matches
  return parsedError.message
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelay?: number
    maxDelay?: number
    onRetry?: (attempt: number, error: unknown) => void
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    onRetry,
  } = options

  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break
      }

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, error)
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay)

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  const parsedError = parseError(error)
  return (
    parsedError.message.includes('fetch') ||
    parsedError.message.includes('network') ||
    parsedError.message.includes('Failed to fetch') ||
    parsedError.code === 'NETWORK_ERROR'
  )
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  const parsedError = parseError(error)

  // Network errors are retryable
  if (isNetworkError(error)) {
    return true
  }

  // Timeout errors are retryable
  if (parsedError.message.includes('timeout')) {
    return true
  }

  // 5xx server errors are retryable
  if (parsedError.statusCode && parsedError.statusCode >= 500) {
    return true
  }

  // 429 (Too Many Requests) is retryable
  if (parsedError.statusCode === 429) {
    return true
  }

  return false
}

/**
 * Log error to console with context
 */
export function logError(error: unknown, context?: string): void {
  const parsedError = parseError(error)
  const prefix = context ? `[${context}]` : '[Error]'

  console.error(prefix, {
    message: parsedError.message,
    code: parsedError.code,
    statusCode: parsedError.statusCode,
    details: parsedError.details,
    timestamp: new Date().toISOString(),
  })
}
