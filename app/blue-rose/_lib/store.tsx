'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import type {
  FieldComment,
  Message,
  ThemisSeed,
} from '@/data/themis/types';
import { EMPTY_FILTERS, type QueueFilters } from './filters';

/**
 * Themis runtime store — Tier 0.5 minimal reducer.
 *
 * State shape:
 *   - seed              decrypted snapshot from /blue-rose/data.enc.json
 *   - currentPersonaId  persona the demo-runner is viewing as
 *   - selectedSubmissionId  open submission in the right pane (null = queue only)
 *   - messages          mutable copy of seed.messages + any user-added replies
 *   - fieldComments     mutable copy of seed.fieldComments + new ones
 *   - threads           mutable copy of seed.threads (for unread bookkeeping)
 *
 * Mutations live in memory only for the session — reload reverts to the
 * seed. Tier 1 will add encrypted localStorage persistence with the
 * cached passphrase.
 *
 * Persona choice persists in localStorage (`themis:persona`).
 */

const PERSONA_KEY = 'themis:persona';
const FILTERS_KEY = 'themis:queue-filters:v1';

export type RightPaneTab = 'context' | 'thread' | 'diane';

interface ThemisState {
  seed: ThemisSeed;
  currentPersonaId: string;
  selectedSubmissionId: string | null;
  messages: Message[];
  fieldComments: FieldComment[];
  threads: ThemisSeed['threads'];
  rightPaneTab: RightPaneTab;
  queueFilters: QueueFilters;
}

type ThemisAction =
  | { type: 'SET_PERSONA'; id: string }
  | { type: 'SELECT_SUBMISSION'; id: string | null }
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'ADD_FIELD_COMMENT'; comment: FieldComment }
  | { type: 'MARK_THREAD_READ'; threadId: string; personaId: string }
  | { type: 'SET_RIGHT_PANE_TAB'; tab: RightPaneTab }
  | { type: 'PATCH_FILTERS'; patch: Partial<QueueFilters> }
  | { type: 'CLEAR_FILTERS' };

function reducer(state: ThemisState, action: ThemisAction): ThemisState {
  switch (action.type) {
    case 'SET_PERSONA':
      return { ...state, currentPersonaId: action.id };
    case 'SELECT_SUBMISSION':
      // Reset to context tab when switching submissions
      return { ...state, selectedSubmissionId: action.id, rightPaneTab: 'context' };
    case 'SET_RIGHT_PANE_TAB':
      return { ...state, rightPaneTab: action.tab };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
        threads: state.threads.map((t) =>
          t.id === action.message.threadId
            ? {
                ...t,
                lastMessageAt: action.message.createdAt,
                unreadByPersonaId: Object.fromEntries(
                  t.participantIds
                    .filter((pid) => pid !== action.message.authorPersonaId)
                    .map((pid) => [pid, (t.unreadByPersonaId[pid] ?? 0) + 1]),
                ),
              }
            : t,
        ),
      };
    case 'ADD_FIELD_COMMENT':
      return { ...state, fieldComments: [...state.fieldComments, action.comment] };
    case 'MARK_THREAD_READ':
      return {
        ...state,
        threads: state.threads.map((t) => {
          if (t.id !== action.threadId) return t;
          const next = { ...t.unreadByPersonaId };
          delete next[action.personaId];
          return { ...t, unreadByPersonaId: next };
        }),
      };
    case 'PATCH_FILTERS':
      return { ...state, queueFilters: { ...state.queueFilters, ...action.patch } };
    case 'CLEAR_FILTERS':
      return { ...state, queueFilters: EMPTY_FILTERS };
    default:
      return state;
  }
}

interface ThemisContextValue extends ThemisState {
  setCurrentPersonaId: (id: string) => void;
  selectSubmission: (id: string | null) => void;
  setRightPaneTab: (tab: RightPaneTab) => void;
  patchFilters: (patch: Partial<QueueFilters>) => void;
  clearFilters: () => void;
  addMessage: (
    threadId: string,
    body: string,
    mentions: string[],
    tags: string[],
  ) => void;
  addFieldComment: (
    submissionId: string,
    fieldKey: string,
    body: string,
    mentions: string[],
  ) => void;
  markThreadRead: (threadId: string) => void;
}

const ThemisContext = createContext<ThemisContextValue | null>(null);

interface ThemisProviderProps {
  seed: ThemisSeed;
  children: ReactNode;
}

export function ThemisProvider({ seed, children }: ThemisProviderProps) {
  const initialPersonaId = useMemo(() => {
    const submitter = seed.personas.find((p) => p.role === 'submitter');
    return (submitter ?? seed.personas[0]).id;
  }, [seed]);

  const [state, dispatch] = useReducer(reducer, undefined as never, () => ({
    seed,
    currentPersonaId: initialPersonaId,
    selectedSubmissionId: null,
    messages: [...seed.messages],
    fieldComments: [...(seed.fieldComments ?? [])],
    threads: seed.threads.map((t) => ({ ...t, unreadByPersonaId: { ...t.unreadByPersonaId } })),
    rightPaneTab: 'context' as RightPaneTab,
    queueFilters: EMPTY_FILTERS,
  }));

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PERSONA_KEY);
      if (stored && seed.personas.some((p) => p.id === stored)) {
        dispatch({ type: 'SET_PERSONA', id: stored });
      }
      const storedFilters = localStorage.getItem(FILTERS_KEY);
      if (storedFilters) {
        const parsed = JSON.parse(storedFilters) as Partial<QueueFilters>;
        dispatch({ type: 'PATCH_FILTERS', patch: parsed });
      }
    } catch {
      /* noop */
    }
    setHydrated(true);
  }, [seed]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(PERSONA_KEY, state.currentPersonaId);
    } catch {
      /* noop */
    }
  }, [hydrated, state.currentPersonaId]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(FILTERS_KEY, JSON.stringify(state.queueFilters));
    } catch {
      /* noop */
    }
  }, [hydrated, state.queueFilters]);

  const setCurrentPersonaId = useCallback((id: string) => {
    dispatch({ type: 'SET_PERSONA', id });
  }, []);

  const selectSubmission = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_SUBMISSION', id });
  }, []);

  const setRightPaneTab = useCallback((tab: RightPaneTab) => {
    dispatch({ type: 'SET_RIGHT_PANE_TAB', tab });
  }, []);

  const patchFilters = useCallback((patch: Partial<QueueFilters>) => {
    dispatch({ type: 'PATCH_FILTERS', patch });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  const addMessage = useCallback(
    (threadId: string, body: string, mentions: string[], tags: string[]) => {
      const now = Date.now();
      dispatch({
        type: 'ADD_MESSAGE',
        message: {
          id: `m_local_${now}`,
          threadId,
          authorPersonaId: state.currentPersonaId,
          body,
          createdAt: now,
          mentions,
          tags,
          readByPersonaIds: [state.currentPersonaId],
        },
      });
    },
    [state.currentPersonaId],
  );

  const addFieldComment = useCallback(
    (submissionId: string, fieldKey: string, body: string, mentions: string[]) => {
      const now = Date.now();
      dispatch({
        type: 'ADD_FIELD_COMMENT',
        comment: {
          id: `fc_local_${now}`,
          submissionId,
          fieldKey,
          authorPersonaId: state.currentPersonaId,
          body,
          createdAt: now,
          mentions,
        },
      });
    },
    [state.currentPersonaId],
  );

  const markThreadRead = useCallback(
    (threadId: string) => {
      dispatch({ type: 'MARK_THREAD_READ', threadId, personaId: state.currentPersonaId });
    },
    [state.currentPersonaId],
  );

  const value = useMemo<ThemisContextValue>(
    () => ({
      ...state,
      setCurrentPersonaId,
      selectSubmission,
      setRightPaneTab,
      patchFilters,
      clearFilters,
      addMessage,
      addFieldComment,
      markThreadRead,
    }),
    [
      state,
      setCurrentPersonaId,
      selectSubmission,
      setRightPaneTab,
      patchFilters,
      clearFilters,
      addMessage,
      addFieldComment,
      markThreadRead,
    ],
  );

  return <ThemisContext.Provider value={value}>{children}</ThemisContext.Provider>;
}

export function useThemis(): ThemisContextValue {
  const ctx = useContext(ThemisContext);
  if (!ctx) throw new Error('useThemis must be used within ThemisProvider');
  return ctx;
}

export function useCurrentPersona() {
  const { seed, currentPersonaId } = useThemis();
  return seed.personas.find((p) => p.id === currentPersonaId) ?? seed.personas[0];
}

/** Look up a persona by id; recomputed only when the persona list changes. */
export function usePersonaMap() {
  const { seed } = useThemis();
  return useMemo(() => new Map(seed.personas.map((p) => [p.id, p])), [seed.personas]);
}
