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
      html: `<div style="background:#f7f8fb;padding:32px 16px;font-family:Arial,sans-serif;color:#17243b"><div style="max-width:520px;margin:auto;background:white;border-radius:16px;padding:32px"><p style="font-size:18px;font-weight:bold;color:#2460e8">NativeApply</p><h1 style="font-size:26px">Access your Pro</h1><p style="font-size:16px;line-height:1.6">Use the button below on the device where you want to use NativeApply Pro. No password needed.</p><p style="margin:28px 0"><a href="${url}" style="display:inline-block;background:#2460e8;color:white;padding:15px 24px;border-radius:10px;font-size:16px;font-weight:bold;text-decoration:none">Access my Pro</a></p><p style="line-height:1.6">This link expires in <strong>15 minutes</strong> and works once. We will check your active purchase before granting access. You will not be charged.</p><p style="font-size:14px;color:#5b6576;line-height:1.6">If you did not request this email, you can ignore it. Keep this link private.</p><p style="font-size:13px;color:#5b6576;line-height:1.6">Button not working? Copy this link into your browser:<br><a href="${url}" style="word-break:break-all;color:#2460e8">${url}</a></p></div></div>`,
      text: `Open this link to access NativeApply Pro:\n\n${url}\n\nThe link expires in 15 minutes and works once. We will check for an active purchase linked to this email before granting access. This does not start a subscription or charge you.\n\nIf you did not request this email, ignore it. Keep this link private.\n\nNativeApply\nhttps://nativeapply.net`,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Email delivery unavailable");
}
