"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (data.success) {
        setCart(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (cartItemId: string, quantity: number) => {
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItemId, quantity }),
    });
    fetchCart();
  };

  const handleRemove = async (cartItemId: string) => {
    await fetch(`/api/cart?id=${cartItemId}`, { method: "DELETE" });
    fetchCart();
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "NEXORA10") {
      setCouponDiscount(Math.round((cart.subtotal * 10) / 100));
    } else if (couponCode.toUpperCase() === "FLASH500" && cart.subtotal >= 2999) {
      setCouponDiscount(500);
    } else if (couponCode.toUpperCase() === "WELCOME200") {
      setCouponDiscount(200);
    } else {
      alert("Invalid coupon code or minimum cart value not met.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-gray-500">
        Loading cart details...
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto text-2xl">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Explore products from independent sellers and add them to your cart!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const subtotal = cart.subtotal;
  const shipping = subtotal > 1500 ? 0 : 99;
  const tax = Math.round((subtotal - couponDiscount) * 0.18);
  const total = Math.max(0, subtotal - couponDiscount + shipping + tax);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
        Shopping Cart ({cart.itemCount} Items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item: any) => {
            let images: string[] = [];
            try {
              images = JSON.parse(item.product.images);
            } catch {
              images = ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"];
            }

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-20 h-20 rounded-xl bg-gray-50 dark:bg-gray-800 overflow-hidden shrink-0">
                    <Image src={images[0]} alt="" fill className="object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase">{item.product.seller.storeName}</span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{item.product.name}</h3>
                    <div className="text-sm font-black text-gray-900 dark:text-white mt-1">
                      {formatCurrency(item.product.price)}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-800 rounded-xl p-1">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-gray-900 dark:text-white min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Coupon Box */}
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-500" /> Apply Promo Coupon
            </h3>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Try NEXORA10 or FLASH500"
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs uppercase font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
              >
                Apply
              </button>
            </form>
          </div>

          {/* Breakdown */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
              Order Calculation
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Items Subtotal</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping Charge</span>
                <span>{shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatCurrency(shipping)}</span>
              </div>

              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Estimated GST (18%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-gray-900 dark:text-white">Total Amount</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white">{formatCurrency(total)}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all mt-4"
            >
              Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
