# Diseño: Migración Allura Healthcare — Sanity → Supabase

**Fecha:** 2026-05-28
**Rama de trabajo:** `feature/supabase-migration`
**Estado:** Aprobado — listo para planificación

---

## Contexto

Allura Healthcare es un sitio de turismo médico en Medellín construido con Next.js + App Router + next-intl (es/en). El backend editorial actual es Sanity CMS con 23 tipos de documentos y Sanity Studio en `/studio`.

El objetivo es reemplazar Sanity por Supabase para convertir Allura en el primer prototipo de una arquitectura reutilizable multi-cliente. Los futuros clientes recibirán sitios basados en esta misma arquitectura con un panel administrativo propio en español.

**Restricción crítica:** El frontend que el cliente aprobó no cambia visualmente. Solo cambia la fuente de datos.

---

## Stack resultante

- Next.js 14 + App Router + next-intl (sin cambios)
- TypeScript (sin cambios)
- Tailwind CSS (sin cambios)
- **Supabase Auth** — reemplaza Sanity Auth (que no existía)
- **Supabase Postgres** — reemplaza Sanity dataset
- **Supabase Storage** — reemplaza Sanity CDN + `urlFor()`
- **Supabase RLS** — seguridad a nivel de fila
- shadcn/ui — panel administrativo nuevo
- Zod + React Hook Form — formularios del panel
- Vercel (sin cambios)
- GitHub con rama `feature/supabase-migration`

---

## Arquitectura general

### Dos áreas separadas

**Sitio público** (`/es/*`, `/en/*`): Sin cambios visuales. Lee datos de Supabase en vez de Sanity. Mismo ISR con `revalidate: 3600`.

**Panel administrativo** (`/admin/*`): Nuevo. Reemplaza Sanity Studio. Interfaz en español con shadcn/ui. Protegido por middleware de autenticación Supabase.

---

## Base de datos — mapeo Sanity → Supabase

### Singletons → configuración

| Sanity | Supabase |
|--------|----------|
| `siteSettings` | `site_settings` (tabla key/value) |
| `homePage` | `pages` (slug: `/`, type: `home`) + `sections` |
| `navigation` | `navigation_menus` + `navigation_items` |
| `trackingScripts` | `site_settings` (keys: `ga_id`, `gtm_id`, `meta_pixel_id`, etc.) |

### Documentos → tablas

| Sanity | Supabase |
|--------|----------|
| `service` | `services` |
| `serviceCategory` | `service_categories` |
| `blogPost` | `blog_posts` |
| `category` | `categories` |
| `teamMember` | `team_members` |
| `testimonial` | `testimonials` |
| `faq` | `faqs` |
| `galleryItem` | `gallery_items` |
| `video` | `videos` |
| `popup` | `popups` |
| `promotion` | `promotions` |
| `caseStudy` | `case_studies` |
| `page` | `pages` |

### Tablas de estructura de contenido

| Tabla | Propósito |
|-------|-----------|
| `sections` | Secciones dentro de una página (type, sort_order, is_visible, settings JSONB) |
| `blocks` | Bloques de contenido dentro de una sección (ej: cada servicio en una grid, cada testimonio) |

Tipos de sección soportados: `hero`, `text_image`, `services_grid`, `testimonials`, `gallery`, `faq`, `cta`, `contact_form`, `metrics`, `logos`, `team`, `map`.

Cada nuevo tipo de sección requiere: componente público + componente de edición en admin + schema Zod + registro en el renderizador.

### Tablas nuevas (no existían en Sanity)

| Tabla | Propósito |
|-------|-----------|
| `auth.users` | Supabase Auth nativo |
| `profiles` | Datos extra del usuario autenticado |
| `site_users` | Relación usuario ↔ sitio + rol |
| `form_submissions` | Leads del formulario de contacto |
| `media_assets` | Registro de archivos subidos a Storage |
| `redirects` | Redirecciones SEO (from_path → to_path, status_code 301/302) |

### Campos bilingües

Los campos `{ es: string; en: string }` de Sanity se guardan como JSONB:
```sql
title_i18n jsonb -- { "es": "Texto en español", "en": "English text" }
```

---

## Roles y permisos

| Acción | owner | admin | editor | viewer |
|--------|-------|-------|--------|--------|
| Editar contenido | ✅ | ✅ | ✅ | ❌ |
| Publicar/despublicar | ✅ | ✅ | ✅ | ❌ |
| Ver formularios recibidos | ✅ | ✅ | ✅ | ✅ |
| Subir imágenes | ✅ | ✅ | ✅ | ❌ |
| Administrar usuarios | ✅ | ✅ | ❌ | ❌ |
| Cambiar configuración del sitio | ✅ | ✅ | ❌ | ❌ |

Los permisos se validan en dos niveles:
1. **Middleware Next.js** — protege rutas `/admin/*`, redirige a `/admin/login` sin sesión
2. **RLS en Supabase** — segunda capa de seguridad en base de datos

---

## Panel administrativo `/admin`

### Rutas

```
/admin                    → Dashboard (estado general, páginas publicadas, leads recientes)
/admin/login              → Login con Supabase Auth
/admin/paginas            → Listado y editor de páginas + secciones + bloques
/admin/servicios          → CRUD servicios y categorías
/admin/blog               → CRUD artículos del blog
/admin/equipo             → CRUD miembros del equipo
/admin/testimonios        → CRUD testimonios
/admin/galeria            → Galería de imágenes y videos
/admin/medios             → Biblioteca de medios: subir, buscar, editar alt_text, eliminar
/admin/faq                → Preguntas frecuentes
/admin/formularios        → Leads recibidos (nuevo/revisado/archivado)
/admin/redirects          → Redirecciones SEO (from → to, código 301/302)
/admin/configuracion      → siteSettings: logo, colores, contacto, redes sociales, analytics
/admin/usuarios           → Gestión de usuarios y roles (owner/admin only)
```

### Tecnología del panel

- shadcn/ui para todos los componentes visuales
- Lenguaje simple en español, sin términos técnicos
- React Hook Form + Zod para todos los formularios
- Mensajes de éxito y error claros en cada acción

---

## Capa de datos — reemplazo de queries GROQ

### Estructura de archivos nueva

```
src/lib/supabase/
  client.ts          → cliente Supabase para Server Components
  services.ts        → getServices(), getServiceBySlug()
  blog.ts            → getBlogPosts(), getBlogPostBySlug()
  team.ts            → getTeamMembers(), getTeamMemberBySlug()
  testimonials.ts    → getTestimonials()
  faq.ts             → getFaqs()
  gallery.ts         → getGalleryItems()
  videos.ts          → getVideos()
  popups.ts          → getActivePopup()
  promotions.ts      → getActivePromotions()
  siteSettings.ts    → getSiteSettings()
  homePage.ts        → getHomePage()
  navigation.ts      → getNavigation()
  sections.ts        → getSectionsByPage(), reorderSections(), toggleSectionVisibility()
  blocks.ts          → getBlocksBySection(), reorderBlocks()
  redirects.ts       → getRedirects() — usado en middleware para redirecciones SEO
  storage.ts         → uploadImage(), getPublicUrl(), deleteImage()
```

### Principio de compatibilidad

Cada función devuelve tipos TypeScript equivalentes a los actuales de Sanity. El objetivo es que los componentes React (HeroSection, ServiceDetailTemplate, etc.) reciban los mismos props — solo cambia el origen de los datos.

### ISR

Se mantiene el mismo patrón:
```ts
export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600
```

---

## Storage de imágenes

### Reemplazo de Sanity CDN

- `urlFor(image)` de Sanity → `getPublicUrl(path)` de Supabase Storage
- Todos los componentes que usan `urlFor` se actualizan en la fase 7

### Estructura de buckets

```
allura-media/
  services/
  blog/
  team/
  gallery/
  site/     → logo, favicon, og-images
```

### Tipos de archivo permitidos

- JPG, PNG, WebP, SVG (con sanitización), PDF
- **Prohibidos:** archivos ejecutables (.exe, .sh, .js, .php, etc.)
- Peso máximo por archivo: 10 MB
- Validación de tipo en frontend (Zod) y en política de Storage

### Políticas de Storage

- Lectura pública para todos los buckets
- Escritura solo para usuarios autenticados con rol editor o superior
- Organización por `site_id` para aislar archivos entre clientes

### Componentes nuevos en el panel

```
src/components/admin/
  ImageUploader.tsx   → drag & drop para subir imágenes
  MediaLibrary.tsx    → galería de archivos subidos
```

---

## Analítica — configuración desde panel

Los IDs de analytics se guardan en `site_settings` como keys individuales y se editan desde `/admin/configuracion`:

| Key | Descripción |
|-----|-------------|
| `ga_measurement_id` | Google Analytics 4 |
| `gtm_container_id` | Google Tag Manager |
| `meta_pixel_id` | Meta (Facebook) Pixel |
| `tiktok_pixel_id` | TikTok Pixel |
| `google_search_console` | Meta tag de verificación |

El componente `AnalyticsScripts.tsx` existente se actualiza para leer estos valores desde Supabase en vez de Sanity `trackingScripts`.

---

## Formulario de contacto

`src/app/api/contact/route.ts` se modifica para:
1. Guardar el lead en tabla `form_submissions` en Supabase
2. Mantener envío de email existente sin cambios
3. El panel `/admin/formularios` muestra leads con estado: `nuevo` / `revisado` / `archivado`

---

## Row Level Security (RLS)

Reglas obligatorias:
- Toda tabla editable tiene RLS activado
- Un usuario solo accede a datos del sitio donde aparece en `site_users`
- El sitio público solo lee contenido con `status = 'published'`
- Visitantes pueden insertar en `form_submissions` pero no leer respuestas
- Solo owner/admin pueden leer `form_submissions`
- `SUPABASE_SERVICE_ROLE_KEY` nunca se expone en el navegador (sin prefijo `NEXT_PUBLIC_`)

---

## Variables de entorno

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # solo server-side, nunca NEXT_PUBLIC_
NEXT_PUBLIC_SITE_URL=
```

Las variables de Sanity (`NEXT_PUBLIC_SANITY_PROJECT_ID`, etc.) se eliminan en la fase 10.

---

## Fases de implementación

| # | Fase | Descripción | Riesgo |
|---|------|-------------|--------|
| 1 | Configuración Supabase | Proyecto Supabase, variables de entorno, cliente TS | Bajo |
| 2 | Base de datos | Migraciones SQL para todas las tablas, seed inicial | Bajo |
| 3 | Auth + middleware | Supabase Auth, roles, protección rutas `/admin` | Medio |
| 4 | Panel base | Login, dashboard, layout admin con shadcn/ui | Medio |
| 5 | CRUDs del panel | Servicios, blog, equipo, testimonios, FAQ, galería, videos, popups, promociones | Alto |
| 6 | Capa de datos pública | Reescritura queries GROQ → Supabase SDK, tipos TS | Alto |
| 7 | Storage + imágenes | Buckets, `getPublicUrl()`, reemplazo de `urlFor()` | Medio |
| 8 | Formularios | `form_submissions`, vista en panel admin | Bajo |
| 9 | RLS | Políticas de seguridad en todas las tablas | Medio |
| 10 | Limpieza Sanity | Eliminar dependencias, schemas, Studio, variables | Bajo |

**Regla de fase:** No avanzar a la siguiente fase sin compilación exitosa + funcionamiento local verificado.

---

## Lo que NO cambia

- Diseño visual del sitio público (el cliente lo aprobó)
- Estructura de rutas públicas (`/es/*`, `/en/*`)
- Sistema i18n con next-intl
- Componentes React del sitio público (solo cambian sus data-fetchers)
- Deploy en Vercel
- Repositorio GitHub

---

## Checklist de entrega al cliente

Antes de considerar la migración completa y entregar al cliente:

**Sitio público:**
- [ ] Todas las páginas cargan sin errores
- [ ] Sitio responsive en móvil, tablet y escritorio
- [ ] SEO básico por página funcionando
- [ ] Formularios de contacto funcionando y guardando en Supabase
- [ ] Imágenes cargando desde Supabase Storage
- [ ] Analytics configurados y activos

**Panel administrativo:**
- [ ] Login y logout funcionando
- [ ] Dashboard con estado general del sitio
- [ ] Edición de páginas, secciones y bloques funcionando
- [ ] Subida de imágenes desde `/admin/medios`
- [ ] Leads visibles en `/admin/formularios`
- [ ] Roles y permisos probados por cada rol
- [ ] `/admin/configuracion` permite editar logo, colores, contacto, redes, analytics

**Seguridad:**
- [ ] RLS activado en todas las tablas
- [ ] `SUPABASE_SERVICE_ROLE_KEY` no expuesta en cliente
- [ ] Usuario sin sesión no accede a `/admin`
- [ ] Editor no puede administrar usuarios ni configuración
- [ ] Datos de prueba eliminados o reemplazados

**Entrega:**
- [ ] Usuario administrador creado para el cliente
- [ ] Accesos entregados de forma segura
- [ ] Manual de uso entregado (ver sección Manual)
- [ ] Variables de entorno configuradas en Vercel
- [ ] Dominio configurado y SSL activo

---

## Manual para cliente final

El panel administrativo debe entregarse con un manual en español que cubra:

1. Cómo iniciar y cerrar sesión
2. Cómo editar textos e imágenes de una página
3. Cómo crear una página nueva
4. Cómo ocultar o mostrar una sección
5. Cómo subir imágenes desde Medios
6. Cómo revisar formularios recibidos
7. Cómo actualizar datos de contacto y redes sociales
8. Qué NO hacer (borrar páginas sin verificar, subir imágenes sin derechos, etc.)

El manual se genera como documento Markdown en `docs/manual-cliente.md` al final del proyecto.

---

## Criterios de éxito

1. `pnpm build` sin errores en la rama de migración
2. Todas las páginas públicas cargan con datos reales desde Supabase
3. El panel `/admin` permite editar cualquier contenido del sitio
4. Un usuario sin sesión no puede acceder a `/admin`
5. Un editor no puede administrar usuarios ni configuración del sitio
6. Las imágenes cargan desde Supabase Storage
7. El formulario de contacto guarda leads en Supabase y son visibles en el panel
8. Los redirects configurados en `/admin/redirects` funcionan en el sitio público
9. No hay ninguna importación de `@sanity` en el proyecto
10. El sitio visualmente es idéntico al prototipo aprobado por el cliente
11. RLS activo — un usuario no puede acceder a datos de otro sitio
