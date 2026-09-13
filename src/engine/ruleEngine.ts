/**
 * BhumiSetu — Risk Scoring Engine (Feature 1)
 *
 * Weighted rule-based model: each of the five risk factors contributes a
 * weighted share of a normalised 0–100 score, and every contribution is
 * carried through to a plain-language explanation (Feature 3's
 * "Explainability Output").
 *
 * Weights are calibrated against the documented Telangana cases
 * (Problem1.md): litigation and ownership mismatch are the strongest stall
 * predictors (Musi/Gandipet court stop, RRR disputed parcels), so they
 * carry the largest weights. Compensation gap is scaled continuously — the
 * NIMZ Zaheerabad case (~87% gap) must saturate near its cap.
 */
import type {
  PlotRiskInput,
  RiskDriverId,
  RiskModel,
  RiskPrediction,
} from './types';
import { levelForScore } from './types';

/** Max points each factor can contribute; weights sum to 100. */
export const FACTOR_WEIGHTS: Record<RiskDriverId, number> = {
  litigation: 30,
  ownership_mismatch: 25,
  compensation_gap: 20,
  approval_delay: 15,
  rr_backlog: 10,
};

/** Cap on mismatch points so one bad plot cannot exceed the factor weight. */
export const OWNERSHIP_MISMATCH_CAP = 3;

/**
 * Compensation gap (%) at which the factor scores full points — beyond the
 * Zaheerabad-level gap (~87%), more gap adds no additional signal.
 */
export const COMP_GAP_SATURATION_PCT = 60;

export interface RuleEngineConfig {
  weights: Record<RiskDriverId, number>;
  ownershipMismatchCap: number;
  compGapSaturationPct: number;
}

export const defaultConfig: RuleEngineConfig = {
  weights: FACTOR_WEIGHTS,
  ownershipMismatchCap: OWNERSHIP_MISMATCH_CAP,
  compGapSaturationPct: COMP_GAP_SATURATION_PCT,
};

/** Points earned for the ownership-mismatch factor (saturates at cap). */
function mismatchPoints(count: number, cap: number, weight: number): number {
  const clamped = Math.max(0, Math.min(count, cap));
  return (clamped / cap) * weight;
}

/** Points earned for the compensation-gap factor (saturating scale). */
function compGapPoints(
  gapPct: number,
  saturationPct: number,
  weight: number,
): number {
  const clamped = Math.max(0, Math.min(gapPct, saturationPct));
  return (clamped / saturationPct) * weight;
}

/** Rounds to 1 decimal to keep scores readable in the UI. */
function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Creates the rule-based scoring model. `config` is injectable so tests (and
 * later calibration against backtest data) can tune weights without touching
 * the scoring logic.
 */
export function createRuleEngine(
  config: RuleEngineConfig = defaultConfig,
): RiskModel {
  const { weights, ownershipMismatchCap, compGapSaturationPct } = config;

  return {
    name: 'Rule-based v1',
    description:
      'Weighted expert scoring across five risk factors, calibrated against documented Telangana cases.',
    predict(input: PlotRiskInput): RiskPrediction {
      const contributions: Array<{
        driver: RiskDriverId;
        points: number;
        explanation: string;
      }> = [];

      // 1. Litigation — binary, strongest single predictor.
      const litigationPoints = input.litigationFlag ? weights.litigation : 0;
      contributions.push({
        driver: 'litigation',
        points: litigationPoints,
        explanation: input.litigationFlag
          ? 'Active litigation or stay order on this plot (Gandipet-style court stop)'
          : 'No active litigation on record',
      });

      // 2. Ownership mismatch — saturates at the cap.
      const mismatches = Math.max(0, input.ownershipMismatchCount);
      const ownershipPoints = round1(
        mismatchPoints(mismatches, ownershipMismatchCap, weights.ownership_mismatch),
      );
      contributions.push({
        driver: 'ownership_mismatch',
        points: ownershipPoints,
        explanation:
          mismatches === 0
            ? 'Ownership records consistent across revenue, registration and mutation'
            : `${mismatches} survey number${mismatches === 1 ? '' : 's'} with mismatched ownership records`,
      });

      // 3. Compensation gap — continuous, saturating scale.
      const gap = Math.max(0, input.compensationGapPct);
      const compensationPoints = round1(
        compGapPoints(gap, compGapSaturationPct, weights.compensation_gap),
      );
      contributions.push({
        driver: 'compensation_gap',
        points: compensationPoints,
        explanation:
          gap === 0
            ? 'Compensation offer matches market rate'
            : `Compensation offer is ${round1(gap)}% below market rate`,
      });

      // 4. Approval delay — tiered: on track / mildly overdue / stalled.
      const approvalPoints =
        input.approvalDelayDays > 90
          ? weights.approval_delay
          : input.approvalDelayDays > 30
            ? weights.approval_delay / 2
            : 0;
      contributions.push({
        driver: 'approval_delay',
        points: approvalPoints,
        explanation:
          input.approvalDelayDays > 90
            ? `Approval pending ${input.approvalDelayDays} days (over 90-day norm)`
            : input.approvalDelayDays > 30
              ? `Approval pending ${input.approvalDelayDays} days (mildly overdue)`
              : `Approvals on track (${input.approvalDelayDays} days)`,
      });

      // 5. R&R backlog — tiered on families awaiting resettlement.
      const rrBacklog = Math.max(0, input.rrFamiliesAwaitingResettlement);
      const rrPoints =
        rrBacklog >= 50
          ? weights.rr_backlog
          : rrBacklog > 0
            ? weights.rr_backlog / 2
            : 0;
      contributions.push({
        driver: 'rr_backlog',
        points: rrPoints,
        explanation:
          rrBacklog >= 50
            ? `${rrBacklog} families awaiting resettlement (major R&R backlog)`
            : rrBacklog > 0
              ? `${rrBacklog} families awaiting resettlement`
              : 'No resettlement backlog',
      });

      const score = round1(
        contributions.reduce((sum, c) => sum + c.points, 0),
      );
      const level = levelForScore(score);

      // Only factors that actually contributed points are "drivers".
      const active = contributions
        .filter((c) => c.points > 0)
        .sort((a, b) => b.points - a.points);

      return {
        score,
        level,
        topDrivers: active.map((c) => c.driver),
        explanations: active.map((c) => c.explanation),
      };
    },
  };
}
