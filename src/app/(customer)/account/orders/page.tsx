import Link from "next/link";
import { Package, ArrowRight, Clock } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function CustomerOrdersPage() {
  const session = await getSession();
  if (!session) return null;

  const orders = await db.order.findMany({
    where: { customerId: session.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
      shipment: true,
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <Package className="w-8 h-8 text-indigo-600" /> My Order History ({orders.length})
        </h1>
        <p className="text-xs text-gray-500 mt-1">Track fulfillment status and view invoice receipts</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">#{ord.orderNumber}</span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold text-[10px] rounded-md">
                    {ord.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Placed on {formatDate(ord.createdAt)} • {ord.items.length} items</p>
                <div className="text-sm font-black text-gray-900 dark:text-white pt-1">
                  Total: {formatCurrency(ord.totalAmount)}
                </div>
              </div>

              <Link
                href={`/account/orders/${ord.id}`}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 self-start sm:self-auto"
              >
                Track Order & Invoice <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-xs text-gray-400">
          No orders placed yet.
        </div>
      )}

    </div>
  );
}
