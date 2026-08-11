import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comparePassword, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: validated.email },
      include: { seller: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: { message: "Invalid email or password" } }, { status: 400 });
    }

    const isMatch = await comparePassword(validated.password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: { message: "Invalid email or password" } }, { status: 400 });
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any,
      sellerId: user.seller?.id,
      storeName: user.seller?.storeName,
    };

    await setAuthCookie(sessionUser);
    return NextResponse.json({ success: true, user: sessionUser });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err.message || "Login failed" } },
      { status: 400 }
    );
  }
}
