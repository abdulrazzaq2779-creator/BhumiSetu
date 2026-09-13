/**
 * Monitored projects — grounded in "India Land Acquisition Delays: Top 25+
 * Mega Projects (2024–2026)" (india-land-acquisition-delays (1).pdf).
 *
 * Each row's figures come from the corresponding PDF case; risk inputs feed
 * the Feature 1 scoring engine to derive the colour-coded risk level.
 * Coordinates are approximate project locations for the risk map.
 *
 * NOTE: the PDF itself flags that figures are research-draft estimates
 * pending primary-source verification — treat numbers as indicative.
 */
import type { PlotRiskInput, RiskLevel } from '../engine/types';

export interface MonitoredProject {
  id: string;
  name: string;
  district: string;
  state: string;
  stage: 'Notification & survey' | 'Compensation' | 'Possession' | 'R&R';
  /** Percentage of required land actually acquired/handed over. */
  progressPct: number;
  /** Approximate project location (for the risk map). */
  lat: number;
  lng: number;
  /** One-line status summary sourced from the PDF case. */
  summary: string;
  riskInput: PlotRiskInput;
}

export const monitoredProjects: MonitoredProject[] = [
  {
    id: 'LAP-2023-014',
    name: 'NIMZ Zaheerabad Industrial Smart City',
    district: 'Sangareddy',
    state: 'Telangana',
    stage: 'Compensation',
    progressPct: 62,
    lat: 17.68,
    lng: 77.6,
    summary: '7,829 of 12,656 acres acquired; compensation below market expectations drives farmer resistance.',
    riskInput: {
      compensationGapPct: 87,
      ownershipMismatchCount: 1,
      litigationFlag: true,
      approvalDelayDays: 45,
      rrFamiliesAwaitingResettlement: 60,
    },
  },
  {
    id: 'LAP-2021-006',
    name: 'Hyderabad Regional Ring Road (north)',
    district: 'Rangareddy',
    state: 'Telangana',
    stage: 'Possession',
    progressPct: 60,
    lat: 17.07,
    lng: 78.2,
    summary: '~60% acquired; pending notifications, ownership identification and repeated bid extensions.',
    riskInput: {
      compensationGapPct: 25,
      ownershipMismatchCount: 2,
      litigationFlag: false,
      approvalDelayDays: 120,
      rrFamiliesAwaitingResettlement: 0,
    },
  },
  {
    id: 'LAP-2022-031',
    name: 'Musi Riverfront — Gandipet belt parcels',
    district: 'Hyderabad',
    state: 'Telangana',
    stage: 'Possession',
    progressPct: 91,
    lat: 17.38,
    lng: 78.33,
    summary: 'Protection orders and litigation over dispossession, compensation and rehabilitation.',
    riskInput: {
      compensationGapPct: 35,
      ownershipMismatchCount: 0,
      litigationFlag: true,
      approvalDelayDays: 20,
      rrFamiliesAwaitingResettlement: 120,
    },
  },
  {
    id: 'LAP-2022-032',
    name: 'Musi Riverfront — central stretch',
    district: 'Hyderabad',
    state: 'Telangana',
    stage: 'Compensation',
    progressPct: 84,
    lat: 17.32,
    lng: 78.48,
    summary: 'Disbursement progressing; objections concentrated in a few stretches only.',
    riskInput: {
      compensationGapPct: 10,
      ownershipMismatchCount: 0,
      litigationFlag: false,
      approvalDelayDays: 15,
      rrFamiliesAwaitingResettlement: 20,
    },
  },
  {
    id: 'LAP-2020-009',
    name: 'Polavaram Irrigation Project',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    stage: 'R&R',
    progressPct: 86,
    lat: 17.25,
    lng: 81.65,
    summary: '~81,070 of 94,152 acres acquired; R&R, submergence and inter-state coordination remain.',
    riskInput: {
      compensationGapPct: 30,
      ownershipMismatchCount: 0,
      litigationFlag: false,
      approvalDelayDays: 60,
      rrFamiliesAwaitingResettlement: 200,
    },
  },
  {
    id: 'LAP-2022-018',
    name: 'Delhi–Mumbai Expressway — Gujarat packages',
    district: 'Vadodara',
    state: 'Gujarat',
    stage: 'Possession',
    progressPct: 81,
    lat: 22.3,
    lng: 73.2,
    summary: '3 packages (~87 km) below the 90% encumbrance-free land threshold; utility shifting and clearances pending.',
    riskInput: {
      compensationGapPct: 20,
      ownershipMismatchCount: 0,
      litigationFlag: false,
      approvalDelayDays: 60,
      rrFamiliesAwaitingResettlement: 0,
    },
  },
  {
    id: 'LAP-1998-002',
    name: 'Bengaluru–Mysuru Infrastructure Corridor (NICE)',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    stage: 'Compensation',
    progressPct: 85,
    lat: 12.85,
    lng: 77.45,
    summary: '23–25 years of delay; compensation awards, land diversion disputes and framework disagreements.',
    riskInput: {
      compensationGapPct: 45,
      ownershipMismatchCount: 2,
      litigationFlag: true,
      approvalDelayDays: 200,
      rrFamiliesAwaitingResettlement: 30,
    },
  },
  {
    id: 'LAP-2015-021',
    name: 'Bengaluru Metro Phases 1 & 2',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    stage: 'Compensation',
    progressPct: 92,
    lat: 12.97,
    lng: 77.59,
    summary: '₹6,603.39 crore cost impact from poor land estimation, delayed notifications and handover.',
    riskInput: {
      compensationGapPct: 25,
      ownershipMismatchCount: 1,
      litigationFlag: false,
      approvalDelayDays: 60,
      rrFamiliesAwaitingResettlement: 40,
    },
  },
  {
    id: 'LAP-2023-007',
    name: 'Vadhavan Port connectivity',
    district: 'Palghar',
    state: 'Maharashtra',
    stage: 'Notification & survey',
    progressPct: 10,
    lat: 19.85,
    lng: 72.68,
    summary: '62 of 606 hectares acquired; boundary discrepancies, ownership and tree-valuation disputes.',
    riskInput: {
      compensationGapPct: 40,
      ownershipMismatchCount: 2,
      litigationFlag: false,
      approvalDelayDays: 30,
      rrFamiliesAwaitingResettlement: 0,
    },
  },
  {
    id: 'LAP-2017-011',
    name: 'Amaravati capital city (phase 2 pooling)',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    stage: 'Possession',
    progressPct: 78,
    lat: 16.51,
    lng: 80.51,
    summary: 'Political interruption, litigation and 7,529 returnable plots pending across inheritance disputes.',
    riskInput: {
      compensationGapPct: 15,
      ownershipMismatchCount: 1,
      litigationFlag: true,
      approvalDelayDays: 30,
      rrFamiliesAwaitingResettlement: 150,
    },
  },
  {
    id: 'LAP-2019-014',
    name: 'Sabari Rail Project',
    district: 'Palakkad',
    state: 'Kerala',
    stage: 'Notification & survey',
    progressPct: 13,
    lat: 10.85,
    lng: 76.63,
    summary: '78 of 618 hectares acquired; slow state acquisition and funding coordination bottlenecks.',
    riskInput: {
      compensationGapPct: 25,
      ownershipMismatchCount: 1,
      litigationFlag: false,
      approvalDelayDays: 100,
      rrFamiliesAwaitingResettlement: 0,
    },
  },
  {
    id: 'LAP-2024-005',
    name: 'PM MITRA Park, Dhar',
    district: 'Dhar',
    state: 'Madhya Pradesh',
    stage: 'Notification & survey',
    progressPct: 21,
    lat: 22.42,
    lng: 75.3,
    summary: '2,009 acres additional land required; Gram Sabha and title processes at preliminary-notice stage.',
    riskInput: {
      compensationGapPct: 35,
      ownershipMismatchCount: 1,
      litigationFlag: false,
      approvalDelayDays: 45,
      rrFamiliesAwaitingResettlement: 0,
    },
  },
  {
    id: 'LAP-2023-022',
    name: 'Mamnoor / Warangal Airport revival',
    district: 'Warangal',
    state: 'Telangana',
    stage: 'Compensation',
    progressPct: 45,
    lat: 17.98,
    lng: 79.6,
    summary: 'Land acquisition pending more than a year for revival of the dormant airport; 280 acres involved.',
    riskInput: {
      compensationGapPct: 30,
      ownershipMismatchCount: 0,
      litigationFlag: false,
      approvalDelayDays: 95,
      rrFamiliesAwaitingResettlement: 10,
    },
  },
  {
    id: 'LAP-2021-019',
    name: 'Telangana irrigation projects (schemes cluster)',
    district: 'Adilabad',
    state: 'Telangana',
    stage: 'R&R',
    progressPct: 83,
    lat: 19.2,
    lng: 79.4,
    summary: '25,318 of 30,663 acres acquired; compensation, rehabilitation and forest-land verification remain.',
    riskInput: {
      compensationGapPct: 25,
      ownershipMismatchCount: 0,
      litigationFlag: false,
      approvalDelayDays: 45,
      rrFamiliesAwaitingResettlement: 80,
    },
  },
];

export const uniqueStates = [...new Set(monitoredProjects.map((p) => p.state))].sort();

export function uniqueDistrictsFor(state: string): string[] {
  const pool = state === '' ? monitoredProjects : monitoredProjects.filter((p) => p.state === state);
  return [...new Set(pool.map((p) => p.district))].sort();
}

// ── "What's New" ticker ──────────────────────────────────────────────────────
// Updates/alerts derived from the PDF case statuses. Replace with a feed from
// the scoring service once live data flows; the component only needs items.

export interface TickerItem {
  id: string;
  title: string;
  riskLevel: RiskLevel;
  timestamp: string;
  linkRoute?: 'dashboard' | 'map';
}

export const tickerItems: TickerItem[] = [
  {
    id: 'tick-1',
    title: 'NIMZ Zaheerabad flagged High Risk — compensation gap widening across resistant-village parcels',
    riskLevel: 'High',
    timestamp: 'This cycle',
    linkRoute: 'dashboard',
  },
  {
    id: 'tick-2',
    title: 'Regional Ring Road (North) — 60% land acquired; ownership identification pending in 2 survey stretches',
    riskLevel: 'Medium',
    timestamp: 'This cycle',
    linkRoute: 'dashboard',
  },
  {
    id: 'tick-3',
    title: 'Musi Riverfront — court stay issued on Gandipet belt dispossession; possession paused',
    riskLevel: 'High',
    timestamp: 'This cycle',
    linkRoute: 'dashboard',
  },
  {
    id: 'tick-4',
    title: 'Bengaluru–Mysuru NICE corridor — 23–25 year delay under independent-investigation directions',
    riskLevel: 'High',
    timestamp: 'Case review',
    linkRoute: 'dashboard',
  },
  {
    id: 'tick-5',
    title: 'Polavaram — R&R backlog of 200 families; construction schedule now linked to resettlement',
    riskLevel: 'Medium',
    timestamp: 'This cycle',
    linkRoute: 'dashboard',
  },
  {
    id: 'tick-6',
    title: 'Vadhavan Port connectivity — boundary and title surveys initiated across Palghar parcels',
    riskLevel: 'Medium',
    timestamp: 'Survey update',
    linkRoute: 'map',
  },
  {
    id: 'tick-7',
    title: 'Amaravati phase 2 — 7,529 returnable plots pending succession resolution',
    riskLevel: 'Medium',
    timestamp: 'Case review',
    linkRoute: 'dashboard',
  },
  {
    id: 'tick-8',
    title: 'Musi central stretch — compensation disbursement on track; 84% of properties settled',
    riskLevel: 'Low',
    timestamp: 'This cycle',
    linkRoute: 'dashboard',
  },
];
