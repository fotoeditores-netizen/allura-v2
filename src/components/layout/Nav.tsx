"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link, usePathname } from "@/navigation";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/menu-defaults";

interface NavProps {
  dark?: boolean;
  items: MenuItem[];
}

export function Nav({ dark = false, items }: NavProps) {
  const pathname = usePathname();
  const [openId, setOpenId] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu  = (id: string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpenId(id) }
  const closeMenu = () => { closeTimer.current = setTimeout(() => setOpenId(null), 200) }

  const linkClass = cn(
    "font-body text-sm tracking-wide transition-colors duration-200",
    dark ? "text-white/80 hover:text-white" : "text-brand-navy hover:text-brand-blue"
  );
  const activeLinkClass = dark ? "text-white" : "text-brand-blue";

  return (
    <nav className="hidden md:flex items-center gap-7">
      {items.map(item => {
        const hasChildren = (item.children ?? []).length > 0
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

        if (!hasChildren) {
          return (
            <Link key={item.id} href={item.href as `/${string}`}
              className={cn(linkClass, isActive && activeLinkClass)}>
              {item.label.es}
            </Link>
          )
        }

        const isOpen = openId === item.id
        return (
          <div key={item.id} className="relative"
            onMouseEnter={() => openMenu(item.id)}
            onMouseLeave={closeMenu}>
            <button className={cn(linkClass, 'flex items-center gap-1', isActive && activeLinkClass)}>
              {item.label.es}
              <ChevronDown size={14} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
            </button>
            <div className="absolute top-full left-0 right-0 h-3" />
            <div className={cn(
              "absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 transition-all duration-200 ease-in-out",
              isOpen ? "opacity-100 visible pointer-events-auto translate-y-0" : "opacity-0 invisible pointer-events-none -translate-y-1"
            )}>
              <div className="mx-auto w-3 h-3 -mb-1.5 border-l border-t border-brand-light bg-white rotate-45 ml-[116px]" />
              <ul className="bg-white border border-brand-light rounded-xl shadow-xl py-2 min-w-[260px] overflow-hidden">
                {(item.children ?? []).map(child => (
                  <li key={child.id}>
                    <Link href={child.href as `/${string}`}
                      className="block px-5 py-3 font-body text-sm text-brand-navy hover:bg-brand-light transition-colors duration-150">
                      {child.label.es}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}
    </nav>
  );
}
