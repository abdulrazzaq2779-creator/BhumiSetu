import { monitoredProjects } from '../data/projects';
import { routeHref } from '../hooks/useRoute';
import heroImage from '../assets/hero-farmland.jpg';

/**
 * Full-width hero: documentary-style aerial farmland photo under a dark
 * gradient overlay, carrying one live stat. Calm and authoritative — the
 * only motion moment on the portal (one-time rise on load).
 */
export default function Hero() {
  const monitored = monitoredProjects.length;

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <img
        src={heroImage}
        alt="Aerial view of farmland adjoining a road construction corridor"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      {/* Dark gradient overlay for legibility, heavier toward the text side. */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/60 to-ink/25"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <div className="hero-rise max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-parchment/80">
            Land Acquisition Risk Monitoring · National Overview
          </p>
          <p className="mt-3 font-serif text-5xl font-bold leading-none text-parchment sm:text-6xl">
            {monitored} Projects Monitored
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-parchment/85 sm:text-lg">
            Bhoomi Setu continuously scores every monitored acquisition at the
            individual land-parcel level, flagging delay risk months before it
            surfaces as a stalled project, protest or court case.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={routeHref('dashboard')}
              className="border border-parchment bg-parchment px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-parchment-deep"
            >
              Open Risk Dashboard
            </a>
            <a
              href={routeHref('about')}
              className="border border-parchment/60 px-5 py-2.5 text-sm font-semibold text-parchment transition-colors hover:border-parchment hover:bg-parchment/10"
            >
              How it works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
