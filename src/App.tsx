import TopBar from './components/TopBar';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import BacktestPage from './pages/BacktestPage';
import MapPage from './pages/MapPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CompensationCalculatorPage from './pages/CompensationCalculatorPage';
import {
  PortalProvider,
  PortalApp,
} from '../portal-kit/src';
import { SimulationProvider } from './state/simulation';
import FaqsPage from './pages/FaqsPage';
import GrievancePage from './pages/GrievancePage';
import StubPage from './pages/StubPage';
import { useRoute } from './hooks/useRoute';

/**
 * Portal-kit routes: #/login (role-selector sign-in), #/portal, and the
 * kit's own #/official/* and #/citizen/* areas. Everything else — Home,
 * About, Reports, Risk Map, FAQs, Grievance, Calculator, project detail —
 * stays public and exactly as it was.
 */
function isPortalRoute(route: ReturnType<typeof useRoute>): boolean {
  if (route === 'login' || route === 'portal') return true;
  return typeof route === 'object' && 'portal' in route;
}

export default function App() {
  const route = useRoute();

  // SimulationProvider (data-cycle demo) wraps everything so both the
  // public site and the portals can react to a simulated cycle advance;
  // PortalProvider sits above the host chrome so SiteHeader can read the
  // session (role-aware Login button).
  return (
    <SimulationProvider>
      <PortalProvider>
      <div className="flex min-h-screen flex-col">
        <TopBar />
        <SiteHeader active={route} />
        <main className="flex-1">
          {isPortalRoute(route) ? (
            <PortalApp />
          ) : typeof route === 'object' && 'project' in route ? (
            // Keyed by project id so what-if state resets between projects.
            <ProjectDetailPage key={route.project} projectId={route.project} />
          ) : (
            <>
              {route === 'home' && <LandingPage />}
              {route === 'dashboard' && <DashboardPage />}
              {route === 'backtest' && <BacktestPage />}
              {route === 'map' && <MapPage />}
              {route === 'compensation-calculator' && (
                <CompensationCalculatorPage />
              )}
              {route === 'grievance' && <GrievancePage />}
              {route === 'reports' && (
                <StubPage
                  title="District Reports"
                  note="Monthly district-wise risk summaries, project-type breakdowns and downloadable statements will be published here."
                />
              )}
              {route === 'about' && <AboutPage />}
              {route === 'faqs' && <FaqsPage />}
            </>
          )}
        </main>
        <SiteFooter />
      </div>
      </PortalProvider>
    </SimulationProvider>
  );
}
