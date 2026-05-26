import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PromoBanner } from '@/components/ui/PromoBanner'
import { PopupManager } from '@/components/ui/PopupManager'
import { client } from '@/sanity/lib/client'
import { activePromotionQuery, activePopupQuery } from '@/sanity/lib/queries'
import type { ActivePromotion, ActivePopup } from '@/sanity/lib/queries'
import '@/styles/globals.css'

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'en' }]
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const isEs = locale === 'es'
  return {
    title: isEs
      ? 'Allura Healthcare — Turismo Médico en Medellín'
      : 'Allura Healthcare — Medical Tourism in Medellín',
    description: isEs
      ? 'Allura es una marca colombiana de turismo médico en Medellín que integra tratamientos médicos, estéticos y odontológicos con la calidez y el disfrute de Colombia.'
      : 'Allura is a Colombian medical tourism brand in Medellín integrating premium dental and aesthetic treatments with the warmth of Colombia.',
    keywords: isEs
      ? ['turismo médico', 'Medellín', 'Colombia', 'salud', 'estética', 'odontología']
      : ['medical tourism', 'Medellín', 'Colombia', 'health', 'aesthetics', 'dentistry'],
    openGraph: {
      title: 'Allura Healthcare',
      description: isEs
        ? 'Tu transformación comienza en Medellín'
        : 'Your transformation starts in Medellín',
      locale: isEs ? 'es_CO' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `https://allura.co/${locale}`,
      languages: {
        'es-CO': 'https://allura.co/es',
        en: 'https://allura.co/en',
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600

  const [messages, promotion, popup] = await Promise.all([
    getMessages(),
    client.fetch<ActivePromotion | null>(activePromotionQuery, {}, { next: { revalidate } }),
    client.fetch<ActivePopup | null>(activePopupQuery, {}, { next: { revalidate } }),
  ])

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <PromoBanner promotion={promotion ?? null} locale={locale} />
          <Header />
          <main>{children}</main>
          <Footer />
          <PopupManager popup={popup ?? null} locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
