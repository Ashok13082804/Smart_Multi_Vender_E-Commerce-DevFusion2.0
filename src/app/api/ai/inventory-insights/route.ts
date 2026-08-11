import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { calculateInventoryInsights } from "@/ai/inventory/inventoryPredictionService";

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
    return NextResponse.json({ success: false, error: { message: "Unauthorized" } }, { status: 403 });
  }

  try {
    const sellerId = session.role === "SELLER" ? session.sellerId : undefined;
    const insights = await calculateInventoryInsights(sellerId);
    return NextResponse.json({ success: true, insights });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
