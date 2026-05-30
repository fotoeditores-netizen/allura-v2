'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

const PROTECTED_SLUGS = ['/', '/nosotros', '/servicios', '/contacto', '/blog', '/equipo', '/galeria', '/como-funciona']

export function DeletePageButton({ pageId, slug, title }: { pageId: string; slug: string; title: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isProtected = PROTECTED_SLUGS.includes(slug)

  if (isProtected) {
    return (
      <span title="Esta página del sitio no se puede eliminar" className="px-3 py-2 text-gray-300 cursor-not-allowed">
        <Trash2 size={14} />
      </span>
    )
  }

  async function handleDelete() {
    setDeleting(true)
    const res = await fetch(`/api/admin/pages/${pageId}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      alert('Error al eliminar la página')
      setDeleting(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-600 font-medium">¿Eliminar "{title}"?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {deleting ? 'Eliminando...' : 'Sí, eliminar'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1 border border-gray-300 text-gray-600 text-xs rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-3 py-2 text-gray-400 hover:text-red-500 transition-colors"
      title="Eliminar página"
    >
      <Trash2 size={14} />
    </button>
  )
}
