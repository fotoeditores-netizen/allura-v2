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
import type { MenuItem } from "@/lib/menu-defaults";
import { defaultMenu } from "@/lib/menu-defaults";

export function Header({ hasPromo = false, menuItems = defaultMenu }: { hasPromo?: boolean; menuItems?: MenuItem[] }) {
  const [scrolled,      setScrolled]      = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [openSubmenu,   setOpenSubmenu]   = useState<string | null>(null);
  const [searchOpen,    setSearchOpen]    = useState(false);
  const t = useTranslations("nav");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


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
          <Nav dark={false} items={menuItems} />

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
          {menuItems.map(item => {
            const hasChildren = (item.children ?? []).length > 0
            if (!hasChildren) {
              return (
                <Link key={item.id} href={item.href as `/${string}`}
                  className="text-brand-navy/80 font-body text-base py-2.5 hover:text-brand-navy transition-colors"
                  onClick={() => setMenuOpen(false)}>
                  {item.label.es}
                </Link>
              )
            }
            const isOpen = openSubmenu === item.id
            return (
              <div key={item.id}>
                <button
                  className="w-full flex items-center justify-between text-brand-navy/80 font-body text-base py-2.5 hover:text-brand-navy transition-colors"
                  onClick={() => setOpenSubmenu(isOpen ? null : item.id)}
                >
                  {item.label.es}
                  <ChevronDown size={16} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
                </button>
                {isOpen && (
                  <div className="pl-4 pb-2 flex flex-col gap-0.5">
                    {(item.children ?? []).map(child => (
                      <Link key={child.id} href={child.href as `/${string}`}
                        className="text-brand-navy/60 font-body text-sm py-2 hover:text-brand-navy transition-colors"
                        onClick={() => { setMenuOpen(false); setOpenSubmenu(null) }}>
                        {child.label.es}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

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
