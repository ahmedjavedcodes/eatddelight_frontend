import type { Metadata } from "next";
import type { SiteSettings } from "@/lib/api/types";

export const SITE_NAME = "Daughter's Delight";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const DEFAULT_TITLE =
  "Daughter's Delight | Homemade Food in Karachi";

export const DEFAULT_DESCRIPTION =
  "Order fresh, homemade meals in Karachi from Daughter's Delight. Daily specials and a full à la carte menu, cooked to order and ready when you need it.";

export const DEFAULT_KEYWORDS = [
  "homemade food Karachi",
  "home kitchen Karachi",
  "daily meal delivery",
  "homemade food order online",
  "Daughter's Delight",
];

/** Absolute URL for a site-relative path, for canonical/OG tags. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Shared OpenGraph/Twitter fields merged into every page's metadata so
 * social previews stay consistent without repeating boilerplate per page.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? absoluteUrl("/hero-image.png");

  return {
    // `absolute` bypasses the root layout's title template so each page's
    // hand-tuned 50-60 char title isn't extended with a repeated brand
    // suffix (which would push it well past the SEO length target).
    title: { absolute: title },
    description,
    keywords: keywords ?? DEFAULT_KEYWORDS,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 1200 }],
      locale: "en_PK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** Organization + LocalBusiness schema, rendered once in the root layout. */
export function buildOrganizationSchema(settings: SiteSettings | null) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: settings?.business_name ?? SITE_NAME,
    description: settings?.about_text ?? DEFAULT_DESCRIPTION,
    url: SITE_URL,
    telephone: settings?.contact_phone,
    image: absoluteUrl("/hero-image.png"),
    priceRange: "Rs. 250 - Rs. 900",
    ...(settings?.address ? { address: { "@type": "PostalAddress", streetAddress: settings.address } } : {}),
    ...(settings?.instagram_handle
      ? { sameAs: [`https://instagram.com/${settings.instagram_handle}`] }
      : {}),
  };
}

/** WebSite schema, rendered once in the root layout. */
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
  };
}

/** Product schema for a single food's detail page. */
export function buildFoodProductSchema({
  id,
  name,
  description,
  price,
  imageUrl,
  isAvailable,
}: {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description ?? `${name} — homemade, cooked to order by ${SITE_NAME}.`,
    image: imageUrl ?? absoluteUrl("/hero-image.png"),
    url: absoluteUrl(`/food/${id}`),
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price,
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/food/${id}`),
    },
  };
}

/** ItemList schema for a page listing multiple foods (menu, weekly menu). */
export function buildItemListSchema(
  items: { id: number; name: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/food/${item.id}`),
      name: item.name,
    })),
  };
}
