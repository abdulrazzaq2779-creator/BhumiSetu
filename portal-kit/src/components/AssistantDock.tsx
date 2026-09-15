/**
 * AssistantDock — the shared "Ask a Question" widget.
 *
 * A floating button (bottom-right, above the toast stack) opens a chat
 * drawer. Answers come from assistantEngine's pattern matching over
 * existing data — no LLM. Scope is enforced by role from context:
 * officials get portfolio answers; citizens only ever get answers derived
 * from their own record. A chip on each reply states the scope.
 */
import { useEffect, useRef, useState } from 'react';
import { usePortal } from '../PortalStore';
import { answerQuestion } from '../assistantEngine';
import type { AssistantTurn } from '../portalTypes';

let turnId = 1;

const SCOPE_CHIP: Record<'official' | 'citizen' | 'fallback', { label: string; className: string }> = {
  official: { label: 'Portfolio-wide', className: 'border-forest text-forest' },
  citizen: { label: 'Your record only', className: 'border-accent text-accent' },
  fallback: { label: 'General help', className: 'border-line-strong text-ink-soft' },
};

export default function AssistantDock() {
  const { state } = usePortal();
  const user = state.user;

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [turns, setTurns] = useState<AssistantTurn[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when the drawer opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keep the transcript scrolled to the newest turn.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [turns]);

  // Signed out → the dock disappears entirely.
  if (!user) return null;

  const send = () => {
    const q = input.trim();
    if (q === '') return;
    const answer = answerQuestion(q, user.role, {
      documents: state.documents,
      notifications: state.notifications,
    });
    setTurns((prev) => [
      ...prev,
      { id: turnId++, from: 'user', text: q },
      { id: turnId++, from: 'assistant', text: answer.text, source: answer.source },
    ]);
    setInput('');
  };

  return (
    <>
      {/* Floating trigger. */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="assistant-drawer"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 border border-ink bg-ink px-4 py-3 text-sm font-semibold text-parchment transition-colors hover:bg-accent-deep"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z" />
          <path d="M9 11h6M9 14h4" />
        </svg>
        Ask a Question
      </button>

      {/* Drawer. */}
      {open && (
        <div
          id="assistant-drawer"
          role="dialog"
          aria-label="Bhoomi Setu assistant"
          className="fixed bottom-20 right-4 z-40 flex h-[520px] w-[min(380px,calc(100vw-2rem))] flex-col border border-line bg-surface shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <h2 className="font-serif text-base font-bold text-ink">Bhoomi Setu Assistant</h2>
              <p className="text-[11px] text-ink-soft">
                {user.role === 'official'
                  ? 'Scope: all monitored projects'
                  : 'Scope: your property record only'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="text-ink-soft hover:text-accent"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Transcript. */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {turns.length === 0 && (
              <div className="border border-line bg-parchment p-3">
                <p className="text-sm text-ink-soft">
                  {user.role === 'official' ? (
                    <>
                      Ask me about your portfolio. Try:{' '}
                      <button type="button" className="font-medium text-accent hover:underline" onClick={() => setInput('Which project has the highest risk?')}>
                        "Which project has the highest risk?"
                      </button>{' '}
                      or{' '}
                      <button type="button" className="font-medium text-accent hover:underline" onClick={() => setInput('risk above 60')}>
                        "risk above 60"
                      </button>
                      .
                    </>
                  ) : (
                    <>
                      Ask me about your property. Try{' '}
                      <button type="button" className="font-medium text-accent hover:underline" onClick={() => setInput('What is my property status?')}>
                        "What is my property status?"
                      </button>{' '}
                      or{' '}
                      <button type="button" className="font-medium text-accent hover:underline" onClick={() => setInput('Do I have pending documents?')}>
                        "Do I have pending documents?"
                      </button>
                      .
                    </>
                  )}
                </p>
              </div>
            )}

            {turns.map((t) =>
              t.from === 'user' ? (
                <div key={t.id} className="ml-auto max-w-[85%] border border-ink bg-ink px-3 py-2 text-sm text-parchment">
                  {t.text}
                </div>
              ) : (
                <div key={t.id} className="max-w-[90%] border border-line bg-parchment px-3 py-2.5">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-ink">{t.text}</p>
                  {t.source && (
                    <span className={`mt-2 inline-block border-l-2 px-1.5 text-[10px] font-semibold uppercase tracking-wide ${SCOPE_CHIP[t.source].className}`}>
                      {SCOPE_CHIP[t.source].label}
                    </span>
                  )}
                </div>
              ),
            )}
          </div>

          {/* Composer. */}
          <form
            className="border-t border-line p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question…"
                aria-label="Your question"
                className="min-w-0 flex-1 border border-line-strong bg-parchment px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                className="border border-accent bg-accent px-4 text-sm font-semibold text-parchment transition-colors hover:bg-accent-deep"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-[10px] text-ink-faint">
              Pattern-matched demo assistant — answers draw only on data already
              shown in your portal.
            </p>
          </form>
        </div>
      )}
    </>
  );
}
