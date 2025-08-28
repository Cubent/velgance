'use client';

import { useEffect, useRef, useState } from 'react';

interface CustomVideoPlayerProps {
  src: string;
  className?: string;
}

export const CustomVideoPlayer = ({ src, className = '' }: CustomVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressInputRef = useRef<HTMLInputElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video) {
      const percentage = parseFloat(e.target.value);
      video.currentTime = (percentage / 100) * video.duration;
      setProgress(percentage);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;
      const percentage = (currentTime / duration) * 100;

      setCurrentTime(currentTime);
      setProgress(percentage);

      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${percentage}%`;
      }
      if (progressInputRef.current) {
        progressInputRef.current.value = percentage.toString();
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-lg group ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-auto"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          maxWidth: '100%',
          height: 'auto'
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Custom floating glassy controls overlay - only visible on hover */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
        <div className="bg-black/30 backdrop-blur-md rounded-full border border-white/20 shadow-lg px-4 py-2">
          <div className="flex items-center gap-3">
            {/* Play/Pause button */}
            <button
              className="flex items-center justify-center w-6 h-6 rounded-full bg-white/15 hover:bg-white/25 transition-all duration-200 backdrop-blur-sm border border-white/20"
              onClick={handlePlayPause}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>

            {/* Duration bar */}
            <div className="relative w-32">
              <div className="h-1 bg-white/25 rounded-full overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="h-full rounded-full transition-all duration-100"
                  style={{ width: '0%', backgroundColor: '#e3e3e0' }}
                ></div>
              </div>
              <input
                ref={progressInputRef}
                type="range"
                min="0"
                max="100"
                defaultValue="0"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleProgressChange}
                aria-label="Video progress"
              />
            </div>

            {/* Duration text */}
            <span className="text-xs text-white/80 font-mono whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
