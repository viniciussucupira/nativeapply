import { NextResponse } from "next/server";
import { getProStatus } from "@/lib/pro";

export const dynamic = "force-dynamic";

// Lets the page know whether this browser has an active Pro purchase,
// without ever exposing the email stored in the httpOnly cookie.
export async function GET() {
  try {
    const { pro, needsRestore = false } = await getProStatus();
    return NextResponse.json({ pro, needsRestore }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ pro: false, unavailable: true }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
  }
}
