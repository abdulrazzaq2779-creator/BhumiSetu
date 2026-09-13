import { routeHref } from '../hooks/useRoute';
import BhoomiSetuLogo from './BhoomiSetuLogo';

const NAV: Array<{
  label: string;
  route: 'home' | 'about' | 'dashboard' | 'map' | 'reports';
}> = [
  { label: 'Home', route: 'home' },
  { label: 'About', route: 'about' },
  { label: 'Dashboard', route: 'dashboard' },
  { label: 'Risk Map', route: 'map' },
  { label: 'Reports', route: 'reports' },
];

export default function SiteHeader({ active }: { active: string }) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 sm:px-6 sm:py-5">
        <a href={routeHref('home')} className="flex items-center gap-3">
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
            const isActive = item.route === active;
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
            href={routeHref('dashboard')}
            className="ml-4 border border-accent bg-accent px-5 py-1.5 text-sm font-semibold text-parchment transition-colors hover:bg-accent-deep"
          >
            Login
          </a>
        </nav>
      </div>
    </header>
  );
}
