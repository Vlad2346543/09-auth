import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkSession } from './lib/api/serverApi';

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPrivateRoute =
    pathname.startsWith('/notes') || pathname.startsWith('/profile');
  const isAuthRoute =
    pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();

      const setCookie = response?.headers['set-cookie'];

      if (setCookie) {
        const nextResponse = isAuthRoute
          ? NextResponse.redirect(new URL('/', request.url))
          : NextResponse.next();

        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        cookieArray.forEach(cookieStr => {
          const parsed = parse(cookieStr);
          const name = Object.keys(parsed)[0];
          const value = parsed[name];

          if (name && value) {
            nextResponse.cookies.set(name, value, {
              path: parsed.Path || '/',
              maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            });
          }
        });

        return nextResponse;
      }
    } catch {
      console.error('Middleware Refresh Error');
    }
  }

  if (isPrivateRoute && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
