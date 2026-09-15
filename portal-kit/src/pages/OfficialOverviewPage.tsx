/**
 * OfficialOverviewPage — the collector's morning briefing.
 *
 * Portfolio stats derive live from the host's own data + rule engine
 * (same scoring the Risk Dashboard shows), so this page can never drift
 * from the host's numbers. Alerts preview reads the shared alert seed.
 */
import { monitoredProjects } from '../../../src/data/projects';
import { createRuleEngine } from '../../../src/engine';
import { PageHeading, PANEL_CLASS } from '../tokens';
import { seedAlerts } from '../mockData';

const engine = createRuleEngine();

/** Mirrors DashboardPage's LEVEL_CLASS so badges look identical. */
const LEVEL_CLASS = {
  High: 'border-risk-high text-risk-high',
  Medium: 'border-risk-medium text-risk-medium',
  Low: 'border-risk-low text-risk-low',
} as const;

export default function OfficialOverviewPage() {
  const scored = monitoredProjects.map((p) => ({
    p,
    r: engine.predict(p.riskInput),
  }));
  const high = scored.filter((s) => s.r.level === 'High').length;
  const medium = scored.filter((s) => s.r.level === 'Medium').length;
  const low = scored.filter((s) => s.r.level === 'Low').length;
  const avg = Math.round(scored.reduce((sum, s) => sum + s.r.score, 0) / scored.length);
  const watchlist = [...scored].sort((a, b) => b.r.score - a.r.score).slice(0, 3);

  return (
    <div>
      <PageHeading eyebrow="OFFICIAL PORTAL" title="Portfolio Overview">
        Today's risk position across all monitored projects — same engine as
        the public Reports grid, with official-only actions layered on top.
      </PageHeading>

      {/* Stat band — the four numbers that matter first. */}
      <div className="mt-8 grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
        {[
          { label: 'High risk projects', value: high, accent: 'text-risk-high' },
          { label: 'Medium risk', value: medium, accent: 'text-risk-medium' },
          { label: 'Low risk', value: low, accent: 'text-risk-low' },
          { label: 'Average score', value: avg, accent: 'text-ink' },
        ].map((s) => (
          <div key={s.label} className="bg-surface p-5">
            <p className={`font-serif text-4xl font-bold tabular-nums ${s.accent}`}>
              {s.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-soft">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Watchlist — top three by score, linking into host detail pages. */}
        <section className={PANEL_CLASS}>
          <h2 className="font-serif text-xl font-bold text-ink">Watchlist — highest risk</h2>
          <ul className="mt-4 divide-y divide-line">
            {watchlist.map(({ p, r }) => (
              <li key={p.id} className="py-4 first:pt-0 last:pb-0">
                <a href={`#/projects/${encodeURIComponent(p.id)}`} className="group block">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-ink group-hover:text-accent">
                      {p.name}
                    </span>
                    <span className={`shrink-0 border-l-4 px-2 py-0.5 text-xs font-semibold ${LEVEL_CLASS[r.level]}`}>
                      {r.level} · {r.score}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">
                    {p.district}, {p.state} · {p.stage} · {p.progressPct}% acquired
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent alerts — last three from the shared feed. */}
        <section className={PANEL_CLASS}>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-ink">Latest alerts</h2>
            <a href="#/official/alerts" className="text-xs font-semibold text-accent hover:underline">
              View all
            </a>
          </div>
          <ul className="mt-4 space-y-4">
            {seedAlerts.slice(0, 3).map((a) => (
              <li key={a.id} className="border-l-2 border-line-strong pl-3">
                <p className="text-sm font-medium text-ink">{a.event}</p>
                <p className="mt-0.5 text-xs text-ink-faint">
                  {a.projectName} · {a.ago}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
