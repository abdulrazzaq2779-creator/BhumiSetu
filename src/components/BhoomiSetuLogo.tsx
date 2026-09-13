/**
 * Bhoomi Setu logo mark — "bhoomi" (land) + "setu" (bridge).
 *
 * Two banks of land with furrow strokes, joined by a gentle hand-inked
 * bridge arch. Pure line-art (no fills) so it sits in the same family as
 * the Important Links icon set; coordinates are deliberately a touch
 * off-grid so the linework reads hand-drawn rather than mechanical.
 *
 * Colour: strokes use currentColor — the wrapper sets `text-parchment` on
 * the terracotta disc, but a caller can recolour the mark with any text-*
 * utility (e.g. `text-ink` for a stamp-style treatment on cream).
 *
 * Stroke width: 3 units on a 48-unit viewBox ≡ 1.5 units on the 24-unit
 * icon grid, matching the Important Links icons at equal rendered size.
 */

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export default function BhoomiSetuLogo({
  className = 'h-10 w-10',
}: {
  className?: string;
}) {
  return (
    <span
      className={`${className} grid shrink-0 place-items-center rounded-full border border-accent-deep bg-accent text-parchment`}
      role="img"
      aria-label="Bhoomi Setu logo"
    >
      <svg viewBox="0 0 48 48" className="h-1/2 w-1/2" aria-hidden="true">
        {/* Left bank of land (bhoomi) — softly irregular outline */}
        <path
          {...STROKE}
          d="M3.8 34.6 C7.4 33.1 12.2 32.8 16.6 33.8 C18.3 34.2 19.5 35.4 19.7 37.2 L19.9 39.5 L4.2 39.9 Z"
        />
        {/* Right bank — same idea, deliberately not a mirror image */}
        <path
          {...STROKE}
          d="M44.3 34.1 C40.8 33 36.2 33 31.9 34 C30.1 34.4 28.9 35.6 28.7 37.3 L28.5 39.7 L44.5 39.9 Z"
        />
        {/* Bridge arch (setu) spanning the two banks */}
        <path
          {...STROKE}
          d="M17.6 33.7 C19.6 26.6 23 23.4 24.2 23.2 C25.4 23.4 28.7 26.3 30.6 33.5"
        />
        {/* Inner arch echo — keeps the bridge readable at small sizes */}
        <path
          {...STROKE}
          d="M21.2 33.6 C22.3 29.7 23.4 27.7 24.2 27.5 C25 27.7 26.1 29.6 27.2 33.6"
        />
        {/* Keystone tick at the crown */}
        <path {...STROKE} d="M24.2 20.7 L24.2 23.3" />

        {/* Furrow strokes on each bank */}
        <path {...STROKE} d="M7.4 36.2 L13 36" />
        <path {...STROKE} d="M9.3 38 L13.6 37.9" />
        <path {...STROKE} d="M35.1 36 L40.9 36.2" />
        <path {...STROKE} d="M36.9 37.9 L41.2 38" />

        {/* Soil ticks beneath — a hint of ground texture */}
        <path {...STROKE} d="M8.2 43.3 L11.6 43.2" />
        <path {...STROKE} d="M20.6 43.5 L24.8 43.4" />
        <path {...STROKE} d="M31.6 43.2 L35.4 43.3" />
      </svg>
    </span>
  );
}
