'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Vendor } from '@/types/database'
import { useActiveVendors } from '@/lib/hooks'
import { saveVendorSession } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'
import VendorForm from './VendorForm'
import VendorList from './VendorList'
import Card from '@/components/layouts/Card'

export default function VendorSelector() {
  const router = useRouter()
  const { vendors, loading: vendorsLoading, error: vendorsError, refetch } = useActiveVendors()
  const { showToast, ToastContainer } = useToast()
  
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Show form by default if no vendors exist
  useEffect(() => {
    if (!vendorsLoading && vendors.length === 0) {
      setShowForm(true)
    }
  }, [vendors.length, vendorsLoading])

  const handleCreateVendor = async (data: { name: string; phone?: string }) => {
    setFormLoading(true)
    
    try {
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao cadastrar vendedor')
      }

      showToast('Vendedor cadastrado com sucesso!', 'success')
      
      // Refresh vendors list
      await refetch()
      
      // Hide form and auto-select the new vendor
      setShowForm(false)
      setSelectedVendor(result.vendor)
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro inesperado'
      showToast(message, 'error')
    } finally {
      setFormLoading(false)
    }
  }

  const handleSelectVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor)
  }

  const handleGoToSales = () => {
    if (!selectedVendor) return

    try {
      // Save vendor session to localStorage
      saveVendorSession({
        id: selectedVendor.id,
        name: selectedVendor.name,
        phone: selectedVendor.phone || undefined
      })

      // Redirect to sales page
      router.push('/vender')
    } catch (error) {
      showToast('Erro ao salvar sessão do vendedor', 'error')
    }
  }

  if (vendorsError) {
    return (
      <div className="text-center py-8">
        <p className="text-error-600 dark:text-error-400 mb-4">Erro ao carregar vendedores: {vendorsError}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Vendor Registration Form */}
        {(showForm || vendors.length === 0) && (
          <Card title="Cadastrar Novo Vendedor">
            <VendorForm
              onSubmit={handleCreateVendor}
              loading={formLoading}
            />
            
            {vendors.length > 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={() => setShowForm(false)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  ← Voltar para lista de vendedores
                </button>
              </div>
            )}
          </Card>
        )}

        {/* Vendor Selection List */}
        {!showForm && vendors.length > 0 && (
          <Card title="Selecionar Vendedor">
            <VendorList
              vendors={vendors}
              loading={vendorsLoading}
              onSelectVendor={handleSelectVendor}
              selectedVendorId={selectedVendor?.id}
            />
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {selectedVendor && (
                <button
                  onClick={handleGoToSales}
                  className="
                    flex-1 bg-success-600 dark:bg-success-500 text-white py-3 px-6 rounded-md font-medium
                    hover:bg-success-700 dark:hover:bg-success-600 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2
                    transition-colors duration-200
                  "
                >
                  Ir para Vendas →
                </button>
              )}
              
              <button
                onClick={() => setShowForm(true)}
                className="
                  bg-neutral-600 dark:bg-neutral-700 text-white py-3 px-6 rounded-md font-medium
                  hover:bg-neutral-700 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2
                  transition-colors duration-200
                "
              >
                + Cadastrar Novo Vendedor
              </button>
            </div>
          </Card>
        )}
      </div>

      <ToastContainer />
    </>
  )
}