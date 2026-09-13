import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface HeroSlide {
  src: string;
  alt: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  /** Dwell time per slide before advancing, ms. */
  interval?: number;
  /** Cross-fade duration, ms. */
  fadeMs?: number;
  /** Extra classes for the root, which is the positioning context. */
  className?: string;
  /** Hero content (gradient overlay, copy, CTAs) rendered above the slides. */
  children?: ReactNode;
}

/**
 * Auto-rotating background carousel: each slide cross-fades into the next
 * (600–800ms) and loops indefinitely. Behaviour contract:
 *
 *  - pauses on hover / keyboard focus anywhere in the layer,
 *  - respects `prefers-reduced-motion` (auto-rotation is disabled and the
 *    first image stays put; dot jumps remain available),
 *  - always keeps the NEXT slide mounted but invisible so the upcoming
 *    transition never shows a blank frame,
 *  - the outgoing slide stays mounted for the fade duration, so two images
 *    blend instead of fading through the dark backdrop.
 *
 * Dots are real buttons (jump-to-slide, aria-labelled) and restart the
 * dwell timer, as does any hover pause — no surprise mid-word transitions.
 *
 * Layout contract: the root stays IN normal flow (position: relative) and
 * only the image layer is absolute — in-flow children (hero copy) give the
 * section its height. Never position the root absolutely; that collapses
 * the hero to zero height.
 */
export default function HeroCarousel({
  slides,
  interval = 5000,
  fadeMs = 700,
  className = '',
  children,
}: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeRef = useRef(0);

  // Track prefers-reduced-motion, including live changes in the session.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const goTo = (next: number) => {
    if (next === activeRef.current || slides.length < 2) return;
    setLeaving(activeRef.current);
    activeRef.current = next;
    setActive(next);
  };

  // Auto-rotation. Reads activeRef, so the dwell window restarts after both
  // a manual dot jump and a hover pause.
  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) return;
    const t = window.setTimeout(
      () => goTo((activeRef.current + 1) % slides.length),
      interval,
    );
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, paused, reducedMotion, interval, slides.length]);

  // Unmount the outgoing slide only after its fade has fully completed.
  useEffect(() => {
    if (leaving === null) return;
    const t = window.setTimeout(() => setLeaving(null), fadeMs);
    return () => window.clearTimeout(t);
  }, [leaving, fadeMs]);

  // Safety net: if the pointer was over the pause zone when the window lost
  // focus (alt-tab, window switch), mouseleave never fired — resume so the
  // carousel can never stay stuck on pause.
  useEffect(() => {
    const resume = () => setPaused(false);
    window.addEventListener('blur', resume);
    return () => window.removeEventListener('blur', resume);
  }, []);

  const n = slides.length;
  const rendered = new Set<number>([active]);
  if (leaving !== null) rendered.add(leaving);
  if (n > 1) rendered.add((active + 1) % n); // preloaded next slide

  return (
    <div className={`relative ${className}`}>
      {/* Pause zone covers ONLY the imagery — not the hero copy. A cursor
          resting on the headline no longer freezes rotation. */}
      <div
        className="absolute inset-0"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((slide, i) =>
          rendered.has(i) ? (
            <img
              key={slide.src}
              src={slide.src}
              alt={i === active ? slide.alt : ''}
              aria-hidden={i !== active}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out ${
                i === active ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDuration: `${fadeMs}ms` }}
            />
          ) : null,
        )}
      </div>

      {children}

      {n > 1 && (
        <div className="absolute bottom-5 left-0 right-0 z-10 flex justify-center gap-2.5">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show image ${i + 1} of ${n}: ${slide.alt}`}
              aria-current={i === active || undefined}
              className={`h-1.5 w-1.5 rounded-full border transition-colors duration-300 ${
                i === active
                  ? 'border-parchment bg-parchment'
                  : 'border-parchment/50 bg-transparent hover:border-parchment/90'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
