# Diseño: Editor de Páginas con Secciones y Bloques

**Fecha:** 2026-05-29  
**Rama de trabajo:** `feature/supabase-migration`  
**Estado:** Aprobado — listo para planificación

---

## Contexto

Allura Healthcare tiene un CMS en `/admin` construido con Next.js + Supabase. Las páginas públicas del sitio (`/es`, `/es/nosotros`, `/es/como-funciona`, etc.) tienen su contenido hardcodeado en archivos `.tsx`. El objetivo es hacer ese contenido editable desde el panel admin sin conocimientos técnicos, manteniendo retrocompatibilidad total con el sitio actual.

---

## Objetivo

Un editor de páginas donde el cliente puede:
1. Ver todas las páginas del sitio
2. Agregar, reordenar, mostrar/ocultar y eliminar secciones en cualquier página
3. Editar el contenido de cada sección con formularios en español
4. Ver un preview en tiempo real antes de publicar
5. Publicar cambios al sitio público con un clic

---

## Arquitectura general

### Dos áreas separadas

**Panel izquierdo (30%)** — árbol de secciones con drag & drop para reordenar. Al seleccionar una sección aparece su formulario debajo. Botón "Agregar sección" abre un selector del catálogo.

**Panel derecho (70%)** — iframe que carga la página pública en modo `?preview=true`. Se refresca después de cada guardado.

### Retrocompatibilidad

La página pública primero busca secciones en Supabase. Si no hay datos, renderiza el contenido hardcodeado actual. El sitio nunca queda en blanco.

### Guardar vs Publicar

- **Guardar** → escribe en Supabase, visible solo en el preview del admin
- **Publicar** → cambia `pages.status = 'published'` + llama `revalidatePath()` para limpiar caché ISR

---

## Flujo de datos

```
Cliente edita campo
       ↓
Estado local React
       ↓
Clic "Guardar sección"
       ↓
UPSERT en tabla sections (settings JSONB)
       ↓
iframe recarga con ?preview=true
       ↓
Página pública lee secciones frescas de Supabase
       ↓
Cliente ve el resultado
```

### Modo preview

Cuando `?preview=true` está en la URL, la página pública omite el caché ISR y lee datos frescos. Sin ese parámetro, el sitio público sigue usando `revalidate: 3600`.

---

## Catálogo de secciones (section-registry)

| Type | Label | Componente público | Campos editables |
|------|-------|-------------------|-----------------|
| `hero` | Hero principal | `HeroSection.tsx` | Eyebrow, título (2 líneas), subtítulo, CTA primario, CTA secundario, imagen |
| `benefits` | Beneficios | `BenefitsSection.tsx` | Eyebrow, título, subtítulo + 3 tarjetas (icono, título, descripción) |
| `services_grid` | Servicios | `ServicesPreview.tsx` | Eyebrow, título, subtítulo (tarjetas de `services`) |
| `about_teaser` | Sobre nosotros | `AboutTeaser.tsx` | Eyebrow, título, subtítulo, texto, imagen, texto botón |
| `medellin` | Medellín | `MedellinSection.tsx` | Eyebrow, título, subtítulo + 4 items (icono, título, descripción) |
| `team_preview` | Equipo | `TeamPreview.tsx` | Eyebrow, título, subtítulo (tarjetas de `team_members`) |
| `process` | Proceso | `ProcessSection.tsx` | Eyebrow, título + 4 pasos (número, título, descripción) |
| `cta` | CTA Banner | `CTABanner.tsx` | Eyebrow, título, subtítulo, texto botón |
| `testimonials` | Testimonios | nuevo | Eyebrow, título (items de `testimonials`) |
| `faq` | Preguntas frecuentes | nuevo | Eyebrow, título (items de `faqs`) |
| `contact_form` | Formulario contacto | nuevo | Eyebrow, título, subtítulo |
| `text_image` | Texto + imagen | nuevo | Título, texto, imagen, posición imagen |

Todos los campos de texto son bilingües `{ es, en }` con pestañas ES/EN en el formulario.

**Extensibilidad:** para agregar un tipo nuevo, un desarrollador registra en `section-registry.ts`:
- `type` (string único)
- `label` (nombre en español)
- `icon`
- `defaultSettings` (JSONB inicial)
- `FormComponent` (React component)
- `PublicComponent` (React component)

---

## Páginas editables

Todas las páginas públicas del sitio son editables:

| Página | Slug | Notas |
|--------|------|-------|
| Inicio | `/` | 8 secciones actuales se migran a Supabase |
| Nosotros | `/nosotros` | — |
| Cómo funciona | `/como-funciona` | — |
| Contacto | `/contacto` | — |
| Servicios (listado) | `/servicios` | Hero + CTA |
| Blog (listado) | `/blog` | Hero + CTA. Artículos desde `/admin/blog` |
| Equipo (listado) | `/equipo` | Hero + CTA. Perfiles desde `/admin/equipo` |
| Galería | `/galeria` | Hero + CTA |
| Páginas de servicios | `/servicios/[categoria]/[slug]` | Hero + CTA |
| Páginas personalizadas | `/[slug]` | Cualquier combinación de secciones |

---

## Estructura de archivos

### Nuevos
```
src/
├── lib/
│   ├── supabase/pages.ts              → getPages(), getPageBySlug(),
│   │                                    getSectionsByPage(), upsertSection(),
│   │                                    reorderSections(), deleteSection(),
│   │                                    upsertPage(), publishPage()
│   └── section-registry.ts            → catálogo central type → {label, icon, Form, defaults}
│
├── components/admin/
│   ├── PageEditor.tsx                 → layout panel + iframe
│   ├── SectionTree.tsx                → árbol drag & drop
│   ├── SectionFormRouter.tsx          → switch type → formulario
│   └── section-forms/
│       ├── HeroForm.tsx
│       ├── BenefitsForm.tsx
│       ├── ServicesGridForm.tsx
│       ├── AboutTeaserForm.tsx
│       ├── MedellinForm.tsx
│       ├── TeamPreviewForm.tsx
│       ├── ProcessForm.tsx
│       ├── CtaForm.tsx
│       ├── TestimonialsForm.tsx
│       ├── FaqForm.tsx
│       ├── ContactFormSectionForm.tsx
│       └── TextImageForm.tsx
│
└── app/
    ├── admin/paginas/
    │   ├── page.tsx                   → lista de páginas
    │   └── [slug]/page.tsx            → PageEditor
    └── api/preview/route.ts           → valida modo preview
```

### Modificados
```
src/app/[locale]/page.tsx              → lee secciones de Supabase, fallback hardcodeado
src/app/[locale]/nosotros/page.tsx     → ídem
src/app/[locale]/como-funciona/page.tsx → ídem
src/app/[locale]/contacto/page.tsx     → ídem
src/app/[locale]/blog/page.tsx         → ídem (solo página listado)
src/app/[locale]/equipo/page.tsx       → ídem (solo página listado)
src/app/[locale]/galeria/page.tsx      → ídem
src/components/sections/SectionRenderer.tsx → nuevo componente que mapea type → componente
```

---

## UI del editor

### Lista de páginas `/admin/paginas`

Tabla con columnas: Página, Slug, Estado (badge), Última edición, Acciones (Editar).
Botón "Nueva página" arriba a la derecha.

### Editor `/admin/paginas/[slug]`

```
┌─────────────────────┬──────────────────────────────────┐
│ ← Volver a páginas  │                                  │
│ Inicio              │                                  │
│ ─────────────────── │         IFRAME PREVIEW           │
│ + Agregar sección   │      (?preview=true)             │
│ ─────────────────── │                                  │
│ ☰ 👁 Hero        ●  │                                  │
│ ☰ 👁 Beneficios     │                                  │
│ ☰ 👁 Servicios      │                                  │
│ ☰ 👁 Equipo         │                                  │
│ ─────────────────── │                                  │
│                     │                                  │
│ [Formulario sección │                                  │
│  seleccionada]      │                                  │
│  Pestañas ES / EN   │                                  │
│                     │                                  │
│ [Guardar] [Publicar]│                                  │
└─────────────────────┴──────────────────────────────────┘
```

- `☰` handle de drag & drop para reordenar
- `👁` toggle show/hide sección
- `●` sección activa
- Formulario aparece debajo del árbol al seleccionar

---

## Blog, Equipo y Servicios

- **`/blog`** — página listado editable desde `/admin/paginas`. Artículos desde `/admin/blog`.
- **`/equipo`** — página listado editable desde `/admin/paginas`. Perfiles desde `/admin/equipo`.
- **`/servicios/[cat]/[slug]`** — páginas de detalle editables desde `/admin/paginas`. Datos del servicio desde `/admin/servicios`.

---

## Criterios de éxito

1. El cliente puede editar cualquier texto del sitio sin tocar código
2. El preview en iframe muestra el resultado antes de publicar
3. Publicar limpia el caché ISR y el cambio se ve en el sitio público en segundos
4. Si Supabase no tiene datos de una página, el sitio muestra el contenido hardcodeado (sin blank pages)
5. Agregar un tipo de sección nuevo requiere solo registrarlo en `section-registry.ts`
6. Todos los campos de texto son bilingües (ES/EN)
7. El reordenamiento de secciones funciona con drag & drop
