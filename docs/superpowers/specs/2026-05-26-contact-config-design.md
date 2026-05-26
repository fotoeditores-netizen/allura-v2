# Contact Configuration — Sanity Integration Design Spec

**Fecha:** 2026-05-26  
**Proyecto:** Allura Healthcare  
**Rama:** feature/sanity-cms-v1

---

## Goal

Conectar todos los datos de contacto editables (WhatsApp, email, redes sociales) desde Sanity CMS a los componentes que hoy los tienen hardcodeados. Agregar un API Route que reciba el formulario de contacto y envíe un email con Nodemailer. Sin guardar leads en Sanity. Sin romper el formulario existente.

---

## Architecture

Dos cambios ortogonales:

1. **Centralizar fetch de siteSettings** — Un helper `getSiteSettings()` en `src/lib/getSiteSettings.ts` que fetcha `siteSettings` de Sanity con ISR. Todos los componentes que hoy tienen datos hardcodeados lo importan en lugar de tener sus propios fetches o strings literales.

2. **API Route para formulario** — `src/app/api/contact/route.ts` recibe el POST, re-valida con Zod (misma schema que el cliente), y envía un email a `contactEmail` de Sanity via Nodemailer. Credenciales SMTP en `.env.local` — nunca expuestas al cliente.

**Stack:** Next.js 14 App Router · Sanity v3 · Nodemailer · Zod · React Hook Form (sin cambios en el cliente)

---

## Estado actual

### Ya conectado a Sanity ✅
- `Footer.tsx` — WhatsApp URL, email, redes sociales (ya consume `siteSettings`)
- `siteSettings` schema — campos: `contactEmail`, `whatsappNumber`, `whatsappMessage`, `socialInstagram`, `socialFacebook`, `socialLinkedin`, `socialYoutube`, `socialTiktok`
- `siteSettingsQuery` en `queries.ts` — fetcha todos estos campos

### Hardcodeado (a corregir) ❌
| Archivo | Dato hardcodeado |
|---------|-----------------|
| `src/components/templates/ComoFuncionaTemplate.tsx` | `WHATSAPP_URL` const literal |
| `src/components/templates/ServiceDetailTemplate.tsx` | URL WhatsApp literal |
| `src/components/templates/ServiceCategoryTemplate.tsx` | URL WhatsApp literal |
| `src/app/[locale]/contacto/ContactForm.tsx` | Email display + form sin submit real |
| `src/app/[locale]/politicas-de-privacidad/page.tsx` | `mailto:contact@allurahealthcare.com` |
| `src/app/[locale]/terminos-y-condiciones/page.tsx` | `mailto:contact@allurahealthcare.com` |
| `src/app/[locale]/medical-disclaimer/page.tsx` | `mailto:contact@allurahealthcare.com` |
| `src/app/[locale]/accesibilidad/page.tsx` | `mailto:contact@allurahealthcare.com` |

### Formulario sin backend ❌
- `ContactForm.tsx` — `onSubmit` solo hace `console.log` y resetea el form. Los datos se descartan.

---

## Módulo 1: Helper centralizado getSiteSettings

**Archivo:** `src/lib/getSiteSettings.ts`

```typescript
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import type { SiteSettings } from '@/sanity/lib/queries'

const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch<SiteSettings>(
    siteSettingsQuery,
    {},
    { next: { revalidate } }
  )
}
```

**Construcción de WhatsApp URL** (helper en el mismo archivo):

```typescript
export function buildWhatsAppUrl(settings: SiteSettings | null, locale: 'es' | 'en'): string {
  const FALLBACK = 'https://wa.me/17862087572?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare'
  if (!settings?.whatsappNumber) return FALLBACK
  const number = settings.whatsappNumber.replace(/\D/g, '')
  const message = settings.whatsappMessage?.[locale] || settings.whatsappMessage?.es || ''
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}
```

---

## Módulo 2: Conectar WhatsApp en templates

Los 3 templates que tienen `WHATSAPP_URL` o URL hardcodeada se convierten en async server components que llaman `getSiteSettings()` y pasan la URL construida como prop o la usan directamente.

**Patrón:**
```typescript
// En el template (ya es async server component):
const settings = await getSiteSettings()
const whatsappUrl = buildWhatsAppUrl(settings, locale as 'es' | 'en')
// Reemplaza el uso de WHATSAPP_URL const por whatsappUrl
```

Los 3 templates ya son `async` — no se cambia la arquitectura, solo se elimina la const hardcodeada.

---

## Módulo 3: Conectar email en ContactForm y páginas legales

**ContactForm.tsx** es un `"use client"` component — recibe `contactEmail: string` como prop desde su page.tsx padre (que sí puede hacer el fetch). La page.tsx de `/contacto` ya es async.

**Páginas legales** son async server components — cada una llama `getSiteSettings()` y usa `settings?.contactEmail || 'contact@allurahealthcare.com'` para el `mailto:`.

---

## Módulo 4: API Route del formulario

**Archivo:** `src/app/api/contact/route.ts`

### Variables de entorno (`.env.local`)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu@email.com
SMTP_PASS=tu-contraseña-o-app-password
SMTP_FROM=Allura Healthcare <contact@allurahealthcare.com>
```

### Zod schema (reutilizada del cliente)

```typescript
import { z } from 'zod'

const contactSchema = z.object({
  nombre: z.string().min(2).max(100),
  email: z.string().email(),
  telefono: z.string().optional(),
  servicio: z.string().min(1),
  mensaje: z.string().min(10).max(2000),
})
```

### Route handler

```typescript
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getSiteSettings } from '@/lib/getSiteSettings'

export async function POST(request: Request) {
  const body = await request.json()
  const result = contactSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const settings = await getSiteSettings()
  const toEmail = settings?.contactEmail || process.env.SMTP_USER!

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: toEmail,
    subject: `Nuevo lead: ${result.data.nombre} — ${result.data.servicio}`,
    text: formatEmail(result.data),
    html: formatEmailHtml(result.data),
  })

  return NextResponse.json({ ok: true })
}
```

**Formato del email recibido:**
```
Nombre: Juan Pérez
Email: juan@email.com
Teléfono: +57 300 000 0000
Servicio: Smile Makeover
Mensaje: Me interesa conocer más sobre...
```

### ContactForm.tsx — cambios al cliente

- `onSubmit` cambia de `console.log` a `fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })`
- Si respuesta OK → muestra estado de éxito (ya existe en el componente)
- Si error → muestra mensaje de error en el formulario
- React Hook Form + Zod **no cambian** — solo se agrega el fetch

---

## Seguridad

- Credenciales SMTP solo en `.env.local` — nunca en Sanity, nunca en el bundle del cliente
- El servidor re-valida con Zod antes de enviar (doble validación)
- No se guardan leads en base de datos ni en Sanity
- `nodemailer` corre solo en el servidor (API Route) — no importado en client components
- Email `to` viene de Sanity (no del usuario) — el usuario no puede redirigir el email

---

## File Structure

### Archivos a crear
```
src/lib/getSiteSettings.ts
src/app/api/contact/route.ts
```

### Archivos a modificar
```
src/components/templates/ComoFuncionaTemplate.tsx        — eliminar WHATSAPP_URL const, usar getSiteSettings
src/components/templates/ServiceDetailTemplate.tsx       — idem
src/components/templates/ServiceCategoryTemplate.tsx     — idem
src/app/[locale]/contacto/page.tsx                       — fetch settings, pasar contactEmail a ContactForm
src/app/[locale]/contacto/ContactForm.tsx                — recibir contactEmail prop, cambiar onSubmit a fetch
src/app/[locale]/politicas-de-privacidad/page.tsx        — getSiteSettings para mailto
src/app/[locale]/terminos-y-condiciones/page.tsx         — idem
src/app/[locale]/medical-disclaimer/page.tsx             — idem
src/app/[locale]/accesibilidad/page.tsx                  — idem
```

### Dependencia a instalar
```
npm install nodemailer
npm install --save-dev @types/nodemailer
```

---

## Out of Scope

- Confirmación de email al usuario que envía el formulario
- Rate limiting en la API route
- CRM o automatización n8n
- Guardar leads en Sanity o base de datos
- Redes sociales en templates (Footer ya las maneja correctamente)
