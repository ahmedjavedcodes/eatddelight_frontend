"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import gsap from "gsap";
import RevealOnScroll from "@/components/RevealOnScroll";

const REVIEWS = [
  {
    quote:
      "The food is incredibly fresh and tasty. I've been ordering every week and it's become a staple in my diet. Highly recommend!",
    name: "Ayesha K.",
    location: "Karachi",
  },
  {
    quote:
      "Best homemade meals I've had outside my own home. The quality and taste are unmatched. Worth every penny!",
    name: "Hassan M.",
    location: "Karachi",
  },
  {
    quote:
      "Daughter's Delight has spoiled me for regular food. The flavors are authentic and the portions are generous.",
    name: "Fatima S.",
    location: "Karachi",
  },
  {
    quote:
      "Finally found a place that serves real homemade food. My whole family loves ordering from here. Keep up the great work!",
    name: "Ali R.",
    location: "Karachi",
  },
  {
    quote:
      "The consistency in quality is impressive. Every order is prepared with care. This is my go-to for quality meals.",
    name: "Zainab H.",
    location: "Karachi",
  },
  {
    quote:
      "Authentic flavors that remind me of home cooking. I've recommended Daughter's Delight to all my friends.",
    name: "Saira N.",
    location: "Karachi",
  },
];

export default function PakistaniReviews() {
  const [index, setIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
    );
  }, [index]);

  const goToPrevious = () => {
    setIndex((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);
  };

  const goToNext = () => {
    setIndex((i) => (i + 1) % REVIEWS.length);
  };

  const review = REVIEWS[index];

  return (
    <RevealOnScroll as="section" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <span className="text-sm font-bold uppercase tracking-wide text-primary">
            Community
          </span>
          <h2 className="mt-2 font-heading text-4xl font-semibold text-foreground sm:text-5xl">
            Small habits, real change.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Loved by 50+ customers across Pakistan
          </p>

          <div className="mt-10 flex gap-3">
            <button
              aria-label="Previous review"
              onClick={goToPrevious}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-primary transition hover:border-primary active:scale-90 active:bg-primary active:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              aria-label="Next review"
              onClick={goToNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-primary transition hover:border-primary active:scale-90 active:bg-primary active:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <div ref={cardRef} className="w-full rounded-2xl bg-gray-50 p-6 shadow-sm">
            <Quote size={24} className="text-primary" />
            <p className="mt-4 text-lg leading-relaxed text-foreground">
              {review.quote}
            </p>
            <div className="mt-6 border-t border-black/10 pt-4">
              <p className="font-semibold text-foreground">{review.name}</p>
              <p className="text-sm text-muted">{review.location}</p>
            </div>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}
