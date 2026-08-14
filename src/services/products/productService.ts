import { db } from "@/lib/db";
import { parseNaturalLanguageQuery } from "@/ai/nlp/searchUnderstandingService";

export interface GetProductsParams {
  categorySlug?: string;
  brandSlug?: string;
  sellerSlug?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  sortBy?: "relevance" | "price_asc" | "price_desc" | "rating" | "latest" | "popular";
  page?: number;
  limit?: number;
}

export async function getProducts(params: GetProductsParams) {
  const {
    categorySlug,
    brandSlug,
    sellerSlug,
    query,
    minPrice,
    maxPrice,
    rating,
    isFeatured,
    isFlashDeal,
    sortBy = "latest",
    page = 1,
    limit = 12,
  } = params;

  try {
    const where: any = { isActive: true };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }
    if (brandSlug) {
      where.brand = { slug: brandSlug };
    }
    if (sellerSlug) {
      where.seller = { slug: sellerSlug };
    }
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }
    if (isFlashDeal !== undefined) {
      where.isFlashDeal = isFlashDeal;
    }
    if (rating) {
      where.rating = { gte: rating };
    }

    let parsedNlp = null;
    if (query && query.trim()) {
      parsedNlp = parseNaturalLanguageQuery(query);

      // Apply NLP extracted filters if user hasn't explicitly set them
      if (parsedNlp.category && !categorySlug) {
        where.category = { slug: parsedNlp.category };
      }
      if (parsedNlp.brand && !brandSlug) {
        where.brand = { slug: parsedNlp.brand };
      }
      if (parsedNlp.maxPrice && !maxPrice) {
        where.price = { ...(where.price || {}), lte: parsedNlp.maxPrice };
      }
      if (parsedNlp.minPrice && !minPrice) {
        where.price = { ...(where.price || {}), gte: parsedNlp.minPrice };
      }

      if (parsedNlp.cleanedKeywords) {
        where.OR = [
          { name: { contains: parsedNlp.cleanedKeywords } },
          { description: { contains: parsedNlp.cleanedKeywords } },
          { tags: { contains: parsedNlp.cleanedKeywords } },
        ];
      }
    }

    if (minPrice || maxPrice) {
      where.price = {
        ...(where.price || {}),
        ...(minPrice ? { gte: minPrice } : {}),
        ...(maxPrice ? { lte: maxPrice } : {}),
      };
    }

    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "price_asc") orderBy = { price: "asc" };
    if (sortBy === "price_desc") orderBy = { price: "desc" };
    if (sortBy === "rating") orderBy = { rating: "desc" };
    if (sortBy === "popular") orderBy = { soldCount: "desc" };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          brand: true,
          seller: true,
        },
      }),
      db.product.count({ where }),
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      parsedNlp,
    };
  } catch (error) {
    console.error("Error in getProducts service:", error);
    return {
      products: [],
      total: 0,
      page: 1,
      totalPages: 0,
      parsedNlp: null,
    };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        seller: true,
        variants: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
            reply: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return product;
  } catch (error) {
    console.error(`Error in getProductBySlug(${slug}):`, error);
    return null;
  }
}
