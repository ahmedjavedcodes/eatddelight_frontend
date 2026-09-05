import type { Metadata } from "next";
import { AtSign, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/storefront/ContactForm";
import { getSettings, whatsappUrl } from "@/lib/api/settings";

export const metadata: Metadata = { title: "Contact | Daughter's Delight" };

export default async function ContactPage() {
  const settings = await getSettings().catch(() => null);

  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <span className="text-sm font-bold uppercase tracking-wide text-primary">
          Get In Touch
        </span>
        <h1 className="mt-2 font-heading text-4xl font-semibold text-foreground sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 text-muted">
          Questions about the menu, a custom order, or anything else? Send us
          a message, or reach out directly.
        </p>

        <div className="mt-6 space-y-3">
          {settings?.contact_phone && (
            <div className="flex items-center gap-3 text-sm text-foreground">
              <Phone size={18} className="text-primary" />
              {settings.contact_phone}
            </div>
          )}
          {settings?.whatsapp_number && (
            <a
              href={whatsappUrl(settings, "Hi! I have a question.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
          )}
          {settings?.instagram_handle && (
            <a
              href={`https://instagram.com/${settings.instagram_handle}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-sm text-foreground hover:text-primary"
            >
              <AtSign size={18} className="text-primary" />
              DM us on Instagram @{settings.instagram_handle}
            </a>
          )}
        </div>
      </div>

      <ContactForm />
    </section>
  );
}
