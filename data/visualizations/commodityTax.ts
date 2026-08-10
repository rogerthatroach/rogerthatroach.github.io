import { validateVisualizationSpec } from './validateVisualizationSpec';

export interface CommodityTaxFigureBase {
  id: string;
  title: string;
  headingLevel: 2 | 3 | 4;
  caption: string;
  caveat?: string;
}

export interface CommodityTaxStagePair {
  id: string;
  number: string;
  name: string;
  compute: string;
  inspection: string;
}

export interface CommodityTaxOverviewContent extends CommodityTaxFigureBase {
  computeLabel: string;
  inspectionLabel: string;
  stages: readonly CommodityTaxStagePair[];
  analystLabel: string;
  analystDetail: string;
}

export interface CommodityTaxTraceFocus {
  id: string;
  label: string;
  summary: string;
  activeStageIds: readonly string[];
}

export interface CommodityTaxTraceStep {
  id: string;
  number: string;
  record: string;
  relation: string;
  detail: string;
}

export interface CommodityTaxTraceContent extends CommodityTaxFigureBase {
  controlsLabel: string;
  focusOptions: readonly CommodityTaxTraceFocus[];
  pathLabel: string;
  steps: readonly CommodityTaxTraceStep[];
  reviewLabel: string;
  reviewDetail: string;
}

export interface CommodityTaxProcessContrastStep {
  label: string;
  detail: string;
}

export interface CommodityTaxProcessContrastContent extends CommodityTaxFigureBase {
  beforeLabel: string;
  afterLabel: string;
  beforeSteps: readonly CommodityTaxProcessContrastStep[];
  afterSteps: readonly CommodityTaxProcessContrastStep[];
  decisionLabel: string;
  decisionDetail: string;
}

export interface CommodityTaxLoopStep {
  actor: string;
  action: string;
  result: string;
}

export interface CommodityTaxTrustLoopContent extends CommodityTaxFigureBase {
  openingLabel: string;
  steps: readonly CommodityTaxLoopStep[];
  loopLabel: string;
  loopDetail: string;
  closingLabel: string;
  closingDetail: string;
}

export interface CommodityTaxDecision {
  number: string;
  pressure: string;
  choice: string;
  operatingConsequence: string;
}

export interface CommodityTaxDecisionMapContent extends CommodityTaxFigureBase {
  columnLabels: readonly [string, string, string];
  decisions: readonly CommodityTaxDecision[];
  operatingRuleLabel: string;
  operatingRuleDetail: string;
}

export interface CommodityTaxInvestigationStep {
  number: string;
  action: string;
  evidence: string;
}

export interface CommodityTaxInvestigationOutcome {
  condition: string;
  title: string;
  detail: string;
}

export interface CommodityTaxInvestigationContent extends CommodityTaxFigureBase {
  triggerLabel: string;
  triggerDetail: string;
  steps: readonly CommodityTaxInvestigationStep[];
  outcomeLabel: string;
  outcomes: readonly CommodityTaxInvestigationOutcome[];
}

export interface CommodityTaxFormalStage {
  id: string;
  stage: string;
  name: string;
  transform: string;
  computeDetail: string;
  inspection: string;
  inspectionDetail: string;
}

export interface CommodityTaxFormalPipelineContent extends CommodityTaxFigureBase {
  computeLabel: string;
  inspectionLabel: string;
  mobileComputeLabel: string;
  mobileInspectionLabel: string;
  stages: readonly CommodityTaxFormalStage[];
  analystLabel: string;
  analystDetail: string;
  legend: readonly { label: string; detail: string }[];
}

export interface CommodityTaxFormalTraceLevel {
  id: string;
  symbol: string;
  label: string;
  detail: string;
  relation?: string;
}

export interface CommodityTaxFormalTraceContent extends CommodityTaxFigureBase {
  selectionLabel: string;
  selectionDetail: string;
  levels: readonly CommodityTaxFormalTraceLevel[];
  assumptionsLabel: string;
  assumptions: readonly string[];
  boundaryLabel: string;
  boundaryDetail: string;
}

export const COMMODITY_TAX_CASE_INTRO =
  'Read the architecture in two moves: separate deterministic computation from configured inspection, then follow one questioned value toward the records associated with it.';

export const COMMODITY_TAX_CASE_OVERVIEW: CommodityTaxOverviewContent = {
  id: 'commodity-tax-case-overview',
  title: 'Computation moves the return forward; inspection runs beside it',
  headingLevel: 3,
  caption:
    'The five-stage calculation path and its associated inspection surfaces. Tableau supports review of recorded state; it does not perform or certify the calculation.',
  caveat:
    'Inspection availability depends on the configured view, retained records, access scope, and tested joins. A visible path is evidence for investigation, not proof that inputs or rules are correct.',
  computeLabel: 'Deterministic calculation',
  inspectionLabel: 'Configured inspection',
  stages: [
    {
      id: 'extract',
      number: '01',
      name: 'Extract',
      compute: 'Load the in-scope journal records into typed records.',
      inspection: 'Where configured, browse retained source records and extraction evidence.',
    },
    {
      id: 'reconcile',
      number: '02',
      name: 'Reconcile',
      compute: 'Align journal records to the applicable reporting period.',
      inspection: 'Where configured, review recorded reconciliation differences and exceptions.',
    },
    {
      id: 'category-map',
      number: '03',
      name: 'Category map',
      compute: 'Apply the versioned account-to-tax-category mapping.',
      inspection: 'Where configured, inspect the recorded rule association and resulting bucket; rule logic remains governed in code.',
    },
    {
      id: 'aggregate',
      number: '04',
      name: 'Aggregate',
      compute: 'Sum mapped records into the configured category totals.',
      inspection: 'Where configured, review roll-ups and their recorded contributors where lineage is retained.',
    },
    {
      id: 'return',
      number: '05',
      name: 'Return',
      compute: 'Format the calculated values into a candidate return package.',
      inspection: 'Review the candidate output through the relevant configured views; no dedicated return-stage view is asserted.',
    },
  ],
  analystLabel: 'Analyst review remains the operating gate',
  analystDetail:
    'A questioned value can be reconciled against recorded evidence or lead to an approved correction and another reviewed run.',
};

export const COMMODITY_TAX_CASE_TRACE: CommodityTaxTraceContent = {
  id: 'commodity-tax-case-trace',
  title: 'A questioned value can be followed toward its recorded inputs',
  headingLevel: 3,
  caption:
    'Select a review focus to emphasize the relevant portion of the retained path. Every record level remains visible in the useful first frame.',
  caveat:
    'The trace reports recorded ancestry. It cannot recover an edge that was never emitted, validate the source population, or determine whether a business rule is correct.',
  controlsLabel: 'Review focus',
  focusOptions: [
    {
      id: 'return',
      label: 'Question a return value',
      summary: 'Follow the available recorded path from the selected return value toward associated source rows.',
      activeStageIds: ['return', 'aggregate', 'mapping', 'reconciled', 'source'],
    },
    {
      id: 'mapping',
      label: 'Inspect a mapping',
      summary: 'Focus on the recorded category assignment, the reconciled row, and its source identity.',
      activeStageIds: ['mapping', 'reconciled', 'source'],
    },
    {
      id: 'source',
      label: 'Inspect source records',
      summary: 'Focus on the retained General Ledger rows associated with the selected path.',
      activeStageIds: ['source'],
    },
  ],
  pathLabel: 'Recorded path',
  steps: [
    {
      id: 'return',
      number: '01',
      record: 'Selected return value',
      relation: 'formatted from',
      detail: 'The candidate value that triggered the analyst question.',
    },
    {
      id: 'aggregate',
      number: '02',
      record: 'Category aggregate',
      relation: 'summed from',
      detail: 'The recorded roll-up for the selected tax category.',
    },
    {
      id: 'mapping',
      number: '03',
      record: 'Mapped records',
      relation: 'assigned by',
      detail: 'The associated account-to-category mapping and recorded version.',
    },
    {
      id: 'reconciled',
      number: '04',
      record: 'Reconciled records',
      relation: 'aligned from',
      detail: 'The reporting-period records carried into mapping.',
    },
    {
      id: 'source',
      number: '05',
      record: 'Source journal rows',
      relation: 'identified by',
      detail: 'The retained General Ledger records associated with the path.',
    },
  ],
  reviewLabel: 'What happens next',
  reviewDetail:
    'The analyst and delivery team reconcile the recorded derivation or correct an approved input or mapping, then rerun and review the affected output.',
};

export const COMMODITY_TAX_BUILDER_CONTRAST: CommodityTaxProcessContrastContent = {
  id: 'commodity-tax-builder-contrast',
  title: 'The change was not only automation; review moved into the workflow',
  headingLevel: 3,
  caption:
    'A manual, handoff-heavy process became a staged calculation with retained evidence and configured inspection points. Human review remained.',
  beforeLabel: 'Manual cycle',
  afterLabel: 'Governed pipeline',
  beforeSteps: [
    { label: 'Assemble', detail: 'Analysts gather journal data across established handoffs and workpapers.' },
    { label: 'Reconcile', detail: 'Differences and edge cases are resolved through manual comparison.' },
    { label: 'Map', detail: 'Institutional knowledge guides account-to-category decisions.' },
    { label: 'Explain', detail: 'Questions are investigated after a candidate output has been assembled.' },
  ],
  afterSteps: [
    { label: 'Calculate', detail: 'PySpark executes explicit extract, reconcile, map, aggregate, and return stages.' },
    { label: 'Record', detail: 'Stable identifiers and mapping versions retain evidence for configured paths.' },
    { label: 'Inspect', detail: 'Tableau exposes selected stage state through a familiar finance surface.' },
    { label: 'Review', detail: 'Analysts reconcile anomalies, approve corrections, and review subsequent runs.' },
  ],
  decisionLabel: 'Architectural decision',
  decisionDetail: 'Treat Tableau as an inspection surface beside compute, not as the calculator or the proof of correctness.',
};

export const COMMODITY_TAX_BUILDER_LOOP: CommodityTaxTrustLoopContent = {
  id: 'commodity-tax-builder-loop',
  title: 'Review followed a repeatable investigation loop',
  headingLevel: 3,
  caption:
    'The shared surface gave analysts and the delivery team a bounded path from a questioned number to reconciliation, correction, or further investigation.',
  caveat:
    'The loop supports review; it does not guarantee that every anomaly is explainable or that every retained path is complete.',
  openingLabel: 'An analyst questions a number',
  steps: [
    { actor: 'Analyst', action: 'Inspect', result: 'Open the configured view for the relevant pipeline stage.' },
    { actor: 'Analyst + delivery team', action: 'Trace', result: 'Follow available lineage toward mappings and associated journal rows.' },
    { actor: 'Joint review', action: 'Reconcile or correct', result: 'Reconcile the recorded derivation with available evidence or identify an approved source or mapping correction.' },
    { actor: 'Pipeline', action: 'Rerun', result: 'Recompute the affected stages with the governed inputs, rules, and code version.' },
    { actor: 'Analyst', action: 'Review again', result: 'Compare the new output and continue accountable review.' },
  ],
  loopLabel: 'If the question remains unresolved',
  loopDetail: 'Return to the relevant configured view and repeat the investigation with the new evidence.',
  closingLabel: 'The human owns the acceptance decision',
  closingDetail: 'Inspection makes disagreement local and discussable; accountable review determines what proceeds.',
};

export const COMMODITY_TAX_PRACTITIONER_DECISIONS: CommodityTaxDecisionMapContent = {
  id: 'commodity-tax-practitioner-decisions',
  title: 'Four operating pressures shaped the delivery architecture',
  headingLevel: 2,
  caption:
    'The practitioner view connects each pressure to a design choice and the operating responsibility that remained after the choice.',
  columnLabels: ['Operating pressure', 'Architecture choice', 'Responsibility retained'],
  decisions: [
    {
      number: '01',
      pressure: 'The workflow required repeatable General Ledger extraction and transformation on the sanctioned data platform.',
      choice: 'PySpark stages on the sanctioned CDP platform.',
      operatingConsequence: 'Distributed execution fit the scale, while development, scheduling, and platform operation still required discipline.',
    },
    {
      number: '02',
      pressure: 'A final output alone would not support efficient investigation of reviewer questions.',
      choice: 'Configured Tableau inspection surfaces beside the calculation path.',
      operatingConsequence: 'Review became more direct, but dashboard joins, semantics, permissions, and performance needed their own testing.',
    },
    {
      number: '03',
      pressure: 'Account-to-category knowledge had to become explicit and changeable under review.',
      choice: 'Versioned mapping rules in the governed pipeline.',
      operatingConsequence: 'Changes gained a review trail, while code-owned rules remained a coordination bottleneck.',
    },
    {
      number: '04',
      pressure: 'Finance users already had established review tools and a low tolerance for unfamiliar black boxes.',
      choice: 'Use the familiar Tableau surface and introduce automation incrementally.',
      operatingConsequence: 'The design reused a familiar review surface, while analyst reconciliation and accountable sign-off stayed in the operating model.',
    },
  ],
  operatingRuleLabel: 'Operating rule',
  operatingRuleDetail: 'The pipeline calculates; the inspection layer exposes recorded evidence; the analyst decides whether the result is acceptable.',
};

export const COMMODITY_TAX_PRACTITIONER_INVESTIGATION: CommodityTaxInvestigationContent = {
  id: 'commodity-tax-practitioner-investigation',
  title: 'A questioned aggregate becomes a bounded operating decision',
  headingLevel: 3,
  caption:
    'The investigation separates evidence gathering from the decision to reconcile, correct, rerun, and accept.',
  caveat:
    'A missing, stale, duplicated, or incorrectly associated lineage record can mislead the investigation and is an evidence defect requiring investigation.',
  triggerLabel: 'Trigger',
  triggerDetail: 'A reviewer flags an aggregate that does not match domain expectations.',
  steps: [
    { number: '01', action: 'Locate the relevant view', evidence: 'Configured return, aggregate, reconciliation, or mapping state.' },
    { number: '02', action: 'Follow the recorded relation', evidence: 'Available identifiers, mapping version, and associated source rows.' },
    { number: '03', action: 'Compare against expectations', evidence: 'Approved rule interpretation, source population, and reconciliation evidence.' },
  ],
  outcomeLabel: 'Review outcome',
  outcomes: [
    {
      condition: 'Recorded derivation is expected',
      title: 'Reconcile and document',
      detail: 'Retain the explanation and continue the review process.',
    },
    {
      condition: 'A source, rule, or lineage defect is found',
      title: 'Correct, rerun, review',
      detail: 'Apply the authorized correction, recompute affected stages, and review the new output.',
    },
    {
      condition: 'Evidence is missing or inconsistent',
      title: 'Pause and investigate',
      detail: 'Do not infer the path; resolve the evidence gap before accepting or correcting the output.',
    },
  ],
};

export const COMMODITY_TAX_FORMAL_PIPELINE: CommodityTaxFormalPipelineContent = {
  id: 'commodity-tax-formal-pipeline',
  title: 'Five ordered stages calculate the return; configured views support inspection',
  headingLevel: 4,
  caption:
    'Figure 1. Solid relations form the calculation path. Dotted links identify configured views over recorded stage evidence; they do not form a second calculation path.',
  caveat:
    'A view may be unconfigured, unavailable to the reviewer, or incomplete because an underlying record or association is missing or incorrect.',
  computeLabel: 'Calculation · five ordered stages',
  inspectionLabel: 'Inspection · configured views over recorded evidence',
  mobileComputeLabel: 'Calculation stage',
  mobileInspectionLabel: 'Available inspection',
  stages: [
    {
      id: 's1',
      stage: '01',
      name: 'Extract',
      transform: 'Raw journals → typed records',
      computeDetail: 'Load in-scope journal rows into typed records.',
      inspection: 'Where configured',
      inspectionDetail: 'Where configured: source-record inspection.',
    },
    {
      id: 's2',
      stage: '02',
      name: 'Reconcile',
      transform: 'Typed records → reconciled records',
      computeDetail: 'Align rows to the reporting boundary.',
      inspection: 'Where configured',
      inspectionDetail: 'Where configured: reconciliation-difference inspection.',
    },
    {
      id: 's3',
      stage: '03',
      name: 'Category map',
      transform: 'Reconciled records → mapped records',
      computeDetail: 'Apply the versioned category rule lookup.',
      inspection: 'Where configured',
      inspectionDetail: 'Where configured: mapping-association inspection.',
    },
    {
      id: 's4',
      stage: '04',
      name: 'Aggregate',
      transform: 'Mapped records → category totals',
      computeDetail: 'Sum mapped records by category.',
      inspection: 'Where configured',
      inspectionDetail: 'Where configured: roll-up and contributor inspection.',
    },
    {
      id: 's5',
      stage: '05',
      name: 'Return',
      transform: 'Category totals → return candidate',
      computeDetail: 'Format category values into the return shape.',
      inspection: 'Analyst review',
      inspectionDetail: 'Review the candidate output with the relevant configured views; no dedicated view is assumed for this stage.',
    },
  ],
  analystLabel: 'Authorized reviewer',
  analystDetail: 'Uses configured views to inspect evidence and retains responsibility for reconciliation and acceptance.',
  legend: [
    { label: 'Solid', detail: 'typed calculation or recorded derivation relation' },
    { label: 'Dotted', detail: 'read-only configured presentation of graph state' },
    { label: 'Heavy rule', detail: 'human review boundary' },
  ],
};

export const COMMODITY_TAX_FORMAL_TRACE: CommodityTaxFormalTraceContent = {
  id: 'commodity-tax-formal-trace',
  title: 'Recorded ancestry expands a selected output toward associated source rows',
  headingLevel: 4,
  caption:
    'Figure 2. A selected return value is traced backward through the recorded links that connect it to aggregates, mappings, reconciliations, and source records.',
  caveat:
    'The trace explains the available recorded path. It does not prove that the path is complete or correct; the conditions below still require testing.',
  selectionLabel: 'Starting point',
  selectionDetail: 'One questioned return value',
  levels: [
    {
      id: 'return',
      symbol: 'Selected output',
      label: 'Return value',
      detail: 'The output node selected for inspection.',
      relation: 'Formatted from the category total',
    },
    {
      id: 'aggregate',
      symbol: 'Recorded parent',
      label: 'Aggregate',
      detail: 'The recorded category total contributing to the output.',
      relation: 'Summed from mapped records',
    },
    {
      id: 'mapped',
      symbol: 'Recorded contributors',
      label: 'Mapped records',
      detail: 'The recorded rows and rule versions contributing to the aggregate.',
      relation: 'Mapped from reconciled records',
    },
    {
      id: 'reconciled',
      symbol: 'Recorded predecessors',
      label: 'Reconciled records',
      detail: 'The period-aligned rows associated with the mapping stage.',
      relation: 'Aligned and typed from source records',
    },
    {
      id: 'source',
      symbol: 'Available source evidence',
      label: 'Source rows',
      detail: 'The retained General Ledger records at the end of the backward traversal.',
    },
  ],
  assumptionsLabel: 'Conditions to test',
  assumptions: [
    'Parent links are retained for every transformation the trace is expected to explain.',
    'Each link points to the correct parent and rule version.',
    'Record and join identities remain stable across retained stages.',
    'Every included aggregate term appears among the recorded contributors.',
    'The inspection query applies the intended semantics and authorization filters.',
  ],
  boundaryLabel: 'Interpretation boundary',
  boundaryDetail: 'The traversal explains what the system recorded as contributing; it does not establish source completeness, business-rule correctness, or control effectiveness.',
};

[
  COMMODITY_TAX_CASE_OVERVIEW,
  COMMODITY_TAX_BUILDER_CONTRAST,
  COMMODITY_TAX_BUILDER_LOOP,
  COMMODITY_TAX_PRACTITIONER_DECISIONS,
  COMMODITY_TAX_PRACTITIONER_INVESTIGATION,
  COMMODITY_TAX_FORMAL_PIPELINE,
  COMMODITY_TAX_FORMAL_TRACE,
].forEach((spec) => validateVisualizationSpec(spec));

validateVisualizationSpec(COMMODITY_TAX_CASE_TRACE, {
  relationships: COMMODITY_TAX_CASE_TRACE.focusOptions.map((focus) => ({
    name: `focusOptions[id=${focus.id}].activeStageIds`,
    referencedIds: focus.activeStageIds,
    targetIds: COMMODITY_TAX_CASE_TRACE.steps.map((step) => step.id),
  })),
});
