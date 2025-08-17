import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user is authenticated (in a real app, verify JWT)
  const authToken = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!authToken || 
    typeof window !== 'undefined' && localStorage.getItem('auth_token');

  // Public routes that don't require authentication
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If accessing a protected route without authentication, redirect to login
  if (!isPublicRoute && !isAuthenticated && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If accessing login while authenticated, redirect to today
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/today', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|sw.js).*)',
  ],
};