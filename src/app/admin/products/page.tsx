import { Package } from "lucide-react";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, seller: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <Package className="w-8 h-8 text-indigo-600" /> Marketplace Catalog Governance ({products.length})
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white uppercase font-bold text-[10px]">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Merchant Store</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="p-4 font-bold text-gray-900 dark:text-white max-w-xs truncate">{p.name}</td>
                  <td className="p-4 font-bold text-indigo-600">{p.seller.storeName}</td>
                  <td className="p-4">{p.category.name}</td>
                  <td className="p-4 font-bold text-gray-900 dark:text-white">{formatCurrency(p.price)}</td>
                  <td className="p-4">{p.stock} units</td>
                  <td className="p-4 text-right">
                    {p.isFlashDeal && <span className="px-2 py-0.5 bg-rose-500 text-white font-bold text-[10px] rounded mr-1">FLASH</span>}
                    {p.isFeatured && <span className="px-2 py-0.5 bg-indigo-600 text-white font-bold text-[10px] rounded">FEATURED</span>}
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
