'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaCalendar, FaEdit, FaEnvelope, FaImage, FaPhone, FaUser, FaVenusMars } from 'react-icons/fa';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  created_at: string;
}

interface Scan {
  id: string;
  patient_id: string;
  doctor_id: string;
  image_url: string;
  prediction_label: string;
  confidence: number;
  created_at: string;
}

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  // Get the patient ID from params
  const patientId = params.id;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setIsLoading(true);

        // Fetch patient details
        const patientResponse = await fetch(`/api/patients/${patientId}`);

        if (!patientResponse.ok) {
          throw new Error('Failed to fetch patient');
        }

        const patientData = await patientResponse.json();
        setPatient(patientData);

        // Fetch patient's scans
        const scansResponse = await fetch(`/api/scans?patientId=${patientId}`);

        if (!scansResponse.ok) {
          throw new Error('Failed to fetch scans');
        }

        const scansData = await scansResponse.json();
        setScans(scansData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]); // Use unwrapped patientId instead of params.id

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-16 mx-6">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <div className="mt-4">
          <Link href="/patients" className="text-indigo-600 hover:text-indigo-800">
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 mt-16 mx-6">
        <p className="font-bold">Patient Not Found</p>
        <p>The requested patient could not be found.</p>
        <div className="mt-4">
          <Link href="/patients" className="text-indigo-600 hover:text-indigo-800">
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-16 p-6">
      <div className="flex justify-between items-center mb-6 animate-fadeIn">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-2 rounded-lg mr-3">
            <FaUser className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Details</h1>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/patients"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
          >
            <FaArrowLeft className="mr-2" /> Back to Patients
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient Info Card */}
        <div className="bg-white shadow rounded-lg p-6 animate-fadeIn md:col-span-1 relative">
          <div className="absolute top-4 right-4">
            <Link
              href={`/patients/${patient.id}/edit`}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all duration-300 hover:scale-105"
              title="Edit Patient"
            >
              <FaEdit className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex items-center justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-3xl">
              {patient.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-900 mb-6">{patient.name}</h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-indigo-50 p-2 rounded-full mr-3">
                <FaVenusMars className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{patient.gender}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-indigo-50 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-medium">{patient.age} years</p>
              </div>
            </div>

            {patient.email && (
              <div className="flex items-center">
                <div className="bg-indigo-50 p-2 rounded-full mr-3">
                  <FaEnvelope className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{patient.email}</p>
                </div>
              </div>
            )}

            {patient.phone && (
              <div className="flex items-center">
                <div className="bg-indigo-50 p-2 rounded-full mr-3">
                  <FaPhone className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{patient.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center">
              <div className="bg-indigo-50 p-2 rounded-full mr-3">
                <FaCalendar className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Added On</p>
                <p className="font-medium">{new Date(patient.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-indigo-50 p-2 rounded-full mr-3">
                <FaImage className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Scans</p>
                <p className="font-medium">{scans.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Scans */}
        <div className="bg-white shadow rounded-lg p-6 animate-fadeIn animation-delay-200 md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Scan History</h2>
            <Link
              href={`/upload?patientId=${patient.id}`}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
              </svg>
              Upload New Scan
            </Link>
          </div>

          {scans.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <p className="text-gray-500 mb-4">No scan results yet for this patient.</p>
              <Link
                href={`/upload?patientId=${patient.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                </svg>
                Upload First Scan
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scans.map((scan, index) => (
                <div
                  key={scan.id}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fadeIn"
                  style={{ animationDelay: `${Math.min(index * 100, 500)}ms` }}
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative overflow-hidden">
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={scan.image_url}
                      alt={`Scan for ${patient.name}`}
                      className="object-cover w-full h-full transition-opacity duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${scan.prediction_label.toLowerCase().includes('normal') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {scan.prediction_label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(scan.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">Confidence</div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${Math.round(scan.confidence * 100) > 80 ? 'bg-green-500' : Math.round(scan.confidence * 100) > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.round(scan.confidence * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{Math.round(scan.confidence * 100)}%</div>
                    </div>
                    <div className="mt-3">
                      <Link
                        href={`/scans/${scan.id}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center"
                      >
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
