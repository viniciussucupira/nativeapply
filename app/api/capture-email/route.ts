import { NextResponse } from "next/server";

export async function POST() {
  // Free rewriting no longer collects an email address.
  return NextResponse.json({ error: "endpoint_retired" }, { status: 410, headers: { "Cache-Control": "no-store" } });
}
