"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

// No reviews system exists in the backend yet — add real customer quotes
// here once the owner collects them. Left empty rather than inventing fake ones.
const REVIEWS: { quote: string; name: string; location: string }[] = [];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  if (REVIEWS.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8">
        <span className="text-sm font-bold uppercase tracking-wide text-primary-soft">
          Community
        </span>
        <h2 className="mt-2 font-heading text-3xl font-normal text-foreground sm:text-4xl">
          Small habits, real change.
        </h2>
        <p className="mt-4 text-muted">
          We&rsquo;re just getting started collecting reviews. Ordered from
          us? Share your experience and we&rsquo;ll feature it here.
        </p>
      </section>
    );
  }

  const review = REVIEWS[index];

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8">
      <span className="text-sm font-bold uppercase tracking-wide text-primary-soft">
        Community
      </span>
      <h2 className="mt-2 font-heading text-3xl font-normal text-foreground sm:text-4xl">
        Small habits, real change.
      </h2>

      <div className="relative mt-8 rounded-2xl bg-white p-8 shadow-sm">
        <Quote size={20} className="mx-auto text-primary-soft" />
        <p className="mt-4 text-foreground">{review.quote}</p>
        <p className="mt-4 text-sm font-semibold text-foreground">
          {review.name} <span className="font-normal text-muted">· {review.location}</span>
        </p>
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          aria-label="Previous review"
          onClick={() => setIndex((i) => (i - 1 + REVIEWS.length) % REVIEWS.length)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-foreground hover:bg-tint"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm text-muted">
          {index + 1} / {REVIEWS.length}
        </span>
        <button
          aria-label="Next review"
          onClick={() => setIndex((i) => (i + 1) % REVIEWS.length)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-foreground hover:bg-tint"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
