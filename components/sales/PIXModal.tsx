'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import type { Flavor } from '@/types/database'

interface PIXModalProps {
  isOpen: boolean
  onClose: () => void
  total: number
  items: Array<{ flavor: Flavor; quantity: number; lineTotal: number }>
  qrCodeUrl?: string
  onConfirmPayment: () => void
  isLoading?: boolean
}

export default function PIXModal({ 
  isOpen, 
  onClose, 
  total, 
  items, 
  qrCodeUrl, 
  onConfirmPayment, 
  isLoading = false 
}: PIXModalProps) {
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  const handleConfirmPayment = () => {
    setPaymentConfirmed(true)
    onConfirmPayment()
  }

  const handleClose = () => {
    if (!isLoading) {
      setPaymentConfirmed(false)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Pagamento PIX"
      size="lg"
    >
      <div className="space-y-6">
        {/* QR Code Section */}
        <div className="text-center">
          <div className="bg-white p-6 rounded-lg border-2 border-gray-200 inline-block">
            {qrCodeUrl ? (
              <Image 
                src={qrCodeUrl} 
                alt="QR Code PIX" 
                width={192}
                height={192}
                className="mx-auto"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v1.5a.5.5 0 001 0V5a1 1 0 011-1h1.5a.5.5 0 000-1H4zM15.5 3a.5.5 0 01.5.5V5a1 1 0 001 1h1.5a.5.5 0 010 1H17a2 2 0 01-2-2V3.5a.5.5 0 01.5-.5zM4 15.5a.5.5 0 01-.5-.5v-1.5A1 1 0 014 13h1.5a.5.5 0 010 1H5a1 1 0 00-1 1v1.5a.5.5 0 01-.5.5zM15.5 17a.5.5 0 01-.5-.5V15a1 1 0 00-1-1h-1.5a.5.5 0 010-1H15a2 2 0 012 2v1.5a.5.5 0 01-.5.5z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-500">QR Code não disponível</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Escaneie o QR Code com seu app de pagamento
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-3">Detalhes do Pagamento</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-800">Valor total:</span>
              <span className="font-medium text-blue-900">{formatCurrency(total)}</span>
            </div>
            <div className="text-sm text-blue-700">
              <p>• Pagamento instantâneo via PIX</p>
              <p>• Confirme após realizar o pagamento</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Itens do Pedido</h3>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.flavor.name}</span>
                <span>{formatCurrency(item.lineTotal)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
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
          
          <button
            onClick={handleConfirmPayment}
            disabled={isLoading || paymentConfirmed}
            className="
              px-6 py-2 bg-green-600 text-white rounded-md
              hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              flex items-center space-x-2
            "
          >
            {isLoading && <LoadingSpinner size="sm" />}
            <span>
              {paymentConfirmed ? 'Processando...' : 'Confirmar Pagamento'}
            </span>
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center text-xs text-gray-500 border-t pt-4">
          <p>Após realizar o pagamento via PIX, clique em &quot;Confirmar Pagamento&quot;</p>
        </div>
      </div>
    </Modal>
  )
}