import { db } from "@/lib/db";

export interface InventoryInsight {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  avgDailySales: number;
  forecast7Days: number;
  forecast30Days: number;
  daysUntilStockOut: number | null;
  suggestedReorderQuantity: number;
  status: "CRITICAL" | "LOW" | "HEALTHY" | "OVERSTOCKED";
  aiAlertMessage: string;
}

export async function calculateInventoryInsights(sellerId?: string): Promise<InventoryInsight[]> {
  const products = await db.product.findMany({
    where: sellerId ? { sellerId, isActive: true } : { isActive: true },
    include: {
      orderItems: {
        include: { order: true },
        where: {
          order: {
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
            status: { not: "CANCELLED" },
          },
        },
      },
    },
  });

  return products.map((product) => {
    // Total units sold in last 30 days
    const totalUnitsSold30Days = product.orderItems.reduce((acc, item) => acc + item.quantity, 0);
    const avgDailySales = Number((totalUnitsSold30Days / 30).toFixed(1)) || 0.2; // Fallback velocity

    const forecast7Days = Math.ceil(avgDailySales * 7);
    const forecast30Days = Math.ceil(avgDailySales * 30);

    let daysUntilStockOut: number | null = null;
    if (avgDailySales > 0) {
      daysUntilStockOut = Math.floor(product.stock / avgDailySales);
    }

    let status: InventoryInsight["status"] = "HEALTHY";
    let aiAlertMessage = `Stock levels are healthy. Expected demand of ${forecast7Days} units over the next 7 days.`;
    let suggestedReorderQuantity = 0;

    if (product.stock === 0) {
      status = "CRITICAL";
      suggestedReorderQuantity = Math.max(forecast30Days, 20);
      aiAlertMessage = `⚠️ OUT OF STOCK! High urgency: ${forecast7Days} units projected demand in 7 days. Reorder at least ${suggestedReorderQuantity} units.`;
    } else if (daysUntilStockOut !== null && daysUntilStockOut <= 5) {
      status = "CRITICAL";
      suggestedReorderQuantity = Math.max(forecast30Days - product.stock, 15);
      aiAlertMessage = `🔥 CRITICAL: Stock may run out in ~${daysUntilStockOut} days based on current sales velocity (${avgDailySales} units/day).`;
    } else if (product.stock <= product.lowStockAlert) {
      status = "LOW";
      suggestedReorderQuantity = Math.max(forecast30Days - product.stock, 10);
      aiAlertMessage = `⚠️ LOW STOCK: Current inventory (${product.stock}) is below alert threshold (${product.lowStockAlert}).`;
    } else if (product.stock > forecast30Days * 2 && product.stock > 50) {
      status = "OVERSTOCKED";
      aiAlertMessage = `📦 OVERSTOCKED: Inventory holds over 60 days of supply (${product.stock} units). Consider creating a flash deal or discount.`;
    }

    return {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      currentStock: product.stock,
      avgDailySales,
      forecast7Days,
      forecast30Days,
      daysUntilStockOut,
      suggestedReorderQuantity,
      status,
      aiAlertMessage,
    };
  });
}
