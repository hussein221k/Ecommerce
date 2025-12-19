/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useProducts } from "../../context/product-context";
import { useAuth } from "../../context/auth-context";
import Navbar from "../../components/Navbar";
import { useCart } from "../../context/cart-context";
import { Star, ShoppingCart, Heart, Share2, Loader2 } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { LoginRedirectModal } from "../../components/ConfirmModal";

export default function ProductPage() {
  const params = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<{
    id: number;
    _id?: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category?: string;
    sizes?: string[];
    rating?: number;
  } | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [reviews, setReviews] = useState<
    Array<{
      id?: string;
      rating: number;
      comment: string;
      author?: string;
      user?: { name: string };
    }>
  >([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalMessage, setLoginModalMessage] = useState("");
  const { showSuccess, showError, showInfo } = useNotification();

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === Number(params.id));
    if (foundProduct) {
      setProduct(foundProduct);
      if (foundProduct.sizes && foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0]);
      }
      // Fetch reviews & status - convert to string for API
      const pId = String(foundProduct._id || foundProduct.id);
      fetchReviews(pId);
      checkFavoriteStatus(pId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, products, user]); // Added user dependency to re-check on login

  const checkFavoriteStatus = async (productId: string) => {
    if (!user) return;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Use the check endpoint for better performance
      const res = await fetch(`${apiBase}/api/favorites/check/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setIsFavorite(data.isFavorite || false);
      }
    } catch {
      // Failed to check favorite status
    }
  };

  const fetchReviews = async (productId: string) => {
    try {
      // If the product ID is just a number (from frontend mock), we might valid check
      // But here we try to call the backend.
      // Note: If productId is a number, the backend Mongoose ObjectId check might fail.
      // This depends on whether products are synced with Backend DB.
      // For this specific task, we assume backend integration is the goal.
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // If ID is number, the backend might return 400 cast error if it expects ObjectId.
      // But let's attempt to fetch by the frontend ID if we migrated logic,
      // or we must assume the products context now has real API data.
      // For now, let's just try to hit the endpoint.
      const res = await fetch(`${apiBase}/api/reviews/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.data || []);
      }
    } catch {
      // Failed to load reviews
    }
  };

  const handleAddToCart = () => {
    if (product) {
      const cartItem = {
        ...product,
        selectedSize: selectedSize || undefined,
      };
      addToCart(cartItem);
      showSuccess("تمت الإضافة إلى السلة!");
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      setLoginModalMessage("يرجى تسجيل الدخول لإضافة المنتجات إلى المفضلة");
      setShowLoginModal(true);
      return;
    }
    if (!product) return;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const token = localStorage.getItem("token");
    const productId = String(product._id || product.id);

    try {
      if (isFavorite) {
        const res = await fetch(`${apiBase}/api/favorites/remove`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });

        if (res.ok) {
          setIsFavorite(false);
          showInfo("تمت الإزالة من المفضلة");
        } else {
          const data = await res.json();
          showError(data.message || "فشل إزالة من المفضلة");
        }
      } else {
        const res = await fetch(`${apiBase}/api/favorites/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });

        if (res.ok) {
          setIsFavorite(true);
          showSuccess("تمت الإضافة إلى المفضلة!");
        } else {
          const data = await res.json();
          showError(data.message || "فشل الإضافة إلى المفضلة");
        }
      }
    } catch {
      showError("حدث خطأ أثناء تحديث المفضلة");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setLoginModalMessage("يرجى تسجيل الدخول لكتابة مراجعة");
      setShowLoginModal(true);
      return;
    }
    if (!product) return;
    setSubmitting(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const res = await fetch(`${apiBase}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}` // If backend requires auth header
        },
        body: JSON.stringify({
          productId: String(product._id || product.id),
          userId: user.id, // Some backends read body, some read middleware req.user
          rating: userRating,
          comment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const newReview = {
          user: { name: user.name }, // Optimistic update structure
          comment,
          rating: userRating,
        };
        setReviews([...reviews, newReview]);
        setComment("");
        showSuccess("تم نشر المراجعة بنجاح!");
      } else {
        showError(data.message || "فشل نشر المراجعة");
      }
    } catch {
      showError("حدث خطأ أثناء نشر المراجعة");
    } finally {
      setSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl">جارِ التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
            {product ? (
              <>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleToggleFavorite}
                  className={`absolute top-4 right-4 p-3 backdrop-blur-md rounded-full transition-colors ${
                    isFavorite
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black"
                  }`}
                  title="أضف إلى المفضلة"
                >
                  <Heart
                    className={`h-6 w-6 ${isFavorite ? "fill-current" : ""}`}
                  />
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                Loading...
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            {product && (
              <>
                <div className="mb-2 text-primary font-medium uppercase tracking-wider">
                  {product.category || "Product"}
                </div>
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center text-yellow-400">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="ml-1 font-bold text-foreground">
                      {product.rating || 0}
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {reviews.length} مراجعات
                  </span>
                </div>

                <p className="text-3xl font-bold mb-8">
                  {product.price.toFixed(2)} ج.م
                </p>

                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-semibold mb-3">اختر المقاس</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            selectedSize === size
                              ? "border-primary bg-primary/10 text-primary font-bold"
                              : "border-zinc-200 dark:border-zinc-800 hover:border-primary/50"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-4 mt-auto">
                   <div className="flex gap-4">
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-foreground py-4 rounded-xl font-bold text-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        أضف إلى السلة
                      </button>
                      <button
                        onClick={async () => {
                          if (product) {
                            await addToCart({ ...product, selectedSize });
                            window.location.href = "/checkout?id=cart";
                          }
                        }}
                        className="flex-1 bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-accent hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                      >
                        اشتري دلوقتي
                      </button>
                      <button
                        title="View more options"
                        className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                      >
                        <Share2 className="h-6 w-6" />
                      </button>
                   </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-12">
          <h2 className="text-2xl font-bold mb-8">مراجعات العملاء</h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Review Form */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl h-fit">
              <h3 className="text-lg font-semibold mb-4">اكتب مراجعة</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    التقييم
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        title="Share product"
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className={`transition-colors ${
                          star <= userRating
                            ? "text-yellow-400"
                            : "text-gray-300 dark:text-gray-700"
                        }`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    التعليق
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="شارك أفكارك..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex justify-center"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "نشر المراجعة"
                  )}
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  لا توجد مراجعات بعد. كن أول من يراجع هذا المنتج!
                </div>
              ) : (
                reviews.map((review, index) => (
                  <div
                    key={index}
                    className="border-b border-zinc-200 dark:border-zinc-800 pb-6 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold">
                        {review.user?.name || review.author || "Anonymous"}
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-current"
                                : "text-gray-300 dark:text-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      <LoginRedirectModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message={loginModalMessage}
      />
    </div>
  );
}
