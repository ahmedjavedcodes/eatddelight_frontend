import type { Metadata } from "next";
import Hero from "@/components/storefront/home/Hero";
import MenuShowcase from "@/components/storefront/home/MenuShowcase";
import WeeklyMenuShowcase from "@/components/storefront/home/WeeklyMenuShowcase";
import StorySection from "@/components/storefront/home/StorySection";
import ReadyToOrder from "@/components/storefront/home/ReadyToOrder";
import PakistaniReviews from "@/components/storefront/home/PakistaniReviews";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Daughter's Delight | Homemade Food Delivery Karachi",
  description:
    "Order fresh, homemade meals in Karachi from Daughter's Delight. Daily specials and a full à la carte menu, cooked to order and ready when you need it.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <MenuShowcase />
      <div className="border-t border-black/5"></div>
      <WeeklyMenuShowcase />
      <StorySection />
      <ReadyToOrder />
      <PakistaniReviews />
    </>
  );
}
