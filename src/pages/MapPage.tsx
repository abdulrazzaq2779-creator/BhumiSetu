import RiskMap from '../components/RiskMap';
import { mapPoints } from '../data/mapPoints';
import type { RiskLevel } from '../engine/types';

const LEVEL_CLASS: Record<RiskLevel, string> = {
  High: 'border-risk-high text-risk-high',
  Medium: 'border-risk-medium text-risk-medium',
  Low: 'border-risk-low text-risk-low',
};

/**
 * Risk Map page: every monitored project pinned at its location, coloured
 * by risk level, with a clickable index of all points below the map.
 */
export default function MapPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="border-b border-line pb-5">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink">
          Risk Map
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft">
          Geographic view of all monitored land acquisition projects. Marker
          colour reflects the current risk level; select a marker for the
          project's score and primary delay drivers.
        </p>
      </header>

      <div className="mt-6 border border-line bg-surface">
        <RiskMap />
      </div>

      <section className="mt-8">
        <h2 className="font-serif text-lg font-bold text-ink">
          All monitored projects ({mapPoints.length})
        </h2>
        <ul className="mt-3 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {mapPoints.map((p) => (
            <li key={p.id} className="bg-surface p-4">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-block border-l-4 px-2 py-0.5 text-xs font-semibold ${LEVEL_CLASS[p.riskLevel]}`}
                >
                  {p.riskLevel} · {p.riskScore}
                </span>
                <span className="text-[11px] text-ink-faint">{p.id}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-ink">{p.name}</p>
              <p className="text-xs text-ink-soft">
                {p.district}, {p.state} · {p.progressPct}% acquired
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
