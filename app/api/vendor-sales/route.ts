import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { VendorSalesResponse, ErrorResponse } from '@/types/api'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const vendorId = searchParams.get('vendor_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Validate required parameters
    if (!vendorId) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'vendor_id is required',
        code: 'VALIDATION_ERROR'
      }, { status: 400 })
    }

    // Validate vendor exists and is active
    const { data: vendor, error: vendorError } = await supabaseAdmin
      .from('vendors')
      .select('id, active')
      .eq('id', vendorId)
      .single()

    if (vendorError || !vendor) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Invalid vendor',
        code: 'INVALID_VENDOR'
      }, { status: 400 })
    }

    // Build query for orders
    let query = supabaseAdmin
      .from('orders')
      .select(`
        id,
        created_at,
        total_cents,
        payment_method,
        status,
        customers (
          name,
          phone
        ),
        order_items (
          quantity,
          line_total_cents,
          flavors (
            name
          )
        )
      `)
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false })

    // Apply date filters if provided
    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    // Get total count for pagination (without limit/offset)
    const { count: totalCount, error: countError } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('vendor_id', vendorId)
      .gte('created_at', startDate || '1900-01-01')
      .lte('created_at', endDate || '2100-12-31')

    if (countError) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to get total count',
        code: 'COUNT_ERROR'
      }, { status: 500 })
    }

    // Apply pagination
    const { data: orders, error: ordersError } = await query
      .range(offset, offset + limit - 1)

    if (ordersError) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to fetch vendor sales',
        code: 'FETCH_ERROR'
      }, { status: 500 })
    }

    // Format response
    const sales = orders?.map((order: any) => ({
      id: order.id,
      created_at: order.created_at,
      total_cents: order.total_cents,
      payment_method: order.payment_method,
      status: order.status,
      customer_name: order.customers?.name || 'Unknown',
      customer_phone: order.customers?.phone || null,
      items: order.order_items.map((item: any) => ({
        flavor_name: item.flavors?.name || 'Unknown',
        quantity: item.quantity,
        line_total_cents: item.line_total_cents
      }))
    })) || []

    const response: VendorSalesResponse = {
      sales,
      total_count: totalCount || 0
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Vendor sales fetch error:', error)
    return NextResponse.json<ErrorResponse>({
      error: true,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}