/**
 * Routing rules — the 8 seeded When-Then rules powering the routing
 * intelligence façade.
 *
 * The plan §9.3 frames the workflow builder as "a façade over exact-
 * match lookup of 8 seeded rules" — not a general engine. Diane's
 * `routingPreview.steps[].ruleId` references these by id; the
 * /workflows page renders them as read-only cards (T1.9), upgrades to
 * three-mode (NL ↔ When-Then ↔ graph) editor in T4.
 */

export interface Rule {
  id: string;
  /** Short title for card header. */
  title: string;
  /** Single-sentence "When …" trigger. */
  when: string;
  /** Single-sentence "Then …" action. */
  then: string;
  /** Owner role for the rule's accountability. */
  owner: string;
  /** Cited policy/clause that grounds the rule, if any. */
  cites?: string;
  /** Mock fire-count for "last fired N times this week". */
  firedThisWeek: number;
  /**
   * Whether this rule represents a structural guarantee (deterministic,
   * not prompt engineering). Surfaces as a small badge on the card.
   */
  structuralGuarantee?: boolean;
}

export const SEEDED_RULES: Rule[] = [
  {
    id: 'rule:limit_breach_under_25m_first_line',
    title: 'Limit breach — first-line authority',
    when: 'A threshold-breach is submitted with exposure ≤ $25M',
    then: 'Route to the desk\'s Director, Operational Risk for first-line review',
    owner: 'Operational Risk',
    cites: 'POL-DG-115 §2.1',
    firedThisWeek: 7,
    structuralGuarantee: true,
  },
  {
    id: 'rule:limit_breach_over_10m_compliance_secondary',
    title: 'Limit breach — Compliance secondary',
    when: 'A threshold-breach is submitted with exposure > $10M',
    then: 'Also route to VP, Compliance for secondary sign-off',
    owner: 'Compliance',
    cites: 'POL-DG-115 §3.4',
    firedThisWeek: 4,
    structuralGuarantee: true,
  },
  {
    id: 'rule:data_residency_exception_compliance',
    title: 'Data residency — Compliance review',
    when: 'A policy-exception is submitted referencing data residency',
    then: 'Route to VP, Compliance as first-line reviewer',
    owner: 'Compliance',
    cites: 'POL-DG-204 §4.2',
    firedThisWeek: 2,
  },
  {
    id: 'rule:cross_border_data_legal_review',
    title: 'Cross-border data — Legal sign-off',
    when: 'A data-residency exception involves cross-border processing on non-Canadian infrastructure',
    then: 'Add General Counsel to the chain, parallel to Compliance',
    owner: 'Legal',
    cites: 'POL-DG-204 §8.5',
    firedThisWeek: 1,
  },
  {
    id: 'rule:capex_above_1m_board_review',
    title: 'Capex above $1M — board sub-committee',
    when: 'A capex submission exceeds $1M',
    then: 'Escalate to the board sub-committee chain after CFO sign-off',
    owner: 'Board sub-committee',
    cites: 'POL-CAPEX-2024 §1.3',
    firedThisWeek: 1,
    structuralGuarantee: true,
  },
  {
    id: 'rule:risk_override_audit_observer',
    title: 'Risk override — Audit observer',
    when: 'A risk-override is submitted',
    then: 'Add Internal Audit Lead as a watcher on the submission',
    owner: 'Internal Audit',
    cites: 'POL-AUD-2024 §2.7',
    firedThisWeek: 3,
  },
  {
    id: 'rule:vendor_renewal_attestation_check',
    title: 'Vendor renewal — attestation check',
    when: 'A vendor onboarding is a renewal of an existing relationship',
    then: 'Trigger a SOC 2 / ISO 27001 attestation lookup before approver assignment',
    owner: 'Vendor management',
    cites: 'POL-VENDOR-2025-12 §2.4',
    firedThisWeek: 5,
  },
  {
    id: 'rule:emergency_unwind_t1_window',
    title: 'Emergency unwind — T+1 expedite',
    when: 'A threshold-breach is submitted with a T+1 unwind window',
    then: 'Compress first-line decision SLA to 4 hours',
    owner: 'Operational Risk',
    cites: 'POL-RM-2024-07 §5.1',
    firedThisWeek: 6,
  },
];

export function findRule(id: string): Rule | undefined {
  return SEEDED_RULES.find((r) => r.id === id);
}
