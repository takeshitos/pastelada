'use client'

import { useState } from 'react'
import { validateName, validatePhone } from '@/lib/utils'
import { ButtonSpinner } from '@/components/ui/LoadingSpinner'

export interface VendorFormProps {
  onSubmit: (data: { name: string; phone?: string }) => Promise<void>
  loading?: boolean
  className?: string
}

export default function VendorForm({ onSubmit, loading = false, className = '' }: VendorFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres'
    }

    // Validate phone if provided
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone deve conter apenas números'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined
      })
      
      // Reset form on success
      setFormData({ name: '', phone: '' })
      setErrors({})
    } catch (error) {
      // Error handling is done by parent component
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div>
        <label htmlFor="vendor-name" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Vendedor *
        </label>
        <input
          id="vendor-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`
            w-full px-4 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${loading ? 'bg-gray-50 cursor-not-allowed' : ''}
          `}
          placeholder="Digite o nome do vendedor"
          disabled={loading}
          maxLength={100}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="vendor-phone" className="block text-sm font-medium text-gray-700 mb-1">
          Telefone (opcional)
        </label>
        <input
          id="vendor-phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className={`
            w-full px-4 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${loading ? 'bg-gray-50 cursor-not-allowed' : ''}
          `}
          placeholder="Digite apenas números"
          disabled={loading}
          maxLength={20}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        "
      >
        {loading && <ButtonSpinner />}
        Cadastrar Vendedor
      </button>
    </form>
  )
}