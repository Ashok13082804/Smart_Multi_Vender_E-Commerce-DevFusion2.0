import { Store, Save } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function SellerSettingsPage() {
  const session = await getSession();
  const seller = session?.id
    ? await db.seller.findUnique({ where: { userId: session.id } })
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <Store className="w-8 h-8 text-indigo-600" /> Store Profile & Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">Update merchant contact details, store branding, and GST number</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Storefront Name</label>
          <input
            type="text"
            defaultValue={seller?.storeName || "TechVerse Electronics"}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Store Description</label>
          <textarea
            rows={3}
            defaultValue={seller?.description || "Official store for high-end audio, mobile accessories, GaN chargers, and smart gadgets."}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
          />
        </div>

        <button type="button" className="px-6 py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md">
          Save Settings
        </button>
      </div>
    </div>
  );
}
