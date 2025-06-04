import { comparePassword, createUserSession, generateToken, setAuthCookie } from '@/lib/auth';
import { checkDatabaseConnection, query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check database connection first
    const dbStatus = await checkDatabaseConnection();
    if (!dbStatus.connected) {
      return NextResponse.json(
        { message: dbStatus.error },
        { status: 503 }
      );
    }

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create user object
    const userObj = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      age: user.age,
    };

    // Generate JWT token
    const token = generateToken(userObj);

    // Create session
    await createUserSession(userObj);

    // Create response
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      },
      { status: 200 }
    );

    // Set auth cookie
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
