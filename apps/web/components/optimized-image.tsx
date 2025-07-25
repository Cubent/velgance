'use client';

import Image from 'next/image';
import React, { useState } from 'react';

type OptimizedImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
};

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 60, // Aggressive compression for AVIF
  placeholder = 'empty',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  style,
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate blur placeholder if not provided
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    className: `transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`,
    onLoad: handleLoad,
    onError: handleError,
    quality,
    priority,
    sizes,
    placeholder,
    blurDataURL: blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined),
    style,
    ...props,
  };

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
      />
    );
  }

  if (!width || !height) {
    console.warn('OptimizedImage: width and height should be provided for better performance');
    return (
      <Image
        {...imageProps}
        width={width || 800}
        height={height || 600}
      />
    );
  }

  return (
    <Image
      {...imageProps}
      width={width}
      height={height}
    />
  );
};

// Helper function to strip metadata from images
export const stripImageMetadata = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const strippedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(strippedFile);
          } else {
            resolve(file);
          }
        }, file.type, 0.9);
      } else {
        resolve(file);
      }
    };
    
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
};

// Component for lazy loading images with intersection observer
export const LazyImage = ({ 
  src, 
  alt, 
  className = '',
  ...props 
}: OptimizedImageProps) => {
  const [isInView, setIsInView] = useState(false);
  const [imgRef, setImgRef] = useState<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!imgRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(imgRef);

    return () => observer.disconnect();
  }, [imgRef]);

  return (
    <div ref={setImgRef} className={className}>
      {isInView ? (
        <OptimizedImage src={src} alt={alt} {...props} />
      ) : (
        <div 
          className="bg-gray-200 animate-pulse"
          style={{ width: props.width, height: props.height }}
        />
      )}
    </div>
  );
};
