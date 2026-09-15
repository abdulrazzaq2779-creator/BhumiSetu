/**
 * FAQs page (#/faqs) — searchable accordion.
 *
 * Ten Q&As covering scoring, access, factors, compensation gap, High-risk
 * escalation, data, grievances and update cadence. A keyword input filters
 * the list live (question + answer text); questions expand one at a time
 * with a smooth height transition, matching the portal's hairline/terracotta
 * tokens.
 */
import { useMemo, useState } from 'react';

interface Faq {
  id: string;
  q: string;
  a: string;
}

const FAQS: Faq[] = [
  {
    id: 'scoring',
    q: 'How does the risk scoring work?',
    a: 'Every monitored plot carries five inputs — compensation gap, ownership mismatches, litigation status, approval delay and rehabilitation backlog. Each is scored and multiplied by its weight, producing a 0–100 risk score. A score of 50 or above is flagged High risk; 25–49 is Medium. The full methodology is on the About page.',
  },
  {
    id: 'access',
    q: 'Who can access the portal?',
    a: 'The portal is built for District Collectors, State Revenue Departments and project implementing agencies. Public visitors can browse project risk levels on the dashboard, risk map and reports; login access for officers is issued through the District Administration Office — the portal does not create accounts directly.',
  },
  {
    id: 'factors',
    q: 'What do the five risk factors mean?',
    a: 'Compensation Gap (weight 20): how far the offered compensation sits below the prevailing market rate. Ownership Mismatch (25): plots where revenue records disagree with actual possession or inheritance. Active Litigation (30): stay orders, appeals or disputes before a court. Approval Delay (15): days lost in inter-department hand-offs and notifications. R&R Backlog (10): families still awaiting resettlement and rehabilitation.',
  },
  {
    id: 'comp-gap',
    q: 'How is the compensation gap calculated?',
    a: 'For each plot, the gap compares the compensation offered against the prevailing market rate for comparable land, expressed as a percentage shortfall. The points scale saturates: gaps keep earning more points only up to a 35% shortfall, after which the factor maxes out — the engine treats extreme shortfalls as a known ceiling rather than an open-ended penalty.',
  },
  {
    id: 'high-risk',
    q: 'What happens when a project is flagged High risk?',
    a: 'The project rises to the top of the risk dashboard queue and its driving factors are listed with plain-language explanations and suggested corrective actions. District administrations use the queue to prioritise review — typically expediting compensation disbursement, clearing record mismatches or fast-tracking pending approvals before delays compound.',
  },
  {
    id: 'data-sources',
    q: 'Where does the data come from?',
    a: 'In a production deployment, inputs would flow from revenue records, court case listings, compensation disbursement registers, approval workflow systems and R&R progress reports. The current demonstration build uses representative data grounded in documented public land-acquisition cases, so figures are indicative rather than live.',
  },
  {
    id: 'refresh',
    q: 'How often do scores update?',
    a: 'Scores refresh on each data cycle — currently a weekly batch run. When new data lands (a court order, a disbursement record, an approval), affected plots are re-scored and the dashboard, map and detail pages reflect the change from the next cycle onward.',
  },
  {
    id: 'grievance-file',
    q: 'How do I raise a grievance?',
    a: 'Use the Grievance Redressal page: file under Compensation Dispute, Ownership Issue, Delay Complaint or Other, and a reference number is generated. Quote that reference in all correspondence and use the "Track Existing Grievance" tab on the same page to check status. Landowners can also walk in to the District Administration Office or call the helpline at 1800-111-957.',
  },
  {
    id: 'grievance-track',
    q: 'Can I check the status of a grievance I already filed?',
    a: 'Yes — open the Grievance Redressal page and switch to the "Track Existing Grievance" tab, then enter the reference number you received when filing. The tracker shows the current stage, from intake through review to resolution.',
  },
  {
    id: 'about',
    q: 'What is Bhoomi Setu, in one line?',
    a: 'A Government of India risk-monitoring portal that scores land acquisition projects for delay risk so administrations can act before years — and crores — are lost to preventable stalls.',
  },
];

/** Collapsible row; grid-rows trick gives the smooth height transition. */
function FaqRow({
  faq,
  open,
  onToggle,
}: {
  faq: Faq;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-panel-${faq.id}`}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-parchment-deep sm:px-5"
      >
        <span className="font-serif text-base font-semibold text-ink">{faq.q}</span>
        <span
          aria-hidden="true"
          className={`shrink-0 text-accent transition-transform duration-300 ${
            open ? 'rotate-45' : ''
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <div
        id={`faq-panel-${faq.id}`}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-4 pb-4 text-sm leading-relaxed text-ink-soft sm:px-5">
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqsPage() {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === '') return FAQS;
    return FAQS.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="border-b border-line pb-5">
        <p className="font-serif text-sm italic text-accent">HELP</p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-ink">
          Frequently Asked Questions
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft">
          How the portal scores risk, who can access what, and where to go
          when something needs escalating.
        </p>
      </header>

      {/* Live keyword filter over question + answer text. */}
      <div className="mt-8 max-w-xl">
        <label className="block text-xs font-medium text-ink-soft">
          Search questions
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. compensation, grievance, data…"
            className="mt-1 block w-full border border-line-strong bg-parchment px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-6 border border-line bg-surface">
        {filtered.map((faq) => (
          <FaqRow
            key={faq.id}
            faq={faq}
            open={openId === faq.id}
            onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-ink-soft">
            No questions match "{query}". Try a shorter keyword — for example
            "compensation" or "grievance".
          </p>
        )}
      </div>

      <p className="mt-6 text-sm leading-relaxed text-ink-soft">
        Still stuck? The helpline at{' '}
        <span className="font-medium text-ink">1800-111-957</span> and{' '}
        <span className="font-medium text-ink">help@bhumisetu.gov.in</span>{' '}
        answer portal and acquisition queries, or file a grievance from the{' '}
        <a href="#/grievance" className="text-accent hover:underline">
          Grievance Redressal
        </a>{' '}
        page.
      </p>
    </div>
  );
}
