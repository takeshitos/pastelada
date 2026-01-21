'use client'

import { useEffect, useState } from 'react'
import Container from '@/components/layouts/Container'
import Card from '@/components/layouts/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'
import type { Flavor } from '@/types/database'
import type { ErrorResponse } from '@/types/api'

export default function FlavorsManagementPage() {
  const [flavors, setFlavors] = useState<Flavor[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFlavor, setEditingFlavor] = useState<Flavor | null>(null)
  const [flavorName, setFlavorName] = useState('')
  const [nameError, setNameError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; show: boolean }>({
    message: '',
    type: 'info',
    show: false
  })

  useEffect(() => {
    fetchFlavors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, show: true })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }))
  }

  const fetchFlavors = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/flavors')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch flavors')
      }

      setFlavors(data.flavors || [])
    } catch (error) {
      console.error('Error fetching flavors:', error)
      showToast(
        error instanceof Error ? error.message : 'Erro ao carregar sabores',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (flavor?: Flavor) => {
    if (flavor) {
      setEditingFlavor(flavor)
      setFlavorName(flavor.name)
    } else {
      setEditingFlavor(null)
      setFlavorName('')
    }
    setNameError('')
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    if (!submitting) {
      setModalOpen(false)
      setEditingFlavor(null)
      setFlavorName('')
      setNameError('')
    }
  }

  const validateName = (): boolean => {
    if (!flavorName.trim()) {
      setNameError('Nome é obrigatório')
      return false
    }
    if (flavorName.trim().length < 2) {
      setNameError('Nome deve ter pelo menos 2 caracteres')
      return false
    }
    setNameError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateName()) {
      return
    }

    setSubmitting(true)

    try {
      if (editingFlavor) {
        // Update existing flavor
        const response = await fetch('/api/flavors', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingFlavor.id,
            name: flavorName.trim()
          })
        })

        const data = await response.json()

        if (!response.ok) {
          const errorData = data as ErrorResponse
          throw new Error(errorData.message || 'Failed to update flavor')
        }

        showToast('Sabor atualizado com sucesso!', 'success')
      } else {
        // Create new flavor
        const response = await fetch('/api/flavors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: flavorName.trim() })
        })

        const data = await response.json()

        if (!response.ok) {
          const errorData = data as ErrorResponse
          throw new Error(errorData.message || 'Failed to create flavor')
        }

        showToast('Sabor criado com sucesso!', 'success')
      }

      handleCloseModal()
      fetchFlavors()
    } catch (error) {
      console.error('Error saving flavor:', error)
      showToast(
        error instanceof Error ? error.message : 'Erro ao salvar sabor',
        'error'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (flavor: Flavor) => {
    try {
      const response = await fetch('/api/flavors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: flavor.id,
          active: !flavor.active
        })
      })

      const data = await response.json()

      if (!response.ok) {
        const errorData = data as ErrorResponse
        throw new Error(errorData.message || 'Failed to update flavor')
      }

      showToast(
        flavor.active ? 'Sabor desativado' : 'Sabor ativado',
        'success'
      )
      fetchFlavors()
    } catch (error) {
      console.error('Error toggling flavor:', error)
      showToast(
        error instanceof Error ? error.message : 'Erro ao atualizar sabor',
        'error'
      )
    }
  }

  const handleDelete = async (flavor: Flavor) => {
    if (!confirm(`Tem certeza que deseja excluir o sabor "${flavor.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/flavors?id=${flavor.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        const errorData = data as ErrorResponse
        throw new Error(errorData.message || 'Failed to delete flavor')
      }

      if (data.deactivated) {
        showToast(
          'Sabor possui vendas e foi desativado ao invés de excluído',
          'info'
        )
      } else {
        showToast('Sabor excluído com sucesso!', 'success')
      }

      fetchFlavors()
    } catch (error) {
      console.error('Error deleting flavor:', error)
      showToast(
        error instanceof Error ? error.message : 'Erro ao excluir sabor',
        'error'
      )
    }
  }

  return (
    <Container size="xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestão de Sabores
          </h1>
          <p className="text-gray-600">
            Gerencie os sabores de pastéis disponíveis
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
          + Novo Sabor
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : flavors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Nenhum sabor cadastrado
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Criar primeiro sabor
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
                {flavors.map((flavor) => (
                  <tr key={flavor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {flavor.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${flavor.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                        }
                      `}>
                        {flavor.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(flavor.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenModal(flavor)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleToggleActive(flavor)}
                          className={flavor.active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                        >
                          {flavor.active ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          onClick={() => handleDelete(flavor)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Excluir
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingFlavor ? 'Editar Sabor' : 'Novo Sabor'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="flavor-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Sabor *
            </label>
            <input
              id="flavor-name"
              type="text"
              value={flavorName}
              onChange={(e) => {
                setFlavorName(e.target.value)
                if (nameError) setNameError('')
              }}
              disabled={submitting}
              className={`
                w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${nameError 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
                }
                ${submitting ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
              `}
              placeholder="Ex: Carne, Queijo, Frango..."
              autoFocus
            />
            {nameError && (
              <p className="mt-1 text-sm text-red-600">{nameError}</p>
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
              <span>{editingFlavor ? 'Atualizar' : 'Criar'}</span>
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
