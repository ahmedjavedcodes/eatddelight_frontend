"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { cartLineTotal, useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/format";
import { WHATSAPP_NUMBER } from "@/lib/constants";

function tomorrowIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function CheckoutPage() {
  const lines = useCartStore((s) => s.lines);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);

  const minDate = tomorrowIso();
  const total = lines.reduce((sum, line) => sum + cartLineTotal(line), 0);

  const isFormComplete = name.trim() && phone.trim() && requestedDate;
  const getMissingFields = () => {
    const missing = [];
    if (!name.trim()) missing.push("name");
    if (!phone.trim()) missing.push("phone");
    if (!requestedDate) missing.push("date");
    return missing;
  };

  function handleOrderOnWhatsApp() {
    if (lines.length === 0) return;
    if (requestedDate && requestedDate < minDate) {
      setDateError("Requested date must be at least one day from today.");
      return;
    }
    setDateError(null);

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
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
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
            min={minDate}
            value={requestedDate}
            onChange={(e) => setRequestedDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
          {dateError && (
            <p className="mt-1 text-xs font-medium text-primary">{dateError}</p>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-tint p-4 text-sm text-foreground">
        Have a bespoke request such as a custom cake, bulk catering, or a
        subscription plan?{" "}
        <Link href="/custom-orders" className="font-bold text-primary underline">
          Tell us on the Custom Orders page →
        </Link>
      </div>

      {!isFormComplete && (
        <div className="mt-6 rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
          <p className="font-medium">
            Please fill in the following information before placing your order:
          </p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            {!name.trim() && <li>Your name</li>}
            {!phone.trim() && <li>Your phone number</li>}
            {!requestedDate && <li>Requested delivery date</li>}
          </ul>
        </div>
      )}

      <button
        onClick={handleOrderOnWhatsApp}
        disabled={lines.length === 0 || !isFormComplete}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-muted sm:text-base"
      >
        <MessageCircle size={18} />
        Order on WhatsApp
      </button>
    </section>
  );
}