'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaBars, FaChartBar, FaClipboardList, FaHome, FaSignInAlt, FaSignOutAlt, FaTimes, FaUpload } from 'react-icons/fa';

interface NavbarProps {
  user?: {
    name: string;
    email: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  // Don't render navbar on authentication pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password') {
    return null;
  }

  const handleLogout = async () => {
    try {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setIsLoggedIn(false);
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <FaHome size={18} />,
    },
    {
      name: 'Patients',
      href: '/patients',
      icon: <FaClipboardList size={18} />,
    },
    {
      name: 'Upload',
      href: '/upload',
      icon: <FaUpload size={18} />,
    },
    {
      name: 'Results',
      href: '/results',
      icon: <FaChartBar size={18} />,
    },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-slate-200" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={isLoggedIn ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center shadow-md group-hover:shadow-indigo-200 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="font-bold text-gray-800 text-xl hidden sm:block">
              <span className="text-indigo-600">Vein</span>Wise
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {isLoggedIn ? (
              <>
                <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium ${
                        pathname === item.href
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-gray-600 hover:text-indigo-600 hover:bg-white/50'
                      } transition-all duration-200`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-3 flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                >
                  <FaSignOutAlt size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow"
              >
                <FaSignInAlt size={18} />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all duration-200 border border-indigo-100"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-3 animate-fadeIn">
            {isLoggedIn ? (
              <div className="bg-slate-100 rounded-xl p-2 space-y-1 shadow-lg border border-slate-200">
                <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Navigation
                </div>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg flex items-center gap-3 ${
                      pathname === item.href
                        ? 'bg-white text-indigo-600 shadow-sm font-medium'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-white/50'
                    } transition-all duration-200`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
                <div className="border-t border-slate-200 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-1 flex items-center justify-center gap-3 px-4 py-3 text-red-500 bg-red-50/50 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <FaSignOutAlt size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="bg-slate-100 rounded-xl p-4 shadow-lg border border-slate-200">
                <div className="text-center mb-3">
                  <h3 className="text-lg font-medium text-gray-900">Welcome to VeinWise</h3>
                  <p className="text-sm text-gray-500">Please sign in to access the dashboard</p>
                </div>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white px-4 py-3 rounded-lg text-center shadow-sm transition-all duration-200"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FaSignInAlt size={18} />
                    Login
                  </span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}