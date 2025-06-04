'use client';

import MobileNavigation from './MobileNavigation';
import { ReactNode } from 'react';

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <>
      {children}
      <MobileNavigation />
    </>
  );
}
