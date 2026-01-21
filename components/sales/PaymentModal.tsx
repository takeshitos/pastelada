'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import type { Flavor } from '@/types/database'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  total: number
  items: Array<{ flavor: Flavor; quantity: number; lineTotal: number }>
  onPaymentSelect: (method: 'PIX' | 'LOCAL') => void
  isLoading?: boolean
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  total, 
  items, 
  onPaymentSelect, 
  isLoading = false 
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'PIX' | 'LOCAL' | null>(null)

  const handleMethodSelect = (method: 'PIX' | 'LOCAL') => {
    setSelectedMethod(method)
    onPaymentSelect(method)
  }

  const handleClose = () => {
    if (!isLoading) {
      setSelectedMethod(null)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Método de Pagamento"
      size="md"
    >
      <div className="space-y-6">
        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Resumo do Pedido</h3>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.flavor.name}</span>
                <span>{formatCurrency(item.lineTotal)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span className="text-green-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Escolha o método de pagamento:</h3>
          
          {/* PIX Option */}
          <button
            onClick={() => handleMethodSelect('PIX')}
            disabled={isLoading}
            className="
              w-full p-4 border-2 border-gray-200 rounded-lg text-left
              hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              flex items-center space-x-3
            "
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">PIX</div>
              <div className="text-sm text-gray-600">Pagamento instantâneo via QR Code</div>
            </div>
            {isLoading && selectedMethod === 'PIX' && (
              <LoadingSpinner size="sm" />
            )}
          </button>

          {/* Local Payment Option */}
          <button
            onClick={() => handleMethodSelect('LOCAL')}
            disabled={isLoading}
            className="
              w-full p-4 border-2 border-gray-200 rounded-lg text-left
              hover:border-green-500 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              flex items-center space-x-3
            "
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Pagamento Local</div>
              <div className="text-sm text-gray-600">Dinheiro, cartão ou outros métodos</div>
            </div>
            {isLoading && selectedMethod === 'LOCAL' && (
              <LoadingSpinner size="sm" />
            )}
          </button>
        </div>

        {/* Cancel Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="
              px-4 py-2 text-gray-700 border border-gray-300 rounded-md
              hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            "
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  )
}