import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET a single patient by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Await params to get the ID
    const { id: patientId } = await params;
    
    // Get patient by ID (only if it belongs to the current user)
    const result = await query(
      'SELECT * FROM patients WHERE id = $1 AND user_id = $2',
      [patientId, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE a patient
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Await params to get the ID
    const { id: patientId } = await params;

    // Check if patient exists and belongs to the current user
    const checkResult = await query(
      'SELECT id FROM patients WHERE id = $1 AND user_id = $2',
      [patientId, user.id]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'Patient not found or you do not have permission to update this patient' },
        { status: 404 }
      );
    }

    const { name, age, gender, email, phone } = await request.json();

    // Validate required fields
    if (!name || !age || !gender) {
      return NextResponse.json(
        { message: 'Name, age, and gender are required' },
        { status: 400 }
      );
    }

    // Update patient
    const result = await query(
      `UPDATE patients
       SET name = $1, age = $2, gender = $3, email = $4, phone = $5, updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [name, age, gender, email || null, phone || null, patientId, user.id]
    );

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE a patient
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Await params to get the ID
    const { id: patientId } = await params;

    // Check if patient exists and belongs to the current user
    const checkResult = await query(
      'SELECT id FROM patients WHERE id = $1 AND user_id = $2',
      [patientId, user.id]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'Patient not found or you do not have permission to delete this patient' },
        { status: 404 }
      );
    }

    // Check if patient has associated scans
    const scanResult = await query(
      'SELECT COUNT(*) as count FROM scans WHERE patient_id = $1',
      [patientId]
    );

    if (parseInt(scanResult.rows[0].count) > 0) {
      return NextResponse.json(
        { message: 'Cannot delete patient with associated scans. Please delete the scans first.' },
        { status: 400 }
      );
    }

    // Delete patient
    await query(
      'DELETE FROM patients WHERE id = $1 AND user_id = $2',
      [patientId, user.id]
    );

    return NextResponse.json(
      { message: 'Patient deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}