'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// Feature data
const features = [
  {
    id: 1,
    title: "Sit back while it handles the heavy lifting, step by step",
    image: "/images/cubent-feature-1.png",
    alt: "Context Intelligence",
    description: "Let Cubent chain terminal commands, edit files, run tests and open pull requests while you sip your coffee—true hands-free automation.",
    content: [
      "Skip the boilerplate. Cubent queues terminal commands, edits files, runs tests and even opens pull-requests in a single autonomous flow. Cubent revolutionizes this experience by providing deep, contextual understanding of your entire project ecosystem. Our advanced AI doesn't just read your code—it comprehends the intricate relationships between components, understands your architectural decisions, and learns from your coding patterns.",

      "Unlike traditional code assistants that work in isolation, Cubent maintains a comprehensive map of your project's structure, dependencies, and design patterns. This enables it to make suggestions that aren't just syntactically correct, but architecturally sound and consistent with your existing codebase. Whether you're working on a microservices architecture, a monolithic application, or a complex distributed system, Cubent adapts to your specific context.",

      "The intelligence extends beyond simple code completion. Cubent analyzes cross-file dependencies, understands the impact of changes across your entire system, and can predict potential issues before they arise. This proactive approach to development helps teams maintain code quality while accelerating their development velocity, making it an indispensable tool for serious product development teams."
    ]
  },
  {
    id: 2,
    title: "Stay in sync with a real-time panel that knows your project",
    image: "/images/cubent-feature-2.png",
    alt: "AI Screenshot Analysis",
    description: "A single overlay that pulses with your repo’s heartbeat—files, problems, Git, terminals and folders always a glance away.",
    content: [
      "Never lose your place again. The context panel surfaces open files, failing tests, Git diffs, terminals and folders in one glanceable hub. Cubent's revolutionary screenshot-to-code technology bridges the gap between design and implementation, allowing developers to transform visual mockups into functional code in seconds rather than hours.",

      "Our advanced computer vision algorithms analyze every pixel of your designs, understanding not just what elements are present, but how they should behave and interact. The system recognizes common UI patterns, understands responsive design principles, and generates code that follows modern best practices. Whether you're working with Figma designs, hand-drawn sketches, or competitor screenshots, Cubent can interpret and implement them accurately.",

      "The generated code isn't just a static representation—it's production-ready, accessible, and optimized for performance. Cubent automatically handles responsive breakpoints, generates semantic HTML, applies appropriate ARIA labels, and ensures cross-browser compatibility. This means you can go from concept to working prototype in minutes, allowing for rapid iteration and faster time-to-market for your products."
    ]
  },
  {
    id: 3,
    title: "Instant browser preview & testing",
    image: "/images/cubent-feature-3.png",
    alt: "Smart Code Editing",
    description: "Spin up a live browser, snap screenshots and sanity-check UX—all without ever Alt-Tabbing out of your editor.",
    content: [
      "Request a ‘preview’ in chat and Cubent spins up a local server, opens a browser preview and streams logs back to you. Cubent's intelligent editing capabilities go far beyond traditional autocomplete, offering a sophisticated understanding of code quality, performance implications, and best practices. Every suggestion is crafted with the goal of not just making your code work, but making it exceptional.",

      "The system continuously analyzes your code for potential improvements, from micro-optimizations that enhance performance to architectural suggestions that improve maintainability. Cubent understands the nuances of different programming languages, frameworks, and design patterns, allowing it to provide highly specific and relevant recommendations tailored to your technology stack and coding style.",

      "What sets Cubent apart is its ability to learn and adapt to your team's specific standards and preferences. It recognizes your coding conventions, understands your project's unique requirements, and evolves its suggestions to match your team's definition of perfect code. This results in a more consistent codebase, reduced technical debt, and a development experience that feels truly personalized and intelligent."
    ]
  }
];

export const Mockup = () => {
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);
  const imagesScrollRef = useRef<HTMLDivElement>(null);
  const textScrollRef = useRef<HTMLDivElement>(null);

  // Sync scroll between images and text containers
  const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
    target.scrollLeft = source.scrollLeft;
  };

  useEffect(() => {
    const imagesContainer = imagesScrollRef.current;
    const textContainer = textScrollRef.current;

    if (!imagesContainer || !textContainer) return;

    const handleImagesScroll = () => syncScroll(imagesContainer, textContainer);
    const handleTextScroll = () => syncScroll(textContainer, imagesContainer);

    imagesContainer.addEventListener('scroll', handleImagesScroll);
    textContainer.addEventListener('scroll', handleTextScroll);

    return () => {
      imagesContainer.removeEventListener('scroll', handleImagesScroll);
      textContainer.removeEventListener('scroll', handleTextScroll);
    };
  }, []);

  return (
  <>
    <div className="w-full relative px-4 sm:px-6" style={{ backgroundColor: '#161616' }}>
      <div className="hidden flex-col items-center justify-center gap-2 py-6">
        <div className="relative w-full max-w-8xl">
          <div className="relative overflow-hidden">
            <Image
              src="/images/Cubent.Dev.webp"
              alt="Cubent Editor Interface - Code editing with AI assistance"
              width={1200}
              height={800}
              className="w-full h-auto object-cover rounded-lg"
              priority
            />
            {/* Soft glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-30 -z-10" />
          </div>
        </div>
      </div>
    </div>

    {/* Made for modern product teams section */}
    <div className="w-full relative px-4 sm:px-6" style={{ backgroundColor: '#161616' }}>
      <div
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 lg:pt-36 pb-0 relative"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderTop: 'none',
          backgroundColor: 'transparent'
        }}
      >

        {/* Top section - Title on left, description on right */}
        <div className="relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-20 items-start mb-20 lg:mb-24">
        {/* Left side - Title */}
        <div className="flex-1 max-w-md">
          <h2 className="text-4xl lg:text-5xl font-regular tracking-tighter text-white">
            An AI that vibes with your code and keeps up with your flow.
          </h2>
        </div>

        {/* Right side - Description */}
        <div className="flex-1 max-w-lg">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Cubent transforms how developers work by providing intelligent, context-aware assistance that learns from your codebase. From instant screenshot-to-code conversion to deep architectural understanding, we're building the future of software development.
          </p>
        </div>
      </div>

      {/* Vertical lines section */}
      <div className="relative z-10 mb-20 lg:mb-24 -mx-6 sm:-mx-8 lg:-mx-12">
        <div className="h-16 lg:h-20 w-full relative overflow-hidden" style={{ backgroundColor: '#161616' }}>
          {/* Top horizontal line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          />
          {/* Thin vertical lines pattern - extending to edges */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '8px 100%'
            }}
          />
          {/* Bottom horizontal line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          />
        </div>
      </div>

      {/* Two images section - attached to lined bar bottom */}
      <div className="relative z-10 -mt-20 lg:-mt-24 mb-8 -mx-6 sm:-mx-8 lg:-mx-12">
        {/* Desktop only: Grid */}
        <div ref={imagesScrollRef} className="hidden md:grid md:grid-cols-2 md:gap-0" style={{ backgroundColor: '#161616' }}>
          {/* Left image */}
          <div className="relative">
            <Image
              src="/images/4.png"
              alt="Stay in sync with a real-time panel that knows your project"
              width={800}
              height={600}
              className="w-full h-auto object-cover border border-gray-600"
            />
          </div>
          {/* Right image */}
          <div className="relative">
            <Image
              src="/images/3.png"
              alt="Sit back while it handles the heavy lifting, step by step"
              width={800}
              height={600}
              className="w-full h-auto object-cover border border-gray-600"
            />
          </div>
        </div>

        {/* Text content directly below images with more spacing */}
        <div ref={textScrollRef} className="md:grid md:grid-cols-2 md:gap-8 flex md:flex-none overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none px-6 sm:px-8 lg:px-12 mt-16 mb-0 relative">
          {/* Center divider line - only on desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 transform -translate-x-1/2"></div>

          {/* Left section - Image + Text */}
          <div className="flex-shrink-0 w-[85vw] md:w-auto snap-center md:snap-align-none max-w-md mx-auto text-left">
            {/* Mobile only image */}
            <div className="block md:hidden mb-6">
              <Image
                src="/images/4.png"
                alt="Stay in sync with a real-time panel that knows your project"
                width={800}
                height={600}
                className="w-full h-auto object-cover border border-gray-600 rounded"
              />
            </div>
            <h3 className="text-4xl font-normal text-white/90 mb-6 leading-tight">
              Stay in sync with a real-time panel that knows your project
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed pb-6">
              A single overlay that pulses with your repo's heartbeat—files, problems, Git, terminals and folders always a glance away.
            </p>
          </div>
          {/* Right section - Image + Text */}
          <div className="flex-shrink-0 w-[85vw] md:w-auto snap-center md:snap-align-none max-w-md mx-auto text-left">
            {/* Mobile only image */}
            <div className="block md:hidden mb-6">
              <Image
                src="/images/3.png"
                alt="Sit back while it handles the heavy lifting, step by step"
                width={800}
                height={600}
                className="w-full h-auto object-cover border border-gray-600 rounded"
              />
            </div>
            <h3 className="text-4xl font-normal text-white/90 mb-6 leading-tight">
              Sit back while it handles the heavy lifting, step by step
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed pb-6">
              Let Cubent chain terminal commands, edit files, run tests and open pull requests while you sip your coffee—true hands-free automation.
            </p>
          </div>
        </div>

        {/* Vertical lines section - inside the container with proper limits */}
        <div className="relative z-10 mt-16">
          <div className="h-16 lg:h-20 w-full relative overflow-hidden" style={{ backgroundColor: '#161616' }}>
            {/* Top horizontal line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            />
            {/* Thin vertical lines pattern - extending to edges */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '8px 100%'
              }}
            />
            {/* Bottom horizontal line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            />
          </div>
        </div>
      </div>
    </div>
    </div>

    {/* MCP Tools Section - Bordered box like AI-powered section */}
    <div className="w-full relative px-4 sm:px-6" style={{ backgroundColor: '#161616' }}>
      <div
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 lg:pt-36 pb-12 lg:pb-16 relative"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderTop: 'none',
          backgroundColor: 'transparent'
        }}
      >


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-start">
            {/* Left side - Content only */}
            <div className="space-y-8 pr-0 lg:pr-20 py-4 -mt-8">
              {/* Mobile image - shown only on mobile at top */}
              <div className="block lg:hidden mb-6">
                <img
                  src="/images/Cubent.Dev (25).png"
                  alt="Cubent MCP Tools interface"
                  className="w-full h-auto object-cover border border-gray-600 rounded"
                />
              </div>

              {/* MCP Tools label */}
              <div className="text-white/60 text-sm font-medium tracking-wider">
                — MCP Tools
              </div>

              {/* Main heading */}
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-regular tracking-tight text-white leading-tight">
                  Integrate with the tools you already use
                </h2>
                <p className="text-white/70 text-lg leading-relaxed max-w-md">
                  Cubent brings together your essential apps with MCP from GitHub to Notion — into one powerful interface. Discover, connect, and explore your data like never before.
                </p>
              </div>
            </div>

            {/* Right side - Square image touching top and right borders - desktop only */}
            <div className="hidden lg:block relative h-full -mr-6 sm:-mr-8 lg:-mr-12">
              <div className="aspect-square w-full absolute -top-24 lg:-top-36 right-0">
                <img
                  src="/images/Cubent.Dev (25).png"
                  alt="Cubent MCP Tools interface"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        {/* Vertical lines section - boxed within bordered container */}
        <div className="relative z-10 mt-32 lg:mt-36 -mx-6 sm:-mx-8 lg:-mx-12">
          <div className="h-16 lg:h-20 w-full relative overflow-hidden" style={{ backgroundColor: '#161616' }}>
            {/* Top horizontal line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            />
            {/* Thin vertical lines pattern - extending to edges */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '8px 100%'
              }}
            />
            {/* Bottom horizontal line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Speed with context awareness section - Hidden on mobile */}
    <div className="hidden md:block w-full relative px-4 sm:px-6" style={{ backgroundColor: '#161616' }}>
      <div
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20 relative"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderTop: 'none',
          backgroundColor: 'transparent'
        }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16 lg:mb-20">
          {/* Left side - Title and description */}
          <div className="flex-1">
            <h2 className="text-4xl lg:text-5xl font-regular tracking-tight text-white leading-tight mb-4">
              Speed with context awareness
            </h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-lg">
              With a Time-to-First-Audio of 40ms, Sonic is the fastest generative voice model built for streaming.
            </p>
          </div>

          {/* Right side - Percentage - Hidden on mobile */}
          <div className="hidden md:flex flex-shrink-0 text-right">
            <div>
              <div
                className="text-4xl md:text-6xl lg:text-7xl font-normal leading-none"
                style={{
                  background: 'linear-gradient(135deg, #ff8c00, #ff4500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                *145%
              </div>
              <p className="text-white/60 text-sm mt-2">
                faster than the next best competitor
              </p>
            </div>
          </div>
        </div>

        {/* Image below the content - Much bigger on mobile */}
        <div className="w-full flex justify-center mb-6 md:mb-8 lg:mb-10 -mx-4 md:mx-0">
          <img
            src="/images/Cubent.Dev (30).png"
            alt="Cubent speed demonstration"
            className="w-[130%] md:w-full max-w-none md:max-w-6xl h-auto object-contain"
          />
        </div>

        {/* Mobile percentage - Below image, smaller text */}
        <div className="md:hidden text-center mb-8">
          <div
            className="text-2xl font-normal leading-none mb-2"
            style={{
              background: 'linear-gradient(135deg, #ff8c00, #ff4500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            *145%
          </div>
          <p className="text-white/60 text-xs">
            faster than the next best competitor
          </p>
        </div>

        {/* Vertical lines section - inside the same container */}
        <div className="relative z-10 -mx-6 sm:-mx-8 lg:-mx-12">
          <div className="h-16 lg:h-20 w-full relative overflow-hidden" style={{ backgroundColor: '#161616' }}>
            {/* Top horizontal line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            />
            {/* Thin vertical lines pattern - extending to edges */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '8px 100%'
              }}
            />
            {/* Bottom horizontal line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Duplicated MCP Tools Section - Image on left, content on right */}
    <div className="w-full relative px-4 sm:px-6" style={{ backgroundColor: '#161616' }}>
      <div
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 lg:py-36 pb-16 lg:pb-20 relative"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderTop: 'none',
          backgroundColor: 'transparent'
        }}
      >

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-start">
            {/* Left side - Square image touching top and left borders */}
            <div className="hidden lg:block relative h-full -ml-6 sm:-ml-8 lg:-ml-12">
              <div className="aspect-square w-full absolute -top-24 lg:-top-36 left-0">
                <img
                  src="/images/Cubent.Dev (29).png"
                  alt="Cubent Autocomplete interface"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right side - Content only */}
            <div className="space-y-8 pl-0 lg:pl-20 py-4 -mt-8">
              {/* Mobile image - shown only on mobile at top */}
              <div className="block lg:hidden mb-6">
                <img
                  src="/images/Cubent.Dev (29).png"
                  alt="Cubent Autocomplete interface"
                  className="w-full h-auto object-cover border border-gray-600 rounded"
                />
              </div>

              {/* Autocomplete label */}
              <div className="text-white/60 text-sm font-medium tracking-wider">
                — Autocomplete
              </div>

              {/* Main heading */}
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-regular tracking-tight text-white leading-tight">
                  Code smarter with context-aware autocomplete
                </h2>
                <p className="text-white/70 text-lg leading-relaxed max-w-md">
                  Experience intelligent code completion that understands your project context. Cubent's autocomplete adapts to your coding patterns and suggests the most relevant completions — just start typing, and let the magic happen.
                </p>
              </div>
            </div>
          </div>

        {/* Vertical lines section - boxed within bordered container */}
        <div className="relative z-10 mt-16 lg:mt-20 -mx-6 sm:-mx-8 lg:-mx-12">
          <div className="h-16 lg:h-20 w-full relative overflow-hidden" style={{ backgroundColor: '#161616' }}>
            {/* Top horizontal line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            />
            {/* Thin vertical lines pattern - extending to edges */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '8px 100%'
              }}
            />
            {/* Bottom horizontal line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Modal */}
    {selectedFeature && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#1a1a1a] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="relative">
            <button
              onClick={() => setSelectedFeature(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
            >
              <X size={20} />
            </button>

            {/* Feature Image */}
            <div className="relative h-80 w-full overflow-hidden">
              <Image
                src={selectedFeature.image}
                alt={selectedFeature.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-8 max-h-[50vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              {selectedFeature.title}
            </h2>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              {selectedFeature.description}
            </p>

            <div className="space-y-6">
              {selectedFeature.content.map((paragraph, index) => (
                <p key={index} className="text-gray-300 leading-relaxed text-base">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm leading-relaxed">
                Experience the power of AI-driven development with Cubent's advanced features designed to accelerate your workflow and improve code quality. Join thousands of developers who have already transformed their development process with intelligent, context-aware coding assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Mockup;
