/**
 * OfficialTrackedPage — "your EXISTING Reports grid, renamed contextually".
 *
 * A dense, sortable table of every monitored project with its live engine
 * score — the analyst view (vs the Overview's card view). Rows link into
 * the host's existing project detail pages.
 */
import { useMemo, useState } from 'react';
import { monitoredProjects } from '../../../src/data/projects';
import { createRuleEngine } from '../../../src/engine';
import { PageHeading } from '../tokens';

const engine = createRuleEngine();

const LEVEL_CLASS = {
  High: 'border-risk-high text-risk-high',
  Medium: 'border-risk-medium text-risk-medium',
  Low: 'border-risk-low text-risk-low',
} as const;

type SortKey = 'score' | 'progress' | 'name';

export default function OfficialTrackedPage() {
  const [sort, setSort] = useState<SortKey>('score');

  const rows = useMemo(() => {
    const scored = monitoredProjects.map((p) => ({ p, r: engine.predict(p.riskInput) }));
    switch (sort) {
      case 'progress':
        return scored.sort((a, b) => a.p.progressPct - b.p.progressPct);
      case 'name':
        return scored.sort((a, b) => a.p.name.localeCompare(b.p.name));
      default:
        return scored.sort((a, b) => b.r.score - a.r.score);
    }
  }, [sort]);

  return (
    <div>
      <PageHeading eyebrow="OFFICIAL PORTAL" title="Tracked Projects">
        Every monitored project with its current engine score. Click a row for
        the full project page with drivers and what-if analysis.
      </PageHeading>

      <div className="mt-8 overflow-x-auto border border-line bg-surface">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-4 py-3 font-medium">
                <button type="button" onClick={() => setSort('name')} className="hover:text-ink">
                  Project
                </button>
              </th>
              <th className="px-4 py-3 font-medium">District</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">
                <button type="button" onClick={() => setSort('progress')} className="hover:text-ink">
                  Acquired
                </button>
              </th>
              <th className="px-4 py-3 font-medium">
                <button type="button" onClick={() => setSort('score')} className="hover:text-ink">
                  Risk
                </button>
              </th>
              <th className="px-4 py-3 font-medium">Top driver</th>
            </tr>
            {/* aria-sort on the active column header would go here in a real a11y pass */}
          </thead>
          <tbody>
            {rows.map(({ p, r }) => (
              <tr key={p.id} className="border-b border-line last:border-b-0 hover:bg-parchment/60">
                <td className="px-4 py-3">
                  <a
                    href={`#/projects/${encodeURIComponent(p.id)}`}
                    className="font-medium text-ink hover:text-accent hover:underline"
                  >
                    {p.name}
                  </a>
                  <span className="ml-2 text-xs text-ink-faint">{p.id}</span>
                </td>
                <td className="px-4 py-3 text-ink-soft">{p.district}, {p.state}</td>
                <td className="px-4 py-3 text-ink-soft">{p.stage}</td>
                <td className="px-4 py-3 tabular-nums text-ink-soft">{p.progressPct}%</td>
                <td className="px-4 py-3">
                  <span className={`inline-block border-l-4 px-2 py-0.5 text-xs font-semibold ${LEVEL_CLASS[r.level]}`}>
                    {r.level} · {r.score}
      </span>
                </td>
                <td className="px-4 py-3 text-ink-soft">{r.explanations[0] ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-faint">
        Scores from the parcel risk engine (Feature 1). This view intentionally
        complements the Overview watchlist: analysts sort, collectors scan.
      </p>
    </div>
  );
}
