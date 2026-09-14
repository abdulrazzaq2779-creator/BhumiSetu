import { useMemo, useState } from 'react';
import { createRuleEngine, type RiskLevel } from '../engine';
import {
  monitoredProjects,
  uniqueStates,
  uniqueDistrictsFor,
  type MonitoredProject,
} from '../data/projects';
import PlotBreakdownSection from '../components/PlotBreakdownSection';

const engine = createRuleEngine();

interface ScoredRow {
  project: MonitoredProject;
  score: number;
  level: RiskLevel;
  topReason: string;
}

const LEVEL_CLASS: Record<RiskLevel, string> = {
  High: 'border-risk-high text-risk-high',
  Medium: 'border-risk-medium text-risk-medium',
  Low: 'border-risk-low text-risk-low',
};

/** Risk queue: the score, the level, and the one-line "why". */
function scoreAll(rows: MonitoredProject[]): ScoredRow[] {
  return rows
    .map((project) => {
      const r = engine.predict(project.riskInput);
      return { project, score: r.score, level: r.level, topReason: r.explanations[0] ?? '' };
    })
    .sort((a, b) => b.score - a.score);
}

export default function DashboardPage() {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');

  const districts = useMemo(() => uniqueDistrictsFor(state), [state]);

  const rows = useMemo(
    () =>
      scoreAll(
        monitoredProjects.filter(
          (p) =>
            (state === '' || p.state === state) &&
            (district === '' || p.district === district),
        ),
      ),
    [state, district],
  );

  const counts = {
    High: rows.filter((r) => r.level === 'High').length,
    Medium: rows.filter((r) => r.level === 'Medium').length,
    Low: rows.filter((r) => r.level === 'Low').length,
  };

  const onStateChange = (next: string) => {
    setState(next);
    setDistrict(''); // district list is state-scoped, so reset it
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="border-b border-line pb-5">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink">
          Risk Dashboard
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft">
          All monitored land acquisition projects, ranked by parcel-level delay
          risk. Scores refresh on each data cycle; select a project for the
          full parcel breakdown.
        </p>
      </header>

      {/* Filters + risk legend, on one hairline band. */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border border-line bg-surface p-4">
        <div className="flex flex-wrap gap-4">
          <label className="block text-xs font-medium text-ink-soft">
            State / UT
            <select
              value={state}
              onChange={(e) => onStateChange(e.target.value)}
              className="mt-1 block w-52 border border-line-strong bg-parchment px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:outline-none"
            >
              <option value="">All States / UTs</option>
              {uniqueStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium text-ink-soft">
            District
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={state === ''}
              className="mt-1 block w-52 border border-line-strong bg-parchment px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:outline-none disabled:opacity-50"
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
          {(['High', 'Medium', 'Low'] as const).map((lv) => (
            <li key={lv} className="flex items-center gap-1.5">
              <span className={`inline-block h-2.5 w-2.5 border ${LEVEL_CLASS[lv]} bg-current`} />
              {lv} risk · {counts[lv]}
            </li>
          ))}
        </ul>
      </div>

      {/* Project risk table */}
      <div className="mt-6 overflow-x-auto border border-line bg-surface">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-parchment-deep text-left text-xs tracking-wide text-ink-soft">
              <th className="px-4 py-2.5 font-semibold">Risk</th>
              <th className="px-4 py-2.5 font-semibold">Project</th>
              <th className="px-4 py-2.5 font-semibold">District</th>
              <th className="px-4 py-2.5 font-semibold">Stage</th>
              <th className="px-4 py-2.5 font-semibold">Progress</th>
              <th className="px-4 py-2.5 font-semibold">Primary driver</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ project, score, level, topReason }) => (
              <tr key={project.id} className="border-b border-line last:border-b-0">
                <td className="px-4 py-3">
                  <span
                    className={`inline-block min-w-[4.5rem] border-l-4 px-2 py-1 text-center text-xs font-semibold ${LEVEL_CLASS[level]}`}
                  >
                    {level} · {score}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="block font-medium text-ink">{project.name}</span>
                  <span className="text-xs text-ink-faint">{project.id}</span>
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {project.district}
                  <span className="block text-xs text-ink-faint">{project.state}</span>
                </td>
                <td className="px-4 py-3 text-ink-soft">{project.stage}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-16 bg-parchment-deep">
                      <span
                        className="block h-full bg-ink-soft"
                        style={{ width: `${project.progressPct}%` }}
                      />
                    </span>
                    <span className="text-xs tabular-nums text-ink-soft">
                      {project.progressPct}%
                    </span>
                  </span>
                </td>
                <td className="max-w-[16rem] px-4 py-3 text-[13px] text-ink-soft">
                  {topReason}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  No monitored projects match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Feature 5 — parcel-level drill-down, added below the table.
          Everything above this line is untouched. */}
      <PlotBreakdownSection />

      <p className="mt-4 text-xs leading-relaxed text-ink-faint">
        Risk levels derive from the parcel scoring engine (Feature 1):
        compensation gap, ownership-record mismatches, active litigation,
        approval hand-off delay and rehabilitation backlog. Scores of 50 and
        above are classed High risk.
      </p>
    </div>
  );
}
