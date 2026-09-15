/**
 * Router + composition root for the portal kit.
 *
 * PortalRoot is the ONLY thing the host app needs to mount once the kit is
 * adopted: it provides the store, resolves the current hash path, applies
 * role guards, and lays out the two portals. Until then, preview/main.tsx
 * mounts it standalone with the host's existing TopBar/SiteHeader/SiteFooter.
 */
import { useEffect, useState } from 'react';
import { PortalProvider, usePortal } from './PortalStore';
import {
  CITIZEN_TABS,
  OFFICIAL_TABS,
  guardRedirect,
  homeForRole,
  parsePortalHash,
  type PortalRouteDef,
} from './portalRoutes';
import OfficialLayout from './layouts/OfficialLayout';
import CitizenLayout from './layouts/CitizenLayout';
import KitLoginPage from './pages/KitLoginPage';
import ToastStack from './components/ToastStack';
import AssistantDock from './components/AssistantDock';
import OfficialOverviewPage from './pages/OfficialOverviewPage';
import OfficialPredictPage from './pages/OfficialPredictPage';
import OfficialTrackedPage from './pages/OfficialTrackedPage';
import OfficialAlertsPage from './pages/OfficialAlertsPage';
import OfficialReportsPage from './pages/OfficialReportsPage';
import CitizenStatusPage from './pages/CitizenStatusPage';
import CitizenNotificationsPage from './pages/CitizenNotificationsPage';
import CitizenDocumentsPage from './pages/CitizenDocumentsPage';

const OFFICIAL_ROUTES: PortalRouteDef[] = [
  { path: '/official', label: 'Overview', role: 'official', render: () => <OfficialOverviewPage /> },
  { path: '/official/predict', label: 'Predict', role: 'official', render: () => <OfficialPredictPage /> },
  { path: '/official/tracked', label: 'Tracked Projects', role: 'official', render: () => <OfficialTrackedPage /> },
  { path: '/official/alerts', label: 'Alerts', role: 'official', render: () => <OfficialAlertsPage /> },
  { path: '/official/reports', label: 'Reports', role: 'official', render: () => <OfficialReportsPage /> },
];

const CITIZEN_ROUTES: PortalRouteDef[] = [
  { path: '/citizen/status', label: 'Status', role: 'citizen', render: () => <CitizenStatusPage /> },
  { path: '/citizen/notifications', label: 'Notifications', role: 'citizen', render: () => <CitizenNotificationsPage /> },
  { path: '/citizen/documents', label: 'Documents', role: 'citizen', render: () => <CitizenDocumentsPage /> },
];

function useHashPath(): string {
  const [path, setPath] = useState(() => parsePortalHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setPath(parsePortalHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return path;
}

function navigate(path: string) {
  const target = `#${path}`;
  if (window.location.hash === target) return;
  window.location.hash = target;
}

function PortalRoutes() {
  const path = useHashPath();
  const { state } = usePortal();
  const user = state.user;

  // Role guard: bounce to login (or the right portal) with a replace so the
  // back button doesn't trap users in a redirect loop. A signed-in user who
  // opens #/login again goes straight to their portal home.
  const redirect =
    guardRedirect(path, user?.role ?? null) ??
    (path === '/login' && user ? homeForRole(user.role) : null);
  useEffect(() => {
    if (redirect !== null) navigate(redirect);
  }, [redirect]);

  if (redirect !== null) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <p className="text-sm text-ink-soft">Redirecting…</p>
      </div>
    );
  }

  if (path === '/login') {
    return <KitLoginPage />;
  }

  // Signed in — render the matching portal shell. The assistant dock mounts
  // once per layout, scoped by the role from context.
  if (user?.role === 'official') {
    const route =
      OFFICIAL_ROUTES.find((r) => r.path === path) ?? OFFICIAL_ROUTES[0];
    return (
      <OfficialLayout tabs={OFFICIAL_TABS} activePath={route.path}>
        {route.render()}
      </OfficialLayout>
    );
  }

  if (user?.role === 'citizen') {
    const route =
      CITIZEN_ROUTES.find((r) => r.path === path) ?? CITIZEN_ROUTES[0];
    return (
      <CitizenLayout tabs={CITIZEN_TABS} activePath={route.path}>
        {route.render()}
      </CitizenLayout>
    );
  }

  return null;
}

/**
 * PortalApp — router + overlays, WITHOUT the provider. Use this when the
 * host supplies <PortalProvider> higher in the tree (e.g. wrapping the whole
 * app so its own header can read the session via useOptionalUser).
 */
export function PortalApp() {
  return (
    <>
      <PortalRoutes />
      <ToastStack />
      <AssistantDock />
    </>
  );
}

/**
 * Self-contained mount: provider + router + overlays. Used by the standalone
 * preview and by hosts that don't need the session inside their own chrome.
 */
export default function PortalRoot() {
  return (
    <PortalProvider>
      <PortalApp />
    </PortalProvider>
  );
}
