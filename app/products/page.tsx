"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ShoppingCart } from "lucide-react";

import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useProducts } from "../context/product-context";
import { useCart } from "../context/cart-context";

export default function ProductsPage() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const router = useRouter();
  const containerRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".product-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main
        className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        ref={containerRef}
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
            تشكيلة حصرية
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            استكشف مجموعتنا المختارة بعناية من المنتجات المتميزة، والمصممة
            خصيصاً لأصحاب الذوق الرفيع.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400 mb-4">لا توجد منتجات حالياً</p>
            <p className="text-gray-500">يرجى الرجوع لاحقاً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="product-card group bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 block"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    priority={product.id < 3}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </div>

                <div className="p-6">
                  <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">
                    {product.category}
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold">
                      {product.price.toFixed(2)} ج.م
                    </span>

                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        await addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image
                        });
                        router.push("/checkout?id=cart");
                      }}
                      className="flex items-center gap-2 bg-primary text-white hover:bg-accent hover:text-black px-4 py-2 rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      اشتري دلوقتي
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
