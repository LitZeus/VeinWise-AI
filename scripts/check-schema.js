const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Create a new pool instance with connection details from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon PostgreSQL
});

async function checkSchema() {
  try {
    await pool.query('SELECT NOW()');

    // Check if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    tablesResult.rows.forEach(row => {
    });

    // Check patients table columns
    const patientsColumnsResult = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'patients'
    `);

    patientsColumnsResult.rows.forEach(row => {
    });

    // Check users table columns
    const usersColumnsResult = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users'
    `);

    usersColumnsResult.rows.forEach(row => {
    });

    // Check scans table columns
    const scansColumnsResult = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'scans'
    `);

    scansColumnsResult.rows.forEach(row => {
    });

  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    await pool.end();
  }
}

checkSchema();
