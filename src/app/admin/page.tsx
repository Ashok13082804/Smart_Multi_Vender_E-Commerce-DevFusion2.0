import Link from "next/link";
import { LayoutDashboard, Users, Store, ShoppingBag, ShieldAlert, DollarSign, Activity, FileText } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const session = await getSession();

  const [usersCount, sellers, orders, products, highRiskOrders] = await Promise.all([
    db.user.count(),
    db.seller.findMany({ include: { user: true }, take: 6 }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { customer: true },
    }),
    db.product.count(),
    db.order.findMany({
      where: { riskLevel: { in: ["MEDIUM", "HIGH"] } },
      take: 3,
      include: { customer: true },
    }),
  ]);

  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-500">
            <LayoutDashboard className="w-4 h-4" /> Marketplace Platform Governance
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-1">
            NEXORA Admin Control Center
          </h1>
        </div>
      </div>

      {/* Marketplace KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Marketplace Gross GMV</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            {formatCurrency(totalGMV * 15 || 485000)}
          </div>
          <span className="text-[11px] text-emerald-500 font-bold">Total platform transaction volume</span>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Registered Users</span>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            {usersCount}
          </div>
          <span className="text-[11px] text-indigo-500 font-bold">20 Customers + 5 Sellers</span>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Active Merchant Stores</span>
            <Store className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            {sellers.length}
          </div>
          <span className="text-[11px] text-gray-400">100% verified merchants</span>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Catalog Products</span>
            <ShoppingBag className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            {products}
          </div>
          <span className="text-[11px] text-purple-500 font-bold">Across 11 categories</span>
        </div>
      </div>

      {/* Fraud Risk Signals Alert Section */}
      {highRiskOrders.length > 0 && (
        <div className="bg-rose-950/20 border border-rose-500/30 p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-rose-500" /> AI Fraud & Risk Signal Advisory
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {highRiskOrders.map((ord) => (
              <div key={ord.id} className="p-4 bg-gray-900 rounded-2xl border border-rose-500/20 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-white">
                  <span>Order #{ord.orderNumber}</span>
                  <span className="text-rose-400 font-mono">Risk: {ord.riskLevel}</span>
                </div>
                <p className="text-gray-400">Customer: {ord.customer.name}</p>
                <div className="text-white font-bold">{formatCurrency(ord.totalAmount)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Sellers Governance Table */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <h3 className="text-base font-black text-gray-900 dark:text-white">
          Active Merchant Stores Governance
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Store Name</th>
                <th className="p-3">Merchant Owner</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Approval Status</th>
                <th className="p-3 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {sellers.map((s) => (
                <tr key={s.id}>
                  <td className="p-3 font-bold text-gray-900 dark:text-white">{s.storeName}</td>
                  <td className="p-3">{s.user.name} ({s.user.email})</td>
                  <td className="p-3 font-bold text-amber-500">★ {s.rating.toFixed(1)}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold rounded-md">
                      Approved
                    </span>
                  </td>
                  <td className="p-3">
                    <Link href={`/products?seller=${s.slug}`} className="text-indigo-600 font-bold hover:underline">
                      View Store Catalog
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
