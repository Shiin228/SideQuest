import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, homeFor, verifySession } from "@/lib/session-token";

const AUTH_PAGES = ["/login", "/register"];
const CLIENT_PAGES = ["/client"];
const FREELANCER_PAGES = ["/freelancer"];

function matches(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/") {
    return NextResponse.redirect(new URL(session ? homeFor(session.role) : "/login", request.url));
  }

  if (matches(pathname, AUTH_PAGES)) {
    return session ? NextResponse.redirect(new URL(homeFor(session.role), request.url)) : NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session.role !== "client" && matches(pathname, CLIENT_PAGES)) {
    return NextResponse.redirect(new URL(homeFor(session.role), request.url));
  }
  if (session.role !== "freelancer" && matches(pathname, FREELANCER_PAGES)) {
    return NextResponse.redirect(new URL(homeFor(session.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register/:path*", "/client/:path*", "/freelancer/:path*", "/profile", "/calendar"],
};
