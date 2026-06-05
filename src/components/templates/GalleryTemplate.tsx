import Image from 'next/image'
import { Link } from '@/navigation'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getTranslations } from 'next-intl/server'
import type { GalleryItemData } from '@/types/cms'

interface GalleryTemplateProps {
  items: GalleryItemData[]
  locale: string
  activeCategory?: string
  hideHero?: boolean
}

const CATEGORIES = ['clinic', 'team', 'results', 'medellin', 'events'] as const

export async function GalleryTemplate({ items, locale, activeCategory, hideHero = false }: GalleryTemplateProps) {
  const t = await getTranslations('galeria')
  const loc = locale as 'es' | 'en'

  return (
    <>
      {!hideHero && (
        <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12 text-center">
          <SectionHeading
            eyebrow={t('heroEyebrow')}
            title={t('heroTitle')}
            subtitle={t('heroSubtitle')}
            centered
            light
          />
        </section>
      )}

      {/* Category filter */}
      <section className="bg-white py-8 px-6 md:px-12 border-b border-brand-light">
        <div className="container-allura">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/galeria"
              className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${
                !activeCategory
                  ? 'bg-brand-navy text-white'
                  : 'bg-brand-light text-brand-navy hover:bg-brand-navy/10'
              }`}
            >
              {t('all')}
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/galeria?categoria=${cat}`}
                className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${
                  activeCategory === cat
                    ? 'bg-brand-navy text-white'
                    : 'bg-brand-light text-brand-navy hover:bg-brand-navy/10'
                }`}
              >
                {t(cat)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding bg-brand-light">
        <div className="container-allura">
          {items.length === 0 ? (
            <p className="text-center font-body text-brand-silver py-16">{t('empty')}</p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {items.map((item) => {
                const altText =
                  item.image.alt?.[loc] ||
                  item.image.alt?.es ||
                  item.title?.[loc] ||
                  item.title?.es ||
                  ''
                const caption = item.title?.[loc] || item.title?.es
                const { width, height } = item.image.asset.metadata?.dimensions ?? {
                  width: 800,
                  height: 600,
                }
                return (
                  <div
                    key={item._id}
                    className="break-inside-avoid rounded-2xl overflow-hidden bg-white shadow-sm group"
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={item.image.asset.url}
                        alt={altText}
                        width={width}
                        height={height}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {caption && (
                      <p className="px-4 py-3 font-body text-sm text-brand-navy">{caption}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
