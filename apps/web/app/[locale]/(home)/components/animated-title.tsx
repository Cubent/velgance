'use client';

import { useState, useEffect } from 'react';

export const AnimatedTitle = () => {
  const words = ['ship.', 'scale.', 'learn.', 'debug.'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    const typingSpeed = isDeleting ? 100 : 150;
    const pauseTime = isDeleting ? 500 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else {
          // Finished typing, start deleting after pause
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <h1 className="w-full text-center font-regular text-[46px] tracking-tighter md:text-8xl relative z-10 leading-tight">
      <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
        Built to optimize.<br />
        Trained to{' '}
      </span>
      <span className="inline-block min-w-[120px] text-left">
        <span className="bg-gradient-to-r from-blue-600 via-orange-500 to-blue-400 bg-clip-text text-transparent">
          {currentText}
        </span>
        <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 bg-gradient-to-r from-blue-600 via-orange-500 to-blue-400 bg-clip-text text-transparent`}>|</span>
      </span>
    </h1>
  );
};
