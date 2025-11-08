// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { adminAuth } from "./src/app/lib/firebaseAdmin"; // << relative from project root

async function getRole(req: NextRequest): Promise<"student"|"instructor"|null> {
  const cookie = req.cookies.get("fb_session")?.value;
  if (!cookie) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(cookie, true);
    return (decoded as any).role ?? null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // allow assets + session endpoint
  if (path.startsWith("/_next") || path.startsWith("/api/session")) return NextResponse.next();

  const role = await getRole(req);
  const hasSession = !!role;

  // prevent logged-in users seeing /login
  if (path === "/login" && hasSession) {
    url.pathname = role === "instructor" ? "/instructor" : "/student";
    return NextResponse.redirect(url);
  }

  // instructor only
  if (path.startsWith("/instructor")) {
    if (role !== "instructor") {
      const dest = new URL("/login", req.url);
      dest.searchParams.set("next", path);
      return NextResponse.redirect(dest);
    }
  }

  // student requires session
  if (path.startsWith("/student")) {
    if (!hasSession) {
      const dest = new URL("/login", req.url);
      dest.searchParams.set("next", path);
      return NextResponse.redirect(dest);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/instructor/:path*", "/student/:path*"],
};
