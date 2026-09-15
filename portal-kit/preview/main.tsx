/**
 * Standalone preview host for the portal kit.
 *
 * Imports the EXISTING app chrome (TopBar/SiteHeader/SiteFooter) read-only
 * and mounts PortalRoot as the page body. Nothing in src/ is modified —
 * this entry exists only so the kit can be demoed and sanity-checked
 * before adoption. Run: see portal-kit/README.md.
 */
import { createRoot } from 'react-dom/client';
import TopBar from '../../src/components/TopBar';
import SiteHeader from '../../src/components/SiteHeader';
import SiteFooter from '../../src/components/SiteFooter';
import PortalRoot from '../src/router';
import { guardRedirect, homeForRole, parsePortalHash } from '../src/portalRoutes';
import './style.css';

/**
 * Tiny runtime sanity checks on the kit's pure routing helpers — they run
 * in the browser console on preview boot (kept dependency-free on purpose,
 * so the preview stays a plain Vite entry).
 */
function selfCheck() {
  const check = (label: string, actual: unknown, expected: unknown) => {
    if (actual !== expected) {
      console.error(`[portal-kit preview] FAILED: ${label}`, { actual, expected });
      return;
    }
    console.info(`[portal-kit preview] ok — ${label}`);
  };

  check('parse strips hash/query', parsePortalHash('#/official/predict?x=1'), '/official/predict');
  check('parse adds leading slash', parsePortalHash('citizen/status'), '/citizen/status');
  check('signed-out → /login', guardRedirect('/official', null), '/login');
  check('citizen blocked from official', guardRedirect('/official', 'citizen'), '/citizen/status');
  check('official blocked from citizen', guardRedirect('/citizen/documents', 'official'), '/official');
  check('official allowed in official', guardRedirect('/official/alerts', 'official'), null);
  check('login is public', guardRedirect('/login', null), null);
  check('official home', homeForRole('official'), '/official');
  check('citizen home', homeForRole('citizen'), '/citizen/status');
}
selfCheck();

/** Land on the login screen in the standalone preview. */
if (!window.location.hash) window.location.hash = '#/login';

function PreviewApp() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      {/* The host header would be role-aware after adoption (Login →
          "My Portal" when signed in). For preview, 'home' keeps the static
          nav highlighted nowhere; the kit's own banners carry the context. */}
      <SiteHeader active="home" />
      <main className="flex-1">
        <PortalRoot />
      </main>
      <SiteFooter />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<PreviewApp />);
