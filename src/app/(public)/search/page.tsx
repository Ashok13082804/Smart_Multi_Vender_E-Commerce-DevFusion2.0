import Link from "next/link";
import { Search, Sparkles, Filter } from "lucide-react";
import { getProducts } from "@/services/products/productService";
import ProductCard from "@/components/product/ProductCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";

  const productData = await getProducts({
    query: q,
    limit: 16,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <Search className="w-8 h-8 text-indigo-600" /> Search Results for "{q}"
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Found {productData.total} items using natural language marketplace search
        </p>
      </div>

      {productData.parsedNlp && (
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                AI NLP Entity Extraction Applied
              </span>
              <div className="flex flex-wrap gap-2 mt-1 text-[11px]">
                {productData.parsedNlp.category && (
                  <span className="px-2.5 py-0.5 bg-white dark:bg-gray-900 text-indigo-600 font-bold rounded-md shadow-xs">
                    Category: {productData.parsedNlp.category}
                  </span>
                )}
                {productData.parsedNlp.maxPrice && (
                  <span className="px-2.5 py-0.5 bg-white dark:bg-gray-900 text-indigo-600 font-bold rounded-md shadow-xs">
                    Max Price: ₹{productData.parsedNlp.maxPrice}
                  </span>
                )}
                {productData.parsedNlp.color && (
                  <span className="px-2.5 py-0.5 bg-white dark:bg-gray-900 text-indigo-600 font-bold rounded-md shadow-xs">
                    Color: {productData.parsedNlp.color}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {productData.products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productData.products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No products found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try searching with broader terms like "wireless earbuds", "running shoes", or "basmati rice".
          </p>
          <Link href="/products" className="inline-block px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">
            Browse All Products
          </Link>
        </div>
      )}

    </div>
  );
}
