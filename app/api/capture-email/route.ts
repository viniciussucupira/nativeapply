import { NextRequest, NextResponse } from "next/server";
import { saveLeadEmail } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (typeof email !== "string") {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const ok = await saveLeadEmail(email);
    if (!ok) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
