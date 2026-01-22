import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ErrorResponse } from '@/types/api'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'No file provided',
        code: 'VALIDATION_ERROR'
      }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'File must be an image',
        code: 'VALIDATION_ERROR'
      }, { status: 400 })
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'File size must be less than 2MB',
        code: 'VALIDATION_ERROR'
      }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `pix-qr-code-${Date.now()}.${fileExt}`
    const filePath = `qr-codes/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await (supabaseAdmin as any).storage
      .from('public-assets')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json<ErrorResponse>({
        error: true,
        message: 'Failed to upload file to storage',
        code: 'UPLOAD_ERROR'
      }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = (supabaseAdmin as any).storage
      .from('public-assets')
      .getPublicUrl(filePath)

    return NextResponse.json({ 
      path: filePath,
      url: urlData.publicUrl
    }, { status: 200 })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json<ErrorResponse>({
      error: true,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}
