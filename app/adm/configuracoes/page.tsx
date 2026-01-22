'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Container from '@/components/layouts/Container'
import Card from '@/components/layouts/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'
import { formatCurrency, reaisToCents } from '@/lib/utils'
import type { AppSettings } from '@/types/database'
import type { ErrorResponse } from '@/types/api'

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [priceReais, setPriceReais] = useState('')
  const [priceError, setPriceError] = useState('')
  const [pixKey, setPixKey] = useState('')
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null)
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; show: boolean }>({
    message: '',
    type: 'info',
    show: false
  })

  useEffect(() => {
    fetchSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, show: true })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }))
  }

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch settings')
      }

      const fetchedSettings = data.settings as AppSettings
      setSettings(fetchedSettings)
      
      // Convert cents to reais for display
      const reais = fetchedSettings.pastel_price_cents / 100
      setPriceReais(reais.toFixed(2))
      
      setPixKey(fetchedSettings.pix_key_text || '')
      
      if (fetchedSettings.pix_qr_image_path) {
        // Get public URL from Supabase
        const qrUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-assets/${fetchedSettings.pix_qr_image_path}`
        setQrCodePreview(qrUrl)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      showToast(
        error instanceof Error ? error.message : 'Erro ao carregar configurações',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const validatePrice = (): boolean => {
    const price = parseFloat(priceReais)
    
    if (isNaN(price)) {
      setPriceError('Preço inválido')
      return false
    }
    
    if (price < 0) {
      setPriceError('Preço não pode ser negativo')
      return false
    }
    
    setPriceError('')
    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (!file) return
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Por favor, selecione uma imagem', 'error')
      return
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast('Imagem muito grande. Máximo 2MB', 'error')
      return
    }
    
    setQrCodeFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setQrCodePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePrice()) {
      return
    }

    setSubmitting(true)

    try {
      // Convert reais to cents
      const priceCents = reaisToCents(parseFloat(priceReais))

      let qrCodePath: string | null = null

      // Upload QR code if a new file was selected
      if (qrCodeFile) {
        const formData = new FormData()
        formData.append('file', qrCodeFile)

        const uploadResponse = await fetch('/api/settings/upload-qr', {
          method: 'POST',
          body: formData
        })

        const uploadData = await uploadResponse.json()

        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || 'Erro ao fazer upload do QR Code')
        }

        qrCodePath = uploadData.path
      }

      // Update settings
      const updateBody: any = {
        pastel_price_cents: priceCents,
        pix_key_text: pixKey.trim() || null
      }

      if (qrCodePath) {
        updateBody.pix_qr_image_path = qrCodePath
      }

      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateBody)
      })

      const data = await response.json()

      if (!response.ok) {
        const errorData = data as ErrorResponse
        throw new Error(errorData.message || 'Failed to update settings')
      }

      showToast('Configurações atualizadas com sucesso!', 'success')
      setQrCodeFile(null)
      fetchSettings()
    } catch (error) {
      console.error('Error saving settings:', error)
      showToast(
        error instanceof Error ? error.message : 'Erro ao salvar configurações',
        'error'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Container size="xl">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    )
  }

  return (
    <Container size="xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Configurações do Sistema
        </h1>
        <p className="text-gray-600">
          Gerencie o preço dos pastéis e informações de pagamento PIX
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Price Settings */}
        <Card title="Preço do Pastel">
          <div className="space-y-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  R$
                </span>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={priceReais}
                  onChange={(e) => {
                    setPriceReais(e.target.value)
                    if (priceError) setPriceError('')
                  }}
                  disabled={submitting}
                  className={`
                    w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${priceError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500'
                    }
                    ${submitting ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                  `}
                  placeholder="0.00"
                />
              </div>
              {priceError && (
                <p className="mt-1 text-sm text-red-600">{priceError}</p>
              )}
              {settings && !priceError && (
                <p className="mt-1 text-sm text-gray-500">
                  Preço atual: {formatCurrency(settings.pastel_price_cents)}
                </p>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> O novo preço será aplicado apenas para vendas futuras. 
                Vendas já realizadas manterão o preço original.
              </p>
            </div>
          </div>
        </Card>

        {/* PIX Settings */}
        <Card title="Configurações PIX">
          <div className="space-y-6">
            {/* PIX Key */}
            <div>
              <label htmlFor="pix-key" className="block text-sm font-medium text-gray-700 mb-1">
                Chave PIX (opcional)
              </label>
              <input
                id="pix-key"
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                disabled={submitting}
                className={`
                  w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${submitting ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                `}
                placeholder="email@exemplo.com, telefone, CPF/CNPJ ou chave aleatória"
              />
              <p className="mt-1 text-sm text-gray-500">
                Chave PIX para referência (não afeta o QR Code)
              </p>
            </div>

            {/* QR Code Upload */}
            <div>
              <label htmlFor="qr-code" className="block text-sm font-medium text-gray-700 mb-1">
                QR Code PIX
              </label>
              <input
                id="qr-code"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={submitting}
                className={`
                  block w-full text-sm text-gray-700
                  border border-gray-300 rounded-md shadow-sm
                  bg-white
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${submitting ? 'bg-gray-50 cursor-not-allowed opacity-50' : ''}
                `}
              />
              <p className="mt-1 text-sm text-gray-500">
                Imagem do QR Code para pagamento PIX (máximo 2MB)
              </p>
            </div>

            {/* QR Code Preview */}
            {qrCodePreview && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview do QR Code
                </label>
                <div className="border-2 border-gray-200 rounded-lg p-4 inline-block">
                  <Image 
                    src={qrCodePreview} 
                    alt="QR Code Preview" 
                    width={192}
                    height={192}
                    className="w-48 h-48 object-contain"
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="
              px-6 py-3 bg-blue-600 text-white font-medium rounded-md
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              flex items-center space-x-2
            "
          >
            {submitting && <LoadingSpinner size="sm" />}
            <span>{submitting ? 'Salvando...' : 'Salvar Configurações'}</span>
          </button>
        </div>
      </form>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </Container>
  )
}
