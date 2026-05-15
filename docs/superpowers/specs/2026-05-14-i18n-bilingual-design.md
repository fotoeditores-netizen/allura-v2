# Spec: Implementación Bilingüe (ES/EN) — Allura Healthcare

**Fecha:** 2026-05-14  
**Estado:** Aprobado por usuario  
**Alcance:** Internacionalización completa con next-intl, selector de idioma, traducción integral y SEO

---

## 1. Objetivo

Implementar soporte bilingüe español/inglés en el sitio Next.js 14 (App Router) de Allura Healthcare, con:
- Rutas con prefijo de locale: `/es/...` y `/en/...`
- Slugs traducidos en inglés (`/en/services`, `/en/about-us`, etc.)
- Selector de idioma `ES | EN` en el Navbar (desktop y mobile)
- Traducciones completas de todo el contenido con tono premium de marca
- SEO internacional con `hreflang` y `<html lang>`
- **Sin deploy a Vercel hasta aprobación visual en localhost**

---

## 2. Dependencias

```bash
npm install next-intl
```

Una sola dependencia nueva. Compatible con Next.js 14 App Router y React 18.

---

## 3. Arquitectura de Rutas

### 3.1 Estructura de carpetas

```
src/app/
├── layout.tsx                    ← root layout (sin Header/Footer, solo redirect)
├── [locale]/
│   ├── layout.tsx                ← layout con Header, Footer, NextIntlClientProvider
│   ├── page.tsx                  ← home
│   ├── servicios/                ← ES slugs
│   │   ├── page.tsx
│   │   ├── full-mouth-reconstruction/
│   │   │   ├── page.tsx
│   │   │   ├── implantes-unitarios/page.tsx
│   │   │   ├── implantes-all-on-x/page.tsx
│   │   │   ├── rehabilitacion-oral-completa/page.tsx
│   │   │   ├── protesis-fijas/page.tsx
│   │   │   ├── reemplazo-restauraciones/page.tsx
│   │   │   └── planificacion-digital-3d/page.tsx
│   │   ├── smile-makeover/
│   │   │   ├── page.tsx
│   │   │   ├── carillas-porcelana/page.tsx
│   │   │   ├── diseno-digital-sonrisa/page.tsx
│   │   │   ├── coronas-porcelana/page.tsx
│   │   │   ├── restauraciones-esteticas/page.tsx
│   │   │   └── blanqueamiento-dental/page.tsx
│   │   ├── aligners/
│   │   │   ├── page.tsx
│   │   │   ├── invisalign/page.tsx
│   │   │   ├── alineadores-transparentes/page.tsx
│   │   │   ├── escaneo-digital-3d/page.tsx
│   │   │   ├── planificacion-personalizada/page.tsx
│   │   │   └── seguimiento-remoto/page.tsx
│   │   └── facial-harmony/
│   │       ├── page.tsx
│   │       ├── evaluacion-facial/page.tsx
│   │       ├── toxina-botulinica/page.tsx
│   │       ├── bioestimuladores/page.tsx
│   │       ├── blefaroplastia/page.tsx
│   │       ├── rinoplastia/page.tsx
│   │       ├── lifting-facial/page.tsx
│   │       ├── mentoplastia/page.tsx
│   │       └── cirugia-maxilofacial/page.tsx
│   ├── nosotros/page.tsx
│   ├── equipo/page.tsx
│   ├── contacto/page.tsx
│   ├── como-funciona/page.tsx
│   ├── blog/page.tsx
│   ├── politicas-de-privacidad/page.tsx
│   └── accesibilidad/page.tsx
messages/
├── es.json
└── en.json
middleware.ts                     ← locale detection + redirect
i18n.ts                           ← next-intl config
```

### 3.2 Mapa de slugs traducidos (middleware rewrites)

El middleware traduce las URLs entrantes en inglés a los slugs internos (que se mantienen en español en las carpetas):

| URL pública EN | Carpeta interna |
|---|---|
| `/en` | `/[locale]` → locale=en |
| `/en/services` | `/[locale]/servicios` |
| `/en/services/full-mouth-reconstruction` | `/[locale]/servicios/full-mouth-reconstruction` |
| `/en/services/smile-makeover` | `/[locale]/servicios/smile-makeover` |
| `/en/services/aligners` | `/[locale]/servicios/aligners` |
| `/en/services/facial-harmony` | `/[locale]/servicios/facial-harmony` |
| `/en/about-us` | `/[locale]/nosotros` |
| `/en/team` | `/[locale]/equipo` |
| `/en/contact` | `/[locale]/contacto` |
| `/en/how-it-works` | `/[locale]/como-funciona` |
| `/en/blog` | `/[locale]/blog` |
| `/en/privacy-policy` | `/[locale]/politicas-de-privacidad` |
| `/en/accessibility` | `/[locale]/accesibilidad` |

> Las carpetas NO se renombran. Next.js reescribe internamente la URL en el middleware.

---

## 4. Archivos de Configuración

### 4.1 `i18n.ts`

```ts
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### 4.2 `middleware.ts`

```ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
  pathnames: {
    "/":                                                          { es: "/",                                                       en: "/" },
    "/servicios":                                                 { es: "/servicios",                                              en: "/services" },
    "/servicios/full-mouth-reconstruction":                       { es: "/servicios/full-mouth-reconstruction",                    en: "/services/full-mouth-reconstruction" },
    "/servicios/full-mouth-reconstruction/implantes-unitarios":   { es: "/servicios/full-mouth-reconstruction/implantes-unitarios", en: "/services/full-mouth-reconstruction/implantes-unitarios" },
    "/servicios/full-mouth-reconstruction/implantes-all-on-x":    { es: "/servicios/full-mouth-reconstruction/implantes-all-on-x",  en: "/services/full-mouth-reconstruction/implantes-all-on-x" },
    "/servicios/full-mouth-reconstruction/rehabilitacion-oral-completa": { es: "/servicios/full-mouth-reconstruction/rehabilitacion-oral-completa", en: "/services/full-mouth-reconstruction/rehabilitacion-oral-completa" },
    "/servicios/full-mouth-reconstruction/protesis-fijas":        { es: "/servicios/full-mouth-reconstruction/protesis-fijas",     en: "/services/full-mouth-reconstruction/protesis-fijas" },
    "/servicios/full-mouth-reconstruction/reemplazo-restauraciones": { es: "/servicios/full-mouth-reconstruction/reemplazo-restauraciones", en: "/services/full-mouth-reconstruction/reemplazo-restauraciones" },
    "/servicios/full-mouth-reconstruction/planificacion-digital-3d": { es: "/servicios/full-mouth-reconstruction/planificacion-digital-3d", en: "/services/full-mouth-reconstruction/planificacion-digital-3d" },
    "/servicios/smile-makeover":                                  { es: "/servicios/smile-makeover",                              en: "/services/smile-makeover" },
    "/servicios/smile-makeover/carillas-porcelana":               { es: "/servicios/smile-makeover/carillas-porcelana",           en: "/services/smile-makeover/carillas-porcelana" },
    "/servicios/smile-makeover/diseno-digital-sonrisa":           { es: "/servicios/smile-makeover/diseno-digital-sonrisa",       en: "/services/smile-makeover/diseno-digital-sonrisa" },
    "/servicios/smile-makeover/coronas-porcelana":                { es: "/servicios/smile-makeover/coronas-porcelana",            en: "/services/smile-makeover/coronas-porcelana" },
    "/servicios/smile-makeover/restauraciones-esteticas":         { es: "/servicios/smile-makeover/restauraciones-esteticas",     en: "/services/smile-makeover/restauraciones-esteticas" },
    "/servicios/smile-makeover/blanqueamiento-dental":            { es: "/servicios/smile-makeover/blanqueamiento-dental",        en: "/services/smile-makeover/blanqueamiento-dental" },
    "/servicios/aligners":                                        { es: "/servicios/aligners",                                    en: "/services/aligners" },
    "/servicios/aligners/invisalign":                             { es: "/servicios/aligners/invisalign",                         en: "/services/aligners/invisalign" },
    "/servicios/aligners/alineadores-transparentes":              { es: "/servicios/aligners/alineadores-transparentes",          en: "/services/aligners/alineadores-transparentes" },
    "/servicios/aligners/escaneo-digital-3d":                     { es: "/servicios/aligners/escaneo-digital-3d",                 en: "/services/aligners/escaneo-digital-3d" },
    "/servicios/aligners/planificacion-personalizada":            { es: "/servicios/aligners/planificacion-personalizada",        en: "/services/aligners/planificacion-personalizada" },
    "/servicios/aligners/seguimiento-remoto":                     { es: "/servicios/aligners/seguimiento-remoto",                 en: "/services/aligners/seguimiento-remoto" },
    "/servicios/facial-harmony":                                  { es: "/servicios/facial-harmony",                              en: "/services/facial-harmony" },
    "/servicios/facial-harmony/evaluacion-facial":                { es: "/servicios/facial-harmony/evaluacion-facial",            en: "/services/facial-harmony/evaluacion-facial" },
    "/servicios/facial-harmony/toxina-botulinica":                { es: "/servicios/facial-harmony/toxina-botulinica",            en: "/services/facial-harmony/toxina-botulinica" },
    "/servicios/facial-harmony/bioestimuladores":                 { es: "/servicios/facial-harmony/bioestimuladores",             en: "/services/facial-harmony/bioestimuladores" },
    "/servicios/facial-harmony/blefaroplastia":                   { es: "/servicios/facial-harmony/blefaroplastia",               en: "/services/facial-harmony/blefaroplastia" },
    "/servicios/facial-harmony/rinoplastia":                      { es: "/servicios/facial-harmony/rinoplastia",                  en: "/services/facial-harmony/rinoplastia" },
    "/servicios/facial-harmony/lifting-facial":                   { es: "/servicios/facial-harmony/lifting-facial",               en: "/services/facial-harmony/lifting-facial" },
    "/servicios/facial-harmony/mentoplastia":                     { es: "/servicios/facial-harmony/mentoplastia",                 en: "/services/facial-harmony/mentoplastia" },
    "/servicios/facial-harmony/cirugia-maxilofacial":             { es: "/servicios/facial-harmony/cirugia-maxilofacial",         en: "/services/facial-harmony/cirugia-maxilofacial" },
    "/nosotros":                                                  { es: "/nosotros",                                              en: "/about-us" },
    "/equipo":                                                    { es: "/equipo",                                                en: "/team" },
    "/contacto":                                                  { es: "/contacto",                                              en: "/contact" },
    "/como-funciona":                                             { es: "/como-funciona",                                         en: "/how-it-works" },
    "/blog":                                                      { es: "/blog",                                                  en: "/blog" },
    "/politicas-de-privacidad":                                   { es: "/politicas-de-privacidad",                               en: "/privacy-policy" },
    "/accesibilidad":                                             { es: "/accesibilidad",                                         en: "/accessibility" },
  },
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

### 4.3 `next.config.mjs` — actualización

```js
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: { domains: [] },
};

export default withNextIntl(nextConfig);
```

---

## 5. Archivos de Traducción

### 5.1 Estructura de `messages/es.json`

```json
{
  "nav": {
    "howItWorks": "Cómo funciona",
    "about": "Sobre nosotros",
    "team": "Equipo",
    "contact": "Contáctanos",
    "blog": "Blog",
    "services": "Servicios",
    "cta": "Agenda tu consulta"
  },
  "footer": {
    "whatsappHeading": "¿Podemos ayudarte?",
    "whatsappSub": "Nuestro equipo responde en menos de 24 horas.",
    "whatsappCta": "Hablar por WhatsApp",
    "navSection": "Navegación",
    "servicesSection": "Especialidades",
    "contactSection": "Contacto",
    "location": "Medellín, Colombia",
    "whatsappAvail": "WhatsApp disponible",
    "copyright": "Todos los derechos reservados.",
    "brand": "Turismo médico de excelencia en Medellín. Odontología premium y medicina facial estética con la calidez de Colombia.",
    "navLinks": {
      "home": "Inicio",
      "howItWorks": "Cómo funciona",
      "services": "Servicios",
      "about": "Sobre nosotros",
      "team": "Equipo",
      "blog": "Blog",
      "contact": "Contáctanos"
    },
    "legal": {
      "privacy": "Políticas de privacidad",
      "accessibility": "Declaración de accesibilidad"
    }
  },
  "hero": {
    "eyebrow": "Medellín, Colombia · Pacientes Internacionales",
    "headline": "Salud que inspira,\nviajes que transforman",
    "subtext": "Atención médica y odontológica premium en Medellín, con acompañamiento personalizado para pacientes internacionales.",
    "ctaPrimary": "Conoce nuestros servicios",
    "ctaSecondary": "¿Cómo funciona?"
  },
  "process": {
    "eyebrow": "Cómo funciona",
    "title": "Tu proceso con Allura: simple, seguro y humano",
    "cta": "Comienza tu consulta personalizada",
    "steps": [
      { "step": "PASO 01", "title": "Cuéntanos tu objetivo", "description": "Te guiaremos en los primeros pasos" },
      { "step": "PASO 02", "title": "Consulta virtual", "description": "Evaluación inicial con un especialista" },
      { "step": "PASO 03", "title": "Plan personalizado", "description": "Recibe un itinerario y plan detallado" },
      { "step": "PASO 04", "title": "Tratamiento experto", "description": "Atención de excelencia y seguimiento continuo" }
    ]
  }
}
```

### 5.2 Estructura de `messages/en.json` (equivalente)

```json
{
  "nav": {
    "howItWorks": "How it works",
    "about": "About us",
    "team": "Our team",
    "contact": "Contact us",
    "blog": "Blog",
    "services": "Services",
    "cta": "Book your consultation"
  },
  "footer": {
    "whatsappHeading": "Can we help you?",
    "whatsappSub": "Our team responds in less than 24 hours.",
    "whatsappCta": "Chat on WhatsApp",
    "navSection": "Navigation",
    "servicesSection": "Specialties",
    "contactSection": "Contact",
    "location": "Medellín, Colombia",
    "whatsappAvail": "WhatsApp available",
    "copyright": "All rights reserved.",
    "brand": "Excellence in medical tourism in Medellín. Premium dentistry and aesthetic facial medicine with the warmth of Colombia.",
    "navLinks": {
      "home": "Home",
      "howItWorks": "How it works",
      "services": "Services",
      "about": "About us",
      "team": "Our team",
      "blog": "Blog",
      "contact": "Contact us"
    },
    "legal": {
      "privacy": "Privacy policy",
      "accessibility": "Accessibility statement"
    }
  },
  "hero": {
    "eyebrow": "Medellín, Colombia · International Patients",
    "headline": "Health that inspires,\njourneys that transform",
    "subtext": "Premium dental and medical care in Medellín, with personalized support for international patients.",
    "ctaPrimary": "Explore our services",
    "ctaSecondary": "How does it work?"
  },
  "process": {
    "eyebrow": "How it works",
    "title": "Your journey with Allura: simple, safe, and human",
    "cta": "Start your personalized consultation",
    "steps": [
      { "step": "STEP 01", "title": "Tell us your goal", "description": "We'll guide you through the first steps" },
      { "step": "STEP 02", "title": "Virtual consultation", "description": "Initial evaluation with a specialist" },
      { "step": "STEP 03", "title": "Personalized plan", "description": "Receive a detailed itinerary and plan" },
      { "step": "STEP 04", "title": "Expert treatment", "description": "Excellence in care and continuous follow-up" }
    ]
  }
}
```

---

## 6. Componente LanguageSwitcher

```tsx
// src/components/ui/LanguageSwitcher.tsx
"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next-intl/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggle = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1.5 font-body text-xs tracking-[0.15em] uppercase select-none">
      <button
        onClick={() => toggle("es")}
        className={locale === "es"
          ? "text-brand-navy font-bold"
          : "text-brand-silver hover:text-brand-navy transition-colors duration-200"}
      >
        ES
      </button>
      <span className="text-brand-silver">|</span>
      <button
        onClick={() => toggle("en")}
        className={locale === "en"
          ? "text-brand-navy font-bold"
          : "text-brand-silver hover:text-brand-navy transition-colors duration-200"}
      >
        EN
      </button>
    </div>
  );
}
```

**Posición en Header (desktop):** entre el `<Nav>` y el botón CTA.  
**Posición en Header (mobile):** última fila del menú hamburguesa, antes del botón CTA mobile.

---

## 7. SEO

### 7.1 Layout `[locale]`

```tsx
export async function generateMetadata({ params: { locale } }) {
  return {
    title: locale === "es"
      ? "Allura Healthcare — Turismo Médico en Medellín"
      : "Allura Healthcare — Medical Tourism in Medellín",
    description: locale === "es"
      ? "Allura es una marca colombiana de turismo médico en Medellín..."
      : "Allura is a Colombian medical tourism brand in Medellín...",
    alternates: {
      canonical: `https://allura.co/${locale}`,
      languages: {
        "es-CO": "https://allura.co/es",
        "en":    "https://allura.co/en",
      },
    },
    openGraph: {
      locale: locale === "es" ? "es_CO" : "en_US",
    },
  };
}
```

### 7.2 `<html lang>`

```tsx
<html lang={locale}>
```

Se pasa `params.locale` desde el page → layout automáticamente con next-intl.

---

## 8. Restricciones y Reglas

1. **Sin deploy a Vercel** hasta aprobación visual en `localhost:3000`.
2. Las carpetas de páginas **no se renombran** — los slugs EN son rewrites del middleware.
3. El idioma por defecto es **español (`es`)** — un visitante a `/` es redirigido a `/es`.
4. El locale activo se detecta por URL, no por `Accept-Language` (para consistencia).
5. No se rompen las rutas existentes durante la migración — cada paso es atómico.

---

## 9. Orden de implementación (para el plan)

1. Instalar `next-intl`
2. Crear `i18n.ts` y `middleware.ts`
3. Actualizar `next.config.mjs`
4. Crear archivos `messages/es.json` y `messages/en.json` con TODOS los textos
5. Mover `/app/**` a `/app/[locale]/**` (reestructura de carpetas)
6. Actualizar `layout.tsx` raíz y `[locale]/layout.tsx`
7. Migrar componentes de layout: `Header`, `Nav`, `Footer`, `LanguageSwitcher`
8. Migrar secciones de la home: Hero, Process, Benefits, Services, Medellin, Team, CTA
9. Migrar páginas individuales (servicios, nosotros, equipo, contacto, blog, legales)
10. Verificar en `npm run dev` — todas las rutas ES y EN sin 404s
11. Revisar layout visual en ambos idiomas (textos más largos en EN no deben romper diseño)
12. Validar `<html lang>`, `hreflang`, metadata
