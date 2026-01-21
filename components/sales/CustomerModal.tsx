'use client'

import { useState } from 'react'
import { validateName, validatePhone } from '@/lib/utils'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (customer: { name: string; phone?: string }) => void
  isLoading?: boolean
}

export default function CustomerModal({ isOpen, onClose, onSubmit, isLoading = false }: CustomerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  })
  const [errors, setErrors] = useState({
    name: '',
    phone: ''
  })

  const handleInputChange = (field: 'name' | 'phone', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors = { name: '', phone: '' }
    let isValid = true

    // Validate name (required, minimum 2 characters)
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
      isValid = false
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres'
      isValid = false
    }

    // Validate phone (optional, but if provided must be only numbers)
    if (formData.phone.trim() && !validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone deve conter apenas números'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const customerData = {
      name: formData.name.trim(),
      phone: formData.phone.trim() || undefined
    }

    onSubmit(customerData)
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ name: '', phone: '' })
      setErrors({ name: '', phone: '' })
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Dados do Cliente"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome *
          </label>
          <input
            id="customer-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={isLoading}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.name 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500'
              }
              ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
            `}
            placeholder="Digite o nome do cliente"
            autoFocus
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="customer-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefone (opcional)
          </label>
          <input
            id="customer-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={isLoading}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.phone 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500'
              }
              ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
            `}
            placeholder="Digite apenas números"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
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
            type="submit"
            disabled={isLoading}
            className="
              px-4 py-2 bg-blue-600 text-white rounded-md
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              flex items-center space-x-2
            "
          >
            {isLoading && <LoadingSpinner size="sm" />}
            <span>Salvar e escolher pagamento</span>
          </button>
        </div>
      </form>
    </Modal>
  )
}