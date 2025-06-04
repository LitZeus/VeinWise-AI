'use client';

import AuthForm from '@/components/AuthForm';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        
        {/* Left side - Branding */}
        <div className="md:w-1/2 w-full bg-indigo-900 p-6 sm:p-8 relative">
          
          {/* Background visuals */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-indigo-600 rounded-full opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-violet-500 rounded-full opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>

            {/* Vein lines */}
            {[1, 2, 3].map((_, i) => (
              <div key={i} className={`absolute top-[${(i + 1) * 25}%] left-0 w-full`}>
                <svg width="100%" height="30" viewBox="0 0 400 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d={
                      i % 2 === 0
                        ? 'M0 15 Q 100 0, 200 15 Q 300 30, 400 15'
                        : 'M0 15 Q 100 30, 200 15 Q 300 0, 400 15'
                    }
                    stroke="white"
                    strokeWidth="1"
                    strokeOpacity="0.2"
                    fill="none"
                  />
                </svg>
              </div>
            ))}
          </div>

          {/* Left Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white">VeinWise</h1>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Clinical Vascular Intelligence</h2>
              <p className="text-indigo-100 text-sm opacity-90 leading-relaxed">
                Precision diagnostics for vascular specialists with advanced AI imaging analysis
              </p>
            </div>

            <div className="space-y-4 mt-10">
              {[
                {
                  title: 'Enterprise-grade security',
                  desc: 'HIPAA, SOC2 & ISO 27001 compliant',
                  icon: (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  )
                },
                {
                  title: 'Advanced analytics',
                  desc: 'AI-powered diagnostic accuracy',
                  icon: (
                    <>
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </>
                  )
                },
                {
                  title: 'Collaborative platform',
                  desc: 'Connect with 3,000+ specialists',
                  icon: (
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  )
                }
              ].map((feature, i) => (
                <div key={i} className="flex items-start space-x-3 text-white">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      {feature.icon}
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-xs text-indigo-200">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="md:w-1/2 w-full p-6 sm:p-8 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
              <p className="text-gray-600 text-sm sm:text-base">Please sign in to access your dashboard</p>
            </div>
            <AuthForm type="login" redirectPath={redirect} />
          </div>
        </div>
      </div>
    </div>
  );
}
