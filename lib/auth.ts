import bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { createSession, destroySession, getSession, SessionData } from './session';

// Constants
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use a secure secret in production
const TOKEN_EXPIRY = '7d'; // Token expires in 7 days

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
}

export interface UserWithPassword extends User {
  password: string;
}

// Hash a password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Compare a password with a hash using bcrypt
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate a JWT token
export function generateToken(user: User): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  return sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

// Verify a JWT token
interface DecodedToken {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

// Verify a JWT token
export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Set auth cookie
export function setAuthCookie(response: NextResponse, token: string): NextResponse {

  response.cookies.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: false, // Set to false for local development
    sameSite: 'lax', // Changed to lax for better compatibility
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return response;
}

// Clear auth cookie
export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: 'auth_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
}

// Get current user from request
export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  return decoded as User;
}

// Get current user from server component
export async function getServerUser(): Promise<User | null> {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      return null;
    }

    return {
      id: session.userId,
      name: session.name,
      email: session.email,
      phone: '', // These fields are not stored in the session
      gender: '',
      age: 0,
    };
  } catch (error) {
    console.error('Error getting server user:', error);
    return null;
  }
}

// Middleware to check if user is authenticated
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(request);
  return !!user;
}

// Create a new user session
export async function createUserSession(user: User): Promise<SessionData> {
  return await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
  });
}

// Destroy user session (logout)
export async function destroyUserSession(): Promise<void> {
  await destroySession();
}
