"use client";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { useOrders } from "../context/order-context";

export default function OrdersPage() {
  const { orders } = useOrders();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Refused":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "Shipped":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "Processing":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Refused":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Shipped":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Processing":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300" dir="rtl">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          طلباتي
        </h1>

        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-4">لا يوجد طلبات</h2>
              <p className="text-gray-500 dark:text-gray-400">
                لم تقم بأي طلبات بعد.
              </p>
            </div>
          ) : (
            orders.map(
              (order: {
                id?: string;
                _id?: string;
                status: string;
                date?: string;
                createdAt?: string;
                totalAmount?: number;
                total?: number;
                items: Array<{ name: string; quantity: number; price: number }>;
              }) => (
                <div
                  key={order.id || order._id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          رقم الطلب
                        </div>
                        <div className="font-bold text-lg">
                          {order.id || order._id}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          تاريخ الطلب
                        </div>
                        <div className="font-medium">
                          {new Date(
                            (order.date || order.createdAt) ?? new Date()
                          ).toLocaleDateString("ar-EG", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          الإجمالي
                        </div>
                        <div className="font-bold text-lg text-primary">
                          {((order.totalAmount ?? order.total) || 0).toFixed(2)}{" "}
                          ج.م
                        </div>
                      </div>
                      <div>
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="font-bold text-sm">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-zinc-200 dark:border-white/10 pt-6">
                      <h3 className="font-semibold mb-4">المنتجات</h3>
                      <div className="space-y-3">
                        {order.items.map(
                          (
                            item: {
                              name: string;
                              quantity: number;
                              price: number;
                            },
                            index: number
                          ) => (
                            <div
                              key={index}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-gray-600 dark:text-gray-300">
                                {item.quantity}x {item.name}
                              </span>
                              {item.price && (
                                <span>
                                  {(item.price * item.quantity).toFixed(2)} ج.م
                                </span>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {order.status === "Refused" && (
                      <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 p-4 rounded-lg flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-red-700 dark:text-red-400">
                            تم رفض الاستلام
                          </h4>
                          <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                            تم رفض استلام الطلب من قبل المستلم أو لم يكتمل التوصيل. يرجى التواصل مع الدعم للمساعدة.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            )
          )}
        </div>
      </main>
    </div>
  );
}
