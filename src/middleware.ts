import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const SITE_ID = '00000000-0000-0000-0000-000000000001'
const REDIRECT_CACHE_TTL = 5 * 60 * 1000 // 5 minutos

type RedirectEntry = { to_path: string; status_code: number }
let redirectCache: Map<string, RedirectEntry> = new Map()
let redirectCacheExpiry = 0

async function getRedirects(): Promise<Map<string, RedirectEntry>> {
  if (Date.now() < redirectCacheExpiry && redirectCache.size > 0) return redirectCache

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/redirects?site_id=eq.${SITE_ID}&select=from_path,to_path,status_code`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
        cache: 'no-store',
      }
    )
    if (res.ok) {
      const rows: { from_path: string; to_path: string; status_code: number }[] = await res.json()
      redirectCache = new Map(rows.map(r => [r.from_path, { to_path: r.to_path, status_code: r.status_code }]))
      redirectCacheExpiry = Date.now() + REDIRECT_CACHE_TTL
    }
  } catch {
    // Si falla la consulta, usa el caché anterior (puede estar vacío)
  }

  return redirectCache
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas del panel admin — verificar sesión Supabase
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

  // Rutas públicas — verificar redirects antes de i18n
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    const redirects = await getRedirects()
    const match = redirects.get(pathname)
    if (match) {
      const dest = new URL(match.to_path, request.url)
      return NextResponse.redirect(dest, { status: match.status_code })
    }
    return intlMiddleware(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
