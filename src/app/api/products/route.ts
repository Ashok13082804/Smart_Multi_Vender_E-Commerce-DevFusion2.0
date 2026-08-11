import { NextResponse } from "next/server";
import { getProducts } from "@/services/products/productService";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { productSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category") || undefined;
    const brandSlug = searchParams.get("brand") || undefined;
    const sellerSlug = searchParams.get("seller") || undefined;
    const query = searchParams.get("q") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const rating = searchParams.get("rating") ? Number(searchParams.get("rating")) : undefined;
    const isFeatured = searchParams.get("featured") === "true" ? true : undefined;
    const isFlashDeal = searchParams.get("flash") === "true" ? true : undefined;
    const sortBy = (searchParams.get("sort") as any) || "latest";
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

    const result = await getProducts({
      categorySlug,
      brandSlug,
      sellerSlug,
      query,
      minPrice,
      maxPrice,
      rating,
      isFeatured,
      isFlashDeal,
      sortBy,
      page,
      limit: 12,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err.message || "Failed to fetch products" } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
      return NextResponse.json({ success: false, error: { message: "Unauthorized seller access" } }, { status: 403 });
    }

    const seller = await db.seller.findUnique({ where: { userId: session.id } });
    if (!seller) {
      return NextResponse.json({ success: false, error: { message: "Seller store profile not found" } }, { status: 400 });
    }

    const body = await req.json();
    const validated = productSchema.parse(body);
    const slug = slugify(validated.name) + "-" + Math.floor(1000 + Math.random() * 9000);

    const tagsArray = validated.tags
      ? validated.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
      : [];

    const product = await db.product.create({
      data: {
        name: validated.name,
        slug,
        description: validated.description,
        shortDescription: validated.shortDescription,
        categoryId: validated.categoryId,
        brandId: validated.brandId || null,
        sellerId: seller.id,
        sku: validated.sku,
        price: validated.price,
        originalPrice: validated.originalPrice,
        stock: validated.stock,
        isFeatured: validated.isFeatured,
        isFlashDeal: validated.isFlashDeal,
        images: JSON.stringify(validated.images),
        tags: JSON.stringify(tagsArray),
      },
    });

    // Create default variant
    await db.productVariant.create({
      data: {
        productId: product.id,
        sku: `${product.sku}-DEFAULT`,
        name: "Standard",
        price: product.price,
        originalPrice: product.originalPrice,
        stock: product.stock,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err.message || "Product creation failed" } },
      { status: 400 }
    );
  }
}
