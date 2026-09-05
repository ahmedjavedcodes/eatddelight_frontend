"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { cartLineTotal, useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/format";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function CheckoutPage() {
  const lines = useCartStore((s) => s.lines);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [requestedDate, setRequestedDate] = useState("");

  const total = lines.reduce((sum, line) => sum + cartLineTotal(line), 0);

  function handleOrderOnWhatsApp() {
    if (lines.length === 0) return;

    const orderLines = lines.map(
      (line) => `${line.quantity} x ${line.name} — ${formatPrice(cartLineTotal(line))}`,
    );

    const messageParts = [
      "Hi! I'd like to place an order.",
      "",
      ...orderLines,
      `Total: ${formatPrice(total)}`,
      "",
      name && `Name: ${name}`,
      phone && `Phone: ${phone}`,
      requestedDate && `Requested date: ${requestedDate}`,
    ].filter(Boolean);

    const message = encodeURIComponent(messageParts.join("\n"));
    // Same-tab redirect (not a new tab) so the order lands as a draft in
    // the WhatsApp chat and the user is taken straight there.
    window.location.assign(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`);
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <span className="text-sm font-bold uppercase tracking-wide text-primary">
        Review Order
      </span>
      <h1 className="mt-2 font-heading text-4xl font-semibold text-foreground">Checkout</h1>

      <div className="mt-8">
        <h2 className="font-heading font-semibold text-foreground">
          Order Summary
        </h2>
        {lines.length === 0 ? (
          <p className="mt-2 text-muted">
            Your cart is empty.{" "}
            <Link href="/menu" className="text-primary underline">
              Browse the menu
            </Link>
            .
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {lines.map((line) => (
              <div key={line.foodId} className="flex justify-between text-sm">
                <span>
                  {line.quantity} × {line.name}
                </span>
                <span>{formatPrice(cartLineTotal(line))}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-black/10 pt-2 font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Phone
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="date" className="text-sm font-medium text-foreground">
            Requested Date (at least 1 day in advance)
          </label>
          <input
            id="date"
            type="date"
            value={requestedDate}
            onChange={(e) => setRequestedDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-tint p-4 text-sm text-foreground">
        Have a bespoke request such as a custom cake, bulk catering, or a
        subscription plan?{" "}
        <Link href="/custom-orders" className="font-bold text-primary underline">
          Tell us on the Custom Orders page →
        </Link>
      </div>

      <button
        onClick={handleOrderOnWhatsApp}
        disabled={lines.length === 0}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-center font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-muted"
      >
        <MessageCircle size={18} />
        Order on WhatsApp
      </button>
    </section>
  );
}