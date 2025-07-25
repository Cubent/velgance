'use client';

import { useEffect } from 'react';

export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Minimal safe optimizations only
    const optimizeImages = () => {
      try {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
          // Add loading="lazy" if not present
          if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
          }

          // Add decoding="async" for better performance
          if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
          }
        });
      } catch (error) {
        console.warn('Image optimization failed:', error);
      }
    };

    // Run minimal optimizations
    const runOptimizations = () => {
      optimizeImages();
    };

    // Run once after component mounts
    setTimeout(runOptimizations, 1000);
  }, []);

  return null;
};
