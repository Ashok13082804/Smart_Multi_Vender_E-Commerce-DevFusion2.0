import { ShoppingBag } from "lucide-react";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true, items: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-indigo-600" /> Platform Global Orders ({orders.length})
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white uppercase font-bold text-[10px]">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="p-4 font-mono font-bold text-gray-900 dark:text-white">#{o.orderNumber}</td>
                  <td className="p-4">{o.customer.name}</td>
                  <td className="p-4 font-bold text-gray-900 dark:text-white">{formatCurrency(o.totalAmount)}</td>
                  <td className="p-4 font-bold text-emerald-600">{o.status}</td>
                  <td className="p-4 font-bold text-indigo-600">{o.riskLevel}</td>
                  <td className="p-4">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
