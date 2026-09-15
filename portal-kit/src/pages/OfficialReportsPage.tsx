/**
 * OfficialReportsPage — "your EXISTING export/reports feature".
 *
 * Builds a per-cycle summary from the host's live scored data and hands it
 * over as a real client-side CSV download (no backend). Rows mirror the
 * Tracked Projects table so the two never disagree.
 */
import { monitoredProjects } from '../../../src/data/projects';
import { createRuleEngine } from '../../../src/engine';
import { PageHeading, PANEL_CLASS, PRIMARY_BUTTON_CLASS } from '../tokens';

const engine = createRuleEngine();

interface ReportRow {
  id: string;
  name: string;
  district: string;
  state: string;
  stage: string;
  progressPct: number;
  score: number;
  level: string;
  topDriver: string;
}

function buildRows(): ReportRow[] {
  return monitoredProjects
    .map((p) => {
      const r = engine.predict(p.riskInput);
      return {
        id: p.id,
        name: p.name,
        district: p.district,
        state: p.state,
        stage: p.stage,
        progressPct: p.progressPct,
        score: r.score,
        level: r.level,
        topDriver: (r.explanations[0] ?? '').replaceAll(',', ';'),
      };
    })
    .sort((a, b) => b.score - a.score);
}

function downloadCsv(rows: ReportRow[]) {
  const header = 'Project ID,Project,District,State,Stage,Acquired %,Risk Score,Risk Level,Top Driver';
  const lines = rows.map((r) =>
    [r.id, `"${r.name}"`, r.district, r.state, `"${r.stage}"`, r.progressPct, r.score, r.level, `"${r.topDriver}"`].join(','),
  );
  const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bhumisetu-risk-report-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * District Risk Briefing — opens a print-ready letterhead document
 * (Government of India masthead, cycle summary, full risk table, signature
 * block) in a new window and invokes the browser's print dialog, so the
 * official can save it as PDF from there. Self-contained HTML: no print
 * stylesheet changes needed in the host app.
 */
function printBriefing(rows: ReportRow[], opts: { high: number; stalling: number }) {
  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const levelColor = { High: '#b3261e', Medium: '#b7791f', Low: '#2f6b3a' } as Record<
    string,
    string
  >;

  const rowsHtml = rows
    .map(
      (r) => `
      <tr>
        <td>${esc(r.id)}</td>
        <td>${esc(r.name)}<span class="sub">${esc(r.district)}, ${esc(r.state)}</span></td>
        <td>${esc(r.stage)}</td>
        <td class="num">${r.progressPct}%</td>
        <td class="num"><strong>${r.score}</strong></td>
        <td><span class="lvl" style="color:${levelColor[r.level] ?? '#333'};border-color:${levelColor[r.level] ?? '#333'}">${r.level}</span></td>
      </tr>`,
    )
    .join('');

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>District Risk Briefing — ${today}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; margin: 40px auto; max-width: 780px; padding: 0 24px; }
  .masthead { text-align: center; border-bottom: 3px double #1a1a1a; padding-bottom: 14px; }
  .masthead .emblem { font-size: 26px; letter-spacing: 2px; }
  .masthead h1 { font-size: 20px; margin: 6px 0 2px; }
  .masthead p { margin: 0; font-size: 12px; color: #444; }
  .meta { display: flex; justify-content: space-between; font-size: 12px; margin: 14px 0 22px; color: #333; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 10px; }
  .stats { display: flex; gap: 12px; margin-bottom: 24px; }
  .stat { flex: 1; border: 1px solid #999; padding: 10px 12px; }
  .stat b { display: block; font-size: 22px; }
  .stat span { font-size: 10.5px; text-transform: uppercase; letter-spacing: 1px; color: #444; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #1a1a1a; padding: 6px 8px; }
  td { border-bottom: 1px solid #ccc; padding: 7px 8px; vertical-align: top; }
  td.sub { display: block; font-size: 10.5px; color: #555; }
  td.num { text-align: right; font-variant-numeric: tabular-nums; }
  .lvl { border-left: 3px solid; padding-left: 6px; font-weight: 700; }
  .note { margin-top: 22px; font-size: 11px; color: #444; border-top: 1px solid #999; padding-top: 10px; }
  .sign { margin-top: 48px; text-align: right; font-size: 12px; }
  .sign .line { margin-top: 42px; border-top: 1px solid #1a1a1a; display: inline-block; padding-top: 4px; min-width: 220px; }
  @media print { body { margin: 10mm auto; } }
</style>
</head>
<body>
  <div class="masthead">
    <div class="emblem">॥ भारत सरकार ॥</div>
    <h1>Government of India · Ministry of Rural Development</h1>
    <p>Bhoomi Setu — Land Acquisition Risk Monitoring</p>
  </div>
  <div class="meta">
    <span><strong>District Risk Briefing</strong> — Sangareddy Collectorate</span>
    <span>Data cycle: ${today}</span>
  </div>
  <h2>Cycle summary</h2>
  <div class="stats">
    <div class="stat"><b>${rows.length}</b><span>Projects monitored</span></div>
    <div class="stat"><b>${opts.high}</b><span>High risk</span></div>
    <div class="stat"><b>${opts.stalling}</b><span>Below 50% acquired</span></div>
  </div>
  <h2>Project risk register</h2>
  <table>
    <thead><tr><th>Project ID</th><th>Project</th><th>Stage</th><th style="text-align:right">Acquired</th><th style="text-align:right">Score</th><th>Level</th></tr></thead>
    <tbody>${rowsHtml}</tbody>
  </table>
  <p class="note">Scores derive from the Bhoomi Setu parcel scoring engine (compensation gap, ownership-record mismatches, litigation, approval delay, R&amp;R backlog). Figures are indicative, pending primary-source verification. Generated client-side for demonstration.</p>
  <div class="sign"><span class="line">K. Srinivas — District Collector</span></div>
  <script>window.onload = function () { setTimeout(function () { window.print(); }, 300); };</script>
</body>
</html>`;

  const w = window.open('', '_blank', 'width=860,height=1000');
  if (!w) {
    alert('Please allow pop-ups to print the briefing.');
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

export default function OfficialReportsPage() {
  const rows = buildRows();
  const high = rows.filter((r) => r.level === 'High').length;
  const stalling = rows.filter((r) => r.progressPct < 50).length;

  return (
    <div>
      <PageHeading eyebrow="OFFICIAL PORTAL" title="Reports & Exports">
        Generate the current risk-cycle summary. The CSV opens cleanly in
        Excel — one row per monitored project, scored by the live engine.
      </PageHeading>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className={PANEL_CLASS}>
          <h2 className="font-serif text-xl font-bold text-ink">Cycle summary</h2>
          <dl className="mt-4 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
            {[
              ['Projects covered', String(rows.length)],
              ['High risk', String(high)],
              ['Below 50% acquired', String(stalling)],
            ].map(([label, value]) => (
              <div key={label} className="bg-surface p-4">
                <dd className="font-serif text-2xl font-bold tabular-nums text-ink">{value}</dd>
                <dt className="mt-0.5 text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => downloadCsv(rows)}
              className={PRIMARY_BUTTON_CLASS}
            >
              Download CSV report
            </button>
            <button
              type="button"
              onClick={() => printBriefing(rows, { high, stalling })}
              className={PRIMARY_BUTTON_CLASS}
            >
              Print District Briefing (PDF)
            </button>
          </div>
          <p className="mt-3 text-xs text-ink-faint">
            Demo notice: the file is generated in your browser from live app
            data — nothing is uploaded or stored.
          </p>
        </section>

        {/* Report preview — first rows of what the CSV will contain. */}
        <section className={`${PANEL_CLASS} self-start`}>
          <h2 className="font-serif text-xl font-bold text-ink">Preview</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {rows.slice(0, 6).map((r) => (
              <li key={r.id} className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-ink">{r.name}</span>
                <span className="shrink-0 tabular-nums text-ink-soft">{r.score}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-faint">Top 6 of {rows.length} rows by risk score.</p>
        </section>
      </div>
    </div>
  );
}
