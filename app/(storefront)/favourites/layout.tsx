import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

// Favourites are per-browser localStorage state — not content worth indexing.
export const metadata: Metadata = buildMetadata({
  title: "Your Favourites | Daughter's Delight",
  description: "Your saved homemade dishes from Daughter's Delight.",
  path: "/favourites",
  noIndex: true,
});

export default function FavouritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
