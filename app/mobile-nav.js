'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the MobileNavigation component with SSR disabled
const MobileNavigation = dynamic(() => import('@/components/MobileNavigation.client'), {
  ssr: false,
});

export default function MobileNav() {
  return <MobileNavigation />;
}
