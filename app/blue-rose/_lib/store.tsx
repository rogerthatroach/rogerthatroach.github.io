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
  AuditEvent,
  FieldComment,
  Message,
  Notification,
  Submission,
  ThemisSeed,
} from '@/data/themis/types';
import { EMPTY_FILTERS, type QueueFilters } from './filters';
import { synthesizeSubmissionFromDraft, type SynthesisOutcome } from './par-synthesize';

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
const SPLIT_KEY = 'themis:submission-split:v1';
const PAR_DRAFT_KEY = 'themis:par-draft:v1';

export type SubmissionTab = 'document' | 'thread' | 'context' | 'diane';
/** @deprecated alias kept for any callsite still using the old name */
export type RightPaneTab = SubmissionTab;

/**
 * Per-field provenance tracker for the PAR draft. Marks whether a field
 * value was authored by Diane (during a drafting chain) or by the user
 * (manual edit). Drives the dashed-border + amber-tint visual cue
 * required by §12 (AI-replied differentiation: Diane content never
 * indistinguishable from human content).
 */
export type FieldProvenance = 'diane' | 'user';

interface ThemisState {
  seed: ThemisSeed;
  currentPersonaId: string;
  selectedSubmissionId: string | null;
  messages: Message[];
  fieldComments: FieldComment[];
  threads: ThemisSeed['threads'];
  notifications: Notification[];
  submissionTab: SubmissionTab;
  /** Right-pane active tab; null when split mode is off. */
  submissionTabRight: SubmissionTab | null;
  /** Whether the SubmissionPage is split into two side-by-side panes. */
  splitMode: boolean;
  /** Width ratio of the left pane in split mode (0..1). Persisted. */
  splitRatio: number;
  queueFilters: QueueFilters;
  /**
   * In-flight PAR draft (single, latest). Keyed by field-spec key. Reset
   * on submit. Persists across reload via localStorage.
   */
  parDraft: Record<string, string | number | boolean>;
  /** Per-field provenance — drives Diane-drafted vs user-authored visual cues. */
  parProvenance: Record<string, FieldProvenance>;
}

type ThemisAction =
  | { type: 'SET_PERSONA'; id: string }
  | { type: 'SELECT_SUBMISSION'; id: string | null }
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'ADD_FIELD_COMMENT'; comment: FieldComment }
  | { type: 'MARK_THREAD_READ'; threadId: string; personaId: string }
  | { type: 'MARK_NOTIFICATION_READ'; id: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ'; personaId: string }
  | { type: 'SET_SUBMISSION_TAB'; tab: SubmissionTab; pane?: 'left' | 'right' }
  | { type: 'TOGGLE_SPLIT_MODE' }
  | { type: 'SET_SPLIT_RATIO'; ratio: number }
  | { type: 'SWAP_PANE_CONTENT' }
  | { type: 'PATCH_FILTERS'; patch: Partial<QueueFilters> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_PAR_FIELD'; key: string; value: string | number | boolean; provenance: FieldProvenance }
  | { type: 'BATCH_SET_PAR_FIELDS'; values: Record<string, string | number | boolean>; provenance: FieldProvenance }
  | { type: 'RESET_PAR_DRAFT' }
  | { type: 'COMMIT_SYNTHESIZED_SUBMISSION'; submission: Submission; audit: AuditEvent[] };

function reducer(state: ThemisState, action: ThemisAction): ThemisState {
  switch (action.type) {
    case 'SET_PERSONA':
      return { ...state, currentPersonaId: action.id };
    case 'SELECT_SUBMISSION':
      // Reset to document tab when switching submissions
      return { ...state, selectedSubmissionId: action.id, submissionTab: 'document' };
    case 'SET_SUBMISSION_TAB':
      if (action.pane === 'right') {
        return { ...state, submissionTabRight: action.tab };
      }
      return { ...state, submissionTab: action.tab };
    case 'TOGGLE_SPLIT_MODE': {
      const next = !state.splitMode;
      return {
        ...state,
        splitMode: next,
        // Entering split: pick a sensible default for the right pane
        submissionTabRight: next
          ? state.submissionTabRight ??
            (state.submissionTab === 'document' ? 'diane' : 'document')
          : null,
      };
    }
    case 'SET_SPLIT_RATIO':
      return { ...state, splitRatio: Math.max(0.25, Math.min(0.75, action.ratio)) };
    case 'SWAP_PANE_CONTENT':
      return {
        ...state,
        submissionTab: state.submissionTabRight ?? state.submissionTab,
        submissionTabRight: state.submissionTab,
      };
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
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, read: true } : n,
        ),
      };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.forPersonaId === action.personaId ? { ...n, read: true } : n,
        ),
      };
    case 'PATCH_FILTERS':
      return { ...state, queueFilters: { ...state.queueFilters, ...action.patch } };
    case 'CLEAR_FILTERS':
      return { ...state, queueFilters: EMPTY_FILTERS };
    case 'SET_PAR_FIELD':
      return {
        ...state,
        parDraft: { ...state.parDraft, [action.key]: action.value },
        parProvenance: { ...state.parProvenance, [action.key]: action.provenance },
      };
    case 'BATCH_SET_PAR_FIELDS': {
      const nextProvenance = { ...state.parProvenance };
      for (const k of Object.keys(action.values)) {
        nextProvenance[k] = action.provenance;
      }
      return {
        ...state,
        parDraft: { ...state.parDraft, ...action.values },
        parProvenance: nextProvenance,
      };
    }
    case 'RESET_PAR_DRAFT':
      return { ...state, parDraft: {}, parProvenance: {} };
    case 'COMMIT_SYNTHESIZED_SUBMISSION': {
      // Append the freshly synthesized submission + its audit trail to the
      // in-memory seed; create a thread shell so the existing surfaces (chat
      // tab, ContextTab) don't break; reset the draft.
      const newThread = {
        id: action.submission.threadId,
        submissionId: action.submission.id,
        participantIds: [
          action.submission.submittedBy,
          ...action.submission.assignees,
        ],
        lastMessageAt: action.submission.createdAt,
        unreadByPersonaId: Object.fromEntries(
          action.submission.assignees.map((id) => [id, 1]),
        ),
      };
      // Notifications for each assignee — "you've been routed a new
      // submission". The notifications drawer surfaces these.
      const newNotifications: Notification[] = action.submission.assignees.map(
        (assigneeId, i) => ({
          id: `n_local_${action.submission.id}_${i}`,
          forPersonaId: assigneeId,
          kind: 'submission_new' as const,
          title: `Routed: ${action.submission.title}`,
          body: `Diane proposes a ${action.submission.diane?.routingPreview.steps.length ?? 1}-step chain. Coverage ${Math.round((action.submission.diane?.coverage ?? 0) * 100)}%.`,
          createdAt: action.submission.createdAt,
          read: false,
          linkTo: action.submission.id,
        }),
      );
      return {
        ...state,
        seed: {
          ...state.seed,
          submissions: [...state.seed.submissions, action.submission],
          audit: [...state.seed.audit, ...action.audit],
        },
        threads: [...state.threads, newThread],
        notifications: [...state.notifications, ...newNotifications],
        selectedSubmissionId: action.submission.id,
        parDraft: {},
        parProvenance: {},
      };
    }
    default:
      return state;
  }
}

interface ThemisContextValue extends ThemisState {
  setCurrentPersonaId: (id: string) => void;
  selectSubmission: (id: string | null) => void;
  setSubmissionTab: (tab: SubmissionTab, pane?: 'left' | 'right') => void;
  toggleSplitMode: () => void;
  setSplitRatio: (ratio: number) => void;
  swapPaneContent: () => void;
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
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setParField: (key: string, value: string | number | boolean, provenance?: FieldProvenance) => void;
  batchSetParFields: (values: Record<string, string | number | boolean>, provenance?: FieldProvenance) => void;
  resetParDraft: () => void;
  /**
   * Synthesize the current parDraft into a Submission with full
   * DianeAnnotation, commit it to the in-memory seed, and return the
   * synthesis outcome (so the caller can drive the SubmittingOverlay
   * sequence + navigation).
   */
  submitParDraft: () => SynthesisOutcome | null;
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
    notifications: [...seed.notifications],
    submissionTab: 'document' as SubmissionTab,
    submissionTabRight: null as SubmissionTab | null,
    splitMode: false,
    splitRatio: 0.5,
    queueFilters: EMPTY_FILTERS,
    parDraft: {},
    parProvenance: {},
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
      const storedDraft = localStorage.getItem(PAR_DRAFT_KEY);
      if (storedDraft) {
        try {
          const parsed = JSON.parse(storedDraft) as {
            values?: Record<string, string | number | boolean>;
            provenance?: Record<string, FieldProvenance>;
          };
          if (parsed.values && typeof parsed.values === 'object') {
            dispatch({
              type: 'BATCH_SET_PAR_FIELDS',
              values: parsed.values,
              provenance: 'user',
            });
            // Re-apply per-field provenance after batch
            if (parsed.provenance) {
              for (const [k, prov] of Object.entries(parsed.provenance)) {
                if (prov === 'diane' && parsed.values[k] !== undefined) {
                  dispatch({
                    type: 'SET_PAR_FIELD',
                    key: k,
                    value: parsed.values[k],
                    provenance: 'diane',
                  });
                }
              }
            }
          }
        } catch {
          /* ignore */
        }
      }
      const storedSplit = localStorage.getItem(SPLIT_KEY);
      if (storedSplit) {
        try {
          const parsed = JSON.parse(storedSplit) as {
            splitMode?: boolean;
            splitRatio?: number;
            submissionTabRight?: SubmissionTab | null;
          };
          if (typeof parsed.splitRatio === 'number') {
            dispatch({ type: 'SET_SPLIT_RATIO', ratio: parsed.splitRatio });
          }
          if (parsed.splitMode) {
            dispatch({ type: 'TOGGLE_SPLIT_MODE' });
            if (parsed.submissionTabRight) {
              dispatch({
                type: 'SET_SUBMISSION_TAB',
                tab: parsed.submissionTabRight,
                pane: 'right',
              });
            }
          }
        } catch {
          /* ignore */
        }
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

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        SPLIT_KEY,
        JSON.stringify({
          splitMode: state.splitMode,
          splitRatio: state.splitRatio,
          submissionTabRight: state.submissionTabRight,
        }),
      );
    } catch {
      /* noop */
    }
  }, [hydrated, state.splitMode, state.splitRatio, state.submissionTabRight]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        PAR_DRAFT_KEY,
        JSON.stringify({
          values: state.parDraft,
          provenance: state.parProvenance,
        }),
      );
    } catch {
      /* noop */
    }
  }, [hydrated, state.parDraft, state.parProvenance]);

  const setCurrentPersonaId = useCallback((id: string) => {
    dispatch({ type: 'SET_PERSONA', id });
  }, []);

  const selectSubmission = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_SUBMISSION', id });
  }, []);

  const setSubmissionTab = useCallback(
    (tab: SubmissionTab, pane?: 'left' | 'right') => {
      dispatch({ type: 'SET_SUBMISSION_TAB', tab, pane });
    },
    [],
  );

  const toggleSplitMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_SPLIT_MODE' });
  }, []);

  const setSplitRatio = useCallback((ratio: number) => {
    dispatch({ type: 'SET_SPLIT_RATIO', ratio });
  }, []);

  const swapPaneContent = useCallback(() => {
    dispatch({ type: 'SWAP_PANE_CONTENT' });
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

  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', id });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ', personaId: state.currentPersonaId });
  }, [state.currentPersonaId]);

  const setParField = useCallback(
    (key: string, value: string | number | boolean, provenance: FieldProvenance = 'user') => {
      dispatch({ type: 'SET_PAR_FIELD', key, value, provenance });
    },
    [],
  );

  const batchSetParFields = useCallback(
    (values: Record<string, string | number | boolean>, provenance: FieldProvenance = 'diane') => {
      dispatch({ type: 'BATCH_SET_PAR_FIELDS', values, provenance });
    },
    [],
  );

  const resetParDraft = useCallback(() => {
    dispatch({ type: 'RESET_PAR_DRAFT' });
  }, []);

  const submitParDraft = useCallback((): SynthesisOutcome | null => {
    const submitter = state.seed.personas.find((p) => p.id === state.currentPersonaId);
    if (!submitter) return null;
    if (Object.keys(state.parDraft).length === 0) return null;
    const outcome = synthesizeSubmissionFromDraft({
      values: state.parDraft,
      provenance: state.parProvenance,
      submitter,
      allSubmissions: state.seed.submissions,
    });
    dispatch({
      type: 'COMMIT_SYNTHESIZED_SUBMISSION',
      submission: outcome.submission,
      audit: outcome.audit,
    });
    return outcome;
  }, [state.seed, state.parDraft, state.parProvenance, state.currentPersonaId]);

  const value = useMemo<ThemisContextValue>(
    () => ({
      ...state,
      setCurrentPersonaId,
      selectSubmission,
      setSubmissionTab,
      toggleSplitMode,
      setSplitRatio,
      swapPaneContent,
      patchFilters,
      clearFilters,
      addMessage,
      addFieldComment,
      markThreadRead,
      markNotificationRead,
      markAllNotificationsRead,
      setParField,
      batchSetParFields,
      resetParDraft,
      submitParDraft,
    }),
    [
      state,
      setCurrentPersonaId,
      selectSubmission,
      setSubmissionTab,
      toggleSplitMode,
      setSplitRatio,
      swapPaneContent,
      patchFilters,
      clearFilters,
      addMessage,
      addFieldComment,
      markThreadRead,
      markNotificationRead,
      markAllNotificationsRead,
      setParField,
      batchSetParFields,
      resetParDraft,
      submitParDraft,
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
