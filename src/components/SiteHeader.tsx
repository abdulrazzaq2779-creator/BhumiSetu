import { routeHref, type Route } from '../hooks/useRoute';
import { useOptionalUser, homeForRole } from '../../portal-kit/src';
import emblemUrl from '../assets/india-emblem.svg';
import BhoomiSetuLogo from './BhoomiSetuLogo';

const NAV: Array<{
  label: string;
  route: 'home' | 'about' | 'dashboard' | 'map';
}> = [
  { label: 'Home', route: 'home' },
  { label: 'About', route: 'about' },
  // Relabelled from "Dashboard" — still routes to the project risk list
  // ('dashboard' route); only the visible label changed.
  { label: 'Reports', route: 'dashboard' },
  { label: 'Risk Map', route: 'map' },
];

export default function SiteHeader({ active }: { active: Route }) {
  // Session comes from the portal store (mounted at App level), so the
  // Login button becomes "My Portal" once a user signs in — public pages
  // still render this same header.
  const user = useOptionalUser();

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 sm:px-6 sm:py-5">
        <a href={routeHref('home')} className="flex items-center gap-3">
          {/**
           * National emblem block — State Emblem of India (Lion Capital of
           * Ashoka) at the far left with "Government of India" stacked
           * beneath it, matching official GoI portal conventions. Purely
           * additive: the Bhoomi Setu brand block follows after a divider.
           */}
          <span className="flex shrink-0 flex-col items-center gap-1">
            <img
              src={emblemUrl}
              alt="State Emblem of India"
              className="h-8 w-auto sm:h-9"
            />
            <span className="whitespace-nowrap text-[10px] font-medium leading-none text-ink-soft">
              Government of India
            </span>
          </span>

          {/* Vertical divider between the national emblem and the portal brand */}
          <span
            aria-hidden="true"
            className="h-9 w-px shrink-0 bg-line-strong sm:h-10"
          />

          <BhoomiSetuLogo />
          <span className="leading-tight">
            <span className="block font-serif text-xl font-bold tracking-tight text-ink">
              Bhoomi Setu
            </span>
            <span className="block text-[11px] text-ink-soft">
              Ministry of Rural Development — Government of India
            </span>
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="ml-auto flex flex-wrap items-center gap-x-2 gap-y-2 text-sm"
        >
          {NAV.map((item) => {
            // Detail pages highlight nothing in the nav; the breadcrumb
            // carries the location instead.
            const isActive =
              typeof active !== 'object' && item.route === active;
            return (
              <a
                key={item.route}
                href={routeHref(item.route)}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-none border-b-2 px-3 pb-2.5 pt-1.5 transition-colors ${
                  isActive
                    ? 'border-accent font-semibold text-ink'
                    : 'border-transparent text-ink-soft hover:border-line-strong hover:text-ink'
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <a
            href={user ? homeForRole(user.role) : routeHref('login')}
            className="ml-4 border border-accent bg-accent px-5 py-1.5 text-sm font-semibold text-parchment transition-colors hover:bg-accent-deep"
          >
            {user ? 'My Portal' : 'Login'}
          </a>
        </nav>
      </div>
    </header>
  );
}
