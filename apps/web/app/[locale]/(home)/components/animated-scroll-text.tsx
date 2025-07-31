'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedScrollTextProps {
  title: string;
  description: string;
}

export const AnimatedScrollText = ({ title, description }: AnimatedScrollTextProps) => {
  const [highlightedWords, setHighlightedWords] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Split the description into two paragraphs for word-by-word animation
  const paragraph1 = "Cubent transforms how developers work by providing intelligent, context-aware assistance that learns from your codebase.";
  const paragraph2 = "From instant screenshot-to-code conversion to deep architectural understanding, we're building the future of software development.";

  const words1 = paragraph1.split(' ');
  const words2 = paragraph2.split(' ');
  const totalWords = words1.length + words2.length;

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Slower highlighting: extend the scroll range for more gradual effect
      const elementTop = rect.top;
      const elementHeight = rect.height;

      // Start highlighting much earlier and finish much later for slower effect
      const startPoint = windowHeight + (windowHeight * 0.5); // Start when element is 50% below viewport
      const endPoint = -elementHeight * 0.5; // Finish when element is 50% above viewport

      let scrollProgress = 0;

      if (elementTop <= startPoint) {
        if (elementTop >= endPoint) {
          // Element is in the highlighting range
          scrollProgress = (startPoint - elementTop) / (startPoint - endPoint);
        } else {
          // Element has fully passed through
          scrollProgress = 1;
        }
      }

      // Ensure progress is between 0 and 1
      scrollProgress = Math.max(0, Math.min(1, scrollProgress));

      // Calculate how many words should be highlighted
      const wordsToHighlight = Math.ceil(scrollProgress * totalWords);

      // Update highlighted words based on scroll position
      setHighlightedWords(Array.from({ length: wordsToHighlight }, (_, i) => i));
    };

    // Add scroll listener with throttling for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [totalWords]);

  return (
    <div ref={containerRef} className="relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-20 items-start mb-20 lg:mb-24">
      {/* Left side - Title (bigger) */}
      <div className="flex-1 max-w-lg">
        <h2 className="text-5xl lg:text-6xl font-regular tracking-tighter text-white leading-tight">
          {title}
        </h2>
      </div>

      {/* Right side - Description (bigger with word-by-word highlighting) */}
      <div className="flex-1 max-w-2xl space-y-6">
        {/* First paragraph */}
        <p className="text-2xl lg:text-3xl leading-relaxed">
          {words1.map((word, index) => (
            <span
              key={index}
              className={`transition-all duration-500 ease-out ${
                highlightedWords.includes(index)
                  ? 'bg-gradient-to-r from-blue-600 via-orange-500 to-blue-400 bg-clip-text text-transparent'
                  : 'text-white'
              }`}
            >
              {word}{index < words1.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>

        {/* Second paragraph */}
        <p className="text-2xl lg:text-3xl leading-relaxed">
          {words2.map((word, index) => {
            const globalIndex = words1.length + index;
            return (
              <span
                key={globalIndex}
                className={`transition-all duration-500 ease-out ${
                  highlightedWords.includes(globalIndex)
                    ? 'bg-gradient-to-r from-blue-600 via-orange-500 to-blue-400 bg-clip-text text-transparent'
                    : 'text-white'
                }`}
              >
                {word}{index < words2.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
};
