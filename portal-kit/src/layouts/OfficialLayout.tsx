/**
 * OfficialLayout — Portal 1's shell.
 *
 * Reuses the host's chrome pattern (a slim bar + the host's own TopBar/
 * SiteHeader in preview) and adds: a forest-green "OFFICIAL PORTAL" badge,
 * the signed-in identity with sign-out, and the section tab strip. All
 * typography/colour decisions inherit host tokens — nothing restyled.
 */
import type { ReactNode } from 'react';
import PortalTabs from '../components/PortalTabs';
import { usePortal } from '../PortalStore';
import { DEMO_OFFICIAL } from '../mockData';

export default function OfficialLayout({
  tabs,
  activePath,
  children,
}: {
  tabs: Array<{ path: string; label: string }>;
  activePath: string;
  children: ReactNode;
}) {
  const { state, logout } = usePortal();
  const user = state.user;

  return (
    <div>
      {/* Portal banner — forest green, the kit's one new colour moment. */}
      <div className="bg-forest text-parchment">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="border border-parchment/40 px-2 py-0.5 text-[11px] font-semibold tracking-wider">
              OFFICIAL PORTAL
            </span>
            <span className="text-xs text-parchment/80">
              District Collector's console — portfolio-wide view
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-parchment/90">
              {user?.name ?? DEMO_OFFICIAL.name}
            </span>
            <button
              type="button"
              onClick={logout}
              className="border border-parchment/40 px-3 py-1 font-medium text-parchment transition-colors hover:bg-parchment hover:text-forest"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
        <PortalTabs tabs={tabs} activePath={activePath} />
        <div className="pt-8">{children}</div>
      </div>
    </div>
  );
}
