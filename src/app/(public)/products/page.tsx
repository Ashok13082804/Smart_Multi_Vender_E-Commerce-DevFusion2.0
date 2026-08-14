import Link from "next/link";
import { SlidersHorizontal, Sparkles, Filter, RefreshCcw } from "lucide-react";
import { db } from "@/lib/db";
import { getProducts } from "@/services/products/productService";
import ProductCard from "@/components/product/ProductCard";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q;
  const category = resolvedParams.category;
  const sort = resolvedParams.sort || "latest";

  let categories: any[] = [];
  let productData = { products: [] as any[], total: 0, page: 1, totalPages: 0, parsedNlp: null as any };

  try {
    const res = await Promise.all([
      db.category.findMany(),
      getProducts({
        query: q,
        categorySlug: category,
        sortBy: sort as any,
        limit: 16,
      }),
    ]);
    categories = res[0];
    productData = res[1];
  } catch (err) {
    console.error("ProductsPage database fetch error:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Marketplace Catalog
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing {productData.total} products available across verified sellers
          </p>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-500">Sort by:</span>
          <Link
            href={`/products?${new URLSearchParams({ ...resolvedParams, sort: sort === "price_asc" ? "price_desc" : "price_asc" }).toString()}`}
            className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:border-indigo-500"
          >
            {sort === "price_asc" ? "Price: Low to High" : sort === "price_desc" ? "Price: High to Low" : "Latest Arrivals"}
          </Link>
        </div>
      </div>

      {/* NLP Search Breakdown Bar if query provided */}
      {productData.parsedNlp && (
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                AI NLP Search Parsed: "{productData.parsedNlp.rawQuery}"
              </span>
              <div className="flex flex-wrap gap-2 mt-1 text-[11px]">
                {productData.parsedNlp.category && (
                  <span className="px-2 py-0.5 bg-white dark:bg-gray-900 text-indigo-600 font-semibold rounded-md shadow-xs">
                    Category: {productData.parsedNlp.category}
                  </span>
                )}
                {productData.parsedNlp.maxPrice && (
                  <span className="px-2 py-0.5 bg-white dark:bg-gray-900 text-indigo-600 font-semibold rounded-md shadow-xs">
                    Max Price: ₹{productData.parsedNlp.maxPrice}
                  </span>
                )}
                {productData.parsedNlp.color && (
                  <span className="px-2 py-0.5 bg-white dark:bg-gray-900 text-indigo-600 font-semibold rounded-md shadow-xs">
                    Color: {productData.parsedNlp.color}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Link href="/products" className="text-xs font-bold text-indigo-600 hover:underline">
            Clear Query
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between font-bold text-sm text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-500" /> Categories
              </span>
              {category && (
                <Link href="/products" className="text-xs text-rose-500 hover:underline">
                  Reset
                </Link>
              )}
            </div>

            <ul className="space-y-1 text-xs">
              <li>
                <Link
                  href="/products"
                  className={`block px-3 py-2 rounded-xl transition-colors font-medium ${
                    !category ? "bg-indigo-600 text-white font-bold" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  All Categories
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/products?category=${c.slug}`}
                    className={`block px-3 py-2 rounded-xl transition-colors font-medium ${
                      category === c.slug ? "bg-indigo-600 text-white font-bold" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid Container */}
        <main className="lg:col-span-9">
          {productData.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {productData.products.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto text-2xl font-bold">
                🔍
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No products found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                We couldn't find any products matching your search criteria. Try adjusting your NLP query or filters.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
              >
                <RefreshCcw className="w-4 h-4" /> Reset Filters
              </Link>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}
