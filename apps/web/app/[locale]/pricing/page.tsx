'use client';

import { env } from '@/env';
import { Button } from '@repo/design-system/components/ui/button';
import { Check, MoveRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

const Pricing = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { user } = useUser();

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  const handleStartForFree = async () => {
    if (!user) {
      // Redirect to sign-in if user is not authenticated
      window.location.href = 'https://app.cubent.dev/sign-in';
      return;
    }

    try {
      // Start 7-day free trial without credit card
      const response = await fetch('/api/start-free-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (response.ok) {
        // Redirect to app dashboard after starting trial
        window.location.href = 'https://app.cubent.dev/dashboard';
      } else {
        console.error('Failed to start free trial');
        // Fallback to Clerk billing if API fails
        window.location.href = `https://billing.clerk.com/checkout?plan=cplan_2zLFR32IKfBMjizqcvVF6b3xmzu`;
      }
    } catch (error) {
      console.error('Error starting free trial:', error);
      // Fallback to Clerk billing if API fails
      window.location.href = `https://billing.clerk.com/checkout?plan=cplan_2zLFR32IKfBMjizqcvVF6b3xmzu`;
    }
  };

  const faqData = [
    {
      question: "What happens when I run out of Cubent Units?",
      answer: "You can upgrade your plan, wait for the monthly reset, or switch to BYAK models with your own API keys."
    },
    {
      question: "Can I mix built-in and BYAK models?",
      answer: "Yes! You can use both built-in models (with Cubent Units) and BYAK models (with your API keys) in the same workspace."
    },
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle."
    },
    {
      question: "Are there any usage limits?",
      answer: "Each plan has monthly Cubent Unit allocations. Enterprise plans can have custom limits based on your needs."
    },
    {
      question: "What happens if I upgrade to a higher subscription tier?",
      answer: "Upgrades take effect immediately. You'll be charged the prorated difference for the current billing period and receive the new tier's benefits right away."
    }
  ];

  return (
  <div className="w-full min-h-screen relative -mt-20 pt-20" style={{ backgroundColor: '#161616', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
    <div
      className="max-w-7xl mx-auto relative md:border md:border-white/8 md:bg-transparent md:px-12 md:py-20 px-0 py-8"
      style={{
        backgroundColor: 'transparent'
      }}
    >
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <h1 className="max-w-4xl text-center font-regular text-5xl tracking-tighter md:text-5xl">
            Simple pricing for powerful AI
          </h1>
          <p className="max-w-2xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight">
            Start coding with AI assistance for free, then scale as your projects grow
          </p>


        </div>

        {/* Pricing Plans */}
        <div className="w-full pt-8">
          <div className="relative">
            <div className="flex flex-col lg:flex-row bg-gray-900/30 backdrop-blur-sm overflow-hidden">
              {/* BYAK Plan */}
              <div className="relative flex-1 border border-white/10" style={{
                backgroundColor: '#161616'
              }}>
                <div className="absolute top-0 left-0 right-0 z-20">
                  <div className="bg-gradient-to-r from-blue-600 via-orange-500 to-blue-400 text-black px-4 py-1.5 text-xs font-medium text-center relative">
                    {/* Grain overlay */}
                    <div
                      className="absolute inset-0 opacity-70"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilterEarlyAccess'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='8.5' numOctaves='20' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilterEarlyAccess)'/%3E%3C/svg%3E")`,
                        mixBlendMode: 'overlay'
                      }}
                    />
                    <span className="relative z-10">Early access: 7-day free trial (no credit card)</span>
                  </div>
                </div>
                <div className="p-8 pt-12 h-full flex flex-col text-left">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Byak</h3>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Pricing:</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">$5</span>
                      <span className="text-sm text-muted-foreground">/ month</span>
                    </div>
                    <div className="text-xs text-white mt-1">
                      7-day free trial included
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleStartForFree} className="w-full bg-white/5 hover:bg-white/10 h-10 flex items-center border border-white/20 px-6 mb-4">
                    <Link href={env.NEXT_PUBLIC_APP_URL} className="bg-gradient-to-r from-blue-600 via-orange-500 to-blue-400 bg-clip-text text-transparent hover:text-transparent">
                      Start for Free
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground mb-4">
                    Perfect for passion projects & simple websites.
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-3">Get started with:</p>
                </div>

                <ul className="space-y-2 flex-grow text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-white flex-shrink-0 mt-0.5" />
                    <span>VS Code extension with full AI coding assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-white flex-shrink-0 mt-0.5" />
                    <span>Infinite messages & conversations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-white flex-shrink-0 mt-0.5" />
                    <span>Use your own API keys (OpenAI, Anthropic, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-white flex-shrink-0 mt-0.5" />
                    <span>Chat Mode & Agent Mode with tool calls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-white flex-shrink-0 mt-0.5" />
                    <span>Terminal integration & custom modes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-white flex-shrink-0 mt-0.5" />
                    <span>Access to 23+ AI models</span>
                  </li>
                </ul>
              </div>
            </div>

              {/* Pro Plan */}
              <div className="relative flex-1 border border-white/10" style={{ backgroundColor: '#161616' }}>
                <div className="p-8 pt-12 h-full flex flex-col text-left">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-white/70">Pro</h3>
                    <div className="mb-4">
                      <p className="text-sm text-white/60 mb-1">Pricing:</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white/70">-</span>
                        <span className="text-sm text-white/60">/ month</span>
                      </div>
                      <div className="text-xs text-transparent mt-1">
                        &nbsp;
                      </div>
                    </div>
                    <Button variant="outline" className="w-full text-gray-400 h-10 flex items-center border border-white/10 px-6 mb-4" disabled>
                      Coming Soon
                    </Button>
                    <p className="text-sm text-white/60 mb-4">
                      For production applications with the power to scale.
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-white/60 mb-3">Everything in Byak, plus:</p>
                  </div>

                  <ul className="space-y-2 flex-grow text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-white/60 flex-shrink-0 mt-0.5" />
                      <span className="text-white/60">Generous Cubent Units allocation (no API keys needed)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-white/60 flex-shrink-0 mt-0.5" />
                      <span className="text-white/60">Advanced code generation & refactoring tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-white/60 flex-shrink-0 mt-0.5" />
                      <span className="text-white/60">Enhanced debugging & error analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-white/60 flex-shrink-0 mt-0.5" />
                      <span className="text-white/60">Priority support & faster response times</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Team Plan */}
              <div className="relative flex-1 border border-white/10" style={{ backgroundColor: '#161616' }}>
                <div className="p-8 pt-12 h-full flex flex-col text-left">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-white/70">Team</h3>
                    <div className="mb-4">
                      <p className="text-sm text-white/60 mb-1">Pricing:</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white/70">-</span>
                        <span className="text-sm text-white/60">/ month</span>
                      </div>
                      <div className="text-xs text-transparent mt-1">
                        &nbsp;
                      </div>
                    </div>
                    <Button variant="outline" className="w-full text-gray-400 h-10 flex items-center border border-white/10 px-6 mb-4" disabled>
                      Coming Soon
                    </Button>
                    <p className="text-sm text-white/60 mb-4">
                      SSO, control over backups, and industry certifications.
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-white/60 mb-3">Everything in the Pro Plan, plus:</p>
                  </div>

                  <ul className="space-y-2 flex-grow text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-white/60 flex-shrink-0 mt-0.5" />
                      <span className="text-white/60">Team workspace & shared configurations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-white/60 flex-shrink-0 mt-0.5" />
                      <span className="text-white/60">Code review assistance & team insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-white/60 flex-shrink-0 mt-0.5" />
                      <span className="text-white/60">Advanced security & compliance features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-white/60 flex-shrink-0 mt-0.5" />
                      <span className="text-white/60">Priority email support & training</span>
                    </li>
                  </ul>
                </div>
              </div>


            </div>
          </div>
        </div>

        {/* Model Providers Section - MOVED INSIDE SAME CONTAINER */}
        <div className="w-full max-w-6xl pt-16 text-center">
          {/* Header */}
          <div className="flex flex-col gap-4 text-center max-w-4xl mx-auto mb-12">
            <h2 className="font-regular text-3xl tracking-tighter md:text-4xl">
              First-class support for every major model provider
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed tracking-tight">
              Connect with the AI models you trust. Cubent works seamlessly with all leading providers.
            </p>
          </div>



          {/* Model Provider Logos */}
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">

              {/* OpenAI */}
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/openai.png"
                    alt="OpenAI"
                    className="w-10 h-10 grayscale opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
                <span className="text-lg font-medium text-muted-foreground">OpenAI</span>
              </div>

              {/* Anthropic */}
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/anthropic.png"
                    alt="Anthropic"
                    className="w-10 h-10 grayscale opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
                <span className="text-lg font-medium text-muted-foreground">Anthropic</span>
              </div>

              {/* Google */}
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/google.png"
                    alt="Google"
                    className="w-10 h-10 grayscale opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
                <span className="text-lg font-medium text-muted-foreground">Google</span>
              </div>

              {/* Cohere */}
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/cohere-color.png"
                    alt="Cohere"
                    className="w-10 h-10 grayscale opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
                <span className="text-lg font-medium text-muted-foreground">Cohere</span>
              </div>

              {/* Mistral */}
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/mistral.png"
                    alt="Mistral"
                    className="w-10 h-10 grayscale opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
                <span className="text-lg font-medium text-muted-foreground">Mistral</span>
              </div>

              {/* OpenRouter */}
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/openrouter.png"
                    alt="OpenRouter"
                    className="w-10 h-10 grayscale opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
                <span className="text-lg font-medium text-muted-foreground">OpenRouter</span>
              </div>

            </div>
          </div>



        </div>

        {/* FAQ Section - MOVED INSIDE SAME CONTAINER */}
        <div className="w-full max-w-6xl pt-20">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left side - Title and description */}
            <div className="lg:w-1/3 text-left">
              <h2 className="text-3xl font-bold mb-4 text-left">Frequently asked questions</h2>
              <p className="text-muted-foreground mb-6 text-left">
                If your question is not covered here, you can contact our team.
              </p>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Contact us
              </Button>
            </div>



            {/* Right side - FAQ items */}
            <div className="lg:w-2/3 space-y-0">
              {faqData.map((faq, index) => (
                <div key={index} className="border-b border-white/10 last:border-b-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between py-6 text-left"
                  >
                    <span className="text-white font-medium pr-4 text-left">{faq.question}</span>
                    <Plus className="h-4 w-4 text-white flex-shrink-0" />
                  </button>
                  {openFAQ === index && (
                    <div className="pb-8 -mt-2 text-muted-foreground text-left pt-2">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Let's Code Section - MOVED INSIDE SAME CONTAINER */}
          <div className="w-full pt-20">
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
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />
              <div className="relative z-10">
                <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto text-center">
                  {/* Header */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-400 via-blue-500 via-orange-400 to-blue-300 bg-clip-text text-transparent text-sm font-medium tracking-wider uppercase">
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
  </div>
  );
};

export default Pricing;
