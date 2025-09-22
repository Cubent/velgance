'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function ReferralTracker() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');

    // If there's a ref parameter, store it in localStorage
    if (ref) {
      localStorage.setItem('travira_referral_source', ref);
      console.log('🔗 Referral source stored:', ref);
    }
  }, []);

  // Track referral when user is loaded and signed in
  useEffect(() => {
    if (!isLoaded || !user) return;

    // Check if user already has referral metadata
    const existingReferral = user.publicMetadata?.referralSource;
    
    if (existingReferral) {
      console.log('👤 User already has referral source:', existingReferral);
      return;
    }

    // Check for pending referral source
    const pendingReferral = sessionStorage.getItem('pending_referral_source') || 
                           localStorage.getItem('travira_referral_source');

    if (pendingReferral) {
      console.log('📤 Tracking referral source for user:', pendingReferral);
      
      // Call the API to add referral to user metadata
      fetch('/api/referral/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referralSource: pendingReferral
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('✅ Referral source tracked successfully:', data.referralSource);
          // Clear the stored referral source
          sessionStorage.removeItem('pending_referral_source');
          localStorage.removeItem('travira_referral_source');
        } else {
          console.error('❌ Failed to track referral source:', data.error);
        }
      })
      .catch(error => {
        console.error('❌ Error tracking referral source:', error);
      });
    }
  }, [user, isLoaded]);

  return null; // This component doesn't render anything
}