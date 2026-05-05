import ComposeShell from './compose/ComposeShell';

/**
 * ComposePage — `/blue-rose/compose`.
 *
 * T2 ships the full PAR adaptation: chat-left / form-right shell with
 * 11-section accordion, status pills, Preview / Policies / Export
 * affordances, Diane drafting chain (Phase C), and submit bridge to
 * approver review (Phase D).
 */
export default function ComposePage() {
  return <ComposeShell />;
}
