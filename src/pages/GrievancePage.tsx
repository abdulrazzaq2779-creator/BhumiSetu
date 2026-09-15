/**
 * Grievance Redressal (#/grievance) — UI-only demo. There is NO real
 * backend: submissions generate a mock reference number and the tracker
 * answers from a small in-memory list. Nothing is stored or transmitted.
 *
 * Two tabs — "File a Grievance" and "Track Existing Grievance" — matching
 * the portal's hairline borders, terracotta accents and serif headings.
 */
import { useState } from 'react';
import { monitoredProjects } from '../data/projects';

type Tab = 'file' | 'track';

type Category = 'Compensation Dispute' | 'Ownership Issue' | 'Delay Complaint' | 'Other';

const inputClass =
  'mt-1 block w-full border border-line-strong bg-parchment px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:outline-none';

const labelClass = 'block text-xs font-medium text-ink-soft';

/** Mock statuses the tracker can return. */
const MOCK_STATUSES = ['Under Review', 'Resolved'] as const;
type MockStatus = (typeof MOCK_STATUSES)[number];

/** In-memory demo store for this session — reset on page reload. */
const demoStore = new Map<string, { category: Category; status: MockStatus }>();

function makeReference(): string {
  const seq = 141 + demoStore.size; // GR-2026-0142, 0143, …
  return `GR-2026-0${String(seq).padStart(3, '0')}`;
}

const inputId = 'track-ref-input';

export default function GrievancePage() {
  const [tab, setTab] = useState<Tab>('file');

  // ── File tab ────────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [projectId, setProjectId] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState<string | null>(null);

  // ── Track tab ───────────────────────────────────────────────────────────
  const [trackInput, setTrackInput] = useState('');
  const [trackResult, setTrackResult] = useState<
    { ref: string; status: MockStatus } | { ref: string; error: string } | null
  >(null);

  const fileGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = makeReference();
    demoStore.set(ref.toUpperCase(), {
      category: (category || 'Other') as Category,
      status: 'Under Review',
    });
    setReference(ref);
  };

  const trackGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = trackInput.trim().toUpperCase();
    if (ref === '') return;
    const record = demoStore.get(ref);
    if (record) {
      setTrackResult({ ref, status: record.status });
    } else {
      // Seeded examples so tracking feels real before anything is filed.
      const seeded: Record<string, MockStatus> = {
        'GR-2025-0087': 'Resolved',
        'GR-2026-0031': 'Under Review',
      };
      const seededStatus = seeded[ref];
      setTrackResult(
        seededStatus
          ? { ref, status: seededStatus }
          : { ref, error: 'No grievance found with this reference number.' },
      );
    }
  };

  const resetForm = () => {
    setName('');
    setContact('');
    setProjectId('');
    setCategory('');
    setDescription('');
    setReference(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="border-b border-line pb-5">
        <p className="font-serif text-sm italic text-accent">SERVICES</p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-ink">
          Grievance Redressal
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft">
          File a grievance on a compensation, ownership or delay matter — and
          track it to resolution with your reference number.
        </p>
      </header>

      {/* Tabs */}
      <div className="mt-8 flex gap-2" role="tablist" aria-label="Grievance actions">
        {(
          [
            ['file', 'File a Grievance'],
            ['track', 'Track Existing Grievance'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`border px-4 py-2 text-sm font-medium transition-colors ${
              tab === key
                ? 'border-accent bg-accent text-parchment'
                : 'border-line-strong bg-surface text-ink-soft hover:border-accent hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'file' && (
        <div className="mt-6 max-w-2xl border border-line bg-surface p-6 sm:p-8">
          {reference === null ? (
            <form onSubmit={fileGrievance}>
              <label className={labelClass}>
                Name
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className={inputClass}
                />
              </label>

              <label className={`${labelClass} mt-4 block`}>
                Contact number
                <input
                  type="tel"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  autoComplete="tel"
                  placeholder="10-digit mobile"
                  className={inputClass}
                />
              </label>

              <label className={`${labelClass} mt-4 block`}>
                Project / Plot ID (optional)
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className={inputClass}
                >
                  <option value="">— Not tied to a listed project —</option>
                  {monitoredProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {p.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className={`${labelClass} mt-4 block`}>
                Grievance category
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select a category…
                  </option>
                  <option>Compensation Dispute</option>
                  <option>Ownership Issue</option>
                  <option>Delay Complaint</option>
                  <option>Other</option>
                </select>
              </label>

              <label className={`${labelClass} mt-4 block`}>
                Description
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue — plot number, what happened, when…"
                  className={`${inputClass} resize-y`}
                />
              </label>

              <button
                type="submit"
                className="mt-6 w-full border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-parchment transition-colors hover:bg-accent-deep sm:w-auto"
              >
                Submit Grievance
              </button>
              <p className="mt-3 text-[11px] text-ink-faint">
                Demo notice: submissions are not stored or sent anywhere — a
                reference number is generated for illustration only.
              </p>
            </form>
          ) : (
            <div role="status" className="py-6 text-center">
              <svg
                viewBox="0 0 24 24"
                className="mx-auto h-12 w-12 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12.5 2.8 2.8L16.5 9" />
              </svg>
              <h2 className="mt-4 font-serif text-2xl font-bold text-ink">
                Grievance recorded
              </h2>
              <p className="mt-2 text-sm text-ink-soft">
                Your grievance has been recorded. Use this reference number to
                track status.
              </p>
              <p className="mt-5 inline-block border-2 border-accent bg-parchment px-6 py-3 font-serif text-2xl font-bold tracking-wide text-accent">
                {reference}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setTab('track')}
                  className="border border-accent bg-accent px-5 py-2 text-sm font-semibold text-parchment transition-colors hover:bg-accent-deep"
                >
                  Track this grievance
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-line-strong bg-surface px-5 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-accent hover:text-ink"
                >
                  File another
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'track' && (
        <div className="mt-6 max-w-2xl border border-line bg-surface p-6 sm:p-8">
          <form onSubmit={trackGrievance}>
            <label className={labelClass}>
              Reference number
              <input
                id={inputId}
                type="text"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                placeholder="e.g. GR-2026-0142"
                className={`${inputClass} font-mono uppercase`}
              />
            </label>
            <button
              type="submit"
              className="mt-5 w-full border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-parchment transition-colors hover:bg-accent-deep sm:w-auto"
            >
              Check Status
            </button>
          </form>

          {trackResult && (
            <div role="status" className="mt-6 border-t border-line pt-6">
              {'error' in trackResult ? (
                <p className="border-l-4 border-risk-medium bg-parchment px-4 py-3 text-sm text-ink-soft">
                  {trackResult.error} Double-check the format — it looks like
                  {' '}<span className="font-mono">GR-2026-0142</span>.
                </p>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-ink-soft">Reference</p>
                    <p className="font-mono text-lg font-bold text-ink">{trackResult.ref}</p>
                  </div>
                  <p
                    className={`border px-3 py-1.5 text-sm font-semibold ${
                      trackResult.status === 'Resolved'
                        ? 'border-risk-low text-risk-low'
                        : 'border-risk-medium text-risk-medium'
                    }`}
                  >
                    {trackResult.status}
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="mt-6 text-[11px] text-ink-faint">
            Demo notice: try a reference you filed this session, or{' '}
            <span className="font-mono">GR-2025-0087</span> /{' '}
            <span className="font-mono">GR-2026-0031</span> for seeded examples.
          </p>
        </div>
      )}
    </div>
  );
}
