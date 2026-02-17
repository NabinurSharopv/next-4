
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const role = request.cookies.get("role")?.value;
    const pathname = request.nextUrl.pathname;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (
        pathname.startsWith("/manager") &&
        role !== "manager" &&
        role !== "developer"
    ) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (
        pathname.startsWith("/admin") &&
        role !== "admin" &&
        role !== "developer"
    ) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/about",
        "/contact",
        "/manager/:path*",
        "/admin/:path*",
        "/developer/:path*",
    ],
};