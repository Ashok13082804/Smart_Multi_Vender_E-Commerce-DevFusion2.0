"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error?.message || "Login failed");
      }

      if (data.user.role === "SELLER") {
        router.push("/seller");
      } else if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role: "CUSTOMER" | "SELLER" | "ADMIN") => {
    if (role === "ADMIN") {
      setEmail("admin@nexora.in");
      setPassword("Admin@123");
    } else if (role === "SELLER") {
      setEmail("seller.tech@nexora.in");
      setPassword("Password@123");
    } else {
      setEmail("customer1@nexora.in");
      setPassword("Password@123");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white font-black text-2xl mx-auto shadow-md">
            N
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Welcome Back to NEXORA
          </h1>
          <p className="text-xs text-gray-500">Log in to manage orders, seller store, or admin panel</p>
        </div>

        {/* Quick Demo Login Preset Buttons for Hackathon Judging */}
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-500" /> Demo Accounts Quick-Fill:
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickFill("CUSTOMER")}
              className="py-1.5 px-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-bold rounded-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-500 transition-colors"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("SELLER")}
              className="py-1.5 px-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-bold rounded-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-500 transition-colors"
            >
              Seller
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("ADMIN")}
              className="py-1.5 px-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-bold rounded-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-500 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-600 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            {loading ? "Authenticating..." : <><LogIn className="w-4 h-4" /> Log In</>}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
}
