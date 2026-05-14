import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Linkedin, MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/573001234567?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare";

const navLinks = [
  { href: "/",              label: "Inicio" },
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/servicios",     label: "Servicios" },
  { href: "/nosotros",      label: "Sobre nosotros" },
  { href: "/equipo",        label: "Equipo" },
  { href: "/blog",          label: "Blog" },
  { href: "/contacto",      label: "Contáctanos" },
];

const serviceLinks = [
  { href: "/servicios/full-mouth-reconstruction", label: "Full Mouth Reconstruction" },
  { href: "/servicios/smile-makeover",            label: "Smile Makeover" },
  { href: "/servicios/aligners",                  label: "Allura Aligners" },
  { href: "/servicios/facial-harmony",            label: "Facial Harmony" },
];

const legalLinks = [
  { href: "/politicas-de-privacidad", label: "Políticas de privacidad" },
  { href: "/accesibilidad",           label: "Declaración de accesibilidad" },
];

export function Footer() {
  return (
    <footer className="bg-brand-navy text-brand-light">
      {/* WhatsApp CTA Banner */}
      <div className="border-b border-white/10">
        <div className="container-allura px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-heading text-lg text-white mb-1">¿Podemos ayudarte?</p>
            <p className="font-body text-sm text-brand-silver">
              Nuestro equipo responde en menos de 24 horas.
            </p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-body font-bold text-sm hover:bg-[#22c55e] transition-colors flex-shrink-0"
          >
            <MessageCircle size={16} />
            Hablar por WhatsApp
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
              Turismo médico de excelencia en Medellín. Odontología premium y medicina facial estética con la calidez de Colombia.
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
            <p className="font-heading text-sm tracking-widest uppercase text-white mb-4">Navegación</p>
            <ul className="space-y-2">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="font-body text-sm text-brand-silver hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="font-heading text-sm tracking-widest uppercase text-white mb-4">Especialidades</p>
            <ul className="space-y-2">
              {serviceLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="font-body text-sm text-brand-silver hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-heading text-sm tracking-widest uppercase text-white mb-4">Contacto</p>
            <p className="font-body text-sm text-brand-silver mb-1">Medellín, Colombia</p>
            <p className="font-body text-sm text-brand-silver mb-1">
              <a href="mailto:info@allura.co" className="hover:text-white transition-colors">
                info@allura.co
              </a>
            </p>
            <p className="font-body text-sm text-brand-silver">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                WhatsApp disponible
              </a>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-blue/20 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-brand-silver">
            © {new Date().getFullYear()} Allura Healthcare. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            {legalLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="font-body text-xs text-brand-silver hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
