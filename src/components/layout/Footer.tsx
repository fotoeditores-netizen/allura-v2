import Image from "next/image";
import { Instagram, Facebook, Linkedin, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { QualitySlider } from "./QualitySlider";

const WHATSAPP_URL =
  "https://wa.me/17862087572?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare";

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

      {/* Partners / Aliados */}
      <div className="border-b border-white/10">
        <div className="container-allura px-6 md:px-12 py-6">
          <p className="font-heading text-sm tracking-widest uppercase text-white text-center mb-5">
            Nuestros aliados
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap">
            {[
              { src: "/images/imagenes_web/logo-muvon-travel.png",              alt: "Muvon Travel" },
              { src: "/images/imagenes_web/logo-maskart.png",                   alt: "Maskart" },
              { src: "/images/imagenes_web/logo-odontologia-de-precision.png",  alt: "Odontología de Precisión" },
              { src: "/images/imagenes_web/logo-orto-rio.png",                  alt: "Orto Río" },
            ].map(({ src, alt }) => (
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
          <QualitySlider />
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
              <a href="mailto:contact@allurahealthcare.com" className="hover:text-white transition-colors">
                contact@allurahealthcare.com
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
          <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2">
            <Link
              href="/politicas-de-privacidad"
              className="font-body text-xs text-brand-silver hover:text-white transition-colors"
            >
              {t("legal.privacy")}
            </Link>
            <Link
              href="/terminos-y-condiciones"
              className="font-body text-xs text-brand-silver hover:text-white transition-colors"
            >
              {t("legal.terms")}
            </Link>
            <Link
              href="/medical-disclaimer"
              className="font-body text-xs text-brand-silver hover:text-white transition-colors"
            >
              {t("legal.medicalDisclaimer")}
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
