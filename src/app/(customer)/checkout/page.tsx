"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, ShieldCheck, Truck, Lock, AlertCircle, Plus, MapPin, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<"UPI" | "RAZORPAY" | "CREDIT_CARD" | "CASH_ON_DELIVERY">("UPI");
  const [upiId, setUpiId] = useState("user@upi");
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // New Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: "",
    phone: "",
    type: "HOME",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/cart").then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()),
    ]).then(([cartData, userData]) => {
      if (cartData.success) {
        setCart(cartData);
      }
      setLoading(false);
    });
  }, []);

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.street || !newAddr.city) {
      alert("Please fill in address details.");
      return;
    }

    const created = {
      id: `addr_${Date.now()}`,
      ...newAddr,
    };

    setAddresses((prev) => [...prev, created]);
    setSelectedAddressId(created.id);
    setShowAddAddress(false);
  };

  const handlePlaceOrder = async () => {
    setError(null);
    setProcessing(true);

    try {
      // 1. Create Multi-Vendor Order
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddressId || "default-address",
          paymentMethod: selectedMethod === "RAZORPAY" ? "UPI" : selectedMethod,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error?.message || "Order creation failed");
      }

      const orderId = data.order.id;

      // 2. Process Payment (Razorpay Test or Simulated UPI/Card/COD)
      const payRes = await fetch("/api/payments/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          method: selectedMethod === "RAZORPAY" ? "UPI" : selectedMethod,
        }),
      });

      const payData = await payRes.json();
      if (!payData.success) {
        throw new Error(payData.error?.message || "Payment verification failed");
      }

      // Navigate to order tracking page
      router.push(`/account/orders/${orderId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-xs text-gray-500">Preparing checkout...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return <div className="p-16 text-center text-xs text-gray-500">Your shopping cart is empty.</div>;
  }

  const subtotal = cart.subtotal;
  const shipping = subtotal > 1500 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            NEXORA Secure Checkout
          </h1>
          <p className="text-xs text-gray-500 mt-1">Multi-Vendor Checkout & Razorpay / UPI Payment Gateway</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl">
          <Lock className="w-4 h-4" /> 256-Bit Encrypted
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-600 font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Address & Payment Method */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Shipping Address Selection & Add Address Modal */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-500" /> 1. Shipping Address
              </h3>
              <button
                type="button"
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add New Address
              </button>
            </div>

            {/* Default Address Option */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-indigo-500/30 flex justify-between items-start">
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">Rahul Sharma</h4>
                <p className="text-xs text-gray-500 mt-1">101, Park View Residency, MG Road</p>
                <p className="text-xs text-gray-500">Bengaluru, Karnataka - 560001</p>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-2">Phone: +91 98765 43210</p>
              </div>
              <span className="px-2.5 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-md uppercase">Default</span>
            </div>

            {/* Add Address Inline Form */}
            {showAddAddress && (
              <form onSubmit={handleCreateAddress} className="p-4 bg-gray-50 dark:bg-gray-800/80 rounded-2xl space-y-3 text-xs border border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white">Enter Delivery Details</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    className="p-2 bg-white dark:bg-gray-900 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    required
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="p-2 bg-white dark:bg-gray-900 border rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Street Address"
                  required
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full p-2 bg-white dark:bg-gray-900 border rounded-lg"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="p-2 bg-white dark:bg-gray-900 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    required
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="p-2 bg-white dark:bg-gray-900 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Zip Code"
                    required
                    value={newAddr.zipCode}
                    onChange={(e) => setNewAddr({ ...newAddr, zipCode: e.target.value })}
                    className="p-2 bg-white dark:bg-gray-900 border rounded-lg"
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg text-xs">
                  Save Address
                </button>
              </form>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-500" /> 2. Select Payment Option
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMethod("UPI")}
                className={`p-4 rounded-2xl border text-left font-bold text-xs flex flex-col justify-between transition-all ${
                  selectedMethod === "UPI"
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                    : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span>UPI (GPay / PhonePe)</span>
                <span className="text-[10px] text-gray-400 font-normal mt-2">Instant Virtual Payment</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("RAZORPAY")}
                className={`p-4 rounded-2xl border text-left font-bold text-xs flex flex-col justify-between transition-all ${
                  selectedMethod === "RAZORPAY"
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                    : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="flex items-center gap-1 text-indigo-600">
                  <Sparkles className="w-3.5 h-3.5" /> Razorpay Test Gateway
                </span>
                <span className="text-[10px] text-gray-400 font-normal mt-2">UPI / Cards / NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("CREDIT_CARD")}
                className={`p-4 rounded-2xl border text-left font-bold text-xs flex flex-col justify-between transition-all ${
                  selectedMethod === "CREDIT_CARD"
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                    : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span>Credit / Debit Card</span>
                <span className="text-[10px] text-gray-400 font-normal mt-2">Visa / Mastercard / RuPay</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("CASH_ON_DELIVERY")}
                className={`p-4 rounded-2xl border text-left font-bold text-xs flex flex-col justify-between transition-all ${
                  selectedMethod === "CASH_ON_DELIVERY"
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                    : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span>Cash on Delivery</span>
                <span className="text-[10px] text-gray-400 font-normal mt-2">Pay on doorstep arrival</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Order Calculation & Submit */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
              Order Breakdown
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Items Subtotal ({cart.itemCount})</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping Fee</span>
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

            <button
              onClick={handlePlaceOrder}
              disabled={processing}
              className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all mt-4"
            >
              {processing ? "Authorizing Payment & Creating Order..." : <><Check className="w-5 h-5" /> Place Order ({formatCurrency(total)})</>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
