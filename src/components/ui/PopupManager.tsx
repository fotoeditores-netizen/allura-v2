'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import type { ActivePopup } from '@/types/cms'

interface PopupManagerProps {
  popup: ActivePopup | null
  locale: string
}

export function PopupManager({ popup, locale }: PopupManagerProps) {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!popup) return

    const now = Date.now()
    if (popup.startDate && new Date(popup.startDate).getTime() > now) return
    if (popup.endDate && new Date(popup.endDate).getTime() < now) return

    if (popup.showOnPages && popup.showOnPages.length > 0) {
      if (!popup.showOnPages.some((p) => pathname.includes(p))) return
    }

    const storageKey = `popup_seen_${popup._id}`
    if (popup.frequency === 'once') {
      if (typeof window !== 'undefined' && localStorage.getItem(storageKey)) return
    } else if (popup.frequency === 'per-session') {
      if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) return
    }

    if (popup.trigger === 'timed' && popup.delaySeconds) {
      const timer = setTimeout(() => setVisible(true), popup.delaySeconds * 1000)
      return () => clearTimeout(timer)
    } else {
      setVisible(true)
    }
  }, [popup, pathname])

  function handleClose() {
    setVisible(false)
    if (!popup) return
    const storageKey = `popup_seen_${popup._id}`
    if (popup.frequency === 'once') localStorage.setItem(storageKey, '1')
    else if (popup.frequency === 'per-session') sessionStorage.setItem(storageKey, '1')
  }

  if (!visible || !popup) return null

  const loc = locale as 'es' | 'en'
  const title = (popup.title as { es: string; en: string })[loc] || (popup.title as { es: string; en: string }).es
  const body = (popup.body as unknown as { es: string; en: string })?.[loc] || (popup.body as unknown as { es: string; en: string })?.es || ''
  const ctaLabel = popup.cta?.label?.[loc] || popup.cta?.label?.es
  const imageUrl = (popup as any).imageUrl as string | undefined
  const altText = title

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          aria-label="Cerrar popup"
          className="absolute top-4 right-4 text-brand-silver hover:text-brand-navy transition-colors text-xl font-bold leading-none"
        >
          ✕
        </button>

        <h2 className="font-heading text-2xl text-brand-navy mb-4 pr-6">{title}</h2>

        {imageUrl && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4">
            <Image
              src={imageUrl}
              alt={altText}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 512px"
            />
          </div>
        )}

        {body && (
          <p className="font-body text-sm text-brand-silver leading-relaxed mb-6">{body}</p>
        )}

        {popup.cta?.url && ctaLabel && (
          <a
            href={popup.cta.url}
            target={popup.cta.openInNewTab ? '_blank' : '_self'}
            rel={popup.cta.openInNewTab ? 'noopener noreferrer' : undefined}
            onClick={handleClose}
            className="block w-full text-center bg-brand-navy text-white font-body font-semibold py-3 px-6 rounded-xl hover:bg-brand-blue transition-colors"
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </div>
  )
}
