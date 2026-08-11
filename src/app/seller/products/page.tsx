import Link from "next/link";
import { Package, Plus, Edit, Trash2 } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export default async function SellerProductsPage() {
  const session = await getSession();
  const sellerId = session?.sellerId;

  const products = await db.product.findMany({
    where: sellerId ? { sellerId } : {},
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-600" /> Store Product Inventory ({products.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1">Manage pricing, stock levels, and catalog status</p>
        </div>

        <Link
          href="/seller/products/new"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product with AI
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white uppercase font-bold text-[10px]">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="p-4 font-bold text-gray-900 dark:text-white max-w-xs truncate">{p.name}</td>
                  <td className="p-4 font-mono text-gray-500">{p.sku}</td>
                  <td className="p-4">{p.category.name}</td>
                  <td className="p-4 font-bold text-gray-900 dark:text-white">{formatCurrency(p.price)}</td>
                  <td className="p-4">
                    <span className={`font-bold ${p.stock <= 5 ? "text-rose-500" : "text-emerald-600"}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="p-4 font-bold text-amber-500">★ {p.rating.toFixed(1)}</td>
                  <td className="p-4 text-right">
                    <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold rounded-md">
                      Active
                    </span>
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
