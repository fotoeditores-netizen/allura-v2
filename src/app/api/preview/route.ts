import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug') || '/'
  const locale = request.nextUrl.searchParams.get('locale') || 'es'
  const redirectUrl = new URL(
    `/${locale}${slug === '/' ? '' : slug}?preview=true`,
    request.url
  )
  return NextResponse.redirect(redirectUrl)
}
