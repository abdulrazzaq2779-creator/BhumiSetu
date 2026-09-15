/**
 * OfficialAlertsPage — the alert feed + "Notify Landowner" action.
 *
 * THE key demo moment lives here: sending a notification writes to the
 * shared PortalStore, which the citizen's inbox reads — one store, so the
 * connection is genuinely live. Includes a small message-type selector,
 * message box and success toast on send.
 */
import { useEffect, useRef, useState } from 'react';
import { usePortal } from '../PortalStore';
import { useSimulation } from '../../../src/state/simulation';
import { seedAlerts, DEMO_CITIZEN } from '../mockData';
import {
  PageHeading,
  PANEL_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
  LABEL_CLASS,
  INPUT_CLASS,
} from '../tokens';
import type { NotifyMessageType } from '../portalTypes';

const MESSAGE_TYPES: NotifyMessageType[] = [
  'Document Request',
  'Compensation Offer',
  'Hearing Date',
  'General Update',
];

const SEVERITY_CLASS = {
  High: 'border-risk-high text-risk-high',
  Medium: 'border-risk-medium text-risk-medium',
  Low: 'border-risk-low text-risk-low',
} as const;

export default function OfficialAlertsPage() {
  const { pushNotification, toast } = usePortal();
  // Simulated data-cycle events (from the TopBar control) lead the feed.
  const { events: cycleEvents } = useSimulation();

  /** Which alert's modal is open (only one at a time). */
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<NotifyMessageType>('General Update');
  const [message, setMessage] = useState('');

  const openModal = (alertId: string) => {
    setOpenFor(alertId);
    setMsgType('General Update');
    setMessage('');
  };

  const send = () => {
    // Cycle events and seeded alerts are both actionable.
    const alert = [...cycleEvents, ...seedAlerts].find((a) => a.id === openFor);
    if (!alert || message.trim() === '') return;
    pushNotification({
      projectId: alert.projectId,
      projectName: alert.projectName,
      type: msgType,
      message: message.trim(),
      ago: 'Just now',
      // The kit links every notification to the demo citizen; a real build
      // would resolve landowners per project from the survey database.
      recipient: DEMO_CITIZEN.name,
    });
    toast(`Notification sent to ${DEMO_CITIZEN.name}`);
    setOpenFor(null);
  };

  const activeAlert =
    [...cycleEvents, ...seedAlerts].find((a) => a.id === openFor) ?? null;

  // Modal a11y: focus the message box on open; Escape closes.
  const messageRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (activeAlert) {
      messageRef.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpenFor(null);
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
  }, [activeAlert]);

  return (
    <div>
      <PageHeading eyebrow="OFFICIAL PORTAL" title="Risk Alerts">
        Risk-change events from the monitoring engine. When an alert concerns
        landowners, notify them directly — it lands in their Citizen Portal
        inbox instantly.
      </PageHeading>

      {/* Feed — newest first. Simulated cycle events lead, seeded base follows. */}
      <div className="mt-8 space-y-4">
        {[...cycleEvents, ...seedAlerts].map((a) => (
          <article
            key={a.id}
            className={`${PANEL_CLASS} flex flex-wrap items-start justify-between gap-4`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`border-l-4 px-2 py-0.5 text-xs font-semibold ${SEVERITY_CLASS[a.severity]}`}
                >
                  {a.severity}
                </span>
                <span className="text-xs text-ink-faint">{a.ago}</span>
              </div>
              <h2 className="mt-2 font-serif text-lg font-bold text-ink">{a.event}</h2>
              <p className="mt-1 text-sm text-ink-soft">
                {a.projectName} ·{' '}
                <a
                  href={`#/projects/${encodeURIComponent(a.projectId)}`}
                  className="font-medium text-accent hover:underline"
                >
                  {a.projectId}
                </a>
              </p>
            </div>
            <button
              type="button"
              onClick={() => openModal(a.id)}
              className={PRIMARY_BUTTON_CLASS}
            >
              Notify Landowner
            </button>
          </article>
        ))}
      </div>

      {/* The Notify Landowner modal. */}
      {activeAlert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="notify-title"
          className="fixed inset-0 z-40 flex items-center justify-center bg-ink/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenFor(null);
          }}
        >
          <div className="w-full max-w-lg border border-line bg-surface p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="notify-title" className="font-serif text-xl font-bold text-ink">
                  Notify Landowner
                </h2>
                <p className="mt-1 text-sm text-ink-soft">Re: {activeAlert.projectName}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenFor(null)}
                aria-label="Close"
                className="text-ink-soft hover:text-accent"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <label className={`${LABEL_CLASS} mt-5 block`}>
              Message type
              <select
                value={msgType}
                onChange={(e) => setMsgType(e.target.value as NotifyMessageType)}
                className={INPUT_CLASS}
              >
                {MESSAGE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className={`${LABEL_CLASS} mt-4 block`}>
              Message
              <textarea
                ref={messageRef}
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Short, plain-language message for the landowner…"
                className={`${INPUT_CLASS} resize-y`}
              />
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setOpenFor(null)} className={SECONDARY_BUTTON_CLASS}>
                Cancel
              </button>
              <button
                type="button"
                onClick={send}
                disabled={message.trim() === ''}
                className={`${PRIMARY_BUTTON_CLASS} disabled:cursor-not-allowed disabled:opacity-40`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
