"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { getScrollInstance } from "./LocomotiveScrollProvider";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
    );
  }, [pathname]);

  useEffect(() => {
    const scrollInstance = getScrollInstance();
    if (scrollInstance) {
      scrollInstance.scrollTo(0, { duration: 0, disableLerp: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div ref={ref} key={pathname}>
      {children}
    </div>
  );
}
