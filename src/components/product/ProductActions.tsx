"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Check } from "lucide-react";

interface ProductActionsProps {
  productId: string;
  stock: number;
}

export default function ProductActions({ productId, stock }: ProductActionsProps) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        router.refresh();
      } else {
        alert(data.error?.message || "Failed to add to cart");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    setBuying(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/checkout");
      } else {
        alert(data.error?.message || "Failed to initiate buy now");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
      <button
        onClick={handleAddToCart}
        disabled={stock <= 0 || adding}
        className={`py-3.5 px-6 rounded-xl font-bold text-xs text-white transition-all flex items-center justify-center gap-2 ${
          added ? "bg-emerald-600" : "gradient-bg hover:opacity-95 shadow-lg shadow-indigo-500/25"
        } disabled:opacity-50`}
      >
        {added ? (
          <><Check className="w-4 h-4" /> Added to Cart!</>
        ) : (
          <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
        )}
      </button>

      <button
        onClick={handleBuyNow}
        disabled={stock <= 0 || buying}
        className="py-3.5 px-6 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
      >
        <Zap className="w-4 h-4 fill-current" /> Buy Now Instant
      </button>
    </div>
  );
}
