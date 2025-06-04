'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaTrash } from 'react-icons/fa';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
}

export default function EditPatientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    age: '',
    gender: '',
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/patients/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch patient');
        }
        
        const data = await response.json();
        setPatient(data);
        setFormData({
          name: data.name,
          age: data.age.toString(),
          gender: data.gender,
          email: data.email || '',
          phone: data.phone || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatient();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {
      name: '',
      age: '',
      gender: '',
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.age) {
      errors.age = 'Age is required';
      isValid = false;
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      errors.age = 'Age must be a positive number';
      isValid = false;
    }

    if (!formData.gender) {
      errors.gender = 'Gender is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSaving(true);
      const response = await fetch(`/api/patients/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          age: Number(formData.age),
          gender: formData.gender,
          email: formData.email,
          phone: formData.phone,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update patient');
      }
      
      router.push('/patients');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/patients/${params.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete patient');
      }
      
      router.push('/patients');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-16 mx-6">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <div className="mt-4">
          <Link href="/patients" className="text-blue-600 hover:text-blue-800">
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
          <Link href="/patients" className="text-blue-600 hover:text-blue-800">
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
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Patient</h1>
        </div>
        <Link
          href="/patients"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
        >
          <FaArrowLeft className="mr-2" /> Back to Patients
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 animate-fadeIn">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 sm:text-sm`}
                placeholder="Enter patient name"
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border ${formErrors.age ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 sm:text-sm`}
                placeholder="Enter patient age"
                min="1"
              />
              {formErrors.age && (
                <p className="mt-1 text-sm text-red-500">{formErrors.age}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border ${formErrors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 sm:text-sm`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {formErrors.gender && (
                <p className="mt-1 text-sm text-red-500">{formErrors.gender}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 sm:text-sm"
                placeholder="Enter patient email (optional)"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 sm:text-sm"
                placeholder="Enter patient phone (optional)"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <FaTrash className="mr-2" /> Delete Patient
                </>
              )}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
