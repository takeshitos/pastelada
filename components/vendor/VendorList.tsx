'use client'

import { Vendor } from '@/types/database'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export interface VendorListProps {
  vendors: Vendor[]
  loading?: boolean
  onSelectVendor: (vendor: Vendor) => void
  selectedVendorId?: string
  className?: string
}

export default function VendorList({ 
  vendors, 
  loading = false, 
  onSelectVendor, 
  selectedVendorId,
  className = '' 
}: VendorListProps) {
  if (loading) {
    return (
      <div className={`flex justify-center py-8 ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (vendors.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-neutral-500 dark:text-neutral-400">Nenhum vendedor cadastrado ainda.</p>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
          Cadastre o primeiro vendedor usando o formulário acima.
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-4">
        Selecione seu nome para continuar:
      </h3>
      
      <div className="grid gap-2">
        {vendors.map((vendor) => (
          <button
            key={vendor.id}
            onClick={() => onSelectVendor(vendor)}
            className={`
              w-full p-4 text-left border rounded-lg transition-all duration-200
              hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              ${selectedVendorId === vendor.id 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md' 
                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-50">{vendor.name}</h4>
                {vendor.phone && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{vendor.phone}</p>
                )}
              </div>
              
              {selectedVendorId === vendor.id && (
                <div className="flex items-center text-primary-600 dark:text-primary-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      
      {selectedVendorId && (
        <div className="mt-6 p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
          <p className="text-sm text-success-800 dark:text-success-200">
            ✓ Vendedor selecionado! Clique em &quot;Ir para Vendas&quot; para continuar.
          </p>
        </div>
      )}
    </div>
  )
}