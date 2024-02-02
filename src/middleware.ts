import { NextRequest, NextResponse } from 'next/server';
import { useGetSession as getSession } from './utils/useGetSession';

export async function middleware(req: NextRequest) {
  const isMaintenance = process.env.MAINTENANCE ?? '';
  console.log({ isMaintenance });
  const res = NextResponse.next();
  
  if (isMaintenance === '1') {
    return NextResponse.redirect(new URL('/m', req.url));
  }

  const getCookie = req.cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? '');
  const pathname = req.nextUrl.pathname;
  const session = await getSession({
    type: 'SERVER',
    serverCookie: getCookie?.value,
  });

  if (session?.user?.account_type === 'SUPER') {
    if (session?.user) {
      if (
        pathname.includes('/sign-in') ||
        pathname.includes('/reset-password')
      ) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return res;
    } else {
      if (
        pathname.includes('/sign-in') ||
        pathname.includes('/reset-password')
      ) {
        return res;
      }
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  } else {
    if (session?.user) {
      if (
        pathname.includes('/sign-in') ||
        pathname.includes('/reset-password') ||
        pathname.includes('/dashboard') ||
        pathname.includes('/sales-report') ||
        pathname.includes('/manage-user') ||
        pathname.includes('/products')
      ) {
        return NextResponse.redirect(new URL('/orders', req.url));
      }
      return res;
    } else {
      if (
        pathname.includes('/sign-in') ||
        pathname.includes('/reset-password')
      ) {
        return res;
      }
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }
}

export const config = {
  matcher: [
    '/sign-in',
    '/dashboard',
    '/products/:path*',
    '/orders',
    '/sales-report',
    '/create-order',
    '/manage-user',
    '/reset-password',
  ],
};
