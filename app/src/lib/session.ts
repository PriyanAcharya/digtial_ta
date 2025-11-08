import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";

export type Session = { name: string; role: "student" | "instructor"; iat: number; exp: number };

export function getSession(): Session | null {
  const token = cookies().get("session")?.value;
  if (!token) return null;
  try {
    return verifyJWT(token, process.env.APP_SECRET || "dev");
  } catch {
    return null;
  }
}
