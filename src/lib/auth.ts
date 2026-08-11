import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "./db";
export type Role = "CUSTOMER" | "SELLER" | "DELIVERY_PARTNER" | "ADMIN";

const JWT_SECRET = process.env.JWT_SECRET || "nexora_super_secret_jwt_key_2026";
const TOKEN_NAME = "nexora_token";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  sellerId?: string;
  storeName?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function createToken(payload: SessionUser): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    if (!token) return null;
    const decoded = verifyToken(token);
    if (!decoded) return null;

    // Verify user exists in database
    const user = await db.user.findUnique({
      where: { id: decoded.id },
      include: { seller: true },
    });
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any,
      sellerId: user.seller?.id,
      storeName: user.seller?.storeName,
    };
  } catch {
    return null;
  }
}

export async function setAuthCookie(user: SessionUser) {
  const token = createToken(user);
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  
  const user = await db.user.findUnique({
    where: { id: session.id },
    include: {
      seller: true,
    },
  });

  return user;
}
