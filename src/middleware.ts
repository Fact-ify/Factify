import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicAdminPaths = ['/admin/login', '/admin/setup'];

  if (pathname.startsWith('/admin') && !publicAdminPaths.some((path) => pathname.startsWith(path))) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (pathname === '/admin/login' || pathname === '/admin/setup') {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (token) {
      const session = await verifySessionToken(token);
      if (session) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
