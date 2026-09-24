// Conservative handoff limit: mail handlers and messaging clients differ.
export const MAX_HANDOFF_URL = 1800;

// A pasted or edited string can contain an unpaired UTF-16 surrogate.
// encodeURIComponent throws on it, which would otherwise crash the result UI.
function encodeText(value: string): string {
  const wellFormed = Array.from(value, character => {
    const code = character.charCodeAt(0);
    return character.length === 1 && code >= 0xd800 && code <= 0xdfff ? "\ufffd" : character;
  }).join("");
  return encodeURIComponent(wellFormed);
}

export function textSharing(text: string, subject: string) {
  if (!text.trim()) return { email: null, whatsapp: null, tooLong: false };
  // RFC 6068 requires CRLF in mailto bodies; reserved characters stay encoded.
  const mailBody = text.replace(/\r\n|\r|\n/g, "\r\n");
  const title = subject.replace(/[\r\n]+/g, " ");
  const email = `mailto:?subject=${encodeText(title)}&body=${encodeText(mailBody)}`;
  const whatsapp = `https://wa.me/?text=${encodeText(text)}`;
  return {
    email: email.length <= MAX_HANDOFF_URL ? email : null,
    whatsapp: whatsapp.length <= MAX_HANDOFF_URL ? whatsapp : null,
    tooLong: email.length > MAX_HANDOFF_URL || whatsapp.length > MAX_HANDOFF_URL,
  };
}
