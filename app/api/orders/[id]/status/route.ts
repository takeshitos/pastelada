import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ErrorResponse } from '@/types/api'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

interface UpdateStatusRequest {
  status: 'created' | 'paid' | 'completed' | 'cancelled'
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    const body: UpdateStatusRequest = await request.json()

    // Validate status
    const validStatuses = ['created', 'paid', 'completed', 'cancelled']
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Invalid status',
        code: 'VALIDATION_ERROR',
        details: {
          status: `Status must be one of: ${validStatuses.join(', ')}`
        }
      }, { status: 400 })
    }

    // Check if order exists
    const { data: existingOrder, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('id, status')
      .eq('id', orderId)
      .single()

    if (fetchError || !existingOrder) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Order not found',
        code: 'NOT_FOUND'
      }, { status: 404 })
    }

    // Update order status
    // Using any cast to bypass Supabase type restrictions for new 'completed' status
    const supabase: any = supabaseAdmin
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({ status: body.status })
      .eq('id', orderId)
      .select('id, status')
      .single()

    if (updateError || !updatedOrder) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to update order status',
        code: 'UPDATE_ERROR'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder
    }, { status: 200 })

  } catch (error) {
    console.error('Order status update error:', error)
    return NextResponse.json<ErrorResponse>({
      error: true,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}
