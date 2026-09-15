/**
 * CitizenLayout — Portal 2's shell.
 *
 * Visually simpler than the official's console: same tokens, less density,
 * warmer accent. The citizen's name greets them; the tabs are plain words
 * (Status / Notifications / Documents) — no jargon, no score tables.
 *
 * Bilingual: EN / हिंदी toggle in the banner switches every citizen-portal
 * label for the session (official console stays English, like a real
 * GoI internal tool).
 */
import type { ReactNode } from 'react';
import PortalTabs from '../components/PortalTabs';
import { usePortal } from '../PortalStore';
import { DEMO_CITIZEN } from '../mockData';
import { t } from '../i18n';
import type { CitizenLang } from '../portalTypes';

/** Citizen tab labels come from i18n, keyed by route path. */
const TAB_KEY: Record<string, 'status' | 'notifications' | 'documents'> = {
  '/citizen/status': 'status',
  '/citizen/notifications': 'notifications',
  '/citizen/documents': 'documents',
};

export default function CitizenLayout({
  tabs,
  activePath,
  children,
}: {
  tabs: Array<{ path: string; label: string }>;
  activePath: string;
  children: ReactNode;
}) {
  const { state, logout, setLang } = usePortal();
  const user = state.user;
  const strings = t(state.lang);
  const unread = state.notifications.length;

  const localizedTabs = tabs.map((tab) => {
    const key = TAB_KEY[tab.path];
    return key ? { ...tab, label: strings.tabs[key] } : tab;
  });

  const langButton = (code: CitizenLang, label: string) => (
    <button
      key={code}
      type="button"
      onClick={() => setLang(code)}
      aria-pressed={state.lang === code}
      className={`px-2 py-0.5 font-semibold transition-colors ${
        state.lang === code
          ? 'bg-parchment text-accent'
          : 'text-parchment/80 hover:text-parchment'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Citizen banner — terracotta accent to distinguish from official's forest. */}
      <div className="bg-accent text-parchment">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="border border-parchment/40 px-2 py-0.5 text-[11px] font-semibold tracking-wider">
              {strings.banner}
            </span>
            <span className="text-xs text-parchment/85">
              {strings.greeting(
                user?.name ?? DEMO_CITIZEN.name,
                DEMO_CITIZEN.village,
              )}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {/* Language toggle — EN | हिं */}
            <span
              role="group"
              aria-label="Language / भाषा"
              className="flex items-center border border-parchment/40"
            >
              {langButton('en', 'EN')}
              <span aria-hidden="true" className="text-parchment/40">|</span>
              {langButton('hi', 'हिं')}
            </span>
            <a
              href="#/citizen/notifications"
              className="border border-parchment/40 px-3 py-1 font-medium text-parchment transition-colors hover:bg-parchment hover:text-accent"
            >
              {strings.messages}
              {unread > 0 ? ` (${unread})` : ''}
            </a>
            <button
              type="button"
              onClick={logout}
              className="border border-parchment/40 px-3 py-1 font-medium text-parchment transition-colors hover:bg-parchment hover:text-accent"
            >
              {strings.signOut}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6">
        <PortalTabs tabs={localizedTabs} activePath={activePath} />
        <div className="pt-8">{children}</div>
      </div>
    </div>
  );
}
