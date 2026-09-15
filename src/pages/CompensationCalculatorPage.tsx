/**
 * Compensation Calculator (#/compensation-calculator) — UI-only estimator.
 *
 * Mirrors the RFCTLARR Act 2013 compensation structure conceptually:
 * market value (here, the circle rate offered vs the market rate claimed)
 * × rural/urban statutory multiplier + solatium. Everything recalculates
 * live on input change — there is no submit step. Numbers are illustrative,
 * not legal advice or an official award.
 */
import { useMemo, useState } from 'react';
import { createRuleEngine } from '../engine';

const engine = createRuleEngine();

const inr = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

/** Statutory multipliers (RFCTLARR: rural 1.0–2.0, urban fixed at 1.0). */
const RURAL_MULTIPLIERS = [1, 1.25, 1.5, 1.75, 2] as const;

const inputClass =
  'mt-1 block w-full border border-line-strong bg-parchment px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:outline-none';

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs font-medium text-ink-soft">
      {label}
      {children}
      {hint && <span className="mt-1 block text-[11px] font-normal text-ink-faint">{hint}</span>}
    </label>
  );
}

/** One side of the comparison: label, amount and a proportional bar. */
function ComparisonBar({
  label,
  amount,
  widthPct,
  barClass,
}: {
  label: string;
  amount: number;
  widthPct: number;
  barClass: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="font-serif text-lg font-bold text-ink">{inr(amount)}</span>
      </div>
      <div className="mt-1.5 h-3 w-full border border-line bg-parchment">
        <div
          className={`h-full transition-[width] duration-500 ease-out ${barClass}`}
          style={{ width: `${Math.min(100, Math.max(0, widthPct))}%` }}
        />
      </div>
    </div>
  );
}

export default function CompensationCalculatorPage() {
  const [areaAcres, setAreaAcres] = useState('2');
  const [circleRate, setCircleRate] = useState('800000');
  const [marketRate, setMarketRate] = useState('2200000');
  const [landType, setLandType] = useState('Agricultural');
  const [areaClass, setAreaClass] = useState<'Rural' | 'Urban'>('Rural');
  const [ruralMultiplier, setRuralMultiplier] = useState<string>('2');
  const [solatiumPct, setSolatiumPct] = useState('100');

  const calc = useMemo(() => {
    const area = Math.max(0, Number(areaAcres) || 0);
    const circle = Math.max(0, Number(circleRate) || 0);
    const market = Math.max(0, Number(marketRate) || 0);
    const solatium = Math.max(0, Number(solatiumPct) || 0);
    const multiplier = areaClass === 'Urban' ? 1 : Number(ruralMultiplier) || 1;

    // Same multiplier + solatium on both sides so the gap isolates the rate.
    const gross = (rate: number) => area * rate * multiplier;
    const withSolatium = (grossValue: number) =>
      grossValue + (grossValue * solatium) / 100;

    const offered = withSolatium(gross(circle));
    const marketEquivalent = withSolatium(gross(market));
    const gapPct = offered > 0 ? ((marketEquivalent - offered) / offered) * 100 : 0;

    // Reuse the real risk engine: how many compensation-gap points a plot
    // with this gap would earn (saturating scale, 20-point weight).
    const compGapPoints = engine.predict({
      compensationGapPct: Math.max(0, gapPct),
      ownershipMismatchCount: 0,
      litigationFlag: false,
      approvalDelayDays: 0,
      rrFamiliesAwaitingResettlement: 0,
    }).factorPoints?.compensation_gap ?? 0;

    return { offered, marketEquivalent, gapPct, compGapPoints, multiplier };
  }, [areaAcres, circleRate, marketRate, landType, areaClass, ruralMultiplier, solatiumPct]);

  const maxAmount = Math.max(calc.offered, calc.marketEquivalent);
  const gapShare = maxAmount > 0 ? (calc.offered / maxAmount) * 100 : 0;
  const marketShare = maxAmount > 0 ? (calc.marketEquivalent / maxAmount) * 100 : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="border-b border-line pb-5">
        <p className="font-serif text-sm italic text-accent">SERVICES</p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-ink">
          Compensation Calculator
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft">
          Estimate what a land parcel's compensation could look like — and how
          far an offered figure sits from the market-rate equivalent.
        </p>
      </header>

      {/* What this tool does — stated up front, before the form. */}
      <p className="mt-6 border-l-4 border-accent bg-surface px-4 py-3 text-sm leading-relaxed text-ink-soft">
        This calculator estimates compensation along the lines of the RFCTLARR
        Act 2013 — market value × statutory multiplier + solatium — for the
        figures you enter. It is illustrative only: actual awards depend on
        notification dates, class of land and the record on file. It is not an
        official assessment.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        {/* Left — the inputs. Recalculates live; no submit button. */}
        <form
          className="border border-line bg-surface p-6 sm:p-8"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Land area (acres)">
              <input
                type="number"
                min="0"
                step="0.01"
                value={areaAcres}
                onChange={(e) => setAreaAcres(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Land type">
              <select
                value={landType}
                onChange={(e) => setLandType(e.target.value)}
                className={inputClass}
              >
                <option>Agricultural</option>
                <option>Non-Agricultural</option>
                <option>Assigned</option>
              </select>
            </Field>
            <Field
              label="Circle rate (₹ / acre)"
              hint="Government-assessed rate used in offers."
            >
              <input
                type="number"
                min="0"
                step="1000"
                value={circleRate}
                onChange={(e) => setCircleRate(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field
              label="Market rate (₹ / acre)"
              hint="Prevailing local rate, for comparison."
            >
              <input
                type="number"
                min="0"
                step="1000"
                value={marketRate}
                onChange={(e) => setMarketRate(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Area classification">
              <select
                value={areaClass}
                onChange={(e) => setAreaClass(e.target.value as 'Rural' | 'Urban')}
                className={inputClass}
              >
                <option>Rural</option>
                <option>Urban</option>
              </select>
            </Field>
            <Field
              label="Statutory multiplier"
              hint={
                areaClass === 'Urban'
                  ? 'Urban areas are fixed at ×1.0 under the Act.'
                  : undefined
              }
            >
              <select
                value={areaClass === 'Urban' ? '1' : ruralMultiplier}
                onChange={(e) => setRuralMultiplier(e.target.value)}
                disabled={areaClass === 'Urban'}
                className={`${inputClass} disabled:opacity-50`}
              >
                {RURAL_MULTIPLIERS.map((m) => (
                  <option key={m} value={m}>
                    ×{m}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Solatium (%)"
              hint="Statutory default is 100% of the multiplied value."
            >
              <input
                type="number"
                min="0"
                step="10"
                value={solatiumPct}
                onChange={(e) => setSolatiumPct(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          {landType === 'Assigned' && (
            <p className="mt-4 text-[11px] leading-relaxed text-ink-faint">
              Note: compensation parity for assigned land is a recurring
              dispute — see the NIMZ Zaheerabad case on the risk dashboard.
            </p>
          )}
        </form>

        {/* Right — the live result and the offer-vs-market gap. */}
        <div className="space-y-6">
          <div className="border border-line bg-surface p-6 sm:p-8">
            <h2 className="font-serif text-lg font-bold text-ink">
              Estimated total compensation
            </h2>
            <p className="mt-2 font-serif text-3xl font-bold text-accent">
              {inr(calc.offered)}
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              {areaAcres || '0'} acre(s) × {inr(Number(circleRate) || 0)}/acre ×
              {' '}{calc.multiplier} multiplier + {solatiumPct || '0'}% solatium
            </p>

            <div className="mt-6 space-y-5">
              <ComparisonBar
                label="Offered compensation (circle rate)"
                amount={calc.offered}
                widthPct={gapShare}
                barClass="bg-ink"
              />
              <ComparisonBar
                label="Market rate equivalent"
                amount={calc.marketEquivalent}
                widthPct={marketShare}
                barClass="bg-accent"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <p className="text-sm text-ink-soft">
                Gap between offer and market equivalent
              </p>
              <p className="border border-accent bg-parchment px-2.5 py-1 font-serif text-lg font-bold text-accent">
                {calc.gapPct > 0 ? `+${calc.gapPct.toFixed(1)}%` : '0%'}
              </p>
            </div>
          </div>

          <div className="border border-line bg-surface p-6 text-sm leading-relaxed text-ink-soft">
            <p>
              On the portal's risk scale, a compensation gap of this size would
              contribute{' '}
              <span className="font-semibold text-ink">
                {calc.compGapPoints.toFixed(1)} points
              </span>{' '}
              toward a plot's risk score — the same factor driving many High
              risk flags on the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
