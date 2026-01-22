export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      vendors: {
        Row: {
          id: string
          name: string
          phone: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          phone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          created_at?: string
        }
      }
      flavors: {
        Row: {
          id: string
          name: string
          price_cents: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price_cents?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price_cents?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      app_settings: {
        Row: {
          id: number
          pastel_price_cents: number
          pix_qr_image_path: string | null
          pix_key_text: string | null
          updated_at: string
        }
        Insert: {
          id?: number
          pastel_price_cents?: number
          pix_qr_image_path?: string | null
          pix_key_text?: string | null
          updated_at?: string
        }
        Update: {
          id?: number
          pastel_price_cents?: number
          pix_qr_image_path?: string | null
          pix_key_text?: string | null
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          vendor_id: string
          customer_id: string | null
          status: string
          payment_method: string
          total_cents: number
          created_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          customer_id?: string | null
          status?: string
          payment_method?: string
          total_cents?: number
          created_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          customer_id?: string | null
          status?: string
          payment_method?: string
          total_cents?: number
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          flavor_id: string
          quantity: number
          unit_price_cents: number
          line_total_cents: number
        }
        Insert: {
          id?: string
          order_id: string
          flavor_id: string
          quantity: number
          unit_price_cents?: number
          line_total_cents?: number
        }
        Update: {
          id?: string
          order_id?: string
          flavor_id?: string
          quantity?: number
          unit_price_cents?: number
          line_total_cents?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}