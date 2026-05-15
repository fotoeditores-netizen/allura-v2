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
