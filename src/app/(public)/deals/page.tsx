import Link from "next/link";
import { Zap, Clock, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import ProductCard from "@/components/product/ProductCard";

export default async function DealsPage() {
  let deals: any[] = [];
  try {
    deals = await db.product.findMany({
      where: { isFlashDeal: true, isActive: true },
      include: { category: true, seller: true },
    });
  } catch (err) {
    console.error("DealsPage database fetch error:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-indigo-950 p-8 rounded-3xl text-white space-y-4 shadow-xl border border-rose-500/30">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500 rounded-2xl text-white shadow-lg animate-pulse">
            <Zap className="w-8 h-8 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">NEXORA Flash Deals & Offers</h1>
            <p className="text-xs text-rose-300">Limited-time price drops from top verified sellers</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {deals.map((product) => (
          <ProductCard key={product.id} product={product as any} />
        ))}
      </div>

    </div>
  );
}
