"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export default function LoadingSpinner({ size = 40, color }: LoadingSpinnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const circles = circleRefs.current.filter(Boolean);
    
    // Create staggered rotation animation
    gsap.to(circles, {
      rotation: 360,
      duration: 1.5,
      ease: 'linear',
      repeat: -1,
      stagger: {
        each: 0.15,
        from: 'start',
      },
      transformOrigin: '50% 50%',
    });

    // Pulse animation for the container
    gsap.to(containerRef.current, {
      scale: 1.1,
      duration: 0.8,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });

  }, []);

  const primaryColor = color || 'currentColor';

  return (
    <div ref={containerRef} className="inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        className="loading-spinner"
      >
        {/* Outer circle */}
        <circle
          ref={(el) => { circleRefs.current[0] = el; }}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={primaryColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
          opacity="0.3"
        />
        
        {/* Middle circle */}
        <circle
          ref={(el) => { circleRefs.current[1] = el; }}
          cx="25"
          cy="25"
          r="15"
          fill="none"
          stroke={primaryColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="23.5 23.5"
          opacity="0.6"
        />
        
        {/* Inner circle */}
        <circle
          ref={(el) => { circleRefs.current[2] = el; }}
          cx="25"
          cy="25"
          r="10"
          fill="none"
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="15.7 15.7"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
