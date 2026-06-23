import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { createServiceClient } from '@/lib/supabase/client'
import { getEmailConfig } from '@/lib/integrations'

const contactSchema = z.object({
  nombre: z.string().min(2).max(100),
  email: z.string().email(),
  telefono: z.string().min(7).max(30),
  servicio: z.enum(['full-mouth-reconstruction', 'smile-makeover', 'aligners', 'facial-harmony', 'otro']),
  mensaje: z.string().min(10).max(2000),
})

type ContactData = z.infer<typeof contactSchema>

function formatEmailText(data: ContactData): string {
  return [
    `Nombre: ${data.nombre}`,
    `Email: ${data.email}`,
    `Teléfono: ${data.telefono}`,
    `Servicio: ${data.servicio}`,
    `Mensaje:\n${data.mensaje}`,
  ].join('\n')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatEmailHtml(data: ContactData): string {
  return `
    <h2>Nuevo lead de contacto</h2>
    <table>
      <tr><td><strong>Nombre:</strong></td><td>${escapeHtml(data.nombre)}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${escapeHtml(data.email)}</td></tr>
      <tr><td><strong>Teléfono:</strong></td><td>${escapeHtml(data.telefono)}</td></tr>
      <tr><td><strong>Servicio:</strong></td><td>${escapeHtml(data.servicio)}</td></tr>
    </table>
    <p><strong>Mensaje:</strong></p>
    <p>${escapeHtml(data.mensaje).replace(/\n/g, '<br>')}</p>
  `
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 })
  }

  const result = contactSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  // Guardar lead en Supabase (no bloquea si falla)
  try {
    const supabase = createServiceClient()
    await supabase.from('form_submissions').insert({
      site_id: '00000000-0000-0000-0000-000000000001',
      nombre: result.data.nombre,
      email: result.data.email,
      telefono: result.data.telefono,
      servicio: result.data.servicio,
      mensaje: result.data.mensaje,
      source_page: request.headers.get('referer') ?? '',
      status: 'nuevo',
    })
  } catch (e) {
    console.error('Failed to save lead to Supabase:', e)
  }

  const [settings, emailCfg] = await Promise.all([getSiteSettings(), getEmailConfig()])

  // Destinatario(s): email_to del panel → email de contacto → SMTP_USER
  const toList = (emailCfg.to || settings?.contactEmail || process.env.SMTP_USER || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  const subject = `Nuevo lead: ${result.data.nombre} — ${result.data.servicio}`
  const text = formatEmailText(result.data)
  const html = formatEmailHtml(result.data)

  try {
    if (emailCfg.resendApiKey) {
      // ── Resend (si hay API key configurada en el panel) ──
      const from = emailCfg.from || 'Allura Healthcare <onboarding@resend.dev>'
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${emailCfg.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to: toList, subject, text, html }),
      })
      if (!res.ok) {
        const detail = await res.text().catch(() => '')
        throw new Error(`Resend respondió ${res.status}: ${detail}`)
      }
    } else {
      // ── SMTP / nodemailer (respaldo, comportamiento actual) ──
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })
      await transporter.sendMail({
        from: emailCfg.from || process.env.SMTP_FROM || `Allura Healthcare <${process.env.SMTP_USER}>`,
        to: toList.join(', '),
        subject,
        text,
        html,
      })
    }
  } catch (error) {
    console.error('Email send failed:', error)
    return NextResponse.json({ error: 'No se pudo enviar el mensaje' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
