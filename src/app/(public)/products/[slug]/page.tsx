import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Truck, Store, Heart, ShoppingCart, CheckCircle, Sparkles } from "lucide-react";
import { getProductBySlug } from "@/services/products/productService";
import { formatCurrency, calculateDiscountPercentage } from "@/lib/utils";
import ProductCard from "@/components/product/ProductCard";
import ProductActions from "@/components/product/ProductActions";
import { db } from "@/lib/db";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
  } catch {
    images = ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"];
  }

  const primaryImage = images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";
  const discountPct = calculateDiscountPercentage(product.originalPrice, product.price);

  // Fetch similar products in same category
  let similarProducts: any[] = [];
  try {
    similarProducts = await db.product.findMany({
      where: { categoryId: product.categoryId, id: { not: product.id } },
      take: 4,
      include: { category: true, seller: true },
    });
  } catch (err) {
    console.error("ProductDetailPage DB fetch error:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Product Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden shrink-0 cursor-pointer"
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
              <span>{product.category.name}</span>
              {product.brand && <span>• {product.brand.name}</span>}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({product.reviewCount} reviews)</span>
              </div>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                {product.soldCount} Sold
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-gray-900 dark:text-white">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-gray-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">Inclusive of all taxes (18% GST)</p>
            </div>

            {discountPct > 0 && (
              <span className="px-3 py-1 bg-rose-500 text-white font-bold text-xs rounded-xl shadow-sm">
                Save {discountPct}%
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Stock Indicator */}
          <div className="flex items-center gap-2 text-xs">
            {product.stock > 0 ? (
              <span className="flex items-center gap-1 font-bold text-emerald-600">
                <CheckCircle className="w-4 h-4" /> In Stock ({product.stock} units available)
              </span>
            ) : (
              <span className="font-bold text-rose-500">Out of Stock</span>
            )}
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <ProductActions productId={product.id} stock={product.stock} />

          {/* Seller Box */}
          <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center">
                {product.seller.storeName.substring(0, 2)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">{product.seller.storeName}</h4>
                <p className="text-[11px] text-gray-400">Verified Marketplace Merchant</p>
              </div>
            </div>

            <Link
              href={`/products?seller=${product.seller.slug}`}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" /> Visit Store
            </Link>
          </div>

        </div>
      </div>

      {/* Detailed Specifications */}
      <section className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-6">
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
          Product Details & Description
        </h2>
        <div className="prose dark:prose-invert max-w-none text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {product.description}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            Verified Customer Reviews ({product.reviews.length})
          </h2>
        </div>

        {product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center uppercase">
                      {rev.user.name.substring(0, 2)}
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{rev.user.name}</span>
                    {rev.isVerified && (
                      <span className="px-2 py-0.5 text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold rounded-md">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">{rev.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs text-gray-400">
            No reviews yet. Be the first verified customer to write a review!
          </div>
        )}
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            Similar Products You Might Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
