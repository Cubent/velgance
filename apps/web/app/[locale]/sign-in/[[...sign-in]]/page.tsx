import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

const SignInPage = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-0 sm:px-4 relative"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1550318817-ddbecc4d078d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Grainy overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />
      
      {/* Logo */}
      <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-3 hover:opacity-80 transition-opacity">
        <Image 
          src="/Travira-light.svg" 
          alt="Travira" 
          width={50} 
          height={50}
          className="h-12 w-12"
        />
        <span className="text-2xl font-bold" style={{ color: '#d5e27b' }}>Travira</span>
      </Link>

      <div className="w-full max-w-md sm:max-w-md relative z-10 mt-20 sm:mt-0">
        {/* Custom Header Text */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#fff0d2' }}>Sign in</h1>
          <p className="text-lg" style={{ color: '#fff0d2' }}>Welcome back! Please sign in to continue</p>
        </div>
        
        <div className="rounded-lg sm:rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-sm p-4 sm:p-6 shadow-sm">
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
        </div>
        
        {/* Privacy Disclaimer */}
        <div className="mt-4 text-center">
          <p className="text-xs leading-relaxed" style={{ color: '#fff0d2' }}>
            We guarantee 100% privacy. Your information will not be shared. This app is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

