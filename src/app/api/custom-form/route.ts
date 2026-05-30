import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/client'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export async function POST(req: NextRequest) {
  try {
    const { fields, values, toEmail, title } = await req.json()

    if (!fields || !values) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    // Build submission data
    const submissionData: Record<string, string> = {}
    for (const field of fields) {
      const label = field.label?.es || field.id
      submissionData[label] = values[field.id] ?? ''
    }

    // Save to form_submissions table
    const supabase = createServiceClient()
    await supabase.from('form_submissions').insert({
      site_id: SITE_ID,
      form_name: title || 'Formulario personalizado',
      nombre: submissionData['Nombre'] || submissionData['Name'] || 'Sin nombre',
      email: submissionData['Email'] || submissionData['Correo'] || '',
      telefono: submissionData['Teléfono'] || submissionData['Phone'] || null,
      mensaje: JSON.stringify(submissionData),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
