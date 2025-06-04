import { getCurrentUser } from '@/lib/auth';
import { checkDatabaseConnection } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Mock prediction function
function getMockPrediction() {
  // Generate random prediction for demo purposes
  const labels = ['Normal', 'Mild', 'Moderate', 'Severe'];
  const randomIndex = Math.floor(Math.random() * labels.length);
  const label = labels[randomIndex];

  // Generate random confidence between 0.7 and 1.0
  const confidence = 0.7 + Math.random() * 0.3;

  return {
    label,
    confidence: parseFloat(confidence.toFixed(2)),
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check database connection first
    const dbStatus = await checkDatabaseConnection();
    if (!dbStatus.connected) {
      return NextResponse.json(
        { message: dbStatus.error },
        { status: 503 }
      );
    }

    // Get current user
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { message: 'Image URL is required' },
        { status: 400 }
      );
    }

    // In a real application, this would call your Flask ML API
    // For now, we'll return a mock prediction

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const prediction = getMockPrediction();

    return NextResponse.json(prediction, { status: 200 });
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
