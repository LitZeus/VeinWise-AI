import { createUserSession, generateToken, hashPassword, setAuthCookie } from '@/lib/auth';
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

    const { name, phone, gender, age, email, password } = await request.json();

    // Validate input
    if (!name || !phone || !gender || !age || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    const result = await query(
      'INSERT INTO users (name, phone, gender, age, email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, phone, gender, age, email, hashedPassword]
    );

    const userId = result.rows[0].id;

    // Create user object
    const userObj = {
      id: userId,
      name,
      email,
      phone,
      gender,
      age,
    };

    // Generate JWT token
    const token = generateToken(userObj);

    // Create session
    await createUserSession(userObj);

    // Create response
    const response = NextResponse.json(
      {
        message: 'User registered successfully',
        id: userId,
        user: {
          id: userId,
          name,
          email
        }
      },
      { status: 201 }
    );

    // Set auth cookie
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
