import { validateVisualizationSpec } from './validateVisualizationSpec';

export interface AegisFigureBase {
  id: string;
  title: string;
  thesis: string;
  headingLevel: 2 | 3 | 4;
  caption: string;
  caveat?: string;
}

export interface AegisCaseStage {
  id: string;
  number: string;
  name: string;
  job: string;
  control: string;
}

export interface AegisCaseScenario {
  id: string;
  label: string;
  question: string;
  summary: string;
  activeStageIds: readonly string[];
  decisionLabel: string;
  decisionDetail: string;
}

export interface AegisCaseSpineContent extends AegisFigureBase {
  scenarioLabel: string;
  stageStatusLabels: Readonly<{ reached: string; notReached: string }>;
  stages: readonly AegisCaseStage[];
  scenarios: readonly AegisCaseScenario[];
  boundaryLabel: string;
  boundaryDetail: string;
}

export interface AegisMilestone {
  marker: string;
  title: string;
  detail: string;
}

export interface AegisMilestoneContent extends AegisFigureBase {
  milestones: readonly AegisMilestone[];
  continuityLabel: string;
  continuityDetail: string;
}

export interface AegisStructuralDiffRow {
  aspect: string;
  before: string;
  after: string;
}

export interface AegisStructuralDiffContent extends AegisFigureBase {
  sharedLabel: string;
  sharedDetail: string;
  columnLabels: readonly [string, string, string];
  rows: readonly AegisStructuralDiffRow[];
  continuityLabel: string;
  continuityDetail: string;
}

export interface AegisDecisionStage {
  id: string;
  number: string;
  name: string;
  job: string;
}

export interface AegisDecision {
  number: string;
  stageIds: readonly string[];
  pressure: string;
  choice: string;
  tradeoff: string;
}

export interface AegisDecisionSpineContent extends AegisFigureBase {
  stages: readonly AegisDecisionStage[];
  decisions: readonly AegisDecision[];
  columnLabels: readonly [string, string, string];
  operatingRuleLabel: string;
  operatingRuleDetail: string;
}

export interface AegisWalkthroughStep {
  title: string;
  content: string;
  caption?: string;
}

export interface AegisFormalStage {
  id: string;
  number: string;
  name: string;
  input: string;
  output: string;
  control: string;
  failure: string;
}

export interface AegisBoundary {
  afterStageId: string;
  label: string;
  detail: string;
}

export interface AegisFormalOverviewContent extends AegisFigureBase {
  columnLabels: readonly [string, string, string, string];
  stages: readonly AegisFormalStage[];
  boundaries: readonly AegisBoundary[];
  legend: readonly { label: string; detail: string }[];
}

export interface AegisCandidate {
  label: string;
  detail: string;
}

export interface AegisCandidateRoute {
  id: string;
  countLabel: string;
  title: string;
  request: string;
  candidates: readonly AegisCandidate[];
  decision: string;
  outcome: string;
}

export interface AegisCandidateAmbiguityContent extends AegisFigureBase {
  routes: readonly AegisCandidateRoute[];
  candidateListLabel: string;
  emptyListDetail: string;
  scoreNoteLabel: string;
  scoreNote: string;
}

export interface AegisValidatorInput {
  label: string;
  detail: string;
}

export interface AegisValidatorCheck {
  number: string;
  title: string;
  detail: string;
  failure: string;
}

export interface AegisValidatorOutcome {
  condition: string;
  title: string;
  detail: string;
}

export interface AegisValidatorContent extends AegisFigureBase {
  inputLabel: string;
  missingControlLabel: string;
  inputs: readonly AegisValidatorInput[];
  checks: readonly AegisValidatorCheck[];
  pass: AegisValidatorOutcome;
  reject: AegisValidatorOutcome;
}

export interface AegisTraceStep {
  stage: string;
  state: string;
  action: string;
  evidence: string;
  status: 'continue' | 'stop' | 'not-reached' | 'complete';
}

export interface AegisTrace {
  id: string;
  label: string;
  question: string;
  summary: string;
  steps: readonly AegisTraceStep[];
  outcomeLabel: string;
  outcomeDetail: string;
}

export interface AegisExecutionTraceContent extends AegisFigureBase {
  scenarioLabel: string;
  fieldLabels: readonly [string, string, string];
  statusLabels: Readonly<Record<AegisTraceStep['status'], string>>;
  traces: readonly AegisTrace[];
  assumptionsLabel: string;
  assumptions: readonly string[];
}

export const AEGIS_CASE_SPINE: AegisCaseSpineContent = {
  id: 'aegis-case-spine',
  title: 'One pipeline, two legitimate outcomes',
  thesis:
    'A clear request can continue through reviewed query construction. An unresolved request returns for clarification before any database call.',
  headingLevel: 3,
  caption:
    'The Aegis v2 request path. Candidate retrieval proposes catalog entries; an evaluated policy either accepts one or keeps the uncertainty visible.',
  caveat:
    'The scenarios explain control flow, not production telemetry. Model scores are routing signals rather than correctness probabilities.',
  scenarioLabel: 'Illustrative request',
  stageStatusLabels: { reached: 'Reached', notReached: 'Not reached' },
  stages: [
    {
      id: 'intent',
      number: '01',
      name: 'Parse intent',
      job: 'Turn the question into typed metric, time, comparison, and output fields.',
      control: 'Validate the schema; ask for missing context.',
    },
    {
      id: 'retrieve',
      number: '02',
      name: 'Retrieve candidates',
      job: 'Search stored catalog embeddings for plausible KPI entries.',
      control: 'Return a bounded shortlist; do not invent a match.',
    },
    {
      id: 'resolve',
      number: '03',
      name: 'Resolve or clarify',
      job: 'Accept one catalog KPI under the evaluated policy or return alternatives.',
      control: 'Treat the score as a routing signal and preserve abstention.',
    },
    {
      id: 'construct',
      number: '04',
      name: 'Construct the query',
      job: 'Select a reviewed query pattern and bind typed values.',
      control: 'Check the pattern, identifiers, operation, bindings, and result contract.',
    },
    {
      id: 'format',
      number: '05',
      name: 'Format the result',
      job: 'Render the returned rows into the requested supported form.',
      control: 'Use deterministic application code and explicit empty or unsupported states.',
    },
  ],
  scenarios: [
    {
      id: 'resolved',
      label: 'Resolved request',
      question: 'Compare a specified reported margin with its peer group for this quarter.',
      summary: 'The shortlist contains a plausible match and the resolution route accepts it under the evaluated policy.',
      activeStageIds: ['intent', 'retrieve', 'resolve', 'construct', 'format'],
      decisionLabel: 'Continue through the reviewed path',
      decisionDetail: 'A catalog KPI is accepted, then the selected query pattern must pass its checks before execution.',
    },
    {
      id: 'ambiguous',
      label: 'Ambiguous request',
      question: 'Show efficiency.',
      summary: 'Several catalog definitions remain plausible and the operating policy does not accept one.',
      activeStageIds: ['intent', 'retrieve', 'resolve'],
      decisionLabel: 'Clarify before query construction',
      decisionDetail: 'The analyst receives focused alternatives. Stages 4 and 5 are not reached until the request is resolved.',
    },
  ],
  boundaryLabel: 'Database execution boundary',
  boundaryDetail:
    'The registered execution path receives an accepted catalog KPI, application-owned identifiers, a reviewed query pattern, and bound values. It does not receive free-form model SQL.',
};

export const AEGIS_BUILDER_MILESTONES: AegisMilestoneContent = {
  id: 'aegis-builder-milestones',
  title: 'The two-week refactor began long before the sprint',
  thesis:
    'Production experience exposed the limit, an earlier design was shelved on evidence, and a later readiness gate made focused execution possible.',
  headingLevel: 3,
  caption:
    'The delivery sequence behind Aegis v2: production foundation, evaluated pause, model readiness, focused refactor, and team productionisation.',
  caveat:
    'Aegis v2 is a concurrent refactor of v1, not a separate greenfield product.',
  milestones: [
    {
      marker: 'Production foundation',
      title: 'v1 proves the product boundary',
      detail: 'The rules-based benchmarking engine serves analysts and earns the 2025 CFO One RBC Team Award.',
    },
    {
      marker: 'Earlier evaluation',
      title: 'The proposed refactor is shelved',
      detail: 'An earlier model does not clear the held-out acceptance bar for near-duplicate KPI definitions, so v1 remains the production path.',
    },
    {
      marker: 'Readiness gate',
      title: 'A later model clears the operating bar',
      detail: 'Representative evaluation supports resuming the decomposed design with clarification retained as a normal outcome.',
    },
    {
      marker: 'Focused refactor',
      title: 'The v2 module is built in two weeks',
      detail: 'The concurrent sprint runs while Astraeus productionisation and the summer intern program are also active.',
    },
    {
      marker: 'Team delivery',
      title: 'The module joins the production product',
      detail: 'A direct report and the broader team integrate and productionalize the refactored module as Aegis v2.',
    },
  ],
  continuityLabel: 'One product, two revisions',
  continuityDetail:
    'The sprint changes the query interface and control structure while retaining the production-proven benchmarking foundation.',
};

export const AEGIS_BUILDER_DIFF: AegisStructuralDiffContent = {
  id: 'aegis-builder-diff',
  title: 'The refactor changed the query interface, not the product identity',
  thesis:
    'v2 replaces a growing rule surface with explicit interpretation and clarification stages while keeping query execution bounded to supported patterns.',
  headingLevel: 3,
  caption:
    'A compact structural comparison of the production v1 query interface and the v2 refactor.',
  sharedLabel: 'Shared foundation',
  sharedDetail: 'The same benchmarking use case, catalog domain, production context, and analyst audience continue across both revisions.',
  columnLabels: ['Design pressure', 'v1', 'v2 refactor'],
  rows: [
    {
      aspect: 'Request surface',
      before: 'Analysts use the defined v1 query syntax.',
      after: 'Natural language is parsed into a typed intent before catalog matching.',
    },
    {
      aspect: 'Catalog matching',
      before: 'Rules connect supported requests to catalog entries.',
      after: 'Stored embeddings retrieve a shortlist; a separate stage resolves or clarifies.',
    },
    {
      aspect: 'Ambiguity',
      before: 'New and near-duplicate entries expand the rule and maintenance surface.',
      after: 'Unresolved alternatives return to the analyst rather than being silently collapsed.',
    },
    {
      aspect: 'Query construction',
      before: 'The existing production query path remains the reference foundation.',
      after: 'Reviewed patterns, bound values, and positive structural checks define the registered path.',
    },
  ],
  continuityLabel: 'What did not happen',
  continuityDetail: 'v2 was not a universal financial question-answering system and did not replace the underlying product with a greenfield build.',
};

export const AEGIS_PRACTITIONER_DECISIONS: AegisDecisionSpineContent = {
  id: 'aegis-practitioner-decisions',
  title: 'Four decisions sit at four different control points',
  thesis:
    'The architecture follows from the pressure at each boundary: expose intermediate failure, retrieve broadly, preserve abstention, and constrain execution.',
  headingLevel: 2,
  caption:
    'A decision-aware view of the five-stage spine. Each numbered decision maps an operating pressure to a selected control and a retained trade-off.',
  columnLabels: ['Pressure', 'Selected choice', 'Trade-off retained'],
  stages: [
    { id: 'intent', number: '01', name: 'Intent', job: 'Create a typed request.' },
    { id: 'retrieve', number: '02', name: 'Retrieve', job: 'Propose catalog candidates.' },
    { id: 'resolve', number: '03', name: 'Resolve', job: 'Accept or clarify.' },
    { id: 'construct', number: '04', name: 'Construct', job: 'Build a supported query.' },
    { id: 'format', number: '05', name: 'Format', job: 'Render a known result shape.' },
  ],
  decisions: [
    {
      number: '01',
      stageIds: ['intent', 'retrieve', 'resolve', 'construct', 'format'],
      pressure: 'A single model call would hide several different failure modes.',
      choice: 'Decompose the request into five typed contracts.',
      tradeoff: 'Five interfaces must be designed, tested, and maintained.',
    },
    {
      number: '02',
      stageIds: ['retrieve'],
      pressure: 'Aliases and near-duplicate definitions defeat exact matching.',
      choice: 'Use stored embeddings to retrieve a bounded candidate shortlist.',
      tradeoff: 'Catalog changes and retrieval behavior need continuing evaluation.',
    },
    {
      number: '03',
      stageIds: ['resolve'],
      pressure: 'Choosing the wrong KPI can be worse than asking another question.',
      choice: 'Use an evaluated acceptance-or-clarification policy.',
      tradeoff: 'Clarification adds friction, and the operating point can drift.',
    },
    {
      number: '04',
      stageIds: ['construct'],
      pressure: 'Natural language must not become an unrestricted database instruction.',
      choice: 'Select reviewed query patterns, bind values, and apply positive checks.',
      tradeoff: 'New query shapes require explicit implementation and review.',
    },
  ],
  operatingRuleLabel: 'Operating rule',
  operatingRuleDetail:
    'Language helps interpret the request; application code owns the catalog object, executable query surface, and deterministic result format.',
};

export const AEGIS_PRACTITIONER_WALKTHROUGH: AegisWalkthroughStep[] = [
  {
    title: 'Parse the request into named fields',
    caption: 'Stage 1 · Intent',
    content:
      'A schema-constrained call extracts the metric phrase, time window, comparison shape, and output form. Validation either produces a typed intent or asks for missing context.',
  },
  {
    title: 'Retrieve a bounded catalog shortlist',
    caption: 'Stage 2 · Candidate retrieval',
    content:
      'The metric phrase is compared with stored catalog embeddings. The output is a ranked set of candidate names and definitions, not a selected answer.',
  },
  {
    title: 'Resolve the KPI or return to the analyst',
    caption: 'Stage 3 · Disambiguation',
    content:
      'The operating policy considers the question and candidate definitions. A model score is used for routing, not treated as a correctness probability. Unresolved alternatives trigger clarification.',
  },
  {
    title: 'Select a reviewed query pattern and bind values',
    caption: 'Stage 4 · Query construction',
    content:
      'The accepted catalog KPI and comparison shape select a supported pattern. Application-owned identifiers, bound values, and structural checks define the registered execution path.',
  },
  {
    title: 'Execute only after the required checks pass',
    caption: 'Database boundary',
    content:
      'A supported read operation can run only after the pattern, identifiers, bindings, and expected result contract pass their configured checks. A failed check rejects the request before execution.',
  },
  {
    title: 'Format the known result shape',
    caption: 'Stage 5 · Result formatting',
    content:
      'Deterministic application code turns the returned rows into the requested supported format. Unexpected or empty results remain explicit rather than becoming plausible prose.',
  },
];

export const AEGIS_FORMAL_OVERVIEW: AegisFormalOverviewContent = {
  id: 'aegis-formal-overview',
  title: 'Every handoff narrows what the next stage can receive',
  thesis:
    'The pipeline separates interpretation, candidate retrieval, ambiguity handling, reviewed query construction, and deterministic formatting.',
  headingLevel: 3,
  caption:
    'Figure 1. The five stage contracts, their primary controls, and their explicit failure responses.',
  caveat:
    'These are application contracts, not proofs of correctness or complete descriptions of infrastructure.',
  columnLabels: ['Input', 'Output', 'Primary control', 'Failure response'],
  stages: [
    {
      id: 'intent',
      number: '01',
      name: 'Intent parsing',
      input: 'Natural-language question',
      output: 'Typed intent fields',
      control: 'Schema validation and bounded retry',
      failure: 'Ask for missing context; do not retrieve',
    },
    {
      id: 'retrieve',
      number: '02',
      name: 'Candidate retrieval',
      input: 'Metric phrase',
      output: 'Ranked catalog shortlist',
      control: 'Search stored embeddings from the reviewed catalog',
      failure: 'Return no candidate rather than invent one',
    },
    {
      id: 'resolve',
      number: '03',
      name: 'Disambiguation',
      input: 'Question and candidate definitions',
      output: 'Accepted catalog KPI or clarification',
      control: 'Evaluated acceptance and abstention policy',
      failure: 'Ask the analyst to choose or add context',
    },
    {
      id: 'construct',
      number: '04',
      name: 'Query construction',
      input: 'Accepted KPI and typed scope',
      output: 'Reviewed pattern with bound values',
      control: 'Registry, allow-lists, and structural validation',
      failure: 'Reject before database execution',
    },
    {
      id: 'format',
      number: '05',
      name: 'Result formatting',
      input: 'Rows with an expected result shape',
      output: 'Supported response form',
      control: 'Deterministic application code',
      failure: 'Return an explicit empty or unsupported state',
    },
  ],
  boundaries: [
    {
      afterStageId: 'retrieve',
      label: 'Candidate boundary',
      detail: 'Retrieval proposes possibilities; it does not choose the KPI.',
    },
    {
      afterStageId: 'resolve',
      label: 'Resolution boundary',
      detail: 'Query construction begins only after one catalog KPI has been accepted.',
    },
    {
      afterStageId: 'construct',
      label: 'Database execution boundary',
      detail: 'The database path begins only after the reviewed pattern, identifiers, bound values, and result contract pass their required checks.',
    },
  ],
  legend: [
    { label: 'Model-mediated', detail: 'Intent extraction and conditional comparison of ambiguous catalog entries.' },
    { label: 'Deterministic', detail: 'Catalog retrieval, registered query construction, validation, and formatting code.' },
    { label: 'Human return', detail: 'Clarification is a controlled outcome rather than an exception.' },
  ],
};

export const AEGIS_FORMAL_CANDIDATES: AegisCandidateAmbiguityContent = {
  id: 'aegis-formal-candidates',
  title: 'Candidate count changes the next action, not the meaning of a score',
  thesis:
    'Retrieval produces possibilities. The resolution policy decides whether the system can continue or must return to the analyst.',
  headingLevel: 3,
  caption:
    'Figure 2. Zero, one, and multiple-candidate routes shown as ranked catalog records with explicit next actions.',
  caveat:
    'The examples are conceptual. They do not expose production names, thresholds, scores, or query frequencies.',
  candidateListLabel: 'Ranked catalog records',
  emptyListDetail: 'The resolution stage receives an empty shortlist.',
  routes: [
    {
      id: 'zero',
      countLabel: 'Zero candidates',
      title: 'Nothing meets the retrieval policy',
      request: 'The request is too vague or outside the reviewed catalog.',
      candidates: [],
      decision: 'Do not select a KPI.',
      outcome: 'Ask the analyst to restate the metric or add context.',
    },
    {
      id: 'one',
      countLabel: 'One candidate',
      title: 'One plausible catalog entry remains',
      request: 'The request is specific enough to produce one plausible match.',
      candidates: [
        {
          label: 'Single catalog candidate',
          detail: 'Its reviewed name and definition fit the parsed request.',
        },
      ],
      decision: 'Apply the evaluated acceptance policy; a shortlist of one is not automatic proof.',
      outcome: 'Continue only when the route accepts it; otherwise clarify.',
    },
    {
      id: 'multiple',
      countLabel: 'Multiple candidates',
      title: 'Several definitions remain plausible',
      request: 'The wording can refer to reported, adjusted, or scope-specific variants.',
      candidates: [
        { label: 'Reported definition', detail: 'The standard reported form in the catalog.' },
        { label: 'Adjusted definition', detail: 'A related measure with a different business definition.' },
        { label: 'Scope-specific definition', detail: 'A variant limited by geography or reporting basis.' },
      ],
      decision: 'Compare the question with the candidate definitions under the evaluated policy.',
      outcome: 'Accept one candidate or present focused alternatives for clarification.',
    },
  ],
  scoreNoteLabel: 'How to read a model score',
  scoreNote:
    'It is an operating signal used to route accepted and clarified cases. It is not a pointwise probability that the selected KPI is correct.',
};

export const AEGIS_FORMAL_VALIDATOR: AegisValidatorContent = {
  id: 'aegis-formal-validator',
  title: 'Five positive checks stand between intent and execution',
  thesis:
    'The registered path starts from reviewed application objects and bound values, then rejects the request if a required condition is absent.',
  headingLevel: 3,
  caption:
    'Figure 3. The pre-execution contract for a reviewed query pattern, application-owned identifiers, and bound values.',
  caveat:
    'Application checks reduce the reachable query surface. Database permissions, route coverage, timeouts, result limits, and continuing review remain separate operating controls.',
  inputLabel: 'Inputs to the registered path',
  missingControlLabel: 'If absent',
  inputs: [
    {
      label: 'Reviewed query pattern',
      detail: 'The application selects a versioned pattern for a supported comparison or lookup shape.',
    },
    {
      label: 'Application-owned identifiers',
      detail: 'Relations, columns, functions, and sort choices come from configured mappings rather than user strings.',
    },
    {
      label: 'Bound values',
      detail: 'The accepted KPI, reporting period, and entity scope are passed as typed values through the database driver.',
    },
  ],
  checks: [
    {
      number: '01',
      title: 'Pattern is registered',
      detail: 'The selected query shape exists in the reviewed template registry.',
      failure: 'Unknown pattern: reject.',
    },
    {
      number: '02',
      title: 'Operation is supported',
      detail: 'The statement contains one permitted read operation.',
      failure: 'Unsupported or additional operation: reject.',
    },
    {
      number: '03',
      title: 'Identifiers are allowed',
      detail: 'Referenced relations, columns, functions, grouping, and ordering match configured allow-lists.',
      failure: 'Unregistered identifier or structure: reject.',
    },
    {
      number: '04',
      title: 'Bindings are complete and typed',
      detail: 'Every placeholder is present and every bound value has the expected type.',
      failure: 'Missing or incompatible value: reject.',
    },
    {
      number: '05',
      title: 'Result contract matches',
      detail: 'The query pattern and selected formatter agree on the expected row shape.',
      failure: 'Unexpected output contract: reject.',
    },
  ],
  pass: {
    condition: 'All five checks pass',
    title: 'The registered path may execute',
    detail: 'The database role, timeout, and result limits still apply.',
  },
  reject: {
    condition: 'Any required check fails',
    title: 'Stop before execution',
    detail: 'Record the validation outcome and return an explicit failure state.',
  },
};

export const AEGIS_FORMAL_TRACES: AegisExecutionTraceContent = {
  id: 'aegis-formal-traces',
  title: 'The ambiguous path ends before the database path begins',
  thesis:
    'A normal request and an unresolved request share the first stages, then diverge at the catalog decision.',
  headingLevel: 3,
  caption:
    'Figure 4. Paired illustrative traces showing a completed request and a clarification return.',
  caveat:
    'The traces show declared state and control evidence, not production identifiers, results, timings, or model scores.',
  scenarioLabel: 'Illustrative trace',
  fieldLabels: ['State', 'Action', 'Evidence'],
  statusLabels: {
    continue: 'Continue',
    stop: 'Stop and clarify',
    'not-reached': 'Not reached',
    complete: 'Complete',
  },
  traces: [
    {
      id: 'normal',
      label: 'Resolved request',
      question: 'Compare a specified reported metric with its peer group for this quarter.',
      summary: 'One catalog KPI is accepted under the operating policy and the registered query path passes its checks.',
      steps: [
        {
          stage: 'Intent',
          state: 'Typed metric, time, comparison, and output fields',
          action: 'Validate the parsed request.',
          evidence: 'Schema result and any clarification state.',
          status: 'continue',
        },
        {
          stage: 'Retrieve',
          state: 'Bounded catalog shortlist',
          action: 'Rank plausible entries from stored embeddings.',
          evidence: 'Candidate identifiers and retrieval signals.',
          status: 'continue',
        },
        {
          stage: 'Resolve',
          state: 'Accepted catalog KPI',
          action: 'Apply the evaluated acceptance policy.',
          evidence: 'Selected catalog record and route outcome.',
          status: 'continue',
        },
        {
          stage: 'Construct',
          state: 'Reviewed pattern with typed bindings',
          action: 'Run the five required checks before execution.',
          evidence: 'Pattern reference and validation outcomes.',
          status: 'continue',
        },
        {
          stage: 'Format',
          state: 'Rows with the expected shape',
          action: 'Render the requested supported response.',
          evidence: 'Formatter choice and explicit result state.',
          status: 'complete',
        },
      ],
      outcomeLabel: 'Completed route',
      outcomeDetail: 'A formatted result is returned through the supported path.',
    },
    {
      id: 'ambiguous',
      label: 'Unresolved request',
      question: 'Show efficiency.',
      summary: 'Several catalog definitions remain plausible and the operating policy abstains.',
      steps: [
        {
          stage: 'Intent',
          state: 'Typed request with a broad metric phrase',
          action: 'Validate the parsed request.',
          evidence: 'Schema result shows that the phrase remains broad.',
          status: 'continue',
        },
        {
          stage: 'Retrieve',
          state: 'Several plausible catalog entries',
          action: 'Return the ranked candidate definitions.',
          evidence: 'Candidate records and retrieval signals.',
          status: 'continue',
        },
        {
          stage: 'Resolve',
          state: 'No accepted catalog KPI',
          action: 'Return focused alternatives to the analyst.',
          evidence: 'Clarification route and candidate definitions.',
          status: 'stop',
        },
        {
          stage: 'Construct',
          state: 'Not reached',
          action: 'No query pattern is selected.',
          evidence: 'No database execution request.',
          status: 'not-reached',
        },
        {
          stage: 'Format',
          state: 'Not reached',
          action: 'No result is formatted.',
          evidence: 'The response is the clarification request itself.',
          status: 'not-reached',
        },
      ],
      outcomeLabel: 'Controlled return',
      outcomeDetail: 'The analyst clarifies the request before the pipeline can resume.',
    },
  ],
  assumptionsLabel: 'Reading assumptions',
  assumptions: [
    'Clarification is a normal operating outcome, not an execution failure.',
    'A model score supports routing but does not prove a catalog choice correct.',
    'Validation evidence is useful only when deployed routes consistently pass through the registered controls.',
  ],
};

[
  AEGIS_BUILDER_MILESTONES,
  AEGIS_BUILDER_DIFF,
  AEGIS_FORMAL_VALIDATOR,
  AEGIS_FORMAL_TRACES,
].forEach((spec) => validateVisualizationSpec(spec));

validateVisualizationSpec(AEGIS_CASE_SPINE, {
  relationships: AEGIS_CASE_SPINE.scenarios.map((scenario) => ({
    name: `scenarios[id=${scenario.id}].activeStageIds`,
    referencedIds: scenario.activeStageIds,
    targetIds: AEGIS_CASE_SPINE.stages.map((stage) => stage.id),
  })),
});

validateVisualizationSpec(AEGIS_PRACTITIONER_DECISIONS, {
  additionalAuthoredArrays: [
    { name: 'walkthrough', values: AEGIS_PRACTITIONER_WALKTHROUGH },
  ],
  relationships: AEGIS_PRACTITIONER_DECISIONS.decisions.map((decision) => ({
    name: `decisions[${decision.number}].stageIds`,
    referencedIds: decision.stageIds,
    targetIds: AEGIS_PRACTITIONER_DECISIONS.stages.map((stage) => stage.id),
  })),
});

validateVisualizationSpec(AEGIS_FORMAL_OVERVIEW, {
  relationships: AEGIS_FORMAL_OVERVIEW.boundaries.map((boundary) => ({
    name: `boundaries[after=${boundary.afterStageId}]`,
    referencedIds: [boundary.afterStageId],
    targetIds: AEGIS_FORMAL_OVERVIEW.stages.map((stage) => stage.id),
  })),
});

validateVisualizationSpec(AEGIS_FORMAL_CANDIDATES, {
  intentionalEmptyArrayPaths: ['routes[id=zero].candidates'],
});
