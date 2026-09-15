/**
 * Design tokens, restated as class strings.
 *
 * The kit never invents colours or shadows: every value below mirrors
 * src/index.css @theme tokens (parchment ground, terracotta accent, ink
 * text, hairline borders, forest secondary). If the host re-themes, these
 * strings keep working because they reference token names, not hexes.
 */

export const INPUT_CLASS =
  'mt-1 block w-full border border-line-strong bg-parchment px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:outline-none';

export const LABEL_CLASS = 'block text-xs font-medium text-ink-soft';

export const PRIMARY_BUTTON_CLASS =
  'border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-parchment transition-colors hover:bg-accent-deep';

export const SECONDARY_BUTTON_CLASS =
  'border border-line-strong bg-surface px-5 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-accent hover:text-ink';

/** Serif page heading with the italic eyebrow label, as used on every page. */
export function PageHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-line pb-5">
      <p className="font-serif text-sm italic text-accent">{eyebrow}</p>
      <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-ink">
        {title}
      </h1>
      {children && (
        <p className="mt-1 max-w-3xl text-sm text-ink-soft">{children}</p>
      )}
    </header>
  );
}

/** Hairline surface panel — the portal's single card style. */
export const PANEL_CLASS = 'border border-line bg-surface p-6';
