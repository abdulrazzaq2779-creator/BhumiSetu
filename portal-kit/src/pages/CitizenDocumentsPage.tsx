/**
 * CitizenDocumentsPage — upload + status list (mock, no real storage).
 *
 * The file input reads name/size for the UI, then "uploads" into the shared
 * PortalStore so the document list behaves like real state. Seeded rows
 * demonstrate the three review statuses.
 *
 * New: bilingual labels; a demo "advance status" action (Received → Under
 * Review → Approved) with a self-drawing checkmark when Approved lands.
 */
import { useRef, useState } from 'react';
import { usePortal } from '../PortalStore';
import { PageHeading, PANEL_CLASS } from '../tokens';
import { t } from '../i18n';

const STATUS_CLASS = {
  Approved: 'border-risk-low text-risk-low',
  'Under Review': 'border-risk-medium text-risk-medium',
  Received: 'border-line-strong text-ink-soft',
} as const;

const STATUS_HI: Record<string, string> = {
  Approved: 'स्वीकृत',
  'Under Review': 'समीक्षा में',
  Received: 'प्राप्त',
};

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export default function CitizenDocumentsPage() {
  const { state, addDocument, advanceDocument, toast } = usePortal();
  const lang = state.lang;
  const strings = t(lang).documents;
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const onPick = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setBusy(true);
    // Mock "upload" — a short beat of latency so the UI feels real.
    window.setTimeout(() => {
      addDocument({
        name: file.name,
        size: formatBytes(file.size),
        status: 'Received',
        uploadedAgo: 'Uploaded just now',
      });
      toast(`"${file.name}" received — verification usually takes 5–7 days`);
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }, 600);
  };

  const advance = (id: string, status: string) => {
    if (status === 'Approved') return;
    advanceDocument(id);
    toast(
      status === 'Received'
        ? 'Document moved to Under Review'
        : 'Document approved ✓',
    );
  };

  return (
    <div>
      <PageHeading eyebrow={strings.eyebrow} title={strings.title}>
        {strings.intro}
      </PageHeading>

      {/* Upload zone. */}
      <section className={`${PANEL_CLASS} mt-8`}>
        <h2 className="font-serif text-xl font-bold text-ink">
          {strings.uploadTitle}
        </h2>
        <label
          className={`mt-4 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-line-strong bg-parchment px-6 py-10 text-center transition-colors hover:border-accent ${
            busy ? 'opacity-60' : ''
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 text-ink-soft"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 16V4m0 0-4 4m4-4 4 4" />
            <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
          </svg>
          <span className="mt-3 text-sm font-medium text-ink">
            {busy ? strings.uploading : strings.uploadCta}
          </span>
          <span className="mt-1 text-xs text-ink-faint">{strings.uploadHint}</span>
          <input
            ref={fileRef}
            type="file"
            className="sr-only"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => onPick(e.target.files)}
          />
        </label>
        <p className="mt-3 text-xs text-ink-faint">{strings.demoNotice}</p>
      </section>

      {/* Status list. */}
      <section className="mt-6" aria-label={strings.listTitle}>
        <h2 className="font-serif text-xl font-bold text-ink">{strings.listTitle}</h2>
        <ul className="mt-4 divide-y divide-line border border-line bg-surface">
          {state.documents.map((d) => (
            <li
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8 shrink-0 text-ink-soft"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" />
                  <path d="M14 3v5h5" />
                </svg>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{d.name}</p>
                  <p className="text-xs text-ink-faint">
                    {d.size} · {d.uploadedAgo}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {d.status === 'Approved' ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-risk-low/10">
                    <svg
                      viewBox="0 0 24 24"
                      className="draw-check h-4 w-4 text-risk-low"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => advance(d.id, d.status)}
                    className="border border-line-strong px-2 py-0.5 text-[11px] font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent"
                    title="Demo: advance the review status one step"
                  >
                    {d.status === 'Received' ? '→ Under Review' : '→ Approve'}
                  </button>
                )}
                <span
                  className={`border-l-4 px-2 py-0.5 text-xs font-semibold ${STATUS_CLASS[d.status]}`}
                >
                  {lang === 'hi' ? (STATUS_HI[d.status] ?? d.status) : d.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-faint">{strings.langNote}</p>
      </section>
    </div>
  );
}
