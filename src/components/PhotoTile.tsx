/**
 * Shared photo-tile pattern — the "Important Links" tile look, made reusable.
 *
 * Consumers compose these primitives instead of re-declaring the classes:
 *   <a|button className={`${TILE_CONTAINER} ...`}>
 *     <TilePhoto src={...} />
 *     ...content (spans use TILE_TEXT_FLIP / TILE_TEXT_FLIP_SOFT)...
 *     <TileFooter />
 *   </a|button>
 *
 * Everything here mirrors the original Important Links markup exactly:
 * - ~340×280px square-ish tile: min-h-[280px], px-6 py-10, hairline border
 *   on the flat parchment surface, inside a 1/2/3-column responsive grid.
 * - Hover/focus reveals a full-bleed cover photo under a dark scrim
 *   (bg-ink/75) with a 200ms opacity crossfade; text flips light so it
 *   stays legible over the photo.
 * - prefers-reduced-motion: the photo layer is removed entirely
 *   (motion-reduce:hidden) and transitions collapse to instant state
 *   changes — the tile keeps a flat color change instead.
 */
import type { ReactNode } from 'react';

/** Responsive 3-col grid used by every photo-tile section. */
export const TILE_GRID =
  'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8';

/** The tile shell itself — callers add their own interaction classes. */
export const TILE_CONTAINER =
  'group relative flex min-h-[280px] flex-col overflow-hidden border border-line bg-surface px-6 py-10';

/** Shared hover/focus reveal modifiers. Keyboard focus gets the same
 *  treatment as hover via group-focus-within (the tile itself is the link). */
const REVEAL =
  'motion-safe:group-hover:opacity-100 motion-safe:group-focus-within:opacity-100';
/** Transitions exist only for motion-safe users; reduced-motion users get
 *  instant state changes instead of animated ones. */
const FADE = 'motion-safe:transition-opacity motion-safe:duration-200';

/** Text colour flip to parchment (strong variant, e.g. titles). */
export const TILE_TEXT_FLIP =
  'transition-colors duration-300 motion-safe:group-hover:text-parchment motion-safe:group-focus-within:text-parchment motion-reduce:transition-none';

/** Text colour flip to parchment/80 (soft variant, e.g. supporting text). */
export const TILE_TEXT_FLIP_SOFT =
  'transition-colors duration-300 motion-safe:group-hover:text-parchment/80 motion-safe:group-focus-within:text-parchment/80 motion-reduce:transition-none';

/**
 * Hover-reveal image layer: full-bleed cover photo under a dark scrim,
 * crossfading in 200ms. Removed entirely under prefers-reduced-motion —
 * the tile keeps its flat color change.
 */
export function TilePhoto({ src, alt = '' }: { src: string; alt?: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 motion-reduce:hidden"
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover object-center opacity-0 ${FADE} ${REVEAL}`}
      />
      <span className={`absolute inset-0 bg-ink/75 opacity-0 ${FADE} ${REVEAL}`} />
    </span>
  );
}

/**
 * Bottom slot: a circular "+" in the flat state, swapped for a white
 * "Read More" chip when the tile is hovered/focused. Decorative — the
 * whole tile is the interactive element.
 */
export function TileFooter(): ReactNode {
  return (
    <span aria-hidden="true" className="relative mt-auto block h-10">
      <span
        className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-ink-soft transition-opacity duration-200 group-hover:opacity-0 group-focus-within:opacity-0 motion-reduce:[transition:none]`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      <span
        className={`absolute left-0 top-0 inline-flex h-10 items-center gap-2 bg-white pl-3 pr-4 text-[13px] font-semibold text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:[transition:none]`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Read More
      </span>
    </span>
  );
}
