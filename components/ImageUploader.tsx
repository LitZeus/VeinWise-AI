'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface PredictionResult {
  success: boolean;
  data?: {
    prediction: string;
    confidence: number;
    severity: string;
    bounding_boxes?: number[][];
    detection_status?: string;
    num_detections?: number;
    model_version?: string;
  };
  message?: string;
  timestamp?: string;
  details?: string;
}

interface ImageUploaderProps {
  onPredictionComplete?: (result: PredictionResult) => void;
  maxFileSize?: number;
  allowedTypes?: string[];
  patientId?: string;
}

export default function ImageUploader({ 
  onPredictionComplete,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  patientId
}: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed: ${allowedTypes.join(', ')}`;
    }
    if (file.size > maxFileSize) {
      return `File too large. Maximum size: ${Math.round(maxFileSize / (1024 * 1024))}MB`;
    }
    return null;
  }, [allowedTypes, maxFileSize]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setPrediction(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
  }, [validateFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file); // Changed from 'image' to 'file' to match FastAPI's field name

      // Debug: Log what we're sending
      console.log('Sending file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      console.log('FormData entries:', Array.from(formData.entries()));

      // Get the auth token from the current request headers
      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
        credentials: 'include' // Include credentials (cookies) in the request
      });

      const fastapiResult = await response.json();
      
      // Transform FastAPI response to match our PredictionResult interface
      const result: PredictionResult = {
        success: true,
        data: {
          prediction: fastapiResult.prediction,
          confidence: fastapiResult.confidence,
          severity: fastapiResult.severity,
          bounding_boxes: fastapiResult.bounding_boxes,
          detection_status: fastapiResult.detection_status,
          num_detections: fastapiResult.num_detections,
          model_version: fastapiResult.model_version
        },
        timestamp: fastapiResult.timestamp
      };

      // Send scan data to /api/scans
      if (patientId) {
        try {
          // Ensure confidence is within valid range (0-100)
          const confidence = Math.min(Math.max(fastapiResult.confidence, 0), 100);

          // Log the data being sent
          console.log('Sending scan data:', {
            patient_id: patientId,
            image_url: window.location.origin + preview,
            prediction_label: fastapiResult.prediction,
            confidence: confidence
          });

          await fetch('/api/scans', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              patient_id: patientId,
              image_url: window.location.origin + preview,
              prediction_label: fastapiResult.prediction,
              confidence: confidence
            })
          });
        } catch (error) {
          console.error('Failed to save scan data:', error);
        }
      }
      
      setPrediction(result);
      onPredictionComplete?.(result);

      if (!result.success) {
        setError(result.message || 'Prediction failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      setError(errorMessage);
      setPrediction({ success: false, message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    setFile(null);
    setPreview(null);
    setPrediction(null);
    setError(null);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Image Prediction</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            id="image-upload"
            type="file"
            accept={allowedTypes.join(',')}
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
          />
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: {allowedTypes.join(', ')}. Max size: {Math.round(maxFileSize / (1024 * 1024))}MB
          </p>
        </div>

        {preview && (
          <div className="relative">
            <div className="relative w-full h-48 mx-auto">
              <Image
                src={preview}
                alt="Preview"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-contain rounded-lg border"
              />
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!file || loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Get Prediction'
            )}
          </button>
          
          {file && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {prediction ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Prediction Result
          </h3>
          
          {prediction.success && prediction.data ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-800">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Prediction:</span>
                    <span className="ml-2">{prediction.data.prediction}</span>
                  </div>
                  <div>
                    <span className="font-medium">Confidence:</span>
                    <span className="ml-2">{prediction.data.confidence.toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="font-medium">Severity:</span>
                    <span className="ml-2">{prediction.data.severity}</span>
                  </div>
                  <div>
                    <span className="font-medium">Detection Status:</span>
                    <span className="ml-2">{prediction.data.detection_status}</span>
                  </div>
                  <div>
                    <span className="font-medium">Number of Detections:</span>
                    <span className="ml-2">{prediction.data.num_detections}</span>
                  </div>
                  <div>
                    <span className="font-medium">Model Version:</span>
                    <span className="ml-2">{prediction.data.model_version}</span>
                  </div>
                  {prediction.data.bounding_boxes && prediction.data.bounding_boxes.length > 0 && (
                    <div>
                      <span className="font-medium">Bounding Boxes:</span>
                      <ul className="ml-4 list-disc">
                        {prediction.data.bounding_boxes.map((box, i) => (
                          <li key={i}>
                            Box {i + 1}: {box.join(', ')}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              {prediction.timestamp && (
                <div>
                  <p className="text-xs text-green-600 mt-2">
                    Processed at: {new Date(prediction.timestamp).toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600">
                    Model: {prediction.data.model_version}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">
                {prediction.message || 'Prediction failed'}
              </p>
              {prediction.details && (
                <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">
                  {prediction.details}
                </pre>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-gray-600">Upload an image to get started</p>
        </div>
      )}
    </div>
  );
}