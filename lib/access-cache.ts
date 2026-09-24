export type ProStatus = { pro: boolean; needsRestore: boolean; unavailable?: boolean };

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
