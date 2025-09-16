'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [flightsPerYear, setFlightsPerYear] = useState(2);

  const handleSubscribe = async () => {
    if (!user) {
      router.push('/sign-up?redirect_url=/pricing');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/onboarding?success=true`,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff0d2]">
      {/* Header with background */}
      <div className="bg-[#045530] relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-12 h-12 bg-[#045530] rounded-full opacity-20"></div>
        <div className="absolute top-20 right-20 w-8 h-8 bg-[#d5e27b]/20 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-10 h-10 bg-[#d5e27b]/10 rounded-full"></div>
        <div className="absolute top-32 left-1/3 w-6 h-6 bg-[#045530] rounded-full opacity-15"></div>
        <div className="absolute top-40 right-1/3 w-8 h-8 bg-[#d5e27b]/15 rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-7 h-7 bg-[#045530] rounded-full opacity-25"></div>
        <div className="absolute top-16 left-1/2 w-5 h-5 bg-[#d5e27b]/30 rounded-full"></div>
        <div className="absolute bottom-16 right-1/4 w-9 h-9 bg-[#045530] rounded-full opacity-10"></div>
        <div className="absolute top-24 left-1/5 w-6 h-6 bg-[#d5e27b]/25 rounded-full"></div>
        <div className="absolute top-36 right-1/5 w-7 h-7 bg-[#045530] rounded-full opacity-18"></div>
        <div className="absolute bottom-24 left-1/6 w-8 h-8 bg-[#d5e27b]/12 rounded-full"></div>
        <div className="absolute top-28 right-1/6 w-5 h-5 bg-[#045530] rounded-full opacity-22"></div>
        
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

      {/* Pricing Card */}
      <section className="relative">
        {/* Green background that ends early */}
        <div className="absolute inset-0 bg-[#045530] rounded-b-[50%] h-48"></div>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
          <div className="grid grid-cols-1 gap-6">
            <div className="relative rounded-2xl bg-white p-8 shadow-lg border border-gray-200">
              {/* Popular Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-[#d5e27b] text-[#045530] px-4 py-1 rounded-full text-sm font-semibold">
                  Popular
                </div>
              </div>
              
              {/* Main Content - Vertical Layout */}
              <div className="pt-4 text-center">
                <h2 className="text-3xl font-bold text-[#045530] mb-2">Join the Club</h2>
                <p className="text-lg text-gray-600 mb-6">You'll gain full access to all flight deals</p>
                
                {/* Price - Centered below title */}
                <div className="flex items-end justify-center gap-2 mb-6">
                  <span className="text-5xl font-bold text-[#045530]">$7.50</span>
                  <span className="pb-2 text-gray-600">/mo</span>
                </div>

                <div className="text-gray-700 mb-8">7-day free trial · Full refund if you don't save $500+</div>

                {/* Features List */}
                <div className="text-left mb-8">
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
                      <span className="text-gray-700">AI finds deals up to 90% off regular prices</span>
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

                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-[#045530] px-8 py-4 font-semibold text-white shadow-sm hover:bg-[#033f24] disabled:opacity-50 text-lg"
                  >
                    {loading ? 'Processing…' : 'Start Free Trial'}
                  </button>
                  <button className="w-full inline-flex items-center justify-center rounded-xl border-2 border-[#045530] px-8 py-4 font-semibold text-[#045530] hover:bg-[#045530]/5 text-lg">
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estimated Savings Section - Separated */}
      <section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <div className="text-sm text-gray-600 mb-2">Estimated savings</div>
                <div className="text-4xl font-bold text-[#045530]">$1,000</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-3">How many flights per year?</div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setFlightsPerYear(Math.max(1, flightsPerYear - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-[#045530] flex items-center justify-center text-[#045530] hover:bg-[#045530]/5"
                  >
                    -
                  </button>
                  <div className="w-20 text-center font-semibold text-lg">{flightsPerYear} flights</div>
                  <button 
                    onClick={() => setFlightsPerYear(flightsPerYear + 1)}
                    className="w-10 h-10 rounded-lg border-2 border-[#045530] flex items-center justify-center text-[#045530] hover:bg-[#045530]/5"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-6 text-gray-600">
              The average Travira member saves over $1,000 in their first year. We guarantee you'll save at least $500 or we'll refund you in full.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Real Stories, Real Savings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{
              name: 'Marilena Perricci',
              quote: 'Incredible travel deals, real discounts. Booked a flight for half the price thanks to Travira. Super easy to use!'
            }, {
              name: 'Bri Palermo',
              quote: 'Found multiple extremely low prices for me and my family. Alerts that I can never find on my own.'
            }, {
              name: 'Emily Irene',
              quote: 'For budget traveling, this is a great tool. Their algorithm does the searching and sends the deals.'
            }].map((t) => (
              <div key={t.name} className="rounded-xl border border-gray-200 p-6 bg-white">
                <div className="font-semibold text-gray-900">{t.name}</div>
                <p className="text-gray-700 mt-2">“{t.quote}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why join */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why join the Club?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-gray-200 p-6 bg-white">
              <div className="font-semibold mb-2">Unbeatable prices</div>
              <p className="text-gray-700">Our AI scans millions of fares in real time to detect major price drops, up to 90% off.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 bg-white">
              <div className="font-semibold mb-2">150+ deals per year</div>
              <p className="text-gray-700">We send 2–3 flight deals per week, personalized to your home airport.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 bg-white">
              <div className="font-semibold mb-2">More than just deals</div>
              <p className="text-gray-700">Each destination includes insider tips from our community with hidden gems and trusted recs.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

