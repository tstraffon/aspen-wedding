import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if user has the auth cookie
  const hasAuth = request.cookies.get('site-authenticated')

  // Allow access to the password page and API routes
  if (request.nextUrl.pathname === '/password' ||
      request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // If not authenticated, redirect to password page
  if (!hasAuth) {
    return NextResponse.redirect(new URL('/password', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}