import Image from 'next/image'

interface TextImageSectionProps {
  locale?: string
  settings?: Record<string, unknown>
}

type I18n = { es?: string; en?: string }

export function TextImageSection({ locale = 'es', settings = {} }: TextImageSectionProps) {
  const s = settings as { title?: I18n; body?: I18n; imageUrl?: string; imagePosition?: 'left' | 'right' }
  const loc = locale as 'es' | 'en'

  const title = s.title?.[loc] || s.title?.es || ''
  const body = s.body?.[loc] || s.body?.es || ''
  const imageUrl = s.imageUrl || ''
  const imageLeft = s.imagePosition === 'left'

  return (
    <section className="section-padding bg-white">
      <div className="container-allura">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>

          {/* Image */}
          {imageUrl && (
            <div className={`relative rounded-2xl overflow-hidden aspect-[4/3] ${imageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={imageUrl.startsWith('http')}
              />
            </div>
          )}

          {/* Text */}
          <div className={imageLeft ? 'lg:order-2' : 'lg:order-1'}>
            {title && (
              <h2 className="font-heading text-3xl md:text-4xl text-brand-navy mb-6 leading-tight">
                {title}
              </h2>
            )}
            {body && (
              <p className="font-body text-brand-silver leading-relaxed text-base whitespace-pre-line">
                {body}
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
