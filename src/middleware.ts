import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, decodeProtectedHeader } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const path = req.nextUrl.pathname;

  console.log("Middleware running for:", path);
  // console.log("JWT_SECRET:", process.env.JWT_SECRET);


  // ถ้าไม่มี token
  if (!token) {
    if (path.startsWith("/api")) {
      return NextResponse.json(
        { success: false, message: "missing token" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    // verify และ decode JWT
    const { payload } = await jwtVerify(token, SECRET);
    // console.log("Decoded payload:", payload);

    const role = payload.role as string | undefined;
    console.log("Decoded role:", role);

    // ป้องกัน path ตาม role
    if (role === "admin" && (path.startsWith("/tenants") || path.startsWith("/landlords") || path.startsWith("/role"))) {
      return NextResponse.redirect(new URL("/admin/reports", req.url));
    }

    if (role === "user" && path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/role", req.url));
    }

    // ถ้า role ถูกต้องและ path ok → ผ่านได้
    return NextResponse.next();

  } catch (err) {
    console.error("JWT verification failed:", err);

    // try to decode header for debugging (non-sensitive)
    try {
      const header = await decodeProtectedHeader(token as string);
      console.warn("JWT header:", header);
    } catch (e) {
      // ignore
    }

    // If signature verification failed, clear the cookie to force re-login
    const isSigFail = (err as any)?.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED" || (err as any)?.name === "JWSSignatureVerificationFailed";
    if (isSigFail) {
      const res = NextResponse.redirect(new URL("/", req.url));
      try {
        res.cookies.set("auth_token", "", { path: "/", maxAge: 0 });
      } catch (cookieErr) {
        console.warn("Unable to clear auth_token cookie from middleware:", cookieErr);
      }
      return res;
    }

    // token ไม่ valid หรือ expired
    if (path.startsWith("/api")) {
      return NextResponse.json({ success: false, message: "invalid or expired token" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }
}

// Middleware นี้ใช้กับหน้าและ API ที่ต้องการป้องกัน
export const config = {
  matcher: ["/admin/:path*", "/tenants/:path*", "/landlords/:path*", "/role/:path*", "/api/:path*"],
};
