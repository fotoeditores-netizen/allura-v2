import Image from "next/image";
import { Instagram, Facebook, Linkedin, MessageCircle } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { QualitySlider } from "./QualitySlider";
import { getSiteSettings } from "@/lib/getSiteSettings";

const WHATSAPP_FALLBACK =
  "https://wa.me/17862087572?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare";
const EMAIL_FALLBACK = "contact@allurahealthcare.com";

type LinkItem = { label: string; href: string }
type LogoItem = { src: string; alt: string }

function parseJson<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback
  try { return JSON.parse(val) as T } catch { return fallback }
}

const DEFAULT_NAV_ES: LinkItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Cómo funciona', href: '/como-funciona' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Sobre nosotros', href: '/nosotros' },
  { label: 'Equipo', href: '/equipo' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contáctanos', href: '/contacto' },
]

const DEFAULT_NAV_EN: LinkItem[] = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/como-funciona' },
  { label: 'Services', href: '/servicios' },
  { label: 'About Us', href: '/nosotros' },
  { label: 'Team', href: '/equipo' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contacto' },
]

const DEFAULT_SERVICES: LinkItem[] = [
  { label: 'Full Mouth Reconstruction', href: '/servicios/full-mouth-reconstruction' },
  { label: 'Smile Makeover', href: '/servicios/smile-makeover' },
  { label: 'Allura Aligners', href: '/servicios/aligners' },
  { label: 'Facial Harmony', href: '/servicios/facial-harmony' },
]

const DEFAULT_PARTNERS: LogoItem[] = [
  { src: '/images/imagenes_web/logo-muvon-travel.png', alt: 'Muvon Travel' },
  { src: '/images/imagenes_web/logo-maskart.png', alt: 'Maskart' },
  { src: '/images/imagenes_web/logo-odontologia-de-precision.png', alt: 'Odontología de Precisión' },
  { src: '/images/imagenes_web/logo-orto-rio.png', alt: 'Orto Río' },
]

export async function Footer() {
  const [t, config, locale] = await Promise.all([
    getTranslations("footer"),
    getSiteSettings(),
    getLocale(),
  ]);

  const l = (locale === 'en' ? 'en' : 'es') as 'es' | 'en'

  const whatsappUrl = config?.whatsappNumber
    ? `https://wa.me/${config.whatsappNumber.replace(/^\+/, '')}`
    : WHATSAPP_FALLBACK;
  const email = config?.contactEmail ?? EMAIL_FALLBACK;
  const instagram = config?.socialInstagram;
  const facebook = config?.socialFacebook;
  const linkedin = config?.socialLinkedin;

  // CMS-driven content with fallbacks
  const slogan = config?.footerSlogan?.[l] || (l === 'en' ? 'Health that inspires, Journeys that transform' : 'Salud que inspira, Viajes que transforman')
  const brandText = config?.footerBrandText?.[l] || t("brand")
  const waHeading = config?.footerWaHeading?.[l] || t("whatsappHeading")
  const waSub = config?.footerWaSub?.[l] || t("whatsappSub")
  const waCta = config?.footerWaCta?.[l] || t("whatsappCta")
  const navSectionTitle = config?.footerNavSectionTitle?.[l] || t("navSection")
  const servicesSectionTitle = config?.footerServicesSectionTitle?.[l] || t("servicesSection")
  const contactSectionTitle = config?.footerContactSectionTitle?.[l] || t("contactSection")
  const locationText = config?.footerLocation?.[l] || t("location")
  const waAvail = config?.footerWaAvail?.[l] || t("whatsappAvail")
  const copyrightText = config?.footerCopyright?.[l] || t("copyright")
  const legalPrivacy = config?.footerLegalPrivacy?.[l] || t("legal.privacy")
  const legalTerms = config?.footerLegalTerms?.[l] || t("legal.terms")
  const legalMedical = config?.footerLegalMedical?.[l] || t("legal.medicalDisclaimer")
  const legalAccess = config?.footerLegalAccess?.[l] || t("legal.accessibility")

  const navItems = parseJson<LinkItem[]>(
    l === 'en' ? config?.footerNavItemsEn : config?.footerNavItemsEs,
    l === 'en' ? DEFAULT_NAV_EN : DEFAULT_NAV_ES
  )
  const serviceItems = parseJson<LinkItem[]>(config?.footerServiceItems, DEFAULT_SERVICES)
  const partners = parseJson<LogoItem[]>(config?.footerPartners, DEFAULT_PARTNERS)

  return (
    <footer className="bg-brand-navy text-brand-light">
      {/* WhatsApp CTA Banner */}
      <div className="border-b border-white/10">
        <div className="container-allura px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-heading text-lg text-white mb-1">{waHeading}</p>
            <p className="font-body text-sm text-brand-silver">{waSub}</p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-body font-bold text-sm hover:bg-[#22c55e] transition-colors flex-shrink-0"
          >
            <MessageCircle size={16} />
            {waCta}
          </a>
        </div>
      </div>

      {/* Partners / Aliados */}
      <div className="border-b border-white/10">
        <div className="container-allura px-6 md:px-12 py-6">
          <p className="font-heading text-sm tracking-widest uppercase text-white text-center mb-5">
            Nuestros aliados
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap">
            {partners.map(({ src, alt }) => (
              <div key={alt} className="flex items-center justify-center h-16">
                <Image
                  src={src}
                  alt={alt}
                  width={182}
                  height={64}
                  className="max-h-full w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comprometidos con la calidad – slider */}
      <div className="bg-white">
        <div className="container-allura px-6 md:px-12 py-8">
          <p className="font-heading text-sm tracking-widest uppercase text-brand-navy text-center mb-6">
            Comprometidos con la calidad
          </p>
          <QualitySlider qualityLogos={config?.footerQualityLogos} />
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-allura section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-3 bg-white rounded-xl px-4 py-2">
              <Image
                src="/images/allura-logo.png"
                alt="Allura Healthcare"
                width={150}
                height={42}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="font-heading text-sm text-white/60 italic mb-4 tracking-wide">
              {slogan}
            </p>
            <p className="font-body text-sm leading-relaxed text-brand-silver mb-6">
              {brandText}
            </p>
            <div className="flex gap-4">
              <a href={instagram ?? "#"} aria-label="Instagram" className="text-brand-silver hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href={facebook ?? "#"} aria-label="Facebook" className="text-brand-silver hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href={linkedin ?? "#"} aria-label="LinkedIn" className="text-brand-silver hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-heading text-sm tracking-widest uppercase text-white mb-4">
              {navSectionTitle}
            </p>
            <ul className="space-y-2">
              {navItems.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href as any} className="font-body text-sm text-brand-silver hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="font-heading text-sm tracking-widest uppercase text-white mb-4">
              {servicesSectionTitle}
            </p>
            <ul className="space-y-2">
              {serviceItems.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href as any} className="font-body text-sm text-brand-silver hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-heading text-sm tracking-widest uppercase text-white mb-4">
              {contactSectionTitle}
            </p>
            <p className="font-body text-sm text-brand-silver mb-1">{locationText}</p>
            <p className="font-body text-sm text-brand-silver mb-1">
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                {email}
              </a>
            </p>
            <p className="font-body text-sm text-brand-silver">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                {waAvail}
              </a>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-blue/20 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-brand-silver" suppressHydrationWarning>
            © {new Date().getFullYear()} Allura Healthcare. {copyrightText}
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2">
            <Link href="/politicas-de-privacidad" className="font-body text-xs text-brand-silver hover:text-white transition-colors">
              {legalPrivacy}
            </Link>
            <Link href="/terminos-y-condiciones" className="font-body text-xs text-brand-silver hover:text-white transition-colors">
              {legalTerms}
            </Link>
            <Link href="/medical-disclaimer" className="font-body text-xs text-brand-silver hover:text-white transition-colors">
              {legalMedical}
            </Link>
            <Link href="/accesibilidad" className="font-body text-xs text-brand-silver hover:text-white transition-colors">
              {legalAccess}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
