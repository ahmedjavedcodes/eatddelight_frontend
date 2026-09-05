import Hero from "@/components/storefront/home/Hero";
import MenuShowcase from "@/components/storefront/home/MenuShowcase";
import WeeklyMenuShowcase from "@/components/storefront/home/WeeklyMenuShowcase";
import StorySection from "@/components/storefront/home/StorySection";
import ReadyToOrder from "@/components/storefront/home/ReadyToOrder";
import PakistaniReviews from "@/components/storefront/home/PakistaniReviews";

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
