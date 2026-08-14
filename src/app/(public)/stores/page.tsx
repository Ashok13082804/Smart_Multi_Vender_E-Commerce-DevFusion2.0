import Link from "next/link";
import Image from "next/image";
import { Store, Star, ArrowRight, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";

export default async function StoresPage() {
  let sellers: any[] = [];
  try {
    sellers = await db.seller.findMany({
      include: { _count: { select: { products: true } } },
    });
  } catch (err) {
    console.error("StoresPage database fetch error:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <Store className="w-8 h-8 text-indigo-600" /> Verified Merchant Storefronts
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Explore storefronts of independent sellers on NEXORA marketplace
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
          >
            {seller.banner && (
              <div className="relative h-28 w-full bg-gray-100 dark:bg-gray-800">
                <Image src={seller.banner} alt="" fill className="object-cover" />
              </div>
            )}

            <div className="p-6 space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md shrink-0">
                  {seller.storeName.substring(0, 2)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{seller.storeName}</h3>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" /> {seller.rating.toFixed(1)} Merchant Rating
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{seller.description}</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">{seller._count.products} Products</span>
              <Link
                href={`/stores/${seller.slug}`}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1"
              >
                Visit Store <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
