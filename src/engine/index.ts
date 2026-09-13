/**
 * BhumiSetu — Risk Scoring Engine (Feature 1)
 * Public API of the engine package.
 */

export * from './types';
export {
  createRuleEngine,
  defaultConfig,
  FACTOR_WEIGHTS,
  OWNERSHIP_MISMATCH_CAP,
  COMP_GAP_SATURATION_PCT,
} from './ruleEngine';
export type { RuleEngineConfig } from './ruleEngine';
export { mlStubModel } from './mlStub';

// ── Sample data ─────────────────────────────────────────────────────────────
// Grounded in the documented Telangana cases (Problem1.md) so the demo's
// numbers are traceable to real reported figures, not invented ones.
export { samplePlots } from '../data/samplePlots';
