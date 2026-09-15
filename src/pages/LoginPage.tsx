/**
 * Login page (#/login) — UI-only demo form. There is NO real authentication:
 * submitting shows a placeholder notice instead of authenticating or
 * routing anywhere.
 *
 * Layout: two columns, mirroring the landing page's notice-board grid —
 * left, three contact info cards (the same helpline and support email the
 * TopBar and SiteFooter already show); right, the login form with a
 * canvas-drawn captcha gate. Tokens match the rest of the portal:
 * parchment surfaces, hairline borders, terracotta accent, serif headings.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

const HELPLINE = '1800-111-957';
const SUPPORT_EMAIL = 'help@bhumisetu.gov.in';

const CAPTCHA_LENGTH = 6;
/* Unambiguous alphabet — no 0/O/1/I/l so typed input can't fail on lookalikes. */
const CAPTCHA_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

function randomCaptchaText(): string {
  let out = '';
  for (let i = 0; i < CAPTCHA_LENGTH; i++) {
    out += CAPTCHA_ALPHABET[Math.floor(Math.random() * CAPTCHA_ALPHABET.length)];
  }
  return out;
}

/**
 * Distorted-text captcha drawn on a canvas: per-glyph rotation and drift,
 * strike-through noise lines and speckle dots. Parchment/ink palette to
 * sit within the portal's tokens. Purely client-side demo — it gates the
 * placeholder submit, nothing else.
 */
function CaptchaCanvas({ text }: { text: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Parchment ground with a faint mottle.
    ctx.fillStyle = '#f4efe4';
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(60, 54, 46, ${0.02 + Math.random() * 0.04})`;
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, 1 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Noise: two crossing strokes + speckle dots.
    ctx.strokeStyle = 'rgba(60, 54, 46, 0.25)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * W, Math.random() * H);
      ctx.bezierCurveTo(
        Math.random() * W, Math.random() * H,
        Math.random() * W, Math.random() * H,
        Math.random() * W, Math.random() * H,
      );
      ctx.stroke();
    }
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = `rgba(60, 54, 46, ${0.1 + Math.random() * 0.2})`;
      ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5);
    }

    // Glyphs: staggered, each slightly rotated and baseline-shifted.
    const slot = W / (CAPTCHA_LENGTH + 1);
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      ctx.save();
      ctx.translate(slot * (i + 1) + (Math.random() * 6 - 3), H / 2 + (Math.random() * 8 - 4));
      ctx.rotate((Math.random() - 0.5) * 0.5); // ±~14°
      ctx.font = '600 26px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#3c362e';
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    }
  }, [text]);

  return (
    <canvas
      ref={canvasRef}
      width={168}
      height={48}
      aria-label={`Captcha image containing ${CAPTCHA_LENGTH} characters`}
      className="border border-line-strong bg-parchment"
    />
  );
}

/** Square refresh button with a circular-arrow icon. */
function RefreshButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Regenerate captcha"
      title="New captcha"
      className="flex h-[50px] w-[50px] shrink-0 items-center justify-center border border-line-strong bg-surface text-ink-soft transition-colors hover:border-accent hover:text-accent"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 11a8 8 0 1 0-2.3 6.3" />
        <path d="M20 5v6h-6" />
      </svg>
    </button>
  );
}

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
  const [captchaText, setCaptchaText] = useState(randomCaptchaText);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const regenerateCaptcha = useCallback(() => {
    setCaptchaText(randomCaptchaText());
    setCaptchaInput('');
    setCaptchaError(null);
  }, []);

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
            // Captcha gate: exact match (case-insensitive) required before
            // the demo notice shows. Still no real authentication.
            if (captchaInput.trim().toLowerCase() !== captchaText.toLowerCase()) {
              setCaptchaError('Captcha does not match');
              setCaptchaText(randomCaptchaText());
              setCaptchaInput('');
              return;
            }
            setCaptchaError(null);
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

          {/* Captcha gate — sits between the remember/forgot row and the
              submit button. Error shows inline on mismatch. */}
          <div className="mt-6">
            <span className="block text-xs font-medium text-ink-soft">
              Captcha — type the characters shown
            </span>
            <div className="mt-1 flex items-center gap-2">
              <CaptchaCanvas text={captchaText} />
              <RefreshButton onClick={regenerateCaptcha} />
              <input
                id="login-captcha"
                name="captcha"
                type="text"
                required
                autoComplete="off"
                spellCheck={false}
                value={captchaInput}
                onChange={(e) => {
                  setCaptchaInput(e.target.value);
                  setCaptchaError(null);
                }}
                aria-invalid={captchaError !== null}
                aria-describedby={captchaError ? 'login-captcha-error' : undefined}
                placeholder={`${CAPTCHA_LENGTH} characters`}
                maxLength={CAPTCHA_LENGTH + 2}
                className="min-w-0 flex-1 border border-line-strong bg-parchment px-2.5 py-2 text-sm tracking-widest text-ink focus:border-accent focus:outline-none"
              />
            </div>
            {captchaError && (
              <p
                id="login-captcha-error"
                role="alert"
                className="mt-2 border-l-4 border-risk-medium bg-parchment px-3 py-2 text-sm text-ink"
              >
                {captchaError}
              </p>
            )}
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
