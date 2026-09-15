/**
 * portal-kit public API.
 *
 * After adoption, src/App.tsx imports ONLY this barrel — everything else
 * stays internal, so the kit can refactor freely behind a stable surface.
 */
export { default as PortalRoot } from './router';
export { PortalApp } from './router';
export { PortalProvider, usePortal, useUser, useOptionalUser } from './PortalStore';
export { parsePortalHash, guardRedirect, homeForRole } from './portalRoutes';
export type { PortalRole, PortalUser } from './portalTypes';
export { answerQuestion, FALLBACK_TEXT } from './assistantEngine';

/** Named exports for piecemeal adoption (optional). */
export { default as KitLoginPage } from './pages/KitLoginPage';
export { default as OfficialLayout } from './layouts/OfficialLayout';
export { default as CitizenLayout } from './layouts/CitizenLayout';
export { default as OfficialOverviewPage } from './pages/OfficialOverviewPage';
export { default as OfficialPredictPage } from './pages/OfficialPredictPage';
export { default as OfficialTrackedPage } from './pages/OfficialTrackedPage';
export { default as OfficialAlertsPage } from './pages/OfficialAlertsPage';
export { default as OfficialReportsPage } from './pages/OfficialReportsPage';
export { default as CitizenStatusPage } from './pages/CitizenStatusPage';
export { default as CitizenNotificationsPage } from './pages/CitizenNotificationsPage';
export { default as CitizenDocumentsPage } from './pages/CitizenDocumentsPage';
export { default as AssistantDock } from './components/AssistantDock';
export { default as ToastStack } from './components/ToastStack';
export { default as PortalTabs } from './components/PortalTabs';
