import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ErrorResponse } from '@/types/api'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Disable caching

// GET - Get app settings
export async function GET() {
  try {
    const { data: settings, error } = await (supabaseAdmin as any)
      .from('app_settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to fetch settings',
        code: 'FETCH_ERROR'
      }, { status: 500 })
    }

    return NextResponse.json({ settings }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    })

  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json<ErrorResponse>({
      error: true,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}

// PATCH - Update app settings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { pastel_price_cents, pix_qr_image_path, pix_key_text } = body

    // Build update object
    const updates: Record<string, any> = { updated_at: new Date().toISOString() }

    if (pastel_price_cents !== undefined) {
      if (typeof pastel_price_cents !== 'number' || pastel_price_cents < 0) {
        return NextResponse.json<ErrorResponse>({
          error: true,
          message: 'Price must be a non-negative number',
          code: 'VALIDATION_ERROR'
        }, { status: 400 })
      }
      updates.pastel_price_cents = pastel_price_cents
    }

    if (pix_qr_image_path !== undefined) {
      updates.pix_qr_image_path = pix_qr_image_path
    }

    if (pix_key_text !== undefined) {
      updates.pix_key_text = pix_key_text
    }

    // Update settings (always id = 1)
    const { data: updatedSettings, error: updateError } = await (supabaseAdmin as any)
      .from('app_settings')
      .update(updates)
      .eq('id', 1)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to update settings',
        code: 'UPDATE_ERROR'
      }, { status: 500 })
    }

    return NextResponse.json({ settings: updatedSettings }, { status: 200 })

  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json<ErrorResponse>({
      error: true,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}
