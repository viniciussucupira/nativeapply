import { NextResponse } from "next/server";
import { getTotalRewrites } from "@/lib/redis";

export const revalidate = 0;

export async function GET() {
  const totalRewrites = await getTotalRewrites();
  return NextResponse.json({ totalRewrites });
}
