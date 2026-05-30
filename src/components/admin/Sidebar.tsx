'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, FileText, Stethoscope, BookOpen,
  Users, Star, Image, HelpCircle, Mail, ArrowLeftRight,
  Settings, UserCog, LogOut, Video, Megaphone, MousePointerClick
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/paginas', label: 'Páginas', icon: FileText },
  { href: '/admin/servicios', label: 'Servicios', icon: Stethoscope },
  { href: '/admin/blog', label: 'Blog', icon: BookOpen },
  { href: '/admin/equipo', label: 'Equipo', icon: Users },
  { href: '/admin/testimonios', label: 'Testimonios', icon: Star },
  { href: '/admin/galeria', label: 'Galería', icon: Image },
  { href: '/admin/medios', label: 'Medios', icon: Video },
  { href: '/admin/videos', label: 'Videos', icon: Video },
  { href: '/admin/faq', label: 'Preguntas frecuentes', icon: HelpCircle },
  { href: '/admin/promociones', label: 'Promociones', icon: Megaphone },
  { href: '/admin/popups', label: 'Popups', icon: MousePointerClick },
  { href: '/admin/formularios', label: 'Formularios', icon: Mail },
  { href: '/admin/redirects', label: 'Redirecciones', icon: ArrowLeftRight },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
  { href: '/admin/usuarios', label: 'Usuarios', icon: UserCog },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createBrowserSupabaseClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen bg-[#051c33] flex flex-col shrink-0">
      <div className="p-6 border-b border-[#8b9fb3]/20">
        <h1 className="text-white font-bold text-lg">Allura Panel</h1>
        <p className="text-[#8b9fb3] text-xs mt-1">Administración del sitio</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-[#8b9fb3]/20 text-white'
                  : 'text-[#8b9fb3] hover:text-white hover:bg-[#8b9fb3]/10'
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-[#8b9fb3]/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#8b9fb3] hover:text-white hover:bg-[#8b9fb3]/10 w-full transition-colors"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
