import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import ProductCard from "@/components/product/ProductCard";

export default async function WishlistPage() {
  const session = await getSession();
  if (!session) return null;

  const wishlist = await db.wishlist.findUnique({
    where: { userId: session.id },
    include: {
      items: {
        include: {
          product: { include: { category: true, seller: true } },
        },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> Saved Wishlist ({wishlist?.items.length || 0})
        </h1>
        <p className="text-xs text-gray-500 mt-1">Your saved products for future purchases</p>
      </div>

      {wishlist && wishlist.items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.items.map((item) => (
            <ProductCard key={item.id} product={item.product as any} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-xs text-gray-400 space-y-3">
          <p>Your wishlist is currently empty.</p>
          <Link href="/products" className="inline-block px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">
            Explore Marketplace Catalog
          </Link>
        </div>
      )}
    </div>
  );
}
