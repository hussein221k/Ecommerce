'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PageAnimationProps {
  children: React.ReactNode;
  delay?: number;
}

export default function PageAnimation({ children, delay = 0 }: PageAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll('[data-animate]');
    
    // Initial fade-in animation
    gsap.from(elements, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'back.out(1.2)',
      delay,
    });

    // Continuous floating animation
    elements.forEach((element, index) => {
      gsap.to(element, {
        y: -10,
        duration: 2 + index * 0.3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: index * 0.2,
      });
    });

    // Subtle rotation animation for interactive elements
    const interactiveElements = containerRef.current.querySelectorAll('[data-rotate]');
    interactiveElements.forEach((element) => {
      gsap.to(element, {
        rotation: 5,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    // Pulse animation for attention-grabbing elements
    const pulseElements = containerRef.current.querySelectorAll('[data-pulse]');
    pulseElements.forEach((element) => {
      gsap.to(element, {
        scale: 1.05,
        duration: 1.5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

  }, [delay]);

  return <div ref={containerRef}>{children}</div>;
}
