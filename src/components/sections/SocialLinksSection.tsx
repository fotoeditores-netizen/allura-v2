import Image from 'next/image'
import { SectionHeading } from '@/components/ui/SectionHeading'

type I18n = { es?: string; en?: string }
type SocialLink = {
  id: string
  iconType?: 'preset' | 'image' | 'emoji'
  preset?: string
  iconImageUrl?: string
  emoji?: string
  label?: I18n
  url?: string
}
type Settings = {
  eyebrow?: I18n; title?: I18n; subtitle?: I18n
  bg?: string; layout?: 'row' | 'grid'; showLabel?: boolean
  links?: SocialLink[]
}

interface SocialLinksSectionProps {
  locale?: string
  settings?: Record<string, unknown>
}

const BG: Record<string, string> = { white: 'bg-white', light: 'bg-[#eaeeef]', navy: 'bg-[#051c33]' }

// SVG icons for known networks
const PRESET_ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.73a4.86 4.86 0 0 1-1.01-.04z"/>
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  pinterest: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  ),
  threads: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.365-.889h-.026c-.874 0-1.685.211-2.409.628-.341.199-.588.419-.733.652l-1.737-1.063c.307-.484.72-.898 1.229-1.236 1.02-.672 2.251-1.02 3.648-1.033h.036c1.539.009 2.784.422 3.7 1.227 1.03.901 1.568 2.197 1.594 3.85 1.044.584 1.852 1.374 2.383 2.352.802 1.5.87 3.442-.082 5.308-.849 1.683-2.357 2.978-4.243 3.648-1.37.488-2.926.737-4.649.764l-.033.001z"/>
    </svg>
  ),
  website: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
}

export function SocialLinksSection({ locale = 'es', settings = {} }: SocialLinksSectionProps) {
  const s = settings as Settings
  const loc = locale as 'es' | 'en'
  const isNavy = s.bg === 'navy'

  const eyebrow  = s.eyebrow?.[loc]  || s.eyebrow?.es  || ''
  const title    = s.title?.[loc]    || s.title?.es    || ''
  const subtitle = s.subtitle?.[loc] || s.subtitle?.es || ''
  const links    = (s.links ?? []) as SocialLink[]
  const showLabel = s.showLabel !== false
  const isGrid   = s.layout === 'grid'

  if (links.length === 0) return null

  return (
    <section className={`${BG[s.bg ?? 'white']} py-16 px-6 md:px-12`}>
      <div className="container mx-auto max-w-4xl">
        {(eyebrow || title || subtitle) && (
          <div className="mb-10">
            <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} centered light={isNavy} />
          </div>
        )}

        <div className={isGrid
          ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 justify-items-center'
          : 'flex flex-wrap justify-center gap-6'
        }>
          {links.map(link => {
            const label = link.label?.[loc] || link.label?.es || link.preset || ''
            const url = link.url || '#'
            const iconType = link.iconType ?? 'preset'

            return (
              <a
                key={link.id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col items-center gap-2 transition-transform hover:scale-110 ${isGrid ? '' : ''}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
                  ${isNavy ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-[#051c33]/5 text-[#051c33] hover:bg-[#051c33]/10'}`}>
                  {iconType === 'preset' && PRESET_ICONS[link.preset ?? ''] ? (
                    PRESET_ICONS[link.preset!]
                  ) : iconType === 'emoji' ? (
                    <span className="text-2xl">{link.emoji}</span>
                  ) : iconType === 'image' && link.iconImageUrl ? (
                    <div className="relative w-8 h-8">
                      <Image src={link.iconImageUrl} alt={label} fill className="object-contain" unoptimized={link.iconImageUrl.startsWith('http')} />
                    </div>
                  ) : (
                    <span className="text-2xl">🔗</span>
                  )}
                </div>
                {showLabel && label && (
                  <span className={`font-body text-xs font-medium ${isNavy ? 'text-white/70' : 'text-[#abacae]'}`}>
                    {label}
                  </span>
                )}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
