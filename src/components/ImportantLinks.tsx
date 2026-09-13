import type { ReactNode } from 'react';
import { routeHref, type Route } from '../hooks/useRoute';

/** Thin stroke icons — kept on one stroke width so the grid reads as a set. */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const ICONS = {
  dashboard: (
    <Icon>
      <rect x="3.5" y="4.5" width="17" height="15" />
      <path d="M3.5 9.5h17M8.5 9.5v10" />
      <path d="M12.5 13h5M12.5 16h3.5" />
    </Icon>
  ),
  search: (
    <Icon>
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="m15 15 5 5" />
    </Icon>
  ),
  report: (
    <Icon>
      <path d="M6 3.5h9L19.5 8v12.5h-13.5z" />
      <path d="M9 12h6M9 15.5h6M9 8.5h3" />
    </Icon>
  ),
  rupee: (
    <Icon>
      <path d="M8 4.5h8M8 8.5h8M14.5 4.5c0 4-2.5 5.5-6.5 5.5l7 9" />
    </Icon>
  ),
  faq: (
    <Icon>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.3A2.6 2.6 0 0 1 14.6 10c0 1.7-2.4 2-2.4 3.6" />
      <path d="M12 16.8h.01" />
    </Icon>
  ),
  grievance: (
    <Icon>
      <path d="M4 5.5h16v10H9l-5 4z" />
      <path d="M8 9.5h8M8 12.2h5" />
    </Icon>
  ),
} as const;

interface Tile {
  title: string;
  subtitle: string;
  icon: keyof typeof ICONS;
  route: Route;
}

const TILES: Tile[] = [
  {
    title: 'Risk Dashboard',
    subtitle: 'Colour-coded risk across all monitored projects',
    icon: 'dashboard',
    route: 'dashboard',
  },
  {
    title: 'Risk Map',
    subtitle: 'Geographic view of projects by risk level',
    icon: 'search',
    route: 'map',
  },
  {
    title: 'District Reports',
    subtitle: 'Monthly risk summaries by district and project type',
    icon: 'report',
    route: 'reports',
  },
  {
    title: 'Compensation Tracker',
    subtitle: 'Offers vs. market rate, disbursement progress',
    icon: 'rupee',
    route: 'dashboard',
  },
  {
    title: 'Frequently Asked Questions',
    subtitle: 'How scoring works, who can access what',
    icon: 'faq',
    route: 'faqs',
  },
  {
    title: 'Grievance Redressal',
    subtitle: 'File and track landowner grievances online',
    icon: 'grievance',
    route: 'faqs',
  },
];

/** Important Links content block, rendered inside the landing layout. */
export default function ImportantLinks() {
  return (
    <section aria-labelledby="links-heading">
      <h2 id="links-heading" className="font-serif text-2xl font-bold tracking-tight text-ink">
        Important Links
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Services for acquiring bodies, district administrations and
        project-affected families.
      </p>

      <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
        {TILES.map((tile) => (
          <a
            key={tile.title}
            href={routeHref(tile.route)}
            className="group flex items-start gap-4 bg-surface p-5 transition-colors hover:bg-parchment-deep"
          >
            <span className="mt-0.5 text-accent">{ICONS[tile.icon]}</span>
            <span>
              <span className="block font-semibold text-ink group-hover:text-accent">
                {tile.title}
              </span>
              <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">
                {tile.subtitle}
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
