import { Link } from '@/navigation'
import type { ActivePromotion } from '@/types/cms'

interface PromoBannerProps {
  promotion: ActivePromotion | null
  locale: string
}

const BG_CLASSES: Record<string, string> = {
  navy: 'bg-brand-navy text-white',
  blue: 'bg-brand-blue text-white',
  gold: 'bg-amber-600 text-white',
}

export function PromoBanner({ promotion, locale }: PromoBannerProps) {
  if (!promotion) return null

  const loc = locale as 'es' | 'en'
  const bg = BG_CLASSES[promotion.bgColor ?? 'navy'] ?? BG_CLASSES.navy
  const title = promotion.title[loc] || promotion.title.es
  const description = promotion.description?.[loc] || promotion.description?.es
  const ctaLabel = promotion.cta?.label?.[loc] || promotion.cta?.label?.es

  return (
    <div className={`py-2 px-4 text-center text-sm font-body ${bg}`}>
      <span className="font-semibold">{title}</span>
      {description && <span className="mx-2 opacity-90">{description}</span>}
      {promotion.cta?.url && ctaLabel && (
        <>
          {promotion.cta.openInNewTab ? (
            <a
              href={promotion.cta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 underline font-semibold hover:opacity-80 transition-opacity"
            >
              {ctaLabel}
            </a>
          ) : (
            <Link
              href={promotion.cta.url as `/${string}`}
              className="ml-3 underline font-semibold hover:opacity-80 transition-opacity"
            >
              {ctaLabel}
            </Link>
          )}
        </>
      )}
    </div>
  )
}
