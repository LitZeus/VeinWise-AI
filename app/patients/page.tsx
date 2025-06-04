'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaFilter, FaSearch, FaSort, FaSortDown, FaSortUp, FaUserPlus } from 'react-icons/fa';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  created_at: string;
  scan_count: number;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');

  // Sorting states
  const [sortField, setSortField] = useState<keyof Patient>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/patients');

        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }

        const data = await response.json();
        setPatients(data);
        setFilteredPatients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...patients];

    // Apply search
    if (searchTerm) {
      result = result.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
      );
    }

    // Apply age filter
    if (ageFilter !== 'all') {
      if (ageFilter === 'under18') {
        result = result.filter(patient => patient.age < 18);
      } else if (ageFilter === '18to40') {
        result = result.filter(patient => patient.age >= 18 && patient.age <= 40);
      } else if (ageFilter === '41to60') {
        result = result.filter(patient => patient.age >= 41 && patient.age <= 60);
      } else if (ageFilter === 'over60') {
        result = result.filter(patient => patient.age > 60);
      }
    }

    // Apply gender filter
    if (genderFilter !== 'all') {
      result = result.filter(patient => patient.gender.toLowerCase() === genderFilter.toLowerCase());
    }

    // Apply sorting
    result.sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredPatients(result);
  }, [patients, searchTerm, ageFilter, genderFilter, sortField, sortDirection]);

  const handleSort = (field: keyof Patient) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Patient) => {
    if (field !== sortField) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortDirection === 'asc' ? <FaSortUp className="ml-1 text-indigo-500" /> : <FaSortDown className="ml-1 text-indigo-500" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with branding */}
        <div className="mb-6 flex items-center">
          <div className="bg-indigo-900 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">VeinWise</h1>
        </div>

        {/* Main content area */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Page header */}
          <div className="bg-indigo-900 text-white p-4 sm:p-6 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600 rounded-full opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500 rounded-full opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>

            {/* Header content */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="flex items-center">
                <div className="bg-white rounded-lg p-1.5 sm:p-2 mr-2 sm:mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-medium sm:font-semibold text-gray-900">Patient Management</h2>
                  <p className="text-indigo-100 opacity-90 text-xs sm:text-sm hidden sm:block">
                    View, filter, and manage your patients
                  </p>
                </div>
              </div>
              <Link
                href="/patients/add"
                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-indigo-900 bg-white hover:bg-indigo-50 transition-all duration-300 hover:shadow-lg"
              >
                <FaUserPlus className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Add New</span> Patient
              </Link>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {/* Search */}
              <div className="col-span-1 md:col-span-2">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 text-xs sm:text-sm"
                    placeholder="Search by name, email or phone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Age Filter */}
              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFilter className="text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                  </div>
                  <select
                    id="ageFilter"
                    className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 text-xs sm:text-sm"
                    value={ageFilter}
                    onChange={(e) => setAgeFilter(e.target.value)}
                  >
                    <option value="all">All Ages</option>
                    <option value="under18">Under 18</option>
                    <option value="18to40">18-40</option>
                    <option value="41to60">41-60</option>
                    <option value="over60">Over 60</option>
                  </select>
                </div>
              </div>

              {/* Gender Filter */}
              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFilter className="text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                  </div>
                  <select
                    id="genderFilter"
                    className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 text-xs sm:text-sm"
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                  >
                    <option value="all">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Patient List */}
          <div className="overflow-hidden">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 m-6 rounded flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500 mb-4">No patients found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setAgeFilter('all');
                    setGenderFilter('all');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors duration-200"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Name {getSortIcon('name')}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors duration-200"
                        onClick={() => handleSort('age')}
                      >
                        <div className="flex items-center">
                          Age {getSortIcon('age')}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors duration-200"
                        onClick={() => handleSort('gender')}
                      >
                        <div className="flex items-center">
                          Gender {getSortIcon('gender')}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors duration-200"
                        onClick={() => handleSort('scan_count')}
                      >
                        <div className="flex items-center">
                          Scans {getSortIcon('scan_count')}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors duration-200"
                        onClick={() => handleSort('created_at')}
                      >
                        <div className="flex items-center">
                          Added On {getSortIcon('created_at')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px] md:w-[180px]">
                        <span className="hidden sm:inline">Actions</span>
                        <span className="sm:hidden">Act</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPatients.map((patient, index) => (
                      <tr key={patient.id} className="hover:bg-gray-50 transition-all duration-200" style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-normal sm:font-medium transition-transform duration-300 hover:scale-110">
                              {patient.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <div className="text-xs sm:text-sm font-normal sm:font-medium text-gray-900">{patient.name}</div>
                              <div className="text-xs text-gray-500">{patient.email || 'No email provided'}</div>
                              {patient.phone && <div className="text-xs text-gray-500">{patient.phone}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium sm:font-semibold rounded-full ${
                            patient.gender.toLowerCase() === 'male'
                              ? 'bg-indigo-100 text-indigo-800'
                              : patient.gender.toLowerCase() === 'female'
                                ? 'bg-violet-100 text-violet-800'
                                : 'bg-purple-100 text-purple-800'
                          }`}>
                            {patient.gender}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium sm:font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            {patient.scan_count}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(patient.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium w-[120px] md:w-[180px]">
                          <div className="flex items-center justify-center space-x-2">
                            {/* View button - visible on all devices */}
                            <Link
                              href={`/patients/${patient.id}`}
                              className="text-indigo-600 hover:text-indigo-900 inline-flex items-center justify-center transition-all duration-200 hover:scale-105 bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md min-w-[32px] sm:min-w-[70px]"
                              title="View Patient"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span className="hidden sm:inline ml-1">View</span>
                            </Link>

                            {/* Scan button - visible on all devices */}
                            <Link
                              href={`/upload?patientId=${patient.id}`}
                              className="text-indigo-600 hover:text-indigo-900 inline-flex items-center justify-center transition-all duration-200 hover:scale-105 bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md min-w-[32px] sm:min-w-[70px]"
                              title={patient.scan_count > 0 ? "New Scan" : "First Scan"}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                              </svg>
                              <span className="hidden sm:inline ml-1">{patient.scan_count > 0 ? "New Scan" : "Scan"}</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer info */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                <span>VeinWise Clinical Vascular Intelligence</span>
                <span className="mx-2">•</span>
                <span>HIPAA Compliant</span>
              </div>
              <div className="text-xs text-gray-500">
                {filteredPatients.length} patients displayed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}