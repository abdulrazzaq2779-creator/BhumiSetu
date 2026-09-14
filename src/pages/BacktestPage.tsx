/**
 * Feature 4 — Backtest Proof page (new route: #/backtest).
 *
 * A static, pre-scripted proof panel: run the engine on the parcel's data
 * as it stood BEFORE the public court stay, and show it would already have
 * been flagged High Risk — months ahead of the public event. The score is
 * computed live from the frozen snapshot; the narrative dates are fixed.
 */
import { createRuleEngine } from '../engine';
import { factorToPlainLanguage, DRIVER_LABELS } from '../engine/explain';
import {
  backtestPlot,
  backtestInput,
  backtestSnapshotDate,
  publicEventDate,
  publicEventNote,
  LEAD_TIME_MONTHS,
} from '../data/backtestCase';

const engine = createRuleEngine();

export default function BacktestPage() {
  const prediction = engine.predict(backtestInput);
  const today = engine.predict(backtestPlot.input);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="border-b border-line pb-5">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink">
          Backtest Proof
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft">
          The engine's factors were present in the data long before risk became
          public news. This panel reruns the scoring engine on a frozen
          snapshot of one documented parcel — the Musi Riverfront's Gandipet
          survey plot — as it stood before the court stay was issued.
        </p>
      </header>

      {/* The proof statement */}
      <div className="mt-8 border-l-4 border-accent bg-surface p-6">
        <p className="font-serif text-xl leading-snug text-ink">
          As of {backtestSnapshotDate}, this plot would have been flagged{' '}
          <span className="font-bold text-risk-high">
            High Risk (score {prediction.score})
          </span>{' '}
          — {LEAD_TIME_MONTHS} months before the court stay was issued publicly
          on {publicEventDate}.
        </p>
      </div>

      {/* Case file: what the engine saw vs. what happened */}
      <div className="mt-8 grid gap-px border border-line bg-line md:grid-cols-2">
        <section className="bg-surface p-6">
          <h2 className="font-serif text-lg font-bold text-ink">
            What the engine saw
          </h2>
          <p className="mt-1 text-xs text-ink-soft">
            {backtestPlot.id} · {backtestPlot.project} · snapshot{' '}
            {backtestSnapshotDate}
          </p>
          <ul className="mt-4 space-y-2">
            {prediction.topDrivers.map((driver) => (
              <li key={driver} className="flex gap-2 text-sm text-ink-soft">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                <span>
                  <span className="font-medium text-ink">
                    {DRIVER_LABELS[driver]}:
                  </span>{' '}
                  {factorToPlainLanguage(driver, backtestInput)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-surface p-6">
          <h2 className="font-serif text-lg font-bold text-ink">
            What happened next
          </h2>
          <p className="mt-1 text-xs text-ink-soft">{publicEventDate}</p>
          <ul className="mt-4 space-y-2">
            <li className="flex gap-2 text-sm text-ink-soft">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 bg-risk-high" />
              <span>
                <span className="font-medium text-ink">Court stay:</span>{' '}
                {publicEventNote}
              </span>
            </li>
            <li className="flex gap-2 text-sm text-ink-soft">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 bg-risk-high" />
              <span>
                <span className="font-medium text-ink">Today's score:</span>{' '}
                {today.score} ({today.level}) — with the litigation flag now
                public, the plot scores High
              </span>
            </li>
          </ul>
        </section>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-faint">
        Method note: the snapshot holds every input at its documented value
        except the litigation flag, which only became public with the stay.
        Sources: {backtestPlot.sourceNote}
      </p>
    </div>
  );
}
