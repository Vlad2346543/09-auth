import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from '@/lib/api/serverApi';

export default async function proxy(request: NextRequest) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');

  const isAuthPage =
    request.nextUrl.pathname.startsWith('/sign-in') ||
    request.nextUrl.pathname.startsWith('/sign-up');

  const isPrivatePage =
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/notes');

  let isAuthenticated = false;


  if (accessToken) {
    isAuthenticated = true;
  }

 
  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();

   
      if (response?.data) {
        isAuthenticated = true;
      }


      const setCookieHeader = response.headers['set-cookie'];

      if (setCookieHeader) {
        const nextResponse = NextResponse.next();

        setCookieHeader.forEach((cookie: string) => {
          nextResponse.headers.append('set-cookie', cookie);
        });

        return nextResponse;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && isPrivatePage) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};