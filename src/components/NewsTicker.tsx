import type { CSSProperties } from 'react';
import type { RiskLevel } from '../engine/types';

/** Input shape for the ticker — feed live data by mapping onto this. */
export interface TickerEntry {
  id: string;
  title: string;
  riskLevel: RiskLevel;
  timestamp?: string;
  href?: string;
}

const DOT_CLASS: Record<RiskLevel, string> = {
  High: 'bg-risk-high',
  Medium: 'bg-risk-medium',
  Low: 'bg-risk-low',
};

interface NewsTickerProps {
  items: TickerEntry[];
  /** Seconds for one full loop of the list. Default 32s. */
  loopSeconds?: number;
  /** Set an explicit height on the panel (e.g. `h-[420px]`). */
  className?: string;
}

/**
 * Government notice-board panel: a continuously auto-scrolling list of
 * updates. Pure CSS loop (two stacked copies of the list, track translates
 * -50%), pauses on hover/focus, static under prefers-reduced-motion.
 */
export default function NewsTicker({
  items,
  loopSeconds = 32,
  className = '',
}: NewsTickerProps) {
  // With too few items a loop reads as duplication, so render a static list.
  const animate = items.length >= 3;

  const list = (ariaHidden: boolean) => (
    <ul aria-hidden={ariaHidden || undefined} className="divide-y divide-line">
      {items.map((item) => (
        <li key={item.id} className="px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-block h-2 w-2 shrink-0 rounded-full ${DOT_CLASS[item.riskLevel]}`}
              title={`${item.riskLevel} risk`}
            />
            {item.timestamp && (
              <span className="text-[11px] text-ink-faint">{item.timestamp}</span>
            )}
          </div>
          <p className="mt-1.5 text-[13px] font-medium leading-snug text-ink">
            {item.title}
          </p>
          <a
            href={item.href ?? '#/dashboard'}
            className="mt-1 inline-block text-xs font-semibold text-accent hover:underline"
          >
            View Details
            <span className="sr-only"> — {item.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      aria-label="What's new — latest project updates"
      className={`flex flex-col border border-line bg-surface ${className}`}
    >
      <header className="flex items-center justify-between border-b border-line bg-parchment-deep px-4 py-2.5">
        <h2 className="font-serif text-sm font-bold text-ink">What&rsquo;s New</h2>
        <span className="text-[11px] text-ink-faint">Live updates</span>
      </header>

      <div className="ticker-viewport relative flex-1 overflow-hidden">
        {animate ? (
          <div
            className="ticker-track"
            style={{ '--ticker-duration': `${loopSeconds}s` } as CSSProperties}
          >
            {list(false)}
            {list(true)}
          </div>
        ) : (
          list(false)
        )}
      </div>

      <footer className="border-t border-line px-4 py-2 text-[11px] text-ink-faint">
        Hover to pause · refreshed each scoring cycle
      </footer>
    </aside>
  );
}
