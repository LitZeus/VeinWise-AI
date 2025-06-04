// Session configuration for iron-session
import { getIronSession, IronSessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  isLoggedIn: boolean;
  createdAt: number;
  expiresAt: number;
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: 'veinwise_session',
  cookieOptions: {
    // secure should be true in production
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  },
};

// Get session from request
export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  // Check if session is expired
  if (session.expiresAt && session.expiresAt < Date.now()) {
    // Clear expired session
    await session.destroy();
    return { isLoggedIn: false } as SessionData;
  }

  return session;
}

// Create a new session
export async function createSession(userData: {
  id: string;
  email: string;
  name: string;
}) {

  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  const now = Date.now();
  const expiresAt = now + sessionOptions.cookieOptions.maxAge * 1000;

  session.userId = userData.id;
  session.email = userData.email;
  session.name = userData.name;
  session.isLoggedIn = true;
  session.createdAt = now;
  session.expiresAt = expiresAt;


  await session.save();
  return session;
}

// Destroy session (logout)
export async function destroySession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  await session.destroy();
}

// Extend session (refresh)
export async function extendSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (session.isLoggedIn) {
    const now = Date.now();
    session.expiresAt = now + sessionOptions.cookieOptions.maxAge * 1000;
    await session.save();
  }

  return session;
}
