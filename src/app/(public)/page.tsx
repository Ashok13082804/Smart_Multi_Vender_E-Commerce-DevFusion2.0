import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Zap,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Award,
  ChevronRight,
  Mic,
  Brain,
  Store,
  MessageSquare,
} from "lucide-react";
import { db } from "@/lib/db";
import ProductCard from "@/components/product/ProductCard";

export default async function HomePage() {
  let featuredProducts: any[] = [];
  let flashDeals: any[] = [];
  let categories: any[] = [];
  let sellers: any[] = [];

  try {
    const res = await Promise.all([
      db.product.findMany({
        where: { isFeatured: true, isActive: true },
        take: 8,
        include: { category: true, seller: true },
      }),
      db.product.findMany({
        where: { isFlashDeal: true, isActive: true },
        take: 4,
        include: { category: true, seller: true },
      }),
      db.category.findMany({ take: 8 }),
      db.seller.findMany({ take: 4 }),
    ]);
    featuredProducts = res[0];
    flashDeals = res[1];
    categories = res[2];
    sellers = res[3];
  } catch (err) {
    console.error("HomePage database fetch error:", err);
  }

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white pt-16 pb-24 border-b border-indigo-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-indigo-400" /> NEXORA AI Commerce & Vendor Intelligence
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Commerce that <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  understands what you need.
                </span>
              </h1>

              <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Discover authentic independent sellers with natural voice search, intelligent recommendations, and real-time inventory fulfillment.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                <Link
                  href="/products"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-white gradient-bg hover:opacity-95 shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all"
                >
                  Explore Marketplace <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/register/seller"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-gray-200 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all"
                >
                  <Store className="w-4 h-4 text-indigo-400" /> Become a Seller
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-black text-white">40+</div>
                  <div className="text-xs text-gray-400">Curated Products</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">5+</div>
                  <div className="text-xs text-gray-400">Independent Stores</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">99.8%</div>
                  <div className="text-xs text-gray-400">Fulfillment Rate</div>
                </div>
              </div>
            </div>

            {/* Visual Banner Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-indigo-400" />
                    <span className="text-sm font-bold text-white">AI Natural Discovery</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                    Live Engine
                  </span>
                </div>

                <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-indigo-300">
                    <Mic className="w-4 h-4 animate-pulse text-indigo-400" />
                    <span>Voice Query Processing...</span>
                  </div>
                  <div className="text-sm font-medium text-white italic">
                    "Show me black running shoes under 2,500 rupees"
                  </div>
                  <div className="text-[11px] text-gray-400 flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded-md">Category: Footwear</span>
                    <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded-md">MaxPrice: ₹2,500</span>
                    <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded-md">Color: Black</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-gray-300 font-semibold flex items-center justify-between">
                    <span>Predicted Demand Match</span>
                    <span className="text-emerald-400 font-bold">96.4% Score</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[96%]" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Explore Popular Categories
            </h2>
            <p className="text-xs text-gray-500">Curated products across top marketplace verticals</p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-center hover:border-indigo-500/50 hover:shadow-md transition-all flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg mb-2 group-hover:scale-110 transition-transform">
                {cat.name.substring(0, 1)}
              </div>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate w-full">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Deals Section */}
      {flashDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-rose-900/20 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl border border-rose-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/30 animate-pulse">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Flash Deals of the Day</h2>
                  <p className="text-xs text-rose-300">Limited stock deals at heavily discounted prices</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-white bg-rose-950/80 border border-rose-500/40 px-4 py-2 rounded-xl">
                <span>Offer ends in:</span>
                <span className="text-amber-400 font-mono text-sm">08h : 24m : 15s</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {flashDeals.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Featured Marketplace Selection
            </h2>
            <p className="text-xs text-gray-500">Handpicked top-rated products from verified sellers</p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            Explore All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </section>

      {/* Popular Sellers Store Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Top Independent Sellers & Stores
          </h2>
          <p className="text-xs text-gray-500">Shop directly from top-rated verified merchant storefronts</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sellers.map((seller) => (
            <div
              key={seller.id}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mb-3">
                  {seller.storeName.substring(0, 2)}
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{seller.storeName}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{seller.description}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500">★ {seller.rating.toFixed(1)} Store Rating</span>
                <Link
                  href={`/products?seller=${seller.slug}`}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Visit Store →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-gray-500 mt-1">Everything you need to know about NEXORA marketplace</p>
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">How does Natural Language & Voice Search work?</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              NEXORA uses browser speech recognition paired with a local NLP parsing engine. It automatically extracts intent, budget limits, colors, and category constraints from conversational sentences like "Show me black running shoes under 2500 rupees".
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">How does Multi-Vendor Order Splitting work?</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              When a customer purchases items from multiple sellers in a single checkout, NEXORA automatically generates sub-orders for each seller so they can manage fulfillment independently, while the customer maintains a unified tracking view.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">What payment methods are supported?</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              NEXORA supports instant simulated UPI, Credit Card, Debit Card, Net Banking, and Cash on Delivery with full signature verification and status updating.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
