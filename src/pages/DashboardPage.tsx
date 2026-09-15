import { useMemo, useState } from 'react';
import { createRuleEngine, type RiskLevel } from '../engine';
import {
  monitoredProjects,
  uniqueStates,
  uniqueDistrictsFor,
  litigationNoteFor,
  type MonitoredProject,
} from '../data/projects';
import PlotBreakdownSection from '../components/PlotBreakdownSection';
import ProjectCard from '../components/ProjectCard';
import { TILE_GRID } from '../components/PhotoTile';

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

type RiskFilter = 'All' | RiskLevel;
type SortKey = 'risk' | 'progress' | 'name';

const SORT_LABELS: Array<{ key: SortKey; label: string }> = [
  { key: 'risk', label: 'Risk (high → low)' },
  { key: 'progress', label: 'Progress (least → most)' },
  { key: 'name', label: 'Name (A → Z)' },
];

/** Risk queue: the score, the level, and the one-line "why". */
function scoreAll(rows: MonitoredProject[]): ScoredRow[] {
  return rows
    .map((project) => {
      const r = engine.predict(project.riskInput);
      // A litigated project leads with its own litigation wording (data
      // file) instead of the engine's generic one-liner.
      const topReason =
        project.riskInput.litigationFlag
          ? litigationNoteFor(project)
          : (r.explanations[0] ?? '');
      return { project, score: r.score, level: r.level, topReason };
    })
    .sort((a, b) => b.score - a.score);
}

export default function DashboardPage() {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [query, setQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('All');
  const [sortKey, setSortKey] = useState<SortKey>('risk');

  const districts = useMemo(() => uniqueDistrictsFor(state), [state]);

  const scored = useMemo(
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

  // Free-text + risk-level filtering, then the chosen sort. Runs on the
  // already-scored list so the engine never re-runs for keystrokes.
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = scored.filter(
      ({ project, level }) =>
        (riskFilter === 'All' || level === riskFilter) &&
        (q === '' ||
          project.name.toLowerCase().includes(q) ||
          project.id.toLowerCase().includes(q) ||
          project.district.toLowerCase().includes(q) ||
          project.state.toLowerCase().includes(q)),
    );
    switch (sortKey) {
      case 'progress':
        return [...filtered].sort((a, b) => a.project.progressPct - b.project.progressPct);
      case 'name':
        return [...filtered].sort((a, b) => a.project.name.localeCompare(b.project.name));
      default:
        return filtered; // scoreAll already returns risk-descending order
    }
  }, [scored, query, riskFilter, sortKey]);

  const counts = {
    High: scored.filter((r) => r.level === 'High').length,
    Medium: scored.filter((r) => r.level === 'Medium').length,
    Low: scored.filter((r) => r.level === 'Low').length,
  };

  const onStateChange = (next: string) => {
    setState(next);
    setDistrict(''); // district list is state-scoped, so reset it
  };

  const filterChips: RiskFilter[] = ['All', 'High', 'Medium', 'Low'];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="border-b border-line pb-5">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink">
          Reports
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft">
          All monitored land acquisition projects, ranked by delay risk. Scores
          refresh on each data cycle; open a project for its full detail page.
        </p>
      </header>

      {/* Filters + risk legend, on one hairline band. The level legend
          doubles as clickable filter chips. */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border border-line bg-surface p-4">
        <div className="flex flex-wrap gap-4">
          <label className="block text-xs font-medium text-ink-soft">
            Search
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Project, ID, district…"
              className="mt-1 block w-52 border border-line-strong bg-parchment px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:outline-none"
            />
          </label>
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
          <label className="block text-xs font-medium text-ink-soft">
            Sort by
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="mt-1 block w-52 border border-line-strong bg-parchment px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:outline-none"
            >
              {SORT_LABELS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Risk legend → interactive filter chips (buttons with aria-pressed). */}
        <ul className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-soft" aria-label="Filter by risk level">
          {filterChips.map((lv) => {
            const active = riskFilter === lv;
            const count = lv === 'All' ? scored.length : counts[lv];
            return (
              <li key={lv}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setRiskFilter(active ? 'All' : lv)}
                  className={`flex items-center gap-1.5 border px-2 py-1 transition-colors ${
                    active
                      ? 'border-ink bg-ink text-parchment'
                      : 'border-transparent hover:border-line-strong'
                  }`}
                >
                  {lv !== 'All' && (
                    <span className={`inline-block h-2.5 w-2.5 border ${LEVEL_CLASS[lv]} bg-current`} />
                  )}
                  {lv} · {count}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Result count — announces filter outcome, clears in one click. */}
      <div className="mt-4 flex items-center justify-between text-xs text-ink-soft" aria-live="polite">
        <p>
          Showing <span className="font-semibold text-ink">{rows.length}</span> of{' '}
          {scored.length} monitored projects
        </p>
        {(query !== '' || riskFilter !== 'All' || state !== '' || district !== '') && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setRiskFilter('All');
              setState('');
              setDistrict('');
            }}
            className="font-medium text-accent hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Project risk grid — the Important Links tile pattern. Every scored
          project renders as a card in the same score order; no pagination,
          "load more", or slicing of the list. */}
      <div className={`mt-6 ${TILE_GRID}`} data-testid="project-grid">
        {rows.map(({ project, score, level, topReason }) => (
          <ProjectCard
            key={project.id}
            project={{ ...project, score, level, primaryDriver: topReason }}
          />
        ))}
        {rows.length === 0 && (
          <div className="border border-line bg-surface px-4 py-10 text-center sm:col-span-2 lg:col-span-3">
            <p className="text-sm text-ink-soft">
              No monitored projects match the selected filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setRiskFilter('All');
                setState('');
                setDistrict('');
              }}
              className="mt-3 border border-accent bg-accent px-4 py-1.5 text-sm font-semibold text-parchment hover:bg-accent-deep"
            >
              Reset filters
            </button>
          </div>
        )}
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
