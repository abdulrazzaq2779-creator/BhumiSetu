import { monitoredProjects } from '../data/projects';
import { routeHref } from '../hooks/useRoute';
import HeroCarousel, { type HeroSlide } from './HeroCarousel';
import heroFarmland from '../assets/hero-farmland.jpg';
import heroHighway from '../assets/hero-highway.jpg';
import heroVillage from '../assets/hero-village.jpg';

/*
 * Documentary-tone slides (see src/assets/CREDITS.md for sources/licenses).
 * Swap this array for real project photography when available — the
 * carousel is driven entirely by these {src, alt} pairs.
 */
const HERO_SLIDES: HeroSlide[] = [
  {
    src: heroFarmland,
    alt: 'Aerial view of farmland adjoining a road construction corridor',
  },
  {
    src: heroHighway,
    alt: 'Expressway under construction on the outskirts of Bengaluru',
  },
  {
    src: heroVillage,
    alt: 'Aerial view of Duggirala village and its surrounding fields, Andhra Pradesh',
  },
];

/**
 * Full-width hero: rotating documentary imagery under a dark gradient
 * overlay, carrying one live stat. The carousel is the portal's single
 * deliberate motion moment; the copy itself still only rises once on load.
 */
export default function Hero() {
  const monitored = monitoredProjects.length;

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      {/* In-flow root: the copy below gives the section its height; only
          the carousel's image layer is absolutely positioned. */}
      <HeroCarousel slides={HERO_SLIDES} interval={3500} fadeMs={700}>
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
      </HeroCarousel>
    </section>
  );
}
