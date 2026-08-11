import { db } from "@/lib/db";

export async function getCart(userId: string) {
  // Check if user exists to prevent foreign key violation on stale JWT tokens
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { id: "", userId, items: [], subtotal: 0, itemCount: 0 };
  }

  let cart = await db.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { seller: true },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await db.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: { include: { seller: true } },
          },
        },
      },
    });
  }

  // Calculate totals and stock warnings
  let subtotal = 0;
  const itemsWithWarnings = cart.items.map((item) => {
    const itemTotal = item.product.price * item.quantity;
    subtotal += itemTotal;

    const isOutOfStock = item.product.stock <= 0;
    const isExceedingStock = item.quantity > item.product.stock;

    return {
      ...item,
      itemTotal,
      isOutOfStock,
      isExceedingStock,
    };
  });

  return {
    id: cart.id,
    userId: cart.userId,
    items: itemsWithWarnings,
    subtotal,
    itemCount: cart.items.reduce((acc, item) => acc + item.quantity, 0),
  };
}

export async function addToCart(userId: string, productId: string, quantity: number = 1, variantId?: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User session expired. Please log in again.");

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");
  if (product.stock < quantity) throw new Error(`Only ${product.stock} units available in stock`);

  let cart = await db.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await db.cart.create({ data: { userId } });
  }

  const existingItem = await db.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      variantId: variantId || null,
    },
  });

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    if (newQty > product.stock) throw new Error(`Only ${product.stock} units available in stock`);
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQty },
    });
  } else {
    await db.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        quantity,
      },
    });
  }

  return await getCart(userId);
}

export async function updateCartQuantity(userId: string, cartItemId: string, quantity: number) {
  if (quantity <= 0) {
    return await removeFromCart(userId, cartItemId);
  }

  const cartItem = await db.cartItem.findUnique({
    where: { id: cartItemId },
    include: { product: true },
  });
  if (!cartItem) throw new Error("Cart item not found");
  if (cartItem.product.stock < quantity) throw new Error(`Only ${cartItem.product.stock} units available in stock`);

  await db.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  return await getCart(userId);
}

export async function removeFromCart(userId: string, cartItemId: string) {
  await db.cartItem.delete({ where: { id: cartItemId } });
  return await getCart(userId);
}

export async function clearCart(userId: string) {
  const cart = await db.cart.findUnique({ where: { userId } });
  if (cart) {
    await db.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}
