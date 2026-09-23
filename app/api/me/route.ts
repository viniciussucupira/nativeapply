import { NextResponse } from "next/server";
import { getProStatus } from "@/lib/pro";

export const dynamic = "force-dynamic";

// Lets the page know whether this browser has an active Pro purchase,
// without ever exposing the email stored in the httpOnly cookie.
export async function GET() {
  try {
    const { pro } = await getProStatus();
    return NextResponse.json({ pro });
  } catch {
    return NextResponse.json({ pro: false });
  }
}
