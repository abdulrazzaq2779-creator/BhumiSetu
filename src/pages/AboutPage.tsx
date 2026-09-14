/**
 * About page (#/about) — the full methodology page, replacing the stub.
 *
 * Delivers on the header subtext's promise: the five scoring factors and
 * their weights, how scoring works, where the data comes from, and the
 * backtest evidence. Reuses existing design tokens (parchment surfaces,
 * hairline borders, terracotta accent, serif headings) and the already
 * credited documentary imagery from CREDITS.md — no new assets.
 */
import {
  createRuleEngine,
  FACTOR_WEIGHTS,
  RISK_THRESHOLDS,
} from '../engine';
import { DRIVER_LABELS } from '../engine/explain';
import { routeHref } from '../hooks/useRoute';
import heroHighway from '../assets/hero-highway.jpg';
import industrialA from '../assets/projects/industrial-a.jpg';
import farmlandA from '../assets/projects/farmland-a.jpg';

const engine = createRuleEngine();

/** Engine scores carry at most 1 decimal (round1) — print them cleanly. */
function fmtScore(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/** The five factors in scoring weight order, descending — as the engine weighs them. */
const FACTORS = (
  ['litigation', 'ownership_mismatch', 'compensation_gap', 'approval_delay', 'rr_backlog'] as const
).map((driver) => ({
  driver,
  weight: FACTOR_WEIGHTS[driver],
  measures:
    driver === 'litigation'
      ? 'Any active court case or stay order on the plots being acquired.'
      : driver === 'ownership_mismatch'
        ? 'Survey numbers where revenue, registration and mutation records disagree on who owns the land.'
        : driver === 'compensation_gap'
          ? 'How far the offered compensation sits below current market rate.'
          : driver === 'approval_delay'
            ? 'Days since the last required approval or notification, measured against the 90-day norm.'
            : 'Families still awaiting rehabilitation and resettlement after land changes hands.',
}));

const SCORING_STEPS: Array<{ title: string; body: string }> = [
  {
    title: 'Data arrives per plot',
    body: 'Each survey plot carries five numbers: the compensation gap, mismatched ownership records, whether litigation is active, approval delay in days and families awaiting resettlement.',
  },
  {
    title: 'Each factor is scored',
    body: 'Every factor earns points against its maximum — litigation contributes all 30 points when active, ownership mismatches scale up to their cap, and compensation gap rises until it saturates.',
  },
  {
    title: 'A weighted sum makes the score',
    body: 'The five contributions are added into a single 0–100 risk score. One disputed plot can flag High on its own; nothing is averaged away.',
  },
  {
    title: 'The score maps to a level',
    body: `Below ${RISK_THRESHOLDS.medium} the project is Low risk, ${RISK_THRESHOLDS.medium}–${RISK_THRESHOLDS.high} Medium, and ${RISK_THRESHOLDS.high} or above High — thresholds calibrated so a single active litigation flag already reaches Medium.`,
  },
  {
    title: 'Reasons and actions come out with it',
    body: 'The engine returns plain-language explanations and, per factor, the recommended intervention — no bare numbers, ever.',
  },
];

const DATA_SOURCES = [
  'Revenue and land-records systems (ownership and mutation data)',
  'Court filings and case-status feeds (litigation and stays)',
  'Compensation award and disbursement registers',
  'Approval and notification workflow logs',
  'Rehabilitation & resettlement progress reports',
];

const AUDIENCE = [
  {
    who: 'District Collectors',
    what: 'See which projects in the district are drifting toward delay — and which parcel to act on first.',
  },
  {
    who: 'State Revenue Departments',
    what: 'Track compensation, records and clearances across every acquisition in the state on one screen.',
  },
  {
    who: 'Implementing agencies',
    what: 'Know which land packages are safe to build on and which need escalation before schedules slip.',
  },
];

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="font-serif text-2xl font-bold tracking-tight text-ink">
      {children}
    </h2>
  );
}

export default function AboutPage() {
  const demo = engine.predict({
    compensationGapPct: 35,
    ownershipMismatchCount: 0,
    litigationFlag: true,
    approvalDelayDays: 20,
    rrFamiliesAwaitingResettlement: 120,
  });

  return (
    <div>
      {/* 1. Header — same heading and subtext the stub carried; the
            "under preparation" placeholder is gone. */}
      <div className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-ink">
            About Bhoomi Setu
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
            Detailed methodology: the five scoring factors, their weights, data
            sources and the backtest evidence behind the engine.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* 2. The Problem — text paired with a documentary image. */}
        <section aria-labelledby="about-problem">
          <SectionHeading>The problem</SectionHeading>
          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="max-w-3xl space-y-4 text-[15px] leading-relaxed text-ink-soft">
              <p>
                Land acquisition sits at the front of almost every major public
                project, and it is where most of them lose their schedule. The
                acquiring officer is balancing price expectations formed over
                generations of landholding, inheritance records that have never
                been updated, court cases filed the moment notice is served, and
                approvals moving between departments — all at once. Any one of
                these can hold a project for a season; two or three together can
                hold it for years.
              </p>
              <p>
                What makes the delays hard to catch early is not that the signs
                are invisible — it is that they live apart. The compensation
                register sits with one office, the mutation records with
                another, the case status with the court and the clearance file
                with a third department. Each looks routine in isolation. Only
                when they are read together does the pattern appear: a widening
                gap between offer and market rate, next to unresolved titles,
                next to a stay order. By the time anyone assembles that picture
                by hand, the protest or the injunction has already arrived.
              </p>
            </div>
            <figure className="border border-line bg-surface">
              <img
                src={farmlandA}
                alt="Paddy fields of the kind notified for acquisition"
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="border-t border-line px-3 py-2 text-[11px] text-ink-faint">
                Paddy fields under cultivation — where every acquisition begins.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* 3. The five risk factors — weights straight from FACTOR_WEIGHTS. */}
        <section aria-labelledby="about-factors" className="mt-12 border-t border-line pt-10">
          <SectionHeading>The five risk factors</SectionHeading>
          <p className="mt-2 max-w-3xl text-sm text-ink-soft">
            Every plot is scored against the same five factors. The weights are
            not arbitrary — litigation and ownership mismatches carry the most
            because they are the strongest predictors of a hard stop.
          </p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FACTORS.map((f) => (
              <li key={f.driver} className="flex flex-col border border-line bg-surface p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-base font-bold text-ink">
                    {DRIVER_LABELS[f.driver]}
                  </h3>
                  <span className="font-serif text-2xl font-bold tabular-nums text-accent">
                    {f.weight}
                    <span className="text-sm">%</span>
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-snug text-ink-soft">
                  {f.measures}
                </p>
                {/* Weight share bar — terracotta fill on the hairline track. */}
                <div className="mt-auto pt-4">
                  <div className="h-1.5 w-full bg-parchment-deep">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${f.weight}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
            <li className="flex flex-col justify-center border border-line bg-parchment-deep p-5">
              <p className="font-serif text-base font-bold text-ink">
                100% accounted for
              </p>
              <p className="mt-2 text-[13px] leading-snug text-ink-soft">
                The five weights sum to a full score of 100. Nothing else feeds
                the number — every point is traceable to a factor you can see
                and question.
              </p>
            </li>
          </ul>
        </section>

        {/* 4. How scoring works — numbered walkthrough with a live worked
              example from the engine itself. */}
        <section aria-labelledby="about-scoring" className="mt-12 border-t border-line pt-10">
          <SectionHeading>How scoring works</SectionHeading>
          <ol className="mt-5 grid gap-px border border-line bg-line md:grid-cols-5">
            {SCORING_STEPS.map((step, i) => (
              <li key={step.title} className="bg-surface p-5">
                <span className="font-serif text-xl font-bold text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-6 border border-line bg-surface p-5">
            <p className="text-xs font-medium text-ink-soft">
              Worked example — a plot with an active case, offers 35% below
              market and 120 families awaiting resettlement:
            </p>
            <p className="mt-2 font-serif text-2xl font-bold tabular-nums text-ink">
              {(
                [
                  'litigation',
                  'compensation_gap',
                  'rr_backlog',
                ] as const
              )
                .map((d) => fmtScore(demo.factorPoints?.[d] ?? 0))
                .join(' + ')}{' '}
              <span className="text-ink-faint">=</span>{' '}
              <span className="text-accent">{fmtScore(demo.score)}</span>{' '}
              <span className="text-sm font-semibold text-ink-soft">
                — {demo.level} risk
              </span>
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink-soft">
              {demo.explanations.map((explanation) => (
                <li key={explanation} className="flex gap-2">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                  {explanation}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-ink-faint">
              Scored live by the same engine that rates the Reports grid.
            </p>
          </div>
        </section>

        {/* 5. Data sources — honest about the representative demo data. */}
        <section aria-labelledby="about-data" className="mt-12 border-t border-line pt-10">
          <SectionHeading>Where the data comes from</SectionHeading>
          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <p className="max-w-3xl text-[15px] leading-relaxed text-ink-soft">
                In a production deployment the engine reads from the systems
                that already hold these records — no new data collection is
                asked of field staff. This demonstration build runs on
                representative data grounded in documented public cases, so the
                figures shown are indicative rather than live.
              </p>
              <ul className="mt-4 max-w-3xl space-y-2 border border-line bg-surface p-5">
                {DATA_SOURCES.map((source) => (
                  <li key={source} className="flex gap-2.5 text-sm text-ink-soft">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                    {source}
                  </li>
                ))}
              </ul>
            </div>
            <figure className="border border-line bg-surface">
              <img
                src={industrialA}
                alt="Construction equipment at a major irrigation project site"
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="border-t border-line px-3 py-2 text-[11px] text-ink-faint">
                Works on a major irrigation project — the delivery that waits on
                the files above.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* 6. Backtest evidence — a pointer to the proof, not a duplicate. */}
        <section aria-labelledby="about-backtest" className="mt-12 border-t border-line pt-10">
          <SectionHeading>Backtest evidence</SectionHeading>
          <div className="mt-5 border-l-4 border-accent bg-surface p-6">
            <p className="max-w-3xl font-serif text-lg leading-snug text-ink">
              A scoring model is only as good as its hindsight. Replaying the
              engine on a documented parcel as it stood in May 2025, it flags
              High Risk two months before the court stay became public news.
            </p>
            <a
              href={routeHref('backtest')}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
            >
              See how this model would have flagged a real delay months in
              advance
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        {/* 7. Who this is for + CTA to the Reports grid. */}
        <section aria-labelledby="about-audience" className="mt-12 border-t border-line pt-10">
          <SectionHeading>Who this is for</SectionHeading>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {AUDIENCE.map((a) => (
              <div key={a.who} className="border border-line bg-surface p-5">
                <h3 className="font-serif text-base font-bold text-ink">
                  {a.who}
                </h3>
                <p className="mt-2 text-[13px] leading-snug text-ink-soft">
                  {a.what}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-line bg-surface p-6">
            <p className="max-w-xl text-[15px] leading-relaxed text-ink-soft">
              The Reports grid shows every monitored project with its current
              score and the reasons behind it — open any card for the full
              breakdown.
            </p>
            <a
              href={routeHref('dashboard')}
              className="border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-parchment transition-colors hover:bg-accent-deep"
            >
              Open the Reports
            </a>
          </div>
        </section>

        {/* Closing note — imagery and grounding, as the portal does elsewhere. */}
        <figure className="mt-12 border border-line bg-surface">
          <img
            src={heroHighway}
            alt="Expressway under construction — the delivery that succeeds when acquisition stays on schedule"
            loading="lazy"
            decoding="async"
            className="aspect-[21/9] w-full object-cover"
          />
          <figcaption className="border-t border-line px-3 py-2 text-[11px] text-ink-faint">
            An expressway under construction in Karnataka — the outcome the
            portal is built to protect. Image: Victorgrigas / Wikimedia Commons,
            CC BY-SA 3.0.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
