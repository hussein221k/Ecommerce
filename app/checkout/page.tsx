"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "../context/product-context";
import { useCart } from "../context/cart-context";
import { useOrders } from "../context/order-context";
import Navbar from "../components/Navbar";
import { Check, CreditCard, Truck, Banknote, Loader2 } from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products } = useProducts();
  const { items: cartItems, total: cartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  
  const productId = searchParams.get("id");
  const isCartCheckout = productId === "cart";
  
  // Determine items to checkout
  const checkoutItems = isCartCheckout 
    ? cartItems 
    : products.filter(p => p.id === Number(productId)).map(p => ({ ...p, quantity: 1, selectedSize: undefined as string | undefined }));

  const totalAmount = isCartCheckout 
    ? cartTotal 
    : (checkoutItems[0]?.price || 0);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No items to checkout</h2>
          <button 
            onClick={() => router.push("/products")}
            className="text-primary hover:underline"
          >
            Return to shop
          </button>
        </div>
      </div>
    );
  }

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      const newOrder = {
        id: `ORD-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString(),
        total: totalAmount,
        status: "Pending" as "Pending",
        items: checkoutItems
      };

      addOrder(newOrder);
      
      if (isCartCheckout) {
        clearCart();
      }

      setIsProcessing(false);
      setIsSuccess(true);
      
      // Redirect after showing success
      setTimeout(() => {
        router.push("/orders");
      }, 2000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-zinc-100 dark:bg-zinc-900 border border-green-500/30 p-8 rounded-2xl text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <p className="text-sm text-gray-500">Redirecting to orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-12 transition-colors duration-300">
      <Navbar />
      
      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {checkoutItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`}
                      </p>
                      <p className="text-primary font-bold mt-1">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-zinc-200 dark:border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotals</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-zinc-200 dark:border-white/10 mt-2">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Payment Details</h2>
            
            <form onSubmit={handleOrder} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-300">Select Payment Method</label>
                
                <div 
                  onClick={() => setPaymentMethod("vodafone")}
                  className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    paymentMethod === "vodafone" 
                      ? "bg-red-500/10 border-red-500" 
                      : "bg-white dark:bg-black/30 border-zinc-200 dark:border-white/10 hover:border-primary/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">
                    VF
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Vodafone Cash</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Pay via mobile wallet</div>
                  </div>
                  {paymentMethod === "vodafone" && <Check className="h-5 w-5 text-red-500" />}
                </div>

                <div 
                  onClick={() => setPaymentMethod("alahly")}
                  className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    paymentMethod === "alahly" 
                      ? "bg-green-500/10 border-green-500" 
                      : "bg-white dark:bg-black/30 border-zinc-200 dark:border-white/10 hover:border-primary/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-xs">
                    NBE
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Bank Al Ahly</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Direct bank transfer</div>
                  </div>
                  {paymentMethod === "alahly" && <Check className="h-5 w-5 text-green-500" />}
                </div>

                <div 
                  onClick={() => setPaymentMethod("cod")}
                  className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    paymentMethod === "cod" 
                      ? "bg-blue-500/10 border-blue-500" 
                      : "bg-white dark:bg-black/30 border-zinc-200 dark:border-white/10 hover:border-primary/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Pay when you receive</div>
                  </div>
                  {paymentMethod === "cod" && <Check className="h-5 w-5 text-blue-500" />}
                </div>
              </div>

              {/* Additional fields based on payment method */}
              {paymentMethod === "vodafone" && (
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 text-sm text-gray-600 dark:text-gray-300">
                  Please transfer the total amount to: <span className="font-bold">010 1234 5678</span>
                </div>
              )}
              
              {paymentMethod === "alahly" && (
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 text-sm text-gray-600 dark:text-gray-300">
                  Bank Account: <span className="font-bold">1234 5678 9012 3456</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-4 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Confirm Order <Banknote className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
