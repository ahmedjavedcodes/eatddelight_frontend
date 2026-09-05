import type { Metadata } from "next";
import { AtSign } from "lucide-react";
import SplitSection from "@/components/storefront/SplitSection";
import Testimonials from "@/components/storefront/home/Testimonials";
import { getSettings } from "@/lib/api/settings";

export const metadata: Metadata = { title: "About — Daughter's Delight" };

export default async function AboutPage() {
  const settings = await getSettings().catch(() => null);

  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <span className="text-sm font-bold uppercase tracking-wide text-primary">
          Our Story
        </span>
        <h1 className="mt-2 font-heading text-4xl font-semibold text-foreground sm:text-5xl">
          About Us
        </h1>
        <p className="mt-6 whitespace-pre-line text-muted">
          {settings?.about_text ??
            "Daughter's Delight is a home kitchen serving homemade meals with love — a rotating menu of the day alongside a full à la carte catalog, cooked fresh and ready whenever you are."}
        </p>

        {settings?.opening_hours && (
          <div className="mt-8 rounded-xl bg-tint p-5">
            <h2 className="font-heading font-semibold text-foreground">
              Opening Hours
            </h2>
            <p className="mt-1 text-sm text-muted">{settings.opening_hours}</p>
          </div>
        )}

        {settings?.address && (
          <p className="mt-4 text-sm text-muted">{settings.address}</p>
        )}

        {settings?.instagram_handle && (
          <a
            href={`https://instagram.com/${settings.instagram_handle}`}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary-soft hover:text-primary"
          >
            <AtSign size={16} />
            Follow us on Instagram
          </a>
        )}
      </section>

      <section className="mx-auto max-w-6xl divide-y divide-black/10 px-4 sm:px-6 lg:px-8">
        <SplitSection
          eyebrow="Our Story"
          title="A home kitchen, run with love."
          body="Daughter's Delight started as home-cooked meals made for family, and grew into a kitchen that now cooks for the neighbourhood too — every order still made the same way, from scratch, with care."
          imageAlt="The Daughter's Delight kitchen"
          imageSrc="/about-1.png"
        />
        <SplitSection
          eyebrow="Our Mission"
          title="Bring homemade food to more tables."
          body="We want ordering food to feel like asking a family member to cook for you — fresh, generous, and made specifically for your order, not sitting under a heat lamp."
          imageAlt="A freshly prepared homemade dish"
          imageSrc="/about-2.png"
          reverse
        />
        <SplitSection
          eyebrow="Our Vision"
          title="Homemade, made simple to order."
          body="As we grow, our promise stays the same: a rotating daily menu, a full à la carte catalog, and bespoke orders for the moments that need something special — all still cooked fresh, one order at a time."
          imageAlt="Ingredients for a homemade meal"
          imageSrc="/about-3.png"
        />
      </section>

      <Testimonials />
    </>
  );
}
