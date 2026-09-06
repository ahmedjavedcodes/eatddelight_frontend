import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-md px-4 py-24 text-center sm:px-6 lg:px-8">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-primary">
        <UtensilsCrossed size={28} />
      </span>
      <h1 className="mt-6 font-heading text-3xl font-semibold text-foreground">
        Page not found
      </h1>
      <p className="mt-2 text-muted">
        We couldn&rsquo;t find what you were looking for. It may have been
        moved or no longer exists.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark"
      >
        Back to Home
      </Link>
    </section>
  );
}
