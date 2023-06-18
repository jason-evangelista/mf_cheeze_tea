import { NextRequest, NextResponse } from 'next/server';
import { useGetSession as getSession } from './utils/useGetSession';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const getCookie = req.cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? '');
  const pathname = req.nextUrl.pathname;
  const session = await getSession({
    type: 'SERVER',
    serverCookie: getCookie?.value,
  });

  if (session?.user) {
    if (pathname.includes('/sign-in')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return res;
  } else {
    if (pathname.includes('/sign-in')) {
      return res;
    }
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
}

export const config = {
  matcher: ['/sign-in', '/dashboard'],
};
