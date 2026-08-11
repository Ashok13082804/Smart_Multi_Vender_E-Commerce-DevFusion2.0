"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Mic,
  ShoppingCart,
  Heart,
  User,
  Store,
  Tag,
  Menu,
  X,
  Sparkles,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Package,
} from "lucide-react";
import VoiceSearchModal from "./VoiceSearchModal";

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Fetch logged in user status
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    // Fetch cart count
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.itemCount) {
          setCartCount(data.itemCount);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleVoiceSearchResult = (transcript: string) => {
    setSearchQuery(transcript);
    router.push(`/search?q=${encodeURIComponent(transcript)}`);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                N
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  NEXORA
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-widest font-semibold text-indigo-500 -mt-1">
                  AI Commerce
                </span>
              </div>
            </Link>

            {/* Desktop NLP Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-2xl items-center relative group"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products with natural language e.g. 'black running shoes under 2500'..."
                  className="w-full pl-10 pr-12 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-gray-900 dark:text-white"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>

              {/* Voice Search Button */}
              <button
                type="button"
                onClick={() => setIsVoiceOpen(true)}
                title="Voice Search"
                className="absolute right-3 p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Mic className="w-4 h-4" />
              </button>
            </form>

            {/* Navigation Actions */}
            <div className="hidden lg:flex items-center gap-6">
              <Link href="/products" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Categories
              </Link>
              <Link href="/deals" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors">
                <Tag className="w-4 h-4 text-amber-500" /> Deals
              </Link>
              <Link href="/stores" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors">
                <Store className="w-4 h-4 text-indigo-500" /> Stores
              </Link>
            </div>

            {/* User & Cart Icons */}
            <div className="flex items-center gap-3">
              <Link
                href="/account/wishlist"
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              >
                <Heart className="w-5 h-5" />
              </Link>

              <Link
                href="/cart"
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                      {user.name.substring(0, 2)}
                    </div>
                    <span className="hidden sm:block text-xs font-semibold text-gray-800 dark:text-gray-200 max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-md uppercase">
                          Role: {user.role}
                        </span>
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <User className="w-4 h-4 text-indigo-500" /> Customer Account
                      </Link>

                      {user.role === "SELLER" && (
                        <Link
                          href="/seller"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <Store className="w-4 h-4 text-emerald-500" /> Seller Dashboard
                        </Link>
                      )}

                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <LayoutDashboard className="w-4 h-4 text-purple-500" /> Admin Control
                        </Link>
                      )}

                      <Link
                        href="/account/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <Package className="w-4 h-4 text-amber-500" /> My Orders
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left border-t border-gray-100 dark:border-gray-800 mt-1"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-xs font-semibold text-white gradient-bg rounded-xl hover:opacity-95 shadow-md shadow-indigo-500/20 transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-10 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <button
                type="button"
                onClick={() => setIsVoiceOpen(true)}
                className="absolute right-3 top-2 text-gray-400"
              >
                <Mic className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 py-4 space-y-3">
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 py-1"
            >
              Browse Categories
            </Link>
            <Link
              href="/deals"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 py-1"
            >
              Flash Deals
            </Link>
            <Link
              href="/stores"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 py-1"
            >
              Popular Stores
            </Link>
            <Link
              href="/register/seller"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-indigo-600 dark:text-indigo-400 py-1"
            >
              Become a Seller
            </Link>
          </div>
        )}
      </header>

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onSearch={handleVoiceSearchResult}
      />
    </>
  );
}
