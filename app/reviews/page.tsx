"use client";

import { useState } from "react";

type ReviewUser = { name?: string } | null;
type Review = {
  _id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: ReviewUser;
};

export default function ReviewsPage() {
  const [productId, setProductId] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const load = async () => {
    if (!productId) return setMessage("Enter a product id");
    setMessage("Loading...");
    try {
      const res = await fetch(`${apiBase}/api/reviews/product/${productId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setReviews((data.data || []) as Review[]);
      setMessage("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage(msg || "Error");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Submitting...");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBase}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setMessage("Review submitted");
      setComment("");
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage(msg || "Error");
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Product Reviews</h1>
      <div className="mb-4 flex gap-2">
        <label htmlFor="product-id" className="sr-only">
          Product ID
        </label>
        <input
          id="product-id"
          aria-label="Product ID"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          type="button"
          onClick={load}
          className="bg-primary text-white px-4 rounded"
          aria-label="Load reviews for product"
        >
          Load
        </button>
      </div>

      <form onSubmit={submit} className="space-y-3 mb-6">
        <div>
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-700"
          >
            Rating (1-5)
          </label>
          <input
            id="rating"
            aria-label="Rating"
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border p-2 rounded w-24"
          />
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Comment
          </label>
          <textarea
            id="comment"
            aria-label="Comment"
            placeholder="Write your review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded"
          aria-label="Submit review"
        >
          Submit Review
        </button>
      </form>

      {message && <p className="mb-4 text-sm">{message}</p>}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((r: Review) => (
            <div key={r._id} className="p-3 border rounded">
              <div className="flex items-center justify-between">
                <strong>{r.rating}★</strong>
                <span className="text-sm text-gray-500">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm mt-2">{r.comment}</p>
              <div className="text-xs text-gray-400 mt-2">
                By: {r.user?.name || "Anonymous"}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
