// src/lib/team-member.ts

export type I18n = { es: string; en: string }

export interface HoverBlock {
  id: string
  title: I18n
  items: I18n[]
}

export interface TeamMember {
  id: string
  name: string
  role: I18n
  imageUrl: string
  hoverBlocks: HoverBlock[]
  slug?: string
}

/**
 * Raw member shape as it may exist in Supabase: either the new `hoverBlocks`
 * format, or the legacy `formacion`/`enfoque` arrays (or both, or neither).
 */
export interface RawTeamMember {
  id: string
  name: string
  role?: Partial<I18n>
  imageUrl?: string
  hoverBlocks?: Array<{
    id: string
    title: Partial<I18n>
    items: Array<string | Partial<I18n>>
  }>
  formacion?: string[]
  enfoque?: string[]
  slug?: string
}

/** Coerce a raw item (string or I18n object) to a full I18n object. */
function normalizeItem(item: string | Partial<I18n>): I18n {
  if (typeof item === 'string') return { es: item, en: '' }
  return { es: item.es ?? '', en: item.en ?? '' }
}

/**
 * Converts a raw member (possibly in legacy formacion/enfoque format) into
 * the normalized shape with `hoverBlocks`. Legacy data is mapped to two
 * blocks titled "Formación"/"Training" and "Enfoque"/"Focus areas" so no
 * existing content is lost. If `hoverBlocks` is already present, it is used
 * as-is (legacy fields are ignored in that case).
 */
export function normalizeMember(raw: RawTeamMember): TeamMember {
  const role: I18n = { es: raw.role?.es ?? '', en: raw.role?.en ?? '' }

  let hoverBlocks: HoverBlock[]
  if (raw.hoverBlocks && raw.hoverBlocks.length > 0) {
    hoverBlocks = raw.hoverBlocks.map(b => ({
      id: b.id,
      title: { es: b.title?.es ?? '', en: b.title?.en ?? '' },
      items: (b.items ?? []).map(normalizeItem),
    }))
  } else {
    hoverBlocks = []
    if (raw.formacion && raw.formacion.length > 0) {
      hoverBlocks.push({
        id: 'auto-formacion',
        title: { es: 'Formación', en: 'Training' },
        items: raw.formacion.map(s => ({ es: s, en: '' })),
      })
    }
    if (raw.enfoque && raw.enfoque.length > 0) {
      hoverBlocks.push({
        id: 'auto-enfoque',
        title: { es: 'Enfoque', en: 'Focus areas' },
        items: raw.enfoque.map(s => ({ es: s, en: '' })),
      })
    }
  }

  return {
    id: raw.id,
    name: raw.name,
    role,
    imageUrl: raw.imageUrl ?? '',
    hoverBlocks,
    slug: raw.slug,
  }
}
