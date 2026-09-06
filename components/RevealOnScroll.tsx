"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import "@/lib/scrollConfig";
import { getScrollContainer, onScrollReady } from "@/components/LocomotiveScrollProvider";

export default function RevealOnScroll({
  children,
  className,
  delay = 0,
  y = 20,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let ctx: gsap.Context | undefined;

    const unsubscribe = onScrollReady(() => {
      if (!document.body.contains(el)) return;
      const scroller = getScrollContainer() ?? undefined;
      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      }, el);
    });

    return () => {
      unsubscribe();
      ctx?.revert();
    };
  }, [delay, y]);

  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}
