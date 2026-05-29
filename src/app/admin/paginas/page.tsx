import { getPages } from '@/lib/supabase/pages'
import Link from 'next/link'

export default async function PaginasPage() {
  const pages = await getPages()

  const statusLabel: Record<string, string> = {
    published: 'Publicada',
    draft: 'Borrador',
    archived: 'Archivada',
  }
  const statusColor: Record<string, string> = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-gray-100 text-gray-600',
    archived: 'bg-red-100 text-red-600',
  }

  function pageToSlugParam(slug: string): string {
    if (slug === '/') return 'home'
    return slug.replace(/^\//, '').replace(/\//g, '--')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#051c33]">Páginas</h1>
          <p className="text-sm text-[#8b9fb3] mt-1">
            Edita el contenido y las secciones de cada página del sitio.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Página
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Slug
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Estado
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pages.map(page => (
              <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-[#051c33]">
                  {page.title_i18n?.es ?? page.slug}
                </td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                  {page.slug}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[page.status] ?? statusColor.draft}`}
                  >
                    {statusLabel[page.status] ?? page.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/paginas/${pageToSlugParam(page.slug)}`}
                    className="px-4 py-2 bg-[#051c33] text-white text-xs font-medium rounded-lg hover:bg-[#051c33]/90 transition-colors"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pages.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            No hay páginas aún. Ejecuta el archivo{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">supabase/migrations/008_seed_pages.sql</code>{' '}
            en el SQL Editor de Supabase.
          </div>
        )}
      </div>
    </div>
  )
}
