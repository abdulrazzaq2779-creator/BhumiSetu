import { routeHref, type Route } from '../hooks/useRoute';
import tileDashboard from '../assets/tile-dashboard.jpg';
import tileMap from '../assets/tile-map.jpg';
import tileReports from '../assets/tile-reports.jpg';
import tileCompensation from '../assets/tile-compensation.jpg';
import tileFaq from '../assets/tile-faq.jpg';
import tileGrievance from '../assets/tile-grievance.jpg';
import {
  TILE_CONTAINER,
  TILE_GRID,
  TILE_TEXT_FLIP,
  TILE_TEXT_FLIP_SOFT,
  TileFooter,
  TilePhoto,
} from './PhotoTile';

/**
 * Large stroke icons — the visual anchor of each tile. Drawn on a 24-unit
 * grid at 1.5 stroke so they scale to 56px without thickening clumsily.
 */
function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-14 w-14"
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

interface HoverImage {
  src: string;
  /** Decorative; kept here only so a future tile can opt into real alts. */
  alt?: string;
}

interface Tile {
  title: string;
  subtitle: string;
  icon: keyof typeof ICONS;
  route: Route;
  /** Thematic photo revealed behind the tile on hover (see CREDITS.md). */
  hoverImage?: HoverImage;
}

const TILES: Tile[] = [
  {
    // Relabelled from "Dashboard" — route, icon, hover image and grid
    // position unchanged; only the visible label text differs.
    title: 'Reports',
    subtitle: 'Colour-coded risk across all monitored projects',
    icon: 'dashboard',
    route: 'dashboard',
    hoverImage: { src: tileDashboard },
  },
  {
    title: 'Risk Map',
    subtitle: 'Geographic view of projects by risk level',
    icon: 'search',
    route: 'map',
    hoverImage: { src: tileMap },
  },
  {
    title: 'District Reports',
    subtitle: 'Monthly risk summaries by district and project type',
    icon: 'report',
    route: 'reports',
    hoverImage: { src: tileReports },
  },
  {
    title: 'Compensation Tracker',
    subtitle: 'Offers vs. market rate, disbursement progress',
    icon: 'rupee',
    // Now routes to the compensation calculator (previously the dashboard).
    route: 'compensation-calculator',
    hoverImage: { src: tileCompensation },
  },
  {
    title: 'Frequently Asked Questions',
    subtitle: 'How scoring works, who can access what',
    icon: 'faq',
    route: 'faqs',
    hoverImage: { src: tileFaq },
  },
  {
    title: 'Grievance Redressal',
    subtitle: 'File and track landowner grievances online',
    icon: 'grievance',
    // Now routes to the dedicated grievance page (previously FAQs).
    route: 'grievance',
    hoverImage: { src: tileGrievance },
  },
];

/** Important Links content block: a spacious 3×2 grid of large tiles. */
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

      <div className={`mt-6 ${TILE_GRID}`}>
        {TILES.map((tile) => (
          <a
            key={tile.title}
            href={routeHref(tile.route)}
            className={`${TILE_CONTAINER} transition-colors hover:bg-parchment-deep`}
          >
            {tile.hoverImage && <TilePhoto src={tile.hoverImage.src} />}

            {/* Icon — the visual anchor. */}
            <span className={`relative text-accent ${TILE_TEXT_FLIP}`}>
              {ICONS[tile.icon]}
            </span>

            {/* Title + subtitle, each with breathing room. Text flips light
                over the darkened photo so it stays legible throughout. */}
            <span
              className={`relative mt-6 block text-xl font-semibold leading-snug text-ink ${TILE_TEXT_FLIP}`}
            >
              {tile.title}
            </span>
            <span
              className={`relative mb-6 mt-3 block text-sm leading-relaxed text-ink-soft ${TILE_TEXT_FLIP_SOFT}`}
            >
              {tile.subtitle}
            </span>

            <TileFooter />
          </a>
        ))}
      </div>
    </section>
  );
}
