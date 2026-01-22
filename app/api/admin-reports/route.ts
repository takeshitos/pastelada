import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ErrorResponse } from '@/types/api'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Disable caching

export interface AdminReportsResponse {
  sales: Array<{
    id: string
    created_at: string
    total_cents: number
    payment_method: string
    status: string
    vendor_name: string
    customer_name: string
    customer_phone: string | null
    items: Array<{
      flavor_name: string
      quantity: number
      line_total_cents: number
    }>
  }>
  total_count: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const vendorId = searchParams.get('vendor_id')
    const flavorId = searchParams.get('flavor_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const searchTerm = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query for orders
    let query = supabaseAdmin
      .from('orders')
      .select(`
        id,
        created_at,
        total_cents,
        payment_method,
        status,
        vendors (
          name
        ),
        customers (
          name,
          phone
        ),
        order_items (
          quantity,
          line_total_cents,
          flavors (
            id,
            name
          )
        )
      `)
      .order('created_at', { ascending: false })

    // Apply vendor filter if provided
    if (vendorId) {
      query = query.eq('vendor_id', vendorId)
    }

    // Apply date filters if provided
    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    // Get data
    const { data: orders, error: ordersError } = await query
      .range(offset, offset + limit - 1)

    if (ordersError) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to fetch reports',
        code: 'FETCH_ERROR'
      }, { status: 500 })
    }

    // Filter by flavor if provided (post-query filtering)
    let filteredOrders = orders || []
    if (flavorId) {
      filteredOrders = filteredOrders.filter((order: any) => 
        order.order_items.some((item: any) => item.flavors?.id === flavorId)
      )
    }

    // Filter by search term if provided (post-query filtering)
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      filteredOrders = filteredOrders.filter((order: any) => {
        const vendorName = order.vendors?.name?.toLowerCase() || ''
        const customerName = order.customers?.name?.toLowerCase() || ''
        const flavorNames = order.order_items
          .map((item: any) => item.flavors?.name?.toLowerCase() || '')
          .join(' ')
        
        return vendorName.includes(lowerSearch) || 
               customerName.includes(lowerSearch) || 
               flavorNames.includes(lowerSearch)
      })
    }

    // Get total count for pagination
    let countQuery = supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true })

    if (vendorId) {
      countQuery = countQuery.eq('vendor_id', vendorId)
    }
    if (startDate) {
      countQuery = countQuery.gte('created_at', startDate)
    }
    if (endDate) {
      countQuery = countQuery.lte('created_at', endDate)
    }

    const { count: totalCount, error: countError } = await countQuery

    if (countError) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to get total count',
        code: 'COUNT_ERROR'
      }, { status: 500 })
    }

    // Format response
    const sales = filteredOrders.map((order: any) => ({
      id: order.id,
      created_at: order.created_at,
      total_cents: order.total_cents,
      payment_method: order.payment_method,
      status: order.status,
      vendor_name: order.vendors?.name || 'Unknown',
      customer_name: order.customers?.name || 'Unknown',
      customer_phone: order.customers?.phone || null,
      items: order.order_items.map((item: any) => ({
        flavor_name: item.flavors?.name || 'Unknown',
        quantity: item.quantity,
        line_total_cents: item.line_total_cents
      }))
    }))

    const response: AdminReportsResponse = {
      sales,
      total_count: totalCount || 0
    }

    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    })

  } catch (error) {
    console.error('Admin reports fetch error:', error)
    return NextResponse.json<ErrorResponse>({
      error: true,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}
