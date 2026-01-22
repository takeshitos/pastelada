'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getVendorSession, formatCurrency, formatDateTime } from '@/lib/utils'
import Container from '@/components/layouts/Container'
import Card from '@/components/layouts/Card'
import Logo from '@/components/ui/Logo'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'
import type { VendorSalesResponse, ErrorResponse } from '@/types/api'

type PeriodFilter = 'today' | '7days' | 'month' | 'all'

export default function VendorSalesPage() {
  const router = useRouter()
  const [vendorSession, setVendorSession] = useState<{
    vendor: { id: string; name: string; phone?: string }
    loginTime: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [salesLoading, setSalesLoading] = useState(false)
  const [sales, setSales] = useState<VendorSalesResponse['sales']>([])
  const [totalCount, setTotalCount] = useState(0)
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; show: boolean }>({
    message: '',
    type: 'info',
    show: false
  })

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

  useEffect(() => {
    // Fetch sales when vendor session is available or filter changes
    if (vendorSession) {
      fetchSales()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorSession, periodFilter])

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, show: true })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }))
  }

  const getDateRange = (period: PeriodFilter): { start_date?: string; end_date?: string } => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (period) {
      case 'today':
        return {
          start_date: today.toISOString(),
          end_date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
        }
      case '7days':
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        return {
          start_date: sevenDaysAgo.toISOString(),
          end_date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
        }
      case 'month':
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        return {
          start_date: firstDayOfMonth.toISOString(),
          end_date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
        }
      case 'all':
      default:
        return {}
    }
  }

  const fetchSales = async () => {
    if (!vendorSession) return

    setSalesLoading(true)
    
    try {
      const dateRange = getDateRange(periodFilter)
      const params = new URLSearchParams({
        vendor_id: vendorSession.vendor.id,
        limit: '100',
        offset: '0',
        ...dateRange
      })

      const response = await fetch(`/api/vendor-sales?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        const errorData = data as ErrorResponse
        throw new Error(errorData.message || 'Erro ao buscar vendas')
      }

      const salesData = data as VendorSalesResponse
      setSales(salesData.sales)
      setTotalCount(salesData.total_count)

    } catch (error) {
      console.error('Error fetching sales:', error)
      showToast(
        error instanceof Error ? error.message : 'Erro ao carregar vendas',
        'error'
      )
      setSales([])
      setTotalCount(0)
    } finally {
      setSalesLoading(false)
    }
  }

  const toggleRowExpansion = (saleId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(saleId)) {
        newSet.delete(saleId)
      } else {
        newSet.add(saleId)
      }
      return newSet
    })
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Tem certeza que deseja cancelar este pedido?')) {
      return
    }

    try {
      setUpdatingStatus(orderId)
      
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      })

      if (!response.ok) {
        throw new Error('Falha ao cancelar pedido')
      }

      // Update local state
      setSales(prevSales =>
        prevSales.map(sale =>
          sale.id === orderId ? { ...sale, status: 'cancelled' } : sale
        )
      )

      showToast('Pedido cancelado com sucesso', 'success')
    } catch (err) {
      console.error('Error cancelling order:', err)
      showToast('Erro ao cancelar pedido', 'error')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getFilteredSales = () => {
    if (!searchQuery.trim()) return sales

    const query = searchQuery.toLowerCase()
    return sales.filter(sale => {
      // Search in customer name
      if (sale.customer_name?.toLowerCase().includes(query)) return true
      
      // Search in payment method
      if (sale.payment_method.toLowerCase().includes(query)) return true
      
      // Search in status
      if (sale.status.toLowerCase().includes(query)) return true
      
      // Search in flavor names
      if (sale.items.some(item => item.flavor_name.toLowerCase().includes(query))) return true
      
      return false
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: 'Pago', color: 'bg-green-100 text-green-800' },
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      created: { label: 'Criado', color: 'bg-blue-100 text-blue-800' },
      cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
      completed: { label: 'Concluído', color: 'bg-blue-100 text-blue-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { 
      label: status, 
      color: 'bg-gray-100 text-gray-800' 
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getPaymentMethodBadge = (method: string) => {
    const methodConfig = {
      PIX: { label: 'PIX', color: 'bg-blue-100 text-blue-800' },
      LOCAL: { label: 'Local', color: 'bg-purple-100 text-purple-800' }
    }
    
    const config = methodConfig[method as keyof typeof methodConfig] || { 
      label: method, 
      color: 'bg-gray-100 text-gray-800' 
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

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

  const filteredSales = getFilteredSales()

  return (
    <main className="min-h-screen bg-gray-50 py-4 md:py-8">
      <Container size="xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Minhas Vendas
            </h1>
            <p className="text-gray-600 mt-1">
              {vendorSession.vendor.name} - Histórico de vendas
            </p>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => router.push('/vender')}
              className="
                px-3 py-2 md:px-4 text-sm md:text-base bg-blue-600 text-white rounded-md
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-colors duration-200
              "
            >
              Nova Venda
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="
                px-3 py-2 md:px-4 text-sm md:text-base text-gray-600 border border-gray-300 rounded-md
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                transition-colors duration-200
              "
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Card>
            <div className="space-y-4">
              {/* Period Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'today' as PeriodFilter, label: 'Hoje' },
                    { value: '7days' as PeriodFilter, label: 'Últimos 7 dias' },
                    { value: 'month' as PeriodFilter, label: 'Este mês' },
                    { value: 'all' as PeriodFilter, label: 'Todas' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setPeriodFilter(value)}
                      className={`
                        px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                        ${periodFilter === value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por cliente, sabor, método..."
                  className="
                    w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  "
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sales Table */}
        <Card title={`Vendas (${filteredSales.length})`}>
          {salesLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">
                {searchQuery ? 'Nenhuma venda encontrada' : 'Nenhuma venda registrada'}
              </p>
              <p className="text-sm text-gray-400">
                {searchQuery 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'As vendas aparecerão aqui quando você registrar uma venda'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSales.map((sale) => {
                    const isExpanded = expandedRows.has(sale.id)
                    
                    return (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(sale.created_at)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.customer_name || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.customer_phone || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {formatCurrency(sale.total_cents)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {getPaymentMethodBadge(sale.payment_method)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {getStatusBadge(sale.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleRowExpansion(sale.id)}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {isExpanded ? 'Ocultar' : 'Ver itens'}
                            </button>
                            {sale.status !== 'cancelled' && sale.status !== 'completed' && (
                              <button
                                onClick={() => handleCancelOrder(sale.id)}
                                disabled={updatingStatus === sale.id}
                                className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {updatingStatus === sale.id ? 'Cancelando...' : 'Cancelar'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {/* Expanded Rows - Items Details */}
              {filteredSales.map((sale) => {
                const isExpanded = expandedRows.has(sale.id)
                if (!isExpanded) return null

                return (
                  <div key={`expanded-${sale.id}`} className="bg-gray-50 px-4 py-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Itens do Pedido #{sale.id.slice(-8)}
                    </h4>
                    <div className="space-y-2">
                      {sale.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.quantity}x {item.flavor_name}
                          </span>
                          <span className="text-gray-900 font-medium">
                            {formatCurrency(item.line_total_cents)}
                          </span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Total:</span>
                          <span className="text-green-600">{formatCurrency(sale.total_cents)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
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