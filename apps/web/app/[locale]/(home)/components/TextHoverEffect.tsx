'use client';

import React, { useRef, useState, useCallback, useMemo } from 'react';

interface TextHoverEffectProps {
  strokeWidth?: number;
  text: string;
  duration?: number;
  opacity?: number;
  className?: string;
}

export const TextHoverEffect: React.FC<TextHoverEffectProps> = ({
  strokeWidth = 0.75,
  text,
  duration = 200,
  opacity = 0.75,
  className = '',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const transitionDuration = duration * 1000;

  const maskPosition = useMemo(() => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      return { cx: `${cxPercentage}%`, cy: `${cyPercentage}%` };
    }
    return { cx: '50%', cy: '50%' };
  }, [cursor]);

  const strokeStyle = useMemo(() => ({
    strokeDashoffset: hovered ? '0' : '1000',
    strokeDasharray: '1000',
    transition: 'stroke-dashoffset 4s ease-in-out, stroke-dasharray 4s ease-in-out',
  }), [hovered]);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursor({ x: e.clientX, y: e.clientY });
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setHovered(true);
    const touch = e.touches[0];
    setCursor({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setCursor({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchEnd = useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ userSelect: 'none' }}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#e3e3e0" />
              <stop offset="25%" stopColor="#e3e3e0" />
              <stop offset="50%" stopColor="#e3e3e0" />
              <stop offset="75%" stopColor="#e3e3e0" />
              <stop offset="100%" stopColor="#e3e3e0" />
            </>
          )}
        </linearGradient>

        <radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          cx={maskPosition.cx}
          cy={maskPosition.cy}
          style={{
            transition: `cx ${transitionDuration}ms ease-out, cy ${transitionDuration}ms ease-out`,
          }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>

        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth={strokeWidth}
        style={{ opacity: hovered ? opacity : 0.3 }}
        className="fill-transparent stroke-neutral-200 dark:stroke-neutral-800 font-normal text-9xl"
        fontFamily="helvetica"
      >
        {text}
      </text>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth={strokeWidth}
        style={strokeStyle}
        className="fill-transparent stroke-neutral-200 dark:stroke-neutral-800 font-normal text-9xl"
        fontFamily="helvetica"
      >
        {text}
      </text>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth={strokeWidth}
        mask="url(#textMask)"
        className="fill-transparent font-normal text-9xl"
        fontFamily="helvetica"
      >
        {text}
      </text>
    </svg>
  );
};
