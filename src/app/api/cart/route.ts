import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addToCart, getCart, removeFromCart, updateCartQuantity } from "@/services/cart/cartService";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: true, items: [], subtotal: 0, itemCount: 0 });
  }

  const cart = await getCart(session.id);
  return NextResponse.json({ success: true, ...cart });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { message: "Please log in to add items to cart" } }, { status: 401 });
  }

  try {
    const { productId, quantity = 1, variantId } = await req.json();
    const updatedCart = await addToCart(session.id, productId, quantity, variantId);
    return NextResponse.json({ success: true, ...updatedCart });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
  }

  try {
    const { cartItemId, quantity } = await req.json();
    const updatedCart = await updateCartQuantity(session.id, cartItemId, quantity);
    return NextResponse.json({ success: true, ...updatedCart });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get("id");
    if (!cartItemId) throw new Error("Cart item ID required");

    const updatedCart = await removeFromCart(session.id, cartItemId);
    return NextResponse.json({ success: true, ...updatedCart });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 400 });
  }
}
