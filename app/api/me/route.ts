import { NextRequest, NextResponse } from "next/server";
import { getProStatus } from "@/lib/pro";
import { freeBrowserSession, FREE_COOKIE } from "@/lib/free-session";
import { PRO_COOKIE_NAME, sessionSecret } from "@/lib/pro-cookie";

export const dynamic = "force-dynamic";

// Lets the page know whether this browser has an active Pro purchase,
// without ever exposing the email stored in the httpOnly cookie.
export async function GET(req: NextRequest) {
  try {
    const { pro, needsRestore = false, signedOut = false } = await getProStatus();
    const response = NextResponse.json({ pro, needsRestore }, { headers: { "Cache-Control": "private, no-store" } });
    // A session ended by "Sign out on all devices" is removed from this browser too.
    if (signedOut) response.cookies.set(PRO_COOKIE_NAME, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
    const browser = freeBrowserSession(req.cookies.get(FREE_COOKIE)?.value, sessionSecret());
    if (browser.fresh) response.cookies.set(FREE_COOKIE, browser.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 365 * 86400 });
    return response;
  } catch {
    return NextResponse.json({ pro: false, unavailable: true }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
  }
}
