import { notFound } from "next/navigation";
import Image from "next/image";
import { Store, Star, ShieldCheck, Mail, Phone } from "lucide-react";
import { db } from "@/lib/db";
import ProductCard from "@/components/product/ProductCard";

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let seller: any = null;
  try {
    seller = await db.seller.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          include: { category: true, seller: true },
        },
      },
    });
  } catch (err) {
    console.error("StoreDetailPage database fetch error:", err);
  }

  if (!seller) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Store Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-gray-100 dark:border-gray-800 shadow-xl text-white">
        {seller.banner && (
          <div className="relative h-48 w-full opacity-40">
            <Image src={seller.banner} alt="" fill className="object-cover" />
          </div>
        )}

        <div className="p-8 relative z-10 -mt-16 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 border-4 border-white dark:border-gray-900 text-white font-black text-3xl flex items-center justify-center shadow-2xl">
              {seller.storeName.substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black">{seller.storeName}</h1>
                <span className="px-2.5 py-0.5 text-[10px] bg-emerald-500 text-white font-bold rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Seller
                </span>
              </div>
              <p className="text-xs text-gray-300 max-w-xl mt-1">{seller.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-current" /> {seller.rating.toFixed(1)} Rating
            </div>
            <span>•</span>
            <span>{seller.products.length} Items</span>
          </div>
        </div>
      </div>

      {/* Store Catalog */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
          Store Products Catalog ({seller.products.length})
        </h2>

        {seller.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {seller.products.map((product: any) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            This merchant currently has no active products in catalog.
          </div>
        )}
      </div>

    </div>
  );
}
