'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authHelpers } from '@/lib/supabase'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Logo from '@/components/ui/Logo'
import Container from '@/components/layouts/Container'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication on mount and when pathname changes
    checkAuth()

    // Listen to auth state changes
    const { data: authListener } = authHelpers.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setAuthenticated(false)
        setUserEmail(null)
        if (pathname !== '/adm/login') {
          router.push('/adm/login')
        }
      } else if (event === 'SIGNED_IN' && session) {
        setAuthenticated(true)
        setUserEmail(session.user.email || null)
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router])

  const checkAuth = async () => {
    // Skip auth check for login page
    if (pathname === '/adm/login') {
      setLoading(false)
      return
    }

    try {
      const { session } = await authHelpers.getAdminSession()
      
      if (!session) {
        // Not authenticated, redirect to login
        router.replace('/adm/login')
        return
      }

      // User is authenticated
      setAuthenticated(true)
      setUserEmail(session.user.email || null)
    } catch (error) {
      console.error('Auth check error:', error)
      router.replace('/adm/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authHelpers.signOutAdmin()
      router.push('/adm/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // If on login page, render without layout
  if (pathname === '/adm/login') {
    return <>{children}</>
  }

  // If not authenticated, don't render anything (will redirect)
  if (!authenticated) {
    return null
  }

  // Render admin layout with navigation
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <Container size="xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <div className="flex items-center">
              <Logo size="sm" />
              <span className="ml-3 text-sm font-medium text-gray-500 hidden sm:inline">
                | Painel Admin
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => router.push('/adm')}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${pathname === '/adm' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                Dashboard
              </button>
              
              <button
                onClick={() => router.push('/adm/sabores')}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${pathname === '/adm/sabores' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                Sabores
              </button>
              
              <button
                onClick={() => router.push('/adm/vendedores')}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${pathname === '/adm/vendedores' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                Vendedores
              </button>
              
              <button
                onClick={() => router.push('/adm/configuracoes')}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${pathname === '/adm/configuracoes' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                Configurações
              </button>
              
              <button
                onClick={() => router.push('/adm/relatorios')}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${pathname === '/adm/relatorios' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                Relatórios
              </button>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-sm text-gray-600">
                {userEmail}
              </div>
              
              <button
                onClick={handleLogout}
                className="
                  px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md
                  hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                  transition-colors duration-200
                "
              >
                Sair
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4 space-y-1">
            <button
              onClick={() => router.push('/adm')}
              className={`
                block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${pathname === '/adm' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              Dashboard
            </button>
            
            <button
              onClick={() => router.push('/adm/sabores')}
              className={`
                block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${pathname === '/adm/sabores' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              Sabores
            </button>
            
            <button
              onClick={() => router.push('/adm/vendedores')}
              className={`
                block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${pathname === '/adm/vendedores' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              Vendedores
            </button>
            
            <button
              onClick={() => router.push('/adm/configuracoes')}
              className={`
                block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${pathname === '/adm/configuracoes' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              Configurações
            </button>
            
            <button
              onClick={() => router.push('/adm/relatorios')}
              className={`
                block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${pathname === '/adm/relatorios' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              Relatórios
            </button>
          </div>
        </Container>
      </nav>

      {/* Main Content */}
      <main className="py-6">
        {children}
      </main>
    </div>
  )
}
