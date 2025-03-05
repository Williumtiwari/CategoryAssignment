'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/login');
  }, [router]);
  
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Redirecting...</h1>
        <p className="mt-2 text-gray-500">Please wait while we redirect you to the login page.</p>
      </div>
    </div>
  );
}