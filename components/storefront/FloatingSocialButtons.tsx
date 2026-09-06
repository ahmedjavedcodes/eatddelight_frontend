import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import { getSettings, whatsappUrl } from "@/lib/api/settings";

export default async function FloatingSocialButtons() {
  const settings = await getSettings().catch(() => null);
  if (!settings) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      {settings.instagram_handle && (
        <a
          href={`https://instagram.com/${settings.instagram_handle}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Follow us on Instagram"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:scale-105"
        >
          <InstagramIcon size={22} />
        </a>
      )}
      {settings.whatsapp_number && (
        <a
          href={whatsappUrl(settings, "Hi! I'd like to place an order.")}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
        >
          <WhatsAppIcon size={26} />
        </a>
      )}
    </div>
  );
}
