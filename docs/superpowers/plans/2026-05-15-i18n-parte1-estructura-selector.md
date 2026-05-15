# i18n Parte 1 — Estructura de Rutas + Selector de Idioma

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Instalar next-intl, reestructurar `src/app/` a `src/app/[locale]/`, y agregar el selector `ES | EN` al Header (desktop + mobile), resultando en un sitio bilingüe funcional en localhost.

**Architecture:** Rutas con prefijo de locale (`/es/` y `/en/`). Español es el locale por defecto. Un segmento dinámico `[locale]` envuelve todas las páginas. Los componentes de layout (Header, Nav, Footer) leen traducciones desde `messages/es.json` y `messages/en.json`. El contenido de las secciones de página (Hero, Benefits, etc.) queda en español por ahora — eso es Parte 2+.

**Tech Stack:** Next.js 14.2 App Router, next-intl ^3.17, TypeScript 5, Tailwind CSS 3

---

## Mapa de Archivos

**Crear:**
- `i18n.ts` — config de servidor next-intl
- `middleware.ts` — detección de locale + redirect
- `src/navigation.ts` — exports de Link, usePathname, useRouter con locale
- `messages/es.json` — strings en español (nav + footer)
- `messages/en.json` — strings en inglés (nav + footer)
- `src/components/ui/LanguageSwitcher.tsx` — toggle ES | EN
- `src/app/[locale]/layout.tsx` — layout con html lang, Header, Footer, NextIntlClientProvider

**Modificar:**
- `next.config.mjs` — envolver con withNextIntl
- `src/app/layout.tsx` — simplificar a `return children`
- `src/components/layout/Header.tsx` — agregar LanguageSwitcher, useTranslations
- `src/components/layout/Nav.tsx` — usar @/navigation + useTranslations
- `src/components/layout/Footer.tsx` — async server component + getTranslations + @/navigation
- `src/components/ui/Button.tsx` — swap import Link
- `src/components/sections/ServicesPreview.tsx` — swap import Link
- `src/components/templates/ServiceCategoryTemplate.tsx` — swap import Link
- `src/components/templates/ServiceDetailTemplate.tsx` — swap import Link

**Mover (reestructura):**
- Todo `src/app/**/page.tsx` → bajo `src/app/[locale]/`

---

## Task 1: Instalar next-intl

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Instalar la dependencia**

```powershell
cd c:\Users\publi\Desktop\ALLURA
npm install next-intl@^3.17.0
```

Salida esperada: línea con `next-intl` añadido a `node_modules` y `package.json` actualizado.

- [ ] **Step 2: Verificar instalación**

```powershell
cat package.json | Select-String "next-intl"
```

Salida esperada: `"next-intl": "^3.17.0"` (o versión mayor dentro del rango).

- [ ] **Step 3: Commit**

```powershell
git add package.json package-lock.json
git commit -m "feat(i18n): install next-intl"
```

---

## Task 2: Crear archivos de configuración base

**Files:**
- Create: `i18n.ts`
- Create: `middleware.ts`
- Create: `src/navigation.ts`

- [ ] **Step 1: Crear `i18n.ts` en la raíz del proyecto**

```typescript
// i18n.ts
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

const locales = ["es", "en"] as const;

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 2: Crear `middleware.ts` en la raíz del proyecto**

```typescript
// middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 3: Crear `src/navigation.ts`**

```typescript
// src/navigation.ts
import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales: ["es", "en"] as const });
```

- [ ] **Step 4: Commit**

```powershell
git add i18n.ts middleware.ts src/navigation.ts
git commit -m "feat(i18n): add next-intl config, middleware, and navigation helpers"
```

---

## Task 3: Actualizar next.config.mjs

**Files:**
- Modify: `next.config.mjs`

- [ ] **Step 1: Reemplazar contenido de `next.config.mjs`**

```javascript
// next.config.mjs
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 2: Verificar que el archivo no tiene errores de sintaxis**

```powershell
node -e "import('./next.config.mjs').then(() => console.log('OK')).catch(e => console.error(e.message))"
```

Salida esperada: `OK`

- [ ] **Step 3: Commit**

```powershell
git add next.config.mjs
git commit -m "feat(i18n): wrap next config with next-intl plugin"
```

---

## Task 4: Crear archivos de mensajes

**Files:**
- Create: `messages/es.json`
- Create: `messages/en.json`

- [ ] **Step 1: Crear directorio `messages/`**

```powershell
New-Item -ItemType Directory -Force "messages"
```

- [ ] **Step 2: Crear `messages/es.json`**

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
    "brand": "Turismo médico de excelencia en Medellín. Odontología premium y medicina facial estética con la calidez de Colombia.",
    "location": "Medellín, Colombia",
    "whatsappAvail": "WhatsApp disponible",
    "copyright": "Todos los derechos reservados.",
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
  }
}
```

- [ ] **Step 3: Crear `messages/en.json`**

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
    "brand": "Excellence in medical tourism in Medellín. Premium dentistry and aesthetic facial medicine with the warmth of Colombia.",
    "location": "Medellín, Colombia",
    "whatsappAvail": "WhatsApp available",
    "copyright": "All rights reserved.",
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
  }
}
```

- [ ] **Step 4: Commit**

```powershell
git add messages/
git commit -m "feat(i18n): add ES and EN message files for nav and footer"
```

---

## Task 5: Crear componente LanguageSwitcher

**Files:**
- Create: `src/components/ui/LanguageSwitcher.tsx`

- [ ] **Step 1: Crear `src/components/ui/LanguageSwitcher.tsx`**

```tsx
// src/components/ui/LanguageSwitcher.tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggle = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1.5 font-body text-xs tracking-[0.15em] uppercase select-none">
      <button
        onClick={() => toggle("es")}
        aria-label="Cambiar a español"
        className={
          locale === "es"
            ? "text-brand-navy font-bold"
            : "text-brand-silver hover:text-brand-navy transition-colors duration-200"
        }
      >
        ES
      </button>
      <span className="text-brand-silver" aria-hidden="true">|</span>
      <button
        onClick={() => toggle("en")}
        aria-label="Switch to English"
        className={
          locale === "en"
            ? "text-brand-navy font-bold"
            : "text-brand-silver hover:text-brand-navy transition-colors duration-200"
        }
      >
        EN
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/ui/LanguageSwitcher.tsx
git commit -m "feat(i18n): add LanguageSwitcher component (ES | EN)"
```

---

## Task 6: Reestructurar src/app/ → src/app/[locale]/

**Files:**
- Move: todos los directorios/archivos de `src/app/` (excepto `layout.tsx`) a `src/app/[locale]/`

> ⚠️ Ejecutar los comandos en PowerShell desde la raíz del proyecto (`c:\Users\publi\Desktop\ALLURA`).

- [ ] **Step 1: Crear directorio `src/app/[locale]/`**

```powershell
New-Item -ItemType Directory -Force "src/app/[locale]"
```

- [ ] **Step 2: Mover `page.tsx` raíz**

```powershell
Move-Item "src/app/page.tsx" "src/app/[locale]/page.tsx"
```

- [ ] **Step 3: Mover directorios de páginas simples**

```powershell
Move-Item "src/app/nosotros"                 "src/app/[locale]/nosotros"
Move-Item "src/app/contacto"                 "src/app/[locale]/contacto"
Move-Item "src/app/equipo"                   "src/app/[locale]/equipo"
Move-Item "src/app/como-funciona"            "src/app/[locale]/como-funciona"
Move-Item "src/app/blog"                     "src/app/[locale]/blog"
Move-Item "src/app/politicas-de-privacidad"  "src/app/[locale]/politicas-de-privacidad"
Move-Item "src/app/accesibilidad"            "src/app/[locale]/accesibilidad"
```

- [ ] **Step 4: Mover árbol completo de servicios**

```powershell
Move-Item "src/app/servicios" "src/app/[locale]/servicios"
```

- [ ] **Step 5: Verificar estructura resultante**

```powershell
Get-ChildItem "src/app" -Recurse -Name | Select-Object -First 30
```

Salida esperada: listar `[locale]/page.tsx`, `[locale]/nosotros/page.tsx`, `[locale]/servicios/...` etc.

- [ ] **Step 6: Commit**

```powershell
git add src/app/
git commit -m "feat(i18n): restructure src/app to src/app/[locale] for next-intl routing"
```

---

## Task 7: Simplificar root layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Reemplazar `src/app/layout.tsx` con versión mínima**

El layout raíz delega `<html>` y `<body>` al layout `[locale]`. CSS se mueve al siguiente task.

```tsx
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/app/layout.tsx
git commit -m "feat(i18n): simplify root layout — locale layout provides html/body"
```

---

## Task 8: Crear src/app/[locale]/layout.tsx

**Files:**
- Create: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Crear `src/app/[locale]/layout.tsx`**

```tsx
// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "@/styles/globals.css";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEs = locale === "es";
  return {
    title: isEs
      ? "Allura Healthcare — Turismo Médico en Medellín"
      : "Allura Healthcare — Medical Tourism in Medellín",
    description: isEs
      ? "Allura es una marca colombiana de turismo médico en Medellín que integra tratamientos médicos, estéticos y odontológicos con la calidez y el disfrute de Colombia."
      : "Allura is a Colombian medical tourism brand in Medellín integrating premium dental and aesthetic treatments with the warmth of Colombia.",
    keywords: isEs
      ? ["turismo médico", "Medellín", "Colombia", "salud", "estética", "odontología"]
      : ["medical tourism", "Medellín", "Colombia", "health", "aesthetics", "dentistry"],
    openGraph: {
      title: "Allura Healthcare",
      description: isEs
        ? "Tu transformación comienza en Medellín"
        : "Your transformation starts in Medellín",
      locale: isEs ? "es_CO" : "en_US",
      type: "website",
    },
    alternates: {
      canonical: `https://allura.co/${locale}`,
      languages: {
        "es-CO": "https://allura.co/es",
        en: "https://allura.co/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```powershell
git add "src/app/[locale]/layout.tsx"
git commit -m "feat(i18n): create [locale]/layout.tsx with NextIntlClientProvider and metadata"
```

---

## Task 9: Actualizar Header.tsx

**Files:**
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Reemplazar contenido completo de `src/components/layout/Header.tsx`**

```tsx
// src/components/layout/Header.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { Nav } from "./Nav";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { cn } from "@/lib/utils";

const serviceItems = [
  { href: "/servicios/full-mouth-reconstruction", label: "Allura Full Mouth Reconstruction" },
  { href: "/servicios/smile-makeover",            label: "Allura Smile Makeover" },
  { href: "/servicios/aligners",                  label: "Allura Aligners" },
  { href: "/servicios/facial-harmony",            label: "Allura Facial Harmony" },
];

export function Header() {
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const t = useTranslations("nav");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mobileLinks = [
    { href: "/como-funciona", label: t("howItWorks") },
    { href: "/nosotros",      label: t("about") },
    { href: "/equipo",        label: t("team") },
    { href: "/contacto",      label: t("contact") },
    { href: "/blog",          label: t("blog") },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white shadow-sm py-3 border-b border-brand-light"
          : "bg-white/90 backdrop-blur-md py-5"
      )}
    >
      <div className="container-allura px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/allura-logo.png"
            alt="Allura Healthcare"
            width={160}
            height={45}
            className="h-10 w-auto object-contain"
            priority
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = "block";
            }}
          />
          <span
            className="hidden font-heading text-xl tracking-widest text-brand-navy"
            aria-hidden="true"
          >
            ALLURA
          </span>
        </Link>

        {/* Desktop nav */}
        <Nav dark={false} />

        {/* Language switcher — desktop only */}
        <div className="hidden md:flex items-center">
          <LanguageSwitcher />
        </div>

        {/* CTA — desktop only */}
        <Link
          href="/contacto"
          className="hidden md:inline-flex items-center px-5 py-2.5 text-sm font-body font-bold bg-brand-navy text-white rounded-full hover:bg-brand-blue transition-colors duration-200 flex-shrink-0"
        >
          {t("cta")}
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-brand-navy ml-4"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-brand-light px-6 py-5 flex flex-col gap-1">
          {mobileLinks.slice(0, 3).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-brand-navy/80 font-body text-base py-2.5 hover:text-brand-navy transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          {/* Servicios accordion */}
          <div>
            <button
              className="w-full flex items-center justify-between text-brand-navy/80 font-body text-base py-2.5 hover:text-brand-navy transition-colors"
              onClick={() => setServicesOpen(!servicesOpen)}
            >
              {t("services")}
              <ChevronDown
                size={16}
                className={cn("transition-transform duration-200", servicesOpen && "rotate-180")}
              />
            </button>
            {servicesOpen && (
              <div className="pl-4 pb-2 flex flex-col gap-0.5">
                {serviceItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-brand-navy/60 font-body text-sm py-2 hover:text-brand-navy transition-colors"
                    onClick={() => { setMenuOpen(false); setServicesOpen(false); }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {mobileLinks.slice(3).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-brand-navy/80 font-body text-base py-2.5 hover:text-brand-navy transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          {/* Language switcher — mobile */}
          <div className="py-2.5 border-t border-brand-light mt-1">
            <LanguageSwitcher />
          </div>

          <Link
            href="/contacto"
            className="mt-2 text-center px-5 py-3 text-sm font-body font-bold bg-brand-navy text-white rounded-full hover:bg-brand-blue transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {t("cta")}
          </Link>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/layout/Header.tsx
git commit -m "feat(i18n): update Header with LanguageSwitcher and useTranslations"
```

---

## Task 10: Actualizar Nav.tsx

**Files:**
- Modify: `src/components/layout/Nav.tsx`

- [ ] **Step 1: Reemplazar contenido completo de `src/components/layout/Nav.tsx`**

```tsx
// src/components/layout/Nav.tsx
"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/navigation";
import { cn } from "@/lib/utils";

const serviceItems = [
  { href: "/servicios/full-mouth-reconstruction", label: "Allura Full Mouth Reconstruction" },
  { href: "/servicios/smile-makeover",            label: "Allura Smile Makeover" },
  { href: "/servicios/aligners",                  label: "Allura Aligners" },
  { href: "/servicios/facial-harmony",            label: "Allura Facial Harmony" },
];

export function Nav({ dark = false }: { dark?: boolean }) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu  = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };

  const linkClass = cn(
    "font-body text-sm tracking-wide transition-colors duration-200",
    dark ? "text-white/80 hover:text-white" : "text-brand-navy hover:text-brand-blue"
  );
  const activeLinkClass = dark ? "text-white" : "text-brand-blue";

  const navLinks = [
    { href: "/como-funciona", label: t("howItWorks") },
    { href: "/nosotros",      label: t("about") },
    { href: "/equipo",        label: t("team") },
    { href: "/contacto",      label: t("contact") },
    { href: "/blog",          label: t("blog") },
  ];

  return (
    <nav className="hidden md:flex items-center gap-7">
      {navLinks.slice(0, 3).map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(linkClass, pathname === href && activeLinkClass)}
        >
          {label}
        </Link>
      ))}

      {/* Servicios dropdown */}
      <div
        className="relative"
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
      >
        <button
          className={cn(
            linkClass,
            "flex items-center gap-1",
            pathname.startsWith("/servicios") && activeLinkClass
          )}
        >
          {t("services")}
          <ChevronDown
            size={14}
            className={cn("transition-transform duration-200", open && "rotate-180")}
          />
        </button>

        {/* Puente invisible que cubre el hueco entre botón y panel */}
        <div className="absolute top-full left-0 right-0 h-3" />

        {/* Dropdown panel */}
        <div
          className={cn(
            "absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 transition-all duration-200 ease-in-out",
            open
              ? "opacity-100 visible pointer-events-auto translate-y-0"
              : "opacity-0 invisible pointer-events-none -translate-y-1"
          )}
        >
          <div className="mx-auto w-3 h-3 -mb-1.5 border-l border-t border-brand-light bg-white rotate-45 ml-[116px]" />
          <ul className="bg-white border border-brand-light rounded-xl shadow-xl py-2 min-w-[260px] overflow-hidden">
            {serviceItems.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block px-5 py-3 font-body text-sm text-brand-navy hover:bg-brand-light transition-colors duration-150"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {navLinks.slice(3).map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(linkClass, pathname === href && activeLinkClass)}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/layout/Nav.tsx
git commit -m "feat(i18n): update Nav with next-intl Link and useTranslations"
```

---

## Task 11: Actualizar Footer.tsx

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Reemplazar contenido completo de `src/components/layout/Footer.tsx`**

```tsx
// src/components/layout/Footer.tsx
import Image from "next/image";
import { Instagram, Facebook, Linkedin, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";

const WHATSAPP_URL =
  "https://wa.me/573001234567?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare";

const serviceLinks = [
  { href: "/servicios/full-mouth-reconstruction", label: "Full Mouth Reconstruction" },
  { href: "/servicios/smile-makeover",            label: "Smile Makeover" },
  { href: "/servicios/aligners",                  label: "Allura Aligners" },
  { href: "/servicios/facial-harmony",            label: "Facial Harmony" },
];

export async function Footer() {
  const t = await getTranslations("footer");

  const navLinks = [
    { href: "/",              label: t("navLinks.home") },
    { href: "/como-funciona", label: t("navLinks.howItWorks") },
    { href: "/servicios",     label: t("navLinks.services") },
    { href: "/nosotros",      label: t("navLinks.about") },
    { href: "/equipo",        label: t("navLinks.team") },
    { href: "/blog",          label: t("navLinks.blog") },
    { href: "/contacto",      label: t("navLinks.contact") },
  ];

  return (
    <footer className="bg-brand-navy text-brand-light">
      {/* WhatsApp CTA Banner */}
      <div className="border-b border-white/10">
        <div className="container-allura px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-heading text-lg text-white mb-1">{t("whatsappHeading")}</p>
            <p className="font-body text-sm text-brand-silver">{t("whatsappSub")}</p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-body font-bold text-sm hover:bg-[#22c55e] transition-colors flex-shrink-0"
          >
            <MessageCircle size={16} />
            {t("whatsappCta")}
          </a>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-allura section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4 bg-white rounded-xl px-4 py-2">
              <Image
                src="/images/allura-logo.png"
                alt="Allura Healthcare"
                width={150}
                height={42}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="font-body text-sm leading-relaxed text-brand-silver mb-6">
              {t("brand")}
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="text-brand-silver hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="Facebook" className="text-brand-silver hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-brand-silver hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-heading text-sm tracking-widest uppercase text-white mb-4">
              {t("navSection")}
            </p>
            <ul className="space-y-2">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-sm text-brand-silver hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="font-heading text-sm tracking-widest uppercase text-white mb-4">
              {t("servicesSection")}
            </p>
            <ul className="space-y-2">
              {serviceLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-sm text-brand-silver hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-heading text-sm tracking-widest uppercase text-white mb-4">
              {t("contactSection")}
            </p>
            <p className="font-body text-sm text-brand-silver mb-1">{t("location")}</p>
            <p className="font-body text-sm text-brand-silver mb-1">
              <a href="mailto:info@allura.co" className="hover:text-white transition-colors">
                info@allura.co
              </a>
            </p>
            <p className="font-body text-sm text-brand-silver">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                {t("whatsappAvail")}
              </a>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-blue/20 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-brand-silver">
            © {new Date().getFullYear()} Allura Healthcare. {t("copyright")}
          </p>
          <div className="flex gap-6">
            <Link
              href="/politicas-de-privacidad"
              className="font-body text-xs text-brand-silver hover:text-white transition-colors"
            >
              {t("legal.privacy")}
            </Link>
            <Link
              href="/accesibilidad"
              className="font-body text-xs text-brand-silver hover:text-white transition-colors"
            >
              {t("legal.accessibility")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/layout/Footer.tsx
git commit -m "feat(i18n): update Footer with getTranslations and locale-aware Link"
```

---

## Task 12: Actualizar imports de Link en componentes restantes

**Files:**
- Modify: `src/components/ui/Button.tsx`
- Modify: `src/components/sections/ServicesPreview.tsx`
- Modify: `src/components/templates/ServiceCategoryTemplate.tsx`
- Modify: `src/components/templates/ServiceDetailTemplate.tsx`

En cada archivo, reemplazar únicamente la línea de import:

```typescript
// ANTES
import Link from "next/link";

// DESPUÉS
import { Link } from "@/navigation";
```

- [ ] **Step 1: Actualizar `src/components/ui/Button.tsx`**

Reemplazar línea 1:
```typescript
import { Link } from "@/navigation";
```

- [ ] **Step 2: Actualizar `src/components/sections/ServicesPreview.tsx`**

Reemplazar línea 3:
```typescript
import { Link } from "@/navigation";
```

- [ ] **Step 3: Actualizar `src/components/templates/ServiceCategoryTemplate.tsx`**

Reemplazar línea 1:
```typescript
import { Link } from "@/navigation";
```

- [ ] **Step 4: Actualizar `src/components/templates/ServiceDetailTemplate.tsx`**

Reemplazar línea 1:
```typescript
import { Link } from "@/navigation";
```

- [ ] **Step 5: Commit**

```powershell
git add src/components/ui/Button.tsx src/components/sections/ServicesPreview.tsx src/components/templates/ServiceCategoryTemplate.tsx src/components/templates/ServiceDetailTemplate.tsx
git commit -m "feat(i18n): swap next/link for locale-aware Link in all remaining components"
```

---

## Task 13: Verificar en localhost

**Files:** ninguno (solo verificación)

- [ ] **Step 1: Iniciar el servidor de desarrollo**

```powershell
npm run dev
```

Esperar que aparezca: `Ready on http://localhost:3000`

- [ ] **Step 2: Verificar ruta raíz redirige a /es**

Abrir `http://localhost:3000` en el navegador.
Resultado esperado: redirige automáticamente a `http://localhost:3000/es`.

- [ ] **Step 3: Verificar ruta /en**

Navegar a `http://localhost:3000/en`.
Resultado esperado: la página home carga, el navbar muestra "How it works / About us / Services / Book your consultation", el footer muestra "Can we help you?" y "Chat on WhatsApp".

- [ ] **Step 4: Verificar selector de idioma funciona**

En `/es`, hacer clic en "EN".
Resultado esperado: la URL cambia a `/en` y el navbar se actualiza a inglés.

En `/en`, hacer clic en "ES".
Resultado esperado: la URL vuelve a `/es` y el navbar regresa a español.

- [ ] **Step 5: Verificar selector en mobile**

Reducir el navegador a ancho < 768px o usar DevTools device mode.
Abrir el menú hamburguesa.
Resultado esperado: se ve el selector `ES | EN` encima del botón "Agenda tu consulta".

- [ ] **Step 6: Verificar página interior en ambos locales**

Navegar a `http://localhost:3000/es/nosotros` y a `http://localhost:3000/en/nosotros`.
Resultado esperado: la página carga sin errores 404. El contenido de la página queda en español (correcto — la traducción de páginas es Parte 2).

- [ ] **Step 7: Confirmar consola sin errores**

Abrir DevTools → Console.
Resultado esperado: no hay errores rojos. Posibles warnings de hidratación son aceptables y no bloquean.

---

## Resultado esperado de Parte 1

Al completar todos los tasks:
- `http://localhost:3000` → redirige a `/es`
- `http://localhost:3000/es` → home en español con navbar en español
- `http://localhost:3000/en` → home con navbar en inglés, footer en inglés
- El selector `ES | EN` es visible en desktop (entre el nav y el botón CTA) y en mobile (en el menú hamburguesa)
- Todas las rutas internas (`/es/nosotros`, `/en/nosotros`, `/es/servicios/...`, etc.) responden sin 404
- El contenido de las secciones de página (Hero, Benefits, etc.) permanece en español — se traduce en Parte 2

---

*Parte 2 cubrirá: traducción de secciones home (Hero, Benefits, Services, About, Medellin, Team, Process, CTA) y páginas de servicios.*
