/**
 * Sample plots for the demo, grounded in the documented Telangana cases
 * (Problem1.md). Each input value traces to a reported figure or status
 * update so demo numbers are defensible, not invented.
 */
import type { PlotRiskInput } from '../engine/types';

export interface SamplePlot {
  id: string;
  project: string;
  label: string;
  /** Where these numbers come from — shown in the UI for credibility. */
  sourceNote: string;
  input: PlotRiskInput;
}

export const samplePlots: SamplePlot[] = [
  {
    id: 'NIMZ-042',
    project: 'NIMZ Zaheerabad',
    label: 'Yelgoi village parcel',
    sourceNote:
      '₹7L/acre offered vs ₹50L–1Cr demanded (~87% gap); acquisition paused amid protests; HC assigned-land parity case.',
    input: {
      compensationGapPct: 87,
      ownershipMismatchCount: 1,
      litigationFlag: true,
      approvalDelayDays: 45,
      rrFamiliesAwaitingResettlement: 60,
    },
  },
  {
    id: 'NIMZ-118',
    project: 'NIMZ Zaheerabad',
    label: 'Bardipur segment',
    sourceNote:
      'Farmers refusing offers; same ~87% headline gap, but no court case on this segment yet.',
    input: {
      compensationGapPct: 60,
      ownershipMismatchCount: 0,
      litigationFlag: false,
      approvalDelayDays: 35,
      rrFamiliesAwaitingResettlement: 0,
    },
  },
  {
    id: 'MUSI-GDN-142',
    project: 'Musi Riverfront',
    label: 'Gandipet survey parcel',
    sourceNote:
      'Court stopped dispossession here (9.08 acres); offers ~35% below market; R&R site not finalized.',
    input: {
      compensationGapPct: 35,
      ownershipMismatchCount: 0,
      litigationFlag: true,
      approvalDelayDays: 20,
      rrFamiliesAwaitingResettlement: 120,
    },
  },
  {
    id: 'MUSI-311',
    project: 'Musi Riverfront',
    label: 'Central stretch parcel',
    sourceNote:
      'Acquisition largely progressed; minor compensation laggards only.',
    input: {
      compensationGapPct: 10,
      ownershipMismatchCount: 0,
      litigationFlag: false,
      approvalDelayDays: 15,
      rrFamiliesAwaitingResettlement: 20,
    },
  },
  {
    id: 'RRR-N-077',
    project: 'Regional Ring Road (north)',
    label: 'Raviryal stretch parcel',
    sourceNote:
      '~40% of RRR-north still to acquire; ownership records hard to reconcile; forest clearance pending (87.66 ha category).',
    input: {
      compensationGapPct: 25,
      ownershipMismatchCount: 2,
      litigationFlag: false,
      approvalDelayDays: 120,
      rrFamiliesAwaitingResettlement: 0,
    },
  },
  {
    id: 'RRR-N-012',
    project: 'Regional Ring Road (north)',
    label: 'Amangal segment parcel',
    sourceNote: 'Clean records, offers near market rate, approvals on schedule.',
    input: {
      compensationGapPct: 5,
      ownershipMismatchCount: 0,
      litigationFlag: false,
      approvalDelayDays: 25,
      rrFamiliesAwaitingResettlement: 0,
    },
  },
];
