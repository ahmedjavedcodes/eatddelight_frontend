"use client";

import { useState, type FormEvent } from "react";
import { submitContactMessage } from "@/lib/api/contact";
import { ApiError } from "@/lib/api/client";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = new FormData(event.currentTarget);
    try {
      await submitContactMessage({
        name: String(form.get("name") ?? ""),
        phone_or_email: String(form.get("phone_or_email") ?? ""),
        message: String(form.get("message") ?? ""),
      });
      setStatus("success");
      event.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof ApiError && typeof err.detail === "string"
          ? err.detail
          : "Something went wrong. Please try again or message us on WhatsApp.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-tint p-6 text-center">
        <p className="font-heading font-semibold text-foreground">
          Thanks for reaching out!
        </p>
        <p className="mt-1 text-sm text-muted">
          We&rsquo;ve received your message and will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={120}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="phone_or_email"
          className="text-sm font-medium text-foreground"
        >
          Phone or Email
        </label>
        <input
          id="phone_or_email"
          name="phone_or_email"
          required
          maxLength={255}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={1}
          maxLength={4000}
          rows={5}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none"
        />
      </div>

      {status === "error" && error && (
        <p className="text-sm font-medium text-primary">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
