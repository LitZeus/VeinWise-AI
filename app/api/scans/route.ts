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

    // Check if patientId is provided as a query parameter
    const url = new URL(request.url);
    const patientId = url.searchParams.get('patientId');

    let queryText;
    let queryParams;

    if (patientId) {
      // Get scans for a specific patient
      queryText = `
        SELECT s.*, p.name as patient_name, p.age as patient_age, p.gender as patient_gender
        FROM scans s
        JOIN patients p ON s.patient_id = p.id
        WHERE s.doctor_id = $1 AND s.patient_id = $2
        ORDER BY s.created_at DESC
      `;
      queryParams = [user.id, patientId];
    } else {
      // Get all scans for the current doctor
      queryText = `
        SELECT s.*, p.name as patient_name, p.age as patient_age, p.gender as patient_gender
        FROM scans s
        JOIN patients p ON s.patient_id = p.id
        WHERE s.doctor_id = $1
        ORDER BY s.created_at DESC
      `;
      queryParams = [user.id];
    }

    // Execute the query
    const result = await query(queryText, queryParams);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching scans:', error);
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

    const { patient_id, image_url, prediction_label, confidence } = await request.json();

    // Validate input
    if (!patient_id || !image_url || !prediction_label || confidence === undefined) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Insert new scan
    const result = await query(
      `INSERT INTO scans (patient_id, doctor_id, image_url, prediction_label, confidence)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [patient_id, user.id, image_url, prediction_label, confidence]
    );

    return NextResponse.json(
      { message: 'Scan created successfully', id: result.rows[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating scan:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
