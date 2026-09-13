import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import ImportantLinks from '../components/ImportantLinks';
import NewsTicker, { type TickerEntry } from '../components/NewsTicker';
import { tickerItems } from '../data/projects';
import { routeHref } from '../hooks/useRoute';

/**
 * Portal entry point. Below the hero, a two-column layout mirrors the
 * classic government notice-board pattern: a "What's New" left rail beside
 * the About and Important Links content.
 */
export default function LandingPage() {
  const tickerEntries: TickerEntry[] = tickerItems.map((item) => ({
    id: item.id,
    title: item.title,
    riskLevel: item.riskLevel,
    timestamp: item.timestamp,
    href: routeHref(item.linkRoute ?? 'dashboard'),
  }));

  return (
    <>
      <Hero />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 py-12 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10">
          <NewsTicker
            items={tickerEntries}
            className="h-[420px] self-start lg:sticky lg:top-6"
          />

          <div className="min-w-0">
            <AboutSection />
          </div>
        </div>

        {/* Full-width spacious link tiles — three ~340px columns need the
            whole content width, so this sits below the ticker/About row. */}
        <div className="pb-16">
          <ImportantLinks />
        </div>
      </div>
    </>
  );
}
