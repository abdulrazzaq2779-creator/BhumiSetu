/**
 * BhumiSetu — Risk Scoring Engine (Feature 1)
 *
 * Domain types shared by all risk models (rule-based today, ML in Phase 2).
 *
 * Design intent (see Solution1.md.md §4): risk is scored at the
 * *parcel/plot* level. Plot-level scores roll up to project level later
 * (Feature 8); a single disputed plot must be able to flag High on its own.
 */

/** The five risk inputs, each normalised to comparable units. */
export interface PlotRiskInput {
  /**
   * Compensation-offer-to-market-rate gap, as a positive percentage.
   *   0   → offer matches market rate
   *   35  → offer is 35% below market rate (the Gandipet-style case)
   *   87  → the NIMZ Zaheerabad case (₹7L offered vs ₹50L–1Cr demanded)
   */
  compensationGapPct: number;

  /**
   * Number of survey numbers / parcels where revenue, registration and
   * mutation records do not agree on ownership (0 = clean records).
   */
  ownershipMismatchCount: number;

  /** True if there is any active litigation or stay order on the plot. */
  litigationFlag: boolean;

  /**
   * Days since the last required approval/notification was filed, measured
   * against the ~90-day norm (0–30 = on track, 31–90 = overdue, >90 = stalled).
   * Mirrors the RRR cross-district hand-off lag pattern.
   */
  approvalDelayDays: number;

  /**
   * Number of displaced families from this plot still awaiting resettlement
   * (R&R backlog). 0 = complete; ≥50 is a major backlog (Musi-scale).
   */
  rrFamiliesAwaitingResettlement: number;
}

/** Output of a risk model for a single plot. */
export interface RiskPrediction {
  /** Normalised 0–100 risk score. Higher = riskier. */
  score: number;

  /** Categorical bucket derived from the score. */
  level: RiskLevel;

  /** Short machine-readable tags for the top drivers, highest impact first. */
  topDrivers: RiskDriverId[];

  /**
   * Plain-language explanation of each contributing factor, highest impact
   * first (Feature 3: "Explainability Output" — never show a bare number).
   */
  explanations: string[];

  /**
   * Per-factor point contributions to `score`, keyed by driver. Zero for
   * inactive factors. Sums to `score` (same rounding). Additive: existing
   * consumers that ignore it are unaffected.
   */
  factorPoints?: Partial<Record<RiskDriverId, number>>;
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

/**
 * Machine-readable driver identifiers. The Recommendation module (Feature 6)
 * maps these to mitigation playbooks, e.g. compensation_gap → "review
 * compensation rate", litigation → "start early negotiation".
 */
export type RiskDriverId =
  | 'compensation_gap'
  | 'ownership_mismatch'
  | 'litigation'
  | 'approval_delay'
  | 'rr_backlog';

/** Common contract for every scoring model (rule-based and ML stub alike). */
export interface RiskModel {
  readonly name: string;
  readonly description: string;
  predict(input: PlotRiskInput): RiskPrediction;
}

/**
 * Risk level thresholds applied to the 0–100 score.
 *
 * Calibrated so a single active litigation flag (30 pts) is already Medium
 * and litigation plus any secondary factor crosses High — matching how the
 * documented Telangana stalls combined multiple signals.
 */
export const RISK_THRESHOLDS = { medium: 25, high: 50 } as const;

export function levelForScore(score: number): RiskLevel {
  if (score >= RISK_THRESHOLDS.high) return 'High';
  if (score >= RISK_THRESHOLDS.medium) return 'Medium';
  return 'Low';
}
