/**
 * Project PAR — section + field schema.
 *
 * Mirrors the public PAR Assist Phase 1 form structure (11 sections,
 * 3-state status pills) so stakeholders watching the White Lodge demo
 * recognize the same form shape they already know. White Lodge re-skins
 * the surface; the section + field taxonomy stays PAR-faithful.
 *
 * Each field has a `key`, `label`, `kind`, optional `help`, optional
 * `maxLength`, and an optional `dianeFillable` flag (true for fields
 * Diane can populate from uploaded source material; false for fields
 * the user must complete themselves like Sponsor Delegate).
 */

export type FieldKind = 'text' | 'longtext' | 'select' | 'number' | 'date' | 'boolean';

export interface FieldSpec {
  key: string;
  label: string;
  kind: FieldKind;
  help?: string;
  maxLength?: number;
  required?: boolean;
  /** Whether Diane attempts to fill this field from uploaded source material. */
  dianeFillable?: boolean;
  /** Options for select fields. */
  options?: string[];
  /** Placeholder for empty fields (matches PAR's `SPONSOR_DELEGATE` style). */
  placeholder?: string;
}

export interface SectionSpec {
  id: string;
  title: string;
  description?: string;
  fields: FieldSpec[];
  /** True for sections that compute against Financial tab. */
  financial?: boolean;
}

export const PAR_SECTIONS: SectionSpec[] = [
  {
    id: 'headers',
    title: 'Headers Information',
    description:
      'Core metadata that identifies the initiative, its sponsors, and organizational context. This information is essential for Project Approval Request (PAR) tracking and governance.',
    fields: [
      { key: 'request_title', label: 'Request Title', kind: 'text', required: true, maxLength: 400, dianeFillable: true },
      {
        key: 'request_category',
        label: 'Request Category',
        kind: 'select',
        required: true,
        dianeFillable: true,
        options: ['Project Expenditure', 'Operational Expenditure', 'Capital Expenditure', 'Cost Recovery'],
      },
      {
        key: 'sponsor_segment',
        label: 'Sponsor Segment',
        kind: 'select',
        required: true,
        dianeFillable: true,
        options: ['Personal & Commercial Banking', 'Wealth Management', 'Capital Markets', 'Insurance', 'Global Functions'],
      },
      {
        key: 'sponsor_unit',
        label: 'Sponsor Unit',
        kind: 'select',
        required: true,
        dianeFillable: true,
        options: ['GF - Finance', 'GF - Risk', 'GF - Technology', 'P&CB - Sales', 'WM - Operations', 'CM - Trading'],
      },
      {
        key: 'classification',
        label: 'Classification',
        kind: 'select',
        required: true,
        dianeFillable: true,
        options: ['Technology', 'Process', 'People', 'Regulatory', 'Strategy'],
      },
      { key: 'executive_sponsor', label: 'Executive Sponsor', kind: 'text', required: true, maxLength: 400, dianeFillable: false },
      { key: 'sponsor_delegate', label: 'Sponsor Delegate', kind: 'text', required: true, maxLength: 400, dianeFillable: false, placeholder: 'SPONSOR_DELEGATE' },
      { key: 'par_contact', label: 'PAR Contact', kind: 'text', maxLength: 400, dianeFillable: true },
      { key: 'eds_contact', label: 'EDS Contact', kind: 'text', maxLength: 400, dianeFillable: false },
      {
        key: 'initiative_type',
        label: 'Initiative Type',
        kind: 'select',
        dianeFillable: true,
        options: ['Run-the-Bank', 'Change-the-Bank', 'Regulatory'],
      },
    ],
  },
  {
    id: 'executive_summary',
    title: 'Executive Summary',
    description: 'Opening statement and overview that frame the request for senior reviewers. One paragraph each.',
    fields: [
      { key: 'opening_statement', label: 'Opening Statement', kind: 'longtext', required: true, maxLength: 2000, dianeFillable: true },
      { key: 'overview', label: 'Overview', kind: 'longtext', required: true, maxLength: 4000, dianeFillable: true },
    ],
  },
  {
    id: 'request_description',
    title: 'Request Description',
    description: 'Full prose description of what is being requested, the scope, and the boundaries.',
    fields: [
      { key: 'description', label: 'Description', kind: 'longtext', required: true, maxLength: 6000, dianeFillable: true },
      { key: 'scope_in', label: 'In Scope', kind: 'longtext', maxLength: 3000, dianeFillable: true },
      { key: 'scope_out', label: 'Out of Scope', kind: 'longtext', maxLength: 3000, dianeFillable: true },
    ],
  },
  {
    id: 'benefits',
    title: 'Benefits / Success Metrics',
    description: 'Quantified benefits, KPIs, and the criteria by which success will be evaluated.',
    fields: [
      { key: 'benefits_qualitative', label: 'Qualitative Benefits', kind: 'longtext', required: true, maxLength: 3000, dianeFillable: true },
      { key: 'benefits_quantitative', label: 'Quantitative Benefits (CAD K)', kind: 'longtext', maxLength: 3000, dianeFillable: true },
      { key: 'success_metrics', label: 'Success Metrics & KPIs', kind: 'longtext', required: true, maxLength: 3000, dianeFillable: true },
    ],
  },
  {
    id: 'analysis_of_alternatives',
    title: 'Analysis of Alternatives',
    description: 'Options considered, comparison criteria, and rationale for the recommended path.',
    fields: [
      { key: 'options_considered', label: 'Options Considered', kind: 'longtext', required: true, maxLength: 4000, dianeFillable: true },
      { key: 'recommended_option', label: 'Recommended Option', kind: 'longtext', required: true, maxLength: 3000, dianeFillable: true },
      { key: 'rationale', label: 'Rationale', kind: 'longtext', required: true, maxLength: 3000, dianeFillable: true },
    ],
  },
  {
    id: 'enterprise_strategies',
    title: 'Enterprise Level Strategies',
    description: 'Alignment to RBC enterprise priorities — digital transformation, exceptional client experience, operational excellence, profitable growth.',
    fields: [
      { key: 'strategic_alignment', label: 'Strategic Alignment', kind: 'longtext', required: true, maxLength: 3000, dianeFillable: true },
      { key: 'enterprise_priority', label: 'Enterprise Priority', kind: 'select', options: ['Digital Transformation', 'Client Experience', 'Operational Excellence', 'Profitable Growth'], dianeFillable: true },
    ],
  },
  {
    id: 'segment_strategies',
    title: 'Segment Level Strategies',
    description: 'Alignment to the sponsoring business segment\'s own strategy and roadmap.',
    fields: [
      { key: 'segment_alignment', label: 'Segment Alignment', kind: 'longtext', maxLength: 3000, dianeFillable: true },
      { key: 'segment_dependencies', label: 'Segment Dependencies', kind: 'longtext', maxLength: 3000, dianeFillable: true },
    ],
  },
  {
    id: 'impact_on_plan',
    title: 'Impact on Plan',
    description: 'Whether this initiative is in the current business unit plan, and what plan adjustments are required if not.',
    fields: [
      { key: 'in_plan', label: 'In Plan?', kind: 'select', required: true, options: ['Yes', 'No', 'Partial'], dianeFillable: false },
      { key: 'plan_adjustment', label: 'Plan Adjustment Required', kind: 'longtext', maxLength: 3000, dianeFillable: true },
    ],
  },
  {
    id: 'financial_summary',
    title: 'Financial Summary (CAD Thousands)',
    description: 'Total expenditure, breakdown by year, and funding source. All amounts in CAD thousands.',
    financial: true,
    fields: [
      { key: 'total_expenditure', label: 'Total Expenditure (CAD K)', kind: 'number', required: true, dianeFillable: true },
      { key: 'expenditure_y1', label: 'Year 1 Expenditure (CAD K)', kind: 'number', dianeFillable: true },
      { key: 'expenditure_y2', label: 'Year 2 Expenditure (CAD K)', kind: 'number', dianeFillable: true },
      { key: 'funding_source', label: 'Funding Source', kind: 'select', options: ['Operating Budget', 'Capital Budget', 'Strategic Initiatives Fund', 'Cross-charge'], dianeFillable: true },
    ],
  },
  {
    id: 'cost_recovery',
    title: 'Cost Recovery',
    description: 'Which segments will recover costs, and the allocation method.',
    financial: true,
    fields: [
      { key: 'recovery_segments', label: 'Recovery Segments', kind: 'longtext', maxLength: 2000, dianeFillable: true },
      { key: 'allocation_method', label: 'Allocation Method', kind: 'select', options: ['Pro-rata by revenue', 'Pro-rata by FTE', 'Direct attribution', 'Hybrid'], dianeFillable: true },
    ],
  },
  {
    id: 'execution_risks',
    title: 'Execution Risks',
    description: 'Risks to successful execution, with inherent severity, residual severity after mitigation, and mitigation actions described.',
    fields: [
      { key: 'risks_summary', label: 'Risks Summary', kind: 'longtext', required: true, maxLength: 4000, dianeFillable: true },
      { key: 'mitigation_actions', label: 'Mitigation Actions', kind: 'longtext', required: true, maxLength: 4000, dianeFillable: true },
    ],
  },
];

// ── Status calculation ──────────────────────────────────────────────

export type SectionStatus = 'not_started' | 'in_progress' | 'completed';

export const SECTION_STATUS_LABEL: Record<SectionStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export const SECTION_STATUS_COLOR: Record<SectionStatus, string> = {
  not_started: 'var(--text-tertiary)',
  in_progress: 'var(--themis-in-review)',
  completed: 'var(--themis-approved)',
};

/**
 * Compute status of a section: completed when all required fields have
 * non-empty values; in_progress when ≥1 field is filled; not_started
 * when nothing is filled.
 */
export function sectionStatus(
  section: SectionSpec,
  values: Record<string, unknown>,
): SectionStatus {
  const filled = section.fields.filter((f) => isFieldFilled(values[f.key])).length;
  if (filled === 0) return 'not_started';
  const allRequiredFilled = section.fields
    .filter((f) => f.required)
    .every((f) => isFieldFilled(values[f.key]));
  if (allRequiredFilled && filled === section.fields.length) return 'completed';
  if (allRequiredFilled) return 'completed';
  return 'in_progress';
}

export function isFieldFilled(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !Number.isNaN(value);
  if (typeof value === 'boolean') return true;
  return false;
}

export function overallCoverage(values: Record<string, unknown>): number {
  let total = 0;
  let filled = 0;
  for (const section of PAR_SECTIONS) {
    for (const field of section.fields) {
      total += 1;
      if (isFieldFilled(values[field.key])) filled += 1;
    }
  }
  return total === 0 ? 0 : filled / total;
}

export function nextHighPriorityFields(
  values: Record<string, unknown>,
  count: number = 4,
): Array<{ section: SectionSpec; field: FieldSpec }> {
  const out: Array<{ section: SectionSpec; field: FieldSpec }> = [];
  for (const section of PAR_SECTIONS) {
    for (const field of section.fields) {
      if (!field.required) continue;
      if (isFieldFilled(values[field.key])) continue;
      out.push({ section, field });
      if (out.length >= count) return out;
    }
  }
  return out;
}

// ── Seeded sample draft ─────────────────────────────────────────────

/**
 * The "Sales CRM Modernization" sample draft, mirroring the screenshots
 * exactly. Lets stakeholders see the demo in a "78% Completed" state on
 * first land — same as PAR Phase 1 reference images.
 */
export const SAMPLE_PAR_VALUES: Record<string, string | number> = {
  request_title: 'Sales CRM Modernization',
  request_category: 'Project Expenditure',
  sponsor_segment: 'Global Functions',
  sponsor_unit: 'GF - Finance',
  classification: 'Technology',
  executive_sponsor: 'John Smith, VP of Sales',
  par_contact: 'Sarah Johnson',
  initiative_type: 'Change-the-Bank',
  opening_statement:
    'Sales team requests an expenditure amount of CAD $2.0 million to implement a new Salesforce CRM system to replace the current outdated spreadsheet-based sales tracking system. The enhanced platform will provide better pipeline visibility, automated reporting, and improved collaboration across the sales team.',
  overview:
    'The current sales tracking system relies on multiple Excel spreadsheets to track customer interactions, deals, and pipeline. This creates several issues including no single source of truth, manual data entry errors, difficulty generating reports, poor pipeline visibility for management, and lost sales opportunities due to lack of follow-up tracking. The new Salesforce Sales Cloud platform will address these challenges by providing contact and account management, opportunity tracking, sales forecasting, custom dashboards and reports, mobile access for field sales reps, and integration with existing marketing automation.',
  description:
    'Implementation of Salesforce Sales Cloud across the RBC sales organization, replacing legacy spreadsheet-based tracking. Includes data migration, integration with existing marketing automation tools, custom dashboard development, mobile access provisioning, and full user training across all sales tiers.',
  benefits_qualitative:
    'Single source of truth for customer data, improved cross-team collaboration, better forecasting confidence, reduced manual reporting overhead, faster onboarding for new sales hires.',
  success_metrics:
    '25% increase in sales productivity (measured via deals-per-rep). 15% improvement in win rate (Q1 vs Q3 cohort comparison). Forecast accuracy within ±5% (vs current ±20%). 80% reduction in manual data entry hours (timesheet-based measurement).',
  options_considered:
    'Option 1: Salesforce Sales Cloud (recommended). Option 2: Microsoft Dynamics 365. Option 3: HubSpot CRM. Option 4: Build in-house on existing data platform.',
  recommended_option: 'Salesforce Sales Cloud — best fit for our integration footprint with existing marketing automation.',
  rationale:
    'Salesforce ecosystem already integrated with Marketo (marketing automation), Slack (collaboration), and our data warehouse. Vendor familiarity reduces training cost. Best-in-class mobile experience for field sales. Cost is mid-range across options but TCO is lowest after factoring integration savings.',
  strategic_alignment:
    'Maps to RBC\'s "Exceptional Client Experience" enterprise priority by enabling sales reps to maintain richer client context. Maps to "Digital Transformation" priority by replacing manual workflow with platform-based automation. Maps to "Operational Excellence" via measurable productivity gains.',
  enterprise_priority: 'Digital Transformation',
  segment_alignment:
    'Aligns with Global Functions Finance roadmap to consolidate sales reporting across business units onto a single platform.',
  total_expenditure: 2000,
  expenditure_y1: 1400,
  expenditure_y2: 600,
  funding_source: 'Capital Budget',
  risks_summary:
    'Risk 1: Data migration quality (inherent severity: High). Risk 2: User adoption (inherent severity: Medium). Risk 3: Vendor dependency lock-in (inherent severity: Low). Residual severities post-mitigation: High → Medium, Medium → Low, Low → Low.',
  mitigation_actions:
    'Risk 1 mitigation: Two-phase migration with sandbox validation, dedicated data quality engineer, automated reconciliation reports. Risk 2 mitigation: Sales-led champions program, tiered training, gamified adoption metrics. Risk 3 mitigation: Annual contract terms with renegotiation triggers, data export capability built in.',
  // Sponsor Delegate, EDS Contact, scope_in, scope_out, benefits_quantitative,
  // segment_dependencies, in_plan, plan_adjustment, recovery_segments,
  // allocation_method are intentionally left blank → renders as "outstanding"
  // and lands the form near "78% Completed" matching PAR Phase 1 screenshots.
};

// ── Policies + Guidelines (the Policies modal contents) ─────────────

export interface PolicyEntry {
  title: string;
  body: string;
}

export const PAR_POLICIES: PolicyEntry[] = [
  {
    title: 'Finance Department Review',
    body: 'All financial data and projections must be reviewed and validated by the Finance department before submission.',
  },
  {
    title: 'Budget Approval Thresholds',
    body: 'Project PAR required for Budgets over ≥ $1M.',
  },
  {
    title: 'PAR in Default Case',
    body: 'Make sure to get PAR approved before you spend lesser of: 35% of total expenditure, OR $1 million.',
  },
];

export const PAR_GUIDELINES: PolicyEntry[] = [
  {
    title: 'Risks Description',
    body: 'For each risk, determine severity before mitigation strategies / actions (the inherent risk) as well as its severity after mitigating strategies / actions (the residual risk). Describe the actions that will mitigate the risk.',
  },
  {
    title: 'Strategic Alignment',
    body: 'Articulate how the initiative supports one or more enterprise priorities: digital transformation, exceptional client experience, operational excellence, profitable growth. Cite specific roadmap commitments where applicable.',
  },
  {
    title: 'Cost Recovery',
    body: 'Where the initiative\'s benefits accrue across multiple segments, document which segments will absorb cost and the allocation method (pro-rata, direct, hybrid). Sign-off from each receiving segment must be referenced.',
  },
];
