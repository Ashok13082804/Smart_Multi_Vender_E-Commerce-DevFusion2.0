"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star, ShoppingCart, Check, Zap } from "lucide-react";
import { formatCurrency, calculateDiscountPercentage } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviewCount: number;
    images: string; // JSON string
    isFeatured?: boolean;
    isFlashDeal?: boolean;
    seller?: { storeName: string };
    category?: { name: string };
  };
  onAddToCart?: (productId: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  let imageList: string[] = [];
  try {
    imageList = JSON.parse(product.images);
  } catch {
    imageList = ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"];
  }

  const primaryImage = imageList[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";
  const discountPct = calculateDiscountPercentage(product.originalPrice, product.price);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsWishlisted(data.isWishlisted);
        }
      });
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product.id);
    } else {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      }).then(() => {
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
      });
    }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.isFlashDeal && (
          <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white rounded-md flex items-center gap-1 shadow-sm animate-pulse">
            <Zap className="w-3 h-3 fill-current" /> Flash Deal
          </span>
        )}
        {discountPct > 0 && (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-md shadow-sm">
            {discountPct}% OFF
          </span>
        )}
      </div>

      {/* Wishlist Icon */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors shadow-sm"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
      </button>

      {/* Image Gallery Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square w-full bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Details Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Seller / Category */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
            <span>{product.category?.name || "Category"}</span>
            {product.seller && <span className="font-medium text-indigo-500">{product.seller.storeName}</span>}
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-gray-400">({product.reviewCount})</span>
          </div>

          {/* Price & Cart Action */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-base font-black text-gray-900 dark:text-white">
                {formatCurrency(product.price)}
              </div>
              {product.originalPrice > product.price && (
                <div className="text-xs text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </div>
              )}
            </div>

            <button
              onClick={handleCartClick}
              className={`p-2.5 rounded-xl text-white font-semibold shadow-md transition-all ${
                isAdded ? "bg-emerald-600 scale-95" : "gradient-bg hover:opacity-90 active:scale-95"
              }`}
            >
              {isAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
