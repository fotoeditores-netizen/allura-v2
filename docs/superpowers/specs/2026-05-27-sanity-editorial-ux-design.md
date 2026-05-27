# Experiencia Editorial Sanity Studio — Design Spec

**Fecha:** 2026-05-27  
**Proyecto:** Allura Healthcare  
**Rama:** feature/sanity-cms-v1

---

## Goal

Mejorar la experiencia editorial del Sanity Studio para que el cliente pueda usarlo sin confundirse ni romper el sitio. Dos cambios ortogonales: (1) reorganizar el desk structure con agrupación lógica y nombres orientados al cliente; (2) agregar descripciones de ayuda en campos de 6 schemas que hoy no las tienen.

---

## Architecture

Solo 2 archivos cambian:

1. **`src/sanity/sanity.config.ts`** — desk structure reorganizado con 14 secciones, divisores, íconos y `visionTool` al fondo.
2. **6 schemas en `src/sanity/schemaTypes/documents/`** — descripciones agregadas a campos específicos que no las tienen. No se tocan validaciones ni previews existentes.

**Nada más cambia.** Los schemas con buenas descripciones (`siteSettings`, `blogPost`, `trackingScripts`) no se modifican.

---

## Módulo 1: Desk Structure reorganizado

### Estructura objetivo

```
🏠  Página de inicio          (homePage singleton)
─────────────────────────────────────────────────
⚙️  Configuración global
    └── Datos del sitio        (siteSettings singleton)
    └── Navegación             (navigation singleton)
🔍  SEO y medición
    └── SEO global             (siteSettings — seo fields)
    └── Scripts y analítica    (trackingScripts singleton)
─────────────────────────────────────────────────
📄  Páginas                    (page document list)
🦷  Servicios
    └── Categorías             (serviceCategory list)
    └── Servicios              (service list)
📝  Blog
    └── Entradas               (blogPost list)
    └── Categorías             (category list)
─────────────────────────────────────────────────
⭐  Testimonios                (testimonial list)
❓  Preguntas frecuentes       (faq list)
🖼️  Galería                    (galleryItem list)
🎬  Videos                     (video list)
🏆  Casos de éxito             (caseStudy list)
👥  Equipo                     (teamMember list)
─────────────────────────────────────────────────
🎯  Promociones y popups
    └── Promociones            (promotion list)
    └── Popups                 (popup list)
─────────────────────────────────────────────────
🔬  Herramientas (admin)
    └── Vision — GROQ          (visionTool)
```

### Implementación en `sanity.config.ts`

Reemplazar el callback `structure` completo con:

```typescript
structure: (S) =>
  S.list()
    .title('Contenido')
    .items([
      // ── HOME ─────────────────────────────────────────────
      S.listItem()
        .title('🏠 Página de inicio')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),

      S.divider(),

      // ── CONFIGURACIÓN ────────────────────────────────────
      S.listItem()
        .title('⚙️ Configuración global')
        .child(
          S.list()
            .title('Configuración global')
            .items([
              S.listItem()
                .title('Datos del sitio')
                .id('siteSettings')
                .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
              S.listItem()
                .title('Navegación')
                .id('navigation')
                .child(S.document().schemaType('navigation').documentId('navigation')),
            ])
        ),
      S.listItem()
        .title('🔍 SEO y medición')
        .child(
          S.list()
            .title('SEO y medición')
            .items([
              S.listItem()
                .title('SEO global')
                .id('siteSettings-seo')
                .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
              S.listItem()
                .title('Scripts y analítica')
                .id('trackingScripts')
                .child(S.document().schemaType('trackingScripts').documentId('trackingScripts')),
            ])
        ),

      S.divider(),

      // ── CONTENIDO PRINCIPAL ───────────────────────────────
      S.documentTypeListItem('page').title('📄 Páginas'),
      S.listItem()
        .title('🦷 Servicios')
        .child(
          S.list()
            .title('Servicios')
            .items([
              S.documentTypeListItem('serviceCategory').title('Categorías'),
              S.documentTypeListItem('service').title('Servicios'),
            ])
        ),
      S.listItem()
        .title('📝 Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('blogPost').title('Entradas'),
              S.documentTypeListItem('category').title('Categorías'),
            ])
        ),

      S.divider(),

      // ── SOCIAL PROOF Y MEDIA ──────────────────────────────
      S.documentTypeListItem('testimonial').title('⭐ Testimonios'),
      S.documentTypeListItem('faq').title('❓ Preguntas frecuentes'),
      S.documentTypeListItem('galleryItem').title('🖼️ Galería'),
      S.documentTypeListItem('video').title('🎬 Videos'),
      S.documentTypeListItem('caseStudy').title('🏆 Casos de éxito'),
      S.documentTypeListItem('teamMember').title('👥 Equipo'),

      S.divider(),

      // ── MARKETING ─────────────────────────────────────────
      S.listItem()
        .title('🎯 Promociones y popups')
        .child(
          S.list()
            .title('Promociones y popups')
            .items([
              S.documentTypeListItem('promotion').title('Promociones'),
              S.documentTypeListItem('popup').title('Popups'),
            ])
        ),

      S.divider(),

      // ── HERRAMIENTAS ──────────────────────────────────────
      S.listItem()
        .title('🔬 Herramientas (admin)')
        .child(
          S.list()
            .title('Herramientas')
            .items([
              S.listItem()
                .title('Vision — consultas GROQ')
                .id('vision')
                .child(S.component().title('Vision').component(() => null)),
            ])
        ),
    ]),
```

**Nota sobre Vision:** `visionTool()` se mantiene registrado como plugin (necesario para que funcione). En el desk structure se documenta bajo "Herramientas (admin)" como señal visual de que no es para el cliente editor. El link de Vision en el desk no necesita ser funcional — la herramienta está accesible desde el ícono de plugins en la barra lateral del Studio.

**Simplificación:** El ítem de "Herramientas" en el desk puede omitirse completamente — `visionTool` ya aparece como ícono en la barra lateral izquierda del Studio. La separación visual (divisor + sección al fondo) es suficiente señal. Si se omite, el structure queda más limpio.

**Decisión de implementación:** Omitir el ítem "Herramientas" del desk — Vision sigue accesible por barra lateral. El desk termina después del divisor de Promociones.

---

## Módulo 2: Descripciones de campos faltantes

### `src/sanity/schemaTypes/documents/service.ts`

Agregar `description` a estos campos:

| Campo | Descripción a agregar |
|-------|----------------------|
| `category` | `"Categoría principal del servicio. Define en qué sección del menú aparece."` |
| `gallery` | `"Fotos adicionales del procedimiento. Se muestran en la página del servicio. Máximo 10 imágenes."` |
| `benefits` | `"Lista de beneficios que aparecen destacados en la página del servicio."` |
| `process` | `"Pasos del procedimiento explicados al paciente. Aparecen en la sección '¿Cómo funciona?'."` |
| `faqs` | `"Preguntas frecuentes asociadas a este servicio específico."` |
| `relatedServices` | `"Servicios relacionados que se muestran al final de la página. Máximo 3."` |
| `isActive` | `"Desactivar oculta el servicio del sitio sin eliminarlo."` |

### `src/sanity/schemaTypes/documents/galleryItem.ts`

| Campo | Descripción a agregar |
|-------|----------------------|
| `image` | `"Imagen principal de la galería. Mínimo 800×600px. Formato JPG o WebP recomendado."` |
| `category` | `"Categoría para filtrar en la galería pública. Ej: Sonrisas, Antes y después."` |
| `service` | `"Servicio relacionado con esta imagen (opcional)."` |
| `isFeatured` | `"Las imágenes destacadas aparecen primero en la galería."` |

### `src/sanity/schemaTypes/documents/video.ts`

| Campo | Descripción a agregar |
|-------|----------------------|
| `platform` | `"Plataforma donde está alojado el video."` |
| `thumbnail` | `"Imagen de portada del video. Si no se define, se usa la miniatura automática de la plataforma."` |
| `service` | `"Servicio relacionado con este video (opcional)."` |
| `isFeatured` | `"Los videos destacados aparecen primero en la sección de videos."` |

*(El campo `videoId` ya tiene descripción — no se toca.)*

### `src/sanity/schemaTypes/documents/popup.ts`

| Campo | Descripción a agregar |
|-------|----------------------|
| `trigger` | `"Cuándo aparece el popup: al cargar la página, después de un tiempo, o al intentar salir."` |
| `startDate` | `"Fecha desde la que el popup puede aparecer (opcional). Dejar vacío para activar inmediatamente."` |
| `endDate` | `"Fecha límite del popup (opcional). Dejar vacío para que no expire."` |
| `frequency` | `"Con qué frecuencia se muestra al mismo visitante: una vez, por sesión, o siempre."` |

*(Los campos `delaySeconds`, `showOnPages` e `isActive` ya tienen descripciones — no se tocan.)*

### `src/sanity/schemaTypes/documents/promotion.ts`

| Campo | Descripción a agregar |
|-------|----------------------|
| `description` | `"Texto secundario del banner. Aparece debajo del título principal (opcional)."` |
| `bgColor` | `"Color de fondo del banner de promoción."` |
| `startDate` | `"Fecha desde la que se muestra el banner (opcional)."` |
| `endDate` | `"Fecha límite del banner (opcional). Dejar vacío para que no expire."` |
| `isActive` | `"Solo puede haber una promoción activa a la vez. Desactiva la anterior antes de activar esta."` |

*(El campo `order` ya tiene descripción — no se toca.)*

### `src/sanity/schemaTypes/documents/teamMember.ts`

| Campo | Descripción a agregar |
|-------|----------------------|
| `role` | `"Cargo que aparece debajo del nombre en la página del equipo. Ej: Directora Médica."` |
| `department` | `"Área o especialidad del equipo al que pertenece."` |
| `specialties` | `"Especialidades médicas o áreas de expertise. Se muestran en el perfil del profesional."` |
| `credentials` | `"Títulos, certificaciones y registros médicos."` |
| `linkedinUrl` | `"URL del perfil de LinkedIn (opcional)."` |
| `isActive` | `"Desactivar oculta el miembro del sitio sin eliminarlo."` |
| `isFeatured` | `"Los miembros destacados aparecen primero en la página del equipo."` |

*(El campo `order` ya tiene descripción — no se toca.)*

---

## Módulo 3: Documentación de roles

### Roles y acceso en Sanity

**Lo que está disponible en todos los planes (Free, Grow, Team):**

| Rol en sanity.io/manage | Qué puede hacer |
|------------------------|----------------|
| `Administrator` | Todo: editar contenido, cambiar config del proyecto, ver Vision, deployar Studio |
| `Editor` | Crear, editar y publicar cualquier documento. No puede cambiar config del proyecto |
| `Viewer` | Solo leer. No puede editar ni publicar |

**Lo que NO está disponible sin Dataset Roles (plan Team o superior):**
- Ocultar secciones del Studio por usuario
- Restringir edición a tipos de documentos específicos por rol
- Crear roles personalizados (ej. "solo puede editar blog")

### Guía de uso por rol conceptual

| Rol conceptual | Perfil | Rol Sanity recomendado | Secciones que debe usar |
|----------------|--------|----------------------|------------------------|
| **Administrador principal** | Desarrollador / responsable técnico | `Administrator` | Todo |
| **Cliente editor** | Equipo Allura — contenido diario | `Editor` | Home, Servicios, Blog, Testimonios, Galería, Videos, Equipo, Promociones y popups |
| **Redactor** | Escribe blog y FAQs | `Editor` | Blog, Preguntas frecuentes |
| **Diseñador** | Sube imágenes y galerías | `Editor` | Galería, Videos, Equipo (fotos) |
| **Solo lectura** | Revisión sin cambios | `Viewer` | Todo (lectura) |

### Pendientes según plan de Sanity

Para implementar restricciones reales por rol se necesita el plan **Team** de Sanity:

1. **Dataset Roles** — permite crear roles personalizados con permisos a nivel de tipo de documento
2. **Role-based access** — permite ocultar secciones del Studio por usuario
3. **Audit log** — registro de quién cambió qué y cuándo

Hasta que se active el plan Team, la protección es educacional: la guía de roles documenta qué debe editar cada persona, pero no hay restricción técnica que lo impida.

### Cómo invitar usuarios desde sanity.io/manage

1. Ir a `sanity.io/manage` → seleccionar el proyecto Allura
2. `Access` → `Members` → `Invite members`
3. Ingresar el email y seleccionar el rol (`Editor`, `Viewer`, etc.)
4. El usuario recibe un email de invitación

---

## File Structure

### Archivos a modificar
```
src/sanity/sanity.config.ts                              — desk structure reorganizado
src/sanity/schemaTypes/documents/service.ts              — 7 campos con descripción
src/sanity/schemaTypes/documents/galleryItem.ts          — 4 campos con descripción
src/sanity/schemaTypes/documents/video.ts                — 4 campos con descripción
src/sanity/schemaTypes/documents/popup.ts                — 4 campos con descripción
src/sanity/schemaTypes/documents/promotion.ts            — 5 campos con descripción
src/sanity/schemaTypes/documents/teamMember.ts           — 7 campos con descripción
```

### Archivos a crear
Ninguno.

---

## Out of Scope

- Permisos personalizados por rol (requiere plan Team de Sanity)
- Ocultar campos por rol de usuario
- Internacionalización del Studio (labels en inglés/español según usuario)
- Preview en tiempo real del sitio desde el Studio
- Nuevos tipos de documentos
