import { PrismaClient } from "@prisma/client";
import path from "path";

// Ensure DATABASE_URL is configured for SQLite and points to absolute path on serverless platforms (Netlify / Vercel)
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("postgresql:")) {
  const dbPath = path.join(process.cwd(), "prisma", "dev.db");
  process.env.DATABASE_URL = `file:${dbPath}`;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
