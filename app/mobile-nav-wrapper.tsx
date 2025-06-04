'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartBar, FaClipboardList, FaHome, FaUpload } from 'react-icons/fa';

export default function MobileNav() {
  const pathname = usePathname();

  // Don't render on login/register pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password') {
    return null;
  }

  const navItems = [
    {
      name: 'Home',
      href: '/dashboard',
      icon: <FaHome size={16} />,
    },
    {
      name: 'Patients',
      href: '/patients',
      icon: <FaClipboardList size={16} />,
    },
    {
      name: 'Upload',
      href: '/upload',
      icon: <FaUpload size={16} />,
    },
    {
      name: 'Results',
      href: '/results',
      icon: <FaChartBar size={16} />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[100] md:hidden" style={{ maxWidth: '100vw', width: '100%' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-around items-center h-12">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center h-full ${
                pathname === item.href
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-indigo-500'
              }`}
              style={{ width: '25%', padding: '0 2px' }}
            >
              <div className="flex flex-col items-center">
                {item.icon}
                <span className="text-[10px] mt-1 truncate w-full text-center">{item.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
