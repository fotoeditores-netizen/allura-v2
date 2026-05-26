# Contact Configuration — Sanity Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centralizar datos de contacto (WhatsApp, email) desde Sanity en todos los componentes que los tienen hardcodeados, e implementar el API Route de formulario con Nodemailer.

**Architecture:** Un helper `getSiteSettings()` en `src/lib/getSiteSettings.ts` + `buildWhatsAppUrl()` centraliza el fetch. Los 3 templates async llaman el helper directamente. `ContactForm.tsx` recibe `contactEmail` y `whatsappUrl` como props desde su page.tsx padre. Las 4 páginas legales llaman el helper y pasan el email al JSX. El API Route `src/app/api/contact/route.ts` re-valida con Zod y envía email con Nodemailer.

**Tech Stack:** Next.js 14 App Router · Sanity v3 · Nodemailer · Zod · React Hook Form (sin cambios en validación cliente)

---

## File Structure

### Archivos a crear
```
src/lib/getSiteSettings.ts
src/app/api/contact/route.ts
```

### Archivos a modificar
```
src/components/templates/ComoFuncionaTemplate.tsx      — eliminar WHATSAPP_URL const, usar getSiteSettings
src/components/templates/ServiceDetailTemplate.tsx     — idem
src/components/templates/ServiceCategoryTemplate.tsx   — idem
src/app/[locale]/contacto/page.tsx                     — fetch settings, pasar props a ContactForm
src/app/[locale]/contacto/ContactForm.tsx              — recibir props, cambiar onSubmit a fetch API
src/app/[locale]/politicas-de-privacidad/page.tsx      — getSiteSettings para mailto
src/app/[locale]/terminos-y-condiciones/page.tsx       — idem
src/app/[locale]/medical-disclaimer/page.tsx           — idem
src/app/[locale]/accesibilidad/page.tsx                — idem
```

### Dependencias a instalar
```
nodemailer @types/nodemailer
```

---

## Task 1: Install nodemailer and create getSiteSettings helper

**Files:**
- Create: `src/lib/getSiteSettings.ts`

- [ ] **Step 1: Install nodemailer**

```powershell
npm install nodemailer
npm install --save-dev @types/nodemailer
```

Expected: no errors, `nodemailer` appears in `package.json` dependencies.

- [ ] **Step 2: Create `src/lib/getSiteSettings.ts`**

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

export function buildWhatsAppUrl(
  settings: SiteSettings | null,
  locale: 'es' | 'en'
): string {
  const FALLBACK =
    'https://wa.me/17862087572?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare'
  if (!settings?.whatsappNumber) return FALLBACK
  const number = settings.whatsappNumber.replace(/\D/g, '')
  const message =
    settings.whatsappMessage?.[locale] || settings.whatsappMessage?.es || ''
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```powershell
git add src/lib/getSiteSettings.ts package.json package-lock.json
git commit -m "feat(contact): add getSiteSettings helper and buildWhatsAppUrl utility"
```

---

## Task 2: Connect WhatsApp in ComoFuncionaTemplate

**Files:**
- Modify: `src/components/templates/ComoFuncionaTemplate.tsx`

The file currently has this constant at the top (line 11-12):
```typescript
const WHATSAPP_URL =
  'https://wa.me/17862087572?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare'
```

- [ ] **Step 1: Read the file to see current imports and where WHATSAPP_URL is used**

Read `src/components/templates/ComoFuncionaTemplate.tsx` — identify all occurrences of `WHATSAPP_URL`.

- [ ] **Step 2: Add getSiteSettings import**

Add to the imports at the top of the file:
```typescript
import { getSiteSettings, buildWhatsAppUrl } from '@/lib/getSiteSettings'
```

- [ ] **Step 3: Remove the WHATSAPP_URL constant**

Delete these lines:
```typescript
const WHATSAPP_URL =
  'https://wa.me/17862087572?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare'
```

- [ ] **Step 4: Fetch settings inside the async function**

Inside `export async function ComoFuncionaTemplate(...)`, at the top of the function body (alongside the existing `const t = await getTranslations(...)` call), add:

```typescript
const settings = await getSiteSettings()
const whatsappUrl = buildWhatsAppUrl(settings, locale as 'es' | 'en')
```

- [ ] **Step 5: Replace all uses of WHATSAPP_URL with whatsappUrl**

Every `href={WHATSAPP_URL}` → `href={whatsappUrl}`.
Every `href={WHATSAPP_URL}` string literal → `href={whatsappUrl}`.

- [ ] **Step 6: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 7: Commit**

```powershell
git add src/components/templates/ComoFuncionaTemplate.tsx
git commit -m "feat(contact): connect WhatsApp URL from Sanity in ComoFuncionaTemplate"
```

---

## Task 3: Connect WhatsApp in ServiceDetailTemplate and ServiceCategoryTemplate

**Files:**
- Modify: `src/components/templates/ServiceDetailTemplate.tsx`
- Modify: `src/components/templates/ServiceCategoryTemplate.tsx`

Both files currently have (lines 8-9 and 8-9 respectively):
```typescript
const WHATSAPP_URL =
  "https://wa.me/17862087572?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare";
```

Both are already `async` server components.

- [ ] **Step 1: Update ServiceDetailTemplate.tsx**

Add import:
```typescript
import { getSiteSettings, buildWhatsAppUrl } from '@/lib/getSiteSettings'
```

Remove the `WHATSAPP_URL` constant.

Inside the async function body, add at the top (after reading `locale` from props):
```typescript
const settings = await getSiteSettings()
const whatsappUrl = buildWhatsAppUrl(settings, locale as 'es' | 'en')
```

Replace all `WHATSAPP_URL` → `whatsappUrl`.

- [ ] **Step 2: Update ServiceCategoryTemplate.tsx**

Same changes as Step 1 but in `src/components/templates/ServiceCategoryTemplate.tsx`.

Add import:
```typescript
import { getSiteSettings, buildWhatsAppUrl } from '@/lib/getSiteSettings'
```

Remove the `WHATSAPP_URL` constant.

Inside the async function body, add:
```typescript
const settings = await getSiteSettings()
const whatsappUrl = buildWhatsAppUrl(settings, locale as 'es' | 'en')
```

Replace all `WHATSAPP_URL` → `whatsappUrl`.

- [ ] **Step 3: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```powershell
git add src/components/templates/ServiceDetailTemplate.tsx src/components/templates/ServiceCategoryTemplate.tsx
git commit -m "feat(contact): connect WhatsApp URL from Sanity in service templates"
```

---

## Task 4: Update ContactForm to receive props and submit to API

**Files:**
- Modify: `src/app/[locale]/contacto/ContactForm.tsx`
- Modify: `src/app/[locale]/contacto/page.tsx`

Currently `ContactForm` accepts no props and has `onSubmit` that only does `console.log`. The page renders `<ContactForm />` with no props.

- [ ] **Step 1: Update ContactForm.tsx**

Replace the entire file content with:

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

interface ContactFormProps {
  contactEmail: string
  whatsappUrl: string
}

export function ContactForm({ contactEmail, whatsappUrl }: ContactFormProps) {
  const t = useTranslations("contacto");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = z.object({
    nombre:   z.string().min(2, t("validNombre")),
    email:    z.string().email(t("validEmail")),
    telefono: z.string().min(7, t("validTelefono")),
    servicio: z.enum(["full-mouth-reconstruction", "smile-makeover", "aligners", "facial-harmony", "otro"], {
      required_error: t("validServicio"),
    }),
    mensaje:  z.string().min(10, t("validMensaje")),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setSubmitError(json.error || t("submitError"));
        return;
      }
      reset();
    } catch {
      setSubmitError(t("submitError"));
    }
  };

  const inputClass =
    "w-full font-body text-sm text-brand-navy bg-brand-light border border-brand-blue/20 rounded-xl px-4 py-3 placeholder:text-brand-silver focus:outline-none focus:border-brand-blue transition-colors";

  return (
    <section className="section-padding bg-white">
      <div className="container-allura grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Form */}
        <div>
          {isSubmitSuccessful ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-brand-navy/5 flex items-center justify-center mb-5">
                <Mail size={28} className="text-brand-navy" />
              </div>
              <h3 className="font-heading text-2xl text-brand-navy mb-2">{t("successTitle")}</h3>
              <p className="font-body text-brand-silver text-sm">
                {t("successBody")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <input {...register("nombre")} placeholder={t("formNombre")} className={inputClass} />
                {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>}
              </div>
              <div>
                <input {...register("email")} type="email" placeholder={t("formEmail")} className={inputClass} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <input {...register("telefono")} placeholder={t("formTelefono")} className={inputClass} />
                {errors.telefono && <p className="mt-1 text-xs text-red-500">{errors.telefono.message}</p>}
              </div>
              <div>
                <select {...register("servicio")} className={inputClass}>
                  <option value="">{t("servicioOpciones.placeholder")}</option>
                  <option value="full-mouth-reconstruction">{t("servicioOpciones.fullMouth")}</option>
                  <option value="smile-makeover">{t("servicioOpciones.smileMakeover")}</option>
                  <option value="aligners">{t("servicioOpciones.aligners")}</option>
                  <option value="facial-harmony">{t("servicioOpciones.facialHarmony")}</option>
                  <option value="otro">{t("servicioOpciones.otro")}</option>
                </select>
                {errors.servicio && <p className="mt-1 text-xs text-red-500">{errors.servicio.message}</p>}
              </div>
              <div>
                <textarea
                  {...register("mensaje")}
                  rows={5}
                  placeholder={t("formMensaje")}
                  className={`${inputClass} resize-none`}
                />
                {errors.mensaje && <p className="mt-1 text-xs text-red-500">{errors.mensaje.message}</p>}
              </div>
              {submitError && (
                <p className="text-sm text-red-500 text-center">{submitError}</p>
              )}
              <Button type="submit" variant="primary" className="w-full">
                {isSubmitting ? t("formSubmitting") : t("formSubmit")}
              </Button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-6">
              {t("infoLabel")}
            </p>
            <ul className="space-y-5">
              {[
                { icon: MapPin,         label: t("infoLocation") },
                { icon: Mail,           label: contactEmail },
                { icon: MessageCircle,  label: t("infoWhatsapp") },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-navy/5 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-brand-navy" />
                  </div>
                  <p className="font-body text-sm text-brand-silver pt-2">{label}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* WhatsApp direct */}
          <div className="rounded-2xl bg-brand-light p-6">
            <p className="font-heading text-lg text-brand-navy mb-2">{t("waTitle")}</p>
            <p className="font-body text-sm text-brand-silver mb-5">
              {t("waBody")}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-body font-bold text-sm hover:bg-[#22c55e] transition-colors"
            >
              <MessageCircle size={16} />
              {t("waCta")}
            </a>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden aspect-video bg-brand-light">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4!2d-75.5636!3d6.2442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428dfb5c17b!2sMedell%C3%ADn%2C+Antioquia!5e0!3m2!1ses!2sco!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add `submitError` i18n key**

Open `messages/es.json` — find the `"contacto"` namespace and add:
```json
"submitError": "Hubo un error al enviar tu mensaje. Por favor intenta de nuevo."
```

Open `messages/en.json` — find the `"contacto"` namespace and add:
```json
"submitError": "There was an error sending your message. Please try again."
```

- [ ] **Step 3: Update contacto/page.tsx**

Replace the entire file content with:

```typescript
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "./ContactForm";
import { getTranslations } from "next-intl/server";
import { getSiteSettings, buildWhatsAppUrl } from "@/lib/getSiteSettings";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "contacto" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
  };
}

export default async function ContactoPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("contacto");
  const settings = await getSiteSettings();
  const contactEmail = settings?.contactEmail || "contact@allurahealthcare.com";
  const whatsappUrl = buildWhatsAppUrl(settings, locale as "es" | "en");

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12 text-center">
        <SectionHeading
          eyebrow={t("heroEyebrow")}
          title={t("heroTitle")}
          subtitle={t("heroSubtitle")}
          centered
          light
        />
      </section>

      <ContactForm contactEmail={contactEmail} whatsappUrl={whatsappUrl} />
    </>
  );
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Commit**

```powershell
git add "src/app/[locale]/contacto/ContactForm.tsx" "src/app/[locale]/contacto/page.tsx" messages/es.json messages/en.json
git commit -m "feat(contact): connect ContactForm to Sanity settings and wire up API fetch"
```

---

## Task 5: Connect email in legal pages

**Files:**
- Modify: `src/app/[locale]/politicas-de-privacidad/page.tsx`
- Modify: `src/app/[locale]/terminos-y-condiciones/page.tsx`
- Modify: `src/app/[locale]/medical-disclaimer/page.tsx`
- Modify: `src/app/[locale]/accesibilidad/page.tsx`

All four pages are currently NOT async — they use `export default function` (not `async`). Each has `mailto:contact@allurahealthcare.com` hardcoded in multiple places.

- [ ] **Step 1: Update politicas-de-privacidad/page.tsx**

Read the full file first. Then:

1. Add import at the top:
```typescript
import { getSiteSettings } from "@/lib/getSiteSettings";
```

2. Change the default export from:
```typescript
export default function PoliticasPrivacidadPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
```
To:
```typescript
export default async function PoliticasPrivacidadPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const settings = await getSiteSettings();
  const contactEmail = settings?.contactEmail || "contact@allurahealthcare.com";
```

3. Replace every occurrence of the hardcoded string `"contact@allurahealthcare.com"` with `{contactEmail}` (in JSX) or `contactEmail` (in href attributes). Specifically:
   - `href="mailto:contact@allurahealthcare.com"` → `href={\`mailto:${contactEmail}\`}`
   - `contact@allurahealthcare.com` text nodes → `{contactEmail}`

- [ ] **Step 2: Update terminos-y-condiciones/page.tsx**

Read the full file. Apply the same pattern:
1. Add `import { getSiteSettings } from "@/lib/getSiteSettings";`
2. Make the default export `async`
3. Add `const settings = await getSiteSettings(); const contactEmail = settings?.contactEmail || "contact@allurahealthcare.com";`
4. Replace all hardcoded email occurrences with `contactEmail`

- [ ] **Step 3: Update medical-disclaimer/page.tsx**

Same pattern as Steps 1-2.

- [ ] **Step 4: Update accesibilidad/page.tsx**

Same pattern as Steps 1-2.

- [ ] **Step 5: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Commit**

```powershell
git add "src/app/[locale]/politicas-de-privacidad/page.tsx" "src/app/[locale]/terminos-y-condiciones/page.tsx" "src/app/[locale]/medical-disclaimer/page.tsx" "src/app/[locale]/accesibilidad/page.tsx"
git commit -m "feat(contact): replace hardcoded contact email with Sanity siteSettings in legal pages"
```

---

## Task 6: Create the contact API Route

**Files:**
- Create: `src/app/api/contact/route.ts`

**Pre-requisite:** The implementer must verify that `.env.local` has these variables. If they're missing, the route will compile but fail at runtime. Add them to `.env.local` if not present (with placeholder values for now):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=placeholder@gmail.com
SMTP_PASS=placeholder-app-password
SMTP_FROM=Allura Healthcare <contact@allurahealthcare.com>
```

- [ ] **Step 1: Create `src/app/api/contact/route.ts`**

```typescript
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { getSiteSettings } from '@/lib/getSiteSettings'

const contactSchema = z.object({
  nombre:   z.string().min(2).max(100),
  email:    z.string().email(),
  telefono: z.string().min(7).max(30),
  servicio: z.enum([
    'full-mouth-reconstruction',
    'smile-makeover',
    'aligners',
    'facial-harmony',
    'otro',
  ]),
  mensaje: z.string().min(10).max(2000),
})

function formatEmailText(data: z.infer<typeof contactSchema>): string {
  return [
    `Nombre: ${data.nombre}`,
    `Email: ${data.email}`,
    `Teléfono: ${data.telefono}`,
    `Servicio: ${data.servicio}`,
    ``,
    `Mensaje:`,
    data.mensaje,
  ].join('\n')
}

function formatEmailHtml(data: z.infer<typeof contactSchema>): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #051c33;">Nuevo lead — Allura Healthcare</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; font-weight: bold; color: #051c33;">Nombre</td><td style="padding: 8px;">${data.nombre}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; color: #051c33;">Email</td><td style="padding: 8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding: 8px; font-weight: bold; color: #051c33;">Teléfono</td><td style="padding: 8px;">${data.telefono}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; color: #051c33;">Servicio</td><td style="padding: 8px;">${data.servicio}</td></tr>
      </table>
      <h3 style="color: #051c33;">Mensaje</h3>
      <p style="background: #eaeeef; padding: 16px; border-radius: 8px;">${data.mensaje.replace(/\n/g, '<br>')}</p>
    </div>
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

  const settings = await getSiteSettings()
  const toEmail = settings?.contactEmail || process.env.SMTP_USER!

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `Allura Healthcare <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `Nuevo lead: ${result.data.nombre} — ${result.data.servicio}`,
    text: formatEmailText(result.data),
    html: formatEmailHtml(result.data),
  })

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```powershell
git add src/app/api/contact/route.ts
git commit -m "feat(contact): add /api/contact route with Zod validation and Nodemailer email dispatch"
```

---

## Task 7: Final build verification

- [ ] **Step 1: Delete .next cache**

```powershell
Remove-Item -Recurse -Force .next
```

- [ ] **Step 2: Run production build**

```powershell
npm run build
```

Expected:
- No TypeScript errors
- No "Module not found" errors
- All routes compile including `/api/contact`
- 83+ pages generated successfully

- [ ] **Step 3: Start dev server and verify visually**

```powershell
npm run dev
```

Open these URLs and verify:

| URL | Expected |
|-----|----------|
| `http://localhost:3000/es/contacto` | Formulario carga, email e info WhatsApp provienen de Sanity (o fallback si no hay settings) |
| `http://localhost:3000/es/como-funciona` | Botones de WhatsApp sin errores |
| `http://localhost:3000/es/servicios/smile-makeover` | Botón WhatsApp sin errores |
| `http://localhost:3000/es/politicas-de-privacidad` | Email `contact@allurahealthcare.com` (o Sanity) visible |

- [ ] **Step 4: Test form submission (requiere SMTP configurado)**

Si las variables SMTP están configuradas en `.env.local`:
1. Llenar el formulario en `/es/contacto`
2. Enviar
3. Verificar que llega el email a `contactEmail`
4. Verificar que el formulario muestra el estado de éxito

Si el SMTP no está configurado aún, el build y las páginas deben funcionar — solo el envío fallará con error 500, mostrando el mensaje de error en el formulario.

- [ ] **Step 5: Commit si hubo fixes de último momento**

```powershell
git add -A
git commit -m "fix(contact): address build/runtime issues"
```

---

## Self-Review

### Spec coverage

| Req del spec | Tarea |
|---|---|
| `getSiteSettings()` helper + `buildWhatsAppUrl()` | Task 1 |
| WhatsApp en ComoFuncionaTemplate | Task 2 |
| WhatsApp en ServiceDetailTemplate + ServiceCategoryTemplate | Task 3 |
| ContactForm recibe props, submit a API | Task 4 |
| contacto/page.tsx fetcha settings y pasa props | Task 4 |
| Email en 4 páginas legales | Task 5 |
| API Route con Zod + Nodemailer | Task 6 |
| Build limpio + verificación local | Task 7 |
| Credenciales SMTP en .env.local — nunca en cliente | Task 6 (documentado) |
| Re-validación Zod en servidor | Task 6 |
| Fallback hardcodeado si Sanity vacío | Tasks 1, 4, 5 |

### Seguridad
- ✅ `nodemailer` solo en API Route (server) — no importado en client components
- ✅ `SMTP_*` variables solo en `.env.local` — `.env.local` está en `.gitignore`
- ✅ Email `to` viene de Sanity (no del usuario)
- ✅ Re-validación Zod en servidor antes de enviar
- ✅ No se guardan leads en Sanity ni base de datos
