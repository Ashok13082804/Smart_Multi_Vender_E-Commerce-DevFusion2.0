import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createOrder } from "@/services/orders/orderService";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { message: "Please log in to proceed to checkout" } }, { status: 401 });
  }

  try {
    const body = await req.json();
    const order = await createOrder({
      userId: session.id,
      addressId: body.addressId,
      couponCode: body.couponCode,
      paymentMethod: body.paymentMethod,
      notes: body.notes,
    });

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message || "Checkout failed" } }, { status: 400 });
  }
}
