"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { Nav } from "./Nav";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { SearchModal } from "@/components/ui/SearchModal";
import { cn } from "@/lib/utils";

const serviceItems = [
  { href: "/servicios/full-mouth-reconstruction", label: "Allura Full Mouth Reconstruction" },
  { href: "/servicios/smile-makeover",            label: "Allura Smile Makeover" },
  { href: "/servicios/aligners",                  label: "Allura Aligners" },
  { href: "/servicios/facial-harmony",            label: "Allura Facial Harmony" },
];

export function Header({ hasPromo = false }: { hasPromo?: boolean }) {
  const [scrolled,      setScrolled]      = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [servicesOpen,  setServicesOpen]  = useState(false);
  const [searchOpen,    setSearchOpen]    = useState(false);
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
    <header className={`fixed left-0 right-0 z-50 ${hasPromo ? 'top-9' : 'top-0'}`}>
      {/* ── TOP BAR (desktop only) ── */}
      <div className="hidden md:flex bg-brand-light border-b border-brand-silver/30">
        <div className="container-allura px-6 md:px-12 flex items-center justify-end gap-4 py-1.5 w-full">
          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label={t("searchLabel")}
            className="p-1.5 text-brand-navy/70 hover:text-brand-navy transition-colors duration-200"
          >
            <Search size={16} strokeWidth={1.5} />
          </button>

          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Pay here — outline pill */}
          <Link
            href="#"
            className="inline-flex items-center px-3 py-1 text-xs font-body font-semibold border border-brand-navy text-brand-navy rounded-full hover:bg-brand-navy hover:text-white transition-colors duration-200 flex-shrink-0"
          >
            {t("pay")}
          </Link>

          {/* Book consultation — solid pill */}
          <Link
            href="/contacto"
            className="inline-flex items-center px-4 py-1 text-xs font-body font-bold bg-brand-navy text-white rounded-full hover:bg-brand-blue transition-colors duration-200 flex-shrink-0"
          >
            {t("cta")}
          </Link>
        </div>
      </div>

      {/* ── NAV BAR ── */}
      <div
        className={cn(
          "transition-all duration-300",
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

          {/* Mobile: search icon + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label={t("searchLabel")}
              className="p-2 text-brand-navy/70 hover:text-brand-navy transition-colors"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button
              className="text-brand-navy"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
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

          {/* Pay here — mobile */}
          <Link
            href="#"
            className="mt-2 text-center px-5 py-3 text-sm font-body font-semibold border border-brand-navy text-brand-navy rounded-full hover:bg-brand-navy hover:text-white transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {t("pay")}
          </Link>

          {/* Book consultation — mobile */}
          <Link
            href="/contacto"
            className="mt-2 text-center px-5 py-3 text-sm font-body font-bold bg-brand-navy text-white rounded-full hover:bg-brand-blue transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {t("cta")}
          </Link>
        </div>
      )}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
