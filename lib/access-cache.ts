export type ProStatus = { pro: boolean; needsRestore: boolean; unavailable?: boolean };

export function parseProStatus(value: unknown): ProStatus {
  if (!value || typeof value !== "object") throw new Error("Invalid access response");
  const data = value as Record<string, unknown>;
  if (typeof data.pro !== "boolean" ||
      (data.needsRestore !== undefined && typeof data.needsRestore !== "boolean") ||
      (data.unavailable !== undefined && typeof data.unavailable !== "boolean") ||
      (data.pro && (data.needsRestore === true || data.unavailable === true))) {
    throw new Error("Invalid access response");
  }
  return { pro: data.pro, needsRestore: data.needsRestore === true, unavailable: data.unavailable === true };
}

export function createAccessCache(load: () => Promise<ProStatus>, now = Date.now) {
  let current: Promise<ProStatus> | null = null;
  let expires = 0;
  return {
    invalidate() { current = null; expires = 0; },
    get(): Promise<ProStatus> {
      if (!current || now() >= expires) {
        expires = Infinity; // Share an in-flight request between consumers.
        const pending = load().catch(() => ({ pro: false, needsRestore: false, unavailable: true })).then(value => {
          if (current === pending) expires = now() + (value.unavailable ? 3000 : 30000);
          return value;
        });
        current = pending;
      }
      return current;
    },
  };
}
