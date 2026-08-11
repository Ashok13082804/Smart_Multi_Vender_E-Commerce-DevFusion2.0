import { db } from "@/lib/db";
import { clearCart, getCart } from "../cart/cartService";
import { evaluateOrderFraudRisk } from "@/ai/security/fraudRiskService";

export interface CreateOrderInput {
  userId: string;
  addressId: string;
  couponCode?: string;
  paymentMethod: "UPI" | "CREDIT_CARD" | "DEBIT_CARD" | "NET_BANKING" | "CASH_ON_DELIVERY";
  notes?: string;
}

export async function createOrder(input: CreateOrderInput) {
  const { userId, addressId, couponCode, paymentMethod, notes } = input;

  const cart = await getCart(userId);
  if (!cart.items || cart.items.length === 0) {
    throw new Error("Your shopping cart is empty");
  }

  // Validate stock for all items
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      throw new Error(`Item "${item.product.name}" has insufficient stock (${item.product.stock} left)`);
    }
  }

  // Calculate Subtotal & Shipping
  let subtotal = cart.subtotal;
  let shippingAmount = subtotal > 1500 ? 0 : 99; // Free shipping over ₹1500
  let discountAmount = 0;

  // Coupon validation
  if (couponCode) {
    const coupon = await db.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
    if (coupon && coupon.isActive && new Date() < coupon.expiresAt) {
      if (subtotal >= coupon.minCartValue) {
        if (coupon.discountType === "PERCENTAGE") {
          discountAmount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else if (coupon.discountType === "FLAT") {
          discountAmount = coupon.discountValue;
        } else if (coupon.discountType === "FREE_SHIPPING") {
          shippingAmount = 0;
        }

        // Increment coupon used count
        await db.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }
  }

  const taxAmount = Math.round((subtotal - discountAmount) * 0.18); // 18% GST
  const totalAmount = Math.max(0, subtotal - discountAmount + taxAmount + shippingAmount);

  // Evaluate Fraud Risk Signals
  const userPastOrders = await db.order.count({ where: { customerId: userId } });
  const fraudRisk = evaluateOrderFraudRisk({
    subtotal,
    discountAmount,
    totalAmount,
    paymentMethod,
    userPastOrderCount: userPastOrders,
  });

  const orderNumber = `NX-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  // Create Parent Order
  const order = await db.order.create({
    data: {
      orderNumber,
      customerId: userId,
      addressId,
      subtotal,
      discountAmount,
      taxAmount,
      shippingAmount,
      totalAmount,
      couponCode,
      notes,
      riskLevel: fraudRisk.riskLevel,
      riskScore: fraudRisk.riskScore,
      status: paymentMethod === "CASH_ON_DELIVERY" ? "CONFIRMED" : "PENDING_PAYMENT",
    },
  });

  // Group items by Seller for Multi-Vendor Order Splitting!
  const itemsBySeller: Record<string, typeof cart.items> = {};
  cart.items.forEach((item) => {
    const sId = item.product.sellerId;
    if (!itemsBySeller[sId]) itemsBySeller[sId] = [];
    itemsBySeller[sId].push(item);
  });

  for (const [sellerId, sellerItems] of Object.entries(itemsBySeller)) {
    const sellerSubtotal = sellerItems.reduce((sum, item) => sum + item.itemTotal, 0);
    const sellerTax = Math.round(sellerSubtotal * 0.18);

    const sellerOrder = await db.sellerOrder.create({
      data: {
        orderId: order.id,
        sellerId,
        subtotal: sellerSubtotal,
        tax: sellerTax,
        total: sellerSubtotal + sellerTax,
        status: paymentMethod === "CASH_ON_DELIVERY" ? "CONFIRMED" : "PENDING_PAYMENT",
      },
    });

    for (const item of sellerItems) {
      await db.orderItem.create({
        data: {
          orderId: order.id,
          sellerOrderId: sellerOrder.id,
          productId: item.productId,
          price: item.product.price,
          quantity: item.quantity,
          totalPrice: item.itemTotal,
        },
      });

      // Reduce product stock atomically & log inventory
      await db.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          soldCount: { increment: item.quantity },
        },
      });

      await db.inventoryLog.create({
        data: {
          productId: item.productId,
          quantity: -item.quantity,
          action: "RESERVED",
          reason: `Order ${orderNumber} placed`,
        },
      });
    }
  }

  // Create Initial Payment Record
  const transactionId = `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  await db.payment.create({
    data: {
      orderId: order.id,
      amount: totalAmount,
      method: paymentMethod,
      status: paymentMethod === "CASH_ON_DELIVERY" ? "SUCCESS" : "PENDING",
      transactionId,
    },
  });

  // Create Shipment
  await db.shipment.create({
    data: {
      orderId: order.id,
      trackingNumber: `TRK-NX-${Date.now().toString().slice(-8)}`,
      carrier: "NEXORA Express",
      status: paymentMethod === "CASH_ON_DELIVERY" ? "CONFIRMED" : "PENDING_PAYMENT",
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    },
  });

  // Clear Cart
  await clearCart(userId);

  return order;
}

export async function getOrderById(orderId: string, userId?: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      address: true,
      items: {
        include: {
          product: { include: { seller: true } },
        },
      },
      sellerOrders: {
        include: {
          seller: true,
          items: { include: { product: true } },
        },
      },
      payment: true,
      shipment: true,
      customer: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });

  return order;
}
