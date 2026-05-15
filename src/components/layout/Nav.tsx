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
