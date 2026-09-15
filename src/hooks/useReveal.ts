import { useEffect, useRef, useState } from 'react';

/**
 * useReveal — scroll-reveal via IntersectionObserver.
 *
 * Returns a ref to spread on the element to reveal. Fires once; the element
 * keeps its visible state after. SSR-safe (observer is created in an effect).
 * Pair with the `.reveal` CSS class (src/index.css), which collapses to
 * "always visible" under prefers-reduced-motion.
 */
export function useReveal<T extends HTMLElement>(options?: {
  /** Fraction of the element that must be visible before revealing. */
  threshold?: number;
  /** Optional transition delay in ms (stagger siblings by passing per-index values). */
  delayMs?: number;
}) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion / no observer support → show immediately.
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true);
      return;
    }

    el.style.setProperty('--reveal-delay', `${options?.delayMs ?? 0}ms`);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: options?.threshold ?? 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold, options?.delayMs]);

  return { ref, visible };
}

/**
 * useCountUp — animates a number from 0 to `target` the first time the
 * host element scrolls into view. Honours prefers-reduced-motion by
 * jumping straight to the final value. Duration ~1.1s, ease-out curve.
 */
export function useCountUp<
  T extends HTMLElement = HTMLSpanElement,
>(target: number, durationMs = 1100): {
  ref: React.RefObject<T | null>;
  value: number;
} {
  const ref = useRef<T | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const finish = () => setValue(target);

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      finish();
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(Math.round(target * eased));
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, durationMs]);

  return { ref, value };
}
