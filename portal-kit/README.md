# portal-kit — Role-Based Portals for Bhoomi Setu

A **self-contained, drop-in kit** that adds a role-based login flow, an
Official Portal, a Citizen Portal and a shared assistant widget to the
existing Bhoomi Setu app — **without touching any existing file**.

> **Status: staging.** Everything lives in `portal-kit/`. Nothing in `src/`
> changes until you explicitly merge (see `INTEGRATION.md`).

---

## What's inside

```
portal-kit/
├── README.md                  ← you are here
├── INTEGRATION.md             ← exact merge plan for when you say "add it"
├── tsconfig.json              ← kit-only typecheck config (host tsconfig untouched)
├── src/
│   ├── index.ts               ← public API barrel (the only import hosts need)
│   ├── portalTypes.ts         ← shared types: roles, user, alerts, notifications…
│   ├── portalRoutes.ts        ← route tables + pure parse/guard helpers
│   ├── router.tsx             ← PortalRoot: guards, resolution, layout switch
│   ├── PortalStore.tsx        ← ONE shared store (user + notifications + docs + toasts)
│   ├── mockData.ts            ← seeded demo identities, alerts, documents
│   ├── assistantEngine.ts     ← role-scoped pattern-matching answers (no LLM)
│   ├── tokens.tsx             ← class-string re-export of host design tokens
│   ├── layouts/
│   │   ├── OfficialLayout.tsx     ← forest-green console shell + tabs
│   │   └── CitizenLayout.tsx      ← simpler terracotta shell + tabs
│   ├── pages/
│   │   ├── KitLoginPage.tsx           ← role selector → mock auth → redirect
│   │   ├── OfficialOverviewPage.tsx   ← live stats + watchlist + latest alerts
│   │   ├── OfficialPredictPage.tsx    ← what-if sliders on the REAL engine
│   │   ├── OfficialTrackedPage.tsx    ← dense sortable scored table
│   │   ├── OfficialAlertsPage.tsx     ← alert feed + "Notify Landowner" modal
│   │   ├── OfficialReportsPage.tsx    ← cycle summary + real CSV download
│   │   ├── CitizenStatusPage.tsx      ← stepper + one plain-language sentence
│   │   ├── CitizenNotificationsPage.tsx ← inbox fed by the SAME store
│   │   └── CitizenDocumentsPage.tsx   ← mock upload + status list
│   └── components/
│       ├── PortalTabs.tsx         ← shared tab strip
│       ├── ToastStack.tsx         ← bottom-right toasts (shared store)
│       └── AssistantDock.tsx      ← floating "Ask a Question" drawer
└── preview/                   ← standalone demo served at :5175
    ├── index.html
    ├── main.tsx               ← mounts PortalRoot inside the EXISTING chrome
    ├── style.css              ← re-exports host CSS + extends Tailwind scanning
    └── vite.config.ts         ← root=preview, port 5175
```

## Try it without merging anything

```bash
npx vite --config portal-kit/preview/vite.config.ts
# open http://localhost:5175  (host app on :5173 keeps working untouched)
```

Demo flow:

1. **Login** — pick *Government Official* or *Landowner / Citizen* (the form
   unlocks after picking; any email/password signs in).
2. **Official Portal** — Overview → Predict Risk (move sliders, score is live)
   → Tracked Projects → **Alerts → "Notify Landowner" → Send**.
3. Sign out, **login as Citizen** → Notifications — the message you just sent
   is sitting there. That's one shared store, not two mock lists.
4. Ask the assistant: as official try *"risk above 60"* or *"LAP-2023-014"*;
   as citizen try *"What is my property status?"*.

## Design decisions

- **Zero modification.** The kit imports host modules read-only
  (`data/projects`, `engine`, components). No host file is edited to preview.
- **One store, two portals.** `PortalStore` is the single source of truth —
  the official's "Notify Landowner" and the citizen's inbox are the same data.
- **Host tokens only.** Colours, type, spacing and borders come from
  `src/index.css` `@theme`. The kit adds exactly one colour moment per portal
  (forest banner for official, terracotta for citizen) using existing tokens.
- **Reuse over rebuild.** Prediction uses the host's `createRuleEngine`;
  tracked rows use `monitoredProjects`; "Open project" links to the host's
  existing `#/projects/:id` detail pages.
- **Role-scoped assistant.** Officials get portfolio answers; the citizen
  branch reads only the demo citizen's own record — structurally incapable of
  leaking other projects' data. Every answer carries a scope chip.
- **Hash routing.** Same `#/...` convention as the host, so no server config
  is needed and routes survive static hosting.

## Typecheck the kit alone

```bash
npx tsc --noEmit -p portal-kit/tsconfig.json
```

## When you're ready to adopt

Say the word and follow `INTEGRATION.md` — it's a ~40-line, five-file-touch
merge (App.tsx, useRoute.ts, SiteHeader.tsx + two-line index.css note), fully
reversible, with all existing pages staying public and unchanged.
