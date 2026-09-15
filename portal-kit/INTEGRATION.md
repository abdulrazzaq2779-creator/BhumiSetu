# INTEGRATION — adopting portal-kit into the main app

Execute this **only when you say "add it"**. Until then `src/` stays
untouched; the kit is fully previewable standalone at :5175.

The merge touches **4 existing files minimally + 1 optional**, adds **no
dependencies**, and is fully reversible with `git checkout -- src/`.

---

## Step 1 — `src/hooks/useRoute.ts` (add routes, change nothing else)

Extend the `Route` union and the `ROUTES` list:

```ts
export type Route =
  | 'home' | 'dashboard' | 'map' | 'reports' | 'about' | 'faqs' | 'backtest'
  | 'login' | 'compensation-calculator' | 'grievance'
  | 'portal'                       // ← ADD
  | { project: string };

const ROUTES: Route[] = [
  'home', 'dashboard', 'map', 'reports', 'about', 'faqs', 'backtest',
  'login', 'compensation-calculator', 'grievance',
  'portal',                        // ← ADD
];
```

Everything else in the file stays as is.

## Step 2 — `src/App.tsx` (mount the kit under #/portal)

Two edits:

```tsx
// 1) at the top, with the other imports:
import { PortalRoot, PortalProvider } from '../portal-kit/src';

// 2) inside <main>, with the other route branches:
{route === 'portal' && (
  <PortalProvider>
    <PortalRoot />
  </PortalProvider>
)}
```

The kit takes over chrome inside that route (its own portal banners +
tabs). Because the kit uses the same hash router, deep links like
`#/portal#/official/alerts`… are handled inside `PortalRoot`'s own path
parsing — see Step 2b.

### Step 2b — hash bootstrapping inside `PortalRoot`

`portal-kit/src/router.tsx` already parses `window.location.hash`. For the
merged app the login/portal entry is `#/portal`; the kit treats any hash
starting `#/portal` as its own root and reads the sub-path after it
(`/official`, `/citizen/status`, `/login` …). This logic already exists in
`parsePortalHash` (it accepts both `#/official` and `#/portal#/official`).

Resulting URLs after adoption:

| URL | Shows |
|---|---|
| `#/portal` / `#/portal#/login` | Role-selector login |
| `#/portal#/official` | Official overview |
| `#/portal#/official/alerts` | Alerts + Notify Landowner |
| `#/portal#/citizen/status` | Citizen property stepper |
| `#/` … `#/faqs` | **All existing public pages — unchanged** |

## Step 3 — `src/components/SiteHeader.tsx` (Login button → role-aware)

The nav Login button currently hardcodes `routeHref('login')`. After
adoption, point it at `#/portal` (one-line change; optionally relabel to
"My Portal" when signed in — the kit exposes `useUser()`).

## Step 4 — public pages stay public (default, no code)

Home, About, FAQs, Grievance, Compensation Calculator, Dashboard, Map,
Backtest and project detail pages keep their existing public routes. **No
guard is added to them** — the role gate covers only `#/portal`. If you
later want them gated, that's a one-line `guardRedirect` call in App.tsx.

## Step 5 (optional) — retire the old `#/login`

Once the kit login is live, `#/login` (the old placeholder page) can be
redirected to `#/portal`. Keep it if you prefer; both are public.

---

## What integration does NOT do

- Does not modify any existing page's content or logic.
- Does not add npm dependencies.
- Does not change the scoring engine, data, or tests.
- Does not gate public pages.

## Rollback

```bash
git checkout -- src/hooks/useRoute.ts src/App.tsx src/components/SiteHeader.tsx
rm -rf portal-kit        # if you also want the kit gone
```

## Verification checklist (run after merge)

```bash
npm run typecheck        # host tsconfig now sees portal-kit/src via ../portal-kit/src import
npm test                 # existing vitest suites must stay green
npm run build            # full build incl. tsc --noEmit
```

Manual pass:

1. `#/` home renders unchanged; nav works.
2. `#/dashboard`, `#/map`, `#/faqs`, `#/grievance`, `#/compensation-calculator` all unchanged.
3. `#/portal` shows role selector; Official → Overview → Alerts → Notify Landowner → toast.
4. Sign out → Citizen login → Notifications shows the message sent in (3).
5. Assistant works in both portals with correct scope chips.
6. Browser console shows no errors; refresh on any portal route restores the same view.
