interface StubPageProps {
  title: string;
  /** One or two sentences on what will live here. */
  note: string;
}

/**
 * Temporary page shell for secondary routes (About / Reports / FAQs).
 * Each gets its own build pass; the shell keeps navigation honest meanwhile.
 */
export default function StubPage({ title, note }: StubPageProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="border border-line bg-surface p-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">{note}</p>
        <p className="mt-6 inline-block border border-line bg-parchment-deep px-3 py-1.5 text-xs text-ink-soft">
          This section is under preparation.
        </p>
      </div>
    </div>
  );
}
