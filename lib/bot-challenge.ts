import { initBotId } from "botid/client/core";

/**
 * The challenge the login form answers (lib/bot-check.ts).
 *
 * It wraps fetch so that the one request that emails an address typed in a
 * form carries the host's challenge, and loads the challenge only when it is
 * made. The browser's own fetch is kept from before, so that if the
 * challenge cannot load the request still goes out and the server says what
 * happened, rather than the form failing with no reason given.
 */
const PROTECTED = [{ path: "/api/recovery/request", method: "POST" }];

let plainFetch: typeof fetch | null = null;

export function startChallenge(): void {
  if (plainFetch || process.env.NODE_ENV !== "production") return;
  plainFetch = window.fetch.bind(window);
  initBotId({ protect: PROTECTED });
}

export async function checkedFetch(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    if (!plainFetch) throw error;
    return plainFetch(url, init);
  }
}
