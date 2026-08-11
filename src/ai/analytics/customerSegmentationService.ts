import { db } from "@/lib/db";
export type CustomerSegment = "NEW" | "RETURNING" | "LOYAL" | "HIGH_VALUE" | "AT_RISK" | "INACTIVE" | "DEAL_SEEKER";

export async function updateCustomerSegmentations() {
  const users = await db.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: {
        where: { status: { not: "CANCELLED" } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const now = Date.now();

  for (const user of users) {
    const orderCount = user.orders.length;
    const totalSpent = user.orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const lastOrderDate = user.orders[0]?.createdAt ? new Date(user.orders[0].createdAt).getTime() : 0;
    const daysSinceLastOrder = lastOrderDate ? (now - lastOrderDate) / (1000 * 60 * 60 * 24) : 999;

    let segment: CustomerSegment = "NEW";

    if (orderCount === 0) {
      segment = "NEW";
    } else if (totalSpent >= 25000 || orderCount >= 10) {
      segment = "HIGH_VALUE";
    } else if (orderCount >= 5 && daysSinceLastOrder <= 30) {
      segment = "LOYAL";
    } else if (daysSinceLastOrder > 60 && daysSinceLastOrder <= 120 && orderCount >= 2) {
      segment = "AT_RISK";
    } else if (daysSinceLastOrder > 120) {
      segment = "INACTIVE";
    } else if (user.orders.some((o) => o.discountAmount > 0)) {
      segment = "DEAL_SEEKER";
    } else if (orderCount >= 2) {
      segment = "RETURNING";
    }

    await db.user.update({
      where: { id: user.id },
      data: { segment },
    });
  }
}
