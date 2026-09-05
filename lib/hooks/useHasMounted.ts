import { useEffect, useState } from "react";

/**
 * True only after the client has mounted. Use to gate rendering of
 * localStorage-persisted state (Zustand `persist`) so the first client
 * render matches the server-rendered HTML exactly, avoiding hydration
 * mismatches.
 */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Canonical hydration-safe "mounted" flag: this *is* the sync with the
    // external "are we on the client yet" fact, not incidental state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  return mounted;
}
