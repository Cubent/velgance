'use client';

import Link from 'next/link';
import Image from 'next/image';

const Partnership = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9f7ee' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[75vh] sm:min-h-[85vh]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl mx-4 my-4"
          style={{
            backgroundImage: 'url(https://i.postimg.cc/wMGw59r1/Behavioral-Finance-1.png)'
          }}
        ></div>
        
        {/* Grainy Filter Overlay */}
        <div className="absolute inset-0 bg-black/20 rounded-2xl mx-4 my-4" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}></div>
        
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 rounded-2xl mx-4 my-4"></div>

        <div className="relative max-w-7xl mx-auto pl-4 pr-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8 pt-24 pb-8 z-10">
          <div className="text-center sm:text-left">
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-[#f0e8d4] mb-4 leading-tight">
              Travira Partnership
              <br />
              Program
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-[#f0e8d4] mb-6 max-w-3xl leading-relaxed">
              At Travira, we love teaming up with travelers and creators who share flight deals and travel experiences. Our partnership program is simple, rewarding, and benefits both you and your audience.
            </p>
          </div>

          {/* CTA Button - Independent container */}
          <div className="flex justify-center sm:justify-start mb-8">
            <Link
              href="mailto:partnerships@travira.org?subject=Partnership Inquiry"
              className="inline-flex items-center gap-2 bg-[#d5e27b] text-[#045530] px-5 py-1.5 sm:px-5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#c4d16a] transition-colors shadow-lg w-fit text-left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex flex-col">
                <span>Download Partnership Toolkit</span>
                <span className="text-xs opacity-75">2.43 mb</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

      {/* Partnership Benefits Section - Full Width */}
        <div className="mt-16 mb-16 py-16 px-8" style={{ backgroundColor: '#f0e8d4' }}>
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#045530' }}>
            Partnership Benefits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="bg-[#d5e27b] rounded-full p-2">
                  <svg className="w-5 h-5" style={{ color: '#045530' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              <div className="text-left">
                <p className="font-medium text-lg" style={{ color: '#045530' }}>Easy & Transparent</p>
                  <p style={{ color: '#045530' }}>Everything you need is in one place</p>
                </div>
              </div>

            <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="bg-[#d5e27b] rounded-full p-2">
                  <svg className="w-5 h-5" style={{ color: '#045530' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              <div className="text-left">
                <p className="font-medium text-lg" style={{ color: '#045530' }}>Grows With You</p>
                  <p style={{ color: '#045530' }}>The more your audience engages, the more you benefit</p>
                </div>
              </div>

            <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="bg-[#d5e27b] rounded-full p-2">
                  <svg className="w-5 h-5" style={{ color: '#045530' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              <div className="text-left">
                <p className="font-medium text-lg" style={{ color: '#045530' }}>Adds Value for Followers</p>
                  <p style={{ color: '#045530' }}>Your audience gets access to exclusive perks</p>
              </div>
            </div>
            </div>
          </div>

        {/* How It Works Section - Full Width */}
        <div className="mt-16 mb-12">
          <div className="rounded-lg sm:rounded-2xl p-4 sm:p-8" style={{ backgroundColor: '#e5eea5' }}>
            <div className="flex flex-col lg:flex-row items-start gap-12">
              {/* Image - top on mobile, right on desktop */}
              <div className="w-full lg:w-auto lg:flex-shrink-0 order-1 lg:order-2">
                <img 
                  src="https://i.postimg.cc/KvG8WBY7/Behavioral-Finance-2.png" 
                  alt="Partnership illustration" 
                  className="w-full lg:w-[750px] h-auto rounded-lg"
                />
              </div>
              
              {/* Content - bottom on mobile, left on desktop */}
              <div className="flex-1 pt-4 order-2 lg:order-1">
                <h2 className="text-[2.1rem] font-bold mb-3 lg:mb-6 text-left" style={{ color: '#045530' }}>
                  How It Works
                </h2>
                
                <p className="text-base leading-relaxed pt-0 lg:pt-2" style={{ color: '#045530' }}>
                  We provide you with a unique referral link to share with your audience. Your followers get exclusive perks when they try Travira, and we handle all tracking and reporting for your referrals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="mt-16 mb-12">
          <div className="rounded-lg sm:rounded-2xl p-4 sm:p-8" style={{ backgroundColor: '#f0e8d4' }}>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#045530' }}>
                Contact Us
              </h2>
              
              <p className="text-base mb-6 max-w-2xl mx-auto" style={{ color: '#045530' }}>
                Ready to start your partnership journey with Travira? Get in touch with our team to learn more about our program and how we can work together.
              </p>
              
              <Link
                href="mailto:partnerships@travira.org?subject=Partnership Inquiry"
                className="inline-flex items-center gap-2 bg-[#d5e27b] text-[#045530] px-6 py-3 rounded-lg text-base font-semibold hover:bg-[#c4d16a] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                partnerships@travira.org
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partnership;
