import { db } from "@/lib/db";

export interface ProcessPaymentInput {
  orderId: string;
  method: "UPI" | "CREDIT_CARD" | "DEBIT_CARD" | "NET_BANKING" | "CASH_ON_DELIVERY";
  cardOrUpiDetails?: {
    upiId?: string;
    cardNumber?: string;
    expiry?: string;
  };
}

export async function processLocalPayment(input: ProcessPaymentInput) {
  const { orderId, method } = input;

  const payment = await db.payment.findUnique({
    where: { orderId },
    include: { order: true },
  });

  if (!payment) throw new Error("Payment record not found");

  // Idempotency check: if already paid, return existing success
  if (payment.status === "SUCCESS") {
    return { success: true, payment, message: "Payment already completed" };
  }

  // Simulate verification & update payment status
  const updatedPayment = await db.payment.update({
    where: { id: payment.id },
    data: {
      status: "SUCCESS",
      method,
      paymentData: JSON.stringify({
        simulatedAt: new Date().toISOString(),
        verified: true,
        gateway: "NEXORA Local Payment Engine v1.0",
      }),
    },
  });

  // Update Parent Order status
  await db.order.update({
    where: { id: orderId },
    data: { status: "CONFIRMED" },
  });

  // Update Seller Sub-Orders status
  await db.sellerOrder.updateMany({
    where: { orderId },
    data: { status: "CONFIRMED" },
  });

  // Update Shipment status
  await db.shipment.update({
    where: { orderId },
    data: { status: "CONFIRMED" },
  });

  return {
    success: true,
    payment: updatedPayment,
    message: "Payment processed successfully!",
  };
}
