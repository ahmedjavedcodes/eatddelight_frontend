/**
 * Business WhatsApp number, in wa.me's international format (no leading
 * "+" or "0"). Cart, favourites, and checkout are intentionally client-
 * side/localStorage-only flows with no backend dependency, so this comes
 * from an env var (with a hardcoded fallback) rather than a backend fetch
 * — WhatsApp handoff must keep working even when the API is unreachable.
 */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "923122252915";
