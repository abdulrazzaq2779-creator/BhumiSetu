/**
 * Project detail dialog — the click-through target for dashboard cards.
 *
 * Minimal modal in the page's hairline-surface style: Escape or a backdrop
 * click closes it, focus moves to the dialog on open and returns to the
 * previously focused element (the card) on close. Content mirrors every
 * field the old table row showed, plus the project's status summary.
 */
import { useEffect, useRef } from 'react';
import type { RiskLevel } from '../engine/types';

const LEVEL_CLASS: Record<RiskLevel, string> = {
  High: 'border-risk-high text-risk-high',
  Medium: 'border-risk-medium text-risk-medium',
  Low: 'border-risk-low text-risk-low',
};

export interface ProjectDetail {
  id: string;
  name: string;
  district: string;
  state: string;
  stage: string;
  progressPct: number;
  score: number;
  level: RiskLevel;
  primaryDriver: string;
  summary: string;
}

export default function ProjectDetailModal({
  project,
  onClose,
}: {
  project: ProjectDetail;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Remember the trigger (the focused card) so focus can return to it.
    restoreRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      restoreRef.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
        className="max-h-[85vh] w-full max-w-xl overflow-y-auto border border-line bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <span
              className={`inline-block border-l-4 px-2 py-1 text-xs font-semibold ${LEVEL_CLASS[project.level]}`}
            >
              {project.level} risk · {project.score}
            </span>
            <h2
              id="project-detail-title"
              className="mt-2 font-serif text-lg font-bold text-ink"
            >
              {project.name}
            </h2>
            <p className="mt-0.5 text-xs text-ink-faint">
              {project.id} · {project.district}, {project.state}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="border border-line-strong px-2.5 py-1 text-sm text-ink-soft hover:text-ink"
          >
            ✕
          </button>
        </div>

        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 px-5 py-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-ink-soft">Stage</dt>
            <dd className="mt-0.5 text-ink">{project.stage}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-ink-soft">Progress</dt>
            <dd className="mt-0.5 text-ink">{project.progressPct}% acquired</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-ink-soft">Primary driver</dt>
            <dd className="mt-0.5 text-ink">{project.primaryDriver}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-ink-soft">Status summary</dt>
            <dd className="mt-0.5 leading-relaxed text-ink-soft">
              {project.summary}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
