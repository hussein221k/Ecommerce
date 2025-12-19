"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { updateAdminPassword } from "../../lib/auth";
import { useProducts, type Product } from "../../context/product-context";
import { useOrders } from "../../context/order-context";
import Image from "next/image";
import {
  LogOut,
  Save,
  Shield,
  Plus,
  Trash2,
  Edit,
  X,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  Loader2,
  Eye,
  ArrowRight,
} from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import ConfirmModal from "../../components/ConfirmModal";
import AboutPageEditor from "../../components/AboutPageEditor";

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Refused";

export default function AdminDashboard() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, updateOrderStatus, updatePaymentStatus } = useOrders();

  const [activeTab, setActiveTab] = useState("products");
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const { showSuccess, showError } = useNotification();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
    sizes: "",
  });

  useEffect(() => {
    // Simple session/token check
    const hasAdminToken =
      document.cookie.includes("admin_token=") ||
      document.cookie.includes("admin_session=true");
    if (!hasAdminToken) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    document.cookie =
      "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie =
      "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/login");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic removed or moved to backend API
    setMessage("Password update not available in this demo mode.");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_token="))
      ?.split("=")[1];

    // Fallback URL if env var not set
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const uploadData = new FormData();
    uploadData.append("image", file);
    setUploading(true);

    try {
      const res = await fetch(`${apiBase}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.url }));
        showSuccess("تم رفع الصورة بنجاح!");
      } else {
        showError("فشل رفع الصورة: " + data.message);
      }
    } catch {
      showError("حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      image:
        formData.image ||
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2075&auto=format&fit=crop",
      sizes: formData.sizes
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      rating: 0,
      reviews: [],
    };

    if (isEditing && currentProduct) {
      updateProduct(currentProduct.id, productData);
      showSuccess("تم تحديث المنتج بنجاح!");
    } else {
      addProduct(productData);
      showSuccess("تمت إضافة المنتج بنجاح!");
    }

    setShowForm(false);
    setIsEditing(false);
    setCurrentProduct(null);
    setFormData({
      name: "",
      price: "",
      category: "",
      description: "",
      image: "",
      sizes: "",
    });
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      image: product.image,
      sizes: product.sizes ? product.sizes.join(", ") : "",
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (productToDelete !== null) {
      deleteProduct(productToDelete);
      showSuccess("تم حذف المنتج بنجاح!");
      setProductToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "Refused":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "Shipped":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "Processing":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const translateStatus = (status: string) => {
      switch (status) {
        case "Delivered": return "تم التوصيل";
        case "Refused": return "مرفوض/مرتجع";
        case "Shipped": return "تم الشحن";
        case "Processing": return "جاري التجهيز";
        case "Pending": return "قيد الانتظار";
        default: return status;
      }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            لوحة تحكم المسؤول
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">إجمالي الإيرادات</span>
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold">
              {orders
                .reduce((acc, order) => acc + order.totalAmount, 0)
                .toFixed(2)}{" "}
              ج.م
            </div>
            <div className="text-sm text-green-500 mt-2">بيانات لحظية</div>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">إجمالي الطلبات</span>
              <Package className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold">{orders.length}</div>
            <div className="text-sm text-blue-500 mt-2">منذ البداية</div>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">عدد المنتجات</span>
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold">{products.length}</div>
            <div className="text-sm text-purple-500 mt-2">
              حالة المخزون: جيد
            </div>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">طلبات معلقة</span>
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold">
              {orders.filter((o) => o.status === "Pending").length}
            </div>
            <div className="text-sm text-yellow-500 mt-2">تحتاج متابعة</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-1">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === "products"
                ? "text-primary"
                : "text-gray-400 hover:text-white"
            }`}
          >
            المنتجات
            {activeTab === "products" && (
              <div className="absolute bottom-[-5px] right-0 w-full h-1 bg-primary rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === "orders"
                ? "text-primary"
                : "text-gray-400 hover:text-white"
            }`}
          >
            الطلبات
            {activeTab === "orders" && (
              <div className="absolute bottom-[-5px] right-0 w-full h-1 bg-primary rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === "about"
                ? "text-primary"
                : "text-gray-400 hover:text-white"
            }`}
          >
            صفحة من نحن
            {activeTab === "about" && (
              <div className="absolute bottom-[-5px] right-0 w-full h-1 bg-primary rounded-t-full" />
            )}
          </button>
          {/* Settings Tab Removed temporarily */}
        </div>

        <div className="grid gap-8">
          {/* Product Management */}
          {activeTab === "products" && (
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">إدارة المنتجات</h2>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: "",
                      price: "",
                      category: "",
                      description: "",
                      image: "",
                      sizes: "",
                    });
                    setShowForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary/90 transition-colors text-sm font-bold"
                >
                  <Plus className="h-4 w-4" />
                  إضافة منتج
                </button>
              </div>

              {showForm && (
                <div className="mb-8 bg-black/50 p-6 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">
                      {isEditing ? "تعديل منتج" : "منتج جديد"}
                    </h3>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-gray-400 hover:text-white"
                      title="إغلاق النموذج"
                      aria-label="إغلاق النموذج"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <form
                    onSubmit={handleSubmitProduct}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="md:col-span-2">
                      <label
                        htmlFor="product-name"
                        className="block text-sm text-gray-400 mb-1"
                      >
                        اسم المنتج
                      </label>
                      <input
                        id="product-name"
                        required
                        className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="product-price"
                        className="block text-sm text-gray-400 mb-1"
                      >
                        السعر
                      </label>
                      <input
                        id="product-price"
                        required
                        type="number"
                        step="0.01"
                        className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="product-category"
                        className="block text-sm text-gray-400 mb-1"
                      >
                        القسم
                      </label>
                      <input
                        id="product-category"
                        required
                        className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="product-description"
                        className="block text-sm text-gray-400 mb-1"
                      >
                        الوصف
                      </label>
                      <textarea
                        id="product-description"
                        required
                        rows={3}
                        className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="product-image"
                        className="block text-sm text-gray-400 mb-1"
                      >
                        رابط الصورة أو رفع ملف
                      </label>
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <input
                            id="product-image"
                            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formData.image}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                image: e.target.value,
                              })
                            }
                            placeholder="https://..."
                          />
                        </div>
                        <div className="relative">
                          <input
                            type="file"
                            id="upload-btn"
                            className="hidden"
                            onChange={handleImageUpload}
                            accept="image/*"
                          />
                          <label
                            htmlFor="upload-btn"
                            className="flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-lg p-2 cursor-pointer transition-colors"
                          >
                            {uploading ? (
                              <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            ) : (
                              <Image
                                src="/file-upload-svgrepo-com.svg"
                                alt="Upload"
                                width={24}
                                height={24}
                              />
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="product-sizes"
                        className="block text-sm text-gray-400 mb-1"
                      >
                        المقاسات (مفصولة بفاصلة)
                      </label>
                      <input
                        id="product-sizes"
                        className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.sizes}
                        onChange={(e) =>
                          setFormData({ ...formData, sizes: e.target.value })
                        }
                        placeholder="S, M, L, XL"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary rounded-lg hover:bg-primary/90 transition-colors font-bold"
                      >
                        {isEditing ? "تحديث المنتج" : "إنشاء المنتج"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                      <th className="py-3 px-2">الصورة</th>
                      <th className="py-3 px-2">الاسم</th>
                      <th className="py-3 px-2">القسم</th>
                      <th className="py-3 px-2">السعر</th>
                      <th className="py-3 px-2 text-left">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-2">
                          <div className="w-10 h-10 rounded-lg overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-2 font-medium">
                          {product.name}
                        </td>
                        <td className="py-3 px-2 text-gray-400 text-sm">
                          {product.category}
                        </td>
                        <td className="py-3 px-2">
                          {product.price.toFixed(2)} ج.م
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(product)}
                              className="p-2 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30 transition-colors"
                              title={`Edit ${product.name}`}
                              aria-label={`Edit ${product.name}`}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(product.id)}
                              className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                              title={`Delete ${product.name}`}
                              aria-label={`Delete ${product.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Order Management */}
          {activeTab === "orders" && (
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6">إدارة الطلبات</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                      <th className="py-3 px-2 text-right">رقم الطلب</th>
                      <th className="py-3 px-2 text-right">التاريخ</th>
                      <th className="py-3 px-2 text-right">العميل</th>
                      <th className="py-3 px-2 text-right">العناصر</th>
                      <th className="py-3 px-2 text-right">الإجمالي</th>
                      <th className="py-3 px-2 text-right">الحالة</th>
                      <th className="py-3 px-2 text-right">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-2 font-mono text-sm">
                          {order.orderNumber ||
                            order.id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-400">
                          {new Date(order.date).toLocaleDateString("ar-EG")}
                        </td>
                        <td className="py-3 px-2 text-sm">
                          {order.items.length} عنصر
                        </td>
                        <td className="py-3 px-2 font-bold">
                          {order.totalAmount.toFixed(2)} ج.م
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              order.paymentStatus === "completed"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-yellow-500/20 text-yellow-500"
                            }`}
                          >
                            {order.paymentStatus === "completed" ? "مدفوع" : "معلق"}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {translateStatus(order.status)}
                          </span>
                        </td>
                         <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* View Button */}
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderModal(true);
                              }}
                              className="p-2 bg-indigo-500/20 text-indigo-500 rounded-lg hover:bg-indigo-500/30 transition-colors"
                              title="عرض التفاصيل"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* Payment Toggle */}
                            <button
                              onClick={() =>
                                updatePaymentStatus(
                                  order.id,
                                  order.paymentStatus === "completed"
                                    ? "pending"
                                    : "completed"
                                )
                              }
                              className={`p-2 rounded-lg transition-colors ${
                                order.paymentStatus === "completed"
                                  ? "bg-green-500 text-white"
                                  : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                              }`}
                              title={
                                order.paymentStatus === "completed"
                                  ? "Mark as Unpaid"
                                  : "Mark as Paid"
                              }
                            >
                              <DollarSign className="h-4 w-4" />
                            </button>

                            <select
                              aria-label="Update order status"
                              title="Update order status"
                              className="bg-zinc-800 border border-white/10 rounded-lg text-xs p-1 focus:outline-none focus:ring-1 focus:ring-primary"
                              value={order.status}
                              onChange={(e) =>
                                updateOrderStatus(
                                  order.id,
                                  e.target.value as OrderStatus
                                )
                              }
                            >
                              <option value="Pending">قيد الانتظار</option>
                              <option value="Processing">جاري التجهيز</option>
                              <option value="Shipped">تم الشحن</option>
                              <option value="Delivered">تم التوصيل</option>
                              <option value="Refused">مرفوض/مرتجع</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* About Page Editor */}
          {activeTab === "about" && (
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6">
                تعديل محتوى صفحة من نحن
              </h2>

              <AboutPageEditor
                showSuccess={showSuccess}
                showError={showError}
              />
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-xl">
              <h2 className="text-xl font-semibold mb-6">Security Settings</h2>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {message && (
                  <div
                    className={`text-sm ${
                      message.includes("success")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
                >
                  <Save className="h-4 w-4" />
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="حذف المنتج"
        message="هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="نعم، احذف"
        cancelText="إلغاء"
        type="danger"
      />

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir="rtl">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md sticky top-0">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Package className="h-6 w-6 text-primary" />
                  تفاصيل الطلب: #{selectedOrder.orderNumber || selectedOrder.id.slice(-6).toUpperCase()}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  تاريخ الطلب: {new Date(selectedOrder.date).toLocaleString('ar-EG')}
                </p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-8">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">معلومات العميل</h3>
                  <div className="bg-white/5 rounded-2xl p-4 space-y-2 border border-white/5">
                    <p className="font-bold text-lg">
                      {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}
                    </p>
                    <p className="text-gray-300 flex items-center gap-2">
                      <span className="text-primary italic">رقم الهاتف:</span>
                      {selectedOrder.shippingAddress?.phone}
                    </p>
                    {selectedOrder.shippingAddress?.secondaryPhone && (
                      <p className="text-gray-300 flex items-center gap-2 text-sm">
                        <span className="text-zinc-500">هاتف آخر:</span>
                        {selectedOrder.shippingAddress?.secondaryPhone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">عنوان الشحن</h3>
                  <div className="bg-white/5 rounded-2xl p-4 space-y-1 border border-white/5">
                    <p className="text-gray-200">{selectedOrder.shippingAddress?.street}</p>
                    <p className="text-gray-200">{selectedOrder.shippingAddress?.city}</p>
                    <p className="text-gray-400 text-sm">{selectedOrder.shippingAddress?.country}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">المنتجات</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={item._id || idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-zinc-800 rounded-lg flex items-center justify-center font-bold text-primary">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-mono text-primary font-bold">{item.price.toFixed(2)} ج.م</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="bg-zinc-800/50 p-4 rounded-2xl border border-white/5">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">طريقة الدفع</h3>
                  <p className="font-bold flex items-center gap-2">
                    {selectedOrder.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : 
                     selectedOrder.paymentMethod === 'bank_ahly' ? 'البنك الأهلي' : 
                     selectedOrder.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة بنكية'}
                  </p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-2xl border border-white/5">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">إجمالي الطلب</h3>
                  <p className="text-2xl font-bold text-accent">{selectedOrder.totalAmount.toFixed(2)} ج.م</p>
                </div>
              </div>

              {/* Manual Payment Details */}
              {selectedOrder.vodafoneNumber && (
                 <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                    <h3 className="text-sm font-semibold text-red-400 mb-2">تفاصيل تحويل فودافون كاش</h3>
                    <p className="text-gray-200">الرقم المحول منه: <span className="font-bold">{selectedOrder.vodafoneNumber}</span></p>
                    {selectedOrder.paymentReceipt && (
                        <a href={selectedOrder.paymentReceipt} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm block mt-2">
                          عرض صورة التحويل (المخالصة)
                        </a>
                    )}
                 </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 bg-zinc-900 flex justify-between gap-4">
              <div className="flex gap-2">
                 <button 
                  onClick={() => setShowOrderModal(false)}
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold transition-all"
                 >
                   إغلاق
                 </button>
              </div>
              <div className="flex gap-2">
                 <span className={`px-4 py-2 rounded-xl flex items-center font-bold text-sm ${getStatusColor(selectedOrder.status)}`}>
                   {translateStatus(selectedOrder.status)}
                 </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
