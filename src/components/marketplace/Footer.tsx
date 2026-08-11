import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Headphones, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Dispatch</h4>
              <p className="text-xs text-gray-400">Free delivery on orders above ₹1,500</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Secure</h4>
              <p className="text-xs text-gray-400">Encrypted checkout & mock UPI payments</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Easy Returns</h4>
              <p className="text-xs text-gray-400">7-day hassle-free replacement guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">24/7 AI Assistance</h4>
              <p className="text-xs text-gray-400">Natural voice search & smart product advice</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-white font-black text-lg">
                N
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">NEXORA</span>
            </Link>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              NEXORA is an AI-powered multi-vendor marketplace connecting independent sellers and smart shoppers with intelligent discovery, natural voice search, and predictive inventory analytics.
            </p>
            <div className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Commerce that thinks ahead.
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="/products" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link href="/products?category=fashion" className="hover:text-white transition-colors">Fashion</Link></li>
              <li><Link href="/products?category=grocery" className="hover:text-white transition-colors">Grocery Essentials</Link></li>
              <li><Link href="/products?category=home" className="hover:text-white transition-colors">Home & Kitchen</Link></li>
              <li><Link href="/deals" className="hover:text-white transition-colors">Flash Deals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">For Sellers</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="/register/seller" className="hover:text-white transition-colors">Sell on NEXORA</Link></li>
              <li><Link href="/seller" className="hover:text-white transition-colors">Seller Portal</Link></li>
              <li><Link href="/seller/products" className="hover:text-white transition-colors">Inventory Insights</Link></li>
              <li><Link href="/seller/analytics" className="hover:text-white transition-colors">Revenue Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Account & Support</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="/account" className="hover:text-white transition-colors">My Profile</Link></li>
              <li><Link href="/account/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 NEXORA AI Commerce Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-400">Privacy Policy</span>
            <span className="hover:text-gray-400">Terms of Service</span>
            <span className="hover:text-gray-400">GST Registration</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
