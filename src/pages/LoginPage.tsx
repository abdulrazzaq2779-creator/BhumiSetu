/**
 * Login page (#/login) — UI-only demo form. There is NO real authentication:
 * submitting shows a placeholder notice instead of authenticating or
 * routing anywhere.
 *
 * Layout: two columns, mirroring the landing page's notice-board grid —
 * left, three contact info cards (the same helpline and support email the
 * TopBar and SiteFooter already show); right, the login form. Tokens match
 * the rest of the portal: parchment surfaces, hairline borders, terracotta
 * accent, serif headings.
 */
import { useState, type ReactNode } from 'react';

const HELPLINE = '1800-111-957';
const SUPPORT_EMAIL = 'help@bhumisetu.gov.in';

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 border border-line bg-surface p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-ink text-parchment">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium text-ink-soft">{label}</span>
        <span className="mt-0.5 block text-sm font-medium text-ink">
          {value}
        </span>
      </span>
    </div>
  );
}

export default function LoginPage() {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="border-b border-line pb-5">
        <p className="font-serif text-sm italic text-accent">LOGIN</p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-ink">
          Access the Bhoomi Setu Portal
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft">
          For District Collectors, State Revenue Departments and implementing
          agencies.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
        {/* Left rail — who to contact for access. */}
        <div className="space-y-4">
          <InfoCard
            label="Need Access?"
            value="Contact your District Administration Office"
            icon={
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
                <path d="M3 21h18M4 18h16M6 18v-7M10 18v-7M14 18v-7M18 18v-7M3 8l9-5 9 5z" />
              </svg>
            }
          />
          <InfoCard
            label="Helpline"
            value={HELPLINE}
            icon={
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
                <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
              </svg>
            }
          />
          <InfoCard
            label="Support Email"
            value={SUPPORT_EMAIL}
            icon={
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
                <rect x="3" y="5" width="18" height="14" rx="1" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            }
          />
        </div>

        {/* Right — the demo login form. */}
        <form
          className="border border-line bg-surface p-6 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            setNotice(
              'Login is disabled in this demo — contact your administrator for access.',
            );
          }}
        >
          <label className="block text-xs font-medium text-ink-soft">
            Email
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full border border-line-strong bg-parchment px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:outline-none"
            />
          </label>

          <label className="mt-4 block text-xs font-medium text-ink-soft">
            Password
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full border border-line-strong bg-parchment px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:outline-none"
            />
          </label>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input
                id="login-remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 border border-line-strong accent-accent"
              />
              Remember me
            </label>
            <button
              type="button"
              className="text-sm text-accent hover:underline"
              onClick={() =>
                setNotice(
                  'Password reset is not available in this demo — contact your administrator.',
                )
              }
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="mt-6 w-full border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-parchment transition-colors hover:bg-accent-deep sm:w-auto"
          >
            Login
          </button>

          {notice && (
            <p
              role="status"
              className="mt-5 border-l-4 border-accent bg-surface px-4 py-3 text-sm text-ink-soft"
            >
              {notice}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
