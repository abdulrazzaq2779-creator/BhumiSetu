/**
 * Shared types for the Bhoomi Setu portal kit.
 *
 * Two roles, two portals, one shared assistant widget — scoped by role.
 * Pure type declarations only: no imports from the host app here, so the
 * kit stays portable.
 */

export type PortalRole = 'official' | 'citizen';

/** The logged-in demo identity. Mock auth only — nothing is verified. */
export interface PortalUser {
  role: PortalRole;
  name: string;
  email: string;
}

/** One line in the official's alert feed. Seeded + UI-only. */
export interface AlertItem {
  id: string;
  projectId: string;
  projectName: string;
  /** e.g. "Risk level changed Low → High" */
  event: string;
  severity: 'High' | 'Medium' | 'Low';
  /** Relative time shown verbatim, e.g. "2 hours ago". */
  ago: string;
}

export type NotifyMessageType =
  | 'Document Request'
  | 'Compensation Offer'
  | 'Hearing Date'
  | 'General Update';

/** What the official's "Notify Landowner" action creates. */
export interface NotificationItem {
  id: string;
  role: 'official';
  projectId: string;
  projectName: string;
  type: NotifyMessageType;
  message: string;
  /** Relative time shown verbatim. */
  ago: string;
  /** Who should see this — the demo kit routes all notices to the demo citizen. */
  recipient?: string;
}

/** A citizen-uploaded document and its mock review status. */
export interface CitizenDocument {
  id: string;
  name: string;
  size: string;
  status: 'Received' | 'Under Review' | 'Approved';
  uploadedAgo: string;
}

export interface Toast {
  id: number;
  text: string;
}

/** Citizen portal language — the bilingual toggle's state. */
export type CitizenLang = 'en' | 'hi';

export type AssistantSource = 'official' | 'citizen' | 'fallback';

/** One assistant exchange, used to render the chat transcript. */
export interface AssistantTurn {
  id: number;
  from: 'user' | 'assistant';
  text: string;
  /** Which scope produced an assistant answer — shown as a small chip. */
  source?: AssistantSource;
}
