"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FoodCard from "@/components/storefront/FoodCard";
import type { Food } from "@/lib/api/types";

export default function HorizontalFoodScroll({ foods }: { foods: Food[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    // The prev/next arrows are `hidden` below the `sm` breakpoint (they only
    // render for mouse/trackpad users), so on touch devices there is no UI
    // for this state to drive - tracking scroll position there is pure
    // wasted work on every swipe, exactly where scroll jank is most visible.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    function checkScroll() {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(checkScroll);
    }

    checkScroll();
    const element = scrollRef.current;
    element?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      cancelAnimationFrame(frame);
      element?.removeEventListener("scroll", onScroll);
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
        className="absolute -left-4 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-primary shadow-md ring-1 ring-black/5 hover:bg-tint disabled:cursor-not-allowed disabled:text-muted"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        aria-label="Scroll right"
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className="absolute -right-4 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-primary shadow-md ring-1 ring-black/5 hover:bg-tint disabled:cursor-not-allowed disabled:text-muted"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
