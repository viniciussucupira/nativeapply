export function recoveryEmailReady(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.RECOVERY_EMAIL_FROM?.trim());
}

export async function sendRecoveryEmail(email: string, url: string): Promise<void> {
  if (!recoveryEmailReady()) throw new Error("Email not configured");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RECOVERY_EMAIL_FROM,
      to: [email],
      reply_to: "support@nimbuslabsai.com",
      subject: "Your link to access NativeApply Pro",
      text: `Open this link to access NativeApply Pro:\n\n${url}\n\nThe link expires in 15 minutes and works once. We will check for an active purchase linked to this email before granting access. This does not start a subscription or charge you.\n\nIf you did not request this email, ignore it. Keep this link private.\n\nNativeApply\nhttps://nativeapply.net`,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Email delivery unavailable");
}
