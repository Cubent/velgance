'use client';

import { SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after sign out
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Signing you out...</h1>
        <p className="text-gray-600 mb-8">Thank you for using Travira!</p>
        
        <SignOutButton redirectUrl="/">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Complete Sign Out
          </button>
        </SignOutButton>
        
        <p className="text-sm text-gray-500 mt-4">
          You will be redirected to the homepage shortly.
        </p>
      </div>
    </div>
  );
}
