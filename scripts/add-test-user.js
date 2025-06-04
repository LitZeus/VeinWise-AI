const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Create a new pool instance with connection details from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon PostgreSQL
});

async function addTestUser() {
  try {
    await pool.query('SELECT NOW()');

    // Hash the password
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert test user
    const result = await pool.query(`
      INSERT INTO users (name, email, password, phone, gender, age)
      VALUES ('Test Doctor', 'test@example.com', $1, '123-456-7890', 'Male', 35)
      ON CONFLICT (email) DO UPDATE 
      SET password = $1
      RETURNING id
    `, [hashedPassword]);
    
    const userId = result.rows[0].id;
    
    // Insert test patients
    await pool.query(`
      INSERT INTO patients (user_id, name, age, gender)
      VALUES 
        ($1, 'Test Patient 1', 45, 'Female'),
        ($1, 'Test Patient 2', 60, 'Male'),
        ($1, 'Test Patient 3', 55, 'Female')
      ON CONFLICT DO NOTHING
    `, [userId]);
    
    // Get patient IDs
    const patientResult = await pool.query('SELECT id FROM patients WHERE user_id = $1 LIMIT 3', [userId]);
    
    // Insert sample scans for each patient
    for (const patient of patientResult.rows) {
      await pool.query(`
        INSERT INTO scans (patient_id, doctor_id, image_url, prediction_label, confidence)
        VALUES 
          ($1, $2, 'https://res.cloudinary.com/daxkemidk/image/upload/v1713615600/sample_scan_1.jpg', 'Varicose Veins - Grade 2', 0.89),
          ($1, $2, 'https://res.cloudinary.com/daxkemidk/image/upload/v1713615600/sample_scan_2.jpg', 'Normal Veins', 0.95)
        ON CONFLICT DO NOTHING
      `, [patient.id, userId]);
    }
    
  } catch (error) {
    console.error('Error adding test user:', error);
  } finally {
    await pool.end();
  }
}

addTestUser();
