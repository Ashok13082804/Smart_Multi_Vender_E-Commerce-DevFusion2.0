import { NextResponse } from "next/server";
import { processLocalPayment } from "@/services/payments/paymentService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await processLocalPayment({
      orderId: body.orderId,
      method: body.method,
      cardOrUpiDetails: body.cardOrUpiDetails,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message || "Payment failed" } }, { status: 400 });
  }
}
