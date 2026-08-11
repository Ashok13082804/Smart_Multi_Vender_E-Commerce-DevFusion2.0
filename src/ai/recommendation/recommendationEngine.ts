import { db } from "@/lib/db";

export interface RecommendedProductScore {
  productId: string;
  score: number;
  reason: string;
}

export async function generateRecommendationsForUser(
  userId: string,
  limit: number = 8
) {
  // Get user history
  const [recentlyViewed, cartItems, wishlistItems, pastOrders] = await Promise.all([
    db.recentlyViewed.findMany({
      where: { userId },
      include: { product: true },
      take: 10,
      orderBy: { viewedAt: "desc" },
    }),
    db.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    }),
    db.wishlist.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    }),
    db.order.findMany({
      where: { customerId: userId },
      include: { items: { include: { product: true } } },
      take: 5,
    }),
  ]);

  // Extract user preferences (categories, brands, price range)
  const categoryCount: Record<string, number> = {};
  const brandCount: Record<string, number> = {};
  let totalPrices = 0;
  let priceCount = 0;

  const trackProductInterest = (product: { categoryId: string; brandId?: string | null; price: number }, weight: number) => {
    categoryCount[product.categoryId] = (categoryCount[product.categoryId] || 0) + weight;
    if (product.brandId) {
      brandCount[product.brandId] = (brandCount[product.brandId] || 0) + weight;
    }
    totalPrices += product.price * weight;
    priceCount += weight;
  };

  recentlyViewed.forEach((rv) => trackProductInterest(rv.product, 2));
  wishlistItems?.items.forEach((item) => trackProductInterest(item.product, 3));
  cartItems?.items.forEach((item) => trackProductInterest(item.product, 4));
  pastOrders.forEach((ord) => ord.items.forEach((item) => trackProductInterest(item.product, 5)));

  const preferredAvgPrice = priceCount > 0 ? totalPrices / priceCount : 2000;

  // Get candidate products
  const allProducts = await db.product.findMany({
    where: { isActive: true, stock: { gt: 0 } },
    include: { category: true, brand: true, seller: true },
  });

  const excludeIds = new Set([
    ...recentlyViewed.map((rv) => rv.productId),
    ...(cartItems?.items.map((ci) => ci.productId) || []),
  ]);

  const scoredProducts: RecommendedProductScore[] = allProducts
    .filter((p) => !excludeIds.has(p.id))
    .map((product) => {
      // 1. Content & Category Score (35%)
      const catWeight = categoryCount[product.categoryId] || 0;
      const brandWeight = product.brandId ? brandCount[product.brandId] || 0 : 0;
      const contentScore = Math.min((catWeight * 0.7 + brandWeight * 0.3) / 10, 1.0);

      // 2. Behavior / Price Match Score (30%)
      const priceDiff = Math.abs(product.price - preferredAvgPrice);
      const priceRatio = 1 - Math.min(priceDiff / preferredAvgPrice, 1.0);
      const behaviorScore = priceRatio;

      // 3. Popularity Score (20%)
      const popularityScore = Math.min(product.soldCount / 50, 1.0);

      // 4. Rating Score (10%)
      const ratingScore = product.rating / 5;

      // 5. Freshness Score (5%)
      const ageInDays = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      const freshnessScore = Math.max(0, 1 - ageInDays / 30);

      const totalScore =
        0.35 * contentScore +
        0.30 * behaviorScore +
        0.20 * popularityScore +
        0.10 * ratingScore +
        0.05 * freshnessScore;

      let reason = "Popular in marketplace";
      if (catWeight > 0) {
        reason = `Based on your interest in ${product.category.name}`;
      } else if (brandWeight > 0 && product.brand) {
        reason = `Matches your preference for ${product.brand.name}`;
      } else if (product.isFlashDeal) {
        reason = "Trending Flash Deal choice";
      }

      return {
        productId: product.id,
        score: totalScore,
        reason,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  // Fetch full product objects in ranked order
  const recommendedProductIds = scoredProducts.map((sp) => sp.productId);
  const products = await db.product.findMany({
    where: { id: { in: recommendedProductIds } },
    include: { category: true, brand: true, seller: true },
  });

  return scoredProducts.map((sp) => ({
    ...sp,
    product: products.find((p) => p.id === sp.productId)!,
  }));
}
