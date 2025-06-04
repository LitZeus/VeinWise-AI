'use client';

import MobileNav from '@/components/MobileNav';
import { ReactNode } from 'react';

interface ClientPageProps {
  children: ReactNode;
}

export default function ClientPage({ children }: ClientPageProps) {
  return (
    <>
      {children}
      <MobileNav />
    </>
  );
}
