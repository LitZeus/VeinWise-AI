const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Create a new pool instance with connection details from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon PostgreSQL
});

async function checkDatabaseValues() {
  try {
    await pool.query('SELECT NOW()');

    // Get all users
    const usersResult = await pool.query('SELECT id, name, email FROM users');
    console.table(usersResult.rows);

    // For each user, get their patients and scans
    for (const user of usersResult.rows) {
      
      // Get patient count
      const patientResult = await pool.query(
        'SELECT COUNT(*) as count FROM patients WHERE user_id = $1',
        [user.id]
      );
      
      // Get scan count
      const scanResult = await pool.query(
        'SELECT COUNT(*) as count FROM scans WHERE doctor_id = $1',
        [user.id]
      );
      
      // Get recent scans
      const recentScansResult = await pool.query(
        `SELECT s.id, s.prediction_label, p.name as patient_name
         FROM scans s
         JOIN patients p ON s.patient_id = p.id
         WHERE s.doctor_id = $1
         ORDER BY s.created_at DESC
         LIMIT 5`,
        [user.id]
      );
      
      console.table(recentScansResult.rows);
    }
    
  } catch (error) {
    console.error('Error checking database values:', error);
  } finally {
    await pool.end();
  }
}

checkDatabaseValues();
