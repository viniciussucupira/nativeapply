import { redirect } from "next/navigation";

// Logging in lives at /login. Older links and bookmarks, including receipt
// links carrying ?txn=, still arrive here and are sent on.
export default async function RestorePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { txn } = await searchParams;
  redirect(typeof txn === "string" && txn ? `/login?txn=${encodeURIComponent(txn)}` : "/login");
}
