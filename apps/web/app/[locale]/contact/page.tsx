'use client';

import { useState } from 'react';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // For now, just simulate success - you can integrate with your preferred email service
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      form.reset();
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-0 sm:px-4 relative"
      style={{ backgroundColor: '#fffef7' }}
    >

      <div className="w-full max-w-4xl relative z-10">
        {/* Hero Section with Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-start">
          {/* Left side - Title and description */}
          <div className="flex flex-col gap-6 text-center sm:text-left">
            <h1 className="text-4xl md:text-6xl font-bold pt-8" style={{ color: '#045530' }}>
              Get in Touch
            </h1>
            <p className="text-lg leading-relaxed md:text-xl px-4 sm:px-0" style={{ color: '#045530' }}>
              Have questions about Travira? Need help with your subscription? We're here to help you find your next great flight deal.
            </p>

            {/* Contact Info */}
            <div className="space-y-4 mt-8">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="bg-[#d5e27b] rounded-full p-2">
                  <svg className="w-5 h-5" style={{ color: '#045530' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-medium" style={{ color: '#045530' }}>Email</p>
                  <p style={{ color: '#045530' }}>support@travira.org</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="bg-[#d5e27b] rounded-full p-2">
                  <svg className="w-5 h-5" style={{ color: '#045530' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-medium" style={{ color: '#045530' }}>Response Time</p>
                  <p style={{ color: '#045530' }}>Within 24 hours</p>
                </div>
              </div>
            </div>
            
            {/* Travira Logo */}
            <div className="mt-8 flex justify-center sm:justify-start">
              <img 
                src="https://i.postimg.cc/KjR55hC6/Travira-9.png" 
                alt="Travira Logo" 
                className="h-64 w-auto hidden sm:block"
              />
            </div>
          </div>

          {/* Right side - Contact Form */}
          <div className="rounded-lg sm:rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-sm p-4 sm:p-8 shadow-sm mx-4 sm:mx-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-4 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Message sent successfully! We'll get back to you within 24 hours.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                  ❌ Failed to send message. Please try again or email us directly at support@travira.org
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#045530' }}>
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d5e27b] focus:border-transparent"
                  style={{ color: '#045530' }}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#045530' }}>
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d5e27b] focus:border-transparent"
                  style={{ color: '#045530' }}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: '#045530' }}>
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d5e27b] focus:border-transparent"
                  style={{ color: '#045530' }}
                >
                  <option value="">Select a topic</option>
                  <option value="subscription">Subscription Help</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#045530' }}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d5e27b] focus:border-transparent resize-none"
                  style={{ color: '#045530' }}
                  placeholder="How can we help you with your flight deal subscriptions?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#d5e27b] text-[#045530] py-3 px-6 rounded-lg font-semibold hover:bg-[#c4d16a] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-20 bg-[#045530] mt-16">
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

      </div>
    </div>
  );
};

export default Contact;
