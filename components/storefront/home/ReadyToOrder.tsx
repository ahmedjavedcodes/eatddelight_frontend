import Link from "next/link";
import { MessageCircle, ShoppingBag } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getSettings, whatsappUrl } from "@/lib/api/settings";

export default async function ReadyToOrder() {
  const settings = await getSettings().catch(() => null);
  if (!settings) return null;

  return (
    <RevealOnScroll as="section" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-primary/5 px-8 py-8 sm:flex-row">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <MessageCircle size={22} />
          </span>
          <div>
            <h3 className="font-heading text-lg font-medium text-foreground">
              Ready To Order?
            </h3>
            <p className="text-sm text-muted">
              Add items to your cart, or message us directly on WhatsApp.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-3 font-semibold text-primary transition hover:bg-white"
          >
            <ShoppingBag size={18} />
            View Cart
          </Link>
          <a
            href={whatsappUrl(settings, "Hi! I'd like to place an order.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark"
          >
            <MessageCircle size={18} />
            Chat On WhatsApp
          </a>
        </div>
      </div>
    </RevealOnScroll>
  );
}
