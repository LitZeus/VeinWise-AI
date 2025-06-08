"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Scan {
  id: string;
  patient_id: string;
  doctor_id: string;
  image_url: string;
  prediction_label: string;
  confidence: number;

  created_at: string;

}



export default function ScanDetailPage() {
  const params = useParams();
  const scanId = params?.id as string;
  const [scan, setScan] = useState<Scan | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScan = async () => {
      try {
        setLoading(true);
        const scanRes = await fetch(`/api/scans?id=${scanId}`);
        if (!scanRes.ok) throw new Error("Failed to fetch scan details");
        const scanDataArr = await scanRes.json();
        let scanData = null;
        if (Array.isArray(scanDataArr)) {
          scanData = scanDataArr.find((s: Scan) => s.id === scanId);
        } else {
          scanData = scanDataArr;
        }
        if (!scanData) throw new Error("Scan not found");
        setScan(scanData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    if (scanId) fetchScan();
  }, [scanId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-16 mx-6">
        <p className="font-bold">Error</p>
        <p>{error || "Scan not found."}</p>
        <div className="mt-4">
          <Link href="/patients" className="text-indigo-600 hover:text-indigo-800">
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-16 p-6 bg-white shadow rounded-xl animate-fadeIn">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Scan Result Details</h1>
      <div className="mb-6">
        {/* Replace <img> with Next.js <Image /> for optimization */}
        <Image
          src={scan.image_url}
          alt="Scan"
          width={800}
          height={256}
          className="w-full h-64 object-contain rounded-lg border"
        />
      </div>
      <div className="space-y-3">
        <div>
          <span className="font-medium text-gray-700">Confidence:</span>
          <span className="ml-2 text-gray-900">{Math.round(scan.confidence * 100)}%</span>
        </div>
        {/* Severity with badge */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Severity:</span>
          {(() => {
            const conf = scan.confidence > 1 ? scan.confidence : scan.confidence * 100;
            let sev = "none", badge = "bg-gray-200 text-gray-700";
            if (conf > 90) { sev = "severe"; badge = "bg-red-500 text-white"; }
            else if (conf > 70) { sev = "moderate"; badge = "bg-orange-400 text-white"; }
            else if (conf > 50) { sev = "mild"; badge = "bg-yellow-300 text-gray-900"; }
            return <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${badge}`}>{sev}</span>;
          })()}
        </div>
        {/* Prediction Label */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Prediction:</span>
          <span className="text-indigo-700 font-semibold text-base">{scan.prediction_label}</span>
        </div>
        {/* Confidence */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Confidence:</span>
          <span className="text-black font-semibold">{Math.round((scan.confidence > 1 ? scan.confidence : scan.confidence * 100))}%</span>
        </div>
        {/* Date and Time split */}
        {(() => {
          const dt = new Date(scan.created_at);
          const dateStr = dt.toLocaleDateString();
          const timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return (
            <>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Date:</span>
                <span className="text-gray-900">{dateStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Time:</span>
                <span className="text-gray-900">{timeStr}</span>
              </div>
            </>
          );
        })()}


      </div>
      <div className="mt-8">
        <Link href={`/patients/${scan.patient_id}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
          Back to Patient
        </Link>
      </div>
    </div>
  );
}
