/**
 * Feature 2 — Plot-Level Scoring UI.
 *
 * <PlotCard> renders one plot's score: ID, village, colour-coded risk badge
 * and the 0–100 score — plus (Features 3 & 6) the top plain-language factors
 * and the suggested action, so a card is a complete plot briefing.
 *
 * Standalone: computes its own prediction unless one is passed in. New file;
 * no existing component is modified.
 */
import {
  createRuleEngine,
  levelForScore,
  type RiskLevel,
  type RiskPrediction,
} from '../engine';
import { topFactors } from '../engine/explain';
import { getRecommendation } from '../engine/recommend';
import type { SamplePlot } from '../data/samplePlots';

const engine = createRuleEngine();

const LEVEL_CLASS: Record<RiskLevel, string> = {
  High: 'border-risk-high text-risk-high',
  Medium: 'border-risk-medium text-risk-medium',
  Low: 'border-risk-low text-risk-low',
};

interface PlotCardProps {
  plot: SamplePlot;
  /** Optional pre-computed prediction (avoids re-scoring in lists). */
  prediction?: RiskPrediction;
}

export default function PlotCard({ plot, prediction }: PlotCardProps) {
  const p = prediction ?? engine.predict(plot.input);
  const level: RiskLevel = p.level ?? levelForScore(p.score);
  const factors = topFactors(plot.input, p);
  const recommendation = getRecommendation(p.topDrivers[0] ?? 'litigation');

  return (
    <article className="flex flex-col border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-base font-bold text-ink">{plot.id}</h3>
          <p className="text-xs text-ink-soft">{plot.label}</p>
        </div>
        <span
          className={`inline-block shrink-0 border-l-4 px-2 py-1 text-xs font-semibold ${LEVEL_CLASS[level]}`}
        >
          {level} · {p.score}
        </span>
      </div>

      {/* Feature 3 — top factors, highest contribution first. */}
      <ul className="mt-4 space-y-1.5 border-t border-line pt-3">
        {factors.map((f) => (
          <li key={f.driver} className="text-[13px] leading-snug text-ink-soft">
            <span className="font-medium text-ink">{f.label}:</span>{' '}
            {f.statement}
          </li>
        ))}
      </ul>

      {/* Feature 6 — suggested action for the top driver. */}
      <p className="mt-3 border-t border-line pt-3 text-[13px] text-ink-soft">
        <span className="font-semibold text-accent">Suggested action:</span>{' '}
        {recommendation}
      </p>

      <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
        Source: {plot.sourceNote}
      </p>
    </article>
  );
}
