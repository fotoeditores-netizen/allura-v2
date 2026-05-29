'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { TestimonialItem } from '@/types/cms'

interface TestimonialsCarouselProps {
  testimonials: TestimonialItem[]
  locale: string
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < rating ? 'text-yellow-400' : 'text-brand-light'}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  )
}

export function TestimonialsCarousel({ testimonials, locale }: TestimonialsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const loc = locale as 'es' | 'en'
  const total = testimonials.length

  const prev = () => setActiveIndex((i) => (i - 1 + total) % total)
  const next = () => setActiveIndex((i) => (i + 1) % total)

  if (total === 0) return null

  const t = testimonials[activeIndex]
  const origin = t.patientOrigin?.[loc] || t.patientOrigin?.es || ''
  const quote = t.quote?.[loc] || t.quote?.es || ''
  const serviceName = t.service?.title?.[loc] || t.service?.title?.es || ''

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Slide */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-brand-light p-8 md:p-10 text-center"
        role="group"
        aria-label={`Testimonio ${activeIndex + 1} de ${total}`}
      >
        {/* Avatar */}
        <div className="flex justify-center mb-5">
          {t.photo?.asset?.url ? (
            <img
              src={t.photo.asset.url}
              alt={t.photo.alt || `Foto de ${t.patientName}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-brand-light"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center border-2 border-brand-light"
              aria-hidden="true"
            >
              <span className="font-heading text-2xl text-brand-navy">
                {t.patientName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <StarRating rating={t.rating} />

        <blockquote className="font-body text-base md:text-lg text-brand-navy leading-relaxed mt-5 mb-6 italic">
          &ldquo;{quote}&rdquo;
        </blockquote>

        <p className="font-heading text-sm text-brand-navy font-semibold">{t.patientName}</p>
        {origin && (
          <p className="font-body text-xs text-brand-silver mt-0.5">{origin}</p>
        )}
        {serviceName && (
          <span className="inline-block mt-3 px-3 py-1 bg-brand-light rounded-full font-body text-xs text-brand-blue tracking-wide">
            {serviceName}
          </span>
        )}
      </div>

      {/* Navigation — only show if more than 1 */}
      {total > 1 && (
        <>
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={prev}
              className="p-2 rounded-full border border-brand-light hover:bg-brand-light transition-colors text-brand-navy"
              aria-label={loc === 'en' ? 'Previous testimonial' : 'Testimonio anterior'}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2" role="tablist" aria-label="Testimonios">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-current={i === activeIndex ? 'true' : undefined}
                  aria-label={`Testimonio ${i + 1}`}
                  className={[
                    'w-2 h-2 rounded-full transition-all duration-200',
                    i === activeIndex
                      ? 'bg-brand-navy w-4'
                      : 'bg-brand-light hover:bg-brand-blue',
                  ].join(' ')}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 rounded-full border border-brand-light hover:bg-brand-light transition-colors text-brand-navy"
              aria-label={loc === 'en' ? 'Next testimonial' : 'Siguiente testimonio'}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
