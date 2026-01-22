import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ErrorResponse } from '@/types/api'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Disable caching

// GET - List all flavors (with optional filter for active only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active_only') === 'true'

    let query = (supabaseAdmin as any)
      .from('flavors')
      .select('*')
      .order('name', { ascending: true })

    if (activeOnly) {
      query = query.eq('active', true)
    }

    const { data: flavors, error } = await query

    if (error) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to fetch flavors',
        code: 'FETCH_ERROR'
      }, { status: 500 })
    }

    return NextResponse.json({ flavors }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    })

  } catch (error) {
    console.error('Flavors fetch error:', error)
    return NextResponse.json<ErrorResponse>({
      error: true,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}

// POST - Create new flavor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, price_cents } = body

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Name is required',
        code: 'VALIDATION_ERROR'
      }, { status: 400 })
    }

    // Validate price if provided
    if (price_cents !== undefined && (typeof price_cents !== 'number' || price_cents < 0)) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Price must be a non-negative number',
        code: 'VALIDATION_ERROR'
      }, { status: 400 })
    }

    // Check if flavor name already exists (case-insensitive)
    const { data: existingFlavors, error: checkError } = await (supabaseAdmin as any)
      .from('flavors')
      .select('id, name, active')
      .ilike('name', name.trim())

    if (checkError) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to check existing flavors',
        code: 'CHECK_ERROR'
      }, { status: 500 })
    }

    // Check if an active flavor with this name exists
    const activeFlavorExists = existingFlavors?.some((f: any) => f.active)
    if (activeFlavorExists) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'A flavor with this name already exists',
        code: 'DUPLICATE_NAME'
      }, { status: 400 })
    }

    // Get default price from settings if not provided
    let finalPrice = price_cents
    if (finalPrice === undefined) {
      const { data: settings } = await (supabaseAdmin as any)
        .from('app_settings')
        .select('pastel_price_cents')
        .eq('id', 1)
        .single()
      
      finalPrice = settings?.pastel_price_cents || 500
    }

    // Create new flavor
    const { data: newFlavor, error: insertError } = await (supabaseAdmin as any)
      .from('flavors')
      .insert({
        name: name.trim(),
        price_cents: finalPrice,
        active: true
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to create flavor',
        code: 'INSERT_ERROR'
      }, { status: 500 })
    }

    return NextResponse.json({ flavor: newFlavor }, { status: 201 })

  } catch (error) {
    console.error('Flavor creation error:', error)
    return NextResponse.json<ErrorResponse>({
      error: true,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}

// PATCH - Update flavor
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, price_cents, active } = body

    // Validate required fields
    if (!id) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Flavor ID is required',
        code: 'VALIDATION_ERROR'
      }, { status: 400 })
    }

    // Build update object
    const updates: any = { updated_at: new Date().toISOString() }
    
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json<ErrorResponse>({
          error: true,
          message: 'Name must be a non-empty string',
          code: 'VALIDATION_ERROR'
        }, { status: 400 })
      }

      // Check if another active flavor has this name
      const { data: existingFlavors, error: checkError } = await (supabaseAdmin as any)
        .from('flavors')
        .select('id, name, active')
        .ilike('name', name.trim())
        .neq('id', id)

      if (checkError) {
        return NextResponse.json<ErrorResponse>({
          error: true,
          message: 'Failed to check existing flavors',
          code: 'CHECK_ERROR'
        }, { status: 500 })
      }

      const activeFlavorExists = existingFlavors?.some((f: any) => f.active)
      if (activeFlavorExists) {
        return NextResponse.json<ErrorResponse>({
          error: true,
          message: 'Another flavor with this name already exists',
          code: 'DUPLICATE_NAME'
        }, { status: 400 })
      }

      updates.name = name.trim()
    }

    if (price_cents !== undefined) {
      if (typeof price_cents !== 'number' || price_cents < 0) {
        return NextResponse.json<ErrorResponse>({
          error: true,
          message: 'Price must be a non-negative number',
          code: 'VALIDATION_ERROR'
        }, { status: 400 })
      }
      updates.price_cents = price_cents
    }

    if (active !== undefined) {
      updates.active = active
    }

    // Update flavor
    const { data: updatedFlavor, error: updateError } = await (supabaseAdmin as any)
      .from('flavors')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to update flavor',
        code: 'UPDATE_ERROR'
      }, { status: 500 })
    }

    return NextResponse.json({ flavor: updatedFlavor }, { status: 200 })

  } catch (error) {
    console.error('Flavor update error:', error)
    return NextResponse.json<ErrorResponse>({
      error: true,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}

// DELETE - Delete or deactivate flavor
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Flavor ID is required',
        code: 'VALIDATION_ERROR'
      }, { status: 400 })
    }

    // Check if flavor has any orders
    const { data: orderItems, error: checkError } = await (supabaseAdmin as any)
      .from('order_items')
      .select('id')
      .eq('flavor_id', id)
      .limit(1)

    if (checkError) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to check flavor usage',
        code: 'CHECK_ERROR'
      }, { status: 500 })
    }

    // If flavor has orders, deactivate instead of delete
    if (orderItems && orderItems.length > 0) {
      const { data: deactivatedFlavor, error: deactivateError } = await (supabaseAdmin as any)
        .from('flavors')
        .update({ active: false, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (deactivateError) {
        return NextResponse.json<ErrorResponse>({
          error: true,
          message: 'Failed to deactivate flavor',
          code: 'DEACTIVATE_ERROR'
        }, { status: 500 })
      }

      return NextResponse.json({ 
        flavor: deactivatedFlavor,
        deactivated: true,
        message: 'Flavor has existing orders and was deactivated instead of deleted'
      }, { status: 200 })
    }

    // No orders, safe to delete
    const { error: deleteError } = await (supabaseAdmin as any)
      .from('flavors')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to delete flavor',
        code: 'DELETE_ERROR'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Flavor deleted successfully'
    }, { status: 200 })

  } catch (error) {
    console.error('Flavor deletion error:', error)
    return NextResponse.json<ErrorResponse>({
      error: true,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}
