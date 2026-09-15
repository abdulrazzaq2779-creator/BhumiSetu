/**
 * Portal routes — declarative table + pure parse/match helpers.
 *
 * Deliberately kept free of React so the routing brain is trivially
 * testable. The kit uses the host's hash convention (#/official/...)
 * to stay consistent with src/hooks/useRoute.ts.
 */
import type { PortalRole } from './portalTypes';

export interface PortalRouteDef {
  path: string;
  label: string;
  role: PortalRole;
  /** Rendered as the page content once matched. */
  render: () => React.ReactNode;
}

/** Tab strip definitions per role (order = display order). */
export const OFFICIAL_TABS: Array<{ path: string; label: string }> = [
  { path: '/official', label: 'Overview' },
  { path: '/official/predict', label: 'Predict Risk' },
  { path: '/official/tracked', label: 'Tracked Projects' },
  { path: '/official/alerts', label: 'Alerts' },
  { path: '/official/reports', label: 'Reports' },
];

export const CITIZEN_TABS: Array<{ path: string; label: string }> = [
  { path: '/citizen/status', label: 'My Property Status' },
  { path: '/citizen/notifications', label: 'Notifications' },
  { path: '/citizen/documents', label: 'Documents' },
];

/** Normalises "#/official/predict?x" → "/official/predict". */
export function parsePortalHash(hash: string): string {
  const raw = hash.replace(/^#/, '').split('?')[0];
  return raw.startsWith('/') ? raw : `/${raw}`;
}

/** Redirect target after mock login, by role. */
export function homeForRole(role: PortalRole): string {
  return role === 'official' ? '/official' : '/citizen/status';
}

/** Landing spot when a signed-in user hits /login again. */
export function routeForRole(role: PortalRole): string {
  return homeForRole(role);
}

/** Where to send someone hitting a route for the wrong role. */
export function guardRedirect(
  path: string,
  role: PortalRole | null,
): string | null {
  const isOfficialArea =
    path === '/official' || path.startsWith('/official/');
  const isCitizenArea =
    path === '/citizen' || path.startsWith('/citizen/');

  if (role === null) {
    return path === '/login' ? null : '/login';
  }
  if (isOfficialArea && role !== 'official') return '/citizen/status';
  if (isCitizenArea && role !== 'citizen') return '/official';
  return null;
}
