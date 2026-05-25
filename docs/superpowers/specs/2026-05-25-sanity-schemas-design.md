# Sanity CMS Schemas — Allura Healthcare
**Fecha:** 2026-05-25
**Branch:** feature/sanity-cms-v1
**Estado:** Aprobado — pendiente implementación

---

## Contexto y decisiones de arquitectura

### Stack
- Next.js 14 App Router + TypeScript
- next-intl con rutas `/es/...` y `/en/...` (`localePrefix: "always"`)
- Sanity Studio embebido en `/studio`
- Studio activo carga schemas desde `src/sanity/schemaTypes/`

### Decisiones clave

| Decisión | Elección | Motivo |
|---|---|---|
| Ubicación canónica de schemas | `src/sanity/schemaTypes/` | Es donde el Studio activo carga los tipos |
| Fuente de referencia | `sanity/schemas/` se migra y extiende | Tiene el trabajo real: bilingüismo, validaciones, objetos reutilizables |
| `globalConfig` actual | Se absorbe dentro de `siteSettings` | Redundante, rudimentario |
| Servicios y subpáginas (~24) | Migración completa a documentos Sanity | El cliente necesita editar todo el contenido |
| Páginas internas | Portable Text bilingüe libre | Máxima flexibilidad editorial |
| Patrón bilingüe | Objeto inline `{ es, en }` | Ya establecido en el proyecto |

---

## Objetos reutilizables (no documentos)

Estos tipos se definen una vez y se embeben en múltiples schemas. Todos ya existen en `sanity/schemas/objects/` y se migran a `src/sanity/schemaTypes/objects/`.

| Nombre técnico | Archivo | Descripción |
|---|---|---|
| `seoObject` | `seo.ts` | Meta título, meta descripción, OG image, noIndex, canonical, JSON-LD |
| `localeString` | `localeString.ts` | String bilingüe ES/EN |
| `localeStringShort` | `localeString.ts` | String bilingüe max 80 chars |
| `localeText` | `localeString.ts` | Textarea bilingüe |
| `localePortableText` | `localeString.ts` | Rich text bilingüe: H2/H3/H4, bold, italic, links, imágenes |
| `ctaObject` | `cta.ts` | Botón: label ES/EN, URL, estilo (primary/secondary/ghost/whatsapp), nueva pestaña |
| `navItem` | `navItem.ts` | Ítem de menú: label ES/EN, URL, submenú de 1 nivel (max 8 hijos) |
| `processStep` | `processStep.ts` | Paso de proceso: número, icon, title bilingüe, description bilingüe |

---

## Singletons (un documento, no se pueden crear ni borrar)

Todos los singletons usan `__experimental_actions: ['update', 'publish']` para eliminar el botón "Crear nuevo" del Studio.

---

### 1. `siteSettings` — Configuración del sitio

**Título Studio:** Configuración del sitio
**Riesgo:** CRÍTICO
**Edición:** Solo Admin

**Grupos:**
- `brand` — Marca e identidad (default)
- `contact` — Contacto
- `social` — Redes sociales
- `partners` — Socios y certificaciones
- `seo` — SEO global
- `colors` — Colores de marca (solo Admin)

**Campos:**

| Campo | Tipo | Validación | Bilingüe | Grupo |
|---|---|---|---|---|
| `siteName` | `string` | required, max 60 | No | brand |
| `tagline` | `localeString` | required | Sí | brand |
| `logo` | `image` + `alt: string` | required | No | brand |
| `logoLight` | `image` + `alt: string` | opcional | No | brand |
| `favicon` | `image` | required | No | brand |
| `contactEmail` | `string` | required, regex email | No | contact |
| `whatsappNumber` | `string` | required, regex `^\+[1-9]\d{7,14}$` | No | contact |
| `whatsappMessage` | `localeString` | required, max 200 | Sí | contact |
| `responseTime` | `localeString` | max 50 | Sí | contact |
| `address` | `string` | opcional | No | contact |
| `socialInstagram` | `url` | opcional | No | social |
| `socialFacebook` | `url` | opcional | No | social |
| `socialLinkedin` | `url` | opcional | No | social |
| `socialYoutube` | `url` | opcional | No | social |
| `partners` | `array` de `{name, logo, url}` | opcional | No | partners |
| `certifications` | `array` de `{name, logo, url}` | opcional | No | partners |
| `seo` | `seoObject` | fallback global | Sí | seo |
| `brandColors` | objeto `{primary, secondary, accent, light}` | regex hex `^#[0-9A-Fa-f]{6}$` | No | colors |

**Nota de migración:** Reemplaza `globalConfig` actual. Los campos `whatsappUrl`, `email`, `instagram`, `facebook`, `linkedin`, `tiktok`, `copyright_es/en` se mapean a `siteSettings`.

---

### 2. `navigation` — Navegación

**Título Studio:** Navegación
**Riesgo:** ALTO — un error rompe la navegación completa
**Edición:** Solo Admin

**Grupos:** `mainMenu` (default), `footer`, `ctas`, `legal`

| Campo | Tipo | Validación | Bilingüe | Grupo |
|---|---|---|---|---|
| `mainMenu` | `array` de `navItem` | required, min 3 | Sí | mainMenu |
| `footerMenuPrimary` | `array` de `navItem` | opcional | Sí | footer |
| `footerMenuServices` | `array` de `navItem` | opcional | Sí | footer |
| `footerBrandDescription` | `localeText` | max 250 | Sí | footer |
| `footerWhatsappHeading` | `localeString` | max 60 | Sí | footer |
| `footerWhatsappSub` | `localeString` | max 120 | Sí | footer |
| `footerCopyright` | `localeString` | — | Sí | footer |
| `ctaBookConsultation` | `ctaObject` | — | Sí | ctas |
| `ctaPayHere` | `ctaObject` | — | Sí | ctas |
| `ctaWhatsapp` | `ctaObject` | — | Sí | ctas |
| `legalLinks` | `array` de `navItem` | min 1 | Sí | legal |

---

### 3. `homePage` — Página de inicio

**Título Studio:** Página de inicio
**Riesgo:** ALTO
**Edición:** Editor para copy, Admin para referencias

**Grupos (secciones colapsables):** `hero` (default), `benefits`, `services`, `about`, `medellin`, `team`, `process`, `ctaBanner`, `seo`

| Sección | Campos principales | Validaciones |
|---|---|---|
| `hero` | `eyebrow`, `headlinePart1`, `headlinePart2`, `subtext`, `ctaPrimary`, `ctaSecondary`, `backgroundImage` | headline required |
| `benefitsSection` | `eyebrow`, `title`, `subtitle`, array `benefits[]{icon, title, description}` | title required, benefits min 2 max 6 |
| `servicesSection` | `eyebrow`, `title`, `subtitle`, `featuredCategories: reference[] → serviceCategory` | title required, refs min 2 max 4 |
| `aboutTeaser` | `eyebrow`, `title`, `body`, `cta`, `image` | title, body required |
| `medellinSection` | `eyebrow`, `title`, `subtitle`, array `blocks[]{title, text}`, `cta` | title, subtitle required, blocks min 2 max 6 |
| `teamSection` | `eyebrow`, `title`, `subtitle`, `featuredMembers: reference[] → teamMember`, `cta` | title required, refs min 2 max 8 |
| `processSection` | `eyebrow`, `title`, array `processStep[]`, `cta` | title required, steps min 2 max 6 |
| `ctaBanner` | `eyebrow`, `title`, `body`, `cta`, `backgroundImage` | title, body, cta required |
| `seo` | `seoObject` | — |

---

### 4. `trackingScripts` — Scripts y analítica

**Título Studio:** Scripts y analítica
**Riesgo:** CRÍTICO — scripts incorrectos pueden romper el sitio
**Edición:** Solo Admin

**Grupos:** `analytics` (default), `ads`, `heatmaps`, `custom`, `cookies`

| Campo | Tipo | Validación | Grupo |
|---|---|---|---|
| `googleAnalyticsId` | `string` | regex `^G-[A-Z0-9]+$` | analytics |
| `gtmContainerId` | `string` | regex `^GTM-[A-Z0-9]+$` | analytics |
| `googleSearchConsoleVerification` | `string` | opcional | analytics |
| `metaPixelId` | `string` | regex `^\d+$` | ads |
| `googleAdsId` | `string` | opcional | ads |
| `tiktokPixelId` | `string` | opcional | ads |
| `hotjarId` | `string` | opcional | heatmaps |
| `clarityId` | `string` | opcional | heatmaps |
| `customHeadScripts` | `text` | advertencia PRECAUCIÓN visible | custom |
| `customBodyStartScripts` | `text` | advertencia PRECAUCIÓN visible | custom |
| `customBodyEndScripts` | `text` | advertencia PRECAUCIÓN visible | custom |
| `cookieConsentEnabled` | `boolean` | initialValue: false | cookies |
| `cookieConsentText` | `localeText` | hidden si `cookieConsentEnabled=false` | cookies |
| `cookieConsentButtonLabel` | `localeString` | hidden si `cookieConsentEnabled=false` | cookies |
| `environment` | `string` enum `production/staging/development` | initialValue: production | analytics |

---

## Documentos con múltiples instancias

---

### 5. `serviceCategory` — Categoría de servicio

**Título Studio:** Categorías de servicio
**Instancias esperadas:** 4 (Full Mouth Reconstruction, Smile Makeover, Aligners, Facial Harmony)

| Campo | Tipo | Validación | Bilingüe |
|---|---|---|---|
| `title` | `localeString` | required | Sí |
| `slug` | `slug` (fuente: `title.es`) | required, unique | No |
| `description` | `localeText` | required | Sí |
| `icon` | `string` (nombre Lucide) | opcional | No |
| `coverImage` | `image` + `alt: localeString` | required | No |
| `order` | `number` | para ordenar en listas | No |
| `seo` | `seoObject` | — | Sí |

---

### 6. `service` — Servicio / Subpágina

**Título Studio:** Servicios
**Instancias esperadas:** ~24 (las subpáginas actuales hardcodeadas)

| Campo | Tipo | Validación | Bilingüe |
|---|---|---|---|
| `title` | `localeString` | required | Sí |
| `slug` | `slug` | required, unique | No |
| `category` | `reference → serviceCategory` | required | No |
| `shortDescription` | `localeText` | required, max 200 | Sí |
| `body` | `localePortableText` | required | Sí |
| `coverImage` | `image` + `alt: localeString` | required | No |
| `gallery` | `array` de `image` + `alt: localeString` | max 12 | No |
| `benefits` | `array` de `{icon, title: localeString, description: localeText}` | max 8 | Sí |
| `process` | `array` de `processStep` | max 6 | Sí |
| `faq` | `array` de `reference → faq` | opcional | No |
| `relatedServices` | `array` de `reference → service` | max 3 | No |
| `testimonials` | `array` de `reference → testimonial` | max 4 | No |
| `ctaBanner` | objeto `{title: localeString, body: localeText, cta: ctaObject}` | opcional | Sí |
| `seo` | `seoObject` | required | Sí |
| `publishedAt` | `datetime` | required | No |
| `isActive` | `boolean` | initialValue: true | No |

---

### 7. `page` — Página interna genérica

**Título Studio:** Páginas
**Instancias:** Nosotros, Cómo Funciona, Equipo, Contacto, Accesibilidad, Términos, Privacidad, Medical Disclaimer

| Campo | Tipo | Validación | Bilingüe |
|---|---|---|---|
| `title` | `localeString` | required | Sí |
| `slug` | `slug` | required, unique | No |
| `pageType` | `string` enum | `about/how-it-works/team/contact/legal/custom` | No |
| `heroTitle` | `localeString` | opcional | Sí |
| `heroSubtitle` | `localeText` | opcional | Sí |
| `heroImage` | `image` + `alt: localeString` | opcional | No |
| `body` | `localePortableText` | required | Sí |
| `seo` | `seoObject` | required | Sí |
| `isActive` | `boolean` | initialValue: true | No |

**Regla de seguridad:** Páginas con `pageType: 'legal'` muestran advertencia: "Este contenido tiene implicaciones legales. Consulta con el equipo antes de publicar cambios."

---

### 8. `blogPost` — Entrada de blog

**Título Studio:** Blog / Noticias

| Campo | Tipo | Validación | Bilingüe |
|---|---|---|---|
| `title` | `localeString` | required | Sí |
| `slug` | `slug` | required, unique | No |
| `author` | `reference → teamMember` | required | No |
| `categories` | `array` de `reference → category` | min 1 | No |
| `publishedAt` | `datetime` | required | No |
| `status` | `string` enum | `draft/review/published` | No |
| `featuredImage` | `image` + `alt: localeString` | required | No |
| `excerpt` | `localeText` | required, max 200 | Sí |
| `body` | `localePortableText` | required | Sí |
| `relatedPosts` | `array` de `reference → blogPost` | max 3 | No |
| `relatedServices` | `array` de `reference → service` | max 2 | No |
| `seo` | `seoObject` | required | Sí |

---

### 9. `category` — Categoría de blog

**Título Studio:** Categorías de blog

| Campo | Tipo | Validación | Bilingüe |
|---|---|---|---|
| `title` | `localeString` | required | Sí |
| `slug` | `slug` | required, unique | No |
| `description` | `localeText` | opcional | Sí |
| `color` | `string` | regex hex opcional | No |

---

### 10. `testimonial` — Testimonio

**Título Studio:** Testimonios

| Campo | Tipo | Validación | Bilingüe |
|---|---|---|---|
| `patientName` | `string` | required | No |
| `patientOrigin` | `localeString` | opcional (ej: "Miami, USA") | Sí |
| `service` | `reference → service` | required | No |
| `rating` | `number` | min 1, max 5 | No |
| `quote` | `localeText` | required, max 300 | Sí |
| `photo` | `image` + `alt: string` | opcional | No |
| `videoUrl` | `url` | opcional | No |
| `isApproved` | `boolean` | **initialValue: false** | No |
| `publishedAt` | `datetime` | required | No |

**Regla de seguridad:** `isApproved: false` por defecto. El frontend solo renderiza testimonios aprobados. Solo Admin puede cambiar a `true`.

---

### 11. `faq` — Pregunta frecuente

**Título Studio:** Preguntas frecuentes

| Campo | Tipo | Validación | Bilingüe |
|---|---|---|---|
| `question` | `localeString` | required | Sí |
| `answer` | `localePortableText` | required | Sí |
| `category` | `string` enum | `general/servicios/viaje/pagos/post-tratamiento` | No |
| `service` | `reference → service` | opcional | No |
| `order` | `number` | para ordenar | No |
| `isActive` | `boolean` | initialValue: true | No |

---

### 12. `galleryItem` — Ítem de galería

**Título Studio:** Galería

| Campo | Tipo | Validación | Bilingüe |
|---|---|---|---|
| `title` | `localeString` | opcional | Sí |
| `image` | `image` + `alt: localeString` | required | No |
| `category` | `string` enum | `clinic/team/results/medellin/events` | No |
| `service` | `reference → service` | opcional | No |
| `isFeatured` | `boolean` | initialValue: false | No |
| `publishedAt` | `datetime` | required | No |

---

### 13. `video` — Video

**Título Studio:** Videos

| Campo | Tipo | Validación | Bilingüe |
|---|---|---|---|
| `title` | `localeString` | required | Sí |
| `description` | `localeText` | opcional | Sí |
| `platform` | `string` enum | `youtube/vimeo/instagram` | No |
| `videoId` | `string` | required | No |
| `thumbnail` | `image` + `alt: localeString` | opcional | No |
| `service` | `reference → service` | opcional | No |
| `category` | `string` enum | `testimonial/education/clinic-tour/results` | No |
| `isFeatured` | `boolean` | initialValue: false | No |
| `publishedAt` | `datetime` | required | No |

**Regla de seguridad:** Se almacena solo el `videoId`, no la URL de embed. El frontend construye la URL. Evita iframes arbitrarios.

---

### 14. `caseStudy` — Caso de éxito

**Título Studio:** Casos de éxito

| Campo | Tipo | Validación | Bilingüe |
|---|---|---|---|
| `title` | `localeString` | required | Sí |
| `slug` | `slug` | required, unique | No |
| `patientOrigin` | `localeString` | opcional | Sí |
| `service` | `reference → service` | required | No |
| `summary` | `localeText` | required, max 200 | Sí |
| `challenge` | `localePortableText` | required | Sí |
| `solution` | `localePortableText` | required | Sí |
| `results` | `localePortableText` | required | Sí |
| `beforeImages` | `array` de `image` + `alt: localeString` | min 1, max 4 | No |
| `afterImages` | `array` de `image` + `alt: localeString` | min 1, max 4 | No |
| `testimonial` | `reference → testimonial` | opcional | No |
| `teamMembers` | `array` de `reference → teamMember` | max 3 | No |
| `isApproved` | `boolean` | **initialValue: false** | No |
| `publishedAt` | `datetime` | required | No |
| `seo` | `seoObject` | required | Sí |

---

### 15. `teamMember` — Miembro del equipo

**Título Studio:** Equipo

| Campo | Tipo | Validación | Bilingüe |
|---|---|---|---|
| `name` | `string` | required | No |
| `slug` | `slug` | required, unique | No |
| `role` | `localeString` | required | Sí |
| `department` | `string` enum | `dental/aesthetic/medical/coordination/management` | No |
| `photo` | `image` + `alt: string` | required | No |
| `shortBio` | `localeText` | required, max 200 | Sí |
| `fullBio` | `localePortableText` | opcional | Sí |
| `specialties` | `array` de `localeString` | max 5 | Sí |
| `credentials` | `array` de `string` | max 8 | No |
| `linkedinUrl` | `url` | opcional | No |
| `order` | `number` | para ordenar | No |
| `isActive` | `boolean` | initialValue: true | No |
| `isFeatured` | `boolean` | initialValue: false | No |

---

### 16. `popup` — Popup / Modal promocional

**Título Studio:** Popups

| Campo | Tipo | Validación | Bilingüe |
|---|---|---|---|
| `name` | `string` | required (nombre interno) | No |
| `title` | `localeString` | required | Sí |
| `body` | `localePortableText` | required | Sí |
| `image` | `image` + `alt: localeString` | opcional | No |
| `cta` | `ctaObject` | opcional | Sí |
| `trigger` | `string` enum | `on-load/exit-intent/after-scroll/timed` | No |
| `delaySeconds` | `number` | solo si trigger=timed, min 3 | No |
| `showOnPages` | `array` de `string` | rutas donde mostrar (vacío = todas) | No |
| `startDate` | `datetime` | opcional | No |
| `endDate` | `datetime` | opcional | No |
| `isActive` | `boolean` | **initialValue: false** | No |
| `frequency` | `string` enum | `once/per-session/always` | No |

**Regla de seguridad:** `isActive: false` por defecto. Validación custom que impide más de 1 popup activo simultáneo.

---

## Mapa de referencias entre documentos

```
homePage ──→ serviceCategory   (featuredCategories, min 2 max 4)
homePage ──→ teamMember        (featuredMembers, min 2 max 8)

service  ──→ serviceCategory   (category, required)
service  ──→ faq               (faq[], opcional)
service  ──→ service           (relatedServices[], max 3)
service  ──→ testimonial       (testimonials[], max 4)

blogPost ──→ teamMember        (author, required)
blogPost ──→ category          (categories[], min 1)
blogPost ──→ blogPost          (relatedPosts[], max 3)
blogPost ──→ service           (relatedServices[], max 2)

testimonial ──→ service        (service, required)
faq         ──→ service        (service, opcional)
galleryItem ──→ service        (service, opcional)
video       ──→ service        (service, opcional)
caseStudy   ──→ service        (service, required)
caseStudy   ──→ testimonial    (testimonial, opcional)
caseStudy   ──→ teamMember     (teamMembers[], max 3)
```

---

## Tabla de seguridad editorial

| Nivel | Schema(s) | Medidas de protección |
|---|---|---|
| CRÍTICO | `siteSettings`, `trackingScripts` | Solo Admin vía RBAC. `__experimental_actions: ['update', 'publish']`. Sin "Crear nuevo". |
| ALTO | `navigation`, `homePage` | Solo Admin. `__experimental_actions: ['update', 'publish']`. |
| GATILLO EDITORIAL | `testimonial`, `caseStudy` | `isApproved: false` por defecto. Frontend filtra por `isApproved === true`. |
| ACCIDENTAL | `popup` | `isActive: false` por defecto. Máximo 1 activo (validación custom). |
| LEGAL | `page` (tipo `legal`) | Advertencia visible al editar en Studio. |
| SCRIPTS ARBITRARIOS | `trackingScripts.custom*` | Campos `text` con descripción "PRECAUCIÓN" explícita. Grupo visible solo Admin. |
| EMBEDS ARBITRARIOS | `video.videoId` | Solo ID del video. El frontend construye el URL embed. |
| COLORES DE MARCA | `siteSettings.brandColors` | Grupo `colors`, visible solo Admin, advertencia explícita. |

---

## Estructura de archivos resultante

```
src/sanity/schemaTypes/
├── index.ts                          ← registra todos los tipos
├── objects/
│   ├── seoObject.ts
│   ├── localeString.ts               ← localeString, localeStringShort, localeText, localePortableText
│   ├── ctaObject.ts
│   ├── navItem.ts
│   └── processStep.ts
├── singletons/
│   ├── siteSettings.ts               ← absorbe globalConfig
│   ├── navigation.ts
│   ├── homePage.ts
│   └── trackingScripts.ts
└── documents/
    ├── serviceCategory.ts
    ├── service.ts
    ├── page.ts
    ├── blogPost.ts
    ├── category.ts
    ├── testimonial.ts
    ├── faq.ts
    ├── galleryItem.ts
    ├── video.ts
    ├── caseStudy.ts
    ├── teamMember.ts
    └── popup.ts
```

---

## Notas de migración

1. **`globalConfig` actual** → sus campos se mapean a `siteSettings`. El query `globalConfigQuery` se actualiza a `siteSettingsQuery`.
2. **`sanity/schemas/`** → los archivos se mueven a `src/sanity/schemaTypes/` con la estructura anterior. La carpeta `sanity/` raíz se elimina para evitar confusión.
3. **Páginas de servicios hardcodeadas** → cada `page.tsx` pasa a consumir GROQ en lugar de `contentEs`/`contentEn` inline. Se mantiene el slug actual como `slug` del documento Sanity para no romper URLs.
4. **Studio structure** → se configura `sanity.config.ts` con `structure` builder para separar singletons de documentos y agrupar por sección editorial.
