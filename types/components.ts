// Component prop types for the Pastelada system

import { Vendor, Customer, Flavor, Order, OrderItem, AppSettings, VendorSale } from './database'

// Vendor Management Components
export interface VendorSelectorProps {
  vendors: Vendor[]
  onVendorSelect: (vendor: Vendor) => void
  onNewVendor: (vendor: { name: string; phone?: string }) => void
}

export interface VendorFormProps {
  onSubmit: (vendor: { name: string; phone?: string }) => void
  isLoading?: boolean
}

export interface VendorListProps {
  vendors: Vendor[]
  onVendorSelect: (vendor: Vendor) => void
}

// Sales Interface Components
export interface SalesCartProps {
  flavors: Flavor[]
  pricePerUnit: number
  onQuantityChange: (flavorId: string, quantity: number) => void
  quantities: Record<string, number>
}

export interface FlavorSelectorProps {
  flavor: Flavor
  quantity: number
  pricePerUnit: number
  onQuantityChange: (quantity: number) => void
}

export interface CustomerFormProps {
  onSubmit: (customer: { name: string; phone?: string }) => void
  isLoading?: boolean
}

export interface PaymentSelectorProps {
  total: number
  onPaymentSelect: (method: 'PIX' | 'LOCAL') => void
}

export interface PIXModalProps {
  isOpen: boolean
  onClose: () => void
  total: number
  items: Array<{ flavor_name: string; quantity: number; line_total_cents: number }>
  qrCodeUrl?: string
  onConfirmPayment: () => void
}

// Admin Panel Components
export interface AdminLayoutProps {
  children: React.ReactNode
  title: string
}

export interface FlavorManagerProps {
  flavors: Flavor[]
  onFlavorCreate: (flavor: { name: string }) => void
  onFlavorUpdate: (id: string, updates: Partial<Flavor>) => void
  onFlavorToggle: (id: string, active: boolean) => void
}

export interface VendorManagerProps {
  vendors: Vendor[]
  onVendorUpdate: (id: string, updates: Partial<Vendor>) => void
  onVendorToggle: (id: string, active: boolean) => void
}

export interface SettingsManagerProps {
  settings: AppSettings
  onPriceUpdate: (priceInCents: number) => void
  onQRCodeUpload: (file: File) => void
}

export interface ReportsViewProps {
  sales: VendorSale[]
  totalCount: number
  onFilterChange: (filters: ReportFilters) => void
  onPageChange: (page: number) => void
}

// Shared Components
export interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  onRowClick?: (item: T) => void
  isLoading?: boolean
  emptyMessage?: string
}

export interface TableColumn<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
  className?: string
}

// Form and Filter Types
export interface ReportFilters {
  startDate?: string
  endDate?: string
  vendorId?: string
  flavorId?: string
  paymentMethod?: 'PIX' | 'LOCAL'
  search?: string
}

export interface DateRangeFilter {
  label: string
  startDate: Date
  endDate: Date
}

// Cart and Order Types
export interface CartItem {
  flavor: Flavor
  quantity: number
  lineTotal: number
}

export interface OrderSummary {
  items: CartItem[]
  total: number
  customer: { name: string; phone?: string }
  paymentMethod: 'PIX' | 'LOCAL'
}

// Local Storage Types
export interface VendorSession {
  vendor: Vendor
  loginTime: string
}

// Hook Return Types
export interface UseVendorSalesReturn {
  sales: VendorSale[]
  totalCount: number
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export interface UseFlavorsReturn {
  flavors: Flavor[]
  activeFlavors: Flavor[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export interface UseAppSettingsReturn {
  settings: AppSettings | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}