import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
const publicRoutes = ['/signin'];
const normalizePath = (pathname: string) => pathname.replace(/\/$/, '').toString()
const isAuthRoute = (pathname: string) =>
    publicRoutes.some((route) => !normalizePath(pathname).startsWith(normalizePath(route)));


export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('access_token')?.value;
    if (!isAuthRoute(pathname) && !token) {
        return NextResponse.next()
    }
    if (!isAuthRoute(pathname) && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }
    if (isAuthRoute(pathname) && !token) {


        return NextResponse.redirect(new URL('/signin', request.nextUrl))
    }
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
