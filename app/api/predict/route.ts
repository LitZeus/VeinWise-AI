import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getCurrentUser, verifyToken } from '@/lib/auth';

interface PredictionRequest {
  imageUrl: string;
  patientId: string;
}

interface PredictionResponse {
  prediction: string;
  confidence: number;
  severity: string;
  detection_status: string;
  bounding_boxes: number[][];
  num_detections: number;
  model_version: string;
  timestamp: string;
}

interface ScanData {
  patient_id: string;
  image_url: string;
  prediction_label: string;
  confidence: number;
  doctor_id: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Error types
interface ApiError extends Error {
  status?: number;
  details?: string;
}

export async function POST(request: NextRequest) {
  try {
    // First check if user is authenticated
    const user = await getCurrentUser(request);
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the auth token from cookies
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      throw new Error('No auth token found in cookies');
    }

    // Parse JSON request body
    const body = await request.json() as PredictionRequest;
    
    if (!body.imageUrl || !body.patientId) {
      throw new Error('Missing required fields: imageUrl and patientId');
    }

    // Fetch the image from URL
    const imageResponse = await axios.get(body.imageUrl, {
      responseType: 'arraybuffer'
    });

    // Convert to Blob
    const blob = new Blob([imageResponse.data], { type: 'image/jpeg' });

    // Create FormData for FastAPI
    const formData = new FormData();
    formData.append('file', blob, 'image.jpg'); // FastAPI expects 'file' field

    // Send to FastAPI
    const fastapiUrl = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';
    console.log('Sending to FastAPI:', fastapiUrl);
    
    const response = await fetch(`${fastapiUrl}/api/v1/predict`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw {
        message: `FastAPI error: ${errorText}`,
        status: response.status,
        details: errorText
      } as ApiError;
    }

    const prediction = await response.json() as PredictionResponse;
    console.log('Prediction result:', prediction);

    // Transform data for /api/scans
    const scanData: ScanData = {
      patient_id: body.patientId,
      image_url: body.imageUrl,
      prediction_label: prediction.prediction,
      confidence: parseFloat(prediction.confidence.toString()) / 100, // Ensure confidence is a number
      doctor_id: user.id // Add doctor_id from authenticated user
    };

    // Log the data being sent
    console.log('Sending scan data:', scanData);

    // Create request body
    const requestBody = JSON.stringify(scanData);

    // Forward the request with the auth token as a cookie
    const scanResponse = await fetch(new URL('/api/scans', request.url).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `auth_token=${authToken}`,
        // Optionally, you can still send the Authorization header if you want
        // 'Authorization': `Bearer ${authToken}`,
      },
      body: requestBody
    });

    if (!scanResponse.ok) {
      const errorText = await scanResponse.text();
      throw {
        message: `Scan save failed: ${errorText}`,
        status: scanResponse.status,
        details: errorText
      } as ApiError;
    }

    // Return success response
    return NextResponse.json({
      success: true,
      data: prediction,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('Prediction API error:', error);
    
    const errorObj = error as ApiError;
    const status = errorObj.status || (errorObj instanceof Error ? 400 : 500);
    const message = errorObj.message || 'Internal server error';
    const details = process.env.NODE_ENV === 'development' ? errorObj.details || message : undefined;

    return NextResponse.json(
      { 
        success: false,
        message: message,
        details: details,
        timestamp: new Date().toISOString()
      }, 
      { status: status }
    );
  }
}

// Optional: Add other HTTP methods if needed
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Prediction API endpoint. Use POST with JSON body containing imageUrl and patientId.' 
    }, 
    { status: 405 }
  );
}