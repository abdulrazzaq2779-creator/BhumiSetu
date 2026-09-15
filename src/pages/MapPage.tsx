import { lazy, Suspense, useMemo, useState } from 'react';
import { mapPoints } from '../data/mapPoints';
import type { RiskLevel } from '../engine/types';

/**
 * maplibre (≈700 KB min) loads only when this page is opened — the main
 * bundle stays lean for every other route. The fallback matches the map's
 * footprint so layout doesn't jump.
 */
const RiskMap = lazy(() => import('../components/RiskMap'));

const LEVEL_CLASS: Record<RiskLevel, string> = {
  High: 'border-risk-high text-risk-high',
  Medium: 'border-risk-medium text-risk-medium',
  Low: 'border-risk-low text-risk-low',
};

const ALL_LEVELS: RiskLevel[] = ['High', 'Medium', 'Low'];

/**
 * Risk Map page: every monitored project pinned at its location, coloured
 * by risk level. Legend entries are toggle filters (they show/hide pins
 * live); the index list below is clickable — selecting a project flies the
 * map to its pin and opens the detail popup.
 */
export default function MapPage() {
  const [visible, setVisible] = useState<RiskLevel[]>(ALL_LEVELS);
  const [focusId, setFocusId] = useState<string | null>(null);

  const toggle = (lv: RiskLevel) => {
    setVisible((prev) =>
      prev.includes(lv) ? prev.filter((x) => x !== lv) : [...prev, lv],
    );
  };

  const shown = useMemo(
    () => mapPoints.filter((p) => visible.includes(p.riskLevel)),
    [visible],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="border-b border-line pb-5">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink">
          Risk Map
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft">
          Geographic view of all monitored land acquisition projects. Marker
          colour reflects the current risk level; toggle a level to filter the
          pins, or select a project below to fly to it.
        </p>
      </header>

      <div className="mt-6 border border-line bg-surface">
        <Suspense
          fallback={
            <div
              className="flex h-[420px] w-full items-center justify-center bg-parchment-deep/40 text-sm text-ink-soft sm:h-[520px]"
              role="status"
              aria-live="polite"
            >
              Loading map…
            </div>
          }
        >
          <RiskMap visibleLevels={visible} focusId={focusId} />
        </Suspense>
      </div>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-lg font-bold text-ink">
            All monitored projects ({shown.length})
          </h2>
          <div
            className="flex flex-wrap items-center gap-2 text-xs text-ink-soft"
            role="group"
            aria-label="Toggle risk levels on the map"
          >
            {ALL_LEVELS.map((lv) => {
              const active = visible.includes(lv);
              const count = mapPoints.filter((p) => p.riskLevel === lv).length;
              return (
                <button
                  key={lv}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(lv)}
                  className={`flex items-center gap-1.5 border px-2 py-1 transition-colors ${
                    active
                      ? 'border-ink bg-ink text-parchment'
                      : 'border-line-strong text-ink-soft line-through opacity-60 hover:opacity-100'
                  }`}
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{
                      background: { High: '#b3261e', Medium: '#b7791f', Low: '#2f6b3a' }[lv],
                    }}
                  />
                  {lv} · {count}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-3 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => {
            const selected = focusId === p.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setFocusId(p.id)}
                  aria-pressed={selected}
                  className={`w-full bg-surface p-4 text-left transition-colors ${
                    selected
                      ? 'bg-parchment-deep/70 ring-1 ring-inset ring-accent'
                      : 'hover:bg-parchment-deep/40'
                  }`}
                >
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
                </button>
              </li>
            );
          })}
        </ul>
        {shown.length === 0 && (
          <p className="mt-3 border border-line bg-surface px-4 py-6 text-center text-sm text-ink-soft">
            All levels hidden — toggle a risk level back on to see pins.
          </p>
        )}
      </section>
    </div>
  );
}
