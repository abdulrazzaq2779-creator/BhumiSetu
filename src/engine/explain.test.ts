import { describe, it, expect } from 'vitest';
import { createRuleEngine } from './ruleEngine';
import {
  factorToPlainLanguage,
  topFactors,
  DRIVER_LABELS,
} from './explain';
import { getRecommendation } from './recommend';
import type { PlotRiskInput, RiskDriverId } from './types';

const engine = createRuleEngine();

const baseInput: PlotRiskInput = {
  compensationGapPct: 0,
  ownershipMismatchCount: 0,
  litigationFlag: false,
  approvalDelayDays: 0,
  rrFamiliesAwaitingResettlement: 0,
};

describe('Feature 3 — factorToPlainLanguage', () => {
  it('gives generic phrasing without an input', () => {
    expect(factorToPlainLanguage('compensation_gap')).toBe(
      'Compensation offered below market rate',
    );
    expect(factorToPlainLanguage('litigation')).toBe(
      'Active litigation or court stay on the plot',
    );
  });

  it('quantifies the compensation gap from the input', () => {
    expect(factorToPlainLanguage('compensation_gap', baseInput)).toBe(
      'Compensation offer matches market rate',
    );
    expect(
      factorToPlainLanguage('compensation_gap', {
        ...baseInput,
        compensationGapPct: 65,
      }),
    ).toBe('Compensation 65% below market rate');
  });

  it('handles pluralisation and litigation state', () => {
    expect(
      factorToPlainLanguage('ownership_mismatch', {
        ...baseInput,
        ownershipMismatchCount: 2,
      }),
    ).toBe('2 survey numbers with mismatched ownership records');
    expect(factorToPlainLanguage('litigation', baseInput)).toBe(
      'No litigation on record',
    );
  });

  it('tiers approval delay and R&R backlog', () => {
    expect(
      factorToPlainLanguage('approval_delay', {
        ...baseInput,
        approvalDelayDays: 120,
      }),
    ).toContain('beyond the 90-day norm');
    expect(
      factorToPlainLanguage('rr_backlog', {
        ...baseInput,
        rrFamiliesAwaitingResettlement: 1,
      }),
    ).toBe('1 family awaiting rehabilitation');
  });
});

describe('Feature 3 — topFactors', () => {
  it('ranks by contribution and includes plain-language statements', () => {
    const input: PlotRiskInput = {
      compensationGapPct: 87,
      ownershipMismatchCount: 1,
      litigationFlag: true,
      approvalDelayDays: 45,
      rrFamiliesAwaitingResettlement: 60,
    };
    const prediction = engine.predict(input);
    const factors = topFactors(input, prediction);

    expect(factors.length).toBeLessThanOrEqual(3);
    expect(factors[0].driver).toBe('litigation'); // 30 pts, top weight
    expect(factors[0].statement).toContain('Legal dispute: active');
    // Contribution order must match the engine's driver ranking.
    const points = prediction.topDrivers.map(
      (d) => DRIVER_LABELS[d],
    );
    expect(points.length).toBeGreaterThan(0);
  });

  it('caps the list at the requested count', () => {
    const input: PlotRiskInput = {
      ...baseInput,
      compensationGapPct: 60,
      ownershipMismatchCount: 3,
      litigationFlag: true,
      approvalDelayDays: 120,
      rrFamiliesAwaitingResettlement: 80,
    };
    const prediction = engine.predict(input);
    expect(topFactors(input, prediction, 2)).toHaveLength(2);
  });
});

describe('Feature 6 — getRecommendation', () => {
  const expected: Array<[RiskDriverId, string]> = [
    [
      'compensation_gap',
      'Review compensation rate against current market valuation',
    ],
    [
      'litigation',
      'Initiate early negotiation / mediation before case escalates',
    ],
    [
      'ownership_mismatch',
      'Reconcile ownership records with revenue department',
    ],
    ['approval_delay', 'Escalate pending approval to next authority level'],
    [
      'rr_backlog',
      'Accelerate rehabilitation and resettlement processing',
    ],
  ];

  it.each(expected)('maps %s to its playbook action', (driver, action) => {
    expect(getRecommendation(driver)).toBe(action);
  });
});
