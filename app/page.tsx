"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Link from "next/link";
import { useProducts } from "./context/product-context";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 3);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white transition-colors duration-300">
      <Navbar />
      <Hero />
      
      {/* Best Sellers Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">الأكثر مبيعاً</h2>
          <Link 
            href="/products" 
            className="group flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            عرض الكل <ArrowRight className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Link 
              href={`/products/${product.id}`}
              key={product.id}
              className="group block"
            >
              <div className="relative h-[400px] rounded-2xl overflow-hidden mb-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold">
                  ${product.price.toFixed(2)}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{product.category}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
