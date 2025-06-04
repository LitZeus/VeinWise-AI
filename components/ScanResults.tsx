'use client';

import { ScanWithPatient } from '@/lib/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ScanResultsProps {
  searchQuery?: string;
}

export default function ScanResults({ searchQuery = '' }: ScanResultsProps) {
  const [scans, setScans] = useState<ScanWithPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await fetch('/api/scans');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch scans');
        }

        setScans(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching scans');
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        No scan results found. Upload a scan to see results here.
      </div>
    );
  }

  // Filter scans based on search query
  const filteredScans = searchQuery
    ? scans.filter((scan) => {
        const query = searchQuery.toLowerCase();
        return (
          scan.patient_name.toLowerCase().includes(query) ||
          scan.prediction_label.toLowerCase().includes(query) ||
          scan.patient_gender.toLowerCase().includes(query)
        );
      })
    : scans;

  // Show message when no results match the search query
  if (searchQuery && filteredScans.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Scan Results</h2>
          <span className="text-sm text-gray-500">
            Showing 0 of {scans.length} results
          </span>
        </div>
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
          No results found for "{searchQuery}". Try a different search term.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Scan Results</h2>
        {searchQuery && (
          <span className="text-sm text-gray-500">
            Showing {filteredScans.length} of {scans.length} results
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredScans.map((scan) => (
          <div key={scan.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 w-full">
              <Image
                src={scan.image_url}
                alt={`Scan for ${scan.patient_name}`}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-t-lg"
              />
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{scan.patient_name}</h3>

              <div className="mt-2 text-sm text-gray-600">
                <p>Age: {scan.patient_age}</p>
                <p>Gender: {scan.patient_gender}</p>
                <p>Date: {new Date(scan.created_at).toLocaleDateString()}</p>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Prediction:</span>
                  <span className="font-bold text-indigo-600">{scan.prediction_label}</span>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Confidence:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {Math.round(scan.confidence * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${Math.round(scan.confidence * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
