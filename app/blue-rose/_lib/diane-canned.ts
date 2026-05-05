/**
 * Diane canned responses — pre-authored Q&A keyed by intent.
 *
 * Mocked: no live LLM. Each intent has a pattern (keyword bag),
 * a prose answer that may reference live KPI numbers via tokens, and
 * an optional "deep link" — a hint to the UI to focus a particular
 * section (e.g., 'kindBars') so the chart corresponding to the answer
 * gets a soft highlight.
 *
 * Tokens supported in `template`:
 *   {{approvalRate}}      formatted approval rate (e.g. "67%")
 *   {{decisionTime}}      formatted avg decision time (e.g. "1.4d")
 *   {{approvedBudget}}    formatted currency (e.g. "$420M")
 *   {{costAtRisk}}        formatted currency
 *   {{anomalyCount}}      number of anomaly hints
 *   {{topKind}}           top kind by volume
 *   {{topKindRate}}       approval rate for that top kind
 *   {{topBU}}             business unit with highest spend
 *   {{topPerson}}         most-active submitter (display name)
 *
 * Tone: calm, structured. Not chipper. Not jargony. Italic optional
 * for the closing line.
 */

import type { Submission, AuditEvent, Persona } from '@/data/themis/types';
import {
  computeKPIs,
  formatCurrency,
  formatDuration,
  formatPercent,
  kindBreakdown,
  businessUnitSpend,
  personaActivity,
  type DashboardKPIs,
  type ScenarioOverrides,
} from './dashboard';

export interface DianeIntent {
  id: string;
  /** Lowercase keywords; intent matches if ANY word in the user query
   * appears in a keyword group, scored across groups. */
  patterns: string[][];
  /** The response template — may include {{tokens}}. */
  template: string;
  /** Optional pointer for the UI to highlight a chart. */
  focus?:
    | 'donut'
    | 'timeline'
    | 'kindBars'
    | 'businessUnit'
    | 'personaActivity'
    | 'whatIf';
  /** Confidence ('low' | 'medium' | 'high') — purely UX flavor. */
  confidence: 'low' | 'medium' | 'high';
}

export const DIANE_INTENTS: DianeIntent[] = [
  {
    id: 'approval_rate',
    patterns: [['approval', 'approve', 'rate'], ['rate', 'percentage', 'percent']],
    template:
      'Approval rate over the active filter is **{{approvalRate}}**. The pattern by kind sits in *Volume by type* — that\'s the cleanest read on which categories tend to clear.',
    focus: 'kindBars',
    confidence: 'high',
  },
  {
    id: 'decision_velocity',
    patterns: [
      ['velocity', 'how', 'fast', 'speed', 'turnaround'],
      ['decision', 'decide', 'long', 'time'],
    ],
    template:
      'Average decision time is **{{decisionTime}}** (submitted → terminal). The volume curve in *Approvals over time* lets you see whether that\'s steady or drifting.',
    focus: 'timeline',
    confidence: 'high',
  },
  {
    id: 'top_business_unit',
    patterns: [
      ['business', 'unit', 'department'],
      ['highest', 'top', 'biggest', 'most'],
      ['spend', 'budget', 'cost', 'expense'],
    ],
    template:
      '**{{topBU}}** carries the largest combined budget — approved + pending. The paired bars on *By business unit* show approved vs pending so you can see what\'s already committed and what\'s sitting in the queue.',
    focus: 'businessUnit',
    confidence: 'high',
  },
  {
    id: 'anomalies',
    patterns: [
      ['anomaly', 'anomalies', 'odd', 'unusual', 'outlier', 'red', 'flag', 'flags'],
    ],
    template:
      '{{anomalyCount}} anomaly hint{{plural:anomalyCount}} in range — high-priority items at high or critical severity, or repeated requests from the same submitter for the same kind in 90 days. Worth checking the *Volume by type* breakdown for which categories are pushing edges.',
    focus: 'kindBars',
    confidence: 'medium',
  },
  {
    id: 'bottleneck',
    patterns: [
      ['bottleneck', 'slow', 'slowest', 'stuck', 'blocking'],
      ['who', 'person', 'team', 'persona'],
    ],
    template:
      '*Per-persona activity* is the lens here — it shows which submitters have the most in-flight work relative to what they\'ve gotten through. The active leader by volume is **{{topPerson}}**.',
    focus: 'personaActivity',
    confidence: 'medium',
  },
  {
    id: 'cost_at_risk',
    patterns: [
      ['risk', 'at-risk', 'pending', 'queue', 'in-flight'],
      ['cost', 'budget', 'value', 'amount', 'money'],
    ],
    template:
      '**{{costAtRisk}}** in pending submissions — that\'s the value sitting in queue right now. The *In flight* tile up top is the count; *By business unit* breaks it down across teams.',
    focus: 'businessUnit',
    confidence: 'high',
  },
  {
    id: 'approved_budget',
    patterns: [
      ['approved', 'approval', 'committed'],
      ['budget', 'amount', 'value', 'how much', 'sum'],
    ],
    template:
      '**{{approvedBudget}}** of value approved over the active range. Adjust the time range or filter by business unit to slice it. The *What if?* panel can shave a reserve cushion to model headroom.',
    focus: 'whatIf',
    confidence: 'high',
  },
  {
    id: 'top_kind',
    patterns: [
      ['kind', 'type', 'category'],
      ['most', 'top', 'biggest', 'common', 'volume'],
    ],
    template:
      '**{{topKind}}** is the highest-volume kind in range, with a **{{topKindRate}}** approval rate when terminal. *Volume by type* below shows the full breakdown.',
    focus: 'kindBars',
    confidence: 'high',
  },
  {
    id: 'overall_status',
    patterns: [
      ['status', 'distribution', 'breakdown', 'split'],
      ['overall', 'total', 'how', 'shape'],
    ],
    template:
      'Status split is in the donut on the right — pending and in-review feed approved/rejected/changes-requested. Approval rate of terminal decisions is **{{approvalRate}}**.',
    focus: 'donut',
    confidence: 'high',
  },
  {
    id: 'whatif_threshold',
    patterns: [
      ['what', 'if', 'tighten', 'tightened', 'lower', 'raise'],
      ['threshold', 'limit', 'cap', 'over'],
    ],
    template:
      'Open *What if?* below — the threshold slider re-routes requests above $X to senior approval and recomputes the KPIs in place. Velocity compression and budget reserve work the same way; deltas show on the panel\'s footer strip.',
    focus: 'whatIf',
    confidence: 'medium',
  },
  {
    id: 'help',
    patterns: [
      ['help', 'what', 'can', 'do', 'how', 'use', 'guide'],
    ],
    template:
      'I can speak to approval rates, decision velocity, top business units, anomaly hints, and what-if scenarios. Try *"who has the highest spend"*, *"any anomalies?"*, or *"what if we tightened to $25M?"*.',
    confidence: 'high',
  },
];

const FALLBACK: Omit<DianeIntent, 'patterns'> = {
  id: 'fallback',
  template:
    'I don\'t have a clean answer for that yet. Try one of: *what\'s the approval rate*, *who carries the highest spend*, *any anomalies*, *what if we tightened the threshold*. The visible filters at the top scope every answer I give.',
  confidence: 'low',
};

/**
 * Score-and-pick the best matching intent for a user query.
 * Uses bag-of-words: each pattern group must contribute at least one
 * matched word for the intent to score; total score = number of
 * matched words across all groups.
 */
export function matchIntent(query: string): DianeIntent | null {
  const words = new Set(
    query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean),
  );
  if (words.size === 0) return null;

  let best: { intent: DianeIntent; score: number } | null = null;
  for (const intent of DIANE_INTENTS) {
    let score = 0;
    let matchedAllGroups = true;
    for (const group of intent.patterns) {
      const groupHits = group.filter((w) => words.has(w)).length;
      if (groupHits === 0) {
        matchedAllGroups = false;
        break;
      }
      score += groupHits;
    }
    if (!matchedAllGroups) continue;
    if (!best || score > best.score) best = { intent, score };
  }
  return best?.intent ?? null;
}

/**
 * Build the canned reply for a query, with token substitution from the
 * current dashboard state. Returns the intent + filled-in body so the
 * UI can focus a chart accordingly.
 */
export function buildResponse(
  query: string,
  ctx: {
    submissions: Submission[];
    audit: AuditEvent[];
    personas: Persona[];
    scenario: ScenarioOverrides;
  },
): {
  intent: Pick<DianeIntent, 'id' | 'focus' | 'confidence'>;
  body: string;
} {
  const matched = matchIntent(query);
  const intent = matched ?? FALLBACK;
  const kpis: DashboardKPIs = computeKPIs(ctx.submissions, ctx.audit, ctx.scenario);
  const kinds = kindBreakdown(ctx.submissions);
  const bus = businessUnitSpend(ctx.submissions);
  const personas = personaActivity(ctx.submissions);

  const personaMap = new Map(ctx.personas.map((p) => [p.id, p]));

  const tokens: Record<string, string> = {
    approvalRate: formatPercent(kpis.approvalRate),
    decisionTime: formatDuration(kpis.avgDecisionMs),
    approvedBudget: formatCurrency(kpis.approvedBudget),
    costAtRisk: formatCurrency(kpis.inFlightCostAtRisk),
    anomalyCount: String(kpis.anomalyCount),
    topKind: kinds[0]
      ? kinds[0].kind.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : '—',
    topKindRate: formatPercent(kinds[0]?.approvalRate ?? null),
    topBU: bus[0]?.businessUnit ?? '—',
    topPerson: personas[0]
      ? personaMap.get(personas[0].personaId)?.displayName ?? personas[0].personaId
      : '—',
  };

  let body = intent.template;
  // Plural helper {{plural:fieldName}} → '' or 's' based on numeric token
  body = body.replace(/\{\{plural:([a-zA-Z]+)\}\}/g, (_, key) => {
    const v = Number(tokens[key]);
    return Number.isFinite(v) && v === 1 ? '' : 's';
  });
  body = body.replace(/\{\{([a-zA-Z]+)\}\}/g, (_, key) => tokens[key] ?? '—');

  return {
    intent: {
      id: intent.id,
      focus: ('focus' in intent ? intent.focus : undefined) as DianeIntent['focus'],
      confidence: intent.confidence,
    },
    body,
  };
}
