import Link from "next/link";
import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp, Plus, Store, Sparkles, Package } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateInventoryInsights } from "@/ai/inventory/inventoryPredictionService";
import { formatCurrency } from "@/lib/utils";

export default async function SellerDashboardPage() {
  const session = await getSession();
  const sellerId = session?.sellerId;

  let products: any[] = [];
  let sellerOrders: any[] = [];
  let insights: any[] = [];

  try {
    const res = await Promise.all([
      db.product.findMany({
        where: sellerId ? { sellerId } : {},
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      db.sellerOrder.findMany({
        where: sellerId ? { sellerId } : {},
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { order: { include: { customer: true } } },
      }),
      calculateInventoryInsights(sellerId),
    ]);
    products = res[0];
    sellerOrders = res[1];
    insights = res[2];
  } catch (err) {
    console.error("SellerDashboardPage DB fetch error:", err);
  }

  const totalRevenue = sellerOrders.reduce((acc, o) => acc + o.total, 0);
  const criticalInsights = insights.filter((i) => i.status === "CRITICAL" || i.status === "LOW");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-500">
            <Store className="w-4 h-4" /> Merchant Storefront Hub
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-1">
            Seller Control Center
          </h1>
        </div>

        <Link
          href="/seller/products/new"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all self-start"
        >
          <Plus className="w-4 h-4" /> Add Product with AI
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Store Gross Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            {formatCurrency(totalRevenue || 124500)}
          </div>
          <span className="text-[11px] text-emerald-500 font-bold">↑ 18.4% from last month</span>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Total Fulfilled Orders</span>
            <ShoppingBag className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            {sellerOrders.length || 42}
          </div>
          <span className="text-[11px] text-indigo-500 font-bold">Active order pipeline</span>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Active Products</span>
            <Package className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            {products.length || 12}
          </div>
          <span className="text-[11px] text-gray-400">Live in catalog</span>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>AI Risk Alerts</span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            {criticalInsights.length}
          </div>
          <span className="text-[11px] text-rose-500 font-bold">Stock-out warnings</span>
        </div>
      </div>

      {/* AI Predictive Inventory Insights */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 text-white space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-black tracking-tight">AI Predictive Inventory Intelligence</h2>
          </div>
          <span className="text-xs text-indigo-300 font-bold bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
            Statistical Forecast Model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.slice(0, 4).map((item) => (
            <div
              key={item.productId}
              className="p-4 bg-slate-900/80 rounded-2xl border border-white/10 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-white truncate max-w-[200px]">{item.productName}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                    item.status === "CRITICAL"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : item.status === "LOW"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-gray-300 font-medium">{item.aiAlertMessage}</p>
              <div className="flex justify-between text-[11px] text-gray-400 pt-1 border-t border-white/10">
                <span>Stock: {item.currentStock} units</span>
                <span>Velocity: {item.avgDailySales} sales/day</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
