'use client'

import { formatCurrency } from '@/lib/utils'
import Modal from '@/components/ui/Modal'
import type { CreateOrderResponse } from '@/types/api'

interface OrderSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  orderData: CreateOrderResponse
  onNewOrder: () => void
  onExit: () => void
}

export default function OrderSuccessModal({ 
  isOpen, 
  onClose, 
  orderData, 
  onNewOrder, 
  onExit 
}: OrderSuccessModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Venda Realizada com Sucesso!"
      size="md"
    >
      <div className="space-y-6">
        {/* Success Icon */}
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Pedido #{orderData.order_id.slice(-8)}
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(orderData.total_cents)}
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Itens do Pedido</h4>
          <div className="space-y-2">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.flavor_name}</span>
                <span>{formatCurrency(item.line_total_cents)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span className="text-green-600">{formatCurrency(orderData.total_cents)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${orderData.status === 'paid' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
            }
          `}>
            {orderData.status === 'paid' ? '✓ Pago' : '⏳ Pendente'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={onNewOrder}
            className="
              flex-1 px-4 py-3 bg-blue-600 text-white rounded-md font-medium
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transition-colors duration-200
            "
          >
            Outra Compra
          </button>
          
          <button
            onClick={onExit}
            className="
              flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-md font-medium
              hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transition-colors duration-200
            "
          >
            Sair
          </button>
        </div>

        {/* Additional Info */}
        <div className="text-center text-xs text-gray-500 border-t pt-4">
          <p>O pedido foi registrado e pode ser visualizado em &quot;Minhas Vendas&quot;</p>
        </div>
      </div>
    </Modal>
  )
}