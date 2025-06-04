'use client';

import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCloudUploadAlt, FaImage, FaSpinner, FaUser, FaVenusMars } from 'react-icons/fa';

interface ScanUploadProps {
  patientId: string;
  onUploadComplete: (result: { imageUrl: string; predictionLabel: string; confidence: number }) => void;
}

interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
}

export default function ScanUpload({ patientId, onUploadComplete }: ScanUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [patientLoading, setPatientLoading] = useState(true);

  // Fetch patient information
  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        setPatientLoading(true);
        const response = await fetch(`/api/patients/${patientId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch patient information');
        }

        const data = await response.json();
        setPatientInfo(data);
      } catch (err) {
        console.error('Error fetching patient info:', err);
      } finally {
        setPatientLoading(false);
      }
    };

    if (patientId) {
      fetchPatientInfo();
    }
  }, [patientId]);

  const handleUploadSuccess = async (result: unknown) => {
    try {
      setLoading(true);
      setError(null);
      setProcessingStatus('Optimizing image for analysis...');

      const uploadResult = result as {
        info: {
          secure_url: string;
        };
      };

      const imageUrl = uploadResult.info.secure_url;
      setUploadedImage(imageUrl);

      await new Promise((resolve) => setTimeout(resolve, 800));
      setProcessingStatus('Running vascular analysis...');

      await new Promise((resolve) => setTimeout(resolve, 1200));
      setProcessingStatus('Generating diagnostic predictions...');

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl, patientId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process image');
      }

      onUploadComplete({
        imageUrl,
        predictionLabel: data.label,
        confidence: data.confidence
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during processing');
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if Cloudinary credentials are set
  const isCloudinaryConfigured = !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET && !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Patient information card */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-4">
        <h3 className="text-lg font-medium mb-2">Patient Information</h3>

        {patientLoading ? (
          <div className="animate-pulse flex space-x-4 items-center">
            <div className="rounded-full bg-indigo-400 h-10 w-10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-indigo-400 rounded w-3/4"></div>
              <div className="h-4 bg-indigo-400 rounded w-1/2"></div>
            </div>
          </div>
        ) : patientInfo ? (
          <div className="flex items-center">
            <div className="bg-white/20 rounded-full p-2 mr-3">
              <FaUser className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">{patientInfo.name}</h4>
              <div className="flex items-center text-indigo-100 text-sm mt-1">
                <div className="flex items-center mr-4">
                  <FaCalendarAlt className="mr-1" />
                  <span>{patientInfo.age} years</span>
                </div>
                <div className="flex items-center">
                  <FaVenusMars className="mr-1" />
                  <span>{patientInfo.gender}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-indigo-400/30 rounded-lg p-3">
            <p className="text-sm">Unable to load patient information</p>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Image preview */}
        {uploadedImage && (
          <div className="mb-5">
            <div className="relative h-56 w-full overflow-hidden rounded-lg shadow-sm border border-gray-200">
              <Image
                src={uploadedImage}
                alt="Vascular image"
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Upload section */}
        <div className="space-y-4">
          {!uploadedImage && (
            <div className="text-center p-4 border-2 border-dashed border-indigo-200 rounded-lg bg-indigo-50/50">
              <FaImage className="h-10 w-10 text-indigo-300 mx-auto mb-2" />
              <h3 className="text-indigo-600 font-medium mb-1">Vascular Image</h3>
              <p className="text-sm text-gray-500 mb-3">Upload a high-quality image for best analysis results</p>
            </div>
          )}

          {isCloudinaryConfigured ? (
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'varicose-scans'}
              onSuccess={handleUploadSuccess}
              options={{
                maxFiles: 1,
                resourceType: 'image',
                folder: 'vascular-scans',
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
                sources: ['local', 'camera'],
              }}
            >
              {({ open }) => (
                <button
                  onClick={() => open()}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    <FaCloudUploadAlt className="mr-2 h-5 w-5" />
                  )}
                  {loading ? 'Processing...' : uploadedImage ? 'Upload New Image' : 'Select Image'}
                </button>
              )}
            </CldUploadWidget>
          ) : (
            <div>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-amber-800">Image storage not configured</p>
                    <p className="mt-1 text-sm text-amber-700">Using demo mode with sample images</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  // Mock image URL for demo purposes
                  const mockImageUrl = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
                  setUploadedImage(mockImageUrl);
                  handleUploadSuccess({ info: { secure_url: mockImageUrl } });
                }}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center"
              >
                {loading ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaCloudUploadAlt className="mr-2 h-5 w-5" />
                )}
                {loading ? 'Processing...' : 'Use Sample Image'}
              </button>
            </div>
          )}
        </div>

        {/* Processing indicator */}
        {loading && (
          <div className="mt-5 bg-indigo-50 p-4 rounded-lg">
            <p className="text-indigo-700 font-medium text-center">
              {processingStatus || 'Processing image...'}
            </p>
            <div className="mt-3 flex justify-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                  <div className="h-5 w-5 rounded-full bg-indigo-50"></div>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-indigo-200">
                <div className="animate-pulse bg-indigo-500 w-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}