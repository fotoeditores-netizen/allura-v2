import { getPageBySlug, getSectionsByPage, upsertPage } from '@/lib/supabase/pages'
import { PageEditor } from '@/components/admin/PageEditor'

export default async function PageEditorRoute({
  params,
}: {
  params: { slug: string }
}) {
  // Convert URL param back to page slug
  // 'home' → '/'
  // 'nosotros' → '/nosotros'
  // 'servicios--full-mouth-reconstruction' → '/servicios/full-mouth-reconstruction'
  const rawSlug = params.slug
  const pageSlug = rawSlug === 'home' ? '/' : '/' + rawSlug.replace(/--/g, '/')

  let page = await getPageBySlug(pageSlug)
  if (!page) {
    page = await upsertPage({
      slug: pageSlug,
      title_i18n: { es: pageSlug, en: pageSlug },
      type: 'custom',
      status: 'draft',
      sort_order: 99,
    })
  }

  const sections = await getSectionsByPage(page.id)
  return <PageEditor page={page} initialSections={sections} />
}
