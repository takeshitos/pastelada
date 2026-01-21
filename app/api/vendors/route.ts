import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateName, validatePhone } from '@/lib/utils'
import { ErrorResponse } from '@/types/api'

// GET /api/vendors - Get all vendors (or only active ones)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active_only') === 'true'

    let query = (supabaseAdmin as any)
      .from('vendors')
      .select('*')
      .order('name')

    if (activeOnly) {
      query = query.eq('active', true)
    }

    const { data: vendors, error } = await query

    if (error) {
      console.error('Error fetching vendors:', error)
      return NextResponse.json<ErrorResponse>(
        { error: true, message: 'Failed to fetch vendors', code: 'FETCH_ERROR' },
        { status: 500 }
      )
    }

    return NextResponse.json({ vendors })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json<ErrorResponse>(
      { error: true, message: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

// POST /api/vendors - Create new vendor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone } = body

    // Validate required fields
    if (!name || typeof name !== 'string') {
      return NextResponse.json<ErrorResponse>(
        { error: true, message: 'Nome é obrigatório', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // Validate name (minimum 2 characters)
    if (!validateName(name)) {
      return NextResponse.json<ErrorResponse>(
        { error: true, message: 'Nome deve ter pelo menos 2 caracteres', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // Validate phone if provided (only numbers)
    if (phone && !validatePhone(phone)) {
      return NextResponse.json<ErrorResponse>(
        { error: true, message: 'Telefone deve conter apenas números', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // Check if vendor with same name already exists (active vendors only)
    const { data: existingVendor, error: checkError } = await (supabaseAdmin as any)
      .from('vendors')
      .select('id')
      .eq('name', name.trim())
      .eq('active', true)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing vendor:', checkError)
      return NextResponse.json<ErrorResponse>(
        { error: true, message: 'Failed to validate vendor', code: 'CHECK_ERROR' },
        { status: 500 }
      )
    }

    if (existingVendor) {
      return NextResponse.json<ErrorResponse>(
        { error: true, message: 'Já existe um vendedor ativo com este nome', code: 'DUPLICATE_NAME' },
        { status: 409 }
      )
    }

    // Create new vendor
    const { data: newVendor, error: insertError } = await (supabaseAdmin as any)
      .from('vendors')
      .insert([{
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        active: true
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Error creating vendor:', insertError)
      return NextResponse.json<ErrorResponse>(
        { error: true, message: 'Failed to create vendor', code: 'INSERT_ERROR' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      vendor: newVendor,
      message: 'Vendedor cadastrado com sucesso'
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json<ErrorResponse>(
      { error: true, message: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

// PATCH /api/vendors - Update vendor
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, phone, active } = body

    // Validate required fields
    if (!id) {
      return NextResponse.json<ErrorResponse>(
        { error: true, message: 'Vendor ID is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // Build update object
    const updates: any = { updated_at: new Date().toISOString() }

    if (name !== undefined) {
      if (typeof name !== 'string' || !validateName(name)) {
        return NextResponse.json<ErrorResponse>(
          { error: true, message: 'Nome deve ter pelo menos 2 caracteres', code: 'VALIDATION_ERROR' },
          { status: 400 }
        )
      }

      // Check if another active vendor has this name
      const { data: existingVendors, error: checkError } = await (supabaseAdmin as any)
        .from('vendors')
        .select('id, name, active')
        .eq('name', name.trim())
        .eq('active', true)
        .neq('id', id)

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing vendor:', checkError)
        return NextResponse.json<ErrorResponse>(
          { error: true, message: 'Failed to check existing vendors', code: 'CHECK_ERROR' },
          { status: 500 }
        )
      }

      if (existingVendors && existingVendors.length > 0) {
        return NextResponse.json<ErrorResponse>(
          { error: true, message: 'Já existe outro vendedor ativo com este nome', code: 'DUPLICATE_NAME' },
          { status: 400 }
        )
      }

      updates.name = name.trim()
    }

    if (phone !== undefined) {
      if (phone && !validatePhone(phone)) {
        return NextResponse.json<ErrorResponse>(
          { error: true, message: 'Telefone deve conter apenas números', code: 'VALIDATION_ERROR' },
          { status: 400 }
        )
      }
      updates.phone = phone ? phone.trim() : null
    }

    if (active !== undefined) {
      updates.active = active
    }

    // Update vendor
    const { data: updatedVendor, error: updateError } = await (supabaseAdmin as any)
      .from('vendors')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating vendor:', updateError)
      return NextResponse.json<ErrorResponse>(
        { error: true, message: 'Failed to update vendor', code: 'UPDATE_ERROR' },
        { status: 500 }
      )
    }

    return NextResponse.json({ vendor: updatedVendor }, { status: 200 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json<ErrorResponse>(
      { error: true, message: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}