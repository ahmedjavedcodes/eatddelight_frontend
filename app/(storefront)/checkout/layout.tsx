import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

// User-state checkout flow — not content worth indexing.
export const metadata: Metadata = buildMetadata({
  title: "Checkout | Daughter's Delight",
  description: "Review your order and complete checkout with Daughter's Delight.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
