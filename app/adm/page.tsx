'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/layouts/Container'
import Card from '@/components/layouts/Card'

export default function AdminDashboardPage() {
  const router = useRouter()

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Quick Stats Cards */}
        <Card>
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-blue-600 mb-2">-</div>
            <div className="text-sm text-gray-600">Total de Vendas</div>
          </div>
        </Card>

        <Card>
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-green-600 mb-2">-</div>
            <div className="text-sm text-gray-600">Vendas Hoje</div>
          </div>
        </Card>

        <Card>
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-purple-600 mb-2">-</div>
            <div className="text-sm text-gray-600">Vendedores Ativos</div>
          </div>
        </Card>

        <Card>
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-orange-600 mb-2">-</div>
            <div className="text-sm text-gray-600">Sabores Ativos</div>
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
