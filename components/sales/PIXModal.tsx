'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import type { Flavor } from '@/types/database'

interface PIXModalProps {
  isOpen: boolean
  onClose: () => void
  total: number
  items: Array<{ flavor: Flavor; quantity: number; lineTotal: number }>
  qrCodePath?: string
  pixKey?: string
  onConfirmPayment: () => void
  isLoading?: boolean
}

export default function PIXModal({ 
  isOpen, 
  onClose, 
  total, 
  items, 
  qrCodePath,
  pixKey,
  onConfirmPayment, 
  isLoading = false 
}: PIXModalProps) {
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

  useEffect(() => {
    if (qrCodePath) {
      // Get public URL from Supabase Storage
      const { data } = supabase.storage
        .from('public-assets')
        .getPublicUrl(qrCodePath)
      
      if (data?.publicUrl) {
        setQrCodeUrl(data.publicUrl)
      }
    }
  }, [qrCodePath])

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
      <div className="space-y-4 sm:space-y-6">
        {/* QR Code Section */}
        <div className="text-center">
          <div className="bg-white p-4 sm:p-6 rounded-lg border-2 border-gray-200 inline-block">
            {qrCodeUrl ? (
              <Image 
                src={qrCodeUrl} 
                alt="QR Code PIX" 
                width={160}
                height={160}
                className="mx-auto w-40 h-40 sm:w-48 sm:h-48"
              />
            ) : (
              <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-100 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v1.5a.5.5 0 001 0V5a1 1 0 011-1h1.5a.5.5 0 000-1H4zM15.5 3a.5.5 0 01.5.5V5a1 1 0 001 1h1.5a.5.5 0 010 1H17a2 2 0 01-2-2V3.5a.5.5 0 01.5-.5zM4 15.5a.5.5 0 01-.5-.5v-1.5A1 1 0 014 13h1.5a.5.5 0 010 1H5a1 1 0 00-1 1v1.5a.5.5 0 01-.5.5zM15.5 17a.5.5 0 01-.5-.5V15a1 1 0 00-1-1h-1.5a.5.5 0 010-1H15a2 2 2 0 012 2v1.5a.5.5 0 01-.5.5z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs sm:text-sm text-gray-500">QR Code não disponível</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-3">
            Escaneie o QR Code com seu app de pagamento
          </p>
        </div>

        {/* PIX Key */}
        {pixKey && (
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Chave PIX</h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white p-2 sm:p-3 rounded border border-gray-200 gap-2">
              <code className="text-xs sm:text-sm text-gray-700 break-all flex-1">{pixKey}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(pixKey)
                }}
                className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors whitespace-nowrap"
              >
                Copiar
              </button>
            </div>
          </div>
        )}

        {/* Payment Details */}
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-3 text-sm sm:text-base">Detalhes do Pagamento</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-blue-800">Valor total:</span>
              <span className="font-medium text-blue-900">{formatCurrency(total)}</span>
            </div>
            <div className="text-xs sm:text-sm text-blue-700">
              <p>• Pagamento instantâneo via PIX</p>
              <p>• Confirme após realizar o pagamento</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Itens do Pedido</h3>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-xs sm:text-sm">
                <span>{item.quantity}x {item.flavor.name}</span>
                <span>{formatCurrency(item.lineTotal)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="
              w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-md
              hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              order-2 sm:order-1
            "
          >
            Cancelar
          </button>
          
          <button
            onClick={handleConfirmPayment}
            disabled={isLoading || paymentConfirmed}
            className="
              w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-md
              hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              flex items-center justify-center space-x-2
              order-1 sm:order-2
            "
          >
            {isLoading && <LoadingSpinner size="sm" />}
            <span>
              {paymentConfirmed ? 'Processando...' : 'Confirmar Pagamento'}
            </span>
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center text-xs text-gray-500 border-t pt-3 sm:pt-4">
          <p>Após realizar o pagamento via PIX, clique em &quot;Confirmar Pagamento&quot;</p>
        </div>
      </div>
    </Modal>
  )
}