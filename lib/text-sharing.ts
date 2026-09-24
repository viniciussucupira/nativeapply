// Conservative handoff limit: mail handlers and messaging clients differ.
export const MAX_HANDOFF_URL = 1800;

export function textSharing(text: string, subject: string) {
  if (!text.trim()) return { email: null, whatsapp: null, tooLong: false };
  // RFC 6068 requires CRLF in mailto bodies; reserved characters stay encoded.
  const mailBody = text.replace(/\r\n|\r|\n/g, "\r\n");
  const title = subject.replace(/[\r\n]+/g, " ");
  const email = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(mailBody)}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(text)}`;
  return {
    email: email.length <= MAX_HANDOFF_URL ? email : null,
    whatsapp: whatsapp.length <= MAX_HANDOFF_URL ? whatsapp : null,
    tooLong: email.length > MAX_HANDOFF_URL || whatsapp.length > MAX_HANDOFF_URL,
  };
}
