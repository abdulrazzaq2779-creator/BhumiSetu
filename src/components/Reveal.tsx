import type { ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

/**
 * Reveal — one-line scroll-reveal wrapper.
 *
 * Renders a div with the .reveal pattern from index.css: children fade/rise
 * in the first time they enter the viewport. Reduced-motion users see the
 * content immediately (the CSS collapses to always-visible).
 */
export default function Reveal({
  children,
  delayMs = 0,
  className = '',
}: {
  children: ReactNode;
  /** Stagger delay in ms — pass per-index values for cascades. */
  delayMs?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>({ delayMs });
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
