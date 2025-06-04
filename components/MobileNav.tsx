'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaClipboardList, FaUpload, FaChartBar } from 'react-icons/fa';

export default function MobileNav() {
  const pathname = usePathname();
  
  // Don't render on login/register pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password') {
    return null;
  }

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <FaHome size={20} />,
    },
    {
      name: 'Patients',
      href: '/patients',
      icon: <FaClipboardList size={20} />,
    },
    {
      name: 'Upload',
      href: '/upload',
      icon: <FaUpload size={20} />,
    },
    {
      name: 'Results',
      href: '/results',
      icon: <FaChartBar size={20} />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full ${
              pathname === item.href
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-indigo-500'
            }`}
          >
            <div className="flex flex-col items-center">
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
