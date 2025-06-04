import { Pool } from 'pg';

// Create a new pool instance with connection details from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon PostgreSQL
});

// Helper function to execute SQL queries
export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
}

// Check if the database is connected
export async function checkDatabaseConnection() {
  try {
    // Try a simple query to check if the database is connected
    await query('SELECT 1');
    return { connected: true, error: null };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      connected: false,
      error: 'Could not connect to the database. Please check your DATABASE_URL in .env.local'
    };
  }
}

// Export the pool for direct use if needed
export { pool };

