export interface GenerateDescriptionInput {
  name: string;
  category: string;
  features?: string;
  material?: string;
  targetAudience?: string;
  tone?: "PROFESSIONAL" | "CASUAL" | "PREMIUM" | "PERSUASIVE";
}

export interface GeneratedDescriptionOutput {
  shortDescription: string;
  detailedDescription: string;
  bulletPoints: string[];
  seoTitle: string;
  seoMetaDescription: string;
  keywords: string[];
}

export function generateAIDescription(input: GenerateDescriptionInput): GeneratedDescriptionOutput {
  const { name, category, features = "", material = "", targetAudience = "everyday users", tone = "PREMIUM" } = input;
  
  const featureList = features
    ? features.split(",").map((f) => f.trim()).filter(Boolean)
    : ["High Durability", "Modern Ergonomic Design", "Superior Performance", "Long-lasting Reliability"];

  const tonePrefix =
    tone === "PREMIUM"
      ? "Experience unprecedented elegance and craftsmanship with"
      : tone === "PERSUASIVE"
      ? "Transform your daily routine today with the power of"
      : tone === "CASUAL"
      ? "Meet your new favorite everyday essential:"
      : "Designed for optimal productivity and performance, introducing";

  const shortDescription = `${tonePrefix} ${name}. Engineered specifically for ${targetAudience}, offering ${featureList.join(", ")}.`;

  const detailedDescription = `${name} sets a new standard in the ${category} category. ` +
    `Carefully crafted with ${material ? material : "premium-grade materials"}, it seamlessly combines function and aesthetic. ` +
    `Whether you are looking for ${featureList[0] || "reliability"} or ${featureList[1] || "sleek style"}, ${name} delivers consistent excellence. ` +
    `Designed for ${targetAudience}, this product has been rigorously tested for maximum performance and durability under daily usage.`;

  const bulletPoints = [
    `✨ Premium Quality: Built with ${material ? material : "high-grade materials"} for maximum endurance.`,
    `🚀 Advanced Functionality: Features ${featureList[0] || "cutting-edge technology"} for seamless experience.`,
    `🎯 Ergonomic & Stylish: Perfect fit for ${targetAudience} seeking high utility.`,
    `🛡️ Quality Assurance: Rigorously quality checked for safety and longevity.`,
    `🚚 Fast Shipping & Warranty: Delivered with Nexora express guarantee.`,
  ];

  const seoTitle = `${name} | Buy Premium ${category} Online at NEXORA`;
  const seoMetaDescription = `Shop ${name} online at NEXORA. Features ${featureList.slice(0, 3).join(", ")}. Best price, fast delivery, and verified customer reviews.`;

  const keywords = [
    name.toLowerCase(),
    category.toLowerCase(),
    "buy online",
    "best price",
    ...featureList.map((f) => f.toLowerCase()),
    ...targetAudience.toLowerCase().split(" "),
  ].filter(Boolean);

  return {
    shortDescription,
    detailedDescription,
    bulletPoints,
    seoTitle,
    seoMetaDescription,
    keywords: Array.from(new Set(keywords)),
  };
}
