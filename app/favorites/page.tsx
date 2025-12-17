"use client";

import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<
    Array<{ _id: string; name: string; price: number; image: string }>
  >([]);
  const [message, setMessage] = useState("");

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchFavs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please login or register first");
        return;
      }
      try {
        // Use the /me endpoint which automatically gets favorites for the authenticated user
        const res = await fetch(`${apiBase}/api/favorites/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to load favorites");
        setFavorites(data.data || []);
      } catch (err: Error | unknown) {
        setMessage(
          (err instanceof Error ? err.message : "Error loading favorites") ||
            "Error loading favorites"
        );
      }
    };
    fetchFavs();
  }, [apiBase]);

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
      {message && <p className="text-sm text-red-500 mb-4">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {favorites.length === 0 ? (
          <p className="text-gray-500">No favorites yet.</p>
        ) : (
          favorites.map(
            (f: {
              _id: string;
              name: string;
              price: number;
              image: string;
            }) => (
              <div key={f._id} className="p-4 border rounded">
                <h3 className="font-semibold">{f.name}</h3>
                <p className="text-sm text-gray-500">${f.price}</p>
              </div>
            )
          )
        )}
      </div>
    </main>
  );
}
