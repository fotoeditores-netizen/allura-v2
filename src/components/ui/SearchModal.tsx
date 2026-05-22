"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { X, Search } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SEARCH_INDEX } from "@/lib/searchIndex";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

// Build a flat ordered list of results with their group labels so keyboard
// navigation can move linearly across groups.
interface FlatResult {
  href: string;
  label: string;
  description: string;
  category: string;
  isFirstInGroup: boolean;
}

const normalized = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery]         = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef                  = useRef<HTMLInputElement>(null);
  const listRef                   = useRef<HTMLDivElement>(null);
  const activeItemRef             = useRef<HTMLDivElement>(null);
  const router                    = useRouter();
  const locale                    = useLocale();
  const isEn                      = locale === "en";

  const placeholder = isEn ? "Search treatments, pages…"    : "Buscar tratamientos, páginas…";
  const closeLabel  = isEn ? "Close search"                  : "Cerrar búsqueda";

  // ── Filter ────────────────────────────────────────────────────────────────
  const results = useMemo(() => {
    if (query.trim().length < 1) return [];
    const q = normalized(query);
    return SEARCH_INDEX.filter((page) => {
      const label       = normalized(isEn ? page.labelEn       : page.labelEs);
      const category    = normalized(isEn ? page.categoryEn    : page.categoryEs);
      const description = normalized(isEn ? page.descriptionEn : page.descriptionEs);
      const keywords    = (isEn ? page.keywordsEn : page.keywordsEs).map(normalized).join(" ");
      return label.includes(q) || category.includes(q) || description.includes(q) || keywords.includes(q);
    }).slice(0, 8);
  }, [query, isEn]);

  // ── Group & flatten for keyboard nav ─────────────────────────────────────
  const flatResults = useMemo<FlatResult[]>(() => {
    const seen = new Set<string>();
    return results.map((page) => {
      const cat = isEn ? page.categoryEn : page.categoryEs;
      const first = !seen.has(cat);
      seen.add(cat);
      return {
        href:           page.href,
        label:          isEn ? page.labelEn       : page.labelEs,
        description:    isEn ? page.descriptionEn : page.descriptionEs,
        category:       cat,
        isFirstInGroup: first,
      };
    });
  }, [results, isEn]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    setQuery("");
    setActiveIdx(-1);
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (flatResults.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => (i < flatResults.length - 1 ? i + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => (i > 0 ? i - 1 : flatResults.length - 1));
      } else if (e.key === "Enter" && activeIdx >= 0) {
        e.preventDefault();
        router.push(flatResults[activeIdx].href as Parameters<typeof router.push>[0]);
        handleClose();
      }
    },
    [flatResults, activeIdx, router, handleClose]
  );

  // Reset active index whenever results change
  useEffect(() => { setActiveIdx(-1); }, [flatResults]);

  // Scroll active item into view
  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(-1);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Global Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ── UI strings ────────────────────────────────────────────────────────────
  const emptyMessage = isEn
    ? `No results found for "${query}". Try a different term.`
    : `No encontramos coincidencias para "${query}". Intenta con otro término.`;

  const startMessage = isEn
    ? "Start typing to search…"
    : "Empieza a escribir para buscar…";

  const countLabel = isEn
    ? `${results.length} result${results.length !== 1 ? "s" : ""}`
    : `${results.length} resultado${results.length !== 1 ? "s" : ""}`;

  const hintLabel = isEn
    ? "↑↓ navigate · Enter select · Esc close"
    : "↑↓ navegar · Enter seleccionar · Esc cerrar";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {open && (
        /* Backdrop */
        <motion.div
          key="search-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] flex items-start justify-center bg-brand-navy/70 backdrop-blur-sm px-4 pt-[10vh]"
          onClick={handleClose}
          aria-modal="true"
          role="dialog"
          aria-label={placeholder}
        >
          {/* Modal card */}
          <motion.div
            key="search-card"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Search input row ── */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-brand-light">
              <Search
                size={18}
                strokeWidth={1.5}
                className="text-brand-navy/40 flex-shrink-0"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                autoComplete="off"
                spellCheck={false}
                aria-autocomplete="list"
                aria-controls="search-results-list"
                aria-activedescendant={activeIdx >= 0 ? `search-result-${activeIdx}` : undefined}
                className="flex-1 min-w-0 bg-transparent font-body text-base text-brand-navy placeholder-brand-navy/30 outline-none"
              />
              <button
                onClick={handleClose}
                aria-label={closeLabel}
                className="flex-shrink-0 p-1 rounded-full text-brand-navy/40 hover:text-brand-navy hover:bg-brand-light transition-colors duration-150"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* ── Results list ── */}
            <div
              id="search-results-list"
              role="listbox"
              ref={listRef}
              className="max-h-[55vh] overflow-y-auto overscroll-contain"
            >
              {/* Empty state */}
              {query.trim().length >= 1 && flatResults.length === 0 && (
                <div className="px-6 py-10 flex flex-col items-center gap-2">
                  <Search size={28} strokeWidth={1} className="text-brand-silver/60" />
                  <p className="font-body text-sm text-brand-navy/40 text-center leading-relaxed max-w-xs">
                    {emptyMessage}
                  </p>
                </div>
              )}

              {/* Start-typing hint */}
              {query.trim().length < 1 && (
                <p className="px-5 py-8 text-center font-body text-sm text-brand-navy/25 select-none">
                  {startMessage}
                </p>
              )}

              {/* Grouped results */}
              {flatResults.map((item, idx) => (
                <div key={item.href}>
                  {/* Category header — shown only for first item in each group */}
                  {item.isFirstInGroup && (
                    <p className="px-5 pt-4 pb-1 font-body text-[10px] tracking-[0.14em] uppercase text-brand-silver select-none">
                      {item.category}
                    </p>
                  )}

                  {/* Result row */}
                  <div ref={activeIdx === idx ? activeItemRef : undefined}>
                    <Link
                      id={`search-result-${idx}`}
                      href={item.href as Parameters<typeof Link>[0]["href"]}
                      role="option"
                      aria-selected={activeIdx === idx}
                      onClick={handleClose}
                      onMouseEnter={() => setActiveIdx(idx)}
                      className={[
                        "flex items-start gap-3.5 px-5 py-3.5 transition-colors duration-100 group outline-none",
                        activeIdx === idx
                          ? "bg-[#eaeeef] text-[#051c33]"
                          : "text-brand-navy hover:bg-[#eaeeef] hover:text-[#051c33]",
                      ].join(" ")}
                    >
                      <Search
                        size={13}
                        strokeWidth={1.5}
                        className={[
                          "mt-0.5 flex-shrink-0 transition-colors duration-100",
                          activeIdx === idx ? "text-brand-blue" : "text-brand-silver group-hover:text-brand-blue",
                        ].join(" ")}
                      />
                      <span className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-body text-sm leading-snug truncate">
                          {item.label}
                        </span>
                        <span className="font-body text-[11px] text-brand-navy/40 leading-snug line-clamp-1">
                          {item.description}
                        </span>
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Footer ── */}
            {(flatResults.length > 0 || query.trim().length >= 1) && (
              <div className="px-5 py-2.5 border-t border-brand-light flex items-center justify-between">
                <p className="font-body text-[10px] text-brand-silver/70 select-none hidden sm:block">
                  {hintLabel}
                </p>
                {flatResults.length > 0 && (
                  <p className="font-body text-[10px] text-brand-silver select-none ml-auto">
                    {countLabel}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
