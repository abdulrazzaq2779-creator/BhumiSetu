/**
 * Portal tabs — the horizontal tab strip both layouts share.
 * Same visual grammar as the site's nav (hairline underline, terracotta
 * active state) so portal navigation feels native to Bhoomi Setu.
 */
export default function PortalTabs({
  tabs,
  activePath,
}: {
  tabs: Array<{ path: string; label: string }>;
  activePath: string;
}) {
  return (
    <nav aria-label="Portal sections" className="flex flex-wrap gap-1 border-b border-line">
      {tabs.map((t) => {
        const active = t.path === activePath;
        return (
          <a
            key={t.path}
            href={`#${t.path}`}
            aria-current={active ? 'page' : undefined}
            className={`-mb-px border-b-2 px-4 pb-2.5 pt-2 text-sm transition-colors ${
              active
                ? 'border-accent font-semibold text-ink'
                : 'border-transparent text-ink-soft hover:border-line-strong hover:text-ink'
            }`}
          >
            {t.label}
          </a>
        );
      })}
    </nav>
  );
}
