export interface ParsedSearchQuery {
  rawQuery: string;
  category?: string;
  brand?: string;
  color?: string;
  maxPrice?: number;
  minPrice?: number;
  tags: string[];
  intent: "SHOPPING" | "DEALS" | "CATEGORICAL" | "SPECIFIC";
  cleanedKeywords: string;
}

const CATEGORY_MAP: Record<string, string[]> = {
  electronics: ["electronics", "gadget", "gadgets", "tech", "device", "devices"],
  smartphones: ["phone", "phones", "mobile", "mobiles", "smartphone", "smartphones", "cellphone"],
  laptops: ["laptop", "laptops", "notebook", "macbook", "computer", "computers"],
  audio: ["earbuds", "headphones", "earphones", "speaker", "speakers", "audio", "soundbar", "bluetooth"],
  fashion: ["fashion", "clothing", "wear", "clothes", "apparel"],
  footwear: ["shoes", "sneakers", "running shoes", "footwear", "sandals", "boots", "slippers"],
  grocery: ["grocery", "groceries", "food", "rice", "pulses", "oil", "snacks", "spices", "beverages"],
  pets: ["pet", "pets", "dog", "cat", "puppy", "kitten", "pet food", "dog food", "cat food"],
  home: ["home", "kitchen", "furniture", "lamp", "lighting", "decor", "bedding"],
  beauty: ["beauty", "skincare", "haircare", "makeup", "grooming", "perfume"],
  sports: ["sports", "fitness", "gym", "workout", "yoga", "cricket", "running"],
};

const COLOR_LIST = [
  "black", "white", "blue", "red", "green", "yellow", "grey", "gray", "silver", "gold", "pink", "purple", "brown", "navy"
];

const BRAND_LIST = [
  "aerobeat", "urbantrail", "pureharvest", "pawjoy", "novacharge", "lumihome", "terracraft", "flexfit", "apple", "samsung", "sony", "nike", "adidas"
];

export function parseNaturalLanguageQuery(query: string): ParsedSearchQuery {
  const lower = query.toLowerCase().trim();
  let category: string | undefined;
  let brand: string | undefined;
  let color: string | undefined;
  let maxPrice: number | undefined;
  let minPrice: number | undefined;
  const tags: string[] = [];

  // Extract Price Patterns: e.g., "under 3000", "below 2500", "< 1000", "between 500 and 2000"
  const underMatch = lower.match(/(?:under|below|less than|<|cheap)\s*(?:rs\.?|₹)?\s*(\d+)/i);
  if (underMatch) {
    maxPrice = parseInt(underMatch[1], 10);
  }

  const aboveMatch = lower.match(/(?:above|over|more than|>)\s*(?:rs\.?|₹)?\s*(\d+)/i);
  if (aboveMatch) {
    minPrice = parseInt(aboveMatch[1], 10);
  }

  const betweenMatch = lower.match(/(?:between)\s*(?:rs\.?|₹)?\s*(\d+)\s*(?:and|-)\s*(?:rs\.?|₹)?\s*(\d+)/i);
  if (betweenMatch) {
    minPrice = parseInt(betweenMatch[1], 10);
    maxPrice = parseInt(betweenMatch[2], 10);
  }

  // Extract Color
  for (const c of COLOR_LIST) {
    if (new RegExp(`\\b${c}\\b`, "i").test(lower)) {
      color = c;
      tags.push(c);
      break;
    }
  }

  // Extract Brand
  for (const b of BRAND_LIST) {
    if (new RegExp(`\\b${b}\\b`, "i").test(lower)) {
      brand = b;
      tags.push(b);
      break;
    }
  }

  // Extract Category
  for (const [catKey, keywords] of Object.entries(CATEGORY_MAP)) {
    for (const kw of keywords) {
      if (new RegExp(`\\b${kw}\\b`, "i").test(lower)) {
        category = catKey;
        tags.push(kw);
        break;
      }
    }
    if (category) break;
  }

  // Extract Intent
  let intent: ParsedSearchQuery["intent"] = "SHOPPING";
  if (lower.includes("deal") || lower.includes("discount") || lower.includes("offer") || lower.includes("cheap")) {
    intent = "DEALS";
  } else if (category && !brand && !color) {
    intent = "CATEGORICAL";
  } else if (brand || color) {
    intent = "SPECIFIC";
  }

  // Clean keywords for general text matching
  const cleanedKeywords = lower
    .replace(/(?:under|below|less than|above|over|more than|between|cheap|best|deal|rs\.?|₹|\d+)/gi, "")
    .trim();

  return {
    rawQuery: query,
    category,
    brand,
    color,
    maxPrice,
    minPrice,
    tags,
    intent,
    cleanedKeywords: cleanedKeywords || query,
  };
}
