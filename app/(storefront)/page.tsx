import type { Metadata } from "next";
import HomeHero from "@/components/storefront/home/HomeHero";
import HomeMenuShowcase from "@/components/storefront/home/HomeMenuShowcase";
import HomeWeeklyMenuShowcase from "@/components/storefront/home/HomeWeeklyMenuShowcase";
import HomeStorySection from "@/components/storefront/home/HomeStorySection";
import HomeReadyToOrder from "@/components/storefront/home/HomeReadyToOrder";
import PakistaniReviews from "@/components/storefront/home/PakistaniReviews";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Daughter's Delight | Homemade Food Delivery Karachi",
  description:
    "Order fresh, homemade meals in Karachi from Daughter's Delight. Daily specials and a full à la carte menu, cooked to order and ready when you need it.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeMenuShowcase />
      <div className="border-t border-black/5"></div>
      <HomeWeeklyMenuShowcase />
      <HomeStorySection />
      <HomeReadyToOrder />
      <PakistaniReviews />
    </>
  );
}
