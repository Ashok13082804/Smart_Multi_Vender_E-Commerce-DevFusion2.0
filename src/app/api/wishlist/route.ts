import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: true, items: [] });
  }

  let wishlist = await db.wishlist.findUnique({
    where: { userId: session.id },
    include: { items: { include: { product: true } } },
  });

  if (!wishlist) {
    wishlist = await db.wishlist.create({
      data: { userId: session.id },
      include: { items: { include: { product: true } } },
    });
  }

  return NextResponse.json({ success: true, items: wishlist.items });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { message: "Please log in to save items to wishlist" } }, { status: 401 });
  }

  try {
    const { productId } = await req.json();

    let wishlist = await db.wishlist.findUnique({ where: { userId: session.id } });
    if (!wishlist) {
      wishlist = await db.wishlist.create({ data: { userId: session.id } });
    }

    const existing = await db.wishlistItem.findFirst({
      where: { wishlistId: wishlist.id, productId },
    });

    if (existing) {
      await db.wishlistItem.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, isWishlisted: false });
    } else {
      await db.wishlistItem.create({
        data: { wishlistId: wishlist.id, productId },
      });
      return NextResponse.json({ success: true, isWishlisted: true });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 400 });
  }
}
