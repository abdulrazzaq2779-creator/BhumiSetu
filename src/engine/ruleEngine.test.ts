import { describe, expect, it } from 'vitest';
import {
  createRuleEngine,
  levelForScore,
  mlStubModel,
  RISK_THRESHOLDS,
} from './index';
import { samplePlots } from '../data/samplePlots';
import type { PlotRiskInput } from './types';

const engine = createRuleEngine();

/** A plot with no risk signals. */
const clean: PlotRiskInput = {
  compensationGapPct: 0,
  ownershipMismatchCount: 0,
  litigationFlag: false,
  approvalDelayDays: 10,
  rrFamiliesAwaitingResettlement: 0,
};

describe('rule engine — individual factors', () => {
  it('scores a clean plot 0 / Low with no drivers', () => {
    const r = engine.predict(clean);
    expect(r.score).toBe(0);
    expect(r.level).toBe('Low');
    expect(r.topDrivers).toEqual([]);
    expect(r.explanations).toEqual([]);
  });

  it('litigation alone contributes 30 pts → Medium', () => {
    const r = engine.predict({ ...clean, litigationFlag: true });
    expect(r.score).toBe(30);
    expect(r.level).toBe('Medium');
    expect(r.topDrivers).toEqual(['litigation']);
  });

  it('ownership mismatch scales linearly then caps at 3', () => {
    expect(engine.predict({ ...clean, ownershipMismatchCount: 1 }).score).toBe(8.3);
    expect(engine.predict({ ...clean, ownershipMismatchCount: 2 }).score).toBe(16.7);
    expect(engine.predict({ ...clean, ownershipMismatchCount: 3 }).score).toBe(25);
    expect(engine.predict({ ...clean, ownershipMismatchCount: 7 }).score).toBe(25); // capped
  });

  it('compensation gap is linear up to saturation at 60%', () => {
    expect(engine.predict({ ...clean, compensationGapPct: 30 }).score).toBe(10);
    expect(engine.predict({ ...clean, compensationGapPct: 60 }).score).toBe(20);
    expect(engine.predict({ ...clean, compensationGapPct: 87 }).score).toBe(20); // saturates
  });

  it('approval delay tiers: ≤30 → 0, 31–90 → half, >90 → full', () => {
    expect(engine.predict({ ...clean, approvalDelayDays: 30 }).score).toBe(0);
    expect(engine.predict({ ...clean, approvalDelayDays: 31 }).score).toBe(7.5);
    expect(engine.predict({ ...clean, approvalDelayDays: 90 }).score).toBe(7.5);
    expect(engine.predict({ ...clean, approvalDelayDays: 91 }).score).toBe(15);
  });

  it('R&R backlog tiers: 0 → 0, 1–49 → half, ≥50 → full', () => {
    expect(engine.predict({ ...clean, rrFamiliesAwaitingResettlement: 0 }).score).toBe(0);
    expect(engine.predict({ ...clean, rrFamiliesAwaitingResettlement: 1 }).score).toBe(5);
    expect(engine.predict({ ...clean, rrFamiliesAwaitingResettlement: 49 }).score).toBe(5);
    expect(engine.predict({ ...clean, rrFamiliesAwaitingResettlement: 50 }).score).toBe(10);
  });

  it('ignores negative inputs', () => {
    const r = engine.predict({
      ...clean,
      compensationGapPct: -10,
      ownershipMismatchCount: -2,
      approvalDelayDays: -5,
      rrFamiliesAwaitingResettlement: -3,
    });
    expect(r.score).toBe(0);
  });
});

describe('rule engine — combination and explainability', () => {
  it('sums factor points and orders drivers by contribution', () => {
    const r = engine.predict({ ...clean, litigationFlag: true, compensationGapPct: 50 });
    // 30 (litigation) + 16.7 (50% gap) = 46.7
    expect(r.score).toBe(46.7);
    expect(r.level).toBe('Medium');
    expect(r.topDrivers).toEqual(['litigation', 'compensation_gap']);
    expect(r.explanations[0]).toMatch(/litigation|stay order/i);
    expect(r.explanations[1]).toMatch(/50% below market/);
  });

  it('crosses High when litigation combines with a substantial second signal', () => {
    // Litigation (30) + ownership mismatch (25) = 55
    expect(
      engine.predict({ ...clean, litigationFlag: true, ownershipMismatchCount: 3 }).level,
    ).toBe('High');
    // Litigation (30) + saturated comp gap (20) = 50 → boundary High
    expect(
      engine.predict({ ...clean, litigationFlag: true, compensationGapPct: 87 }).level,
    ).toBe('High');
  });

  it('keeps litigation + one weak signal at Medium (45 < 50)', () => {
    const r = engine.predict({ ...clean, litigationFlag: true, approvalDelayDays: 91 });
    expect(r.score).toBe(45);
    expect(r.level).toBe('Medium');
  });

  it('reaches High via litigation + two moderate signals (Gandipet shape)', () => {
    const r = engine.predict({
      ...clean,
      litigationFlag: true,
      compensationGapPct: 35, // 11.7
      rrFamiliesAwaitingResettlement: 120, // 10
    });
    expect(r.score).toBe(51.7);
    expect(r.level).toBe('High');
  });

  it('every contributing factor yields exactly one explanation', () => {
    const r = engine.predict({
      ...clean,
      litigationFlag: true,
      compensationGapPct: 40,
      ownershipMismatchCount: 2,
      approvalDelayDays: 100,
      rrFamiliesAwaitingResettlement: 80,
    });
    expect(r.topDrivers).toHaveLength(5);
    expect(r.explanations).toHaveLength(5);
  });
});

describe('rule engine — threshold boundaries', () => {
  it('maps scores to levels at the exact boundaries', () => {
    expect(levelForScore(RISK_THRESHOLDS.medium - 0.1)).toBe('Low');
    expect(levelForScore(RISK_THRESHOLDS.medium)).toBe('Medium');
    expect(levelForScore(RISK_THRESHOLDS.high - 0.1)).toBe('Medium');
    expect(levelForScore(RISK_THRESHOLDS.high)).toBe('High');
  });
});

describe('rule engine — configurable weights', () => {
  it('honours a custom config', () => {
    const tuned = createRuleEngine({
      weights: {
        litigation: 50,
        ownership_mismatch: 20,
        compensation_gap: 20,
        approval_delay: 5,
        rr_backlog: 5,
      },
      ownershipMismatchCap: 2,
      compGapSaturationPct: 50,
    });
    const r = tuned.predict({ ...clean, litigationFlag: true });
    expect(r.score).toBe(50); // custom litigation weight
    expect(r.level).toBe('High');
  });
});

describe('backtest — documented Telangana cases', () => {
  it('flags the Gandipet parcel High on litigation + gap + R&R backlog', () => {
    const gandipet = samplePlots.find((p) => p.id === 'MUSI-GDN-142')!;
    const r = engine.predict(gandipet.input);
    expect(r.level).toBe('High');
    expect(r.topDrivers[0]).toBe('litigation');
    expect(r.score).toBe(51.7); // 30 + 11.7 + 10
  });

  it('flags the resistant NIMZ parcel High on the compensation-gap story', () => {
    const nimz = samplePlots.find((p) => p.id === 'NIMZ-042')!;
    const r = engine.predict(nimz.input);
    expect(r.level).toBe('High');
    expect(r.topDrivers).toContain('compensation_gap');
    expect(r.topDrivers[0]).toBe('litigation');
  });

  it('keeps clean parcels Low so project contrast is visible', () => {
    for (const id of ['MUSI-311', 'RRR-N-012']) {
      const plot = samplePlots.find((p) => p.id === id)!;
      expect(engine.predict(plot.input).level).toBe('Low');
    }
  });
});

describe('ML stub', () => {
  it('throws until the Phase-2 model is trained', () => {
    expect(() => mlStubModel.predict(clean)).toThrow(/not trained/i);
  });
});
