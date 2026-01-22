'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authHelpers } from '@/lib/supabase'
import Container from '@/components/layouts/Container'
import Card from '@/components/layouts/Card'
import Logo from '@/components/ui/Logo'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; show: boolean }>({
    message: '',
    type: 'info',
    show: false
  })

  useEffect(() => {
    // Check if user is already authenticated
    checkAuthentication()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuthentication = async () => {
    try {
      const { session } = await authHelpers.getAdminSession()
      if (session) {
        // User is already logged in, redirect to admin dashboard
        router.replace('/adm')
      }
    } catch (error) {
      console.error('Error checking authentication:', error)
    } finally {
      setCheckingAuth(false)
    }
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, show: true })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }))
  }

  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '' }
    let isValid = true

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido'
      isValid = false
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Senha é obrigatória'
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const { data, error } = await authHelpers.signInAdmin(email, password)

      if (error) {
        throw error
      }

      if (data.session) {
        showToast('Login realizado com sucesso!', 'success')
        
        // Redirect to admin dashboard after short delay
        setTimeout(() => {
          router.push('/adm')
        }, 500)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
      let errorMessage = 'Erro ao fazer login'
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos'
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Email não confirmado'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') {
      setEmail(value)
    } else {
      setPassword(value)
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container size="sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Faça login para acessar o sistema
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={loading}
                className={`
                  w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.email 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500'
                  }
                  ${loading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                `}
                placeholder="seu@email.com"
                autoComplete="email"
                autoFocus
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={loading}
                className={`
                  w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.password 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500'
                  }
                  ${loading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                `}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
                flex items-center justify-center space-x-2
              "
            >
              {loading && <LoadingSpinner size="sm" />}
              <span>{loading ? 'Entrando...' : 'Entrar'}</span>
            </button>
          </form>

          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Voltar para página inicial
            </button>
          </div>
        </Card>

        {/* Toast Notification */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </Container>
    </main>
  )
}
