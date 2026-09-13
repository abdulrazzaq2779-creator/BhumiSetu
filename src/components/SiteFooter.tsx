import BhoomiSetuLogo from './BhoomiSetuLogo';

const QUICK_LINKS = [
  { label: 'Risk Dashboard', href: '#/dashboard' },
  { label: 'Risk Map', href: '#/map' },
  { label: 'District Reports', href: '#/reports' },
  { label: 'About the Platform', href: '#/about' },
  { label: 'FAQs', href: '#/faqs' },
  { label: 'Grievance Redressal', href: '#/faqs' },
  { label: 'Login', href: '#/dashboard' },
];

const ACTS_AND_RULES = [
  'The Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013',
  'RFCTLARR Rules — compensation and R&R guidelines',
  'Department of Land Resources — scheme circulars',
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-parchment-deep">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <BhoomiSetuLogo className="h-9 w-9" />
            <div className="leading-tight">
              <p className="font-serif text-lg font-bold text-ink">Bhoomi Setu</p>
              <p className="text-xs text-ink-soft">
                Ministry of Rural Development
                <br />
                Government of India
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-ink-soft">
            A risk-monitoring portal for land acquisition projects, built for
            District Collectors, State Revenue Departments and project
            implementing agencies.
          </p>
        </div>

        <div>
          <h3 className="font-serif text-sm font-bold text-ink">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-ink-soft hover:text-accent hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-sm font-bold text-ink">Contact</h3>
          <address className="mt-3 space-y-2 text-sm not-italic text-ink-soft">
            <p>
              Department of Land Resources
              <br />
              Ministry of Rural Development
              <br />
              Krishi Bhawan, Dr. Rajendra Prasad Road
              <br />
              New Delhi — 110 001
            </p>
            <p>
              Helpline: 1800-111-957
              <br />
              help@bhumisetu.gov.in
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 text-[11px] text-ink-faint sm:px-6">
          <p>© 2026 Ministry of Rural Development, Government of India.</p>
          <p>
            Referenced legislation: {ACTS_AND_RULES[0].slice(0, 60)}… · Imagery:
            Wikimedia Commons / Unsplash
          </p>
        </div>
      </div>
    </footer>
  );
}
