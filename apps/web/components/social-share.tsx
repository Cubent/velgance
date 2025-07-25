'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Share2, X, Link2 } from 'lucide-react';
import { useState } from 'react';

type SocialShareProps = {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
};

export const SocialShare = ({ 
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Cubent - Lightning-Fast AI Code Assistant',
  description = 'AI-native coding assistant for developers. Full-code generation, codebase-aware autocomplete and terminal-ready actions.',
  className = ''
}: SocialShareProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const shareData = {
    title,
    text: description,
    url,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // Simple alert instead of toast for now
      alert('Link copied to clipboard!');
      setIsOpen(false);
    } catch (error) {
      alert('Failed to copy link');
    }
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=cubent`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNativeShare}
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      {isOpen && !navigator.share && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50 min-w-[200px]">
          <div className="space-y-2">
            <button
              onClick={() => openShareWindow(shareUrls.twitter)}
              className="flex items-center gap-3 w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <X className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Share on X (Twitter)</span>
            </button>

            <button
              onClick={() => openShareWindow(shareUrls.linkedin)}
              className="flex items-center gap-3 w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <Share2 className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Share on LinkedIn</span>
            </button>

            <button
              onClick={() => openShareWindow(shareUrls.facebook)}
              className="flex items-center gap-3 w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <Share2 className="w-4 h-4 text-blue-700" />
              <span className="text-sm">Share on Facebook</span>
            </button>
            
            <hr className="border-gray-200 dark:border-gray-600" />
            
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-3 w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <Link2 className="w-4 h-4 text-gray-600" />
              <span className="text-sm">Copy link</span>
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && !navigator.share && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
