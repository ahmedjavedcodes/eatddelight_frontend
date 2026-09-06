"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/api/settings";

function tomorrowIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function CustomOrderForm({
  whatsappNumber,
}: {
  whatsappNumber: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [servings, setServings] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [occasion, setOccasion] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const minDate = tomorrowIso();

  function handleSend() {
    if (!description.trim()) {
      setError("Please describe what you'd like to order.");
      return;
    }
    if (eventDate && eventDate < minDate) {
      setError("Event date must be at least one day from today.");
      return;
    }
    setError(null);

    const lines = [
      "Hi! I'd like to place a custom order.",
      "",
      `Details: ${description.trim()}`,
      servings && `Servings: ${servings}`,
      budgetRange && `Budget range: ${budgetRange}`,
      occasion && `Occasion: ${occasion}`,
      eventDate && `Event date: ${eventDate}`,
      name && `Name: ${name}`,
      phone && `Phone: ${phone}`,
    ].filter(Boolean);

    window.open(whatsappUrl({ whatsapp_number: whatsappNumber }, lines.join("\n")), "_blank");
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-foreground">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">
          What would you like? *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="e.g. A custom Chicken Karahi order to serve 5 people"
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-foreground">Servings</label>
          <input
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            placeholder="e.g. 20"
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Budget Range</label>
          <input
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            placeholder="e.g. 5,000–8,000"
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Occasion</label>
          <input
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="e.g. Event"
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-8">
        <label className="text-sm font-medium text-foreground">Event Date</label>
        <input
          type="date"
          min={minDate}
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="mt-1 w-full max-w-xs rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none"
        />
      </div>

      {error && <p className="text-sm font-medium text-primary">{error}</p>}

      <button
        onClick={handleSend}
        className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
      >
        Send Request via WhatsApp
      </button>
    </div>
  );
}
