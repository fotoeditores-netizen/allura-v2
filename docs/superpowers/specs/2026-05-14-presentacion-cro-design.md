# Spec: Presentación CRO — Antes/Después Allura Healthcare

**Fecha:** 2026-05-14  
**Estado:** Aprobado por el usuario  
**Archivo de salida:** `presentacion-home.html` (raíz del proyecto)

---

## Objetivo

Crear una Landing Page de Caso de Éxito (`presentacion-home.html`) que compare de forma interactiva el sitio original de Allura Healthcare con el nuevo rediseño, demostrando el razonamiento CRO detrás de cada cambio. Debe poder compartirse con el cliente vía URL pública de Vercel.

---

## URLs a Comparar

| | URL |
|---|---|
| **Antes (original)** | `https://www.allurahealthcare.com/` |
| **Después (nuevo)** | `https://allura-healthcare.vercel.app/` |

---

## Arquitectura de Archivos

```
/presentacion-home.html       ← archivo principal (HTML autocontenido)
/screenshots/
  original-desktop.png        ← captura Playwright 1440×900
  original-mobile.png         ← captura Playwright 390×844
  nuevo-desktop.png
  nuevo-mobile.png
  original-hero.png           ← crop del hero section
  nuevo-hero.png
  original-servicios.png      ← crop de sección servicios
  nuevo-servicios.png
  original-equipo.png         ← crop de sección equipo (o ausencia)
  nuevo-equipo.png
  original-cta.png            ← crop de botones/CTAs
  nuevo-cta.png
```

Todo en un único HTML autocontenido: `<style>` y `<script>` inline. Sin frameworks ni bundler. Compatible con Vercel static hosting sin build step.

---

## Brandbook Allura (variables CSS)

```css
--color-primary:   #051c33;   /* Azul oscuro principal */
--color-accent:    #8b9fb3;   /* Azul claro */
--color-silver:    #abacae;   /* Gris plateado */
--color-bg:        #eaeeef;   /* Fondo claro */
--color-white:     #ffffff;
--font-title:      'Qalinza', serif;
--font-body:       'Nexa', 'Montserrat', sans-serif;
```

Tipografías:
- `Qalinza`: los archivos `.woff2` no existen físicamente en el proyecto. Para el HTML estático se usa **"Cormorant Garamond"** de Google Fonts como equivalente visual (serif elegante, feel similar). Si el usuario provee los archivos `.woff2` en el futuro, se puede reemplazar con un `@font-face`.
- `Nexa`: igual — se usa **"Montserrat"** de Google Fonts como equivalente funcional (sans-serif clean, legible).

---

## Stack Técnico

- **HTML5** semántico
- **CSS** con custom properties, Grid y Flexbox
- **Vanilla JS**:
  - Drag-slider: `mousedown/mousemove/mouseup` + `touchstart/touchmove/touchend`
  - Scroll animations: `IntersectionObserver` con clase `.visible`
  - Sin dependencias externas excepto Google Fonts

---

## Capturas de Pantalla (Playwright)

Tarea previa a la creación del HTML: ejecutar Playwright para capturar ambas URLs en dos viewports.

**Script de capturas:**
```js
// playwright-screenshots.js
const { chromium } = require('playwright');

const sites = [
  { name: 'original', url: 'https://www.allurahealthcare.com/' },
  { name: 'nuevo',    url: 'https://allura-healthcare.vercel.app/' },
];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile',  width: 390,  height: 844 },
];

// Capturas full-page + crops de secciones clave:
// hero, servicios, equipo, cta
```

Las capturas se guardan en `/screenshots/` y se referencian con paths relativos desde el HTML.

---

## Estructura de Secciones

### S1 — Portada / Hero
- Fondo: `#051c33`
- Título H1 (Qalinza, blanco): *"La Evolución de Allura: De Web Informativa a Máquina de Conversión"*
- Subtítulo (Nexa, `#8b9fb3`): *"Cómo transformamos la presencia digital de una clínica de turismo médico en un embudo de conversión de alta performance"*
- Badge animado: *"Caso de Éxito · CRO 2025"*
- Scroll indicator: flecha pulsante con `animation: bounce`

### S2 — Atracción Emocional (Hero Banner)
- **Componente principal:** Drag-slider (Opción A aprobada)
  - Imagen izquierda: `screenshots/original-hero.png`
  - Imagen derecha: `screenshots/nuevo-hero.png`
  - Divisor arrastrable con ícono ↔
- **Panel de análisis** (debajo del slider):
  - Copy anterior tachado en rojo: *"Bienvenidos a Allura..."*
  - Copy nuevo destacado en verde: *"Salud que inspira, viajes que transforman"*
  - Insight CRO: conecta con el paciente internacional, posicionamiento premium, "quiet luxury"

### S3 — Claridad en la Oferta (Servicios)
- **Drag-slider:** `original-servicios.png` vs `nuevo-servicios.png`
- **Cards de análisis** (grid 2 col):
  - Columna Antes: términos eliminados tachados (`color: #ef4444`) — *"Terapia plástica periodontal"*, *"Medicina general"*, etc.
  - Columna Después: 4 rutas de transformación con íconos — Full Mouth Reconstruction, Smile Makeover, Aligners, Facial Harmony
- Métrica destacada: *"+34% claridad percibida en la oferta"*

### S4 — Autoridad y Confianza (Equipo)
- **Componente:** Side-by-side estático (dos columnas)
  - Izquierda: `original-equipo.png` con overlay *"Sin presentación del equipo"*
  - Derecha: `nuevo-equipo.png` con perfiles reales
- **Texto de análisis:** Explicación del gatillo mental de autoridad en turismo médico
- **Quote destacado** (blockquote estilizado): *"El paciente internacional decide confiar en una clínica antes de contactarla. Ver los rostros y credenciales del equipo reduce la fricción de la primera consulta."*
- Lista de médicos: Dra. Johanna Jaramillo, Dra. Daniela Alzate, Dr. Sebastián Muñoz, Dr. Santiago Henao, Dr. Iván Darío Jiménez, Dr. Alejandro Cifuentes

### S5 — Optimización de Conversión (CTAs y Fricción)
- **Componente:** Side-by-side estático
  - Izquierda: `original-cta.png` — botón invasivo *"¡Vamos a chatear!"* (verde brillante flotante)
  - Derecha: `nuevo-cta.png` — CTAs ghost *"Hablar por WhatsApp"* + *"Quiero saber más"*
- **Análisis visual de fricción:**
  - Antes: alta interrupción, baja intención del usuario
  - Después: baja fricción, acción contextual, jerarquía clara
- Tabla comparativa: Fricciones eliminadas vs Conversiones habilitadas

### S6 — Cierre / CTA Final
- Fondo: `#051c33`
- 3 métricas en tarjetas:
  1. *"5 secciones de conversión optimizadas"*
  2. *"0 fricciones innecesarias"*
  3. *"40 páginas SEO-ready"*
- Botón primario (ghost, borde blanco): *"Ver el nuevo sitio →"* → `https://allura-healthcare.vercel.app/`
- Texto de cierre (Nexa, `#8b9fb3`): *"Allura Healthcare · Medellín, Colombia"*

---

## Comportamiento Responsivo

| Breakpoint | Slider | Análisis |
|---|---|---|
| Desktop (>1024px) | Full-width, handle centrado | Columnas 60/40 |
| Tablet (768–1024px) | Full-width | Columnas 50/50 |
| Mobile (<768px) | Full-width, operables con touch | Cards verticales apiladas |

---

## Animaciones

| Elemento | Animación |
|---|---|
| Secciones al hacer scroll | `opacity: 0 → 1` + `translateY(30px → 0)` via `IntersectionObserver` |
| Badge portada | `fadeIn` con delay |
| Scroll indicator | `bounce` infinito |
| Slider handle | `scale(1.1)` en hover |
| Cards métricas S6 | `stagger` de 150ms entre cada una |

---

## Despliegue en Vercel

1. Verificar funcionamiento local abriendo `presentacion-home.html` directamente en el navegador
2. Confirmar responsividad en DevTools (mobile 390px)
3. Ejecutar `vercel --prod` desde la raíz del proyecto
4. Entregar URL pública al usuario

---

## Criterios de Éxito

- [ ] Slider de arrastre funciona en desktop (mouse) y móvil (touch)
- [ ] Todas las capturas de Playwright cargadas correctamente (sin broken images)
- [ ] 100% responsivo en 390px
- [ ] Tipografías Qalinza y Nexa/Montserrat renderizando correctamente
- [ ] Paleta de colores del Brandbook aplicada con fidelidad
- [ ] URL de Vercel accesible públicamente
- [ ] Tiempo de carga < 3s (imágenes optimizadas o con `loading="lazy"`)
