import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
const publicRoutes = ['signin'];
const normalizePath = (pathname: string) => pathname.replace(/\/$/, '').toString()
const isAuthRoute = (pathname: string) =>
    publicRoutes.some((route) => !normalizePath(pathname).startsWith(normalizePath(route)));


export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if (!isAuthRoute(pathname)) {
        return NextResponse.next(request);
    }

    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|signin|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
