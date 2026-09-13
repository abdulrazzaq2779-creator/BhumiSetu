/**
 * Map points for the Risk Map page.
 *
 * Single swap point for live data: replace the `monitoredProjects`-derived
 * mapping below with an API fetch that returns the same `MapPoint` shape —
 * the map component only depends on this file's exports.
 */
import { createRuleEngine } from '../engine';
import { monitoredProjects } from './projects';
import type { RiskLevel } from '../engine/types';

export interface MapPoint {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  riskLevel: RiskLevel;
  riskScore: number;
  /** Top 2–3 plain-language risk drivers. */
  drivers: string[];
  progressPct: number;
  summary: string;
}

export const INDIA_CENTER = { lat: 22.35, lng: 78.7 };

const engine = createRuleEngine();

export const mapPoints: MapPoint[] = monitoredProjects.map((project) => {
  const prediction = engine.predict(project.riskInput);
  return {
    id: project.id,
    name: project.name,
    district: project.district,
    state: project.state,
    lat: project.lat,
    lng: project.lng,
    riskLevel: prediction.level,
    riskScore: prediction.score,
    drivers: prediction.explanations.slice(0, 3),
    progressPct: project.progressPct,
    summary: project.summary,
  };
});
