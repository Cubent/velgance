'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [flightsPerYear, setFlightsPerYear] = useState(2);

  const handleSubscribe = async () => {
    if (!user) {
      router.push('/sign-up?redirect_url=/pricing');
      return;
    }

    // Use Stripe checkout for new subscriptions
    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
          planType: 'member',
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Failed to start subscription process. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f7ee]">
      {/* Header with background */}
      <div className="bg-[#045530] relative overflow-hidden">
        {/* Hero */}
        <section className="relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#d5e27b] tracking-tight">
              Try Travira Free for 7 Days
            </h1>
            <p className="mt-4 text-lg text-[#fff0d2]">
              Continue for the price of a small macchiato. We guarantee you save at least $500 in your first year or we'll refund you in full.
            </p>
          </div>
        </section>
      </div>

        {/* Pricing Cards */}
        <section className="relative">
          {/* Green background that extends further down */}
          <div className="absolute inset-0 bg-[#045530] h-80"></div>
          
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:mt-0 py-4 sm:py-4 py-0 relative z-10">
            <div className="flex justify-center">
              <div className="w-full max-w-md">
              {/* Member Plan Card */}
              <div className="relative bg-white p-8 shadow-lg border border-gray-200">
                {/* Main Content */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-[#045530] mb-2">Member Plan</h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Perfect for regular travelers who want to save money on flights
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-end justify-center gap-2 mb-6">
                    <span className="text-5xl font-semibold text-[#045530]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>$7.50</span>
                    <span className="pb-2 text-gray-600">/mo</span>
                  </div>

                  {/* Start Free Trial Button */}
                  <div className="mb-8">
                    <button
                      onClick={() => handleSubscribe()}
                      className="w-full inline-flex items-center justify-center bg-[#d5e27b] px-6 py-3 font-semibold text-[#045530] shadow-sm hover:bg-[#c4d16a] text-base"
                    >
                      Start Free Trial
                    </button>
                  </div>

                  <div className="text-gray-700 mb-8 flex flex-col items-center justify-center gap-1 text-base">
                    <span>Billed annually at $89</span>
                    <div className="flex items-center justify-center gap-2">
                      <span>Full refund if you don't save $500+</span>
                      <div className="relative group">
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          We guarantee you'll save at least $500 in your first year, or we'll refund you in full.
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="text-left">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#d5e27b] flex items-center justify-center">
                          <span className="text-[#045530] text-sm">✓</span>
                        </div>
                        <span className="text-gray-700">3-4 personalized flight deals per week</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#d5e27b] flex items-center justify-center">
                          <span className="text-[#045530] text-sm">✓</span>
                        </div>
                        <span className="text-gray-700">We finds deals up to 90% off regular prices</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#d5e27b] flex items-center justify-center">
                          <span className="text-[#045530] text-sm">✓</span>
                        </div>
                        <span className="text-gray-700">Detailed city guides and activities</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#d5e27b] flex items-center justify-center">
                          <span className="text-[#045530] text-sm">✓</span>
                        </div>
                        <span className="text-gray-700">Flexible date suggestions</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#d5e27b] flex items-center justify-center">
                          <span className="text-[#045530] text-sm">✓</span>
                        </div>
                        <span className="text-gray-700">Price drop alerts</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#d5e27b] flex items-center justify-center">
                          <span className="text-[#045530] text-sm">✓</span>
                        </div>
                        <span className="text-gray-700">Priority customer support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </section>


      {/* Live a life rich with experiences section */}
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#045530] mb-6">
                Live a life rich with experiences, thanks to your smart savings.
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#d5e27b] flex items-center justify-center">
                    <span className="text-[#045530] text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">We keep an eye on flights everywhere</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#d5e27b] flex items-center justify-center">
                    <span className="text-[#045530] text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">You get a heads-up the second a price drops</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#d5e27b] flex items-center justify-center">
                    <span className="text-[#045530] text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">We help you save your money for what matters</span>
                </div>
              </div>
            </div>
            
            {/* Right side - Image */}
            <div>
              <img 
                src="https://i.postimg.cc/vmNx5FCK/Travira-18.png" 
                alt="Live a life rich with experiences" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <div className="py-20 bg-[#f9f7ee]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left side - Title */}
            <div className="text-left">
              <h2 className="text-5xl font-bold text-[#045530] mb-4">FAQ</h2>
              <p className="text-xl text-gray-700">Everything you need to know</p>
            </div>

            {/* Right side - Compact FAQ */}
            <div className="space-y-3">
              {[
                { q: 'How does it work?', a: 'Tell us where you fly from and where you want to go. Our AI finds the best prices and emails you personalized deals.' },
                { q: 'How many deals will I receive?', a: 'On average 2–3 deals per week, tailored to your home airports and interests.' },
                { q: 'Can I choose my destinations?', a: 'Yes! Add dream destinations during onboarding and update them anytime in your dashboard.' },
                { q: 'Is there a free trial?', a: 'Yes, try Travira free for 7 days. Cancel anytime. Then $7.50/mo billed monthly.' },
                { q: 'How do I book a flight deal?', a: 'We send direct booking links so you can book with the airline or a trusted OTA.' },
                { q: 'How long do deals last?', a: 'Deal windows vary. Popular routes can sell out fast—book as soon as you see a match.' },
              ].map((f, i) => (
                <details key={f.q} className="bg-[#d5e27b] rounded-lg p-4 group">
                  <summary className="font-semibold text-[#045530] cursor-pointer flex justify-between items-center text-sm">
                    {f.q}
                    <span className="text-[#045530] group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-[#25201f] mt-3 leading-relaxed text-sm">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

