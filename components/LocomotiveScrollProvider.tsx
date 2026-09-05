"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type LocomotiveScroll from "locomotive-scroll";
import { SCROLL_CONTAINER_SELECTOR } from "@/lib/scrollConfig";

let scrollInstance: LocomotiveScroll | null = null;
let containerElement: HTMLElement | null = null;
let ready = false;
const READY_EVENT = "locomotive-scroll-ready";

export function stopScroll() {
  scrollInstance?.stop();
}

export function startScroll() {
  scrollInstance?.start();
}

/** The live scroll-container DOM node, once Locomotive Scroll is ready. */
export function getScrollContainer(): HTMLElement | null {
  return containerElement;
}

/** The live Locomotive Scroll instance, once ready. */
export function getScrollInstance(): LocomotiveScroll | null {
  return scrollInstance;
}

/**
 * Runs `callback` once the Locomotive Scroll instance and its ScrollTrigger
 * proxy are set up. Needed because React mounts child effects before parent
 * effects, so a child's ScrollTrigger.create() would otherwise run before
 * this provider (its ancestor) has registered the scroller proxy.
 */
export function onScrollReady(callback: () => void): () => void {
  if (ready) {
    callback();
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener(READY_EVENT, handler);
  return () => window.removeEventListener(READY_EVENT, handler);
}

export default function LocomotiveScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    let scroll: LocomotiveScroll | undefined;
    let refreshHandler: (() => void) | undefined;

    import("locomotive-scroll").then(({ default: LocomotiveScrollCtor }) => {
      if (cancelled) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      scroll = new LocomotiveScrollCtor({
        el,
        smooth: !prefersReducedMotion,
      });
      scrollInstance = scroll;

      let currentScrollY = 0;
      scroll.on("scroll", (event) => {
        currentScrollY = event.scroll.y;
        ScrollTrigger.update();
      });

      ScrollTrigger.scrollerProxy(el, {
        scrollTop(value) {
          if (arguments.length && value !== undefined) {
            scroll?.scrollTo(value, { duration: 0, disableLerp: true });
            return 0;
          }
          return currentScrollY;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: el.style.transform ? "transform" : "fixed",
      });

      refreshHandler = () => scroll?.update();
      ScrollTrigger.addEventListener("refresh", refreshHandler);
      ScrollTrigger.refresh();

      containerElement = el;
      ready = true;
      window.dispatchEvent(new Event(READY_EVENT));
    });

    return () => {
      cancelled = true;
      ready = false;
      containerElement = null;
      if (refreshHandler) ScrollTrigger.removeEventListener("refresh", refreshHandler);
      scroll?.destroy();
      scrollInstance = null;
    };
  }, []);

  // Recalculate scroll heights after route changes swap page content.
  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollInstance?.update();
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div ref={containerRef} data-scroll-container>
      {children}
    </div>
  );
}

export { SCROLL_CONTAINER_SELECTOR };
