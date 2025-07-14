'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
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

    const templateParams = {
      from_name: formData.get('name'),
      from_email: formData.get('email'),
      company: formData.get('company'),
      message: formData.get('message'),
      to_email: 'info@cubent.dev'
    };

    try {
      // You'll need to replace these with your actual EmailJS credentials
      const emailjs = (await import('@emailjs/browser')).default;

      await emailjs.send(
        'service_o5k1k7l',
        'template_azzumcm',
        templateParams,
        'qT_fkVZGSf3rUuPSR'
      );

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
    <div className="w-full min-h-screen relative -mt-20 pt-20" style={{ backgroundColor: '#161616', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
      <div
        className="max-w-7xl mx-auto relative"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'transparent',
          paddingLeft: '3rem',
          paddingRight: '3rem',
          paddingTop: '5rem',
          paddingBottom: '4rem'
        }}
      >
        {/* Hero Section with Form */}
        <div className="w-full relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pb-16 lg:pb-20">
            {/* Left side - Title and description */}
            <div className="flex flex-col gap-6">
              <h1 className="font-regular text-4xl tracking-tighter md:text-6xl lg:text-7xl">
                Get in Touch
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl">
                Ready to transform your development workflow? Let's discuss how Cubent can accelerate your engineering team.
              </p>
            </div>

            {/* Right side - Contact Form */}
            <div className="bg-neutral-900/30 backdrop-blur-sm rounded-xl p-8 border border-neutral-700/30">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Message sent successfully! We'll get back to you within 24 hours.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
                    ❌ Failed to send message. Please try again or email us directly at info@cubent.dev
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-white mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about your project and how we can help..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full relative overflow-hidden text-white py-3 border-0 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                    backgroundSize: '200% 200%'
                  }}
                >
                  <span className="relative z-10">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </span>
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilterForm'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilterForm)' opacity='0.4'/%3E%3C/svg%3E")`,
                      mixBlendMode: 'overlay'
                    }}
                  />
                </Button>
              </form>
            </div>
          </div>
        </div>





        {/* Divider Line */}
        <div className="w-full">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent"></div>
        </div>

        {/* Why Choose Cubent */}
        <div className="w-full py-20 lg:py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-regular tracking-tighter md:text-4xl mb-4">
              Why Choose Cubent?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Join forward-thinking engineering teams who trust Cubent to accelerate their development workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div
                className="relative rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(95, 158, 160, 0.1) 0%, rgba(216, 162, 200, 0.1) 50%, rgba(255, 140, 0, 0.1) 100%)',
                  border: '1px solid rgba(95, 158, 160, 0.2)'
                }}
              >
                <span
                  className="font-bold text-lg relative z-10"
                  style={{
                    background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >01</span>
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter6'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter6)' opacity='0.4'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay'
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">Enterprise-Ready</h3>
              <p className="text-muted-foreground text-sm">
                Built for scale with enterprise security, compliance, and deployment options.
              </p>
            </div>

            <div className="text-center">
              <div
                className="relative rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(95, 158, 160, 0.1) 0%, rgba(216, 162, 200, 0.1) 50%, rgba(255, 140, 0, 0.1) 100%)',
                  border: '1px solid rgba(95, 158, 160, 0.2)'
                }}
              >
                <span
                  className="font-bold text-lg relative z-10"
                  style={{
                    background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >02</span>
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter7'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter7)' opacity='0.4'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay'
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">Proven Results</h3>
              <p className="text-muted-foreground text-sm">
                Teams see 2x faster development cycles and improved code quality.
              </p>
            </div>

            <div className="text-center">
              <div
                className="relative rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(95, 158, 160, 0.1) 0%, rgba(216, 162, 200, 0.1) 50%, rgba(255, 140, 0, 0.1) 100%)',
                  border: '1px solid rgba(95, 158, 160, 0.2)'
                }}
              >
                <span
                  className="font-bold text-lg relative z-10"
                  style={{
                    background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >03</span>
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter8'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter8)' opacity='0.4'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay'
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">Dedicated Support</h3>
              <p className="text-muted-foreground text-sm">
                Get hands-on support from our team throughout your journey.
              </p>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent"></div>
        </div>

        {/* Extension Download Section */}
        <div className="w-full py-20 lg:py-32">
          <div className="max-w-6xl mx-auto">
            <div
              className="relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #f97316 50%, #1e40af 100%)',
                borderRadius: '12px',
                padding: '4rem 2rem'
              }}
            >
              {/* Grain overlay */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilterExtension'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilterExtension)'/%3E%3C/svg%3E")`,
                }}
              />
              <div className="relative z-10">
                <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto text-center">
                  {/* Header */}
                  <div className="space-y-4">
                    <div className="text-white/80 text-sm font-medium tracking-wider uppercase">
                      — Let's Code
                    </div>
                    <h2 className="text-white font-regular text-3xl tracking-tighter md:text-5xl leading-tight">
                      Install our extension and<br />
                      start coding today
                    </h2>
                    <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
                      Get started with AI-powered development. Choose your preferred editor and experience the future of coding.
                    </p>
                  </div>

                  {/* Download Button */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" asChild className="bg-white text-black hover:bg-gray-100 h-12 px-8">
                      <Link href="https://marketplace.visualstudio.com/items?itemName=cubent.cubent" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
                          </svg>
                          VS Code
                        </div>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
