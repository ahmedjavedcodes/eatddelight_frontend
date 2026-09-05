import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getSettings } from "@/lib/api/settings";

const TRUST_BADGES = [
  { label: "Fresh, Homemade" },
  { label: "Advance Order" },
  { label: "Made With Love" },
  { label: "Available Daily" },
];

export default async function Hero() {
  const settings = await getSettings().catch(() => null);
  const tagline = settings?.tagline ?? "Homemade goodness, freshly prepared with care";
  const [firstLine, ...rest] = tagline.split(", ");
  const secondLine = rest.join(", ");

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
      <RevealOnScroll y={30}>
        <span className="text-sm font-bold uppercase tracking-wide text-primary">
          Delicious. Fresh. Made For You.
        </span>
        <h1 className="mt-3 font-heading text-4xl font-medium leading-tight text-foreground sm:text-5xl">
          {firstLine}
          {secondLine && (
            <>
              <br />
              {secondLine}
            </>
          )}
        </h1>
        <p className="mt-5 max-w-md">
          A daily-changing menu and a full à la carte catalog, cooked fresh in
          a real home kitchen and ready whenever you are, order at
          least a day ahead.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/menu"
            className="rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark"
          >
            Explore Menu →
          </Link>
          <Link
            href="/weekly-menu"
            className="rounded-lg border border-primary px-5 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            Today&rsquo;s Special
          </Link>
        </div>
        <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.label} className="rounded-lg bg-tint p-3 text-center">
              <dt className="text-xs font-semibold text-foreground">
                {badge.label}
              </dt>
            </div>
          ))}
        </dl>
      </RevealOnScroll>

      <RevealOnScroll delay={0.15} y={30}>
        <div className="relative mx-auto aspect-square w-full bg-tint border-4 border-background shadow-md max-w-md overflow-hidden rounded-2xl">
          <Image
            src="/hero-image.png"
            alt="Daughter's Delight packaged homemade food"
            fill
            className="object-cover"
            priority
          />
        </div>
      </RevealOnScroll>
    </section>
  );
}
