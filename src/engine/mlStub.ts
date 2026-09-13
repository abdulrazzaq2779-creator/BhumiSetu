/**
 * ML stub model (Feature 1, "hybrid" path).
 *
 * Deliberately NOT wired into the demo yet. In Phase 2 of the roadmap
 * (Solution1.md.md §9) this becomes a real gradient-boosted classifier
 * trained on reconciled Telangana parcel data. It implements the same
 * RiskModel contract, so swapping it in is a one-line change wherever a
 * model is selected — the dashboard, alerts and recommendation modules
 * never need to know which model produced a prediction.
 */
import type { RiskModel } from './types';

export const mlStubModel: RiskModel = {
  name: 'Gradient-boosted classifier (Phase 2 — stub)',
  description:
    'Planned: XGBoost/LightGBM stage-wise delay classifier trained on reconciled parcel data. Not yet trained — see Solution doc §4 and §9.',
  predict() {
    throw new Error(
      'ML model is not trained yet. This is a Phase-2 stub — use createRuleEngine() for scoring.',
    );
  },
};
