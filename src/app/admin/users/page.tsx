import { Users, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { seller: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-600" /> Platform User Governance ({users.length})
        </h1>
        <p className="text-xs text-gray-500 mt-1">Manage accounts, customer segmentation, and merchant verification</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white uppercase font-bold text-[10px]">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Segment</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="p-4 font-bold text-gray-900 dark:text-white">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 font-bold text-[10px] rounded-md uppercase ${
                      u.role === "ADMIN" ? "bg-purple-100 text-purple-700" : u.role === "SELLER" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-indigo-600">{u.segment}</td>
                  <td className="p-4">{formatDate(u.createdAt)}</td>
                  <td className="p-4 text-right">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-bold rounded-md">
                      Verified
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
