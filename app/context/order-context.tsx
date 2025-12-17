"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Refused";

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  secondaryPhone?: string;
  isVerified: boolean;
};

export type Order = {
  id: string;
  date: string;
  totalAmount: number;
  status: OrderStatus;
  items: Array<{ name: string; quantity: number; price: number }>;
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
  paymentStatus?: "pending" | "completed" | "failed";
  orderNumber?: string;
};

type OrderContextType = {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updatePaymentStatus: (
    id: string,
    status: "pending" | "completed" | "failed"
  ) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch orders on mount? Or expose refetch
  // Since this is used by Admin Dashboard, we should try to fetch if we have admin token
  const fetchOrders = useCallback(async () => {
    const adminToken = document.cookie.match(
      new RegExp("(^| )admin_token=([^;]+)")
    )?.[2];
    const userToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const token = adminToken || userToken;
    if (!token) return;

    const url = adminToken
      ? `${apiBase}/api/orders/admin/all`
      : `${apiBase}/api/orders`;

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        // If response is not ok, try to parse error or return
        if (res.status === 401 || res.status === 403) {
          return;
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      if (data.success) {
        // Transform database orders to match frontend Order type
        const transformedOrders = (data.data || []).map(
          (order: {
            _id?: string;
            id?: string;
            createdAt?: string;
            date?: string;
            totalAmount?: number;
            status?: string;
            items?: Array<{ name: string; quantity: number; price: number }>;
            shippingAddress?: ShippingAddress;
            paymentMethod?: string;
            paymentStatus?: string;
            orderNumber?: string;
          }) => ({
            id: order._id || order.id || "",
            date: order.createdAt || order.date || new Date().toISOString(),
            totalAmount: order.totalAmount || 0,
            status: order.status || "Pending",
            items: order.items || [],
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus || "pending",
            orderNumber: order.orderNumber,
          })
        );
        setOrders(transformedOrders);
      }
    } catch {
      // Set empty array on error to prevent UI issues
      setOrders([]);
    }
  }, [apiBase]);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = async (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    // Also refetch to get the latest from server
    await fetchOrders();
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );

    try {
      const adminToken = document.cookie.match(
        new RegExp("(^| )admin_token=([^;]+)")
      )?.[2];
      const userToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const token = adminToken || userToken;

      const res = await fetch(`${apiBase}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        // Refetch orders to get updated data
        await fetchOrders();
      }
    } catch {
      // Error updating status
    }
  };

  const updatePaymentStatus = async (
    id: string,
    status: "pending" | "completed" | "failed"
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, paymentStatus: status } : order
      )
    );

    try {
      const adminToken = document.cookie.match(
        new RegExp("(^| )admin_token=([^;]+)")
      )?.[2];
      const userToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const token = adminToken || userToken;

      const res = await fetch(`${apiBase}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus: status }),
      });

      if (res.ok) {
        // Refetch orders to get updated data
        await fetchOrders();
      }
    } catch {
      // Error updating payment status
    }
  };

  return (
    <OrderContext.Provider
      value={{ orders, addOrder, updateOrderStatus, updatePaymentStatus }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within a OrderProvider");
  }
  return context;
}
