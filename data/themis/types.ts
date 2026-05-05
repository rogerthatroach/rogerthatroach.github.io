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

export type PersonaRole = 'submitter' | 'approver' | 'observer' | 'admin';

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
}
