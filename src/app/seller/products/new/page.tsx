"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Plus, Check, ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    originalPrice: "",
    stock: "",
    sku: "",
    description: "",
    shortDescription: "",
    features: "",
    material: "",
    targetAudience: "",
    images: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    tags: "",
  });

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(() => {
        // Dummy categories list for form selector
        setCategories([
          { id: "cat_elec", name: "Electronics" },
          { id: "cat_aud", name: "Audio & Earbuds" },
          { id: "cat_fash", name: "Fashion" },
          { id: "cat_foot", name: "Footwear" },
          { id: "cat_groc", name: "Grocery" },
          { id: "cat_home", name: "Home & Kitchen" },
        ]);
      });
  }, []);

  const handleGenerateAI = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a Product Name first to generate copy with AI.");
      return;
    }

    setAiGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          category: formData.categoryId || "General",
          features: formData.features,
          material: formData.material,
          targetAudience: formData.targetAudience,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          shortDescription: data.result.shortDescription,
          description: data.result.detailedDescription + "\n\nKey Highlights:\n" + data.result.bulletPoints.join("\n"),
          tags: data.result.keywords.join(", "),
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          originalPrice: Number(formData.originalPrice || formData.price),
          stock: Number(formData.stock),
          images: [formData.images],
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/seller");
      } else {
        alert(data.error?.message || "Failed to create product");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Add New Product to Catalog
          </h1>
          <p className="text-xs text-gray-500 mt-1">Use NEXORA AI Generator to create description & SEO keywords instantly</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Details */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">1. Basic Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Product Title</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. AeroBeat Pro ANC Earbuds"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">SKU Code</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. AB-PRO-001"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Selling Price (₹)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="2499"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Original MRP (₹)</label>
              <input
                type="number"
                required
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="4999"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Stock Units</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="50"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* AI Copy Generator Block */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-6 rounded-3xl border border-indigo-500/30 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-black">AI Copywriter & SEO Generator</h3>
            </div>
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={aiGenerating}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {aiGenerating ? "Generating Copy..." : <><Sparkles className="w-4 h-4" /> Generate with AI</>}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1">Key Features (comma-separated)</label>
              <input
                type="text"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="35dB ANC, 30H Battery, IPX5"
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1">Material</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="Titanium, Memory Foam"
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1">Target Audience</label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="Audiophiles, Gamers"
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Descriptions & Tags */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">2. Descriptions & Media</h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Short Summary</label>
            <input
              type="text"
              required
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief summary of product features"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Full Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed specifications and features..."
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Primary Image URL</label>
            <input
              type="url"
              required
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        >
          {loading ? "Creating Product..." : <><Plus className="w-5 h-5" /> Publish Product to Catalog</>}
        </button>

      </form>
    </div>
  );
}
