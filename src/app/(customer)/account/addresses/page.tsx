import { MapPin, Plus, CheckCircle } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AddressesPage() {
  const session = await getSession();
  if (!session) return null;

  const addresses = await db.address.findMany({
    where: { userId: session.id },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <MapPin className="w-8 h-8 text-indigo-600" /> Saved Delivery Addresses
          </h1>
          <p className="text-xs text-gray-500 mt-1">Manage your home, office, and alternate delivery addresses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr.id} className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{addr.name}</h3>
              <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold text-[10px] rounded-md uppercase">
                {addr.type}
              </span>
            </div>
            <p className="text-xs text-gray-500">{addr.street}</p>
            <p className="text-xs text-gray-500">{addr.city}, {addr.state} - {addr.zipCode}</p>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 pt-1">Phone: {addr.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
