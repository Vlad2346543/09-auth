import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from '@/lib/api/serverApi';

export default async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  
const accessToken = cookieStore.get('accessToken')?.value;
const refreshToken = cookieStore.get('refreshToken')?.value;

  const isAuthPage =
    request.nextUrl.pathname.startsWith('/sign-in') ||
    request.nextUrl.pathname.startsWith('/sign-up');

  const isPrivatePage =
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/notes');

  let isAuthenticated = !!accessToken;
  let refreshedResponse: NextResponse | null = null;

 
  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();

      const setCookieHeader = response.headers['set-cookie'];

      if (setCookieHeader) {
        refreshedResponse = NextResponse.next();

        const cookiesArray = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];

        cookiesArray.forEach((cookie) => {
          refreshedResponse!.headers.append('set-cookie', cookie);
        });
      }

      if (response?.data) {
        isAuthenticated = true;
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


  if (refreshedResponse) {
    return refreshedResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};