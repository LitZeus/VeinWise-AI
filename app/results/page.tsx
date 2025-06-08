'use client';

import ScanResults from '@/components/ScanResults';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function ResultsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-100 p-0 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Main content area */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Page header */}
          <div className="bg-indigo-900 text-white p-6 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600 rounded-full opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500 rounded-full opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>

            {/* Header content */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <div className="flex items-center">
                <div className="bg-white rounded-lg p-2 mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Scan Results</h2>
                  <p className="text-indigo-100 opacity-90 text-sm">
                    View and analyze vascular scan results
                  </p>
                </div>
              </div>
              <div className="relative group w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 sm:text-sm text-gray-900"
                  placeholder="Search results..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Results content */}
          <div className="p-4 sm:p-6">
            <ScanResults searchQuery={searchQuery} />
          </div>

          {/* Footer info */}
          <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div className="text-xs text-gray-500">
                <span>VeinWise Clinical Vascular Intelligence</span>
                <span className="mx-2 hidden sm:inline">•</span>
                <span className="block sm:inline">HIPAA Compliant</span>
              </div>
              <div className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}