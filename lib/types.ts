// Doctor/User types
export interface Doctor {
  id: string;
  name: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  email: string;
  created_at: string;
}

export interface DoctorWithPassword extends Doctor {
  password: string;
}

// Patient types
export interface Patient {
  id: string;
  user_id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  created_at: string;
}

export interface PatientFormData {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

// Scan types
export interface Scan {
  id: string;
  patient_id: string;
  doctor_id: string;
  image_url: string;
  prediction_label: string;
  confidence: number;
  created_at: string;
}

export interface ScanWithPatient extends Scan {
  patient_name: string;
  patient_age: number;
  patient_gender: 'Male' | 'Female' | 'Other';
}

export interface ScanFormData {
  patient_id: string;
  image: File;
}

// Prediction types
export interface Prediction {
  label: string;
  confidence: number;
}

// Auth types
export interface RegisterFormData {
  name: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
