/**
 * Feature 6 — Recommendation per Risk.
 *
 * Maps each risk driver to its mitigation playbook entry, so any surface
 * that shows explainability output can also show the suggested action.
 */
import type { RiskDriverId } from './types';

const RECOMMENDATIONS: Record<RiskDriverId, string> = {
  compensation_gap:
    'Review compensation rate against current market valuation',
  litigation: 'Initiate early negotiation / mediation before case escalates',
  ownership_mismatch: 'Reconcile ownership records with revenue department',
  approval_delay: 'Escalate pending approval to next authority level',
  rr_backlog: 'Accelerate rehabilitation and resettlement processing',
};

/**
 * Suggested action for the plot's top risk driver. Accepts any
 * RiskDriverId; unknown drivers fall back to a review escalation.
 */
export function getRecommendation(topFactor: RiskDriverId): string {
  return RECOMMENDATIONS[topFactor] ?? 'Escalate for joint departmental review';
}
