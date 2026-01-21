'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getVendorSession } from '@/lib/utils'
import Container from '@/components/layouts/Container'
import Card from '@/components/layouts/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function VendorSalesPage() {
  const router = useRouter()
  const [vendorSession, setVendorSession] = useState<{
    vendor: { id: string; name: string; phone?: string }
    loginTime: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check vendor session on component mount
    const session = getVendorSession()
    
    if (!session) {
      // No vendor session found, redirect to home
      router.replace('/')
      return
    }

    setVendorSession(session)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </main>
    )
  }

  if (!vendorSession) {
    return null // Will redirect to home
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <Container size="lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Minhas Vendas - {vendorSession.vendor.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Histórico das suas vendas realizadas
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/vender')}
              className="
                px-4 py-2 bg-blue-600 text-white rounded-md
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-colors duration-200
              "
            >
              Nova Venda
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="
                px-4 py-2 text-gray-600 border border-gray-300 rounded-md
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                transition-colors duration-200
              "
            >
              Voltar ao Início
            </button>
          </div>
        </div>

        {/* Sales History Placeholder */}
        <Card title="Histórico de Vendas">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Histórico de vendas será implementado na próxima tarefa
            </p>
            <p className="text-sm text-gray-400">
              Aqui você verá todas as suas vendas com filtros por período
            </p>
          </div>
        </Card>
      </Container>
    </main>
  )
}