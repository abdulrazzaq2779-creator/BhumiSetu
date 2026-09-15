import { useSimulation } from '../state/simulation';

/**
 * Utility top bar: helpline on the left, utility links plus the data-cycle
 * simulator on the right. Small and muted — chrome, not content.
 *
 * The simulator is a demo affordance: one click advances mock time, risk
 * inputs drift, scores move across every page, and cycle events flow into
 * the Official Portal's alert feed. Reset returns to the live cycle.
 */
export default function TopBar() {
  const { cycle, advance, reset } = useSimulation();

  return (
    <div className="border-b border-line bg-parchment">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-1.5 text-xs text-ink-soft sm:px-6">
        <p>
          Helpline (toll-free):{' '}
          <span className="font-medium text-ink">1800-111-957</span>
          <span className="mx-2.5 text-line-strong">|</span>
          help@bhumisetu.gov.in
        </p>
        <div className="flex items-center gap-2.5">
          {/* Data-cycle simulator — clearly labelled as a demo control. */}
          <span className="flex items-center gap-1.5 border border-line-strong bg-surface px-2 py-0.5">
            <span
              aria-hidden="true"
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                cycle === 0 ? 'bg-risk-low' : 'bg-risk-medium risk-pulse'
              }`}
            />
            <span className="tabular-nums">
              {cycle === 0 ? 'Live data' : `Data cycle ${cycle}`}
            </span>
            <button
              type="button"
              onClick={advance}
              className="ml-1 font-semibold text-accent hover:underline"
              title="Advance the mock data cycle — risk scores drift, alerts fire"
            >
              Simulate next cycle ▸
            </button>
            {cycle > 0 && (
              <button
                type="button"
                onClick={reset}
                className="text-ink-faint hover:text-ink hover:underline"
              >
                reset
              </button>
            )}
          </span>
          <nav aria-label="Utility" className="flex items-center gap-2.5">
            <a href="#/faqs" className="hover:text-ink hover:underline">
              FAQs
            </a>
            <span className="text-line-strong">·</span>
            <a href="#/faqs" className="hover:text-ink hover:underline">
              Contact Us
            </a>
            <span className="text-line-strong">·</span>
            <a href="#/grievance" className="hover:text-ink hover:underline">
              Grievance
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
