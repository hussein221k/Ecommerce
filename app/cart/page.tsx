"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import Navbar from "../components/Navbar";
import { useCart } from "../context/cart-context";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300" dir="rtl">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary" />
          عربة التسوق
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10">
            <h2 className="text-2xl font-bold mb-4">عربة التسوق فارغة</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              يبدو أنك لم تضف أي منتجات بعد.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
            >
              ابذأ التسوق <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(
                (item: {
                  id: string | number;
                  name: string;
                  price: number;
                  image: string;
                  quantity: number;
                }) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl"
                  >
                    <div className="w-24 h-24 bg-white rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-primary font-bold">
                            {item.price.toFixed(2)} ج.م
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title={`Remove ${item.name} from cart`}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                          title={`Decrease quantity of ${item.name}`}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                          title={`Increase quantity of ${item.name}`}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">ملخص الطلب</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>المجموع الفرعي</span>
                    <span>{total.toFixed(2)} ج.م</span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>الشحن</span>
                    <span>مجاني</span>
                  </div>
                  <div className="border-t border-zinc-200 dark:border-white/10 pt-3 flex justify-between font-bold text-lg">
                    <span>الإجمالي</span>
                    <span>{total.toFixed(2)} ج.م</span>
                  </div>
                </div>

                <Link
                  href="/checkout?id=cart"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
                >
                  إتمام الطلب
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
