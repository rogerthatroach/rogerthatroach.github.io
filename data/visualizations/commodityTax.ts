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
  'The overview groups the larger scenario into five stages, with calculation and inspection shown side by side.';

export const COMMODITY_TAX_CASE_OVERVIEW: CommodityTaxOverviewContent = {
  id: 'commodity-tax-case-overview',
  title: 'Calculate, save, and inspect at each stage',
  headingLevel: 3,
  caption: 'Five conceptual stages within a larger Dataiku scenario. Every input and intermediate output is saved; multiple Excel reports and dynamic Tableau dashboards support audit and debugging at each stage.',
  caveat: 'Saved inputs and outputs make the work available for inspection. Source completeness and calculation correctness still require review.',
  computeLabel: 'Python and Spark calculation',
  inspectionLabel: 'Excel reports and dashboards',
  stages: [
    { id: 'extract', number: '01', name: 'Extract', compute: 'Retrieve the General Ledger data in scope.', inspection: 'Inspect saved inputs and extraction outputs for the run.' },
    { id: 'reconcile', number: '02', name: 'Reconcile', compute: 'Compare and reconcile contributing data.', inspection: 'Examine reconciliation results and differences.' },
    { id: 'category-map', number: '03', name: 'Category map', compute: 'Apply the tax-category mappings.', inspection: 'Compare mapping inputs and resulting categories.' },
    { id: 'aggregate', number: '04', name: 'Aggregate', compute: 'Combine mapped values into required totals.', inspection: 'Examine totals alongside the saved mapped data.' },
    { id: 'return', number: '05', name: 'Return', compute: 'Prepare the reporting output.', inspection: 'Review the result with reports, dashboards, and saved stage data.' },
  ],
  analystLabel: 'Start with the run date and time',
  analystDetail: 'Retrieve the corresponding folder or data partition, identify the stage, and compare its saved inputs and outputs.',
};

export const COMMODITY_TAX_CASE_TRACE: CommodityTaxTraceContent = {
  id: 'commodity-tax-case-trace',
  title: 'Investigate a value through the saved work of its run',
  headingLevel: 3,
  caption: 'Select a review focus to highlight the stages to examine through the saved datasets for one run.',
  caveat: 'Use the same run throughout the comparison. Queries and code inspection may still be needed to explain a value.',
  controlsLabel: 'Review focus',
  focusOptions: [
    { id: 'return', label: 'Question a return value', summary: 'Start with the run that produced the return and examine earlier stage outputs as needed.', activeStageIds: ['return', 'aggregate', 'mapping', 'reconciled', 'source'] },
    { id: 'mapping', label: 'Inspect a mapping', summary: 'Compare saved mapping inputs and outputs with the relevant code and source data.', activeStageIds: ['mapping', 'reconciled', 'source'] },
    { id: 'source', label: 'Inspect source records', summary: 'Retrieve the original inputs saved for the selected run.', activeStageIds: ['source'] },
  ],
  pathLabel: 'Stages to examine in the same run',
  steps: [
    { id: 'return', number: '01', record: 'Questioned return value', relation: 'compare with', detail: 'Identify the run and open its relevant report or dashboard.' },
    { id: 'aggregate', number: '02', record: 'Saved totals', relation: 'compare with', detail: 'Retrieve the aggregation output for that run.' },
    { id: 'mapping', number: '03', record: 'Saved mapped data', relation: 'compare with', detail: 'Examine the mapped values used by the calculation.' },
    { id: 'reconciled', number: '04', record: 'Saved reconciliation', relation: 'compare with', detail: 'Inspect the intermediate data entering the mapping stage.' },
    { id: 'source', number: '05', record: 'Saved inputs', relation: 'inspect', detail: 'Open the original General Ledger inputs for the run.' },
  ],
  reviewLabel: 'Review the discrepancy',
  reviewDetail: 'Finance and engineering examine the source, rule, or implementation involved, review any correction, and check the subsequent output.',
};

export const COMMODITY_TAX_BUILDER_CONTRAST: CommodityTaxProcessContrastContent = {
  id: 'commodity-tax-builder-contrast',
  title: 'The automated workflow retains the work of every run',
  headingLevel: 3,
  caption: 'Dataiku coordinates Python and Spark processing. Run-date/time folders and partitions retain every input and intermediate output; reports and dashboards expose stage results.',
  beforeLabel: 'Manual cycle',
  afterLabel: 'Automated workflow',
  beforeSteps: [
    { label: 'Assemble', detail: 'Gather journal data across handoffs and workpapers.' },
    { label: 'Reconcile', detail: 'Resolve differences through manual comparison.' },
    { label: 'Map', detail: 'Apply the account-to-category rules.' },
    { label: 'Prepare', detail: 'Assemble totals and the return for review.' },
  ],
  afterSteps: [
    { label: 'Calculate', detail: 'Run the Dataiku scenario containing Python and Spark code.' },
    { label: 'Save', detail: 'Retain each input and intermediate in run-date/time folders and partitions.' },
    { label: 'Inspect', detail: 'Use multiple Excel reports and dynamic Tableau dashboards at every stage.' },
    { label: 'Investigate', detail: 'Retrieve the relevant run data to audit or debug a result.' },
  ],
  decisionLabel: 'Run organization',
  decisionDetail: 'Locate the run by date and time, then retrieve its stage data through saved files or partitioned datasets.',
};

export const COMMODITY_TAX_BUILDER_LOOP: CommodityTaxTrustLoopContent = {
  id: 'commodity-tax-builder-loop',
  title: 'A questioned number leads back to the run data',
  headingLevel: 3,
  caption: 'Stage reports, dynamic dashboards, and retained datasets give finance and engineering complementary ways to examine a discrepancy.',
  openingLabel: 'A reviewer questions a number',
  steps: [
    { actor: 'Reviewer', action: 'Identify the run', result: 'Select the date and time that produced the result.' },
    { actor: 'Reviewer + delivery team', action: 'Inspect', result: 'Open the stage reports or dashboard and retrieve saved inputs and outputs.' },
    { actor: 'Joint review', action: 'Compare', result: 'Examine the data and transformation; move to earlier stages if needed.' },
    { actor: 'Responsible team', action: 'Correct and run', result: 'Review the source, mapping, or code correction and execute the calculation.' },
    { actor: 'Reviewer', action: 'Check again', result: 'Review the resulting output against the original question.' },
  ],
  loopLabel: 'If the question remains unresolved',
  loopDetail: 'Continue investigation with the relevant saved stage data.',
  closingLabel: 'Review remains necessary',
  closingDetail: 'Retained data makes inspection possible; the team still has to determine what caused the discrepancy.',
};

export const COMMODITY_TAX_FORMAL_PIPELINE: CommodityTaxFormalPipelineContent = {
  id: 'commodity-tax-formal-pipeline',
  title: 'Five conceptual stages within the Dataiku scenario',
  headingLevel: 4,
  caption: 'Figure 1. The calculation progresses through the stages. At each stage, saved data, multiple Excel reports, and dynamic Tableau dashboards support audit and debugging.',
  computeLabel: 'Calculation · Python and Spark',
  inspectionLabel: 'Inspection · saved data, Excel reports, dashboards',
  mobileComputeLabel: 'Calculation stage',
  mobileInspectionLabel: 'Audit and debugging',
  stages: [
    { id: 's1', stage: '01', name: 'Extract', transform: 'Source journals → extracted data', computeDetail: 'Retrieve the data in scope.', inspection: 'Saved input and output', inspectionDetail: 'Examine extraction reports, dashboards, and saved files.' },
    { id: 's2', stage: '02', name: 'Reconcile', transform: 'Extracted data → reconciled data', computeDetail: 'Compare and reconcile contributing data.', inspection: 'Saved input and output', inspectionDetail: 'Examine reconciliation reports, dashboards, and intermediates.' },
    { id: 's3', stage: '03', name: 'Category map', transform: 'Reconciled data → mapped data', computeDetail: 'Apply the tax-category mappings.', inspection: 'Saved input and output', inspectionDetail: 'Compare mapping inputs and outputs with stage reports and dashboards.' },
    { id: 's4', stage: '04', name: 'Aggregate', transform: 'Mapped data → totals', computeDetail: 'Calculate the required totals.', inspection: 'Saved input and output', inspectionDetail: 'Examine totals with aggregation reports, dashboards, and mapped data.' },
    { id: 's5', stage: '05', name: 'Return', transform: 'Totals → reporting output', computeDetail: 'Prepare the return.', inspection: 'Saved input and output', inspectionDetail: 'Inspect the result through reports, dashboards, and the run data.' },
  ],
  analystLabel: 'Run date and time',
  analystDetail: 'Folders and corresponding data partitions organize the retained inputs and intermediates for retrieval.',
  legend: [
    { label: 'Solid', detail: 'forward calculation sequence' },
    { label: 'Dotted', detail: 'stage results available for inspection' },
    { label: 'Heavy rule', detail: 'run selection for review' },
  ],
};

export const COMMODITY_TAX_FORMAL_TRACE: CommodityTaxFormalTraceContent = {
  id: 'commodity-tax-formal-trace',
  title: 'Work backward through the saved data for one run',
  headingLevel: 4,
  caption: 'Figure 2. A reviewer compares saved stage outputs to investigate a questioned value. This is an investigation sequence, not an automatic record-lineage graph.',
  selectionLabel: 'Starting point',
  selectionDetail: 'Questioned value + run date and time',
  levels: [
    { id: 'return', symbol: 'Inspect the result', label: 'Return', detail: 'Open the relevant report or dashboard for the run.', relation: 'Compare with saved totals' },
    { id: 'aggregate', symbol: 'Inspect the totals', label: 'Aggregate', detail: 'Retrieve the saved aggregation output.', relation: 'Compare with mapped values' },
    { id: 'mapped', symbol: 'Inspect the categories', label: 'Mapped data', detail: 'Retrieve the saved input and output of the mapping stage.', relation: 'Examine the mapping calculation' },
    { id: 'reconciled', symbol: 'Inspect reconciliation', label: 'Reconciled data', detail: 'Compare saved reconciliation inputs and results.', relation: 'Compare with original inputs' },
    { id: 'source', symbol: 'Inspect the input', label: 'Source data', detail: 'Open the original inputs saved for the run.' },
  ],
  assumptionsLabel: 'Checks during investigation',
  assumptions: [
    'Select the intended run date and time.',
    'Use the matching stage folders or partitions.',
    'Check which run the report or dashboard represents.',
    'Compare the relevant filters and aggregation rules.',
    'Examine the code when saved results alone do not explain the difference.',
  ],
  boundaryLabel: 'What retention provides',
  boundaryDetail: 'The inputs and intermediate work remain available to examine. Their presence does not establish source completeness or correct business rules.',
};

[
  COMMODITY_TAX_CASE_OVERVIEW,
  COMMODITY_TAX_BUILDER_CONTRAST,
  COMMODITY_TAX_BUILDER_LOOP,
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
