'use client'

import { useEffect, useState } from 'react'
import Container from '@/components/layouts/Container'
import Card from '@/components/layouts/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'
import { validateName, validatePhone } from '@/lib/utils'
import type { Vendor } from '@/types/database'
import type { ErrorResponse } from '@/types/api'

export default function VendorsManagementPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState({ name: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; show: boolean }>({
    message: '',
    type: 'info',
    show: false
  })

  useEffect(() => {
    fetchVendors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, show: true })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }))
  }

  const fetchVendors = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/vendors')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch vendors')
      }

      setVendors(data.vendors || [])
    } catch (error) {
      console.error('Error fetching vendors:', error)
      showToast(
        error instanceof Error ? error.message : 'Erro ao carregar vendedores',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (vendor?: Vendor) => {
    if (vendor) {
      setEditingVendor(vendor)
      setFormData({ name: vendor.name, phone: vendor.phone || '' })
    } else {
      setEditingVendor(null)
      setFormData({ name: '', phone: '' })
    }
    setErrors({ name: '', phone: '' })
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    if (!submitting) {
      setModalOpen(false)
      setEditingVendor(null)
      setFormData({ name: '', phone: '' })
      setErrors({ name: '', phone: '' })
    }
  }

  const validateForm = (): boolean => {
    const newErrors = { name: '', phone: '' }
    let isValid = true

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
      isValid = false
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres'
      isValid = false
    }

    if (formData.phone.trim() && !validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone deve conter apenas números'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      if (editingVendor) {
        // Update existing vendor
        const response = await fetch('/api/vendors', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingVendor.id,
            name: formData.name.trim(),
            phone: formData.phone.trim() || null
          })
        })

        const data = await response.json()

        if (!response.ok) {
          const errorData = data as ErrorResponse
          throw new Error(errorData.message || 'Failed to update vendor')
        }

        showToast('Vendedor atualizado com sucesso!', 'success')
      } else {
        // Create new vendor
        const response = await fetch('/api/vendors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: formData.phone.trim() || null
          })
        })

        const data = await response.json()

        if (!response.ok) {
          const errorData = data as ErrorResponse
          throw new Error(errorData.message || 'Failed to create vendor')
        }

        showToast('Vendedor criado com sucesso!', 'success')
      }

      handleCloseModal()
      fetchVendors()
    } catch (error) {
      console.error('Error saving vendor:', error)
      showToast(
        error instanceof Error ? error.message : 'Erro ao salvar vendedor',
        'error'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (vendor: Vendor) => {
    try {
      const response = await fetch('/api/vendors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: vendor.id,
          active: !vendor.active
        })
      })

      const data = await response.json()

      if (!response.ok) {
        const errorData = data as ErrorResponse
        throw new Error(errorData.message || 'Failed to update vendor')
      }

      showToast(
        vendor.active ? 'Vendedor desativado' : 'Vendedor ativado',
        'success'
      )
      fetchVendors()
    } catch (error) {
      console.error('Error toggling vendor:', error)
      showToast(
        error instanceof Error ? error.message : 'Erro ao atualizar vendedor',
        'error'
      )
    }
  }

  return (
    <Container size="xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestão de Vendedores
          </h1>
          <p className="text-gray-600">
            Gerencie os vendedores do sistema
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="
            px-4 py-2 bg-blue-600 text-white rounded-md font-medium
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transition-colors duration-200
          "
        >
          + Novo Vendedor
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Nenhum vendedor cadastrado
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Criar primeiro vendedor
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {vendor.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {vendor.phone || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${vendor.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                        }
                      `}>
                        {vendor.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(vendor.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenModal(vendor)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleToggleActive(vendor)}
                          className={vendor.active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                        >
                          {vendor.active ? 'Desativar' : 'Ativar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="mt-6">
        <Card>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Vendedores desativados não poderão fazer login no sistema, 
              mas seu histórico de vendas será mantido. Prefira desativar ao invés de excluir 
              para preservar a integridade dos dados.
            </p>
          </div>
        </Card>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingVendor ? 'Editar Vendedor' : 'Novo Vendedor'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="vendor-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              id="vendor-name"
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }))
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
              }}
              disabled={submitting}
              className={`
                w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
                }
                ${submitting ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
              `}
              placeholder="Nome do vendedor"
              autoFocus
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
              onChange={(e) => {
                setFormData(prev => ({ ...prev, phone: e.target.value }))
                if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }))
              }}
              disabled={submitting}
              className={`
                w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.phone 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
                }
                ${submitting ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
              `}
              placeholder="Digite apenas números"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={submitting}
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
              disabled={submitting}
              className="
                px-4 py-2 bg-blue-600 text-white rounded-md
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
                flex items-center space-x-2
              "
            >
              {submitting && <LoadingSpinner size="sm" />}
              <span>{editingVendor ? 'Atualizar' : 'Criar'}</span>
            </button>
          </div>
        </form>
      </Modal>

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
