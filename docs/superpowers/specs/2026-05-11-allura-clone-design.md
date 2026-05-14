# Allura Healthcare — Clone Completo: Diseño y Especificaciones

**Fecha:** 2026-05-11  
**Estado:** Aprobado  
**Framework:** Next.js 14 App Router + TypeScript + Tailwind CSS

---

## 1. Objetivo

Construir una copia funcional del sitio https://www.allurahealthcare.com con **cero errores 404**, mega-menú fluido, contenido alineado exclusivamente con odontología premium y medicina facial estética, y estructura lista para que el usuario solo reemplace imágenes y textos finales.

---

## 2. Estructura de Páginas (32 páginas totales)

### 2.1 Páginas Principales

| Ruta | Estado | Descripción |
|------|--------|-------------|
| `/` | Existe — mantener | Home con HeroSection, BenefitsSection, ServicesPreview, AboutTeaser, CTABanner |
| `/como-funciona` | **CREAR** | Proceso de 4 pasos del servicio Allura |
| `/nosotros` | Existe — revisar | Misión, pilares, por qué Allura |
| `/equipo` | **CREAR** | 6 especialistas con nombre, título y especialidad |
| `/contacto` | Existe — revisar | Formulario de contacto |
| `/blog` | **CREAR** | Listado vacío con estructura lista |
| `/servicios` | **REESCRIBIR** | Reemplazar medicina/estética genérica con las 4 categorías reales |

### 2.2 Páginas de Categoría de Servicio (CREAR)

| Ruta | Categoría |
|------|-----------|
| `/servicios/full-mouth-reconstruction` | Allura Full Mouth Reconstruction™ |
| `/servicios/smile-makeover` | Allura Smile Makeover™ |
| `/servicios/aligners` | Allura Aligners™ |
| `/servicios/facial-harmony` | Allura Facial Harmony™ |

### 2.3 Sub-servicios Full Mouth Reconstruction (CREAR — 6 páginas)

| Slug | Nombre |
|------|--------|
| `implantes-unitarios` | Implantes Unitarios y Múltiples |
| `implantes-all-on-x` | Implantes All-on-X |
| `rehabilitacion-oral-completa` | Rehabilitación Oral Completa |
| `protesis-fijas` | Prótesis Fijas sobre Implantes |
| `reemplazo-restauraciones` | Reemplazo de Restauraciones Fallidas |
| `planificacion-digital-3d` | Planificación Digital 3D |

### 2.4 Sub-servicios Smile Makeover (CREAR — 5 páginas)

| Slug | Nombre |
|------|--------|
| `carillas-porcelana` | Carillas en Porcelana |
| `diseno-digital-sonrisa` | Diseño Digital de Sonrisa |
| `coronas-porcelana` | Coronas en Porcelana |
| `restauraciones-esteticas` | Restauraciones Estéticas Avanzadas |
| `blanqueamiento-dental` | Blanqueamiento Dental |

### 2.5 Sub-servicios Aligners (CREAR — 5 páginas)

| Slug | Nombre |
|------|--------|
| `invisalign` | Invisalign |
| `alineadores-transparentes` | Alineadores Transparentes |
| `escaneo-digital-3d` | Escaneo Digital 3D |
| `planificacion-personalizada` | Planificación Personalizada |
| `seguimiento-remoto` | Seguimiento Remoto Internacional |

### 2.6 Sub-servicios Facial Harmony (CREAR — 8 páginas)

| Slug | Nombre |
|------|--------|
| `evaluacion-facial` | Evaluación Facial Estructural |
| `toxina-botulinica` | Toxina Botulínica y Rellenos Dérmicos |
| `bioestimuladores` | Bioestimuladores y Rejuvenecimiento |
| `blefaroplastia` | Blefaroplastia |
| `rinoplastia` | Rinoplastia |
| `lifting-facial` | Lifting Facial |
| `mentoplastia` | Mentoplastia |
| `cirugia-maxilofacial` | Coordinación con Cirugía Maxilofacial |

---

## 3. Arquitectura de Componentes

### 3.1 Componentes Nuevos

**`ServiceDetailTemplate`** (`src/components/templates/ServiceDetailTemplate.tsx`)  
Componente reutilizable para las 24 páginas de sub-servicio. Props:
```typescript
{
  category: string            // "Allura Full Mouth Reconstruction™"
  categorySlug: string        // "full-mouth-reconstruction"
  title: string               // "Implantes Unitarios y Múltiples"
  description: string         // Párrafo introductorio
  benefits: string[]          // Lista de beneficios
  steps: { title: string; description: string }[]   // Proceso
  candidates: string[]        // Candidatos ideales
  timeline: string            // Duración del tratamiento
  specialty: "odontologia" | "facial"  // Determina el color/icono
}
```

**`ServiceCategoryTemplate`** (`src/components/templates/ServiceCategoryTemplate.tsx`)  
Para las 4 páginas de categoría. Props:
```typescript
{
  title: string               // "Allura Full Mouth Reconstruction™"
  subtitle: string
  description: string
  subServices: { slug: string; name: string; description: string }[]
}
```

**`MegaMenu`** (`src/components/layout/MegaMenu.tsx`)  
Mega-menú de 4 columnas con transiciones CSS suaves:
- Reemplaza el dropdown actual en `Nav.tsx`
- CSS: `opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`
- Delay de 150ms en `pointer-events` para permitir clic sin que desaparezca

### 3.2 Componentes Existentes a Modificar

- **`Nav.tsx`**: Integrar `MegaMenu` en lugar del dropdown simple; añadir los 4 grupos con sub-items
- **`src/app/servicios/page.tsx`**: Reescribir con las 4 categorías reales (eliminar medicina/estética genérica)

---

## 4. Estructura del Mega-menú

```
Servicios ▾
┌─────────────────────────────────────────────────────────────────┐
│ FULL MOUTH        SMILE MAKEOVER   ALIGNERS         FACIAL      │
│ RECONSTRUCTION                                      HARMONY     │
│ ─────────────     ─────────────    ─────────────    ──────────  │
│ • Implantes       • Carillas        • Invisalign     • Evalua.  │
│ • All-on-X        • Diseño Digital  • Alineadores    • Toxina   │
│ • Rehabilit.      • Coronas         • Escaneo 3D     • Biostim. │
│ • Prótesis        • Restaurac.      • Planificación  • Bléfaro. │
│ • Reemplazo       • Blanqueo        • Seguimiento    • Rinoplas.│
│ • Planif. 3D                                         • Lifting  │
│                                                      • Mentopla.│
│                                                      • Maxilof. │
└─────────────────────────────────────────────────────────────────┘
```

CSS del mega-menú:
- `group-hover:opacity-100 group-hover:visible` (no `hidden/block`)
- `transition-all duration-200 ease-in-out`
- `pointer-events-none group-hover:pointer-events-auto`

---

## 5. Correcciones de Contenido

### Eliminar completamente:
- "Cirugía reconstructiva", "Tratamientos oncológicos", "Medicina preventiva", "Cirugía bariátrica"
- La categoría "Medicina" genérica en ServiciosPage
- La categoría "Estética" genérica no relacionada con facial

### Especialidades válidas de Allura:
1. **Odontología Premium**: Full Mouth Reconstruction, Smile Makeover, Aligners
2. **Medicina Facial Estética**: Facial Harmony (toxina botulínica, rellenos, biostimuladores, cirugía facial menor)

### Datos reales del equipo (escaneados del sitio real):
- Dra. Johanna Jaramillo — Odontóloga, Especialista en Prótesis Periodontal
- Dra. Daniela Alzate — Odontóloga, Ortodoncista y MSc.
- Dr. Sebastián Muñoz — Odontólogo MSc, Especialista en Prótesis Periodontal
- Dr. Santiago Henao — Odontólogo y Ortodoncista (Diamond Top Doctor Invisalign)
- Dr. Iván Darío Jiménez — Odontólogo, Ortodoncista y MSc.
- Dr. Alejandro Cifuentes — Odontólogo, Especialista en Rehabilitación Oral

---

## 6. Proceso Cómo Funciona (datos reales)

1. **Comparte tus necesidades** — Formulario con tus objetivos; el equipo te contacta con orientación personalizada
2. **Consulta virtual con especialistas** — Reunión segura con médicos certificados para diagnóstico preliminar y opciones de tratamiento
3. **Plan médico + experiencia de viaje** — Planificación integral: citas, alojamiento, actividades opcionales en Medellín
4. **Procedimiento y acompañamiento total** — Coordinación de llegada, procedimientos, recuperación y seguimiento post-retorno

---

## 7. Hero Button "Conoce nuestros servicios"

- **URL actual**: `/servicios` ✅ (correcto — apunta a la página de servicios)
- **Acción**: Mantener el href, pero reescribir `/servicios/page.tsx` con las 4 categorías reales
- El botón ya funciona correctamente; el problema es el destino (contenido erróneo)

---

## 8. Plantilla Base para Sub-servicios

Cada página de sub-servicio tendrá:
1. **Hero** con breadcrumb (Servicios › Categoría › Sub-servicio), título y descripción
2. **Beneficios** — lista con bullets
3. **Proceso** — pasos numerados
4. **Candidatos ideales** — lista
5. **Timeline** — duración y fases del tratamiento
6. **Por qué Allura** — diferenciadores
7. **CTA** — Agendar cita (WhatsApp) + link al CTABanner

---

## 9. Verificación Final

Antes de marcar como completo:
- [ ] Ejecutar `npm run build` y verificar que no hay errores de TypeScript
- [ ] Recorrer todos los links del mega-menú manualmente en dev server
- [ ] Verificar que `/servicios` no menciona medicina general ni oncología
- [ ] Verificar que el dropdown del mega-menú no desaparece abruptamente

---

## 10. Archivos a Crear/Modificar

### Nuevos:
```
src/components/templates/ServiceDetailTemplate.tsx
src/components/templates/ServiceCategoryTemplate.tsx
src/components/layout/MegaMenu.tsx
src/app/como-funciona/page.tsx
src/app/equipo/page.tsx
src/app/blog/page.tsx
src/app/servicios/full-mouth-reconstruction/page.tsx
src/app/servicios/smile-makeover/page.tsx
src/app/servicios/aligners/page.tsx
src/app/servicios/facial-harmony/page.tsx
src/app/servicios/full-mouth-reconstruction/implantes-unitarios/page.tsx
src/app/servicios/full-mouth-reconstruction/implantes-all-on-x/page.tsx
src/app/servicios/full-mouth-reconstruction/rehabilitacion-oral-completa/page.tsx
src/app/servicios/full-mouth-reconstruction/protesis-fijas/page.tsx
src/app/servicios/full-mouth-reconstruction/reemplazo-restauraciones/page.tsx
src/app/servicios/full-mouth-reconstruction/planificacion-digital-3d/page.tsx
src/app/servicios/smile-makeover/carillas-porcelana/page.tsx
src/app/servicios/smile-makeover/diseno-digital-sonrisa/page.tsx
src/app/servicios/smile-makeover/coronas-porcelana/page.tsx
src/app/servicios/smile-makeover/restauraciones-esteticas/page.tsx
src/app/servicios/smile-makeover/blanqueamiento-dental/page.tsx
src/app/servicios/aligners/invisalign/page.tsx
src/app/servicios/aligners/alineadores-transparentes/page.tsx
src/app/servicios/aligners/escaneo-digital-3d/page.tsx
src/app/servicios/aligners/planificacion-personalizada/page.tsx
src/app/servicios/aligners/seguimiento-remoto/page.tsx
src/app/servicios/facial-harmony/evaluacion-facial/page.tsx
src/app/servicios/facial-harmony/toxina-botulinica/page.tsx
src/app/servicios/facial-harmony/bioestimuladores/page.tsx
src/app/servicios/facial-harmony/blefaroplastia/page.tsx
src/app/servicios/facial-harmony/rinoplastia/page.tsx
src/app/servicios/facial-harmony/lifting-facial/page.tsx
src/app/servicios/facial-harmony/mentoplastia/page.tsx
src/app/servicios/facial-harmony/cirugia-maxilofacial/page.tsx
```

### Modificar:
```
src/components/layout/Nav.tsx        → integrar MegaMenu
src/app/servicios/page.tsx           → reescribir con 4 categorías reales
src/app/nosotros/page.tsx            → verificar contenido
src/app/contacto/page.tsx            → verificar contenido
```
