/**
 * CitizenNotificationsPage — the citizen's inbox.
 *
 * Reads the SAME shared PortalStore the official's "Notify Landowner"
 * writes to — so a message sent in the Official Portal appears here the
 * moment you switch portals (no reload needed; both render from one store).
 * This live connection is the demo's key moment.
 *
 * Bilingual: labels follow the EN/हिंदी toggle in the citizen layout.
 */
import { usePortal } from '../PortalStore';
import { DEMO_CITIZEN } from '../mockData';
import { PageHeading, PANEL_CLASS } from '../tokens';
import { t } from '../i18n';

const TYPE_CLASS: Record<string, string> = {
  'Document Request': 'border-risk-medium text-risk-medium',
  'Compensation Offer': 'border-forest text-forest',
  'Hearing Date': 'border-risk-high text-risk-high',
  'General Update': 'border-line-strong text-ink-soft',
};

/** Bilingual type badges for the four notice types. */
const TYPE_HI: Record<string, string> = {
  'Document Request': 'दस्तावेज़ अनुरोध',
  'Compensation Offer': 'मुआवज़ा प्रस्ताव',
  'Hearing Date': 'सुनवाई तिथि',
  'General Update': 'सामान्य सूचना',
};

export default function CitizenNotificationsPage() {
  const { state } = usePortal();
  const lang = state.lang;
  const strings = t(lang).notifications;

  const mine = state.notifications.filter(
    (n) => n.recipient === undefined || n.recipient === DEMO_CITIZEN.name,
  );

  return (
    <div>
      <PageHeading eyebrow={strings.eyebrow} title={strings.title}>
        {strings.intro}
      </PageHeading>

      {mine.length === 0 ? (
        <section className={`${PANEL_CLASS} mt-8 text-center`} role="status">
          <svg
            viewBox="0 0 24 24"
            className="mx-auto h-12 w-12 text-line-strong"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="1" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          <h2 className="mt-4 font-serif text-xl font-bold text-ink">
            {strings.emptyTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
            {strings.empty}
          </p>
          <p className="mt-4 text-xs text-ink-faint">{strings.emptyTip}</p>
        </section>
      ) : (
        <div className="mt-8 space-y-4">
          <p className="text-xs text-ink-faint" role="status">
            {strings.count(mine.length)}
          </p>
          {mine.map((n) => (
            <article key={n.id} className={PANEL_CLASS}>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`border-l-4 px-2 py-0.5 text-xs font-semibold ${TYPE_CLASS[n.type] ?? TYPE_CLASS['General Update']}`}
                >
                  {lang === 'hi' ? (TYPE_HI[n.type] ?? n.type) : n.type}
                </span>
                <span className="text-xs text-ink-faint">{n.ago}</span>
              </div>
              <h2 className="mt-2 font-serif text-lg font-bold text-ink">
                {n.projectName}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{n.message}</p>
              <p className="mt-3 border-t border-line pt-3 text-xs text-ink-faint">
                {strings.sentBy} {n.projectId}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
