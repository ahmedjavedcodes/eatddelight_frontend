import Link from "next/link";
import { AtSign, Phone } from "lucide-react";
import Logo from "@/components/storefront/Logo";
import InstagramIcon from "@/components/icons/InstagramIcon";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { getSettings, whatsappUrl } from "@/lib/api/settings";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/weekly-menu", label: "Weekly Menu" },
  { href: "/menu", label: "Menu" },
  { href: "/custom-orders", label: "Custom Orders" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default async function Footer() {
  const settings = await getSettings().catch(() => null);

  return (
    <footer className="border-t border-black/5 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted">
            {settings?.tagline ?? "Homemade goodness, freshly prepared with care."}
          </p>
          {settings?.instagram_handle && (
            <a
              href={`https://instagram.com/${settings.instagram_handle}`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-soft hover:text-primary"
            >
              <AtSign size={18} />
              {settings.instagram_handle}
            </a>
          )}
        </div>

        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-foreground hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
            Get In Touch
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {settings?.contact_phone && (
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary-soft" />
                {settings.contact_phone}
              </li>
            )}
            {settings?.opening_hours && <li>{settings.opening_hours}</li>}
            {settings?.address && <li>{settings.address}</li>}
            {settings?.instagram_handle && (
              <li>
                <a
                  href={`https://instagram.com/${settings.instagram_handle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <InstagramIcon size={16} />
                  insta: {settings.instagram_handle}
                </a>
              </li>
            )}
            {settings?.whatsapp_number && (
              <li>
                <a
                  href={whatsappUrl(settings, "Hi! I'd like to place an order.")}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-dark"
                >
                  <WhatsAppIcon size={16} />
                  Chat on WhatsApp
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-black/5 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()}{" "}
        {settings?.business_name ?? "Daughter's Delight"}. All rights reserved.
      </div>
    </footer>
  );
}
