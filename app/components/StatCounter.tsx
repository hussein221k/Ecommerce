"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface StatCounterProps {
  endValue: string;
  label: string;
  duration?: number;
  delay?: number;
}

export default function StatCounter({
  endValue,
  label,
  duration = 2,
  delay = 0,
}: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState<string>(() => {
    const numMatch = endValue.match(/[\d,.]+/);
    return numMatch ? "0" : endValue;
  });
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Extract number from string (e.g., "10,000+" -> 10000, "4.9/5" -> 4.9)
    const numMatch = endValue.match(/[\d,.]+/);
    if (!numMatch) {
      return;
    }

    const numStr = numMatch[0].replace(/,/g, "");
    const isDecimal = numStr.includes(".");
    const targetNumber = parseFloat(numStr);
    const suffix = endValue.replace(numMatch[0], ""); // Get the suffix (e.g., "+", "/5")

    // Animate counter from 0 to target
    const counter = { value: 0 };

    gsap.to(counter, {
      value: targetNumber,
      duration,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        let formatted;
        if (isDecimal) {
          // Keep 1 decimal place for ratings
          formatted = counter.value.toFixed(1);
        } else {
          // Integers with commas
          formatted = Math.floor(counter.value).toLocaleString("en-US");
        }
        setDisplayValue(formatted + suffix);
      },
    });

    // Scale animation for the card
    if (counterRef.current) {
      gsap.from(counterRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        delay,
        ease: "back.out(1.5)",
      });
    }
  }, [endValue, duration, delay]);

  return (
    <div
      ref={counterRef}
      className="text-center p-6 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-2xl border border-indigo-200 dark:border-indigo-800 hover:scale-105 transition-transform"
    >
      <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600 mb-2">
        {displayValue}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
}
