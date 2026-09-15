import TopBar from './components/TopBar';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import BacktestPage from './pages/BacktestPage';
import MapPage from './pages/MapPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import LoginPage from './pages/LoginPage';
import CompensationCalculatorPage from './pages/CompensationCalculatorPage';
import FaqsPage from './pages/FaqsPage';
import GrievancePage from './pages/GrievancePage';
import StubPage from './pages/StubPage';
import { useRoute } from './hooks/useRoute';

export default function App() {
  const route = useRoute();

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <SiteHeader active={route} />
      <main className="flex-1">
        {typeof route === 'object' ? (
          // Keyed by project id so what-if state resets between projects.
          <ProjectDetailPage key={route.project} projectId={route.project} />
        ) : (
          <>
            {route === 'home' && <LandingPage />}
            {route === 'dashboard' && <DashboardPage />}
            {route === 'backtest' && <BacktestPage />}
            {route === 'map' && <MapPage />}
            {route === 'login' && <LoginPage />}
            {route === 'compensation-calculator' && <CompensationCalculatorPage />}
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
  );
}
