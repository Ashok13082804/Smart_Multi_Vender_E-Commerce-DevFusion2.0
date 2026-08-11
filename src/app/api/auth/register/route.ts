import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, setAuthCookie } from "@/lib/auth";
import { customerRegisterSchema, sellerRegisterSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const isSeller = body.role === "SELLER";

    if (isSeller) {
      const validated = sellerRegisterSchema.parse(body);
      const existingUser = await db.user.findUnique({ where: { email: validated.email } });
      if (existingUser) {
        return NextResponse.json({ success: false, error: { message: "Email already registered" } }, { status: 400 });
      }

      const existingStore = await db.seller.findUnique({ where: { storeName: validated.storeName } });
      if (existingStore) {
        return NextResponse.json({ success: false, error: { message: "Store name already taken" } }, { status: 400 });
      }

      const hashedPassword = await hashPassword(validated.password);
      const user = await db.user.create({
        data: {
          name: validated.name,
          email: validated.email,
          phone: validated.phone,
          password: hashedPassword,
          role: "SELLER",
          isVerified: true,
          seller: {
            create: {
              storeName: validated.storeName,
              slug: slugify(validated.storeName),
              description: validated.description,
              businessPhone: validated.phone,
              businessEmail: validated.email,
              isApproved: true,
            },
          },
        },
        include: { seller: true },
      });

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
    } else {
      const validated = customerRegisterSchema.parse(body);
      const existingUser = await db.user.findUnique({ where: { email: validated.email } });
      if (existingUser) {
        return NextResponse.json({ success: false, error: { message: "Email already registered" } }, { status: 400 });
      }

      const hashedPassword = await hashPassword(validated.password);
      const user = await db.user.create({
        data: {
          name: validated.name,
          email: validated.email,
          phone: validated.phone,
          password: hashedPassword,
          role: "CUSTOMER",
          isVerified: true,
          cart: { create: {} },
          wishlist: { create: {} },
        },
      });

      const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as any,
      };

      await setAuthCookie(sessionUser);
      return NextResponse.json({ success: true, user: sessionUser });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err.message || "Registration failed" } },
      { status: 400 }
    );
  }
}
