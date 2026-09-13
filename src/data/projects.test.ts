import { describe, expect, it } from 'vitest';
import {
  monitoredProjects,
  tickerItems,
  uniqueDistrictsFor,
  uniqueStates,
} from './projects';
import { mapPoints, INDIA_CENTER } from './mapPoints';
import { createRuleEngine } from '../engine';

const LEVELS = ['Low', 'Medium', 'High'] as const;
const STAGES = ['Notification & survey', 'Compensation', 'Possession', 'R&R'] as const;

describe('monitoredProjects', () => {
  it('contains the PDF-grounded cases with valid fields', () => {
    expect(monitoredProjects.length).toBeGreaterThanOrEqual(10);
    for (const p of monitoredProjects) {
      expect(p.id).toMatch(/^LAP-\d{4}-\d{3}$/);
      expect(p.progressPct).toBeGreaterThanOrEqual(0);
      expect(p.progressPct).toBeLessThanOrEqual(100);
      expect(STAGES).toContain(p.stage);
      expect(p.riskInput.compensationGapPct).toBeGreaterThanOrEqual(0);
      expect(p.riskInput.ownershipMismatchCount).toBeGreaterThanOrEqual(0);
      expect(p.riskInput.approvalDelayDays).toBeGreaterThanOrEqual(0);
      expect(p.riskInput.rrFamiliesAwaitingResettlement).toBeGreaterThanOrEqual(0);
    }
  });

  it('pins every project inside India bounds for the risk map', () => {
    for (const p of monitoredProjects) {
      expect(p.lat).toBeGreaterThan(6);
      expect(p.lat).toBeLessThan(37);
      expect(p.lng).toBeGreaterThan(68);
      expect(p.lng).toBeLessThan(98);
    }
  });

  it('includes the flagship PDF cases', () => {
    const names = monitoredProjects.map((p) => p.name);
    expect(names.some((n) => n.includes('NIMZ Zaheerabad'))).toBe(true);
    expect(names.some((n) => n.includes('Polavaram'))).toBe(true);
    expect(names.some((n) => n.includes('NICE'))).toBe(true);
    expect(names.some((n) => n.includes('Sabari Rail'))).toBe(true);
  });

  it('exposes sorted states and state-scoped districts', () => {
    expect(uniqueStates).toEqual([...uniqueStates].sort());
    expect(uniqueDistrictsFor('')).toEqual(
      [...new Set(monitoredProjects.map((p) => p.district))].sort(),
    );
    for (const d of uniqueDistrictsFor('Telangana')) {
      expect(
        monitoredProjects.some((p) => p.state === 'Telangana' && p.district === d),
      ).toBe(true);
    }
  });
});

describe('mapPoints', () => {
  const engine = createRuleEngine();

  it('mirrors monitored projects one-to-one with engine-derived risk', () => {
    expect(mapPoints).toHaveLength(monitoredProjects.length);
    for (const point of mapPoints) {
      const source = monitoredProjects.find((p) => p.id === point.id)!;
      const prediction = engine.predict(source.riskInput);
      expect(point.riskLevel).toBe(prediction.level);
      expect(point.riskScore).toBe(prediction.score);
      expect(LEVELS).toContain(point.riskLevel);
      expect(point.drivers.length).toBeLessThanOrEqual(3);
      expect(point.summary.length).toBeGreaterThan(0);
    }
  });

  it('centers the map on India', () => {
    expect(INDIA_CENTER.lat).toBeGreaterThan(20);
    expect(INDIA_CENTER.lat).toBeLessThan(25);
    expect(INDIA_CENTER.lng).toBeGreaterThan(75);
    expect(INDIA_CENTER.lng).toBeLessThan(82);
  });
});

describe('tickerItems', () => {
  it('carries valid risk levels and non-empty titles', () => {
    expect(tickerItems.length).toBeGreaterThanOrEqual(5);
    for (const item of tickerItems) {
      expect(LEVELS).toContain(item.riskLevel);
      expect(item.title.length).toBeGreaterThan(10);
      expect(item.id).toBeTruthy();
    }
  });
});
