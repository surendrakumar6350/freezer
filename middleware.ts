import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || typeof JWT_SECRET !== 'string' || JWT_SECRET.trim() === '') {
    throw new Error('JWT_SECRET_KEY environment variable is not set or is empty.');
}
const secret = new TextEncoder().encode(JWT_SECRET);
async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch {
        return null;
    }
}


export async function middleware(request: NextRequest) {
    const { method, url, headers } = request;

    const path = request.nextUrl.pathname;

    const token = request.cookies.get('token')?.value;

    const ip =
        headers.get("cf-connecting-ip") || // Cloudflare
        headers.get("x-forwarded-for")?.split(",")[0]?.trim() || // Vercel / proxies
        "unknown";

    const istTime = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).format(new Date());

    console.log(`[${istTime}] ${method} ${url} — IP: ${ip}`);

    if (path === '/') {
        const isValid = token && await verifyToken(token);
        if (isValid) {
            return NextResponse.redirect(new URL('/s3-explorer', request.url));
        }
    }

    // Protect admin dashboard
    if (path === '/s3-explorer') {
        const isValid = token && await verifyToken(token);
        if (!isValid) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Redirect authenticated admin away from admin login
    if (path === '/login') {
        const isValid = token && await verifyToken(token);
        if (isValid) {
            return NextResponse.redirect(new URL('/s3-explorer', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
        // Match all request paths except for:
        // - api (API routes)
        // - _next/static (static files)
        // - _next/image (image optimization files)
        // - favicon.ico, sitemap.xml, robots.txt (metadata files)
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};