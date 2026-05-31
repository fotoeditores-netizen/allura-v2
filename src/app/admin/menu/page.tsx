import { getMenuItems } from '@/lib/supabase/menu'
import { MenuEditor } from './MenuEditor'

export default async function MenuPage() {
  const items = await getMenuItems()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#051c33]">Editor de menú</h1>
        <p className="text-sm text-[#8b9fb3] mt-1">
          Agrega, edita o elimina items del menú de navegación. Los submenús aparecen como desplegables.
        </p>
      </div>
      <MenuEditor initialItems={items} />
    </div>
  )
}
