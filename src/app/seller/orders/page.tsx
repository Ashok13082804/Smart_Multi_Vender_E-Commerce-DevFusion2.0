import { ShoppingBag, ArrowRight } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function SellerOrdersPage() {
  const session = await getSession();
  const sellerId = session?.sellerId;

  const sellerOrders = await db.sellerOrder.findMany({
    where: sellerId ? { sellerId } : {},
    orderBy: { createdAt: "desc" },
    include: {
      order: { include: { customer: true, address: true } },
      items: { include: { product: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-indigo-600" /> Merchant Order Pipeline ({sellerOrders.length})
        </h1>
        <p className="text-xs text-gray-500 mt-1">Fulfill orders, generate shipping labels, and update status</p>
      </div>

      <div className="space-y-4">
        {sellerOrders.map((so) => (
          <div key={so.id} className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span className="font-bold text-gray-900 dark:text-white">Order #{so.order.orderNumber}</span>
                <span className="text-gray-400 ml-2">Placed on {formatDate(so.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold text-[10px] rounded-md">
                  Status: {so.status}
                </span>
                <span className="font-black text-gray-900 dark:text-white text-sm">{formatCurrency(so.total)}</span>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <p className="font-bold text-gray-900 dark:text-white">Customer: {so.order.customer.name}</p>
              <p className="text-gray-500">Shipping: {so.order.address.street}, {so.order.address.city} - {so.order.address.zipCode}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
