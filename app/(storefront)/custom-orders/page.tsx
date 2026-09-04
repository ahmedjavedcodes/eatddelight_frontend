import type { Metadata } from "next";
import { ArrowRight, MessageCircle } from "lucide-react";
import BookingsBox from "@/components/storefront/BookingsBox";
import CustomOrderForm from "@/components/storefront/CustomOrderForm";
import { getSettings } from "@/lib/api/settings";

export const metadata: Metadata = { title: "Custom Orders — Daughter's Delight" };

const STEPS = [
  {
    title: "Choose Your Sauce",
    description: "Pick a sauce to pair with your main — swap it any day.",
  },
  {
    title: "Choose Your Main",
    description: "Rice or gravy, your call, day by day.",
  },
  {
    title: "Order In",
    description:
      "DM us with your name, number, address and preferred main of the day.",
  },
];

export default async function CustomOrdersPage() {
  const settings = await getSettings().catch(() => null);

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="text-sm font-bold uppercase tracking-wide text-primary">
          Bespoke &amp; Subscription
        </span>
        <h1 className="mt-2 font-heading text-4xl font-extrabold text-foreground sm:text-5xl">
          Custom Orders
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Bespoke cakes, bulk catering, subscription meal plans, or anything
          else outside the regular menu &mdash; tell us what you need and
          we&rsquo;ll take it from there.
        </p>
      </div>

      <div className="mt-12 rounded-2xl bg-tint p-8">
        <h2 className="text-center font-heading text-lg font-extrabold uppercase text-primary">
          Pick Your Own Plan
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-heading font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{step.description}</p>
              </div>
              {i < STEPS.length - 1 && (
                <ArrowRight
                  size={18}
                  className="mt-1.5 hidden shrink-0 text-primary/50 sm:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          Tell Us What You Need
        </h2>
        <p className="mt-1 text-sm text-muted">
          Fill this in and we&rsquo;ll open WhatsApp with your request ready
          to send.
        </p>
        <div className="mt-5">
          {settings?.whatsapp_number ? (
            <CustomOrderForm whatsappNumber={settings.whatsapp_number} />
          ) : (
            <p className="text-sm text-muted">
              WhatsApp ordering isn&rsquo;t available right now &mdash; please
              call us instead.
            </p>
          )}
        </div>
      </div>

      <div className="mt-12">
        <BookingsBox />
      </div>

      {settings?.whatsapp_number && (
        <a
          href={`https://wa.me/${settings.whatsapp_number}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
        >
          <MessageCircle size={16} />
          Prefer to just chat? Message us directly on WhatsApp
        </a>
      )}
    </section>
  );
}
