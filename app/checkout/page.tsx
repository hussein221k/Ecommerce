"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  Loader2,
  MapPin,
  Smartphone,
  Truck,
  User,
  Check, // Added Check icon import
} from "lucide-react";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/auth-context";
import { useCart } from "../context/cart-context";
import { useNotification } from "../context/NotificationContext";
import { useOrders } from "../context/order-context";
import { useProducts } from "../context/product-context";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products } = useProducts();
  const { items: cartItems, total: cartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();

  const productId = searchParams.get("id");
  const isCartCheckout = productId === "cart";

  const checkoutItems = isCartCheckout
    ? cartItems
    : products
        .filter((p) => p.id === Number(productId))
        .map((p) => ({
          ...p,
          quantity: 1,
          selectedSize: undefined as string | undefined,
        }));

  const totalAmount = isCartCheckout ? cartTotal : checkoutItems[0]?.price || 0;

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    secondaryPhone: "",
    address: "",
    city: "",
    governorate: "",
    postalCode: "",
  });

  const { showError, showWarning } = useNotification();

  // Removed Recaptcha Effect

  const handleInitiateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (
      !formData.phone ||
      formData.phone.length !== 11 ||
      !formData.phone.startsWith("01")
    ) {
      showWarning("Please enter a valid Egyptian phone number");
      return;
    }

    submitOrder();
  };

  const submitOrder = async () => {
    setIsProcessing(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        street: formData.address,
        city: formData.city,
        state: formData.governorate,
        zipCode: formData.postalCode,
        country: "Egypt",
        phone: formData.phone,
        secondaryPhone: formData.secondaryPhone,
        isVerified: true, // Assuming true since we removed step
      };

      const orderData = {
        items: checkoutItems.map((item) => ({
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
        })),
        totalAmount,
        shippingAddress: {
          ...shippingAddress,
          isVerified: true, // Phone is verified
        },
        paymentMethod,
      };

      if (user) {
        const token = localStorage.getItem("token");

        // Create order
        const orderRes = await fetch(`${apiBase}/api/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });

        if (!orderRes.ok) {
          const err = await orderRes.json();
          throw new Error(err.message || "Failed to create order");
        }

        const orderResult = await orderRes.json();
        const orderId = orderResult.data?._id || orderResult.data?.id;

        // If payment method is Vodafone Cash, process payment
        if (paymentMethod === "vodafone_cash" && orderId) {
          const paymentRes = await fetch(
            `${apiBase}/api/payments/vodafonecash`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                amount: totalAmount,
                userId: user.id,
                orderId: orderId,
                phone: formData.phone,
              }),
            }
          );

          if (!paymentRes.ok) {
            const paymentErr = await paymentRes.json();
            throw new Error(paymentErr.message || "Payment processing failed");
          }
        }
      } else {
        // Guest Fallback
        addOrder({
          ...orderData,
          id: `ORD-GUEST-${Date.now()}`,
          date: new Date().toISOString(),
          status: "Pending",
          items: checkoutItems.map((item) => ({
            productId: item.id || item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1,
            selectedSize: item.selectedSize,
          })),
        });
      }

      if (isCartCheckout) clearCart();
      setIsSuccess(true);
      setTimeout(() => router.push("/orders"), 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      showError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
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
            Thank you for your purchase. We will contact you shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-12 transition-colors duration-300">
      <Navbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            <form
              id="checkout-form"
              onSubmit={handleInitiateOrder}
              className="space-y-8"
            >
              {/* Contact */}
              <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" /> Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium mb-1"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      required
                      className="w-full p-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      required
                      className="w-full p-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Phone Number (Egypt) *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="01xxxxxxxxx"
                      maxLength={11}
                      className="w-full p-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 11),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <input
                      required
                      placeholder="Street, Apartment"
                      className="w-full p-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium mb-1"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      required
                      className="w-full p-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium mb-1"
                    >
                      Postal Code
                    </label>
                    <input
                      id="postalCode"
                      required
                      className="w-full p-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800"
                      value={formData.postalCode}
                      onChange={(e) =>
                        setFormData({ ...formData, postalCode: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${
                      paymentMethod === "cod"
                        ? "bg-blue-500/10 border-blue-500"
                        : "bg-white dark:bg-black/30 border-zinc-200 dark:border-white/10"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-xs opacity-60">Pay on receipt</div>
                    </div>
                    {paymentMethod === "cod" && (
                      <Check className="h-5 w-5 text-blue-500 ml-auto" />
                    )}
                  </div>

                  {/* Vodafone Cash */}
                  <div
                    onClick={() => setPaymentMethod("vodafone_cash")}
                    className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${
                      paymentMethod === "vodafone_cash"
                        ? "bg-red-500/10 border-red-500"
                        : "bg-white dark:bg-black/30 border-zinc-200 dark:border-white/10"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Vodafone Cash</div>
                      <div className="text-xs opacity-60">
                        Pay via mobile wallet
                      </div>
                    </div>
                    {paymentMethod === "vodafone_cash" && (
                      <Check className="h-5 w-5 text-red-500 ml-auto" />
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
                {checkoutItems.map((item, id) => (
                  <div key={id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-mono">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-200 dark:border-white/10 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Confirm Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
