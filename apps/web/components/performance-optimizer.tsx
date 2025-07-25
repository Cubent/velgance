'use client';

import { useEffect } from 'react';

export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Remove unused CSS classes
    const removeUnusedStyles = () => {
      const stylesheets = document.styleSheets;
      const usedSelectors = new Set<string>();
      
      // Collect all used classes
      document.querySelectorAll('*').forEach(element => {
        element.classList.forEach(className => {
          usedSelectors.add(`.${className}`);
        });
      });

      // Mark unused rules (in development only)
      if (process.env.NODE_ENV === 'development') {
        Array.from(stylesheets).forEach(stylesheet => {
          try {
            const rules = stylesheet.cssRules || stylesheet.rules;
            if (rules) {
              Array.from(rules).forEach(rule => {
                if (rule instanceof CSSStyleRule) {
                  if (!usedSelectors.has(rule.selectorText)) {
                    // In production, you might want to remove these
                    console.log('Unused CSS rule:', rule.selectorText);
                  }
                }
              });
            }
          } catch (e) {
            // Cross-origin stylesheets can't be accessed
          }
        });
      }
    };

    // Optimize images
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // Add loading="lazy" if not present
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        
        // Add decoding="async" for better performance
        if (!img.hasAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }
        
        // Remove unnecessary metadata attributes
        img.removeAttribute('data-exif');
        img.removeAttribute('data-camera');
      });
    };

    // Reduce DOM complexity
    const optimizeDOM = () => {
      // Remove empty elements
      const emptyElements = document.querySelectorAll('div:empty, span:empty, p:empty');
      emptyElements.forEach(element => {
        if (element.children.length === 0 && !element.textContent?.trim()) {
          element.remove();
        }
      });

      // Combine adjacent text nodes
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let node;
      while (node = walker.nextNode()) {
        if (node.nextSibling && node.nextSibling.nodeType === Node.TEXT_NODE) {
          node.textContent += node.nextSibling.textContent;
          node.nextSibling.remove();
        }
      }
    };

    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts
      const fontUrls = [
        '/fonts/inter-var.woff2',
        '/fonts/geist-mono-var.woff2'
      ];
      
      fontUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    // Run optimizations
    const runOptimizations = () => {
      optimizeImages();
      optimizeDOM();
      preloadCriticalResources();
      
      // Run CSS optimization after a delay to ensure all styles are loaded
      setTimeout(removeUnusedStyles, 1000);
    };

    // Run on load and when DOM changes
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runOptimizations);
    } else {
      runOptimizations();
    }

    // Observe DOM changes for dynamic content
    const observer = new MutationObserver((mutations) => {
      let shouldOptimize = false;
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldOptimize = true;
        }
      });
      
      if (shouldOptimize) {
        setTimeout(optimizeImages, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
};
