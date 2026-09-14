/**
 * Project detail PAGE — the click-through target for dashboard cards
 * ("Read More"), replacing the old detail modal.
 *
 * Sections: full-width thematic hero (same image the card uses) under a
 * dark gradient, "Why is this delayed?" factor breakdown with contribution
 * bars, "What could fix this?" recommendation cards, and a live what-if
 * simulator that re-scores the project through the SAME rule engine — no
 * new math, only new structure around the existing data and logic.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  createRuleEngine,
  FACTOR_WEIGHTS,
  type PlotRiskInput,
  type RiskDriverId,
} from '../engine';
import { DRIVER_LABELS, factorToPlainLanguage } from '../engine/explain';
import { getRecommendation } from '../engine/recommend';
import { monitoredProjects } from '../data/projects';
import { routeHref } from '../hooks/useRoute';

const engine = createRuleEngine();

/** All five drivers in the engine's canonical order (sorted for display). */
const ALL_DRIVERS: RiskDriverId[] = [
  'litigation',
  'ownership_mismatch',
  'compensation_gap',
  'approval_delay',
  'rr_backlog',
];

const LEVEL_CLASS: Record<string, string> = {
  High: 'border-risk-high text-risk-high',
  Medium: 'border-risk-medium text-risk-medium',
  Low: 'border-risk-low text-risk-low',
};

/** Engine scores carry at most 1 decimal (round1) — print them cleanly. */
function fmtScore(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export default function ProjectDetailPage({ projectId }: { projectId: string }) {
  const project = useMemo(
    () => monitoredProjects.find((p) => p.id === projectId),
    [projectId],
  );

  // Detail pages open at the top, like a normal page navigation.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  const [expanded, setExpanded] = useState<RiskDriverId | null>(null);
  // What-if inputs start from the project's real data; App keys this
  // component by project id, so navigating between projects resets it.
  const [whatIf, setWhatIf] = useState<PlotRiskInput>(
    project?.riskInput ?? {
      compensationGapPct: 0,
      ownershipMismatchCount: 0,
      litigationFlag: false,
      approvalDelayDays: 0,
      rrFamiliesAwaitingResettlement: 0,
    },
  );

  if (!project) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="border border-line bg-surface p-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-ink">
            Project not found
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            No monitored project carries the ID “{projectId}”.
          </p>
          <a
            href={routeHref('dashboard')}
            className="mt-5 inline-block border border-accent bg-accent px-5 py-2 text-sm font-semibold text-parchment transition-colors hover:bg-accent-deep"
          >
            Back to Reports
          </a>
        </div>
      </div>
    );
  }

  // Base scoring — the same engine call the dashboard grid makes.
  const base = engine.predict(project.riskInput);
  // Live re-score of the what-if scenario — same function, different inputs.
  const whatIfPred = engine.predict(whatIf);
  const delta = Math.round((whatIfPred.score - base.score) * 10) / 10;

  const factorRows = ALL_DRIVERS.map((driver) => ({
    driver,
    points: base.factorPoints?.[driver] ?? 0,
    max: FACTOR_WEIGHTS[driver],
    statement: factorToPlainLanguage(driver, project.riskInput),
  })).sort((a, b) => b.points - a.points || b.max - a.max);

  const primaryDriver = base.explanations[0] ?? '';

  return (
    <div>
      {/* Breadcrumb / back navigation to the Reports grid. */}
      <div className="border-b border-line bg-surface">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3 text-sm sm:px-6"
        >
          <a
            href={routeHref('dashboard')}
            className="font-medium text-accent hover:underline"
          >
            ← Back to Reports
          </a>
          <span aria-hidden="true" className="text-ink-faint">
            /
          </span>
          <span className="text-ink-soft">{project.name}</span>
        </nav>
      </div>

      {/* 1. Hero — the project's own thematic image (same one its card
             reveals on hover) under a dark gradient, matching the landing
             hero's overlay treatment. */}
      <section className="relative border-b border-line">
        <img
          src={project.thumbnailImage}
          alt={`${project.name} — thematic project photo`}
          className="h-64 w-full object-cover object-center sm:h-80"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/60 to-ink/25"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6">
            <span
              className={`inline-block border-l-4 bg-surface/85 px-2 py-1 text-xs font-semibold ${LEVEL_CLASS[base.level]}`}
            >
              {base.level} risk · {fmtScore(base.score)}
            </span>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-parchment sm:text-4xl">
              {project.name}
            </h1>
            <p className="mt-1 text-sm text-parchment/80">
              {project.district}, {project.state} · {project.id}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Status facts — everything the old modal showed, kept on the page. */}
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-ink-soft">Stage</dt>
            <dd className="mt-0.5 text-ink">{project.stage}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-ink-soft">Progress</dt>
            <dd className="mt-0.5 text-ink">{project.progressPct}% acquired</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-ink-soft">Primary driver</dt>
            <dd className="mt-0.5 text-ink">{primaryDriver}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-ink-soft">Status summary</dt>
            <dd className="mt-0.5 leading-relaxed text-ink-soft">
              {project.summary}
            </dd>
          </div>
        </dl>

        {/* 2. Why is this delayed? — every factor with its point
               contribution; click a row for the plain-language detail
               (factorToPlainLanguage) plus the engine's own explanation. */}
        <section className="mt-10 border-t border-line pt-8">
          <h2 className="font-serif text-xl font-bold tracking-tight text-ink">
            Why is this delayed?
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Each factor's contribution to the {fmtScore(base.score)}-point risk
            score, highest first. Select a factor for the plain-language detail.
          </p>

          <ul className="mt-4 space-y-3">
            {factorRows.map((row) => {
              const isOpen = expanded === row.driver;
              const detailIdx = base.topDrivers.indexOf(row.driver);
              const detail = detailIdx >= 0 ? base.explanations[detailIdx] : '';
              return (
                <li key={row.driver} className="border border-line bg-surface">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setExpanded(isOpen ? null : row.driver)}
                    className="flex w-full items-start justify-between gap-4 px-4 py-3 text-left hover:bg-parchment/60"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-ink">
                        {DRIVER_LABELS[row.driver]}
                      </span>
                      <span className="mt-0.5 block text-xs text-ink-soft">
                        {row.statement}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-sm font-semibold tabular-nums text-accent">
                        +{fmtScore(row.points)} pts
                      </span>
                      <span className="block text-[11px] text-ink-faint">
                        of {row.max} max
                      </span>
                    </span>
                  </button>

                  {/* Contribution bar — share of this factor's max weight. */}
                  <div className="px-4 pb-3">
                    <div className="h-1.5 w-full bg-parchment-deep">
                      <div
                        className="h-full bg-accent motion-safe:transition-all motion-safe:duration-500"
                        style={{
                          width: `${Math.min(100, (row.points / row.max) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-line px-4 py-3">
                      <p className="text-[13px] leading-relaxed text-ink-soft">
                        {row.statement}
                      </p>
                      {detail && (
                        <p className="mt-2 border-l-2 border-line-strong pl-3 text-[13px] italic leading-relaxed text-ink-soft">
                          {detail}
                        </p>
                      )}
                      {row.points === 0 && (
                        <p className="mt-2 text-[13px] text-ink-faint">
                          Not contributing points in the current data cycle.
                        </p>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* 3. What could fix this? — one card per active risk factor, each
               with its playbook action from getRecommendation(). */}
        <section className="mt-10 border-t border-line pt-8">
          <h2 className="font-serif text-xl font-bold tracking-tight text-ink">
            What could fix this?
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            A suggested action for each factor currently contributing to the
            score.
          </p>

          {base.topDrivers.length > 0 ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {base.topDrivers.map((driver) => (
                <article
                  key={driver}
                  className="flex flex-col border border-line bg-surface p-5"
                >
                  <h3 className="font-serif text-base font-bold text-ink">
                    {DRIVER_LABELS[driver]}
                  </h3>
                  <p className="mt-1 text-[13px] leading-snug text-ink-soft">
                    {factorToPlainLanguage(driver, project.riskInput)}
                  </p>
                  <p className="mt-3 border-t border-line pt-3 text-[13px] text-ink-soft">
                    <span className="font-semibold text-accent">
                      Suggested action:
                    </span>{' '}
                    {getRecommendation(driver)}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-4 border border-line bg-surface px-4 py-6 text-center text-sm text-ink-soft">
              No active risk factors — this project is scoring Low with no
              contributing drivers.
            </p>
          )}
        </section>

        {/* 4. What-if — move a lever and the SAME rule engine re-scores the
               project live; the official score is untouched. */}
        <section className="mt-10 border-t border-line pt-8">
          <h2 className="font-serif text-xl font-bold tracking-tight text-ink">
            What-if: adjust a factor
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Move a lever and watch the risk score recalculate against the same
            engine that produced {fmtScore(base.score)}.
          </p>

          <div className="mt-4 grid gap-8 border border-line bg-surface p-5 lg:grid-cols-2">
            {/* Levers */}
            <div>
              <label className="block text-xs font-medium text-ink-soft">
                Compensation gap — {whatIf.compensationGapPct}% below market
                rate
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={whatIf.compensationGapPct}
                  onChange={(e) =>
                    setWhatIf((w) => ({
                      ...w,
                      compensationGapPct: Number(e.target.value),
                    }))
                  }
                  className="mt-2 w-full accent-accent"
                />
              </label>

              <div className="mt-4">
                <span className="block text-xs font-medium text-ink-soft">
                  Litigation
                </span>
                <button
                  type="button"
                  aria-pressed={!whatIf.litigationFlag}
                  onClick={() =>
                    setWhatIf((w) => ({ ...w, litigationFlag: !w.litigationFlag }))
                  }
                  className={`mt-2 border px-3 py-1.5 text-sm font-medium transition-colors ${
                    whatIf.litigationFlag
                      ? 'border-line-strong text-ink-soft hover:text-ink'
                      : 'border-accent bg-accent text-parchment hover:bg-accent-deep'
                  }`}
                >
                  {whatIf.litigationFlag
                    ? 'Active — mark resolved in scenario'
                    : 'Resolved in this scenario'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setWhatIf(project.riskInput)}
                className="mt-5 border border-line-strong px-3 py-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
              >
                Reset to current data
              </button>
            </div>

            {/* Live score readout */}
            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-serif text-4xl font-bold tabular-nums text-ink-soft">
                  {fmtScore(base.score)}
                </span>
                <span aria-hidden="true" className="text-2xl text-ink-faint">
                  →
                </span>
                <span
                  className={`font-serif text-4xl font-bold tabular-nums ${
                    delta < 0
                      ? 'text-forest'
                      : delta > 0
                        ? 'text-risk-high'
                        : 'text-ink'
                  }`}
                >
                  {fmtScore(whatIfPred.score)}
                </span>
                <span
                  className={`inline-block border-l-4 px-2 py-1 text-xs font-semibold ${LEVEL_CLASS[whatIfPred.level]}`}
                >
                  {whatIfPred.level}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-ink-soft">
                    <span>Current</span>
                    <span className="tabular-nums">{fmtScore(base.score)}</span>
                  </div>
                  <div className="mt-1 h-2 bg-parchment-deep">
                    <div
                      className="h-full bg-ink-soft"
                      style={{ width: `${Math.min(100, base.score)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-ink-soft">
                    <span>What-if</span>
                    <span className="tabular-nums">
                      {fmtScore(whatIfPred.score)}
                    </span>
                  </div>
                  <div className="mt-1 h-2 bg-parchment-deep">
                    <div
                      className="h-full bg-accent motion-safe:transition-all motion-safe:duration-500"
                      style={{ width: `${Math.min(100, whatIfPred.score)}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="mt-3 text-[13px] tabular-nums text-ink-soft">
                {delta === 0
                  ? 'No change from the current data.'
                  : `${delta > 0 ? '+' : '−'}${fmtScore(Math.abs(delta))} pts ${
                      delta < 0 ? 'lower risk' : 'higher risk'
                    }`}
              </p>
            </div>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
            Recalculated live by the same rule engine that scores the Reports
            grid — scenario only; the project's official score is unchanged.
          </p>
        </section>
      </div>
    </div>
  );
}
