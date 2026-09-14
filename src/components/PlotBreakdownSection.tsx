/**
 * Feature 5 — Map/Dashboard data layer, plot-level section.
 *
 * The dashboard table above this section is untouched; this adds the
 * parcel-level drill-down (the engine scores plots, not just projects) as a
 * collapsible panel styled to match the page's existing hairline surfaces.
 */
import { useState } from 'react';
import { samplePlots } from '../data/samplePlots';
import PlotCard from './PlotCard';

export default function PlotBreakdownSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-6 border border-line bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span>
          <span className="block font-serif text-base font-bold text-ink">
            Plot-level breakdown
          </span>
          <span className="text-xs text-ink-soft">
            The engine scores individual survey plots, not just projects —{' '}
            {samplePlots.length} scored sample parcels
          </span>
        </span>
        <span aria-hidden="true" className="ml-4 text-ink-soft">
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="border-t border-line p-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {samplePlots.map((plot) => (
              <PlotCard key={plot.id} plot={plot} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
