"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FoodCard from "@/components/storefront/FoodCard";
import type { Food } from "@/lib/api/types";

export default function HorizontalFoodScroll({ foods }: { foods: Food[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function checkScroll() {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }

  useEffect(() => {
    checkScroll();
    const element = scrollRef.current;
    element?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      element?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  function scroll(direction: "left" | "right") {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide"
      >
        {foods.map((food) => (
          <div key={food.id} className="w-[42vw] shrink-0 sm:w-56 lg:w-64">
            <FoodCard food={food} />
          </div>
        ))}
      </div>

      <button
        aria-label="Scroll left"
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className="absolute -left-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-primary shadow-md ring-1 ring-black/5 hover:bg-tint disabled:cursor-not-allowed disabled:text-muted sm:flex"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        aria-label="Scroll right"
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className="absolute -right-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-primary shadow-md ring-1 ring-black/5 hover:bg-tint disabled:cursor-not-allowed disabled:text-muted sm:flex"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
