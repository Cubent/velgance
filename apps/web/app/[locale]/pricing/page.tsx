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
      router.push('/sign-in');
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
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Try Travira Free for 7 Days
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Continue for the price of a small macchiato. We guarantee you save at least $500 in your first year or we’ll refund you in full.
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Join the Club</h2>
                  <p className="mt-1 text-gray-600">You’ll gain full access to all flight deals</p>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-gray-900">$8.25</span>
                  <span className="pb-2 text-gray-600">/mo</span>
                </div>
              </div>

              <div className="mt-2 text-gray-700">Billed annually at $99 · Full refund if you don’t save $500+</div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Processing…' : 'Start Free Trial'}
                </button>
                <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50">
                  Learn more
                </button>
              </div>

              {/* Estimated savings */}
              <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Estimated savings</div>
                    <div className="text-3xl font-bold text-gray-900">$1,000</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">How many flights per year?</div>
                    <div className="mt-2 flex items-center gap-2">
                      <button className="px-3 py-1.5 rounded-lg border">-</button>
                      <div className="w-16 text-center font-semibold">2 flights</div>
                      <button className="px-3 py-1.5 rounded-lg border">+</button>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  The average Travira member saves over $1,000 in their first year. We guarantee you’ll save at least $500 or we’ll refund you in full.
                </p>
              </div>
            </div>
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

