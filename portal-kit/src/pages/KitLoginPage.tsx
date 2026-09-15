/**
 * KitLoginPage — Step 1: role selector + mock auth.
 *
 * Mirrors the host LoginPage's two-column info/form layout but adds the
 * role selector FIRST: two large selectable cards. The email/password/
 * captcha form only activates once a role is picked, and submitting signs
 * the demo user in and redirects by role. No real auth — the kit's guard
 * accepts any credentials; the captcha is decorative in the kit.
 */
import { useState } from 'react';
import { usePortal } from '../PortalStore';
import { homeForRole } from '../portalRoutes';
import { DEMO_CITIZEN, DEMO_OFFICIAL } from '../mockData';
import { PRIMARY_BUTTON_CLASS } from '../tokens';
import type { PortalRole } from '../portalTypes';

/** One selectable role card. */
function RoleCard({
  selected,
  onSelect,
  icon,
  title,
  subtitle,
  blurb,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  blurb: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`group flex w-full items-start gap-4 border bg-surface p-5 text-left transition-colors ${
        selected
          ? 'border-accent bg-parchment-deep/60 ring-1 ring-accent'
          : 'border-line hover:border-line-strong'
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center transition-colors ${
          selected ? 'bg-accent text-parchment' : 'bg-ink text-parchment'
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-serif text-lg font-bold text-ink">{title}</span>
        <span className="mt-0.5 block text-xs font-medium uppercase tracking-wider text-accent">
          {subtitle}
        </span>
        <span className="mt-2 block text-sm leading-relaxed text-ink-soft">{blurb}</span>
      </span>
    </button>
  );
}

const IconOfficial = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 21h18M4 18h16M6 18v-7M10 18v-7M14 18v-7M18 18v-7M3 8l9-5 9 5z" />
  </svg>
);

const IconCitizen = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9 21v-6h6v6" />
  </svg>
);

export default function KitLoginPage() {
  const { login, toast } = usePortal();
  const [role, setRole] = useState<PortalRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = role !== null && email.trim() !== '' && password.trim() !== '';

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || role === null) return;

    if (role === 'official') {
      login({
        role,
        name: DEMO_OFFICIAL.name,
        email: email.trim() || DEMO_OFFICIAL.email,
      });
      toast('Signed in as Government Official');
    } else {
      login({
        role,
        name: DEMO_CITIZEN.name,
        email: email.trim() || DEMO_CITIZEN.email,
      });
      toast('Signed in as Landowner / Citizen');
    }
    window.location.hash = `#${homeForRole(role)}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="border-b border-line pb-5">
        <p className="font-serif text-sm italic text-accent">LOGIN</p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-ink">
          Access the Bhoomi Setu Portal
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft">
          Choose how you use Bhoomi Setu — officials get the portfolio console,
          citizens get a personal tracker for their own property.
        </p>
      </header>

      {/* STEP 1 — the role selector. Radiogroup of two large cards. */}
      <div
        role="radiogroup"
        aria-label="Select your role"
        className="mt-8 grid gap-4 sm:grid-cols-2"
      >
        <RoleCard
          selected={role === 'official'}
          onSelect={() => setRole('official')}
          icon={IconOfficial}
          title="Government Official"
          subtitle="Official / Analyst"
          blurb="Monitor every project's risk, run what-if predictions, receive alerts and notify affected landowners."
        />
        <RoleCard
          selected={role === 'citizen'}
          onSelect={() => setRole('citizen')}
          icon={IconCitizen}
          title="Landowner / Citizen"
          subtitle="Landowner"
          blurb="Track your own property's acquisition stage, read notices sent to you, and upload documents for review."
        />
      </div>

      {/* STEP 2 — the form, gated on role selection. */}
      <form
        onSubmit={onSubmit}
        className="mt-8 max-w-2xl border border-line bg-surface p-6 sm:p-8"
        aria-disabled={role === null}
      >
        <h2 className="font-serif text-xl font-bold text-ink">
          {role === null
            ? 'Select a role to continue'
            : role === 'official'
              ? 'Official sign-in'
              : 'Citizen sign-in'}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          {role === null
            ? 'The sign-in form unlocks once you pick a role above.'
            : 'Demo notice: any email and password will sign you in.'}
        </p>

        <fieldset disabled={role === null} className="mt-6 disabled:opacity-60">
          <label className="block text-xs font-medium text-ink-soft">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'citizen' ? DEMO_CITIZEN.email : DEMO_OFFICIAL.email}
              className="mt-1 block w-full border border-line-strong bg-parchment px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:outline-none"
            />
          </label>

          <label className="mt-4 block text-xs font-medium text-ink-soft">
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Any password works in this demo"
              className="mt-1 block w-full border border-line-strong bg-parchment px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`mt-6 ${PRIMARY_BUTTON_CLASS} disabled:cursor-not-allowed disabled:opacity-40`}
          >
            Continue to {role === 'official' ? 'Official Portal' : role === 'citizen' ? 'Citizen Portal' : 'portal'}
          </button>
        </fieldset>
      </form>
    </div>
  );
}
