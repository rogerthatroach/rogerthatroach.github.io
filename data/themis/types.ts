/**
 * Themis (/blue-rose) — shared types.
 *
 * All shapes here describe the seeded mock data and the runtime store.
 * Pragmatic, not over-engineered: enough to drive Concept A (inbox).
 */

export type SubmissionStatus =
  | 'draft'
  | 'pending'
  | 'in_review'
  | 'changes_requested'
  | 'approved'
  | 'rejected';

export type Priority = 'low' | 'normal' | 'high';

export type PersonaRole = 'submitter' | 'approver' | 'observer' | 'admin' | 'agent';

export type Confidence = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  displayName: string;
  email: string;
  avatarSeed: string;
}

export interface Persona extends User {
  role: PersonaRole;
  accentHex: string;
  title?: string;
  /**
   * Visual classification per GitHub Primer rule. Default: humans = 'circle';
   * AI agents = 'squircle'; Diane gets 'glyph' (squircle + scale-of-justice).
   */
  avatarKind?: 'circle' | 'squircle' | 'glyph';
}

export interface Attachment {
  id: string;
  name: string;
  mime: string;
  sizeBytes: number;
  /** Optional inline data URL for previewing image/pdf without a real file. */
  dataUrl?: string;
}

export interface FormField {
  key: string;
  label: string;
  value: string | number | boolean;
}

export interface Submission {
  id: string;
  title: string;
  /** e.g. 'control-exception' — keys into the schema in `data/themis/schema.ts`. */
  kind: string;
  status: SubmissionStatus;
  submittedBy: string;
  assignees: string[];
  createdAt: number;
  updatedAt: number;
  fields: FormField[];
  attachmentIds: string[];
  threadId: string;
  priority: Priority;
  /** Free-form labels — feed the queue filters and chip rendering. */
  tags: string[];
  /**
   * Diane's analysis of this submission. Present only on submissions Diane
   * has been invoked on (per the single-agent governance envelope from PAR
   * Assist Phase 1: Diane runs only where she's invoked, not over everything).
   * Absence renders as the "Diane was not invoked" empty state.
   */
  diane?: DianeAnnotation;
}

/**
 * Diane's per-submission annotation. Vocabulary echoes public PAR Assist
 * (Prometheus) Phase 1 architecture so stakeholders recognize the same
 * patterns: MCP tool boundary, two-stage field-group retrieval, coverage
 * analyzer, structural guarantees.
 */
export interface DianeAnnotation {
  /** 1-paragraph plain-language framing rendered at top of WhyCard. */
  summary: string;
  /** Top 3 reasons to approve. */
  reasonsFor: string[];
  /** Top 3 reasons to question. */
  reasonsAgainst: string[];
  /** 3-6 cited policy clauses, chip-renderable inline as [1], [2], [3]. */
  citations: DianeCitation[];
  /** Predicted approver chain with rule-id provenance. */
  routingPreview: {
    steps: {
      approverId: string;
      role: string;
      rationale: string;
      ruleId: string;
    }[];
    estimatedDays: number;
  };
  /** 0..1 — % of expected field-groups populated (echoes PAR coverage analyzer). */
  coverage: number;
  confidence: Confidence;
  /** e.g. ['policy_lookup@v3', 'vendor_history@v2'] — visible in audit + WhyCard. */
  mcpToolsUsed: string[];
  /** e.g. ['financial_impact', 'jurisdiction', 'vendor_record']. */
  fieldGroupsRetrieved: string[];
  /** Optional questions Diane suggests the approver consider (T3 surfaces these). */
  questionsWorthAsking?: string[];
  /** Per-field flags (info / warning / block) — render as small chevrons. */
  flags?: { fieldKey: string; severity: 'info' | 'warning' | 'block'; rationale: string }[];
}

export interface DianeCitation {
  /** Numeric chip id, [1] / [2] / [3]…, referenced inline from prose. */
  id: number;
  /** e.g. 'POL-RM-2024-07'. */
  policyId: string;
  /** e.g. '§7.2'. */
  clauseRef: string;
  /** 1-2 sentence policy excerpt — shows in hover preview. */
  quote: string;
  /** POC: hash-route into a stub policy viewer. */
  deepLink: string;
}

export interface Thread {
  id: string;
  submissionId: string;
  participantIds: string[];
  lastMessageAt: number;
  unreadByPersonaId: Record<string, number>;
}

export interface Message {
  id: string;
  threadId: string;
  authorPersonaId: string;
  body: string;
  createdAt: number;
  mentions: string[];
  tags: string[];
  readByPersonaIds: string[];
  /** System-emitted events (status changes) render as inline notices. */
  systemKind?: 'submitted' | 'approved' | 'rejected' | 'changes_requested' | 'reassigned';
}

export type NotificationKind =
  | 'submission_new'
  | 'mention'
  | 'reply'
  | 'status_change'
  | 'assignment';

export interface Notification {
  id: string;
  forPersonaId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
  linkTo?: string;
}

export interface AuditEvent {
  id: string;
  submissionId: string;
  actorPersonaId: string;
  kind: string;
  at: number;
  before?: unknown;
  after?: unknown;
  /**
   * For AI-actor events, the typed reasoning trace that surfaces in the
   * "Why did Diane do this?" expandable. Vocabulary echoes PAR Assist
   * Phase 1 (MCP tool boundary, field-group taxonomy, coverage analyzer).
   */
  dianeReasoning?: {
    /** e.g. "policy_lookup@v3 returned 7 clauses; coverage analyzer flagged 1 missing field-group → recommended jurisdiction_check@v2" */
    rationale: string;
    mcpTool: string;
    fieldGroup?: string;
    confidence: Confidence;
    /** Citation ids referencing entries in submission.diane.citations. */
    citations: number[];
  };
}

export type ScheduledEventKind =
  | 'TYPING_START'
  | 'TYPING_STOP'
  | 'MESSAGE_FROM_PERSONA'
  | 'READ_RECEIPT'
  | 'STATUS_CHANGE'
  | 'NOTIFICATION';

export interface ScheduledEvent {
  id: string;
  fireAt: number;
  kind: ScheduledEventKind;
  payload: Record<string, unknown>;
}

export interface Draft {
  personaId: string;
  threadId: string;
  body: string;
  updatedAt: number;
}

/**
 * Field-anchored comment — a "floating thread" attached to a single form
 * field on a submission. Used to discuss specifics of a draft inline,
 * Google-Docs-comment style. Lives on the submission, not the thread.
 */
export interface FieldComment {
  id: string;
  submissionId: string;
  fieldKey: string;
  authorPersonaId: string;
  body: string;
  createdAt: number;
  mentions: string[];
}

/** Top-level shape of the seeded JSON (and the runtime store before UI state). */
export interface ThemisSeed {
  personas: Persona[];
  users: User[];
  submissions: Submission[];
  threads: Thread[];
  messages: Message[];
  attachments: Attachment[];
  notifications: Notification[];
  audit: AuditEvent[];
  /** Optional in seed v1; default to [] when missing. */
  fieldComments?: FieldComment[];
}
