"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useProducts } from "../../context/product-context";
import Navbar from "../../components/Navbar";
import { useCart } from "../../context/cart-context";
import { Star, ShoppingCart, Heart, Share2, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function ProductPage() {
  const params = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === Number(params.id));
    if (foundProduct) {
      setProduct(foundProduct);
      setReviews(foundProduct.reviews || []);
      if (foundProduct.sizes && foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0]);
      }
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, selectedSize });
      alert("تمت الإضافة إلى السلة!");
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview = {
      user: "Guest User",
      comment,
      rating: userRating
    };
    setReviews([...reviews, newReview]);
    setComment("");
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
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <button className="absolute top-4 right-4 p-3 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full hover:bg-white dark:hover:bg-black transition-colors">
              <Heart className="h-6 w-6" />
            </button>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-2 text-primary font-medium uppercase tracking-wider">
              {product.category}
            </div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="ml-1 font-bold text-foreground">{product.rating}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 dark:text-gray-400">{reviews.length} مراجعات</span>
            </div>

            <p className="text-3xl font-bold mb-8">${product.price.toFixed(2)}</p>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes && (
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

            <div className="flex gap-4 mt-auto">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                أضف إلى السلة
              </button>
              <button className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                <Share2 className="h-6 w-6" />
              </button>
            </div>
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
                  <label className="block text-sm font-medium mb-2">التقييم</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className={`transition-colors ${
                          star <= userRating ? "text-yellow-400" : "text-gray-300 dark:text-gray-700"
                        }`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">التعليق</label>
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
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  نشر المراجعة
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
                  <div key={index} className="border-b border-zinc-200 dark:border-zinc-800 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold">{review.user}</div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-gray-300 dark:text-gray-700"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
