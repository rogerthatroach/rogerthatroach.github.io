/**
 * par-synthesize — pure functions that turn a completed PAR draft into
 * a Submission + DianeAnnotation pair, modeling the Phase-1-vocabulary
 * synthesis that runs at submit time.
 *
 *   parDraft (compose) ───┬─→ Submission (form values, status, assignees)
 *   parProvenance ────────┤
 *   persona ──────────────┤
 *   seed.submissions ─────┴─→ DianeAnnotation (summary, reasons, citations,
 *                              routingPreview, coverage, confidence, MCP
 *                              tools, field-groups)
 *
 * No state. No React. Same inputs → same outputs. Stakeholders watching
 * the demo see Diane "synthesize" the annotation as an MCP-tool sequence
 * overlay; under the hood it's this module producing the artifact.
 */

import type {
  AuditEvent,
  Confidence,
  DianeAnnotation,
  DianeCitation,
  Persona,
  Submission,
} from '@/data/themis/types';
import {
  PAR_SECTIONS,
  isFieldFilled,
  overallCoverage,
} from './par-schema';
import type { FieldProvenance } from './store';
import { findRule, SEEDED_RULES } from './rules';

// ── Routing rule selection ──────────────────────────────────────────

type RoutingChoice = {
  ruleId: string;
  approverId: string;
  role: string;
  rationale: string;
};

/**
 * Pick the routing chain for a freshly synthesized PAR submission.
 *
 * Façade over exact-match lookup — see plan §9.3. Uses the financial
 * total + classification + jurisdiction signals to pick rules. Always
 * returns at least one step so the chain is never empty.
 */
function pickRoutingChain(values: Record<string, string | number | boolean>): RoutingChoice[] {
  const total = Number(values.total_expenditure ?? 0); // CAD thousands
  const classification = String(values.classification ?? '');
  const initiative = String(values.initiative_type ?? '');
  const sponsorUnit = String(values.sponsor_unit ?? '');

  const chain: RoutingChoice[] = [];

  // Step 1 — first-line review by sponsor unit (Operational Risk-equivalent).
  // Maps to capex / operational rule.
  if (total >= 1000) {
    // Above $1M (in CAD thousands; 1000K = $1M)
    const rule = findRule('rule:capex_above_1m_board_review');
    if (rule) {
      chain.push({
        ruleId: rule.id,
        approverId: 'p_priya', // Director, Operational Risk — first-line
        role: 'Director, Operational Risk',
        rationale: 'First-line review on project expenditures over $1M before board sub-committee escalation.',
      });
    }
  } else {
    chain.push({
      ruleId: 'rule:project_expenditure_first_line',
      approverId: 'p_priya',
      role: 'Director, Operational Risk',
      rationale: 'First-line review for project expenditure below the $1M board-escalation threshold.',
    });
  }

  // Step 2 — Compliance secondary if amount > $5M (5K of CAD thousands)
  if (total >= 5000) {
    chain.push({
      ruleId: 'rule:limit_breach_over_10m_compliance_secondary',
      approverId: 'p_marcus',
      role: 'VP, Compliance',
      rationale: 'Compliance secondary sign-off required for spend above $5M tier.',
    });
  } else if (classification === 'Technology' && initiative === 'Change-the-Bank') {
    // Technology change-the-bank initiatives loop in Compliance for tech-risk review
    chain.push({
      ruleId: 'rule:tech_change_compliance_review',
      approverId: 'p_marcus',
      role: 'VP, Compliance',
      rationale: 'Technology change-the-bank initiatives require Compliance review for tech-risk alignment.',
    });
  }

  // Step 3 — Legal review for cross-border / data-residency adjacent
  const description = String(values.description ?? '').toLowerCase();
  const isCrossBorder = description.includes('cross-border') || description.includes('residency') || description.includes('us-east') || description.includes('gdpr');
  if (isCrossBorder) {
    chain.push({
      ruleId: 'rule:cross_border_data_legal_review',
      approverId: 'p_legal',
      role: 'General Counsel',
      rationale: 'Cross-border or data-residency exposure requires General Counsel sign-off in parallel.',
    });
  }

  return chain;
}

function estimateDays(chain: RoutingChoice[]): number {
  // 1 day per first-line + 2 days per additional (parallel) — capped at 5
  if (chain.length === 0) return 1;
  return Math.min(1 + (chain.length - 1) * 2, 5);
}

// ── Citation selection ─────────────────────────────────────────────

/**
 * Pick the relevant policy citations for the submission. In a real
 * Phase 2 system this would call `policy_lookup@v3` against the field-
 * group taxonomy; here it's a hand-curated lookup keyed by category +
 * classification + the cross-border heuristic.
 */
function pickCitations(values: Record<string, string | number | boolean>): DianeCitation[] {
  const citations: DianeCitation[] = [];
  const total = Number(values.total_expenditure ?? 0);
  const classification = String(values.classification ?? '');
  const description = String(values.description ?? '').toLowerCase();
  const initiative = String(values.initiative_type ?? '');
  let id = 1;

  // Cap-ex policy reference whenever there's a financial number
  if (total > 0) {
    citations.push({
      id: id++,
      policyId: 'POL-CAPEX-2024',
      clauseRef: '§1.3',
      quote:
        'Project expenditures exceeding $1M require board sub-committee approval; expenditures below this threshold sit with first-line authority.',
      deepLink: '#policy/POL-CAPEX-2024/1.3',
    });
  }

  // Technology / change-the-bank → tech-risk policy
  if (classification === 'Technology' && initiative === 'Change-the-Bank') {
    citations.push({
      id: id++,
      policyId: 'POL-TECH-RISK-2024',
      clauseRef: '§4.1',
      quote:
        'Change-the-Bank technology initiatives must articulate dependencies on existing infrastructure and compensating controls for migration risk.',
      deepLink: '#policy/POL-TECH-RISK-2024/4.1',
    });
  }

  // Compensating controls policy when risks_summary is filled
  if (isFieldFilled(values.risks_summary)) {
    citations.push({
      id: id++,
      policyId: 'POL-RM-2024-07',
      clauseRef: '§5.1',
      quote:
        'For each risk, document inherent severity, residual severity post-mitigation, and the specific actions that mitigate the risk.',
      deepLink: '#policy/POL-RM-2024-07/5.1',
    });
  }

  // Cross-border citation
  if (description.includes('cross-border') || description.includes('residency')) {
    citations.push({
      id: id++,
      policyId: 'POL-DG-204',
      clauseRef: '§4.2',
      quote:
        'Cross-border data-residency exceptions require Compliance review and, where US infrastructure is involved, General Counsel sign-off.',
      deepLink: '#policy/POL-DG-204/4.2',
    });
  }

  // Vendor controls when vendor language present
  if (description.includes('vendor') || description.includes('saas') || description.includes('salesforce')) {
    citations.push({
      id: id++,
      policyId: 'POL-VENDOR-2025-12',
      clauseRef: '§2.4',
      quote:
        'Third-party platform engagements require SOC 2 Type II + ISO 27001 verification and a quarterly attestation cadence.',
      deepLink: '#policy/POL-VENDOR-2025-12/2.4',
    });
  }

  return citations;
}

// ── Reasons for / against ──────────────────────────────────────────

function generateReasonsFor(
  values: Record<string, string | number | boolean>,
  provenance: Record<string, FieldProvenance>,
  citations: DianeCitation[],
  coverage: number,
): string[] {
  const reasons: string[] = [];

  if (coverage >= 0.85) {
    reasons.push(
      `Coverage at ${Math.round(coverage * 100)}% — the submission addresses the great majority of expected field-groups.`,
    );
  }

  if (citations.length >= 3) {
    reasons.push(
      `${citations.length} policy clauses cited (${citations
        .slice(0, 2)
        .map((c) => `${c.policyId} ${c.clauseRef}`)
        .join(', ')}${citations.length > 2 ? ', …' : ''}) — the request is grounded in existing institutional policy.`,
    );
  }

  // Compensating controls articulated
  if (isFieldFilled(values.mitigation_actions) && isFieldFilled(values.risks_summary)) {
    reasons.push(
      'Risks summary and mitigation actions are both present — inherent vs residual severity framing is in place.',
    );
  }

  // Strategic alignment to enterprise priority
  if (isFieldFilled(values.strategic_alignment)) {
    const priority = values.enterprise_priority;
    if (priority) {
      reasons.push(
        `Strategic alignment articulates the request against the ${priority} enterprise priority.`,
      );
    } else {
      reasons.push('Strategic alignment narrative is documented.');
    }
  }

  // Quantified benefits
  if (isFieldFilled(values.success_metrics) && isFieldFilled(values.benefits_qualitative)) {
    reasons.push(
      'Quantified success metrics + qualitative benefit narrative — measurability is established.',
    );
  }

  // Mostly user-authored fields signal real effort
  const userAuthoredCount = Object.values(provenance).filter((p) => p === 'user').length;
  const dianeAuthoredCount = Object.values(provenance).filter((p) => p === 'diane').length;
  if (userAuthoredCount > dianeAuthoredCount) {
    reasons.push(
      `Submitter authored or revised the majority of fields (${userAuthoredCount} of ${userAuthoredCount + dianeAuthoredCount}) — Diane drafted, the human stewarded.`,
    );
  }

  return reasons.slice(0, 3);
}

function generateReasonsAgainst(
  values: Record<string, string | number | boolean>,
  coverage: number,
  similar: Submission[],
): string[] {
  const reasons: string[] = [];

  // Coverage gaps
  if (coverage < 0.85) {
    const missing: string[] = [];
    for (const section of PAR_SECTIONS) {
      const filled = section.fields.filter((f) => isFieldFilled(values[f.key])).length;
      if (filled === 0) missing.push(section.title);
    }
    if (missing.length > 0) {
      reasons.push(
        `Coverage below 85% — these sections remain empty: ${missing.slice(0, 2).join(', ')}${missing.length > 2 ? ', …' : ''}.`,
      );
    } else {
      reasons.push(
        `Coverage at ${Math.round(coverage * 100)}% — required fields missing across multiple sections.`,
      );
    }
  }

  // In-plan answer (governance-relevant)
  const inPlan = String(values.in_plan ?? '');
  if (inPlan === 'No' || inPlan === 'Partial') {
    reasons.push(
      `In-plan status is "${inPlan}" — historically these returns rate is ~40% higher than fully-in-plan requests.`,
    );
  }

  // Sponsor delegate empty (a structural field for accountability)
  if (!isFieldFilled(values.sponsor_delegate)) {
    reasons.push(
      'Sponsor Delegate field is empty — accountability backstop is undefined.',
    );
  }

  // Spend tier comparison
  const total = Number(values.total_expenditure ?? 0);
  if (total > 0 && similar.length >= 2) {
    const similarTotals = similar
      .map((s) => Number(s.fields.find((f) => f.key === 'total_expenditure')?.value ?? 0))
      .filter((n) => n > 0)
      .sort((a, b) => a - b);
    if (similarTotals.length >= 2) {
      const median = similarTotals[Math.floor(similarTotals.length / 2)];
      if (median > 0 && total > median * 1.5) {
        reasons.push(
          `Total expenditure ($${total.toLocaleString()}K) exceeds the median for similar prior approvals ($${Math.round(median).toLocaleString()}K) by more than 50%.`,
        );
      }
    }
  }

  return reasons.slice(0, 3);
}

// ── Confidence calculation ─────────────────────────────────────────

function calculateConfidence(
  coverage: number,
  values: Record<string, string | number | boolean>,
  citations: DianeCitation[],
): Confidence {
  // High: coverage > 0.9 AND ≥ 3 citations AND mitigation/risks both present
  const hasRiskNarrative =
    isFieldFilled(values.risks_summary) && isFieldFilled(values.mitigation_actions);
  if (coverage >= 0.9 && citations.length >= 3 && hasRiskNarrative) return 'high';
  if (coverage >= 0.7 && citations.length >= 2) return 'medium';
  return 'low';
}

// ── Field-group mapping ─────────────────────────────────────────────

function fieldGroupsTouched(
  values: Record<string, string | number | boolean>,
): string[] {
  const groups: string[] = [];
  if (isFieldFilled(values.total_expenditure)) groups.push('financial_impact');
  if (
    isFieldFilled(values.strategic_alignment) ||
    isFieldFilled(values.enterprise_priority)
  )
    groups.push('strategic_alignment');
  if (isFieldFilled(values.risks_summary)) groups.push('risk_assessment');
  if (
    isFieldFilled(values.benefits_qualitative) ||
    isFieldFilled(values.success_metrics)
  )
    groups.push('benefits_kpis');
  if (
    isFieldFilled(values.options_considered) ||
    isFieldFilled(values.recommended_option)
  )
    groups.push('options_analysis');
  const desc = String(values.description ?? '').toLowerCase();
  if (desc.includes('vendor') || desc.includes('saas')) groups.push('vendor_record');
  if (desc.includes('cross-border') || desc.includes('residency'))
    groups.push('jurisdiction');
  return groups;
}

// ── Similar submissions ────────────────────────────────────────────

function findSimilarSubmissions(
  values: Record<string, string | number | boolean>,
  all: Submission[],
): Submission[] {
  const classification = String(values.classification ?? '');
  const sponsorSegment = String(values.sponsor_segment ?? '');
  return all
    .filter((s) => {
      if (s.status === 'draft') return false;
      const sClass = s.fields.find((f) => f.key === 'classification')?.value;
      const sSeg = s.fields.find((f) => f.key === 'sponsor_segment')?.value;
      return sClass === classification || sSeg === sponsorSegment;
    })
    .slice(0, 5);
}

// ── Synthesis (the main entry point) ────────────────────────────────

export interface SynthesisOutcome {
  submission: Submission;
  audit: AuditEvent[];
  /** Lines to surface in the SubmittingOverlay sequence. */
  toolSequence: { tool: string; label: string; durationMs: number }[];
}

export function synthesizeSubmissionFromDraft(args: {
  values: Record<string, string | number | boolean>;
  provenance: Record<string, FieldProvenance>;
  submitter: Persona;
  allSubmissions: Submission[];
  now?: number;
}): SynthesisOutcome {
  const { values, provenance, submitter, allSubmissions } = args;
  const now = args.now ?? Date.now();

  const title = String(values.request_title ?? 'Untitled request');
  const submissionId = `s_local_${now}`;
  const threadId = `t_local_${now}`;

  const coverage = overallCoverage(values);
  const citations = pickCitations(values);
  const chain = pickRoutingChain(values);
  const similar = findSimilarSubmissions(values, allSubmissions);
  const confidence = calculateConfidence(coverage, values, citations);
  const reasonsFor = generateReasonsFor(values, provenance, citations, coverage);
  const reasonsAgainst = generateReasonsAgainst(values, coverage, similar);
  const groups = fieldGroupsTouched(values);

  const summary = generateSummary(values, chain, coverage);

  const diane: DianeAnnotation = {
    summary,
    reasonsFor,
    reasonsAgainst,
    citations,
    routingPreview: {
      steps: chain.map((c) => ({
        approverId: c.approverId,
        role: c.role,
        rationale: c.rationale,
        ruleId: c.ruleId,
      })),
      estimatedDays: estimateDays(chain),
    },
    coverage,
    confidence,
    mcpToolsUsed: [
      'policy_lookup@v3',
      'similar_history@v2',
      'routing_engine@v3',
      'coverage_analyzer@v1',
    ],
    fieldGroupsRetrieved: groups,
  };

  // Build form fields from the parDraft values
  const fields = PAR_SECTIONS.flatMap((section) =>
    section.fields
      .filter((f) => isFieldFilled(values[f.key]))
      .map((f) => ({
        key: f.key,
        label: f.label,
        value: values[f.key] as string | number | boolean,
      })),
  );

  // Add status-relevant fields the existing surfaces expect
  const totalK = Number(values.total_expenditure ?? 0);
  const severity = totalK >= 1000 ? 'High' : totalK >= 500 ? 'Medium' : 'Low';
  if (!fields.some((f) => f.key === 'severity')) {
    fields.push({ key: 'severity', label: 'Severity', value: severity });
  }
  if (!fields.some((f) => f.key === 'business_unit')) {
    fields.push({
      key: 'business_unit',
      label: 'Business unit',
      value: String(values.sponsor_unit ?? values.sponsor_segment ?? '—'),
    });
  }
  if (!fields.some((f) => f.key === 'exposure')) {
    if (totalK > 0) {
      fields.push({
        key: 'exposure',
        label: 'Estimated exposure (CAD)',
        value: `$${totalK.toLocaleString()}K`,
      });
    }
  }

  const submission: Submission = {
    id: submissionId,
    title,
    kind: 'project-par',
    status: 'in_review',
    submittedBy: submitter.id,
    assignees: chain.map((c) => c.approverId),
    createdAt: now,
    updatedAt: now,
    fields,
    attachmentIds: [],
    threadId,
    priority: totalK >= 1000 ? 'high' : 'normal',
    tags: deriveTags(values),
    diane,
  };

  // Audit events — submitted + diane_analyzed + diane_routed
  const audit: AuditEvent[] = [
    {
      id: `ae_local_sub_${now}`,
      submissionId,
      actorPersonaId: submitter.id,
      kind: 'submitted',
      at: now,
    },
    {
      id: `ae_local_dia_${now}`,
      submissionId,
      actorPersonaId: 'p_diane',
      kind: 'diane_analyzed',
      at: now + 250,
      dianeReasoning: {
        rationale: `policy_lookup@v3 returned ${citations.length} clauses scoped to ${groups.slice(0, 2).join(' + ')}; coverage analyzer flagged ${Math.round(coverage * 100)}%; ${chain.length}-step approver chain matched deterministically.`,
        mcpTool: 'policy_lookup@v3',
        fieldGroup: groups[0],
        confidence,
        citations: citations.map((c) => c.id).slice(0, 3),
      },
    },
    {
      id: `ae_local_route_${now}`,
      submissionId,
      actorPersonaId: 'p_diane',
      kind: 'diane_routed',
      at: now + 500,
      dianeReasoning: {
        rationale: `Routing chain proposed: ${chain.map((c) => c.role).join(' → ')}. Estimated decision: ${estimateDays(chain)} business days.`,
        mcpTool: 'routing_engine@v3',
        fieldGroup: 'routing',
        confidence,
        citations: citations.map((c) => c.id).slice(0, 1),
      },
    },
  ];

  // The visible MCP-tool sequence shown in the SubmittingOverlay
  const toolSequence: { tool: string; label: string; durationMs: number }[] = [
    { tool: 'policy_lookup@v3', label: `${citations.length} clauses retrieved`, durationMs: 600 },
    { tool: 'similar_history@v2', label: `${similar.length} similar prior approvals scanned`, durationMs: 500 },
    { tool: 'coverage_analyzer@v1', label: `coverage ${Math.round(coverage * 100)}%`, durationMs: 400 },
    { tool: 'routing_engine@v3', label: `${chain.length}-step chain proposed`, durationMs: 700 },
  ];

  return { submission, audit, toolSequence };
}

function generateSummary(
  values: Record<string, string | number | boolean>,
  chain: RoutingChoice[],
  coverage: number,
): string {
  const title = String(values.request_title ?? 'this request');
  const totalK = Number(values.total_expenditure ?? 0);
  const dollar = totalK > 0 ? `CAD $${(totalK / 1000).toFixed(1)}M` : '';
  const cls = String(values.classification ?? '').toLowerCase();
  const opening = String(values.opening_statement ?? '').slice(0, 200);
  const chainStr = chain.length > 0 ? chain.map((c) => c.role).join(' → ') : 'first-line review';

  if (opening) {
    return `${opening}${opening.endsWith('.') ? '' : '.'} Routing: ${chainStr}. Coverage at ${Math.round(coverage * 100)}%.`;
  }
  return `${title}${dollar ? ` (${dollar})` : ''} — ${cls || 'category'} initiative. Routing through ${chainStr}. Coverage at ${Math.round(coverage * 100)}% with ${chain.length}-step approver chain proposed.`;
}

function deriveTags(values: Record<string, string | number | boolean>): string[] {
  const tags = new Set<string>();
  const cls = String(values.classification ?? '').toLowerCase();
  if (cls) tags.add(cls);
  const initiative = String(values.initiative_type ?? '').toLowerCase();
  if (initiative) tags.add(initiative.replace(/-/g, '-'));
  const desc = String(values.description ?? '').toLowerCase();
  if (desc.includes('vendor') || desc.includes('saas')) tags.add('vendor');
  if (desc.includes('cross-border')) tags.add('cross-border');
  return Array.from(tags);
}
