import { getServerUser } from '@/lib/auth';
import { query } from '@/lib/db';
import Link from 'next/link';

// Disable caching for this page to ensure real-time data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function checkDatabaseConnection() {
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

async function getStats() {
  try {
    // Check database connection first
    const dbStatus = await checkDatabaseConnection();
    if (!dbStatus.connected) {
      return {
        dbStatus,
        patientCount: 0,
        scanCount: 0,
        recentScans: [],
      };
    }

    const user = await getServerUser();

    // Force a cache refresh by adding a timestamp to ensure real-time data
    //const _timestamp = Date.now();

    // Get patient count for current user only
    const patientResult = await query(
      'SELECT COUNT(*) as count FROM patients WHERE user_id = $1',
      [user?.id || '']
    );

    // Get scan count for current user only
    const scanResult = await query(
      'SELECT COUNT(*) as count FROM scans WHERE doctor_id = $1',
      [user?.id || '']
    );

    // Get recent scans for current user only
    const recentScansResult = await query(
      `SELECT s.*, p.name as patient_name, p.age as patient_age, p.gender as patient_gender, u.name as doctor_name
       FROM scans s
       JOIN patients p ON s.patient_id = p.id
       JOIN users u ON s.doctor_id = u.id
       WHERE s.doctor_id = $1
       ORDER BY s.created_at DESC
       LIMIT 5`,
      [user?.id || '']
    );

    return {
      dbStatus,
      patientCount: parseInt(patientResult.rows[0].count),
      scanCount: parseInt(scanResult.rows[0].count),
      recentScans: recentScansResult.rows,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      dbStatus: { connected: false, error: error instanceof Error ? error.message : 'Unknown error' },
      patientCount: 0,
      scanCount: 0,
      recentScans: [],
    };
  }
}

export default async function DashboardPage() {
  const user = await getServerUser();

  const { dbStatus, patientCount, scanCount, recentScans } = await getStats();

  return (
    <div className="space-y-4 sm:space-y-6 relative">
      {/* Background visual elements - similar to home page */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full opacity-5 transform translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500 rounded-full opacity-5 transform -translate-x-1/3 translate-y-1/4"></div>

      {/* Vein line decorations */}
      <div className="absolute left-0 top-1/4 w-full overflow-hidden h-8 opacity-10">
        <svg width="100%" height="30" viewBox="0 0 400 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 15 Q 100 0, 200 15 Q 300 30, 400 15" stroke="indigo" strokeWidth="1" fill="none" />
        </svg>
      </div>
      <div className="absolute left-0 top-2/3 w-full overflow-hidden h-8 opacity-10">
        <svg width="100%" height="30" viewBox="0 0 400 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 15 Q 100 30, 200 15 Q 300 0, 400 15" stroke="indigo" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Header section - OPTIMIZED for mobile */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-2 sm:p-3 rounded-lg mr-2 sm:mr-3 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        </div>
        {/* Optimized button for mobile */}
        <Link
          href="/upload"
          className="inline-flex items-center justify-center px-3 sm:px-5 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors mt-2 sm:mt-0 text-xs sm:text-sm w-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
          </svg>
          Upload Scan
        </Link>
      </div>

      {!dbStatus.connected && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-xl mb-4 sm:mb-6 shadow-sm">
          <p className="font-bold">Database Connection Error</p>
          <p>{dbStatus.error}</p>
          <p className="mt-2">Please check your .env.local file.</p>
          <pre className="mt-2 bg-red-100 p-2 sm:p-3 rounded-lg text-xs overflow-x-auto border border-red-200">
            DATABASE_URL=postgres://user:password@hostname:port/database
          </pre>
          <p className="mt-2 text-xs sm:text-sm">For demo purposes, navigation will work but database operations will not.</p>
        </div>
      )}

      {/* Welcome card - OPTIMIZED for mobile */}
      <div className="bg-white shadow-md rounded-xl p-4 sm:p-8 border border-slate-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full opacity-40 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="relative z-10">
          <h2 className="text-base sm:text-lg font-medium sm:font-semibold text-gray-900 mb-1 sm:mb-2">Welcome,</h2>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-6">{user?.name || 'Doctor'}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            <div className="bg-indigo-50 p-3 sm:p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-px transform">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-600 rounded-lg p-2 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <div className="ml-3 sm:ml-5">
                  <p className="text-xs sm:text-sm font-medium text-indigo-900">Total Patients</p>
                  <h3 className="text-lg sm:text-2xl font-semibold sm:font-bold text-gray-900">{patientCount}</h3>
                </div>
              </div>
              <div className="mt-2 sm:mt-4">
                <Link href="/patients" className="text-indigo-700 hover:text-indigo-900 text-xs sm:text-sm font-medium flex items-center">
                  View all patients
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="bg-violet-50 p-3 sm:p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-px transform">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-violet-600 rounded-lg p-2 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </div>
                <div className="ml-3 sm:ml-5">
                  <p className="text-xs sm:text-sm font-medium text-violet-900">Total Scans</p>
                  <h3 className="text-lg sm:text-2xl font-semibold sm:font-bold text-gray-900">{scanCount}</h3>
                </div>
              </div>
              <div className="mt-2 sm:mt-4">
                <Link href="/results" className="text-violet-700 hover:text-violet-900 text-xs sm:text-sm font-medium flex items-center">
                  View all scans
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scans - OPTIMIZED for mobile */}
      <div className="bg-white shadow-md rounded-xl p-3 sm:p-6 border border-slate-100 hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-center mb-3 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
              </svg>
            </div>
            <h2 className="text-sm sm:text-base font-medium sm:font-semibold text-gray-900">Recent Scan Results</h2>
          </div>
          {recentScans.length > 0 && (
            <Link href="/results" className="text-indigo-600 hover:text-indigo-800 text-xs sm:text-sm font-medium flex items-center">
              View all
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        {recentScans.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm">No scan results yet. Upload your first scan!</p>
            <Link
              href="/upload"
              className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 border border-transparent text-xs sm:text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
              </svg>
              Upload Scan
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border border-slate-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                        Patient
                      </th>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider hidden sm:table-cell">
                        Prediction
                      </th>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider hidden md:table-cell">
                        Confidence
                      </th>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {recentScans.map((scan) => (
                      <tr key={scan.id} className="hover:bg-slate-50 transition-all duration-200">
                        <td className="px-2 py-2 sm:py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-6 w-6 sm:h-10 sm:w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-normal sm:font-medium shadow-sm text-xs sm:text-base">
                              {scan.patient_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-2 sm:ml-3">
                              <div className="text-xs sm:text-sm font-normal sm:font-medium text-gray-900">{scan.patient_name}</div>
                              <div className="text-xs text-gray-500">{scan.patient_age} y, {scan.patient_gender}</div>
                              <div className="text-xs text-indigo-600 sm:hidden">{scan.prediction_label}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-2 sm:py-3 whitespace-nowrap hidden sm:table-cell">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium sm:font-semibold rounded-lg ${
                            scan.prediction_label.includes('Normal')
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {scan.prediction_label}
                          </span>
                        </td>
                        <td className="px-2 py-2 sm:py-3 whitespace-nowrap hidden md:table-cell">
                          <div className="w-full bg-slate-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
                            <div
                              className={`h-2 sm:h-2.5 rounded-full ${
                                Math.round(scan.confidence * 100) > 80
                                  ? 'bg-green-500'
                                  : Math.round(scan.confidence * 100) > 60
                                    ? 'bg-amber-500'
                                    : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.round(scan.confidence * 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{Math.round(scan.confidence * 100)}%</div>
                        </td>
                        <td className="px-2 py-2 sm:py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-slate-100 p-1 rounded-md mr-1 sm:mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="text-xs text-gray-600">
                              {new Date(scan.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}