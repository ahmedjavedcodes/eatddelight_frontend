import Hero from "@/components/storefront/home/Hero";
import PopularDishes from "@/components/storefront/home/PopularDishes";
import MenuOfDaySpotlight from "@/components/storefront/home/MenuOfDaySpotlight";
import StorySection from "@/components/storefront/home/StorySection";
import ReadyToOrder from "@/components/storefront/home/ReadyToOrder";
import Testimonials from "@/components/storefront/home/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <PopularDishes />
      <MenuOfDaySpotlight />
      <StorySection />
      <ReadyToOrder />
      <Testimonials />
    </>
  );
}
