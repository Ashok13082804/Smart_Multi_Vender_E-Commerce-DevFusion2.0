import { Tag } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <Tag className="w-8 h-8 text-indigo-600" /> Platform Global Coupons ({coupons.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c.id} className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-mono font-black text-base text-indigo-600 dark:text-indigo-400">{c.code}</span>
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold text-[10px] rounded-md">
                Active
              </span>
            </div>
            <p className="text-xs text-gray-500">{c.description}</p>
            <div className="text-xs font-bold text-gray-900 dark:text-white pt-2">
              Discount: {c.discountType === "PERCENTAGE" ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
            </div>
            <p className="text-[11px] text-gray-400">Expires: {formatDate(c.expiresAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
