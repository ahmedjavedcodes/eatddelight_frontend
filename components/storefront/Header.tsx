"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useFavouritesStore } from "@/lib/store/favourites";
import { useHasMounted } from "@/lib/hooks/useHasMounted";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/weekly-menu", label: "Weekly" },
  { href: "/custom-orders", label: "Custom" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const hasMounted = useHasMounted();
  const rawCartCount = useCartStore((s) =>
    s.lines.reduce((sum, l) => sum + l.quantity, 0),
  );
  const rawFavouriteCount = useFavouritesStore((s) => s.foodIds.length);
  const cartCount = hasMounted ? rawCartCount : 0;
  const favouriteCount = hasMounted ? rawFavouriteCount : 0;

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-background py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-full bg-background px-6 py-3 shadow-lg ring-1 ring-black/5">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
              D
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
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
                    active ? "text-primary font-semibold" : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Section - Icons + Contact */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/favourites"
              aria-label="Favourites"
              className="relative text-foreground hover:text-primary"
            >
              <Heart size={18} />
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
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Contact Button */}
            <a
              href="/contact"
              className="hidden rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-dark md:inline-block"
            >
              Contact
            </a>

            {/* Mobile Menu Button */}
            <button
              aria-label="Toggle menu"
              className="text-foreground md:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {open && (
          <nav className="mt-3 flex flex-col gap-2 rounded-lg bg-white/95 p-4 md:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/contact"
              className="mt-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white"
              onClick={() => setOpen(false)}
            >
              Contact
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
