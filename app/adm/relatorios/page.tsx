'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/layouts/Container'
import Card from '@/components/layouts/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'
import { formatCurrency, formatDateTime, getDateRange, formatDateForAPI } from '@/lib/utils'
import { useFlavors, useVendors } from '@/lib/hooks'
import { AdminReportsResponse } from '@/app/api/admin-reports/route'
import { Flavor, Vendor } from '@/types/database'

interface KPIs {
  totalSales: number
  totalPastries: number
  flavorRanking: Array<{ name: string; quantity: number; total: number }>
}

type OrderStatus = 'created' | 'paid' | 'completed' | 'cancelled'

export default function RelatoriosPage() {
  const [sales, setSales] = useState<AdminReportsResponse['sales']>([])
  const [kpis, setKpis] = useState<KPIs>({ totalSales: 0, totalPastries: 0, flavorRanking: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  
  // Filters
  const [selectedVendor, setSelectedVendor] = useState<string>('')
  const [selectedFlavor, setSelectedFlavor] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | '7days' | 'month' | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 20

  const { flavors } = useFlavors()
  const { vendors } = useVendors()

  useEffect(() => {
    fetchReports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVendor, selectedFlavor, selectedPeriod, currentPage])

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingStatus(orderId)
      
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Falha ao atualizar status')
      }

      // Update local state
      setSales(prevSales =>
        prevSales.map(sale =>
          sale.id === orderId ? { ...sale, status: newStatus } : sale
        )
      )

      setError(null)
    } catch (err) {
      console.error('Error updating status:', err)
      setError('Erro ao atualizar status do pedido')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleCompleteOrder = async (orderId: string) => {
    await handleStatusChange(orderId, 'completed')
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Tem certeza que deseja cancelar este pedido?')) {
      return
    }
    await handleStatusChange(orderId, 'cancelled')
  }

  // Separate sales into active and completed
  const activeSales = sales.filter(sale => sale.status !== 'completed')
  const completedSales = sales.filter(sale => sale.status === 'completed')

  const fetchReports = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (selectedVendor) {
        params.append('vendor_id', selectedVendor)
      }
      
      if (selectedFlavor) {
        params.append('flavor_id', selectedFlavor)
      }
      
      if (selectedPeriod !== 'all') {
        const { startDate, endDate } = getDateRange(selectedPeriod)
        params.append('start_date', formatDateForAPI(startDate))
        params.append('end_date', formatDateForAPI(endDate))
      }
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      params.append('limit', itemsPerPage.toString())
      params.append('offset', ((currentPage - 1) * itemsPerPage).toString())
      params.append('_t', Date.now().toString()) // Cache buster

      const response = await fetch(`/api/admin-reports?${params.toString()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch reports')
      }

      const data: AdminReportsResponse = await response.json()
      setSales(data.sales)
      setTotalCount(data.total_count)
      
      // Calculate KPIs
      calculateKPIs(data.sales)
      
    } catch (err) {
      console.error('Error fetching reports:', err)
      setError('Erro ao carregar relatórios')
    } finally {
      setLoading(false)
    }
  }

  const calculateKPIs = (salesData: AdminReportsResponse['sales']) => {
    // Filter out cancelled orders
    const validSales = salesData.filter(sale => sale.status !== 'cancelled')
    
    // Total sales amount (excluding cancelled)
    const totalSales = validSales.reduce((sum, sale) => sum + sale.total_cents, 0)
    
    // Total pastries sold (excluding cancelled)
    const totalPastries = validSales.reduce((sum, sale) => {
      return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
    }, 0)
    
    // Flavor ranking (excluding cancelled)
    const flavorMap = new Map<string, { quantity: number; total: number }>()
    
    validSales.forEach(sale => {
      sale.items.forEach(item => {
        const existing = flavorMap.get(item.flavor_name) || { quantity: 0, total: 0 }
        flavorMap.set(item.flavor_name, {
          quantity: existing.quantity + item.quantity,
          total: existing.total + item.line_total_cents
        })
      })
    })
    
    const flavorRanking = Array.from(flavorMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
    
    setKpis({ totalSales, totalPastries, flavorRanking })
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchReports()
  }

  const handleClearFilters = () => {
    setSelectedVendor('')
    setSelectedFlavor('')
    setSelectedPeriod('all')
    setSearchTerm('')
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <Container size="xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios de Vendas</h1>
          <p className="mt-2 text-gray-600">
            Visualize e analise todas as vendas do sistema
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Total de Vendas</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatCurrency(kpis.totalSales)}
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Total de Pastéis</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {kpis.totalPastries}
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Sabor Mais Vendido</h3>
              <p className="mt-2 text-xl font-bold text-gray-900">
                {kpis.flavorRanking[0]?.name || 'N/A'}
              </p>
              {kpis.flavorRanking[0] && (
                <p className="text-sm text-gray-600">
                  {kpis.flavorRanking[0].quantity} unidades
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Vendor Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendedor
                </label>
                <select
                  value={selectedVendor}
                  onChange={(e) => {
                    setSelectedVendor(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos</option>
                  {vendors.map((vendor: Vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Flavor Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sabor
                </label>
                <select
                  value={selectedFlavor}
                  onChange={(e) => {
                    setSelectedFlavor(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos</option>
                  {flavors.map((flavor: Flavor) => (
                    <option key={flavor.id} value={flavor.id}>
                      {flavor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Period Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Período
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => {
                    setSelectedPeriod(e.target.value as any)
                    setCurrentPage(1)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="today">Hoje</option>
                  <option value="7days">Últimos 7 dias</option>
                  <option value="month">Este mês</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Nome, sabor..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </Card>

        {/* Flavor Ranking */}
        {kpis.flavorRanking.length > 0 && (
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ranking de Sabores</h2>
              <div className="space-y-3">
                {kpis.flavorRanking.slice(0, 5).map((flavor, index) => (
                  <div key={flavor.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-400">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{flavor.name}</p>
                        <p className="text-sm text-gray-600">
                          {flavor.quantity} unidades
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(flavor.total)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Active Orders Table */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pedidos em Andamento
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : activeSales.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum pedido em andamento</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                          <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendedor</th>
                          <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                          <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Telefone</th>
                          <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Itens</th>
                          <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                          <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Pagamento</th>
                          <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {activeSales.map((sale) => (
                          <tr key={sale.id} className="hover:bg-gray-50">
                            <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                              {formatDateTime(sale.created_at)}
                            </td>
                            <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                              {sale.vendor_name}
                            </td>
                            <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                              {sale.customer_name}
                            </td>
                            <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900 hidden sm:table-cell">
                              {sale.customer_phone || 'N/A'}
                            </td>
                            <td className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm text-gray-900">
                              {sale.items.map((item, idx) => (
                                <div key={idx}>
                                  {item.quantity}x {item.flavor_name}
                                </div>
                              ))}
                            </td>
                            <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-green-600">
                              {formatCurrency(sale.total_cents)}
                            </td>
                            <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900 hidden md:table-cell">
                              {sale.payment_method}
                            </td>
                            <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm">
                              {sale.status === 'cancelled' ? (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                  Cancelado
                                </span>
                              ) : (
                                <select
                                  value={sale.status}
                                  onChange={(e) => handleStatusChange(sale.id, e.target.value as OrderStatus)}
                                  disabled={updatingStatus === sale.id}
                                  className="px-2 md:px-3 py-1 md:py-1.5 text-xs font-medium rounded-md border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <option value="created">Pendente</option>
                                  <option value="paid">Pago</option>
                                  <option value="cancelled">Cancelado</option>
                                </select>
                              )}
                            </td>
                            <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm">
                              {sale.status === 'cancelled' ? (
                                <span className="text-xs text-gray-500">-</span>
                              ) : (
                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                  <button
                                    onClick={() => handleCompleteOrder(sale.id)}
                                    disabled={updatingStatus === sale.id}
                                    className="px-2 md:px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                  >
                                    {updatingStatus === sale.id ? 'Processando...' : 'Concluir'}
                                  </button>
                                  <button
                                    onClick={() => handleCancelOrder(sale.id)}
                                    disabled={updatingStatus === sale.id}
                                    className="px-2 md:px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Completed Orders Table */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pedidos Concluídos
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : completedSales.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum pedido concluído</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                            <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendedor</th>
                            <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                            <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Telefone</th>
                            <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Itens</th>
                            <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Pagamento</th>
                            <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {completedSales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-gray-50">
                              <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                                {formatDateTime(sale.created_at)}
                              </td>
                              <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                                {sale.vendor_name}
                              </td>
                              <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                                {sale.customer_name}
                              </td>
                              <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900 hidden sm:table-cell">
                                {sale.customer_phone || 'N/A'}
                              </td>
                              <td className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm text-gray-900">
                                {sale.items.map((item, idx) => (
                                  <div key={idx}>
                                    {item.quantity}x {item.flavor_name}
                                  </div>
                                ))}
                              </td>
                              <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-green-600">
                                {formatCurrency(sale.total_cents)}
                              </td>
                              <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900 hidden md:table-cell">
                                {sale.payment_method}
                              </td>
                              <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm">
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                  Concluído
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-600 text-center sm:text-left">
                      Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalCount)} de {totalCount} vendas
                    </p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 md:px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      
                      <span className="px-3 md:px-4 py-2 text-sm text-gray-700">
                        Página {currentPage} de {totalPages}
                      </span>
                      
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 md:px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>

      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
    </Container>
  )
}
