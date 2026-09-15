/**
 * PortalStore — the kit's shared in-memory state.
 *
 * One context, one reducer, session-only persistence (module state survives
 * client-side route changes; a reload resets it, matching the host's own
 * demo-store conventions in GrievancePage).
 *
 * Everything the two portals share lives here, so the demo's key moment —
 * an official sends "Notify Landowner" and it appears in the citizen's
 * inbox — is genuinely live, not two disconnected mock lists.
 */
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import type {
  CitizenDocument,
  CitizenLang,
  NotificationItem,
  PortalUser,
  Toast,
} from './portalTypes';
import { seedDocuments } from './mockData';

interface PortalState {
  user: PortalUser | null;
  /** Newest first — both portals read this one list. */
  notifications: NotificationItem[];
  documents: CitizenDocument[];
  toasts: Toast[];
  /** Citizen portal language (EN/हिं toggle). */
  lang: CitizenLang;
}

type PortalAction =
  | { type: 'login'; user: PortalUser }
  | { type: 'logout' }
  | { type: 'push-notification'; notification: NotificationItem }
  | { type: 'add-document'; document: CitizenDocument }
  /** Demo review workflow: Received → Under Review → Approved. */
  | { type: 'advance-document'; id: string }
  | { type: 'set-lang'; lang: CitizenLang }
  | { type: 'toast'; text: string }
  | { type: 'dismiss-toast'; id: number };

const initialState: PortalState = {
  user: null,
  notifications: [],
  documents: seedDocuments,
  toasts: [],
  lang: 'en',
};

let nextId = 1;

function reducer(state: PortalState, action: PortalAction): PortalState {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.user };
    case 'logout':
      return { ...state, user: null };
    case 'push-notification':
      return {
        ...state,
        notifications: [action.notification, ...state.notifications],
      };
    case 'add-document':
      return { ...state, documents: [action.document, ...state.documents] };
    case 'advance-document':
      return {
        ...state,
        documents: state.documents.map((d) =>
          d.id === action.id
            ? {
                ...d,
                status:
                  d.status === 'Received'
                    ? 'Under Review'
                    : 'Approved',
              }
            : d,
        ),
      };
    case 'set-lang':
      return { ...state, lang: action.lang };
    case 'toast':
      return {
        ...state,
        toasts: [...state.toasts, { id: nextId++, text: action.text }],
      };
    case 'dismiss-toast':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
  }
}

interface PortalStore {
  state: PortalState;
  login: (user: PortalUser) => void;
  logout: () => void;
  pushNotification: (n: Omit<NotificationItem, 'id' | 'role'>) => void;
  addDocument: (d: Omit<CitizenDocument, 'id'>) => void;
  /** Demo: move a document one step along the review workflow. */
  advanceDocument: (id: string) => void;
  setLang: (lang: CitizenLang) => void;
  toast: (text: string) => void;
  dismissToast: (id: number) => void;
}

const PortalContext = createContext<PortalStore | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const store = useMemo<PortalStore>(
    () => ({
      state,
      login: (user) => dispatch({ type: 'login', user }),
      logout: () => dispatch({ type: 'logout' }),
      pushNotification: (n) =>
        dispatch({
          type: 'push-notification',
          notification: { ...n, id: `NT-${nextId++}`, role: 'official' },
        }),
      addDocument: (d) =>
        dispatch({
          type: 'add-document',
          document: { ...d, id: `DOC-${300 + nextId++}` },
        }),
      advanceDocument: (id) => dispatch({ type: 'advance-document', id }),
      setLang: (lang) => dispatch({ type: 'set-lang', lang }),
      toast: (text) => dispatch({ type: 'toast', text }),
      dismissToast: (id) => dispatch({ type: 'dismiss-toast', id }),
    }),
    [state],
  );

  return (
    <PortalContext.Provider value={store}>{children}</PortalContext.Provider>
  );
}

/** The single source of portal truth. Throws if used outside the provider. */
export function usePortal(): PortalStore {
  const ctx = useContext(PortalContext);
  if (!ctx) {
    throw new Error('usePortal must be used inside <PortalProvider>');
  }
  return ctx;
}

/** Convenience selector: the session user (or null when signed out). */
export function useUser(): PortalUser | null {
  return usePortal().state.user;
}

/**
 * Safe variant for chrome rendered BOTH inside and outside the provider
 * (e.g. the host's own site header): returns null instead of throwing when
 * no provider is mounted, so public pages can share the same component.
 */
export function useOptionalUser(): PortalUser | null {
  return useContext(PortalContext)?.state.user ?? null;
}

/**
 * Toast auto-dismiss: returns nothing, handles its own timer per toast.
 * (Lives here so toasts remain part of the single shared store.)
 */
export function useToastAutoDismiss(ms = 4200) {
  const { state, dismissToast } = usePortal();
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  useMemo(() => {
    for (const t of state.toasts) {
      if (!timers.current.has(t.id)) {
        timers.current.set(
          t.id,
          setTimeout(() => {
            dismissToast(t.id);
            timers.current.delete(t.id);
          }, ms),
        );
      }
    }
  }, [state.toasts, dismissToast, ms, timers]);
}
