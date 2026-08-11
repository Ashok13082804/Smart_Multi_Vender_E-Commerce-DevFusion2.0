import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Truck, Package, ShieldCheck, Download, Calendar, MapPin, Store } from "lucide-react";
import { getOrderById } from "@/services/orders/orderService";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const steps = [
    { title: "CONFIRMED", label: "Order Placed", done: true },
    { title: "SELLER_ACCEPTED", label: "Merchant Accepted", done: order.status !== "PENDING_PAYMENT" },
    { title: "PACKED", label: "Packed", done: ["PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status) },
    { title: "SHIPPED", label: "In Transit", done: ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status) },
    { title: "DELIVERED", label: "Delivered", done: order.status === "DELIVERED" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold text-xs rounded-full">
              Order {order.status}
            </span>
            <span className="text-xs text-gray-400">Placed on {formatDate(order.createdAt)}</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mt-1">
            Order #{order.orderNumber}
          </h1>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl hover:border-indigo-500 flex items-center gap-2 transition-colors self-start"
        >
          <Download className="w-4 h-4" /> Download PDF Invoice
        </button>
      </div>

      {/* Visual Tracking Stepper */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Truck className="w-4 h-4 text-indigo-500" /> Fulfillment Timeline & Status
        </h3>

        <div className="grid grid-cols-5 gap-2 pt-2">
          {steps.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  s.done
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                }`}
              >
                {s.done ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={`text-[11px] font-bold ${s.done ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {order.shipment && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500">Tracking Number: </span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{order.shipment.trackingNumber}</span>
            </div>
            <div>
              <span className="text-gray-500">Delivery OTP: </span>
              <span className="font-mono font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-900 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                {order.shipment.otp}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Vendor Items Purchased */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Package className="w-4 h-4 text-indigo-500" /> Items in Order ({order.items.length})
        </h3>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {order.items.map((item) => {
            let images: string[] = [];
            try {
              images = JSON.parse(item.product.images);
            } catch {
              images = ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"];
            }

            return (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl bg-gray-50 dark:bg-gray-800 overflow-hidden shrink-0">
                    <Image src={images[0]} alt="" fill className="object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase">{item.product.seller.storeName}</span>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{item.product.name}</h4>
                    <p className="text-[11px] text-gray-500">
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-black text-gray-900 dark:text-white">
                  {formatCurrency(item.totalPrice)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3 text-xs">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
          Payment Breakdown
        </h3>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Shipping Fee</span>
          <span>{formatCurrency(order.shippingAmount)}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>GST Tax (18%)</span>
          <span>{formatCurrency(order.taxAmount)}</span>
        </div>
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between text-sm font-black text-gray-900 dark:text-white">
          <span>Total Paid ({order.payment?.method || "UPI"})</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

    </div>
  );
}
