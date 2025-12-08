"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Refused";

export type Order = {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: any[];
};

type OrderContextType = {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Mock initial orders for demonstration
      setOrders([
        {
          id: "ORD-001",
          date: new Date().toISOString(),
          total: 1299.00,
          status: "Delivered",
          items: [{ name: "Midnight Silk Suit", quantity: 1 }]
        },
        {
          id: "ORD-002",
          date: new Date(Date.now() - 86400000).toISOString(),
          total: 599.99,
          status: "Processing",
          items: [{ name: "Royal Chrono Watch", quantity: 1 }]
        },
        {
          id: "ORD-003",
          date: new Date(Date.now() - 172800000).toISOString(),
          total: 189.00,
          status: "Refused",
          items: [{ name: "Signature Scent No. 5", quantity: 1 }]
        }
      ]);
    }
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("orders", JSON.stringify(orders));
    }
  }, [orders]);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
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
