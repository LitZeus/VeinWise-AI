import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This function must be marked `async` when using `await`
export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register' || path === '/';

  // Get the token from the cookies
  const token = request.cookies.get('auth_token')?.value || '';

  // Simple check if token exists
  let isUserAuthenticated = false;

  if (token) {
    try {
      // Try to verify the token (basic check)
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        isUserAuthenticated = true;
      } else {
      }
    } catch (error) {
      console.error('Middleware: Error verifying token:', error);
    }
  }


  // If token exists but is invalid, clear it
  if (token && !isUserAuthenticated) {
    const response = NextResponse.next();
    response.cookies.delete('auth_token');
    return response;
  }

  // Redirect logic
  if (isPublicPath && isUserAuthenticated) {
    // If user is logged in and tries to access public path, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicPath && !isUserAuthenticated) {
    // If user is not logged in and tries to access protected path, redirect to login
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', path); // Add the redirect parameter
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard',
    '/upload',
    '/results',
    '/profile',
    '/settings',
    '/scans/:path*',
  ],
};
