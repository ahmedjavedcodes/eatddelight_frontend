"use client";

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";

const POINTS = [
  {
    title: "Fresh Ingredients",
    detail: "Sourced daily and prepped the same day your order is cooked.",
  },
  {
    title: "Cooked To Order",
    detail: "Nothing sits pre-made. Every dish is prepared after you order.",
  },
  {
    title: "Home-Style Recipes",
    detail: "Family recipes, not a restaurant menu copied from elsewhere.",
  },
  {
    title: "Hygienic Kitchen",
    detail: "Prepared in a clean, careful home kitchen from start to finish.",
  },
  {
    title: "Personal Touch",
    detail: "Every order is handled with care and attention to quality.",
  },
];

export default function StorySection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <RevealOnScroll>
          <span className="text-sm font-bold uppercase tracking-wide text-primary">
            Our Kitchen
          </span>
          <h2 className="mt-2 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Every dish is made with care, from a real home kitchen.
          </h2>
          <div className="mt-6 divide-y divide-black/10 border-t border-black/10">
            {POINTS.map((point, i) => {
              const isOpen = open === i;
              return (
                <div key={point.title} className="py-4">
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="group flex w-full items-center justify-between text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xs text-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-heading font-medium text-foreground">
                        {point.title}
                      </span>
                    </span> 
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                        isOpen
                          ? "border-primary bg-primary text-white"
                          : "border-black/15 bg-transparent text-muted group-hover:border-primary group-hover:text-primary"
                      }`}
                    >
                      {isOpen ? <Minus size={10} /> : <Plus size={10} />}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-2 pl-8 text-sm text-muted">{point.detail}</p>
                  )}
                </div>
              );
            })}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15} className="relative mx-auto h-80 w-full max-w-md sm:h-96">
          <div className="absolute right-0 top-0 h-64 w-64 overflow-hidden rounded-2xl bg-tint shadow-sm sm:h-72 sm:w-72">
            <Image
              src="/kitchen-1.png"
              alt="Daughter's Delight kitchen in action"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 h-40 w-40 overflow-hidden rounded-2xl border-4 border-background bg-tint shadow-sm sm:h-48 sm:w-48">
            <Image
              src="/kitchen-2.png"
              alt="Homemade food preparation"
              fill
              className="object-cover"
            />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
