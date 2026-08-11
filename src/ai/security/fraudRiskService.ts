export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface FraudEvaluationInput {
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  userPastOrderCount: number;
  addressMismatch?: boolean;
}

export function evaluateOrderFraudRisk(input: FraudEvaluationInput): {
  riskLevel: RiskLevel;
  riskScore: number;
  reasons: string[];
} {
  let score = 0;
  const reasons: string[] = [];

  // High total amount for first-time customer
  if (input.userPastOrderCount === 0 && input.totalAmount > 20000) {
    score += 35;
    reasons.push("First order value exceeds ₹20,000 threshold");
  }

  // Suspiciously high coupon discount ratio (>50% discount)
  if (input.subtotal > 0 && input.discountAmount / input.subtotal > 0.5) {
    score += 25;
    reasons.push("Discount ratio exceeds 50% of subtotal");
  }

  // Address mismatch signal
  if (input.addressMismatch) {
    score += 30;
    reasons.push("Shipping & billing city mismatch detected");
  }

  // Cash on delivery for high amount
  if (input.paymentMethod === "CASH_ON_DELIVERY" && input.totalAmount > 10000) {
    score += 20;
    reasons.push("COD requested for order value over ₹10,000");
  }

  let riskLevel: RiskLevel = "LOW";
  if (score >= 60) {
    riskLevel = "HIGH";
  } else if (score >= 30) {
    riskLevel = "MEDIUM";
  }

  return {
    riskLevel,
    riskScore: Number((score / 100).toFixed(2)),
    reasons,
  };
}
