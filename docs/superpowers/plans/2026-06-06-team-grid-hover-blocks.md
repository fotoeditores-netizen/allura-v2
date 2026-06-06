# Team Grid Hover Blocks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fixed "Formación"/"Enfoque" hover fields on `team_grid` team members with a dynamic list of user-defined "hover blocks" (each with an editable i18n title and its own list of text items), while preserving existing data through on-read normalization.

**Architecture:** Introduce a shared `HoverBlock` type and a `normalizeMember()` helper in a new module `src/lib/team-member.ts`, used by both the admin form (`TeamGridForm.tsx`) and the public renderer (`TeamGridSection.tsx`) to convert legacy `formacion`/`enfoque` arrays into `hoverBlocks` on read. The admin form gains generic block-management UI (add/remove/rename block, add/remove/edit items) mirroring the existing member-management patterns. The registry's seed data is updated to the new `hoverBlocks` format directly.

**Tech Stack:** Next.js 14 (App Router), React (client components), TypeScript, Tailwind CSS, lucide-react icons, Supabase (jsonb `settings` column — no schema migration needed).

---

## Spec reference

Design doc: `docs/superpowers/specs/2026-06-06-team-grid-hover-blocks-design.md`

## File map

- **Create:** `src/lib/team-member.ts` — shared `HoverBlock`/`TeamMember` types + `normalizeMember()` helper
- **Modify:** `src/components/admin/section-forms/TeamGridForm.tsx` — replace fixed Formación/Enfoque sections with dynamic block UI
- **Modify:** `src/components/sections/TeamGridSection.tsx` — render `hoverBlocks` instead of fixed `formacion`/`enfoque`
- **Modify:** `src/lib/section-registry.ts` — update `team_grid` seed members to use `hoverBlocks`

---

### Task 1: Shared types and normalization helper

**Files:**
- Create: `src/lib/team-member.ts`

- [ ] **Step 1: Create the module with types and `normalizeMember`**

Create `src/lib/team-member.ts`:

```ts
// src/lib/team-member.ts

export type I18n = { es: string; en: string }

export interface HoverBlock {
  id: string
  title: I18n
  items: string[]
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
  hoverBlocks?: HoverBlock[]
  formacion?: string[]
  enfoque?: string[]
  slug?: string
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
    hoverBlocks = raw.hoverBlocks
  } else {
    hoverBlocks = []
    if (raw.formacion && raw.formacion.length > 0) {
      hoverBlocks.push({
        id: 'auto-formacion',
        title: { es: 'Formación', en: 'Training' },
        items: raw.formacion,
      })
    }
    if (raw.enfoque && raw.enfoque.length > 0) {
      hoverBlocks.push({
        id: 'auto-enfoque',
        title: { es: 'Enfoque', en: 'Focus areas' },
        items: raw.enfoque,
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
```

- [ ] **Step 2: Verify it compiles**

Run: `cd "c:\Users\publi\Desktop\ALLURA" && npx tsc --noEmit`
Expected: no errors mentioning `team-member.ts`

- [ ] **Step 3: Commit**

```bash
cd "c:\Users\publi\Desktop\ALLURA"
git add src/lib/team-member.ts
git commit -m "feat: add shared TeamMember/HoverBlock types and normalizeMember helper"
```

---

### Task 2: Render dynamic hover blocks in `TeamGridSection`

**Files:**
- Modify: `src/components/sections/TeamGridSection.tsx`

- [ ] **Step 1: Replace the local `TeamMember` interface with the shared types and normalize on read**

In `src/components/sections/TeamGridSection.tsx`, replace lines 9-19:

```ts
type I18n = { es?: string; en?: string }

interface TeamMember {
  id: string
  name: string
  role: I18n
  imageUrl: string
  formacion: string[]
  enfoque: string[]
  slug?: string
}
```

with:

```ts
import { normalizeMember, type TeamMember, type RawTeamMember } from '@/lib/team-member'

type I18n = { es?: string; en?: string }
```

- [ ] **Step 2: Update `TeamGridSettings.members` to use `RawTeamMember`**

Replace line 29 (`members?: TeamMember[]`) with:

```ts
  members?: RawTeamMember[]
```

- [ ] **Step 3: Replace the fixed Formación/Enfoque blocks in `MemberCard` with a loop over `hoverBlocks`**

Replace lines 102-132 (the two `{member.formacion.length > 0 && ...}` / `{member.enfoque.length > 0 && ...}` blocks) with:

```tsx
            {member.hoverBlocks.map(block => (
              block.items.length > 0 && (
                <div key={block.id}>
                  <p className="font-body text-[9px] tracking-[0.18em] uppercase text-brand-blue mb-1.5">
                    {block.title[loc] || block.title.es}
                  </p>
                  <ul className="space-y-1">
                    {block.items.map(item => (
                      <li key={item} className="font-body text-[11px] text-white/85 leading-snug flex gap-1.5">
                        <span className="text-brand-blue flex-shrink-0">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
```

- [ ] **Step 4: Normalize members when reading settings**

In the `TeamGridSection` function, replace line 159:

```ts
  const members: TeamMember[] = s.members ?? []
```

with:

```ts
  const members: TeamMember[] = (s.members ?? []).map(normalizeMember)
```

- [ ] **Step 5: Verify it compiles**

Run: `cd "c:\Users\publi\Desktop\ALLURA" && npx tsc --noEmit`
Expected: no errors mentioning `TeamGridSection.tsx`

- [ ] **Step 6: Manually verify in the browser**

With the dev server running (`npm run dev`), open the admin preview iframe for a page containing the `team_grid` section (e.g. `/es?preview=true`) and hover over a team member card. Confirm "Formación" and "Enfoque" still appear with their existing items (this proves on-read normalization of legacy data works).

- [ ] **Step 7: Commit**

```bash
cd "c:\Users\publi\Desktop\ALLURA"
git add src/components/sections/TeamGridSection.tsx
git commit -m "feat: render dynamic hover blocks in team grid public section"
```

---

### Task 3: Dynamic block management UI in `TeamGridForm`

**Files:**
- Modify: `src/components/admin/section-forms/TeamGridForm.tsx`

- [ ] **Step 1: Replace the local `TeamMember` interface with the shared types**

Replace lines 6-16:

```ts
type I18n = { es: string; en: string }

interface TeamMember {
  id: string
  name: string
  role: I18n
  imageUrl: string
  formacion: string[]
  enfoque: string[]
  slug?: string
}
```

with:

```ts
import { normalizeMember, type HoverBlock, type I18n, type TeamMember, type RawTeamMember } from '@/lib/team-member'
```

(Remove the now-redundant `type I18n = { es: string; en: string }` line — it's imported from the shared module.)

- [ ] **Step 2: Update `emptyMember()` to produce `hoverBlocks` instead of `formacion`/`enfoque`**

Replace lines 36-46:

```ts
function emptyMember(): TeamMember {
  return {
    id: uid(),
    name: '',
    role: { es: '', en: '' },
    imageUrl: '',
    formacion: [],
    enfoque: [],
    slug: '',
  }
}
```

with:

```ts
function emptyMember(): TeamMember {
  return {
    id: uid(),
    name: '',
    role: { es: '', en: '' },
    imageUrl: '',
    hoverBlocks: [],
    slug: '',
  }
}

function emptyBlock(): HoverBlock {
  return { id: uid(), title: { es: '', en: '' }, items: [] }
}
```

- [ ] **Step 3: Normalize members when reading from settings**

Replace line 60:

```ts
  const members: TeamMember[] = (s.members ?? [])
```

with:

```ts
  const members: TeamMember[] = ((s.members ?? []) as RawTeamMember[]).map(normalizeMember)
```

- [ ] **Step 4: Remove the old `formacion`/`enfoque`-specific list helpers**

Delete lines 86-110 (`updList`, `addListItem`, `removeListItem` — these operated on `m[field]` where `field: 'formacion' | 'enfoque'`). They will be replaced by block-aware equivalents in the next step.

- [ ] **Step 5: Add block-management helper functions**

In the same location (right after `removeMember`, before `toggleSection`), add:

```ts
  const addHoverBlock = (memberIdx: number) => {
    const updated = members.map((m, i) => {
      if (i !== memberIdx) return m
      return { ...m, hoverBlocks: [...m.hoverBlocks, emptyBlock()] }
    })
    upd('members', updated)
  }

  const removeHoverBlock = (memberIdx: number, blockIdx: number) => {
    const updated = members.map((m, i) => {
      if (i !== memberIdx) return m
      return { ...m, hoverBlocks: m.hoverBlocks.filter((_, bi) => bi !== blockIdx) }
    })
    upd('members', updated)
  }

  const updHoverBlockTitle = (memberIdx: number, blockIdx: number, value: string) => {
    const updated = members.map((m, i) => {
      if (i !== memberIdx) return m
      const blocks = m.hoverBlocks.map((b, bi) => {
        if (bi !== blockIdx) return b
        return { ...b, title: { ...b.title, [lang]: value } }
      })
      return { ...m, hoverBlocks: blocks }
    })
    upd('members', updated)
  }

  const updHoverBlockItem = (memberIdx: number, blockIdx: number, itemIdx: number, value: string) => {
    const updated = members.map((m, i) => {
      if (i !== memberIdx) return m
      const blocks = m.hoverBlocks.map((b, bi) => {
        if (bi !== blockIdx) return b
        const items = [...b.items]
        items[itemIdx] = value
        return { ...b, items }
      })
      return { ...m, hoverBlocks: blocks }
    })
    upd('members', updated)
  }

  const addHoverBlockItem = (memberIdx: number, blockIdx: number) => {
    const updated = members.map((m, i) => {
      if (i !== memberIdx) return m
      const blocks = m.hoverBlocks.map((b, bi) => {
        if (bi !== blockIdx) return b
        return { ...b, items: [...b.items, ''] }
      })
      return { ...m, hoverBlocks: blocks }
    })
    upd('members', updated)
  }

  const removeHoverBlockItem = (memberIdx: number, blockIdx: number, itemIdx: number) => {
    const updated = members.map((m, i) => {
      if (i !== memberIdx) return m
      const blocks = m.hoverBlocks.map((b, bi) => {
        if (bi !== blockIdx) return b
        return { ...b, items: b.items.filter((_, li) => li !== itemIdx) }
      })
      return { ...m, hoverBlocks: blocks }
    })
    upd('members', updated)
  }
```

- [ ] **Step 6: Replace the fixed "Formación (hover)" and "Enfoque (hover)" sections with a dynamic block list**

Replace lines 238-302 (the two fixed expandable sections, from `{/* Formación (hover) */}` through the closing `</div>` of the Enfoque block) with:

```tsx
              {/* Hover info blocks (dynamic) */}
              <div>
                <p className={labelCls}>Información del hover</p>
                <div className="space-y-2">
                  {cur.hoverBlocks.map((block, bi) => {
                    const key = `block-${activeMember}-${block.id}`
                    return (
                      <div key={block.id} className="border border-gray-200 rounded-lg p-2">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => toggleSection(key)}
                            className="flex-1 flex items-center justify-between text-xs font-semibold text-gray-500 uppercase py-1"
                          >
                            <span>📌 {block.title[lang] || `Bloque ${bi + 1}`}</span>
                            {expandedSections[key] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                          <button
                            onClick={() => removeHoverBlock(activeMember, bi)}
                            className="text-red-400 hover:text-red-600 p-1 flex-shrink-0"
                            title="Eliminar bloque"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        {expandedSections[key] && (
                          <div className="space-y-2 mt-1">
                            <div>
                              <label className={labelCls}>Título del bloque ({lang.toUpperCase()})</label>
                              <input
                                value={block.title[lang] ?? ''}
                                onChange={e => updHoverBlockTitle(activeMember, bi, e.target.value)}
                                className={inputCls}
                                placeholder="Ej: Idiomas, Certificaciones..."
                              />
                            </div>
                            <div className="space-y-1">
                              {block.items.map((item, li) => (
                                <div key={li} className="flex gap-1">
                                  <input
                                    value={item}
                                    onChange={e => updHoverBlockItem(activeMember, bi, li, e.target.value)}
                                    className={`${inputCls} flex-1`}
                                    placeholder="Ej: Inglés avanzado"
                                  />
                                  <button onClick={() => removeHoverBlockItem(activeMember, bi, li)} className="text-red-400 hover:text-red-600 p-1 flex-shrink-0">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                              <button onClick={() => addHoverBlockItem(activeMember, bi)}
                                className="text-xs text-brand-blue hover:text-brand-navy flex items-center gap-1 py-1">
                                <Plus size={10} /> Agregar ítem
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  <button onClick={() => addHoverBlock(activeMember)}
                    className="w-full text-xs text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg flex items-center justify-center gap-1 py-1.5">
                    <Plus size={10} /> Agregar bloque
                  </button>
                </div>
              </div>
```

- [ ] **Step 7: Verify it compiles**

Run: `cd "c:\Users\publi\Desktop\ALLURA" && npx tsc --noEmit`
Expected: no errors mentioning `TeamGridForm.tsx`

- [ ] **Step 8: Manually verify in the browser**

With the dev server running, open `/admin/paginas`, select a page with a `team_grid` section, click an existing member (e.g. "Dra. Johanna Jaramillo"). Confirm:
- The "Información del hover" area shows two blocks: "Formación" and "Enfoque", each with their existing items (proves normalization works in the form too).
- Clicking "+ Agregar bloque" adds a new empty block with an editable title.
- Typing a title updates the block header label.
- "+ Agregar ítem" adds an editable item row; typing updates it; the trash icon removes it.
- The trash icon next to a block's title removes the whole block.
- Click "Guardar sección" — confirm it saves without error and the iframe preview reflects the change (e.g. a renamed block title shows on hover).

- [ ] **Step 9: Commit**

```bash
cd "c:\Users\publi\Desktop\ALLURA"
git add src/components/admin/section-forms/TeamGridForm.tsx
git commit -m "feat: replace fixed formacion/enfoque hover fields with dynamic blocks in team grid admin form"
```

---

### Task 4: Update registry seed data to the new format

**Files:**
- Modify: `src/lib/section-registry.ts`

- [ ] **Step 1: Convert each seed member's `formacion`/`enfoque` to `hoverBlocks`**

In `src/lib/section-registry.ts`, within the `team_grid` definition's `defaultSettings.members` array (lines 100-155), replace each member's `formacion: [...]` and `enfoque: [...]` pair with a single `hoverBlocks: [...]` array using the same data. For example, replace lines 101-109:

```ts
        {
          id: 'tm1',
          name: 'Dra. Johanna Jaramillo',
          role: { es: 'Odontóloga especialista en rehabilitación oral', en: 'Dental specialist in oral rehabilitation' },
          imageUrl: '/images/equipo/Dra-Johanna-Jaramillo-Allura.avif',
          formacion: ['Universidad de Antioquia'],
          enfoque: ['Rehabilitación oral completa'],
          slug: 'johanna-jaramillo',
        },
```

with:

```ts
        {
          id: 'tm1',
          name: 'Dra. Johanna Jaramillo',
          role: { es: 'Odontóloga especialista en rehabilitación oral', en: 'Dental specialist in oral rehabilitation' },
          imageUrl: '/images/equipo/Dra-Johanna-Jaramillo-Allura.avif',
          hoverBlocks: [
            { id: 'auto-formacion', title: { es: 'Formación', en: 'Training' }, items: ['Universidad de Antioquia'] },
            { id: 'auto-enfoque', title: { es: 'Enfoque', en: 'Focus areas' }, items: ['Rehabilitación oral completa'] },
          ],
          slug: 'johanna-jaramillo',
        },
```

Apply the same transformation to the remaining five members (`tm2` through `tm6`), using each member's existing `formacion`/`enfoque` arrays as the `items` values:

- `tm2` (Dr. Santiago Henao): `formacion: ['Universidad CES']`, `enfoque: ['Cirugía maxilofacial']`
- `tm3` (Dra. Daniela Alzate): `formacion: ['Universidad Pontificia Bolivariana']`, `enfoque: ['Ortodoncia y alineadores']`
- `tm4` (Dr. Iván Darío Jiménez): `formacion: ['Universidad de Antioquia']`, `enfoque: ['Implantes dentales']`
- `tm5` (Dr. Sebastián Muñoz): `formacion: ['Universidad El Bosque']`, `enfoque: ['Estética dental avanzada']`
- `tm6` (Dr. Alejandro Cifuentes): `formacion: ['Universidad de Antioquia']`, `enfoque: ['Medicina estética facial']`

For each, the resulting `hoverBlocks` follows the same structure as `tm1` shown above, substituting the member's own `items` values and keeping `id: 'auto-formacion'` / `id: 'auto-enfoque'` and the same i18n titles.

- [ ] **Step 2: Verify it compiles**

Run: `cd "c:\Users\publi\Desktop\ALLURA" && npx tsc --noEmit`
Expected: no errors mentioning `section-registry.ts`

- [ ] **Step 3: Manually verify a brand-new section uses the new format**

With the dev server running, open the admin, add a fresh `team_grid` section ("Equipo (editable)") to a test page, select the first seed member, and confirm the "Información del hover" area shows "Formación" and "Enfoque" blocks populated from the registry defaults (proving new sections start in the `hoverBlocks` format, not the legacy one). Delete the test section afterward to keep the page clean.

- [ ] **Step 4: Commit**

```bash
cd "c:\Users\publi\Desktop\ALLURA"
git add src/lib/section-registry.ts
git commit -m "feat: seed team_grid members with hoverBlocks format in section registry"
```

---

## Final verification

- [ ] **Run full type-check**

Run: `cd "c:\Users\publi\Desktop\ALLURA" && npx tsc --noEmit`
Expected: no errors

- [ ] **Run production build**

Run: `cd "c:\Users\publi\Desktop\ALLURA" && npm run build`
Expected: build completes successfully

- [ ] **End-to-end manual check in browser**

In the admin (`/admin/paginas`), on a page with `team_grid`:
1. Open an existing member — confirm "Formación"/"Enfoque" blocks show with original data (legacy normalization).
2. Add a new block titled "Idiomas" with items "Español" and "Inglés".
3. Save the section.
4. Reload the admin page (full refresh) and reopen the same member — confirm the "Idiomas" block persisted with its items (proves it round-trips through Supabase as `hoverBlocks`).
5. In the iframe preview, hover over that member's card — confirm "Formación", "Enfoque", and "Idiomas" all appear with correct titles and items.
