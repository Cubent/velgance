'use client';

import { SignIn } from '@clerk/nextjs';
import { useEffect } from 'react';

export function ReferralSignIn() {
  useEffect(() => {
    // Check if we have a referral source stored in localStorage
    const referralSource = localStorage.getItem('travira_referral_source');
    
    if (referralSource) {
      console.log('🔗 Referral source found for sign-in:', referralSource);
      
      // Store the referral source in a way that can be accessed after sign-in
      // We'll use sessionStorage as a backup and also store it in a global variable
      sessionStorage.setItem('pending_referral_source', referralSource);
      
      // Also store it globally so it can be accessed by the webhook
      (window as any).pendingReferralSource = referralSource;
    }
  }, []);

  return (
    <SignIn 
      routing="path" 
      path="/sign-in" 
      signUpUrl="/sign-up"
      afterSignInUrl="/onboarding"
      afterSignUpUrl="/onboarding"
      appearance={{
        elements: {
          headerTitle: {
            display: 'none'
          },
          headerSubtitle: {
            display: 'none'
          },
          formButtonPrimary: {
            backgroundColor: '#d5e27b',
            borderColor: '#d5e27b',
            color: '#333333',
            '&:hover': {
              backgroundColor: '#c4d16a',
              borderColor: '#c4d16a'
            }
          },
          socialButtonsBlockButton: {
            backgroundColor: '#fff0d2',
            borderColor: '#fff0d2',
            color: '#045530',
            '&:hover': {
              backgroundColor: '#f0e0b8',
              borderColor: '#f0e0b8'
            }
          },
          formFieldInput: {
            backgroundColor: '#f9f7ee',
            borderColor: '#e5e5e5'
          },
          userProfile: {
            textAlign: 'center'
          },
          userProfileCard: {
            textAlign: 'center'
          },
          userProfileImage: {
            margin: '0 auto'
          },
          userProfilePrimaryButton: {
            margin: '0 auto'
          },
          // OTP/Code input styling for email verification
          otpCodeFieldInput: {
            backgroundColor: '#f0f0f0',
            borderColor: '#d1d5db',
            color: '#374151',
            '&:focus': {
              backgroundColor: '#e5e7eb',
              borderColor: '#d5e27b',
              boxShadow: '0 0 0 2px rgba(213, 226, 123, 0.2)'
            }
          },
          // Alternative OTP input selectors
          codeInput: {
            backgroundColor: '#f0f0f0',
            borderColor: '#d1d5db',
            color: '#374151',
            '&:focus': {
              backgroundColor: '#e5e7eb',
              borderColor: '#d5e27b',
              boxShadow: '0 0 0 2px rgba(213, 226, 123, 0.2)'
            }
          },
          verificationCodeInput: {
            backgroundColor: '#f0f0f0',
            borderColor: '#d1d5db',
            color: '#374151',
            '&:focus': {
              backgroundColor: '#e5e7eb',
              borderColor: '#d5e27b',
              boxShadow: '0 0 0 2px rgba(213, 226, 123, 0.2)'
            }
          },
          // Generic input styling for verification codes
          input: {
            backgroundColor: '#f0f0f0',
            borderColor: '#d1d5db',
            color: '#374151',
            '&:focus': {
              backgroundColor: '#e5e7eb',
              borderColor: '#d5e27b',
              boxShadow: '0 0 0 2px rgba(213, 226, 123, 0.2)'
            }
          }
        }
      }}
    />
  );
}
