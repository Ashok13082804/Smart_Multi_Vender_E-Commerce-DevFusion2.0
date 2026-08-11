import Link from "next/link";
import { User, Package, Heart, MapPin, Award, ArrowRight, ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-gray-900 rounded-3xl text-center space-y-4 border border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Please log in</h2>
        <Link href="/login" className="inline-block px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl">
          Log In Now
        </Link>
      </div>
    );
  }

  const [user, orders, wishlist] = await Promise.all([
    db.user.findUnique({
      where: { id: session.id },
      include: { addresses: true },
    }),
    db.order.findMany({
      where: { customerId: session.id },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    db.wishlist.findUnique({
      where: { userId: session.id },
      include: { items: true },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-bg text-white font-black text-2xl flex items-center justify-center shadow-lg uppercase">
            {user?.name.substring(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">{user?.name}</h1>
              <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold text-[10px] rounded-md uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{user?.email} • {user?.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <div>
              <div className="font-bold text-gray-900 dark:text-white">{user?.rewardPoints} Pts</div>
              <div className="text-[10px] text-gray-400">Reward Balance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          href="/account/orders"
          className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-indigo-500 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-2xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">My Orders</h3>
              <p className="text-xs text-gray-400">{orders.length} total orders</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/account/wishlist"
          className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-indigo-500 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-50 dark:bg-rose-950 text-rose-500 rounded-2xl">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Saved Wishlist</h3>
              <p className="text-xs text-gray-400">{wishlist?.items.length || 0} saved items</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/account/addresses"
          className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-indigo-500 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-2xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Address Book</h3>
              <p className="text-xs text-gray-400">{user?.addresses.length} saved addresses</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
