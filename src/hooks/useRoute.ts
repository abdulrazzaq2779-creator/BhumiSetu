import { useEffect, useState } from 'react';

/**
 * Minimal hash routing — keeps the portal servable from any static path
 * without a server rewrite rule. Routes: '' (home) | 'dashboard' | 'reports'
 * | 'about' | 'faqs' | 'backtest' | 'projects/:projectId' | 'login'
 * | 'compensation-calculator' | 'grievance'.
 */
export type Route =
  | 'home'
  | 'dashboard'
  | 'map'
  | 'reports'
  | 'about'
  | 'faqs'
  | 'backtest'
  | 'login'
  | 'compensation-calculator'
  | 'grievance'
  | { project: string };

const ROUTES: Route[] = [
  'home',
  'dashboard',
  'map',
  'reports',
  'about',
  'faqs',
  'backtest',
  'login',
  'compensation-calculator',
  'grievance',
];

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  // Project detail pages: #/projects/:projectId
  const projectMatch = raw.match(/^projects\/([^/]+)$/);
  if (projectMatch) {
    return { project: decodeURIComponent(projectMatch[1]) };
  }
  return (ROUTES as string[]).includes(raw) ? (raw as Route) : 'home';
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

/** Builds an href for a route, e.g. `routeHref('dashboard') → '#/dashboard'`. */
export function routeHref(route: Route): string {
  if (typeof route === 'object') {
    return projectHref(route.project);
  }
  return route === 'home' ? '#/' : `#/${route}`;
}

/** Builds an href for a project detail page, e.g. `#/projects/LAP-2023-014`. */
export function projectHref(projectId: string): string {
  return `#/projects/${encodeURIComponent(projectId)}`;
}
