"use client";

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import LoadingSpinner from "./LoadingSpinner";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export default function SplashScreen({ onComplete, duration = 2500 }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const logo = logoRef.current;
    const text = textRef.current;

    if (!container || !logo || !text) return;

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out splash screen
        gsap.to(container, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => {
            setIsVisible(false);
            onComplete();
          },
        });
      },
    });

    // Initial state
    gsap.set([logo, text], { opacity: 0, scale: 0.5 });

    // Animate in
    tl.to(logo, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'back.out(1.7)',
    })
      .to(
        text,
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
        },
        '-=0.3'
      )
      .to({}, { duration: duration / 1000 - 1.1 }); // Wait

    return () => {
      tl.kill();
    };
  }, [onComplete, duration]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900"
    >
      {/* Logo/Brand */}
      <div ref={logoRef} className="mb-8">
        <div className="text-8xl font-bold text-white drop-shadow-2xl">
          نوفا
        </div>
      </div>

      {/* Tagline */}
      <div ref={textRef} className="mb-12">
        <p className="text-2xl text-white font-light tracking-wide">
          تسوق بذكاء
        </p>
      </div>

      {/* Loading Spinner */}
      <LoadingSpinner size={60} color="white" />
    </div>
  );
}
