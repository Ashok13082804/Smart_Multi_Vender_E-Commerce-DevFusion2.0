import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const customerRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const sellerRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  storeName: z.string().min(3, "Store name must be at least 3 characters"),
  description: z.string().min(10, "Store description must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDescription: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  originalPrice: z.coerce.number().positive("Original price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  images: z.array(z.string()).min(1, "At least 1 product image is required"),
  tags: z.string().optional(), // Comma-separated
  isFeatured: z.boolean().default(false),
  isFlashDeal: z.boolean().default(false),
});

export const couponSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters").toUpperCase(),
  discountType: z.enum(["PERCENTAGE", "FLAT", "FREE_SHIPPING"]),
  discountValue: z.coerce.number().positive("Discount value must be positive"),
  maxDiscount: z.coerce.number().optional(),
  minCartValue: z.coerce.number().min(0).default(0),
  usageLimit: z.coerce.number().int().positive().default(100),
  expiresAt: z.string(),
});

export const addressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  type: z.enum(["HOME", "WORK", "OTHER"]).default("HOME"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  country: z.string().default("India"),
  isDefault: z.boolean().default(false),
});

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().min(3, "Title is required"),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});
