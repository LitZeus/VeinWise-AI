'use client';

import PatientForm from '@/components/PatientForm';
import ScanUpload from '@/components/ScanUpload';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function UploadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPatientId = searchParams.get('patientId');

  const [step, setStep] = useState<'patient' | 'scan'>(urlPatientId ? 'scan' : 'patient');
  const [patientId, setPatientId] = useState<string | null>(urlPatientId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePatientCreated = (id: string) => {
    setPatientId(id);
    setStep('scan');
  };

  const handleUploadComplete = async (result: { imageUrl: string; predictionLabel: string; confidence: number }) => {
    try {
      setLoading(true);
      setError(null);

      // Save the scan result to the database
      const response = await fetch('/api/scans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          image_url: result.imageUrl,
          prediction_label: result.predictionLabel,
          confidence: result.confidence,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save scan result');
      }

      setSuccess('Scan uploaded and analyzed successfully!');

      setTimeout(() => {
        router.push('/results');
      }, 2000);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-0 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with branding */}
        <div className="mb-6 flex items-center px-4 sm:px-0">
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
          <div className="bg-indigo-900 text-white p-6 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600 rounded-full opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500 rounded-full opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>

            {/* Header content */}
            <div className="relative z-10 flex items-center mb-2">
              <div className="bg-white rounded-lg p-2 mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Upload Patient Scan</h2>
                <p className="text-indigo-100 opacity-90 text-sm">
                  {step === 'patient'
                    ? 'Step 1: Patient information'
                    : 'Step 2: Upload scan'}
                </p>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
            <div className="flex items-center max-w-3xl mx-auto">
              <div className="flex-1 relative">
                <div className={`h-1 w-full ${step === 'patient' ? 'bg-gray-200' : 'bg-indigo-500'}`}></div>
                <div className={`absolute left-0 top-0 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 -mt-2.5 sm:-mt-3.5 rounded-full text-xs sm:text-sm font-medium ${
                  step === 'patient'
                    ? 'bg-indigo-600 text-white border-2 sm:border-4 border-indigo-100'
                    : 'bg-indigo-600 text-white'
                }`}>
                  1
                </div>
              </div>

              <div className="flex-1 relative">
                <div className="h-1 bg-gray-200"></div>
                <div className={`absolute right-0 top-0 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 -mt-2.5 sm:-mt-3.5 rounded-full text-xs sm:text-sm font-medium ${
                  step === 'scan'
                    ? 'bg-indigo-600 text-white border-2 sm:border-4 border-indigo-100'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
              </div>
            </div>
          </div>

          {/* Alert messages */}
          <div className="px-4 sm:px-6 py-4">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded mb-4 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-4 rounded mb-4 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{success}</span>
              </div>
            )}
          </div>

          {/* Form content */}
          <div className="p-4 sm:p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-lg">
              {step === 'patient' && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Patient Information</h3>
                      <p className="text-sm text-gray-500">Enter patient details to proceed with the scan upload</p>
                    </div>
                  </div>

                  <PatientForm onPatientCreated={handlePatientCreated} />
                </div>
              )}

              {step === 'scan' && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Upload Vascular Scan</h3>
                      <p className="text-sm text-gray-500">Upload the patient&apos;s scan for AI-powered analysis</p>
                    </div>
                  </div>

                  <ScanUpload
                    patientId={patientId!}
                    onUploadComplete={handleUploadComplete}
                  />

                  {loading && (
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                      <span className="ml-3 text-indigo-600 font-medium">Processing...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer info */}
          <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="text-xs text-gray-500 order-2 sm:order-1">
                <span>VeinWise Clinical Vascular Intelligence</span>
                <span className="mx-2 hidden sm:inline">•</span>
                <span className="block sm:inline">HIPAA Compliant</span>
              </div>
              {step === 'patient' ? (
                <div></div>
              ) : (
                <button
                  onClick={() => setStep('patient')}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center order-1 sm:order-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to patient info
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}