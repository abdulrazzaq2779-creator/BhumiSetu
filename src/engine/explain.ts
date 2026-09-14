/**
 * Feature 3 — Explainability Output.
 *
 * Converts raw risk factors into plain-language reasons. Ranking comes from
 * the engine itself (`RiskPrediction.topDrivers` is already sorted by
 * contribution), so this module never duplicates scoring math — it only
 * translates.
 */
import type { PlotRiskInput, RiskDriverId, RiskPrediction } from './types';

/**
 * Canonical driver labels — the short form used wherever space is tight.
 */
export const DRIVER_LABELS: Record<RiskDriverId, string> = {
  compensation_gap: 'Compensation gap',
  ownership_mismatch: 'Ownership mismatch',
  litigation: 'Litigation',
  approval_delay: 'Approval delay',
  rr_backlog: 'R&R backlog',
};

/**
 * Maps a raw factor to a plain-language reason. Pass the plot input to get
 * the plot-specific phrasing (e.g. "Compensation 65% below market rate");
 * without it, returns the generic reason for the driver.
 */
export function factorToPlainLanguage(
  factor: RiskDriverId,
  input?: PlotRiskInput,
): string {
  if (!input) {
    const generic: Record<RiskDriverId, string> = {
      compensation_gap: 'Compensation offered below market rate',
      ownership_mismatch: 'Ownership records do not reconcile',
      litigation: 'Active litigation or court stay on the plot',
      approval_delay: 'Statutory approvals overdue',
      rr_backlog: 'Families still awaiting rehabilitation',
    };
    return generic[factor];
  }

  switch (factor) {
    case 'compensation_gap': {
      const gap = Math.max(0, input.compensationGapPct);
      return gap === 0
        ? 'Compensation offer matches market rate'
        : `Compensation ${Math.round(gap)}% below market rate`;
    }
    case 'ownership_mismatch': {
      const n = Math.max(0, input.ownershipMismatchCount);
      return n === 0
        ? 'Ownership records reconcile'
        : `${n} survey number${n === 1 ? '' : 's'} with mismatched ownership records`;
    }
    case 'litigation':
      return input.litigationFlag
        ? 'Legal dispute: active — stay or case pending on this plot'
        : 'No litigation on record';
    case 'approval_delay': {
      const d = Math.max(0, input.approvalDelayDays);
      return d > 90
        ? `Approval pending ${d} days — beyond the 90-day norm`
        : d > 30
          ? `Approval pending ${d} days — mildly overdue`
          : 'Approvals on track';
    }
    case 'rr_backlog': {
      const f = Math.max(0, input.rrFamiliesAwaitingResettlement);
      return f === 0
        ? 'No resettlement backlog'
        : `${f} famil${f === 1 ? 'y' : 'ies'} awaiting rehabilitation`;
    }
  }
}

export interface ExplainedFactor {
  driver: RiskDriverId;
  /** Short label, e.g. "Litigation". */
  label: string;
  /** Plot-specific plain-language reason. */
  statement: string;
  /** The engine's own longer explanation for the same factor. */
  detail: string;
}

/**
 * The plot's top risk factors, highest contribution first — the exact list
 * to render wherever plot details are shown (caps at `count`, default 3).
 */
export function topFactors(
  input: PlotRiskInput,
  prediction: RiskPrediction,
  count = 3,
): ExplainedFactor[] {
  return prediction.topDrivers.slice(0, count).map((driver) => ({
    driver,
    label: DRIVER_LABELS[driver],
    statement: factorToPlainLanguage(driver, input),
    detail:
      prediction.explanations[
        prediction.topDrivers.indexOf(driver)
      ] ?? '',
  }));
}
