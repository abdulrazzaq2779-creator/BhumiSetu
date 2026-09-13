/**
 * Utility top bar: helpline on the left, utility links on the right.
 * Small and muted — chrome, not content.
 */
export default function TopBar() {
  return (
    <div className="border-b border-line bg-parchment-deep">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-1.5 text-xs text-ink-soft sm:px-6">
        <p>
          Helpline (toll-free):{' '}
          <span className="font-semibold text-ink">1800-111-957</span>
          <span className="mx-2 text-line-strong">|</span>
          help@bhumisetu.gov.in
        </p>
        <nav aria-label="Utility" className="flex items-center gap-2">
          <a href="#/faqs" className="hover:text-ink hover:underline">
            FAQs
          </a>
          <span className="text-line-strong">·</span>
          <a href="#/faqs" className="hover:text-ink hover:underline">
            Contact Us
          </a>
          <span className="text-line-strong">·</span>
          <a href="#/faqs" className="hover:text-ink hover:underline">
            Grievance
          </a>
        </nav>
      </div>
    </div>
  );
}
