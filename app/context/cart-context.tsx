"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-context";
import { useNotification } from "./NotificationContext";

type CartItem = {
  id: number | string; // Support both numeric (frontend) and string (backend _id) IDs
  _id?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  productId?: string; // For backend reference
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: {
    id: string | number;
    name: string;
    price: number;
    image: string;
    selectedSize?: string;
  }) => Promise<void>;
  removeFromCart: (id: number | string) => Promise<void>;
  updateQuantity: (id: number | string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  loading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showWarning } = useNotification();

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // load cart from backend if user is logged in, or localStorage if guest
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${apiBase}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success && data.data) {
          // Map backend items to frontend format
          const mappedItems = data.data.items.map(
            (item: {
              productId: {
                _id: string;
                name: string;
                price: number;
                images?: string[];
              };
              quantity: number;
              selectedSize?: string;
            }) => ({
              id: item.productId._id, // Use Product ID as unique identifier
              _id: item.productId._id,
              productId: item.productId._id,
              name: item.productId.name,
              price: item.productId.price,
              image: item.productId.images?.[0] || "",
              quantity: item.quantity,
              selectedSize: item.selectedSize,
            })
          );
          setItems(mappedItems);
        }
      } catch {
        // Failed to fetch cart
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCart();
    } else {
      const savedCart = localStorage.getItem("guest_cart");
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch {
          // Failed to parse guest cart
        }
      }
    }
  }, [user, apiBase]);

  const addToCart = async (product: {
    id: string | number;
    name: string;
    price: number;
    image: string;
    selectedSize?: string;
  }) => {
    // If not logged in, prevent add and show warning toast
    if (!user) {
      showWarning("You must be logged in to add items to cart.");
      return;
    }

    // Optimistic update
    setItems((prev: CartItem[]) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        { ...product, quantity: 1, productId: String(product.id) },
      ];
    });

    if (user) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${apiBase}/api/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: String(product.id),
            quantity: 1,
            selectedSize: product.selectedSize,
          }),
        });
        // Optionally refetch to ensure sync, but optimistic looks faster
      } catch {
        // Failed to add to cart DB
      }
    }
  };

  const removeFromCart = async (id: number | string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));

    if (user) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${apiBase}/api/cart/remove`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: id }),
        });
      } catch {
        // Failed to remove from cart DB
      }
    }
  };

  const updateQuantity = async (id: number | string, quantity: number) => {
    if (quantity < 1) return;

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

    if (user) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${apiBase}/api/cart/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: id, quantity }),
        });
      } catch {
        // Failed to update cart DB
      }
    }
  };

  const clearCart = async () => {
    setItems([]);
    if (!user) localStorage.removeItem("guest_cart");

    if (user) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${apiBase}/api/cart/clear`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Failed to clear cart DB
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
