"use client";

import React, { createContext, useContext, useState } from "react";

export type Product = {
  id: number;
  _id?: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  sizes?: string[];
  rating?: number;
  reviews?: { user: string; comment: string; rating: number }[];
};

type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch products on mount
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiBase}/api/products`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch {
        // Failed to fetch products
      }
    };
    fetchProducts();
  }, [apiBase]);

  const getAdminToken = () => {
    // Try to get token from cookie or localStorage
    // Admin dashboard sets 'admin_token' cookie
    const match = document.cookie.match(new RegExp("(^| )admin_token=([^;]+)"));
    if (match) return match[2];
    return localStorage.getItem("token"); // Fallback to user token if admin permissions match
  };

  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const token = getAdminToken();
      const res = await fetch(`${apiBase}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => [...prev, data.data]);
      }
    } catch {
      // Failed to add product
    }
  };

  const updateProduct = async (
    id: number,
    updatedProduct: Partial<Product>
  ) => {
    // API uses _id usually, but context uses 'id' (number) for frontend?
    // We need to match. If we fetched from DB, we have _id.
    // The id (number) might be legacy. We should use _id if available.
    // However, the function signature takes 'id: number'.
    // I'll try to find the product to get its _id.
    const productToUpdate = products.find((p) => p.id === id);
    const dbId = productToUpdate?._id || id;

    try {
      const token = getAdminToken();
      const res = await fetch(`${apiBase}/api/products/${dbId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...data.data } : p))
        );
      }
    } catch {
      // Failed to update product
    }
  };

  const deleteProduct = async (id: number) => {
    const productToDelete = products.find((p) => p.id === id);
    const dbId = productToDelete?._id || id;

    try {
      const token = getAdminToken();
      await fetch(`${apiBase}/api/products/${dbId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      // Optimistic or confirmed delete
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // Failed to delete product
    }
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
