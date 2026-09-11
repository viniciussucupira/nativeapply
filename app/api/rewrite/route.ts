import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CONTEXT_TYPES, FREE_LIMIT_MESSAGE, FREE_LIMIT_PER_DAY } from "@/lib/constants";
import { incrementDailyUsage, incrementTotalRewrites } from "@/lib/redis";
import { getProStatus } from "@/lib/pro";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  let body: { text?: string; context?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body", message: "Malformed request." }, { status: 400 });
  }

  const text = body.text?.trim();
  const contextValue = body.context;
  const contextDef = CONTEXT_TYPES.find((c) => c.value === contextValue) ?? CONTEXT_TYPES[0];

  if (!text) {
    return NextResponse.json({ error: "empty_text", message: "Paste some text first." }, { status: 400 });
  }
  if (text.length > 6000) {
    return NextResponse.json(
      { error: "too_long", message: "Please paste under 6000 characters at a time." },
      { status: 400 }
    );
  }

  const { pro } = await getProStatus();

  if (!pro) {
    const ip = getClientIp(req);
    const usage = await incrementDailyUsage(ip);
    if (usage > FREE_LIMIT_PER_DAY) {
      return NextResponse.json({ error: "limit_reached", message: FREE_LIMIT_MESSAGE }, { status: 429 });
    }
  }

  const systemPrompt = `You help non-native English speakers sound like native, fluent professionals when applying for jobs in the US, UK, Canada, and Europe.

${contextDef.instruction}

Rules:
- Fix grammar, word choice, and phrasing so it reads as if written by a native English-speaking professional.
- Preserve the original meaning, facts, numbers, and achievements exactly. Never invent or exaggerate anything.
- Do not make it overly formal or stiff — match natural, contemporary professional English.
- Before finalizing, mentally proofread every sentence for subject-verb agreement (e.g., a singular subject like "experience" or "background" needs a singular verb: "experience that aligns," not "experience that align") and correct article usage.
- Output ONLY the rewritten text. No preamble, no explanation, no quotation marks around it.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      temperature: 0,
      system: systemPrompt,
      messages: [{ role: "user", content: text }],
    });

    const rewritten = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    let totalRewrites; try { totalRewrites = await incrementTotalRewrites(); } catch (error) { console.error("Failed to increment total rewrites:", error); } return NextResponse.json({ rewritten, totalRewrites });
  } catch (err) {
    console.error("rewrite error", err);
    return NextResponse.json(
      { error: "server_error", message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
