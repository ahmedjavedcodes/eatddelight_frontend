import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

// Cart contents are per-browser and ephemeral — not content worth indexing.
export const metadata: Metadata = buildMetadata({
  title: "Your Cart | Daughter's Delight",
  description: "Review the homemade dishes in your cart before checkout.",
  path: "/cart",
  noIndex: true,
});

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
