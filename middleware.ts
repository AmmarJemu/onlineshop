// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const publicRoutes = [
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api(.*)',
  '/all-products(.*)',
  '/product(.*)'
];

export default clerkMiddleware(async (auth, req) => {
  // Check if current route is public
  const isPublic = publicRoutes.some(path => 
    new RegExp(`^${path.replace('*', '.*')}$`).test(req.nextUrl.pathname)
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // Handle protected routes
  try {
    const session = await auth();
    if (!session.userId) {
      // Properly handle redirect without method chaining
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};