import Image from 'next/image'
import { Link } from '@/navigation'

type I18n = { es?: string; en?: string }
type Settings = {
  style?: 'dark-centered' | 'dark-image'
  eyebrow?: I18n
  title?: I18n
  subtitle?: I18n
  imageUrl?: string
  ctaLabel?: I18n
  ctaUrl?: string
  breadcrumb?: I18n
}

interface PageHeaderSectionProps {
  locale?: string
  settings?: Record<string, unknown>
}

export function PageHeaderSection({ locale = 'es', settings = {} }: PageHeaderSectionProps) {
  const s = settings as Settings
  const loc = locale as 'es' | 'en'

  const style     = s.style ?? 'dark-centered'
  const eyebrow   = s.eyebrow?.[loc]   || s.eyebrow?.es   || ''
  const title     = s.title?.[loc]     || s.title?.es     || ''
  const subtitle  = s.subtitle?.[loc]  || s.subtitle?.es  || ''
  const ctaLabel  = s.ctaLabel?.[loc]  || s.ctaLabel?.es  || ''
  const ctaUrl    = s.ctaUrl || ''
  const breadcrumb = s.breadcrumb?.[loc] || s.breadcrumb?.es || ''

  if (style === 'dark-image') {
    return (
      <section className="relative pt-40 pb-24 overflow-hidden min-h-[480px]">
        {/* Background image */}
        {s.imageUrl ? (
          <Image
            src={s.imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized={s.imageUrl.startsWith('http')}
          />
        ) : (
          <div className="absolute inset-0 bg-[#051c33]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#051c33]/90 via-[#051c33]/70 to-[#051c33]/30" />

        <div className="relative z-10 container mx-auto max-w-6xl px-6 md:px-12">
          {/* Breadcrumb */}
          {breadcrumb && (
            <p className="font-body text-xs text-white/50 mb-6 tracking-wide">{breadcrumb}</p>
          )}
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="font-body text-xs tracking-[0.2em] uppercase text-[#8b9fb3] mb-4">{eyebrow}</p>
            )}
            <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-6">
              {title}
            </h1>
            {subtitle && (
              <p className="font-body text-base text-white/70 leading-relaxed mb-8">{subtitle}</p>
            )}
            {ctaLabel && ctaUrl && (
              <Link
                href={ctaUrl as `/${string}`}
                className="inline-flex items-center gap-2 px-7 py-3 bg-white text-[#051c33] rounded-full font-body font-bold text-sm hover:bg-[#eaeeef] transition-colors"
              >
                {ctaLabel}
              </Link>
            )}
          </div>
        </div>
      </section>
    )
  }

  // dark-centered style
  return (
    <section className="bg-[#051c33] pt-40 pb-20 px-6 md:px-12 text-center">
      <div className="container mx-auto max-w-3xl">
        {breadcrumb && (
          <p className="font-body text-xs text-white/40 mb-6 tracking-wide">{breadcrumb}</p>
        )}
        {eyebrow && (
          <p className="font-body text-xs tracking-[0.2em] uppercase text-[#8b9fb3] mb-4">{eyebrow}</p>
        )}
        <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-base text-white/70 leading-relaxed max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>
        )}
        {ctaLabel && ctaUrl && (
          <Link
            href={ctaUrl as `/${string}`}
            className="inline-flex items-center gap-2 px-7 py-3 bg-white text-[#051c33] rounded-full font-body font-bold text-sm hover:bg-[#eaeeef] transition-colors"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
