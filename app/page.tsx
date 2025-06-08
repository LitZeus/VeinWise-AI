import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
        
        {/* Hero Section */}
        <div className="w-full bg-indigo-900 p-8 sm:p-12 relative">
          {/* Background visuals */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-indigo-600 rounded-full opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-violet-500 rounded-full opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>

            {/* Vein lines */}
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="absolute" style={{ top: `${(i + 1) * 25}%`, left: 0, width: '100%' }}>
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

          {/* Hero Content */}
          <div className="relative z-10 text-center md:text-left">
            <div className="flex items-center space-x-3 mb-6 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">VeinWise</h1>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Varicose Veins Scan Management
            </h2>
            <p className="max-w-2xl text-indigo-100 text-lg opacity-90 leading-relaxed mb-8">
              A comprehensive platform for doctors to manage patient scans and view varicose vein prediction results with clinical precision.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/login"
                className="px-8 py-3 bg-white text-indigo-700 rounded-lg font-medium text-lg shadow hover:shadow-lg transition duration-200 flex items-center justify-center"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-8 py-3 border border-indigo-300 text-white rounded-lg font-medium text-lg hover:bg-indigo-800 transition duration-200 flex items-center justify-center"
              >
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Advanced Vascular Intelligence</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition duration-200">
              <div className="h-16 w-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">Patient Management</h3>
              <p className="text-center text-gray-600">
                Comprehensive patient records with secure storage and easy access to medical history.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition duration-200">
              <div className="h-16 w-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">HIPAA-Compliant Storage</h3>
              <p className="text-center text-gray-600">
                Upload and store patient scan images with enterprise-grade security and compliance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition duration-200">
              <div className="h-16 w-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">AI Diagnostic Support</h3>
              <p className="text-center text-gray-600">
                Advanced AI algorithms provide varicose vein prediction with clinical accuracy and confidence scoring.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="w-full bg-slate-50 p-8 sm:p-12 border-t border-slate-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Trusted by Medical Professionals</h3>
                <p className="text-gray-600 mb-4">
                  Our platform adheres to the highest standards of medical data security and provides clinically validated diagnostic assistance.
                </p>
                <div className="space-y-3">
                  {[
                    {
                      title: 'Enterprise-grade security',
                      desc: 'HIPAA, SOC2 & ISO 27001 compliant',
                      icon: (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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
                    <div key={i} className="flex items-start space-x-3 text-gray-800">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-700" viewBox="0 0 20 20" fill="currentColor">
                          {feature.icon}
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">{feature.title}</p>
                        <p className="text-xs text-gray-500">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-sm">
                  <div className="absolute -top-4 -left-4 w-full h-full bg-indigo-200 rounded-lg"></div>
                  <div className="absolute -bottom-4 -right-4 w-full h-full bg-violet-200 rounded-lg"></div>
                  <div className="relative bg-white p-6 rounded-lg shadow-lg border border-slate-100">
                    <div className="text-center mb-6">
                      <p className="text-lg font-semibold text-gray-800">Join thousands of medical professionals</p>
                      <p className="text-sm text-gray-500">Get started with VeinWise today</p>
                    </div>
                    <div className="space-y-3">
                      <Link href="/register" className="block w-full bg-indigo-600 text-white py-3 text-center rounded-lg font-medium hover:bg-indigo-700 transition duration-200">
                        Create an Account
                      </Link>
                      <Link href="/login" className="block w-full bg-white text-indigo-600 py-3 text-center rounded-lg font-medium border border-indigo-200 hover:bg-indigo-50 transition duration-200">
                        Sign In
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}