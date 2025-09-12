'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserProfile } from '@clerk/nextjs';


export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in?redirect_url=/profile');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#f9f7ee] flex items-center justify-center">
        <div className="text-center">
          <style jsx>{`
            @keyframes iconFade {
              0%, 30% { opacity: 1; }
              31%, 100% { opacity: 0; }
            }
            .icon-1 { animation: iconFade 0.9s infinite; }
            .icon-2 { animation: iconFade 0.9s infinite 0.3s; }
            .icon-3 { animation: iconFade 0.9s infinite 0.6s; }
          `}</style>
          <div className="relative h-32 w-32 mx-auto mb-4">
            {/* Plane Icon */}
            <div className="absolute inset-0 flex items-center justify-center icon-1">
              <svg className="w-20 h-20 text-[#045530]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
            {/* Cloud Icon */}
            <div className="absolute inset-0 flex items-center justify-center icon-2" style={{opacity: 0}}>
              <svg className="w-20 h-20 text-[#045530]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
              </svg>
            </div>
            {/* Suitcase Icon */}
            <div className="absolute inset-0 flex items-center justify-center icon-3" style={{opacity: 0}}>
              <svg className="w-20 h-20 text-[#045530]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 6h-2V3c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v3H5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 3h6v3H9V3zm8 15H5V8h14v10z"/>
              </svg>
            </div>
          </div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fffef7] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-[#f9f7ee] rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={user.imageUrl}
              alt={user.fullName || 'User'}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.fullName || user.firstName || 'Welcome'}
              </h1>
              <p className="text-gray-600">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg mb-8 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
          <UserProfile />
        </div>
      </div>
    </div>
  );
}
