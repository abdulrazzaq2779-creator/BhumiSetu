import { routeHref } from '../hooks/useRoute';

/**
 * About content block. Left: eyebrow + heading + copy. Right: Learn More.
 * Rendered inside the landing page's two-column layout — no page chrome of
 * its own. The eyebrow is set in small serif, not an ALL-CAPS marketing label.
 */
export default function AboutSection() {
  return (
    <section aria-labelledby="about-heading">
      <div className="grid gap-8 md:grid-cols-[1fr_200px] md:gap-12">
        <div className="max-w-3xl">
          <p className="font-serif text-sm italic text-accent">
            About the platform
          </p>
          <h2
            id="about-heading"
            className="mt-2 font-serif text-3xl font-bold tracking-tight text-ink"
          >
            About Bhoomi Setu
          </h2>

          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-soft">
            <p>
              Land acquisition is the most delay-prone stage of public
              infrastructure. Roads, industrial areas and irrigation projects
              routinely stall — not because delays are unpredictable, but
              because the warning signs are scattered across revenue records,
              registration data, court filings and departmental files that no
              one sees together.
            </p>
            <p>
              Bhoomi Setu brings those signals into a single early-warning
              system. Every parcel under acquisition is scored against five
              measurable factors — compensation gap, ownership-record
              mismatches, active litigation, approval hand-off delays and
              rehabilitation backlog — and each project carries a live,
              colour-coded risk rating with the reasons behind it.
            </p>
            <p>
              The portal is built for the officials who can act: District
              Collectors, State Revenue Departments and implementing agencies.
              Where a score is High, the platform states why and recommends the
              intervention — a compensation review, early mediation or an
              escalated clearance — before a delay hardens into a dispute.
            </p>
          </div>
        </div>

        <div className="md:border-l md:border-line md:pl-10 md:pt-12">
          <a
            href={routeHref('about')}
            className="inline-block border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-parchment transition-colors hover:bg-accent-deep"
          >
            Learn More
          </a>
          <p className="mt-3 text-xs leading-relaxed text-ink-faint">
            Methodology, data sources and the factor weights behind every
            score.
          </p>
        </div>
      </div>
    </section>
  );
}
