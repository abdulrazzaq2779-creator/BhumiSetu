/**
 * Mock data for the portal kit — role-specific, seeded, UI-only.
 *
 * Data lineage: alerts are derived from the host's own project records
 * (src/data/projects.ts) so the official's feed matches the risk dashboard;
 * the demo citizen is linked to LAP-2023-014 (the flagship case, which
 * carries its own litigation note).
 */
import type { AlertItem, CitizenDocument } from './portalTypes';

/** The pre-linked demo citizen record. Email matches mock auth. */
export const DEMO_CITIZEN = {
  name: 'Lakshmi Devi',
  /** Mirrors the "mock auth" login: any password works, this email links. */
  email: 'lakshmi.devi@example.in',
  village: 'Rampur Kalan, Sangareddy district, Telangana',
  projectId: 'LAP-2023-014',
  surveyNo: 'SY-114/2',
  area: '2.4 acres (irrigated)',
};

/** Seeded official identity — used when logging in as official. */
export const DEMO_OFFICIAL = {
  name: 'K. Srinivas, District Collector',
  email: 'collector.sangareddy@bhumisetu.gov.in',
  district: 'Sangareddy',
};

/**
 * Alert feed rows. Events correspond to real fields on the host's
 * monitoredProjects entries, so "Open project" always lands somewhere real.
 */
export const seedAlerts: AlertItem[] = [
  {
    id: 'AL-101',
    projectId: 'LAP-2023-014',
    projectName: 'NIMZ Zaheerabad Industrial Smart City',
    event: 'PA-4120 crossed into High risk — compensation gap widened to 87%',
    severity: 'High',
    ago: '2 hours ago',
  },
  {
    id: 'AL-102',
    projectId: 'LAP-2022-031',
    projectName: 'Musi Riverfront — Gandipet belt parcels',
    event: 'Court stay issued on dispossession — possession paused',
    severity: 'High',
    ago: '6 hours ago',
  },
  {
    id: 'AL-103',
    projectId: 'LAP-2021-006',
    projectName: 'Hyderabad Regional Ring Road (north)',
    event: 'Approval hand-off delay crossed 120 days — ownership records mismatched in 2 survey stretches',
    severity: 'Medium',
    ago: 'Yesterday',
  },
  {
    id: 'AL-104',
    projectId: 'LAP-2023-007',
    projectName: 'Vadhavan Port connectivity',
    event: 'Boundary discrepancies flagged in 2 parcels during title survey',
    severity: 'Medium',
    ago: '2 days ago',
  },
  {
    id: 'AL-105',
    projectId: 'LAP-2022-032',
    projectName: 'Musi Riverfront — central stretch',
    event: 'Compensation disbursement back on track — 84% of properties settled',
    severity: 'Low',
    ago: '3 days ago',
  },
];

/** Pre-seeded documents in the citizen's mock locker. */
export const seedDocuments: CitizenDocument[] = [
  {
    id: 'DOC-201',
    name: 'Patta passbook — SY-114/2.pdf',
    size: '1.2 MB',
    status: 'Approved',
    uploadedAgo: 'Uploaded 3 weeks ago',
  },
  {
    id: 'DOC-202',
    name: 'Aadhaar acknowledgement.pdf',
    size: '340 KB',
    status: 'Under Review',
    uploadedAgo: 'Uploaded 10 days ago',
  },
  {
    id: 'DOC-203',
    name: 'Bank passbook — first page.jpg',
    size: '620 KB',
    status: 'Received',
    uploadedAgo: 'Uploaded yesterday',
  },
];
