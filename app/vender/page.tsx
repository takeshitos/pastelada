'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getVendorSession, clearVendorSession, formatCurrency } from '@/lib/utils'
import { useActiveFlavorsRealtime, useAppSettingsRealtime } from '@/lib/hooks'
import Container from '@/components/layouts/Container'
import Card from '@/components/layouts/Card'
import Logo from '@/components/ui/Logo'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'
import CustomerModal from '@/components/sales/CustomerModal'
import PaymentModal from '@/components/sales/PaymentModal'
import PIXModal from '@/components/sales/PIXModal'
import OrderSuccessModal from '@/components/sales/OrderSuccessModal'
import type { Flavor } from '@/types/database'
import type { CreateOrderRequest, CreateOrderResponse, ErrorResponse } from '@/types/api'

interface CartItem {
  flavor: Flavor
  quantity: number
}

interface CustomerData {
  name: string
  phone?: string
}

export default function SalesPage() {
  const router = useRouter()
  const [vendorSession, setVendorSession] = useState<{
    vendor: { id: string; name: string; phone?: string }
    loginTime: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<Record<string, number>>({})
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [pixModalOpen, setPixModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [orderResult, setOrderResult] = useState<CreateOrderResponse | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; show: boolean }>({
    message: '',
    type: 'info',
    show: false
  })

  // Fetch flavors and settings
  const { flavors, loading: flavorsLoading, error: flavorsError } = useActiveFlavorsRealtime()
  const { settings, loading: settingsLoading, error: settingsError } = useAppSettingsRealtime()

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

  const handleLogout = () => {
    clearVendorSession()
    router.push('/')
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, show: true })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }))
  }

  const updateQuantity = (flavorId: string, newQuantity: number) => {
    if (newQuantity < 0) return
    
    setCart(prev => {
      const updated = { ...prev }
      if (newQuantity === 0) {
        delete updated[flavorId]
      } else {
        updated[flavorId] = newQuantity
      }
      return updated
    })
  }

  const incrementQuantity = (flavorId: string) => {
    const currentQuantity = cart[flavorId] || 0
    updateQuantity(flavorId, currentQuantity + 1)
  }

  const decrementQuantity = (flavorId: string) => {
    const currentQuantity = cart[flavorId] || 0
    updateQuantity(flavorId, Math.max(0, currentQuantity - 1))
  }

  const calculateTotal = (): number => {
    if (!settings) return 0
    
    return Object.entries(cart).reduce((total, [flavorId, quantity]) => {
      const flavor = flavors.find(f => f.id === flavorId)
      const price = flavor?.price_cents || 0
      return total + (quantity * price)
    }, 0)
  }

  const getTotalItems = (): number => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  }

  const handleSaveOrder = () => {
    const totalItems = getTotalItems()
    if (totalItems === 0) {
      showToast('Adicione pelo menos um item ao pedido', 'error')
      return
    }
    
    // Open customer form modal
    setCustomerModalOpen(true)
  }

  const handleCustomerSubmit = (customer: CustomerData) => {
    setCustomerData(customer)
    setCustomerModalOpen(false)
    
    // Open payment selection modal
    setPaymentModalOpen(true)
  }

  const handlePaymentSelect = (method: 'PIX' | 'LOCAL') => {
    setPaymentModalOpen(false)
    
    if (method === 'PIX') {
      // Open PIX modal
      setPixModalOpen(true)
    } else {
      // Process local payment directly
      handleConfirmPayment(method)
    }
  }

  const handleConfirmPayment = async (method: 'PIX' | 'LOCAL') => {
    if (!vendorSession || !customerData) {
      showToast('Dados incompletos para finalizar venda', 'error')
      return
    }

    setProcessingPayment(true)
    
    try {
      if (method === 'PIX') {
        setPixModalOpen(false)
      }

      // Prepare order data
      const orderRequest: CreateOrderRequest = {
        vendor_id: vendorSession.vendor.id,
        customer: customerData,
        items: Object.entries(cart)
          .filter(([_, quantity]) => quantity > 0)
          .map(([flavorId, quantity]) => ({
            flavor_id: flavorId,
            quantity
          })),
        payment_method: method,
        mark_as_paid: method === 'PIX' // PIX is paid immediately, LOCAL is pending
      }

      // Call API to create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderRequest)
      })

      const data = await response.json()

      if (!response.ok) {
        const errorData = data as ErrorResponse
        throw new Error(errorData.message || 'Erro ao criar pedido')
      }

      const orderData = data as CreateOrderResponse
      setOrderResult(orderData)
      setSuccessModalOpen(true)
      
      showToast('Venda realizada com sucesso!', 'success')

    } catch (error) {
      console.error('Error creating order:', error)
      showToast(
        error instanceof Error ? error.message : 'Erro ao finalizar venda',
        'error'
      )
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleNewOrder = () => {
    // Reset all state for new order
    setCart({})
    setCustomerData(null)
    setOrderResult(null)
    setSuccessModalOpen(false)
    setCustomerModalOpen(false)
    setPaymentModalOpen(false)
    setPixModalOpen(false)
    showToast('Pronto para nova venda!', 'info')
  }

  const handleExit = () => {
    clearVendorSession()
    router.push('/')
  }

  const getCartItems = () => {
    return Object.entries(cart)
      .filter(([_, quantity]) => quantity > 0)
      .map(([flavorId, quantity]) => {
        const flavor = flavors.find(f => f.id === flavorId)!
        const lineTotal = quantity * (flavor.price_cents || 0)
        return { flavor, quantity, lineTotal }
      })
  }

  if (loading || flavorsLoading || settingsLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </main>
    )
  }

  if (!vendorSession) {
    return null // Will redirect to home
  }

  if (flavorsError || settingsError) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <Container size="lg">
          <Card title="Erro">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">
                Erro ao carregar dados: {flavorsError || settingsError}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Tentar Novamente
              </button>
            </div>
          </Card>
        </Container>
      </main>
    )
  }

  const totalAmount = calculateTotal()
  const totalItems = getTotalItems()

  return (
    <main className="min-h-screen bg-gray-50 py-4 md:py-8">
      <Container size="lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Vendas - {vendorSession.vendor.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Registre suas vendas de pastéis
            </p>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => router.push('/vendas')}
              className="
                px-3 py-2 md:px-4 text-sm md:text-base text-blue-600 border border-blue-600 rounded-md
                hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-colors duration-200
              "
            >
              Minhas Vendas
            </button>
            
            <button
              onClick={handleLogout}
              className="
                px-3 py-2 md:px-4 text-sm md:text-base bg-red-600 text-white rounded-md
                hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                transition-colors duration-200
              "
            >
              Sair
            </button>
          </div>
        </div>

        {/* Flavors Selection */}
        <div className="mb-6">
          <Card title="Selecione os Sabores">
            {flavors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum sabor ativo encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {flavors.map((flavor) => {
                  const quantity = cart[flavor.id] || 0
                  const lineTotal = quantity * (flavor.price_cents || 0)
                  
                  return (
                    <div
                      key={flavor.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{flavor.name}</h3>
                        <p className="text-sm text-green-600 font-medium">
                          {formatCurrency(flavor.price_cents)}
                        </p>
                        {quantity > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            Subtotal: {formatCurrency(lineTotal)}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => decrementQuantity(flavor.id)}
                          disabled={quantity === 0}
                          className="
                            w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center
                            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors duration-200
                          "
                        >
                          <span className="text-lg font-medium">−</span>
                        </button>
                        
                        <span className="w-8 text-center font-medium text-lg">
                          {quantity}
                        </span>
                        
                        <button
                          onClick={() => incrementQuantity(flavor.id)}
                          className="
                            w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center
                            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                            transition-colors duration-200
                          "
                        >
                          <span className="text-lg font-medium">+</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Order Summary */}
        {totalItems > 0 && (
          <div className="mb-6">
            <Card title="Resumo do Pedido">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total de itens:</span>
                  <span className="font-medium">{totalItems}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Save Order Button */}
        <div className="sticky bottom-4 md:static">
          <button
            onClick={handleSaveOrder}
            disabled={totalItems === 0}
            className="
              w-full py-4 px-6 bg-green-600 text-white text-lg font-medium rounded-lg
              hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              disabled:bg-gray-300 disabled:cursor-not-allowed
              transition-colors duration-200
              shadow-lg md:shadow-none
            "
          >
            {totalItems === 0 ? 'Adicione itens ao pedido' : `Salvar Pedido (${totalItems} ${totalItems === 1 ? 'item' : 'itens'})`}
          </button>
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}

        {/* Customer Modal */}
        <CustomerModal
          isOpen={customerModalOpen}
          onClose={() => setCustomerModalOpen(false)}
          onSubmit={handleCustomerSubmit}
        />

        {/* Payment Selection Modal */}
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          total={totalAmount}
          items={getCartItems()}
          onPaymentSelect={handlePaymentSelect}
          isLoading={processingPayment}
        />

        {/* PIX Modal */}
        <PIXModal
          isOpen={pixModalOpen}
          onClose={() => setPixModalOpen(false)}
          total={totalAmount}
          items={getCartItems()}
          qrCodePath={settings?.pix_qr_image_path || undefined}
          pixKey={settings?.pix_key_text || undefined}
          onConfirmPayment={() => handleConfirmPayment('PIX')}
          isLoading={processingPayment}
        />

        {/* Order Success Modal */}
        {orderResult && (
          <OrderSuccessModal
            isOpen={successModalOpen}
            onClose={() => setSuccessModalOpen(false)}
            orderData={orderResult}
            onNewOrder={handleNewOrder}
            onExit={handleExit}
          />
        )}
      </Container>
    </main>
  )
}