import { auth } from '@/lib/auth/auth';

export const config = {
  matcher: ['/admin/:path*'],
};

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== '/login') {
    const newUrl = new URL('/login', req.nextUrl.origin);
    newUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return Response.redirect(newUrl);
  }
});
