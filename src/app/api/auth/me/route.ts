import { NextResponse } from "next/server";
import { clearAuthCookie, getSession } from "@/lib/auth";

export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }
  return NextResponse.json({ success: true, user: session });
}
