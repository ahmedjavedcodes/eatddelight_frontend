"use client";

import { TriangleAlert } from "lucide-react";

export default function StorefrontError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto max-w-md px-4 py-24 text-center sm:px-6 lg:px-8">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-primary">
        <TriangleAlert size={28} />
      </span>
      <h1 className="mt-6 font-heading text-3xl font-semibold text-foreground">
        Something went wrong
      </h1>
      <p className="mt-2 text-muted">
        We couldn&rsquo;t load this page. Please check your connection and
        try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark"
      >
        Try Again
      </button>
    </section>
  );
}
