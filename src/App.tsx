import TopBar from './components/TopBar';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import StubPage from './pages/StubPage';
import { useRoute } from './hooks/useRoute';

export default function App() {
  const route = useRoute();

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <SiteHeader active={route} />
      <main className="flex-1">
        {route === 'home' && <LandingPage />}
        {route === 'dashboard' && <DashboardPage />}
        {route === 'map' && <MapPage />}
        {route === 'reports' && (
          <StubPage
            title="District Reports"
            note="Monthly district-wise risk summaries, project-type breakdowns and downloadable statements will be published here."
          />
        )}
        {route === 'about' && (
          <StubPage
            title="About Bhoomi Setu"
            note="Detailed methodology: the five scoring factors, their weights, data sources and the backtest evidence behind the engine."
          />
        )}
        {route === 'faqs' && (
          <StubPage
            title="Frequently Asked Questions"
            note="Answers for acquiring bodies, district administrations and project-affected families — including grievance filing steps."
          />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
