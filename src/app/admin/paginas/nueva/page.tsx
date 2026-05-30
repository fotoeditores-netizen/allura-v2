'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NuevaPaginaPage() {
  const router = useRouter()
  const [titleEs, setTitleEs] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState<string | null>(null)

  function slugify(value: string) {
    return value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
  }

  function handleTitleChange(value: string) {
    setTitleEs(value)
    setSlug(slugify(value))
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!slug) { setError('El slug es requerido'); return }

    const res = await fetch('/api/admin/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: `/${slug}`,
        title_i18n: { es: titleEs, en: titleEn || titleEs },
        type: 'custom',
        status: 'draft',
        sort_order: 99,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'Error al crear la página')
      return
    }

    const page = await res.json()
    // Navigate to editor using the slug param convention
    const slugParam = slug.replace(/\//g, '--')
    router.push(`/admin/paginas/${slugParam}`)
  }

  const inputCls = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33]'
  const labelCls = 'block text-sm font-medium text-[#051c33] mb-1'

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#051c33]">Nueva página</h1>
        <p className="text-sm text-[#8b9fb3] mt-1">
          Crea una página personalizada y agrégale secciones desde el editor visual.
        </p>
      </div>

      <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <div>
          <label className={labelCls}>Título (Español) *</label>
          <input
            value={titleEs}
            onChange={e => handleTitleChange(e.target.value)}
            className={inputCls}
            placeholder="Ej: Promoción de junio"
            required
          />
        </div>

        <div>
          <label className={labelCls}>Title (English)</label>
          <input
            value={titleEn}
            onChange={e => setTitleEn(e.target.value)}
            className={inputCls}
            placeholder="Ex: June promotion"
          />
        </div>

        <div>
          <label className={labelCls}>Slug (URL) *</label>
          <div className="flex items-center gap-1">
            <span className="text-sm text-[#8b9fb3]">allura.co/es/</span>
            <input
              value={slug}
              onChange={e => setSlug(slugify(e.target.value))}
              className={inputCls}
              placeholder="promocion-junio"
              required
            />
          </div>
          <p className="text-xs text-[#8b9fb3] mt-1">
            Solo letras minúsculas, números y guiones. Se genera automáticamente del título.
          </p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-[#051c33] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#051c33]/90 transition-colors"
          >
            Crear y editar
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/paginas')}
            className="border border-[#8b9fb3]/40 text-[#051c33] px-5 py-2 rounded-lg text-sm hover:bg-[#eaeeef] transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
