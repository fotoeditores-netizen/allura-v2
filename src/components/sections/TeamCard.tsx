'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import type { TeamMemberListItem } from '@/sanity/lib/queries';

interface TeamCardProps {
  name: string;
  specialty: string;
  image: string;
  formacion: string[];
  reconocimiento?: string[];
  enfoque: string[];
  bgLight?: boolean;
  sanityMember?: TeamMemberListItem;
  locale?: string;
  slug?: string;
}

export function TeamCard({
  name,
  specialty,
  image,
  formacion,
  reconocimiento,
  enfoque,
  bgLight = false,
  sanityMember,
  locale = 'es',
  slug,
}: TeamCardProps) {
  const [active, setActive] = useState(false);
  const t = useTranslations('teamCard');
  const loc = locale as 'es' | 'en';

  const resolvedSpecialty = sanityMember?.role?.[loc] || specialty;
  const resolvedImage = sanityMember?.photo?.asset?.url || image;
  const resolvedFormacion =
    sanityMember?.credentials && sanityMember.credentials.length > 0
      ? sanityMember.credentials
      : formacion;
  const resolvedEnfoque =
    sanityMember?.specialties && sanityMember.specialties.length > 0
      ? sanityMember.specialties.map((s) => s[loc] || s.es)
      : enfoque;
  const hasSanityData = !!sanityMember;

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
      setActive((prev) => !prev);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-brand-navy/20 bg-white">
      <div
        className="relative aspect-square cursor-pointer select-none"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onClick={handleClick}
        role="img"
        aria-label={`${t('ariaDetail')} ${name}`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${resolvedImage}')` }}
        />

        <div
          aria-hidden={!active}
          className={[
            'absolute inset-0 bg-brand-navy/[0.93] p-5 overflow-y-auto flex flex-col gap-3',
            'transition-all duration-500 ease-in-out',
            active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
          ].join(' ')}
        >
          <button
            className="md:hidden self-end text-white/50 hover:text-white p-1 -mt-1 -mr-1 flex-shrink-0"
            onClick={(e) => { e.stopPropagation(); setActive(false); }}
            aria-label={t('ariaClose')}
          >
            <X size={14} />
          </button>

          <div>
            <p className="font-body text-[9px] tracking-[0.18em] uppercase text-brand-blue mb-1.5">
              {t('formacion')}
            </p>
            <ul className="space-y-1">
              {resolvedFormacion.map((item) => (
                <li key={item} className="font-body text-[11px] text-white/85 leading-snug flex gap-1.5">
                  <span className="text-brand-blue flex-shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {!hasSanityData && reconocimiento && reconocimiento.length > 0 && (
            <div>
              <p className="font-body text-[9px] tracking-[0.18em] uppercase text-brand-blue mb-1.5">
                {t('reconocimiento')}
              </p>
              <ul className="space-y-1">
                {reconocimiento.map((item) => (
                  <li key={item} className="font-body text-[11px] text-white/85 leading-snug flex gap-1.5">
                    <span className="text-brand-blue flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="font-body text-[9px] tracking-[0.18em] uppercase text-brand-blue mb-1.5">
              {t('enfoque')}
            </p>
            <ul className="space-y-1">
              {resolvedEnfoque.map((item) => (
                <li key={item} className="font-body text-[11px] text-white/85 leading-snug flex gap-1.5">
                  <span className="text-brand-blue flex-shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={`p-6 ${bgLight ? 'bg-brand-light' : 'bg-white'}`}>
        {slug ? (
          <Link href={`/equipo/${slug}`}>
            <h3 className="font-heading text-lg text-brand-navy mb-1 hover:text-brand-blue transition-colors">
              {name}
            </h3>
          </Link>
        ) : (
          <h3 className="font-heading text-lg text-brand-navy mb-1">{name}</h3>
        )}
        <p className="font-body text-xs text-brand-blue tracking-wide leading-relaxed">{resolvedSpecialty}</p>
      </div>
    </div>
  );
}
