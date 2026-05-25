# Sanity CMS — Fase 1: Infraestructura Base

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tener Sanity Studio accesible en `/studio`, el schema `globalConfig` creado, y el `WHATSAPP_URL` hardcoded en Footer y Header reemplazado por el valor que viene de Sanity.

**Architecture:** `next-sanity` provee el cliente GROQ y el componente `NextStudio`. El schema `globalConfig` es un singleton — un único documento en Sanity que contiene WhatsApp URL, email y redes sociales. Footer y Header lo leen en servidor via GROQ query. No se toca ninguna otra página de contenido en esta fase.

**Tech Stack:** Next.js 14 App Router, TypeScript, Sanity v3, next-sanity 9.x, @sanity/image-url, @sanity/types

---

## Mapa de archivos — Fase 1

| Acción | Archivo |
|---|---|
| Crear | `src/sanity/lib/client.ts` |
| Crear | `src/sanity/lib/image.ts` |
| Crear | `src/sanity/schemaTypes/singletons/globalConfig.ts` |
| Crear | `src/sanity/schemaTypes/index.ts` |
| Crear | `src/sanity/sanity.config.ts` |
| Crear | `src/app/studio/[[...tool]]/page.tsx` |
| Crear | `sanity.config.ts` (raíz del proyecto) |
| Crear | `.env.local` (con variables reales del proyecto Sanity) |
| Modificar | `src/components/layout/Footer.tsx` |
| Modificar | `src/components/layout/Header.tsx` |
| Modificar | `next.config.js` o `next.config.ts` (añadir transpilePackages) |

> `src/sanity/lib/queries.ts` se crea vacío en esta fase — se llenará en Fase 2.

---

## Prerequisito manual (fuera del código)

Antes de ejecutar cualquier tarea, el desarrollador debe:

1. Ir a [sanity.io/manage](https://sanity.io/manage)
2. Crear un nuevo proyecto → nombre: "Allura Healthcare", dataset: `production`
3. Anotar el **Project ID** (ej. `abc12345`)
4. Ir a API → Tokens → Add API Token → nombre "allura-dev", permisos **Editor** → copiar el token
5. Tener esos dos valores listos para el Task 1

---

## Task 1: Instalar dependencias y crear `.env.local`

**Files:**
- Create: `.env.local`

- [ ] **Step 1: Instalar los paquetes de Sanity**

```bash
cd c:\Users\publi\Desktop\ALLURA
npm install next-sanity @sanity/image-url
npm install --save-dev @sanity/types
```

Salida esperada: `added N packages` sin errores. Si hay warnings de peer deps, ignorarlos.

- [ ] **Step 2: Verificar versiones instaladas**

```bash
npm list next-sanity @sanity/image-url
```

Salida esperada (versiones mínimas):
```
next-sanity@9.x.x
@sanity/image-url@1.x.x
```

- [ ] **Step 3: Crear `.env.local` con las variables reales**

Reemplaza `TU_PROJECT_ID` y `TU_TOKEN` con los valores del prerequisito manual.

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=TU_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=TU_TOKEN
```

- [ ] **Step 4: Verificar que `.env.local` está en `.gitignore`**

```bash
cat .gitignore | grep env
```

Si no aparece `.env.local`, añadirlo:
```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "feat(sanity): install next-sanity and @sanity/image-url dependencies"
```

---

## Task 2: Crear el cliente Sanity y el helper de imágenes

**Files:**
- Create: `src/sanity/lib/client.ts`
- Create: `src/sanity/lib/image.ts`

- [ ] **Step 1: Crear el directorio**

```bash
mkdir -p src/sanity/lib
```

- [ ] **Step 2: Crear `src/sanity/lib/client.ts`**

```typescript
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
});
```

- [ ] **Step 3: Crear `src/sanity/lib/image.ts`**

```typescript
import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```

- [ ] **Step 4: Crear `src/sanity/lib/queries.ts` (vacío por ahora)**

```typescript
// GROQ queries — se rellenan en Fase 2
export {};
```

- [ ] **Step 5: Verificar que TypeScript compila**

```bash
npx tsc --noEmit
```

Salida esperada: sin errores. Si hay error `Cannot find module 'next-sanity'`, verificar que el `npm install` del Task 1 completó correctamente.

- [ ] **Step 6: Commit**

```bash
git add src/sanity/lib/
git commit -m "feat(sanity): add Sanity client and image URL builder"
```

---

## Task 3: Crear el schema `globalConfig`

**Files:**
- Create: `src/sanity/schemaTypes/singletons/globalConfig.ts`
- Create: `src/sanity/schemaTypes/index.ts`

- [ ] **Step 1: Crear los directorios**

```bash
mkdir -p src/sanity/schemaTypes/singletons
mkdir -p src/sanity/schemaTypes/collections
```

- [ ] **Step 2: Crear `src/sanity/schemaTypes/singletons/globalConfig.ts`**

```typescript
import { defineField, defineType } from "sanity";

export const globalConfig = defineType({
  name: "globalConfig",
  title: "Configuración Global",
  type: "document",
  fields: [
    defineField({
      name: "whatsappUrl",
      title: "URL de WhatsApp",
      type: "url",
      description: "URL completa de WhatsApp incluyendo el mensaje predeterminado",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email de contacto",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "instagram",
      title: "URL Instagram",
      type: "url",
    }),
    defineField({
      name: "facebook",
      title: "URL Facebook",
      type: "url",
    }),
    defineField({
      name: "linkedin",
      title: "URL LinkedIn",
      type: "url",
    }),
    defineField({
      name: "tiktok",
      title: "URL TikTok",
      type: "url",
    }),
    defineField({
      name: "copyright_es",
      title: "Texto copyright (Español)",
      type: "string",
    }),
    defineField({
      name: "copyright_en",
      title: "Copyright text (English)",
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Configuración Global" };
    },
  },
});
```

- [ ] **Step 3: Crear `src/sanity/schemaTypes/index.ts`**

```typescript
import { globalConfig } from "./singletons/globalConfig";

export const schemaTypes = [globalConfig];
```

- [ ] **Step 4: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Salida esperada: sin errores.

- [ ] **Step 5: Commit**

```bash
git add src/sanity/schemaTypes/
git commit -m "feat(sanity): add globalConfig singleton schema"
```

---

## Task 4: Configurar Sanity Studio embebido

**Files:**
- Create: `src/sanity/sanity.config.ts`
- Create: `sanity.config.ts` (raíz)
- Create: `src/app/studio/[[...tool]]/page.tsx`
- Modify: `next.config.js` / `next.config.ts`

- [ ] **Step 1: Verificar qué archivo de config de Next.js existe**

```bash
ls next.config.*
```

Anota si es `.js`, `.ts` o `.mjs`.

- [ ] **Step 2: Crear `src/sanity/sanity.config.ts`**

```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/plugins/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export const sanityConfig = defineConfig({
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  title: "Allura Healthcare CMS",
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items([
            S.listItem()
              .title("Configuración Global")
              .id("globalConfig")
              .child(
                S.document()
                  .schemaType("globalConfig")
                  .documentId("globalConfig")
              ),
          ]),
    }),
    visionTool(),
  ],
});
```

- [ ] **Step 3: Crear `sanity.config.ts` en la raíz**

```typescript
export { sanityConfig as default } from "./src/sanity/sanity.config";
```

- [ ] **Step 4: Crear `src/app/studio/[[...tool]]/page.tsx`**

```typescript
import { NextStudio } from "next-sanity/studio";
import { sanityConfig } from "@/sanity/sanity.config";

export { metadata, viewport } from "next-sanity/studio";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  return <NextStudio config={sanityConfig} />;
}
```

- [ ] **Step 5: Actualizar `next.config` para transpilePackages**

Si el archivo es `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-sanity", "sanity"],
};

module.exports = nextConfig;
```

Si el archivo es `next.config.ts`:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["next-sanity", "sanity"],
};

export default nextConfig;
```

Si el archivo ya tiene configuración existente (ej. `images`, `i18n`), añadir `transpilePackages` al objeto existente sin borrar nada.

- [ ] **Step 6: Verificar que no hay errores de TypeScript**

```bash
npx tsc --noEmit
```

Si hay error en `page.tsx` del Studio sobre `metadata` / `viewport`, es normal con algunas versiones — continuar.

- [ ] **Step 7: Arrancar el servidor de desarrollo**

```bash
npm run dev
```

- [ ] **Step 8: Verificar que el Studio carga**

Abrir [http://localhost:3000/studio](http://localhost:3000/studio) en el navegador.

Resultado esperado: Sanity Studio carga con el título "Allura Healthcare CMS" y muestra "Configuración Global" en el sidebar izquierdo. Si pide autenticación, iniciar sesión con la cuenta de sanity.io.

- [ ] **Step 9: Commit**

```bash
git add src/sanity/sanity.config.ts sanity.config.ts src/app/studio/ next.config.*
git commit -m "feat(sanity): embed Sanity Studio at /studio route"
```

---

## Task 5: Crear el documento `globalConfig` en Sanity y poblar los datos

Este task es **manual en el navegador** — no requiere código.

- [ ] **Step 1: Abrir el Studio**

Ir a [http://localhost:3000/studio](http://localhost:3000/studio)

- [ ] **Step 2: Crear el documento `globalConfig`**

En el sidebar, hacer clic en "Configuración Global". Se abrirá el editor del documento singleton.

- [ ] **Step 3: Rellenar los campos con los valores actuales**

Copiar los valores que actualmente están hardcoded en el código:

| Campo | Valor |
|---|---|
| URL de WhatsApp | `https://wa.me/17862087572?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare` |
| Email de contacto | `contact@allurahealthcare.com` |
| URL Instagram | `#` (dejar vacío si no hay URL real) |
| URL Facebook | `#` (dejar vacío si no hay URL real) |
| URL LinkedIn | `#` (dejar vacío si no hay URL real) |
| Copyright (Español) | `Todos los derechos reservados.` |
| Copyright (Inglés) | `All rights reserved.` |

- [ ] **Step 4: Publicar el documento**

Hacer clic en el botón verde **"Publish"** en la esquina inferior derecha del Studio.

Resultado esperado: El botón cambia a "Published" y desaparece el indicador de cambios sin publicar.

---

## Task 6: Conectar `globalConfig` al Footer

**Files:**
- Modify: `src/components/layout/Footer.tsx`

El Footer actualmente tiene `WHATSAPP_URL` hardcoded como constante en la parte superior del archivo. Lo reemplazamos por datos que vienen de Sanity.

- [ ] **Step 1: Leer el Footer actual para entender su estructura**

El Footer es un Server Component (`async function Footer()`). Actualmente tiene:
```typescript
const WHATSAPP_URL = "https://wa.me/17862087572?text=...";
```
Y usa `WHATSAPP_URL` en 2 lugares dentro del JSX.

- [ ] **Step 2: Crear la GROQ query para globalConfig en `src/sanity/lib/queries.ts`**

Reemplazar el contenido del archivo (que era `export {};`) con:

```typescript
import { groq } from "next-sanity";

export const globalConfigQuery = groq`
  *[_type == "globalConfig"][0] {
    whatsappUrl,
    email,
    instagram,
    facebook,
    linkedin,
    tiktok,
    copyright_es,
    copyright_en
  }
`;

export interface GlobalConfig {
  whatsappUrl: string;
  email: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  tiktok?: string;
  copyright_es?: string;
  copyright_en?: string;
}
```

- [ ] **Step 3: Modificar `src/components/layout/Footer.tsx`**

Reemplazar la constante `WHATSAPP_URL` hardcoded y añadir el fetch de Sanity. Cambiar la firma y el inicio de la función `Footer`:

**Antes** (líneas 1-8 del archivo):
```typescript
import Image from "next/image";
import { Instagram, Facebook, Linkedin, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { QualitySlider } from "./QualitySlider";

const WHATSAPP_URL =
  "https://wa.me/17862087572?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare";
```

**Después**:
```typescript
import Image from "next/image";
import { Instagram, Facebook, Linkedin, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { QualitySlider } from "./QualitySlider";
import { client } from "@/sanity/lib/client";
import { globalConfigQuery, type GlobalConfig } from "@/sanity/lib/queries";
```

- [ ] **Step 4: Añadir el fetch dentro de la función `Footer`**

**Antes** (inicio de la función, tras `export async function Footer()`):
```typescript
export async function Footer() {
  const t = await getTranslations("footer");

  const navLinks = [
```

**Después**:
```typescript
export async function Footer() {
  const t = await getTranslations("footer");
  const config = await client.fetch<GlobalConfig>(globalConfigQuery, {}, { next: { revalidate: 3600 } });

  const whatsappUrl = config?.whatsappUrl ?? "https://wa.me/17862087572";
  const email = config?.email ?? "contact@allurahealthcare.com";

  const navLinks = [
```

- [ ] **Step 5: Reemplazar todos los usos de `WHATSAPP_URL` por `whatsappUrl` en el JSX del Footer**

Hay exactamente 2 ocurrencias de `WHATSAPP_URL` en el JSX (en el banner de WhatsApp y en el bloque de contacto). Reemplazar ambas por `whatsappUrl`.

También reemplazar el email hardcoded `contact@allurahealthcare.com` por `{email}` en el anchor tag de contacto.

- [ ] **Step 6: Verificar que el servidor compila**

```bash
npm run dev
```

Abrir [http://localhost:3000/es](http://localhost:3000/es) y verificar que el Footer carga correctamente con los links de WhatsApp.

- [ ] **Step 7: Verificar TypeScript limpio**

```bash
npx tsc --noEmit
```

Salida esperada: sin errores.

- [ ] **Step 8: Commit**

```bash
git add src/components/layout/Footer.tsx src/sanity/lib/queries.ts
git commit -m "feat(sanity): connect Footer WhatsApp URL and email to globalConfig"
```

---

## Task 7: Conectar `globalConfig` al Header

**Files:**
- Modify: `src/components/layout/Header.tsx`

El Header es un Client Component (`"use client"`). El fetch de datos de servidor **no puede ir directamente** en un Client Component. La solución: convertir la parte del fetch a un Server Component wrapper que pase los datos como props.

- [ ] **Step 1: Entender el problema**

`Header.tsx` tiene `"use client"` porque usa `useState`, `useEffect`, y `useTranslations`. No podemos usar `async/await` directamente para fetch. La solución es:

1. Crear un Server Component `HeaderServer.tsx` que fetchee y pase `whatsappUrl` como prop
2. El `Header` existente recibe `whatsappUrl` como prop en lugar de tenerlo hardcoded

En realidad, el `Header` actual **no tiene** `WHATSAPP_URL` hardcoded — lo hardcodeado está solo en el Footer y en `ServiceDetailTemplate` y `ServiceCategoryTemplate`. El Header no usa WhatsApp. Solo usa `/contacto` para el CTA.

- [ ] **Step 2: Verificar el Header**

Revisar `src/components/layout/Header.tsx` — confirmar que no hay ninguna referencia a `wa.me` o `WHATSAPP_URL`.

Si no hay referencia, el Header **no necesita modificación en esta fase**. El único cambio pendiente son los CTAs de texto (que vienen de `next-intl` y se manejan en Fase 6 con el schema `menu`).

- [ ] **Step 3: Verificar el sitio completo**

Arrancar el dev server si no está corriendo:
```bash
npm run dev
```

Verificar estas rutas en el navegador:
- [http://localhost:3000/es](http://localhost:3000/es) — Home carga ✓
- [http://localhost:3000/en](http://localhost:3000/en) — Home en inglés ✓
- [http://localhost:3000/studio](http://localhost:3000/studio) — Studio carga ✓
- Footer muestra WhatsApp button funcional ✓

- [ ] **Step 4: Verificar TypeScript final**

```bash
npx tsc --noEmit
```

Salida esperada: **0 errores**.

- [ ] **Step 5: Commit final de Fase 1**

```bash
git add -A
git commit -m "feat(sanity): Phase 1 complete — Studio at /studio, globalConfig connected to Footer"
```

---

## Checklist de Gate — Fase 1

Antes de reportar la fase como completa, verificar:

- [ ] `npm run dev` arranca sin errores
- [ ] `npx tsc --noEmit` devuelve 0 errores
- [ ] `/studio` carga el Sanity Studio con "Configuración Global" en el sidebar
- [ ] El documento `globalConfig` está publicado en Sanity con los datos reales
- [ ] El Footer lee `whatsappUrl` desde Sanity (verificable cambiando el valor en Sanity y recargando)
- [ ] Las rutas `/es` y `/en` renderizan correctamente
- [ ] Ninguna página existente se rompió

**Solo después de pasar este checklist, reportar al usuario y esperar aprobación para Fase 2.**

---

## Troubleshooting común

**Error: `Cannot find module '@sanity/vision'`**
```bash
npm install @sanity/vision
```

**Error: `Module not found: Can't resolve 'sanity/plugins/structure'`**
Verificar que `next-sanity` v9+ está instalado. Con v9, el import correcto es:
```typescript
import { structureTool } from "sanity/structure";
// no "sanity/plugins/structure"
```

**Error: Studio en blanco o 404 en `/studio`**
Verificar que `src/app/studio/[[...tool]]/page.tsx` existe y que `export const dynamic = "force-dynamic"` está presente.

**Error: `NEXT_PUBLIC_SANITY_PROJECT_ID is undefined`**
Verificar que `.env.local` existe en la raíz del proyecto y que reiniciaste el servidor después de crearlo.

**Error TypeScript en `sanityConfig` — `NEXT_PUBLIC_SANITY_PROJECT_ID!`**
El `!` (non-null assertion) es intencional — las variables de entorno son strings en runtime aunque TypeScript no lo sabe en build time.
