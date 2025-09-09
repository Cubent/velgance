import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

type HomeProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: HomeProps): Promise<Metadata> => {
  return {
    title: 'Travira - AI-Powered Flight Deal Subscriptions',
    description: 'Never miss a great flight deal again. Get AI-curated flight deals delivered to your inbox for just $99/year.',
    applicationName: 'Travira',
    keywords: ['flight deals', 'travel', 'AI', 'subscription', 'cheap flights', 'travel deals'],
    authors: [{ name: 'Travira Team' }],
    creator: 'Travira',
    publisher: 'Travira',
    openGraph: {
      title: 'Travira - AI-Powered Flight Deal Subscriptions',
      description: 'Never miss a great flight deal again. Get AI-curated flight deals delivered to your inbox for just $99/year.',
      url: 'https://travira.net',
      siteName: 'Travira',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@travira',
    },
  };
};

const Home = async ({ params }: HomeProps) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[80vh] sm:min-h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1621762003306-97bb12dde975?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
          }}
        ></div>
        
        {/* Grainy Filter Overlay */}
        <div className="absolute inset-0 bg-black/20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}></div>
        
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative max-w-7xl mx-auto pl-4 pr-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8 pt-24 pb-8 z-10">
          <div className="text-left sm:text-left">
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-[#f0e8d4] mb-4 leading-tight">
              Never Miss a Great
              <br />
              <span className="text-[#d5e27b]">Flight Deal</span> Again
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-[#f0e8d4] mb-6 max-w-3xl leading-relaxed">
              We alert you when airlines publish flights <span className="font-bold text-[#d5e27b]">50-90% off regular price</span> from your own airport.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-start mb-8">
              <Link
                href="/sign-up?redirect_url=/pricing"
                className="bg-[#d5e27b] text-[#045530] px-5 py-3 sm:px-7 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-[#c4d16a] transition-colors shadow-lg w-fit sm:w-auto"
              >
                Start Your Journey
              </Link>
              <Link
                href="/contact"
                className="border-2 border-[#f0e8d4] text-[#f0e8d4] px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#f0e8d4]/10 transition-colors w-fit sm:w-auto"
              >
                Learn More
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mb-6">
              <div className="flex items-center justify-start gap-2 sm:gap-3 mb-3">
                <div className="flex -space-x-2 sm:-space-x-3">
                  {[
                    'https://randomuser.me/api/portraits/men/32.jpg',
                    'https://randomuser.me/api/portraits/women/44.jpg',
                    'https://randomuser.me/api/portraits/men/46.jpg',
                    'https://randomuser.me/api/portraits/women/68.jpg',
                    'https://randomuser.me/api/portraits/men/86.jpg'
                  ].map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Traveler ${i + 1}`}
                      className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 sm:border-3 border-white shadow-lg object-cover"
                    />
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-sm sm:text-lg text-[#f0e8d4]">50k+ Travelers have</div>
                  <div className="text-sm sm:text-lg text-[#f0e8d4]">joined Travira</div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-start justify-start gap-6 text-[#f0e8d4] text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[#f0e8d4]">✓</span>
                <span>AI-Powered Recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#f0e8d4]">✓</span>
                <span>Personalized for You</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#f0e8d4]">✓</span>
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Airline Partners Section */}
      <div className="py-12 bg-[#25201f] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-white text-center text-2xl font-bold mb-8">Our Airline Partners</h2>
          {/* Scrolling Airline Logos */}
          <div className="relative overflow-hidden">
            <div className="flex space-x-16 items-center animate-scroll">
              {/* Airline logos with better sources */}
              {[
                { name: 'American Airlines', logo: '/America lines.png' },
                { name: 'United Airlines', logo: '/UNITED.png' },
                { name: 'Southwest', logo: '/SOUTHWEST.png' },
                { name: 'JetBlue', logo: '/JETBLUE.png' },
                { name: 'Lufthansa', logo: '/Lufthans.png' },
                { name: 'British Airways', logo: '/british airways.png' },
                { name: 'Qatar Airways', logo: '/QATAR AIRWAYS.png' },
                { name: 'Singapore Airlines', logo: '/SINGAPORE AIRLINE.png' },
                { name: 'Turkish Airlines', logo: '/TURKISH LINES.png' },
                { name: 'Air Canada', logo: '/AIR CANADA.png' }
              ].map((airline, i) => (
                <div key={i} className="flex-shrink-0 flex items-center justify-center h-20 w-40">
                  <img
                    src={airline.logo}
                    alt={airline.name}
                    className="h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {[
                { name: 'American Airlines', logo: '/America lines.png' },
                { name: 'United Airlines', logo: '/UNITED.png' },
                { name: 'Southwest', logo: '/SOUTHWEST.png' },
                { name: 'JetBlue', logo: '/JETBLUE.png' },
                { name: 'Lufthansa', logo: '/Lufthans.png' },
                { name: 'British Airways', logo: '/british airways.png' },
                { name: 'Qatar Airways', logo: '/QATAR AIRWAYS.png' },
                { name: 'Singapore Airlines', logo: '/SINGAPORE AIRLINE.png' },
                { name: 'Turkish Airlines', logo: '/TURKISH LINES.png' },
                { name: 'Air Canada', logo: '/AIR CANADA.png' }
              ].map((airline, i) => (
                <div key={`duplicate-${i}`} className="flex-shrink-0 flex items-center justify-center h-20 w-40">
                  <img
                    src={airline.logo}
                    alt={airline.name}
                    className="h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deals We've Found Section */}
      <div className="py-16 bg-[#f0e8d4] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-[#045530] mb-4">Deals We've Found in the Past</h2>
            <p className="text-xl text-[#045530]">Real deals our members have booked</p>
          </div>

          {/* Scrolling Cards */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll space-x-6 mask-gradient">
              {[
                {
                  price: '$105',
                  route: 'Dallas ⇄ Honolulu',
                  type: 'Roundtrip',
                  image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
                  city: 'Honolulu'
                },
                {
                  price: '$22',
                  route: 'Toronto ⇄ New York',
                  type: 'Roundtrip',
                  image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
                  city: 'New York'
                },
                {
                  price: '$187',
                  route: 'Miami ⇄ Tokyo',
                  type: 'Roundtrip',
                  image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
                  city: 'Tokyo'
                },
                {
                  price: '$89',
                  route: 'LA ⇄ London',
                  type: 'Roundtrip',
                  image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
                  city: 'London'
                },
                {
                  price: '$156',
                  route: 'NYC ⇄ Paris',
                  type: 'Roundtrip',
                  image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  city: 'Paris'
                },
                {
                  price: '$234',
                  route: 'Chicago ⇄ Rome',
                  type: 'Roundtrip',
                  image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
                  city: 'Rome'
                }
              ].concat([
                {
                  price: '$105',
                  route: 'Dallas ⇄ Honolulu',
                  type: 'Roundtrip',
                  image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
                  city: 'Honolulu'
                },
                {
                  price: '$22',
                  route: 'Toronto ⇄ New York',
                  type: 'Roundtrip',
                  image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
                  city: 'New York'
                },
                {
                  price: '$187',
                  route: 'Miami ⇄ Tokyo',
                  type: 'Roundtrip',
                  image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
                  city: 'Tokyo'
                }
              ]).map((deal, i) => (
                <div key={i} className="flex-shrink-0 w-80 h-64 relative rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={deal.image}
                    alt={deal.city}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-600/80 via-green-600/20 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                      BOOKED BY TRAVIRA MEMBERS
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="text-4xl font-bold mb-1">{deal.price}</div>
                    <div className="text-lg font-semibold mb-1">{deal.route}</div>
                    <div className="text-sm opacity-90">{deal.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dividing Line */}
      <div className="flex justify-center py-8 bg-[#f0e8d4]">
        <div className="w-64 h-0.5 bg-[#045530] rounded-full"></div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-[#f0e8d4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Travira Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI does the heavy lifting so you can focus on planning your perfect trip
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Steps */}
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: '#22c55e'}}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Set Your Preferences</h3>
                  <p className="text-gray-600">
                    Tell us your home airports, dream destinations, and travel preferences. Our AI learns what you love.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: '#22c55e'}}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Finds the Best Deals</h3>
                  <p className="text-gray-600">
                    Our advanced algorithms continuously scan millions of flight combinations to find incredible deals.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: '#22c55e'}}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Personalized Alerts</h3>
                  <p className="text-gray-600">
                    Receive curated flight deals in your inbox based on your preferences and travel style.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="flex justify-center">
              <img
                src="https://i.postimg.cc/HxGLV8gz/Gemini-Generated-Image-tvshcstvshcstvsh.png"
                alt="How Travira Works"
                className="w-full max-w-md h-auto rounded-3xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dividing Line */}
      <div className="flex justify-center py-8 bg-[#f0e8d4]">
        <div className="w-64 h-0.5 bg-[#045530] rounded-full"></div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-[#f0e8d4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Travira?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're not just another flight search engine. We're your personal travel assistant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: '#22c55e20'}}>
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart AI Recommendations</h3>
              <p className="text-gray-600">
                Our AI learns from your preferences and booking history to suggest the perfect trips.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: '#22c55e20'}}>
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Guaranteed Savings</h3>
              <p className="text-gray-600">
                We find deals that save you hundreds on flights, often beating other sites by 20-40%.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: '#22c55e20'}}>
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-Time Alerts</h3>
              <p className="text-gray-600">
                Get notified instantly when prices drop for your favorite destinations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: '#22c55e20'}}>
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Coverage</h3>
              <p className="text-gray-600">
                We monitor flights to over 1000 destinations worldwide, from major cities to hidden gems.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: '#22c55e20'}}>
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile Optimized</h3>
              <p className="text-gray-600">
                Access your deals anywhere with our mobile-optimized dashboard and email alerts.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: '#22c55e20'}}>
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Flexible Dates</h3>
              <p className="text-gray-600">
                Find the best deals with flexible date options and travel window recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dividing Line */}
      <div className="flex justify-center py-8 bg-[#f0e8d4]">
        <div className="w-64 h-0.5 bg-[#045530] rounded-full"></div>
      </div>

      {/* Reviews Section */}
      <div className="py-20 bg-[#f0e8d4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real travelers, real savings</h2>
            <p className="text-lg text-gray-600">Join a growing community of travelers saving hundreds on flights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Marcus Chen',
                quote: 'Incredible travel deals, real discounts. Booked a flight for half the price thanks to Travira. Highly recommend!',
                route: 'LA → Rome',
                paid: 189,
                img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              },
              {
                name: 'Sarah Johnson',
                quote: 'Found multiple extremely low prices for me and my family. Travira alerts me to deals I can never find on my own.',
                route: 'NYC → Dubai',
                paid: 107,
                img: 'https://plus.unsplash.com/premium_photo-1688572454849-4348982edf7d?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              },
              {
                name: 'David Rodriguez',
                quote: 'As a budget traveler this is a game changer. I used to spend hours searching. Now the deals come to me.',
                route: 'Toronto → Miami',
                paid: 38,
                img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format'
              }
            ].map((r) => (
              <div key={r.name} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <img src={r.img} alt={r.name} className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-gray-900">{r.name}</div>
                    <div className="text-sm text-gray-600">paid ${r.paid} for a flight {r.route}</div>
                  </div>
                </div>
                <p className="text-gray-700">“{r.quote}”</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dividing Line */}
      <div className="flex justify-center py-8 bg-[#f0e8d4]">
        <div className="w-64 h-0.5 bg-[#045530] rounded-full"></div>
      </div>

      {/* Travel Inspiration Sections */}
      <div className="py-20 bg-[#f0e8d4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Discover Hidden Gems</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our AI doesn't just find cheap flights—it uncovers destinations you never knew were affordable.
                From secret European getaways to tropical paradises, expand your travel horizons without breaking the bank.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Off-the-beaten-path destinations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Insider travel tips</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1523225918988-00624e6d8fee?q=80&w=1411&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Group of friends traveling together exploring destinations"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Section 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <img
                src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=800&auto=format&fit=crop"
                alt="Friends traveling together with luggage at airport"
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Travel More, Spend Less</h2>
              <p className="text-lg text-gray-600 mb-6">
                Stop dreaming and start traveling. With Travira's AI-powered deals, that European vacation
                or Asian adventure is more affordable than you think. Our members save an average of $1,000 per year.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Up to 90% off regular prices</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Instant deal alerts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dividing Line */}
      <div className="flex justify-center py-8 bg-[#f0e8d4]">
        <div className="w-64 h-0.5 bg-[#045530] rounded-full"></div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-[#f0e8d4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">FAQ</h2>
            <p className="text-lg text-gray-600">Everything you need to know</p>
          </div>

          <div className="space-y-4">
            {[
              { q: 'How does it work?', a: 'Tell us where you fly from and where you want to go. Our AI finds the best prices and emails you personalized deals.' },
              { q: 'How many deals will I receive?', a: 'On average 2–3 deals per week, tailored to your home airports and interests.' },
              { q: 'Can I choose my destinations?', a: 'Yes! Add dream destinations during onboarding and update them anytime in your dashboard.' },
              { q: 'Is there a free trial?', a: 'Yes, try Travira free for 7 days. Cancel anytime. Then $8.25/mo billed annually.' },
              { q: 'How do I book a flight deal?', a: 'We send direct booking links so you can book with the airline or a trusted OTA.' },
              { q: 'How long do deals last?', a: 'Deal windows vary. Popular routes can sell out fast—book as soon as you see a match.' },
            ].map((f, i) => (
              <details key={f.q} className="bg-white rounded-xl border border-gray-200 p-6 group">
                <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                  {f.q}
                  <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-700 mt-4 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>


      {/* CTA Section */}
      <div className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Saving on Flights?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who save hundreds on every trip with Travira's AI-powered flight deals.
          </p>
          <Link
            href="/sign-up?redirect_url=/pricing"
            className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg inline-block"
          >
            Get Started for $99/year
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
