export interface Vendor {
  id: string
  name: string
  phone?: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  phone?: string
  created_at: string
}

export interface Flavor {
  id: string
  name: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface AppSettings {
  id: number
  pastel_price_cents: number
  pix_qr_image_path?: string
  pix_key_text?: string
  updated_at: string
}

export interface Order {
  id: string
  vendor_id: string
  customer_id?: string
  status: string
  payment_method: string
  total_cents: number
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  flavor_id: string
  quantity: number
  unit_price_cents: number
  line_total_cents: number
}

// Extended types for API responses
export interface OrderWithDetails extends Order {
  vendor?: Vendor
  customer?: Customer
  items: (OrderItem & { flavor?: Flavor })[]
}

export interface VendorSale {
  id: string
  created_at: string
  total_cents: number
  payment_method: string
  status: string
  customer_name?: string
  items: {
    flavor_name: string
    quantity: number
    line_total_cents: number
  }[]
}