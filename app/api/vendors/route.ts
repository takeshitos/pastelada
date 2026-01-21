import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateName, validatePhone } from '@/lib/utils'

// GET /api/vendors - Get all active vendors
export async function GET() {
  try {
    const { data: vendors, error } = await (supabaseAdmin as any)
      .from('vendors')
      .select('*')
      .eq('active', true)
      .order('name')

    if (error) {
      console.error('Error fetching vendors:', error)
      return NextResponse.json(
        { error: true, message: 'Failed to fetch vendors' },
        { status: 500 }
      )
    }

    return NextResponse.json({ vendors })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
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
      return NextResponse.json(
        { error: true, message: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    // Validate name (minimum 2 characters)
    if (!validateName(name)) {
      return NextResponse.json(
        { error: true, message: 'Nome deve ter pelo menos 2 caracteres' },
        { status: 400 }
      )
    }

    // Validate phone if provided (only numbers)
    if (phone && !validatePhone(phone)) {
      return NextResponse.json(
        { error: true, message: 'Telefone deve conter apenas números' },
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
      return NextResponse.json(
        { error: true, message: 'Failed to validate vendor' },
        { status: 500 }
      )
    }

    if (existingVendor) {
      return NextResponse.json(
        { error: true, message: 'Já existe um vendedor ativo com este nome' },
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
      return NextResponse.json(
        { error: true, message: 'Failed to create vendor' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      vendor: newVendor,
      message: 'Vendedor cadastrado com sucesso'
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    )
  }
}