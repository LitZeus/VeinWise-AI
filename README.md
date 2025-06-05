# VeinWise AI

A full-stack Next.js application for doctors to manage patient scans and view varicose vein prediction results.

## Features

- **Doctor Authentication**: Register, login, and logout functionality
- **Patient Management**: Add and manage patient records
- **Scan Upload**: Upload patient scan images to Cloudinary
- **Prediction Results**: View and analyze prediction results from ML model
- **Dashboard**: Overview of patients and scans with recent activity

## Tech Stack

- **Frontend**: Next.js with App Router, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **Image Storage**: Cloudinary
- **Authentication**: JWT with HTTP-only cookies

> **Note**: For simplicity, this demo uses a basic SHA-256 hash for passwords instead of bcrypt to avoid native module dependencies. In a production environment, you should use a proper password hashing library like bcrypt.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- Cloudinary account

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd medical-scan-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # Database
   DATABASE_URL=postgres://user:password@hostname:port/database

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=medical-scans

   # JWT
   JWT_SECRET=your_jwt_secret_key

   # API URL (for the ML prediction API)
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Set up the database:
   - Create a PostgreSQL database
   - Run the following SQL to create the necessary tables:

   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     phone TEXT NOT NULL,
     gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
     age INTEGER NOT NULL CHECK (age > 0),
     email TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Patients table
   CREATE TABLE patients (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     age INTEGER NOT NULL CHECK (age > 0),
     gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Scans table
   CREATE TABLE scans (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
     doctor_id UUID NOT NULL REFERENCES users(id),
     image_url TEXT NOT NULL,
     prediction_label TEXT NOT NULL,
     confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. Run the development server:
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Create an upload preset named `medical-scans` with the following settings:
   - Signing Mode: Unsigned
   - Folder: medical-scans
   - Access Mode: public

## ML API Integration

The application is designed to work with an external Flask ML API for predictions. Currently, it uses a mock prediction API. To integrate with your actual ML API:

1. Update the `NEXT_PUBLIC_API_URL` in the `.env.local` file to point to your Flask API
2. Modify the `app/api/predict/route.ts` file to make actual API calls to your Flask endpoint

## Deployment

This application can be deployed to platforms like Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure the environment variables in the Vercel dashboard
4. Deploy the application

## License

[MIT](LICENSE)
