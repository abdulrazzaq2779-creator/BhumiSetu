import { routeHref } from '../hooks/useRoute';

/** National emblem-style mark: shield with furrowed-field lines. */
export function EmblemMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <span
      className={`${className} grid shrink-0 place-items-center rounded-full border border-accent-deep bg-accent text-parchment`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* shield */}
        <path d="M12 3.5 5 6v6c0 4.2 2.9 7.4 7 8.5 4.1-1.1 7-4.3 7-8.5V6l-7-2.5Z" />
        {/* furrowed field lines */}
        <path d="M8 11h8" />
        <path d="M9 14.2h6" />
        <path d="M10.5 17.4h3" />
        {/* rising sun */}
        <path d="M9.5 8a2.5 2.5 0 0 1 5 0" />
      </svg>
    </span>
  );
}

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
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <a href={routeHref('home')} className="flex items-center gap-3">
          <EmblemMark />
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
          className="ml-auto flex flex-wrap items-center gap-x-1 gap-y-2 text-sm"
        >
          {NAV.map((item) => {
            const isActive = item.route === active;
            return (
              <a
                key={item.route}
                href={routeHref(item.route)}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-none border-b-2 px-3 py-1.5 transition-colors ${
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
            className="ml-2 border border-accent bg-accent px-4 py-1.5 text-sm font-semibold text-parchment transition-colors hover:bg-accent-deep"
          >
            Login
          </a>
        </nav>
      </div>
    </header>
  );
}
