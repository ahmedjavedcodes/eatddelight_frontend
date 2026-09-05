"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FoodCard from "@/components/storefront/FoodCard";
import type { Food } from "@/lib/api/types";

export default function HorizontalFoodScroll({ foods }: { foods: Food[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

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
        className="absolute -left-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-foreground shadow-md ring-1 ring-black/5 hover:bg-tint sm:flex"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        aria-label="Scroll right"
        onClick={() => scroll("right")}
        className="absolute -right-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-foreground shadow-md ring-1 ring-black/5 hover:bg-tint sm:flex"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
