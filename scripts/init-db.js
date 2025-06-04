const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Create a new pool instance with connection details from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon PostgreSQL
});

// SQL to create the tables
const createTablesSql = `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  gender TEXT,
  age INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create scans table
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  doctor_id UUID REFERENCES users(id),
  image_url TEXT NOT NULL,
  prediction_label TEXT,
  confidence DOUBLE PRECISION,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// Insert sample data functions
async function insertSampleData() {
  try {
    // Insert a sample user (doctor)
    await pool.query(`
      INSERT INTO users (name, email, password, phone, gender, age)
      VALUES ('Dr. John Smith', 'john@example.com', '$2a$10$JwRxrEwDEgTXVPrYrFYGxeP9Xr8fVJ.dvHFolUHxgCbHCrQQUa3hy', '123-456-7890', 'Male', 45)
      ON CONFLICT (email) DO NOTHING;
    `);

    // Get the user ID
    const doctorResult = await pool.query("SELECT id FROM users WHERE email = 'john@example.com'");
    const doctorId = doctorResult.rows[0].id;

    // Insert sample patients
    await pool.query(`
      INSERT INTO patients (user_id, name, age, gender)
      VALUES
        ($1, 'Alice Johnson', 65, 'Female'),
        ($1, 'Bob Williams', 58, 'Male'),
        ($1, 'Carol Davis', 72, 'Female')
      ON CONFLICT DO NOTHING;
    `, [doctorId]);

    // Get patient IDs
    const patientResult = await pool.query('SELECT id FROM patients WHERE user_id = $1 LIMIT 3', [doctorId]);

    // Insert sample scans for each patient
    for (const patient of patientResult.rows) {
      await pool.query(`
        INSERT INTO scans (patient_id, doctor_id, image_url, prediction_label, confidence)
        VALUES
          ($1, $2, 'https://res.cloudinary.com/daxkemidk/image/upload/v1713615600/sample_scan_1.jpg', 'Varicose Veins - Grade 2', 0.89),
          ($1, $2, 'https://res.cloudinary.com/daxkemidk/image/upload/v1713615600/sample_scan_2.jpg', 'Normal Veins', 0.95)
        ON CONFLICT DO NOTHING;
      `, [patient.id, doctorId]);
    }

  } catch (error) {
    console.error('Error inserting sample data:', error);
    throw error;
  }
}

async function initDb() {
  try {
    await pool.query('SELECT NOW()');

    await pool.query(createTablesSql);

    await insertSampleData();
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

initDb();
