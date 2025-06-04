import { clearAuthCookie, destroyUserSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Ensure this route is not cached
export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest) {
  try {

    // Destroy the session
    await destroyUserSession();

    // Create response
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    // Clear auth cookie
    clearAuthCookie(response);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
