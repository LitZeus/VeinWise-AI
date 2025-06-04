import { getCurrentUser } from '@/lib/auth';
import { checkDatabaseConnection, query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check database connection first
    const dbStatus = await checkDatabaseConnection();
    if (!dbStatus.connected) {
      return NextResponse.json(
        { message: dbStatus.error },
        { status: 503 }
      );
    }

    // Get current user
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get patients for the current doctor with scan counts
    const result = await query(
      `SELECT
        p.*,
        COALESCE(COUNT(s.id), 0) as scan_count
      FROM
        patients p
      LEFT JOIN
        scans s ON p.id = s.patient_id
      WHERE
        p.user_id = $1
      GROUP BY
        p.id
      ORDER BY
        p.name ASC`,
      [user.id]
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Get current user
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, age, gender } = await request.json();

    // Validate input
    if (!name || !age || !gender) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Insert new patient
    const result = await query(
      'INSERT INTO patients (user_id, name, age, gender) VALUES ($1, $2, $3, $4) RETURNING id',
      [user.id, name, age, gender]
    );

    return NextResponse.json(
      { message: 'Patient created successfully', id: result.rows[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
