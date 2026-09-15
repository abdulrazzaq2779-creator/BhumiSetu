/**
 * CitizenStatusPage — "Where does my land stand?"
 *
 * Deliberately simple: ONE property, a horizontal stepper of the five
 * acquisition stages, and one plain-language sentence that says what
 * happens next. No scores, no jargon — this user is not an analyst.
 * The stage shown derives from the linked project's real progress so it
 * stays consistent with the official portal.
 *
 * Bilingual (EN/हिंदी via the layout toggle) and now carries the "My Land"
 * identity card: a stylised plot sketch, survey number, area and the
 * linked project — a person's connection to their own piece of ground.
 */
import { monitoredProjects, litigationNoteFor } from '../../../src/data/projects';
import { usePortal } from '../PortalStore';
import { DEMO_CITIZEN } from '../mockData';
import { PageHeading, PANEL_CLASS } from '../tokens';
import { t } from '../i18n';
import type { CitizenLang } from '../portalTypes';

const STAGES = [
  'notification',
  'survey',
  'valuation',
  'compensation',
  'possession',
] as const;

const STAGE_BLURBS: Record<CitizenLang, string[]> = {
  en: [
    'Government records the intent to acquire land in your area.',
    'Officials measure and record the boundaries of your property.',
    'The market value of your land and structures is calculated.',
    'Your compensation amount is decided and awarded.',
    'After payment, the land is formally handed over.',
  ],
  hi: [
    'सरकार आपके क्षेत्र में भूमि अधिग्रहण का इरादा दर्ज करती है।',
    'अधिकारी आपकी संपत्ति की सीमाएँ मापकर दर्ज करते हैं।',
    'आपकी भूमि और ढाँचों का बाज़ार मूल्य गणना किया जाता है।',
    'आपके मुआवज़े की राशि तय और स्वीकृत होती है।',
    'भुगतान के बाद भूमि औपचारिक रूप से सौंप दी जाती है।',
  ],
};

/** Maps the linked project's stage + progress to a citizen stepper index. */
function currentStageIndex(): number {
  const project = monitoredProjects.find((p) => p.id === DEMO_CITIZEN.projectId);
  if (!project) return 0;
  switch (project.stage) {
    case 'Notification & survey':
      return project.progressPct < 15 ? 0 : 1;
    case 'Compensation':
      return 3;
    case 'Possession':
      return 4;
    case 'R&R':
      return 4;
  }
}

/** Mock dated milestones behind the stepper (demo narrative). */
const TIMELINE: Array<{ date: string; en: string; hi: string; done: boolean }> = [
  { date: '12 Mar 2023', en: 'Section 4 notification published', hi: 'धारा 4 अधिसूचना प्रकाशित', done: true },
  { date: '08 Jun 2023', en: 'Survey of SY-114/2 completed', hi: 'SY-114/2 का सर्वेक्षण पूर्ण', done: true },
  { date: '19 Jan 2024', en: 'Valuation visit scheduled', hi: 'मूल्यांकन भ्रमण निर्धारित', done: true },
  { date: '—', en: 'Compensation award pending', hi: 'मुआवज़ा पुरस्कार लंबित', done: false },
  { date: '—', en: 'Possession handover', hi: 'कब्ज़ा हस्तांतरण', done: false },
];

export default function CitizenStatusPage() {
  const { state } = usePortal();
  const lang = state.lang;
  const strings = t(lang);
  const s = strings.status;
  const idx = currentStageIndex();
  const project = monitoredProjects.find((p) => p.id === DEMO_CITIZEN.projectId);
  const litigated = project?.riskInput.litigationFlag ?? false;

  return (
    <div>
      <PageHeading eyebrow={s.eyebrow} title={s.title}>
        {s.intro}
      </PageHeading>

      {/* MY LAND — the personal identity card with a stylised plot sketch. */}
      <section className={`${PANEL_CLASS} mt-8`} aria-label="My land record">
        <div className="flex flex-wrap items-start gap-6">
          {/* Stylised plot — clearly marked as illustrative. */}
          <div className="shrink-0" aria-hidden="true">
            <svg viewBox="0 0 120 96" className="h-24 w-30">
              <rect x="1" y="1" width="118" height="94" fill="#ece6d6" stroke="#bfb49c" />
              {/* Neighbouring parcels (fainter) and the citizen's parcel. */}
              <path d="M1 1 H62 V48 H1 Z" fill="#e0d8c4" stroke="#bfb49c" strokeDasharray="3 2" />
              <path d="M62 1 H119 V30 H62 Z" fill="#e0d8c4" stroke="#bfb49c" strokeDasharray="3 2" />
              <path d="M62 30 H119 V95 H62 Z" fill="#e0d8c4" stroke="#bfb49c" strokeDasharray="3 2" />
              <rect
                x="12"
                y="54"
                width="46"
                height="36"
                fill="#9c4a2f"
                opacity="0.85"
                stroke="#7d3a24"
              />
              <text x="35" y="76" textAnchor="middle" fontSize="11" fill="#f4f0e6" fontWeight="700">
                114/2
              </text>
              {/* Road */}
              <path d="M4 50 H116" stroke="#8b8272" strokeWidth="5" />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-ink">
                  {DEMO_CITIZEN.name}
                </h2>
                <p className="mt-1 text-sm text-ink-soft">{DEMO_CITIZEN.village}</p>
              </div>
              <div className="text-right text-xs text-ink-soft">
                <p className="font-medium text-ink">
                  {s.surveyNo} {DEMO_CITIZEN.surveyNo}
                </p>
                <p className="mt-0.5">{DEMO_CITIZEN.area}</p>
              </div>
            </div>
            <p className="mt-4 border-t border-line pt-4 text-sm text-ink-soft">
              {s.partOf}{' '}
              <span className="font-medium text-ink">{project?.name ?? '—'}</span>{' '}
              <span className="text-ink-faint">({DEMO_CITIZEN.projectId})</span>
            </p>
            {litigated && project && (
              <p className="mt-2 border-l-4 border-risk-high bg-parchment px-3 py-1.5 text-xs text-ink">
                {litigationNoteFor(project)}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Horizontal stepper — the one visual centrepiece on this page. */}
      <section className={`${PANEL_CLASS} mt-6`} aria-label="Acquisition progress">
        <ol className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {STAGES.map((key, i) => {
            const done = i < idx;
            const current = i === idx;
            const label = s.stage[key];
            return (
              <li key={key} className="relative flex flex-1 flex-col items-start">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-[17px] hidden h-0.5 w-full sm:block ${
                      i <= idx ? 'bg-accent' : 'bg-line-strong'
                    } -translate-x-2`}
                  />
                )}
                <span
                  aria-current={current ? 'step' : undefined}
                  className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 font-serif text-sm font-bold ${
                    done
                      ? 'border-accent bg-accent text-parchment'
                      : current
                        ? 'border-accent bg-parchment text-accent'
                        : 'border-line-strong bg-surface text-ink-faint'
                  }`}
                >
                  {done ? '✓' : i + 1}
                </span>
                <span
                  className={`mt-3 block text-sm font-semibold ${
                    current ? 'text-ink' : done ? 'text-ink-soft' : 'text-ink-faint'
                  }`}
                >
                  {label}
                  {current && (
                    <span className="ml-2 text-xs font-medium uppercase tracking-wide text-accent">
                      {s.current}
                    </span>
                  )}
                </span>
                <span className="mt-1 hidden text-xs leading-relaxed text-ink-faint sm:block">
                  {STAGE_BLURBS[lang][i]}
                </span>
              </li>
            );
          })}
        </ol>

        {/* The one sentence that matters most. */}
        <p
          className="mt-8 border-l-4 border-accent bg-parchment px-4 py-3 font-serif text-lg text-ink"
          aria-live="polite"
        >
          {(s.sentences as Record<number, string>)[idx]}
        </p>
      </section>

      {/* Journey timeline — dated milestones behind the stepper. */}
      <section className={`${PANEL_CLASS} mt-6`} aria-label={s.timelineTitle}>
        <h2 className="font-serif text-lg font-bold text-ink">{s.timelineTitle}</h2>
        <ol className="mt-4 space-y-0">
          {TIMELINE.map((m, i) => (
            <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
              {/* Rail + node */}
              {i < TIMELINE.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute left-[7px] top-4 h-full w-0.5 ${m.done ? 'bg-accent' : 'bg-line-strong'}`}
                />
              )}
              <span
                aria-hidden="true"
                className={`relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  m.done ? 'border-accent bg-accent' : 'border-line-strong bg-surface'
                }`}
              >
                {m.done && (
                  <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 text-parchment" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                )}
              </span>
              <div className="min-w-0">
                <p className={`text-sm ${m.done ? 'font-medium text-ink' : 'text-ink-faint'}`}>
                  {lang === 'hi' ? m.hi : m.en}
                </p>
                <p className="text-xs tabular-nums text-ink-faint">{m.date}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-4 text-xs leading-relaxed text-ink-faint">{s.demo}</p>
    </div>
  );
}
