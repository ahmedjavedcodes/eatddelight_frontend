"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import Logo from "@/components/storefront/Logo";
import { useCartStore } from "@/lib/store/cart";
import { useFavouritesStore } from "@/lib/store/favourites";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/weekly-menu", label: "Weekly Menu" },
  { href: "/menu", label: "Menu" },
  { href: "/custom-orders", label: "Custom Orders" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const cartCount = useCartStore((s) =>
    s.lines.reduce((sum, l) => sum + l.quantity, 0),
  );
  const favouriteCount = useFavouritesStore((s) => s.foodIds.length);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-background">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden rounded-full bg-white px-8 py-3 lg:flex lg:items-center lg:gap-8">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-primary font-semibold" : "text-black/60 hover:text-black"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-6 lg:gap-8">
          <Link
            href="/favourites"
            aria-label="Favourites"
            className="relative text-foreground hover:text-primary"
          >
            <Heart size={20} />
            {favouriteCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {favouriteCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative text-foreground hover:text-primary"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Toggle menu"
            className="text-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-black/5 px-4 py-3 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-normal text-primary-soft hover:bg-tint hover:text-primary"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
