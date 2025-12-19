"use client";

import {  useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const blobRef = useRef(null);

  useLayoutEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial entrance animations
    tl.fromTo(
      titleRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.2 }
    )
      .fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.6"
      )
      .fromTo(
        buttonRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5 },
        "-=0.4"
      );

    // Continuous looping animations (only for button and blob)
    // Button pulse animation
    gsap.to(buttonRef.current, {
      scale: 1.02,
      duration: 2.5,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Blob rotation and scale
    gsap.to(blobRef.current, {
      rotation: 360,
      scale: 1.2,
      duration: 20,
      ease: "none",
      repeat: -1,
    });
  }, []);

  return (
    <div
      className="relative h-screen flex items-center justify-center overflow-hidden border-b-black"
    >
      {/* Background Gradient Blob */}
      <div
        ref={blobRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[500px] lg:h-[600px] bg-gradient-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 rounded-full blur-[120px] -z-10"
      />

      <div className="text-center px-4 max-w-5xl mx-auto z-10">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-foreground bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400"
        >
          نوفا… <br /> الحاجة الحلوة بسعر معقول
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          أشيك المنتجات بأحسن الأسعار، عشانك وعشان بيتك
        </p>

        <div ref={buttonRef}>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 bg-gradient-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition-all transform hover:scale-105"
          >
            تسوق دلوقتي
            <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-t from-background to-transparent" />
    </div>
  );
}
