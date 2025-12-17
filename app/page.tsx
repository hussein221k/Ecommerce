"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SplashScreen from "./components/SplashScreen";
import { useProducts } from "./context/product-context";

// Define the Product type
type Product = {
  id: number;
  _id?:string;
  name: string;
  price: number;
  category: string;
  image: string;
};

export default function Home() {
  // Fetch the products and specify types
  const { products }: { products: Product[] } = useProducts();
  const featuredProducts = products.slice(0, 3);

  // Initialize splash state from session storage
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("hasVisited");
  });

  const mainRef = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (showSplash) {
      sessionStorage.setItem("hasVisited", "true");
    }
  }, [showSplash]);

  useEffect(() => {
    if (!showSplash && mainRef.current && sectionRef.current) {
      // Animate content when splash is done
      const tl = gsap.timeline();

      tl.from(mainRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      }).from(
        sectionRef.current.children,
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.2)",
        },
        "-=0.3"
      );

      // Add continuous floating animation to product cards
      const productCards = gsap.utils.toArray(".product-card");
      productCards.forEach((card, index) => {
        gsap.to(card as HTMLElement, {
          y: -10,
          duration: 2 + index * 0.3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: index * 0.2,
        });
      });
    }
  }, [showSplash]);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      <main
        ref={mainRef}
        className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white transition-colors duration-300 relative"
      >
        {/* Permanent gradient background */}
        <div className="fixed inset-0 bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5 -z-10" />
        <div className="fixed top-20 right-20 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="fixed bottom-20 left-20 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-[120px] -z-10 animate-pulse animation-delay-2s" />

        <Navbar />
        <Hero />

        {/* Best Sellers Section */}
        <section
          ref={sectionRef}
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">الأكثر مبيعاً</h2>
            <Link
              href="/products"
              className="group flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              عرض الكل{" "}
              <ArrowRight className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="group block product-card"
              >
                <div className="relative h-[400px] rounded-2xl overflow-hidden mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {product.category}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
