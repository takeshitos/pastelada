// API Request/Response types

export interface CreateOrderRequest {
  vendor_id: string
  customer: {
    name: string
    phone?: string
  }
  items: Array<{
    flavor_id: string
    quantity: number
  }>
  payment_method: 'PIX' | 'LOCAL'
  mark_as_paid: boolean
}

export interface CreateOrderResponse {
  order_id: string
  total_cents: number
  status: string
  items: Array<{
    flavor_name: string
    quantity: number
    line_total_cents: number
  }>
}

export interface VendorSalesRequest {
  vendor_id: string
  start_date?: string
  end_date?: string
  limit?: number
  offset?: number
}

export interface VendorSalesResponse {
  sales: Array<{
    id: string
    created_at: string
    total_cents: number
    payment_method: string
    status: string
    customer_name?: string
    customer_phone?: string | null
    items: Array<{
      flavor_name: string
      quantity: number
      line_total_cents: number
    }>
  }>
  total_count: number
}

export interface ErrorResponse {
  error: true
  message: string
  code: string
  details?: Record<string, string>
}