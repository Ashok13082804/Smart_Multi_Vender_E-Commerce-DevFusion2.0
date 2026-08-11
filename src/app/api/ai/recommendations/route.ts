import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateRecommendationsForUser } from "@/ai/recommendation/recommendationEngine";

export async function GET() {
  const session = await getSession();
  const userId = session?.id || "guest";

  try {
    const recommendations = await generateRecommendationsForUser(userId, 8);
    return NextResponse.json({ success: true, recommendations });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
