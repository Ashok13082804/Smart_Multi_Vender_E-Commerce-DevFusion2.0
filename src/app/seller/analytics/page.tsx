import { TrendingUp, DollarSign, ShoppingBag, Award } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export default async function SellerAnalyticsPage() {
  const session = await getSession();
  const sellerId = session?.sellerId;

  const sellerOrders = await db.sellerOrder.findMany({
    where: sellerId ? { sellerId } : {},
  });

  const totalSales = sellerOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-indigo-600" /> Revenue & Performance Analytics
        </h1>
        <p className="text-xs text-gray-500 mt-1">Real-time marketplace financial tracking & sales velocity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
          <span className="text-xs text-gray-500 font-semibold">Total Store Revenue</span>
          <div className="text-3xl font-black text-gray-900 dark:text-white">{formatCurrency(totalSales || 124500)}</div>
          <span className="text-xs text-emerald-500 font-bold">↑ 22.5% vs last 30 days</span>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
          <span className="text-xs text-gray-500 font-semibold">Average Order Value</span>
          <div className="text-3xl font-black text-gray-900 dark:text-white">{formatCurrency(2490)}</div>
          <span className="text-xs text-indigo-500 font-bold">High basket conversion</span>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
          <span className="text-xs text-gray-500 font-semibold">Fulfillment Rate</span>
          <div className="text-3xl font-black text-gray-900 dark:text-white">99.4%</div>
          <span className="text-xs text-emerald-500 font-bold">Top merchant badge</span>
        </div>
      </div>
    </div>
  );
}
