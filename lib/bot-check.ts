import { checkBotId } from "botid/server";

/**
 * Whether the request came from a program rather than a person's browser.
 *
 * Asking for a login link emails whatever address is typed in, and answers
 * the same whether or not that address ever paid (no account enumeration).
 * Since 6 Oct 2026 a program has been typing strangers' addresses into the
 * form, one address per machine, so the limits per machine and per address
 * never applied. Every one of those emails was unasked for and sent in our
 * name.
 *
 * So the form (lib/bot-challenge.ts) answers a challenge from the host as the
 * request is sent, and the host is asked here whether the answer holds
 * (Vercel BotID, at its basic level: nothing to pay per check, nothing shown
 * to the person, no key of ours to keep).
 *
 * The check may only ever refuse a program. If the host does not answer in
 * time, or this is not running on the host at all (a local run, the tests),
 * the request is let through: the limits still bound it, and nobody is locked
 * out because a service of somebody else's was slow.
 */
const ANSWER_WITHIN_MS = 2_500;

export async function isAutomated(): Promise<boolean> {
  if (process.env.VERCEL !== "1") return false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const late = new Promise<null>((resolve) => {
      timer = setTimeout(() => resolve(null), ANSWER_WITHIN_MS);
    });
    const verdict = await Promise.race([checkBotId(), late]);
    if (!verdict) {
      console.error("bot check did not answer in time; the request was let through");
      return false;
    }
    return verdict.isBot === true;
  } catch (error) {
    console.error("bot check failed; the request was let through", error);
    return false;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
