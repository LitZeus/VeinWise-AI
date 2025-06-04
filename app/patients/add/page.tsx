'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

export default function AddPatientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    email: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    age: '',
    gender: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      setIsLoading(true);
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          age: Number(formData.age),
          gender: formData.gender,
          email: formData.email || null,
          phone: formData.phone || null,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create patient');
      }
      
      router.push('/patients');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-16 p-6">
      <div className="flex justify-between items-center mb-6 animate-fadeIn">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
        </div>
        <Link
          href="/patients"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
        >
          <FaArrowLeft className="mr-2" /> Back to Patients
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-6 rounded flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

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
                className={`block w-full px-4 py-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 sm:text-sm`}
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
                className={`block w-full px-4 py-3 border ${formErrors.age ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 sm:text-sm`}
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
                className={`block w-full px-4 py-3 border ${formErrors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 sm:text-sm`}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {formErrors.gender && (
                <p className="mt-1 text-sm text-red-500">{formErrors.gender}</p>
              )}
            </div>

            {/* Email (Optional) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 sm:text-sm"
                placeholder="Enter patient email"
              />
            </div>

            {/* Phone (Optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 sm:text-sm"
                placeholder="Enter patient phone"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Link
              href="/patients"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Patient...
                </div>
              ) : (
                <div className="flex items-center">
                  <FaSave className="mr-2" /> Save Patient
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
