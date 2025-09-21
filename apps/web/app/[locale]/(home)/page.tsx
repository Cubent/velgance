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
    title: 'Travira | Save 50-90% off Flight Deals',
    description: 'Find incredible flight deals with AI-powered search. Save 50-90% on flights worldwide.',
    applicationName: 'Travira',
    keywords: ['flight deals', 'travel', 'AI', 'subscription', 'cheap flights', 'travel deals'],
    authors: [{ name: 'Travira Team' }],
    creator: 'Travira',
    publisher: 'Travira',
    openGraph: {
      title: 'Travira | Save 50-90% off Flight Deals',
      description: 'Find incredible flight deals with AI-powered search. Save 50-90% on flights worldwide.',
      url: 'https://travira.org',
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
    <div className="min-h-screen" style={{ backgroundColor: '#f0e8d4' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[80vh] sm:min-h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl mx-2 sm:mx-4 mb-4 mt-2"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1621762003306-97bb12dde975?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
          }}
        ></div>
        
        {/* Grainy Filter Overlay */}
        <div className="absolute inset-0 bg-black/20 rounded-2xl mx-2 sm:mx-4 mb-4 mt-2" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}></div>
        
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 rounded-2xl mx-2 sm:mx-4 mb-4 mt-2"></div>

        <div className="relative max-w-7xl mx-auto pl-4 pr-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8 pt-24 pb-8 z-10">
          <div className="text-center sm:text-left">
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-[#f0e8d4] mb-4 leading-tight">
              Never Miss a Great
              <br />
              <span className="text-[#d5e27b]">Flight Deal</span> Again
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-[#f0e8d4] mb-6 max-w-3xl leading-relaxed">
              We alert you when airlines publish flights <span className="font-bold text-[#d5e27b]">50-90% off regular price</span> from your own airport.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start mb-8">
              <Link
                href="/dashboard"
                className="bg-[#d5e27b] text-[#045530] px-8 py-3 sm:px-7 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-[#c4d16a] transition-colors shadow-lg w-fit mx-auto sm:mx-0 text-center min-w-[200px] sm:min-w-0"
              >
                Start Your Journey
              </Link>
              <Link
                href="/mailing-list"
                className="border-2 border-[#f0e8d4] text-[#f0e8d4] px-8 py-3 sm:px-6 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#f0e8d4]/10 transition-colors w-fit mx-auto sm:mx-0 text-center min-w-[160px] sm:min-w-0"
              >
                Learn More
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mb-6">
              <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-3">
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
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-6 text-[#f0e8d4] text-sm">
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
      <div className="pt-2 pb-1 bg-[#045530] sm:bg-[#25201f] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Scrolling Airline Logos */}
          <div className="relative overflow-hidden">
            <div className="flex space-x-8 sm:space-x-16 items-center animate-scroll">
              {/* Airline logos with better sources */}
              {[
                { name: 'Air Canada', logo: 'https://i.postimg.cc/zGbxzG1z/AIR-CANADA.png' },
                { name: 'American Airlines', logo: 'https://i.postimg.cc/B6spB5Pb/America-lines.png' },
                { name: 'British Airways', logo: 'https://i.postimg.cc/XYRQp6Vw/british-airways.png' },
                { name: 'JetBlue', logo: 'https://i.postimg.cc/CKbJ8r19/JETBLUE.png' },
                { name: 'Lufthansa', logo: 'https://i.postimg.cc/9Mpp84yp/Lufthans.png' },
                { name: 'Qatar Airways', logo: 'https://i.postimg.cc/Bb7C3dYP/QATAR-AIRWAYS.png' },
                { name: 'Singapore Airlines', logo: 'https://i.postimg.cc/6qphD90N/SINGAPORE-AIRLINE.png' },
                { name: 'Southwest', logo: 'https://i.postimg.cc/wxw2Dmqx/SOUTHWEST.png' },
                { name: 'United Airlines', logo: 'https://i.postimg.cc/rFzJjws1/TURKISH-LINES.png' }
              ].map((airline, i) => (
                <div key={i} className="flex-shrink-0 flex items-center justify-center h-28 w-56 overflow-hidden">
                  <img
                    src={airline.logo}
                    alt={airline.name}
                    className="h-20 w-auto object-cover object-center opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {[
                { name: 'Air Canada', logo: 'https://i.postimg.cc/zGbxzG1z/AIR-CANADA.png' },
                { name: 'American Airlines', logo: 'https://i.postimg.cc/B6spB5Pb/America-lines.png' },
                { name: 'British Airways', logo: 'https://i.postimg.cc/XYRQp6Vw/british-airways.png' },
                { name: 'JetBlue', logo: 'https://i.postimg.cc/CKbJ8r19/JETBLUE.png' },
                { name: 'Lufthansa', logo: 'https://i.postimg.cc/9Mpp84yp/Lufthans.png' },
                { name: 'Qatar Airways', logo: 'https://i.postimg.cc/Bb7C3dYP/QATAR-AIRWAYS.png' },
                { name: 'Singapore Airlines', logo: 'https://i.postimg.cc/6qphD90N/SINGAPORE-AIRLINE.png' },
                { name: 'Southwest', logo: 'https://i.postimg.cc/wxw2Dmqx/SOUTHWEST.png' },
                { name: 'United Airlines', logo: 'https://i.postimg.cc/rFzJjws1/TURKISH-LINES.png' }
              ].map((airline, i) => (
                <div key={`duplicate-${i}`} className="flex-shrink-0 flex items-center justify-center h-28 w-56 overflow-hidden">
                  <img
                    src={airline.logo}
                    alt={airline.name}
                    className="h-20 w-auto object-cover object-center opacity-90 hover:opacity-100 transition-opacity"
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
            <div className="flex animate-scroll space-x-3 sm:space-x-6 mask-gradient">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#045530]/80 via-[#045530]/20 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-[#d5e27b] text-[#045530] px-3 py-1 rounded-full text-sm font-semibold">
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
        <div className="w-96 sm:w-[600px] lg:w-[800px] xl:w-[1000px] h-px bg-amber-800/50 rounded-full"></div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-[#f0e8d4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#045530] mb-4">How Travira Works</h2>
            <p className="text-xl text-[#045530]">Our AI does the heavy lifting so you can focus on planning your perfect trip</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Steps */}
            <div className="space-y-16">
              {/* Step 1 */}
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#045530]">
                  <span className="text-2xl font-bold text-[#045530]">1</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[#045530] mb-3">Set Your Preferences</h3>
                  <p className="text-gray-600">
                    Tell us your home airports, dream destinations, and travel preferences. Our AI learns what you love.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#045530]">
                  <span className="text-2xl font-bold text-[#045530]">2</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[#045530] mb-3">AI Finds the Best Deals</h3>
                  <p className="text-gray-600">
                    Our advanced algorithms continuously scan millions of flight combinations to find incredible deals.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#045530]">
                  <span className="text-2xl font-bold text-[#045530]">3</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[#045530] mb-3">Get Personalized Alerts</h3>
                  <p className="text-gray-600">
                    Receive curated flight deals in your inbox based on your preferences and travel style.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="flex justify-center">
              <img
                src="https://i.postimg.cc/8cdjBWWp/Travira-3.png"
                alt="How Travira Works"
                className="w-full max-w-xl h-auto rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-[#045530]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#d5e27b] mb-4">Why Choose Travira?</h2>
            <p className="text-xl text-[#d5e27b]">We're not just another flight search engine. We're your personal travel assistant.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Feature 1 */}
            <div className="p-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-[#d5e27b]">
                <svg className="w-6 h-6 text-[#045530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#fff0d2] mb-3">Smart AI Recommendations</h3>
              <p className="text-[#fff0d2]">
                Our AI learns from your preferences and booking history to suggest the perfect trips.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-[#d5e27b]">
                <svg className="w-6 h-6 text-[#045530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#fff0d2] mb-3">Guaranteed Savings</h3>
              <p className="text-[#fff0d2]">
                We find deals that save you hundreds on flights, often beating other sites by 20-40%.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-[#d5e27b]">
                <svg className="w-6 h-6 text-[#045530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#fff0d2] mb-3">Real-Time Alerts</h3>
              <p className="text-[#fff0d2]">
                Get notified instantly when prices drop for your favorite destinations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-[#d5e27b]">
                <svg className="w-6 h-6 text-[#045530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#fff0d2] mb-3">Global Coverage</h3>
              <p className="text-[#fff0d2]">
                We monitor flights to over 1000 destinations worldwide, from major cities to hidden gems.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-[#d5e27b]">
                <svg className="w-6 h-6 text-[#045530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#fff0d2] mb-3">Mobile Optimized</h3>
              <p className="text-[#fff0d2]">
                Access your deals anywhere with our mobile-optimized dashboard and email alerts.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-[#d5e27b]">
                <svg className="w-6 h-6 text-[#045530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#fff0d2] mb-3">Flexible Dates</h3>
              <p className="text-[#fff0d2]">
                Find the best deals with flexible date options and travel window recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-20 bg-[#f0e8d4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-[#045530] mb-4">Real travelers, real savings</h2>
            <p className="text-xl text-[#045530]">Join a growing community of travelers saving hundreds on flights</p>
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
              <div key={r.name} className="bg-[#d5e27b] rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img src={r.img} alt={r.name} className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-[#045530]">{r.name}</div>
                    <div className="text-sm text-[#045530]">paid ${r.paid} for a flight {r.route}</div>
                  </div>
                </div>
                <p className="text-[#045530]">"{r.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dividing Line */}
      <div className="flex justify-center py-8 bg-[#f0e8d4]">
        <div className="w-96 sm:w-[600px] lg:w-[800px] xl:w-[1000px] h-px bg-amber-800/50 rounded-full"></div>
      </div>

      {/* Travel Inspiration Sections */}
      <div className="py-20 bg-[#f0e8d4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <h2 className="text-6xl font-bold text-[#045530] mb-6">Never Overpay for Flights Again</h2>
              <p className="text-lg text-gray-600 mb-6">
                Airline prices jump up and down hundreds of times a day. We keep watch so you don't have to tracking live fares, spotting real bargains, and pinging you the second a major price drop hits.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#d5e27b]">
                    <svg className="w-4 h-4 text-[#045530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">We stalk flights so you don't have</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#d5e27b]">
                    <svg className="w-4 h-4 text-[#045530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">We spot the real drops</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#d5e27b]">
                    <svg className="w-4 h-4 text-[#045530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                  <span className="text-gray-700">We're faster than your friends</span>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative -mt-4 sm:mt-0">
              <img
                src="https://i.postimg.cc/rwcJ5CBH/Travira-1.png"
                alt="Never Overpay for Flights Again"
                className="w-full max-w-xl h-auto rounded-2xl"
              />
            </div>
          </div>

          {/* Dividing Line */}
          <div className="flex justify-center mb-20">
            <div className="w-96 sm:w-[600px] lg:w-[800px] xl:w-[1000px] h-px bg-amber-800/50"></div>
          </div>

          {/* Section 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-1 lg:order-1 relative -mt-4 sm:mt-0">
              <img
                src="https://i.postimg.cc/Fz6KNZjH/Travira-2.png"
                alt="Travel More, Spend Less"
                className="w-full max-w-5xl h-auto rounded-2xl"
              />
            </div>
            <div className="order-2 lg:order-2">
              <h2 className="text-6xl font-bold text-[#045530] mb-6">Travel More, Spend Less</h2>
              <p className="text-lg text-gray-600 mb-6">
                Stop dreaming and start traveling. With Travira's AI-powered deals, that European vacation
                or Asian adventure is more affordable than you think. Our members save an average of $1,000 per year.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#d5e27b]">
                    <svg className="w-4 h-4 text-[#045530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Up to 90% off regular prices</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#d5e27b]">
                    <svg className="w-4 h-4 text-[#045530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Instant deal alerts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-[#045530]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-5xl font-bold text-[#fff0d2] mb-4">FAQ</h2>
            <p className="text-xl text-[#fff0d2]">Everything you need to know</p>
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
              <details key={f.q} className="bg-[#d5e27b] rounded-xl p-6 group">
                <summary className="font-semibold text-[#045530] cursor-pointer flex justify-between items-center">
                  {f.q}
                  <span className="text-[#045530] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-[#25201f] mt-4 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>


      {/* CTA Section */}
      <div className="py-20 bg-[#fff0d2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-[#045530] mb-6">
            Ready to Start Saving on Flights?
          </h2>
          <p className="text-xl text-[#045530] mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who save hundreds on every trip with Travira's AI-powered flight deals.
          </p>
          <Link
            href="/dashboard"
            className="bg-[#045530] text-[#d5e27b] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#045530]/90 transition-colors shadow-lg inline-block"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
