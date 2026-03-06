'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#f5f5f5',
      }}
    >
      <section style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
        {children}
      </section>
    </div>
  );
}
