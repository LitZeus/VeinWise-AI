'use client';

import { LoginFormData, RegisterFormData } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AuthFormProps {
  type: 'login' | 'register';
  redirectPath?: string;
}

export default function AuthForm({ type, redirectPath = '/dashboard' }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationStep, setRegistrationStep] = useState(1);

  // Login form state
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    name: '',
    phone: '',
    gender: 'Male',
    age: 18,
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error('Database connection error. Please check your database configuration.');
        } else {
          throw new Error(data.message || 'Login failed');
        }
      }

      // Add a small delay to ensure the cookie is set before redirecting
      setTimeout(() => {
        // Force a hard navigation to ensure the cookie is properly set
        window.location.href = redirectPath;
      }, 500);
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Step 1: Validate email and password
    if (registrationStep === 1) {
      // Validate passwords match
      if (registerData.password !== registerData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Move to step 2
      setRegistrationStep(2);
      return;
    }

    // Step 2: Submit the full registration data
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error('Database connection error. Please check your database configuration.');
        } else {
          throw new Error(data.message || 'Registration failed');
        }
      }

      // Redirect to login on successful registration
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setRegistrationStep(1);
  };

  return (
    <div className="w-full mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {type === 'login' ? (
        <form onSubmit={handleLoginSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 pl-10 py-2 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 pl-10 py-2 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full transition-all duration-300 hover:shadow-lg"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit}>
          {registrationStep === 1 ? (
            // Step 1: Email and Password
            <>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 pl-10 py-2 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 pl-10 py-2 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-600 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 pl-10 py-2 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full transition-all duration-300 hover:shadow-lg"
                >
                  Continue
                </button>
              </div>
            </>
          ) : (
            // Step 2: Personal Information
            <>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-600 text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 pl-10 py-2 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-600 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 pl-10 py-2 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                    placeholder="+91 1234567890"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="gender" className="block text-gray-600 text-sm font-medium mb-2">
                  Gender
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <select
                    id="gender"
                    name="gender"
                    value={registerData.gender}
                    onChange={handleRegisterChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 pl-10 py-2 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200 hover:border-blue-300"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="age" className="block text-gray-600 text-sm font-medium mb-2">
                  Age
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    min="1"
                    value={registerData.age}
                    onChange={handleRegisterChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 pl-10 py-2 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 mb-4">
                <button
                  type="button"
                  onClick={handleBackToStep1}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-1/2 transition-all duration-300 hover:shadow-md"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-1/2 transition-all duration-300 hover:shadow-lg"
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
              </div>
            </>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
