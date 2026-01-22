'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/layouts/Container'
import Card from '@/components/layouts/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { formatCurrency } from '@/lib/utils'

interface DashboardStats {
  totalSales: number
  salesToday: number
  totalOrders: number
  activeVendors: number
  activeFlavors: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    salesToday: 0,
    totalOrders: 0,
    activeVendors: 0,
    activeFlavors: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      // Fetch all sales
      const salesResponse = await fetch('/api/admin-reports?limit=1000')
      const salesData = await salesResponse.json()
      
      // Fetch vendors
      const vendorsResponse = await fetch('/api/vendors')
      const vendorsData = await vendorsResponse.json()
      
      // Fetch flavors
      const flavorsResponse = await fetch('/api/flavors')
      const flavorsData = await flavorsResponse.json()
      
      // Filter out cancelled orders
      const validSales = salesData.sales?.filter((sale: any) => sale.status !== 'cancelled') || []
      
      // Calculate total sales (excluding cancelled)
      const totalSales = validSales.reduce((sum: number, sale: any) => sum + sale.total_cents, 0)
      
      // Calculate sales today (excluding cancelled)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const salesToday = validSales.filter((sale: any) => {
        const saleDate = new Date(sale.created_at)
        return saleDate >= today
      }).reduce((sum: number, sale: any) => sum + sale.total_cents, 0)
      
      // Count total orders (excluding cancelled)
      const totalOrders = validSales.length
      
      // Count active vendors
      const activeVendors = vendorsData.vendors?.filter((v: any) => v.active).length || 0
      
      // Count active flavors
      const activeFlavors = flavorsData.flavors?.filter((f: any) => f.active).length || 0
      
      setStats({
        totalSales,
        salesToday,
        totalOrders,
        activeVendors,
        activeFlavors
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size="xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Administrativo
        </h1>
        <p className="text-gray-600">
          Bem-vindo ao painel de administração do Sistema Pastelada
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Quick Stats Cards */}
        <Card>
          <div className="text-center py-4">
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatCurrency(stats.totalSales)}
                </div>
                <div className="text-sm text-gray-600">Total de Vendas</div>
              </>
            )}
          </div>
        </Card>

        <Card>
          <div className="text-center py-4">
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(stats.salesToday)}
                </div>
                <div className="text-sm text-gray-600">Vendas Hoje</div>
              </>
            )}
          </div>
        </Card>

        <Card>
          <div className="text-center py-4">
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {stats.totalOrders}
                </div>
                <div className="text-sm text-gray-600">Total de Pedidos</div>
              </>
            )}
          </div>
        </Card>

        <Card>
          <div className="text-center py-4">
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats.activeVendors}
                </div>
                <div className="text-sm text-gray-600">Vendedores Ativos</div>
              </>
            )}
          </div>
        </Card>

        <Card>
          <div className="text-center py-4">
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {stats.activeFlavors}
                </div>
                <div className="text-sm text-gray-600">Sabores Ativos</div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Ações Rápidas">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/adm/sabores')}
            className="
              p-4 border-2 border-gray-200 rounded-lg text-left
              hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all duration-200
            "
          >
            <div className="text-lg font-medium text-gray-900 mb-1">
              Gerenciar Sabores
            </div>
            <div className="text-sm text-gray-600">
              Adicionar, editar ou desativar sabores
            </div>
          </button>

          <button
            onClick={() => router.push('/adm/vendedores')}
            className="
              p-4 border-2 border-gray-200 rounded-lg text-left
              hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all duration-200
            "
          >
            <div className="text-lg font-medium text-gray-900 mb-1">
              Gerenciar Vendedores
            </div>
            <div className="text-sm text-gray-600">
              Adicionar ou editar vendedores
            </div>
          </button>

          <button
            onClick={() => router.push('/adm/configuracoes')}
            className="
              p-4 border-2 border-gray-200 rounded-lg text-left
              hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all duration-200
            "
          >
            <div className="text-lg font-medium text-gray-900 mb-1">
              Configurações
            </div>
            <div className="text-sm text-gray-600">
              Preço do pastel e QR Code PIX
            </div>
          </button>

          <button
            onClick={() => router.push('/adm/relatorios')}
            className="
              p-4 border-2 border-gray-200 rounded-lg text-left
              hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all duration-200
            "
          >
            <div className="text-lg font-medium text-gray-900 mb-1">
              Relatórios
            </div>
            <div className="text-sm text-gray-600">
              Visualizar vendas e estatísticas
            </div>
          </button>
        </div>
      </Card>

      {/* Info Card */}
      <div className="mt-8">
        <Card>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sistema de Gestão de Pastelaria
            </h3>
            <p className="text-gray-600">
              Use o menu de navegação acima para acessar as diferentes funcionalidades do sistema.
            </p>
          </div>
        </Card>
      </div>
    </Container>
  )
}
