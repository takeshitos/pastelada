import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { CreateOrderRequest, CreateOrderResponse, ErrorResponse } from '@/types/api'

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json()
    
    // Validate request body
    if (!body.vendor_id || !body.customer?.name || !body.items || body.items.length === 0) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Missing required fields',
        code: 'VALIDATION_ERROR',
        details: {
          vendor_id: body.vendor_id ? '' : 'Vendor ID is required',
          customer_name: body.customer?.name ? '' : 'Customer name is required',
          items: body.items?.length > 0 ? '' : 'At least one item is required'
        }
      }, { status: 400 })
    }

    // Validate vendor is active
    const { data: vendor, error: vendorError } = await supabaseAdmin
      .from('vendors')
      .select('id, active')
      .eq('id', body.vendor_id)
      .eq('active', true)
      .single()

    if (vendorError || !vendor) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Invalid or inactive vendor',
        code: 'INVALID_VENDOR'
      }, { status: 400 })
    }

    // Validate items and get current price
    const flavorIds = body.items.map(item => item.flavor_id)
    const { data: flavors, error: flavorsError } = await supabaseAdmin
      .from('flavors')
      .select('id, name, active')
      .in('id', flavorIds)
      .eq('active', true)

    if (flavorsError || !flavors || flavors.length !== flavorIds.length) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Invalid or inactive flavors',
        code: 'INVALID_FLAVORS'
      }, { status: 400 })
    }

    // Validate quantities
    for (const item of body.items) {
      if (!item.quantity || item.quantity <= 0) {
        return NextResponse.json<ErrorResponse>({
          error: true,
          message: 'Invalid quantities',
          code: 'INVALID_QUANTITY',
          details: {
            quantity: 'All quantities must be greater than 0'
          }
        }, { status: 400 })
      }
    }

    // Get current pastel price
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from('app_settings')
      .select('pastel_price_cents')
      .eq('id', 1)
      .single()

    if (settingsError || !settings) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Unable to get current price',
        code: 'SETTINGS_ERROR'
      }, { status: 500 })
    }

    const currentPriceCents = (settings as any).pastel_price_cents

    // Create or find customer
    let customerId: string | null = null
    
    if (body.customer.phone) {
      // Try to find existing customer by phone
      const { data: existingCustomer } = await supabaseAdmin
        .from('customers')
        .select('id')
        .eq('phone', body.customer.phone)
        .single()
      
      if (existingCustomer) {
        customerId = (existingCustomer as any).id
      }
    }

    if (!customerId) {
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabaseAdmin
        .from('customers')
        .insert({
          name: body.customer.name,
          phone: body.customer.phone || null
        } as any)
        .select('id')
        .single()

      if (customerError || !newCustomer) {
        return NextResponse.json<ErrorResponse>({
          error: true,
          message: 'Failed to create customer',
          code: 'CUSTOMER_ERROR'
        }, { status: 500 })
      }

      customerId = (newCustomer as any).id
    }

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        vendor_id: body.vendor_id,
        customer_id: customerId,
        status: body.mark_as_paid ? 'paid' : 'created',
        payment_method: body.payment_method,
        total_cents: 0 // Will be calculated by triggers
      } as any)
      .select('id')
      .single()

    if (orderError || !order) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to create order',
        code: 'ORDER_ERROR'
      }, { status: 500 })
    }

    // Create order items
    const orderItems = body.items.map(item => ({
      order_id: (order as any).id,
      flavor_id: item.flavor_id,
      quantity: item.quantity,
      unit_price_cents: currentPriceCents,
      line_total_cents: 0 // Will be calculated by triggers
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems as any)

    if (itemsError) {
      // Rollback order creation
      await supabaseAdmin
        .from('orders')
        .delete()
        .eq('id', (order as any).id)

      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to create order items',
        code: 'ORDER_ITEMS_ERROR'
      }, { status: 500 })
    }

    // Get the complete order with calculated totals
    const { data: completeOrder, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        total_cents,
        status,
        order_items (
          quantity,
          line_total_cents,
          flavors (
            name
          )
        )
      `)
      .eq('id', (order as any).id)
      .single()

    if (fetchError || !completeOrder) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to fetch complete order',
        code: 'FETCH_ERROR'
      }, { status: 500 })
    }

    // Format response
    const response: CreateOrderResponse = {
      order_id: (completeOrder as any).id,
      total_cents: (completeOrder as any).total_cents,
      status: (completeOrder as any).status,
      items: ((completeOrder as any).order_items as any[]).map((item: any) => ({
        flavor_name: item.flavors?.name || 'Unknown',
        quantity: item.quantity,
        line_total_cents: item.line_total_cents
      }))
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json<ErrorResponse>({
      error: true,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}