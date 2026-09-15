/**
 * OfficialPredictPage — "new location / prediction" form.
 *
 * A what-if console: five sliders matching the engine's real inputs.
 * The prediction recomputes on every change via the host's own rule engine
 * (createRuleEngine from src/engine) — the SAME code path the Risk
 * Dashboard uses, so demo numbers stay consistent portfolio-wide.
 */
import { useMemo, useState } from 'react';
import { createRuleEngine } from '../../../src/engine';
import { PageHeading, PANEL_CLASS, PRIMARY_BUTTON_CLASS, SECONDARY_BUTTON_CLASS } from '../tokens';

const engine = createRuleEngine();

const LEVEL_CLASS = {
  High: 'border-risk-high text-risk-high',
  Medium: 'border-risk-medium text-risk-medium',
  Low: 'border-risk-low text-risk-low',
} as const;

const DEFAULTS = {
  compensationGapPct: 35,
  ownershipMismatchCount: 1,
  litigationFlag: false,
  approvalDelayDays: 60,
  rrFamiliesAwaitingResettlement: 40,
};

type Inputs = typeof DEFAULTS;

const SLIDERS: Array<{
  key: keyof Inputs;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}> = [
  { key: 'compensationGapPct', label: 'Compensation gap vs market rate', min: 0, max: 100, step: 1, format: (v) => `${v}% below market` },
  { key: 'ownershipMismatchCount', label: 'Ownership-record mismatches', min: 0, max: 5, step: 1, format: (v) => `${v} parcel${v === 1 ? '' : 's'}` },
  { key: 'approvalDelayDays', label: 'Approval hand-off delay', min: 0, max: 240, step: 5, format: (v) => `${v} days` },
  { key: 'rrFamiliesAwaitingResettlement', label: 'Families awaiting resettlement', min: 0, max: 250, step: 10, format: (v) => `${v} families` },
];

export default function OfficialPredictPage() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const prediction = useMemo(() => engine.predict({
    compensationGapPct: inputs.compensationGapPct,
    ownershipMismatchCount: inputs.ownershipMismatchCount,
    litigationFlag: inputs.litigationFlag,
    approvalDelayDays: inputs.approvalDelayDays,
    rrFamiliesAwaitingResettlement: inputs.rrFamiliesAwaitingResettlement,
  }), [inputs]);

  const set = (key: keyof Inputs, value: number | boolean) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  return (
    <div>
      <PageHeading eyebrow="OFFICIAL PORTAL" title="Predict Risk">
        Move the sliders to model a hypothetical parcel — the score and its
        explanation update instantly using the production scoring engine.
      </PageHeading>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className={PANEL_CLASS}>
          <h2 className="font-serif text-xl font-bold text-ink">Parcel inputs</h2>

          {/* Litigation is the binary switch — styled as a toggle row. */}
          <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 border border-line bg-parchment px-4 py-3">
            <span>
              <span className="block text-sm font-medium text-ink">Active litigation or stay order</span>
              <span className="mt-0.5 block text-xs text-ink-soft">Any court case on the parcel adds 30 points on its own</span>
            </span>
            <input
              type="checkbox"
              checked={inputs.litigationFlag}
              onChange={(e) => set('litigationFlag', e.target.checked)}
              className="h-5 w-5 accent-accent"
            />
          </label>

          {SLIDERS.map((s) => (
            <label key={s.key} className="mt-5 block">
              <span className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-ink-soft">{s.label}</span>
                <span className="text-sm font-semibold tabular-nums text-ink">
                  {s.format(inputs[s.key] as number)}
                </span>
              </span>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={inputs[s.key] as number}
                onChange={(e) => set(s.key, Number(e.target.value))}
                className="mt-2 w-full accent-accent"
              />
            </label>
          ))}

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => setInputs(DEFAULTS)} className={SECONDARY_BUTTON_CLASS}>
              Reset to sample case
            </button>
            <button
              type="button"
              onClick={() => setInputs({
                compensationGapPct: 87,
                ownershipMismatchCount: 1,
                litigationFlag: true,
                approvalDelayDays: 45,
                rrFamiliesAwaitingResettlement: 60,
              })}
              className={PRIMARY_BUTTON_CLASS}
            >
              Load NIMZ Zaheerabad case
            </button>
          </div>
        </section>

        {/* Live prediction card. */}
        <section className={`${PANEL_CLASS} self-start`}>
          <h2 className="font-serif text-xl font-bold text-ink">Prediction</h2>
          <div className="mt-4 border-l-4 bg-parchment px-4 py-3" aria-live="polite">
            <span className={`text-xs font-semibold ${LEVEL_CLASS[prediction.level].split(' ')[1]}`}>
              {prediction.level.toUpperCase()} RISK
            </span>
            <p className="mt-1 font-serif text-5xl font-bold tabular-nums text-ink">
              {prediction.score}
            </p>
            <p className="text-xs text-ink-faint">of 100 — recomputed live</p>
          </div>

          <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Why this score
          </h3>
          <ul className="mt-2 space-y-2">
            {prediction.explanations.map((ex, i) => (
              <li key={i} className="border-l-2 border-line-strong pl-3 text-sm leading-relaxed text-ink-soft">
                {ex}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
