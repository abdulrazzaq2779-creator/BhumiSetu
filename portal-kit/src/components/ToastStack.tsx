/**
 * Toast notifications — bottom-right stack, self-dismissing.
 * Uses the shared store so ANY kit page can raise one line of feedback.
 */
import { usePortal, useToastAutoDismiss } from '../PortalStore';

export default function ToastStack() {
  const { state, dismissToast } = usePortal();
  useToastAutoDismiss();

  if (state.toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2"
    >
      {state.toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="flex items-start justify-between gap-3 border border-forest bg-parchment px-4 py-3 shadow-lg"
        >
          <p className="text-sm text-ink">{t.text}</p>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss notification"
            className="shrink-0 text-ink-soft hover:text-accent"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
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
      ))}
    </div>
  );
}
