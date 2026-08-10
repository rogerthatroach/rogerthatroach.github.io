import { validateVisualizationSpec } from './validateVisualizationSpec';

export interface AstraeusFigureBase {
  id: string;
  title: string;
  thesis: string;
  caption: string;
  caveat?: string;
  headingLevel?: 2 | 3 | 4;
}

export interface AstraeusScenarioStage {
  owner: 'Model-mediated work' | 'Deterministic code';
  title: string;
  detail: string;
  branchLabel?: string;
  branches?: readonly string[];
}

export interface AstraeusOverviewScenario {
  id: 'simple' | 'cross-domain';
  label: string;
  summary: string;
  stages: readonly [AstraeusScenarioStage, AstraeusScenarioStage, AstraeusScenarioStage];
}

export interface AstraeusCaseOverviewContent extends AstraeusFigureBase {
  scenarioControlLabel: string;
  noScriptComparisonLabel: string;
  openingLabel: string;
  openingDetail: string;
  closingLabel: string;
  closingDetail: string;
  boundaryLabels: readonly [string, string];
  scenarios: readonly AstraeusOverviewScenario[];
}

export interface AstraeusContrastPath {
  label: string;
  title: string;
  summary: string;
  steps: readonly string[];
  advantageLabel: string;
  advantage: string;
  costLabel: string;
  cost: string;
  chosen: boolean;
}

export interface AstraeusBuilderContrastContent extends AstraeusFigureBase {
  paths: readonly [AstraeusContrastPath, AstraeusContrastPath];
  chosenLabel: string;
  decisionLabel: string;
  decisionDetail: string;
}

export interface AstraeusEntitlementStep {
  number: string;
  title: string;
  detail: string;
  failure: string;
}

export interface AstraeusDecision {
  number: string;
  pressure: string;
  choice: string;
  retainedResponsibility: string;
  entitlementDetail?: readonly AstraeusEntitlementStep[];
}

export interface AstraeusDecisionMapContent extends AstraeusFigureBase {
  columnLabels: readonly [string, string, string];
  decisions: readonly AstraeusDecision[];
  detailLabel: string;
  failureLabel: string;
  operatingRuleLabel: string;
  operatingRuleDetail: string;
}

export interface AstraeusResponsibility {
  name: string;
  owner: 'Model-mediated' | 'Deterministic';
  input: string;
  output: string;
  evidence: string;
  failure: string;
}

export interface AstraeusTechnicalOverviewContent extends AstraeusFigureBase {
  columnLabels: readonly [string, string, string, string];
  outputLabel: string;
  responsibilities: readonly AstraeusResponsibility[];
  humanRuleLabel: string;
  humanRuleDetail: string;
}

export interface AstraeusPermissionStage {
  number: string;
  title: string;
  receives: string;
  records: string;
  failure: string;
}

export interface AstraeusPermissionCascadeContent extends AstraeusFigureBase {
  handoffLabels: readonly [string, string, string];
  stages: readonly AstraeusPermissionStage[];
  failClosedLabel: string;
  failClosedDetail: string;
}

export interface AstraeusEventScenario {
  id: 'within-rollup' | 'across-rollups' | 'evidence-gap';
  label: string;
  summary: string;
  snapshotFinding: string;
  eventFinding: string;
  rollupFinding: string;
  reviewAction: string;
}

export interface AstraeusEventModelContent extends AstraeusFigureBase {
  scenarioControlLabel: string;
  columnLabels: readonly [string, string, string, string];
  scenarios: readonly AstraeusEventScenario[];
}

export const ASTRAEUS_CASE_INTRO =
  'Read this as a responsibility map, not a deployment topology. It shows where language work ends, where entitlement and calculation begin, and what changes when a question crosses supported domains.';

export const ASTRAEUS_CASE_OVERVIEW: AstraeusCaseOverviewContent = {
  id: 'astraeus-case-overview',
  title: 'Language stays at the edges; permissions and calculation stay in code',
  thesis:
    'The request and answer may be model-mediated. The authorized scope and the numerical result come from a separate controlled path.',
  caption:
    'Astraeus keeps the same responsibility split for a single-domain request and a cross-domain request. The branch changes; the entitlement and calculation boundary does not.',
  caveat:
    'The two rules mark declared application contracts. They are not network-security boundaries, and their effectiveness depends on complete route coverage, current configuration, tests, access controls, logging, and monitoring.',
  headingLevel: 3,
  scenarioControlLabel: 'Choose an Astraeus query shape',
  noScriptComparisonLabel: 'Cross-domain comparison',
  openingLabel: 'Responsible user',
  openingDetail: 'Asks a supported question within an authorized working context.',
  closingLabel: 'Responsible user',
  closingDetail: 'Reviews the response and remains accountable for how it is used.',
  boundaryLabels: [
    'Application contract: validated request metadata enters the controlled path',
    'Application contract: authorized structured aggregates leave the controlled path',
  ],
  scenarios: [
    {
      id: 'simple',
      label: 'Single domain',
      summary: 'One supported domain follows one answer-shaping path.',
      stages: [
        {
          owner: 'Model-mediated work',
          title: 'Interpret the request',
          detail: 'Identify the supported domain, requested scope, time window, and response shape.',
        },
        {
          owner: 'Deterministic code',
          title: 'Resolve entitlement and calculate',
          detail: 'Validate the request, resolve the authorized rows, and run the domain calculation.',
        },
        {
          owner: 'Model-mediated work',
          title: 'Shape one answer',
          detail: 'Turn the authorized structured aggregate into a readable response without recomputing it.',
        },
      ],
    },
    {
      id: 'cross-domain',
      label: 'Cross-domain',
      summary: 'Several supported domains branch and reunite around the same controlled calculation path.',
      stages: [
        {
          owner: 'Model-mediated work',
          title: 'Route the supported domains',
          detail: 'Extract bounded request metadata for each relevant domain and validate each result.',
          branchLabel: 'Parallel domain lanes',
          branches: ['Compensation costs', 'Headcount', 'Open positions'],
        },
        {
          owner: 'Deterministic code',
          title: 'Resolve one authorized scope and calculate',
          detail: 'Apply the entitlement path before domain calculations and reconcile structured results in code.',
        },
        {
          owner: 'Model-mediated work',
          title: 'Shape and combine the answers',
          detail: 'Phrase each scoped aggregate, then combine the validated outputs for the user.',
          branchLabel: 'Bounded answer lanes',
          branches: ['Compensation costs', 'Headcount', 'Open positions'],
        },
      ],
    },
  ],
};

export const ASTRAEUS_BUILDER_CONTRAST: AstraeusBuilderContrastContent = {
  id: 'astraeus-builder-contrast',
  title: 'The faster prototype widened the wrong boundaries',
  thesis:
    'The consequential choice was not whether to use a language model. It was whether the model would direct permission, data access, and calculation.',
  caption:
    'The rejected prototype optimized for speed and flexibility. The selected architecture accepted more engineering so that language, authorization, and calculation failures could be separated.',
  headingLevel: 3,
  chosenLabel: 'Chosen',
  paths: [
    {
      label: 'Prototype default',
      title: 'One model directs the route',
      summary: 'A model chooses tools, reads results, performs reasoning, and composes the answer in one broad loop.',
      steps: ['Interpret the question', 'Choose data actions', 'Reason over returned values', 'Compose the answer'],
      advantageLabel: 'Why it was attractive',
      advantage: 'Fast to demonstrate and flexible when a user changes direction.',
      costLabel: 'Why it did not fit',
      cost: 'Permission, calculation, and answer behavior become harder to separate and test as distinct responsibilities.',
      chosen: false,
    },
    {
      label: 'Selected production shape',
      title: 'A bounded router surrounds controlled code',
      summary: 'Model stages handle language; conventional code resolves authorization, reads governed data, and calculates.',
      steps: ['Interpret bounded intent', 'Resolve the authorized scope', 'Calculate in code', 'Shape the authorized result'],
      advantageLabel: 'Why it fit',
      advantage: 'Each responsibility has its own evidence, failure path, and review question.',
      costLabel: 'What it required',
      cost: 'A separate entitlement and calculation layer had to be designed, built, tested, and operated.',
      chosen: true,
    },
  ],
  decisionLabel: 'Architecture call',
  decisionDetail:
    'Use model-mediated work where language is the problem; keep entitlement and numerical calculation in conventional code.',
};

const ENTITLEMENT_DETAIL: readonly AstraeusEntitlementStep[] = [
  {
    number: '01',
    title: 'Resolve supported domain scope',
    detail: 'Read the caller\'s current scope from the governed entitlement catalog.',
    failure: 'Unknown or unavailable scope stops the path.',
  },
  {
    number: '02',
    title: 'Map current access groups',
    detail: 'Translate the supported domain scope through the catalog\'s current access relationships.',
    failure: 'A missing or stale relation does not broaden access.',
  },
  {
    number: '03',
    title: 'Resolve authorized entities',
    detail: 'Determine which governed entities are represented by those relationships.',
    failure: 'An unresolved entity is excluded and surfaced for investigation.',
  },
  {
    number: '04',
    title: 'Expand to cost-centre leaves',
    detail: 'Resolve the authorized hierarchy slice used by the calculation.',
    failure: 'Hierarchy-version mismatch stops or flags the request.',
  },
  {
    number: '05',
    title: 'Build the parameterized filter',
    detail: 'Pass only the resolved identifiers into the controlled query path.',
    failure: 'A filter that does not validate is not executed.',
  },
];

export const ASTRAEUS_PRACTITIONER_DECISIONS: AstraeusDecisionMapContent = {
  id: 'astraeus-practitioner-decisions',
  title: 'Four operating pressures produced four architecture choices',
  thesis:
    'Each choice narrows one risk, but none removes the need for tests, current configuration, monitoring, and accountable use.',
  caption:
    'A decision map from operating pressure to selected architecture and the responsibility that remains after the choice.',
  headingLevel: 2,
  columnLabels: ['Operating pressure', 'Selected architecture', 'Responsibility retained'],
  detailLabel: 'Open the entitlement path',
  failureLabel: 'If it fails',
  decisions: [
    {
      number: '01',
      pressure: 'Natural-language questions vary, while authorization and calculation rules must remain explicit.',
      choice: 'Model-assisted routing around a deterministic entitlement and calculation path.',
      retainedResponsibility: 'Measure routing errors, validate typed requests, and stop unsupported or malformed paths.',
    },
    {
      number: '02',
      pressure: 'Hierarchy-aware movement calculations must remain testable on supported interactive workloads.',
      choice: 'Cython-compiled Python for profiled calculation paths; readable Python elsewhere.',
      retainedResponsibility: 'Maintain fixed-input regressions, source checks, profiling, and load evidence for supported shapes.',
    },
    {
      number: '03',
      pressure: 'The authorized row set must be resolved before financial calculation begins.',
      choice: 'Reuse the governed entitlement catalog through a pre-calculation permission-to-filter path.',
      retainedResponsibility: 'Test catalog freshness, hierarchy versions, mapping failures, filter validation, and route coverage.',
      entitlementDetail: ENTITLEMENT_DETAIL,
    },
    {
      number: '04',
      pressure: 'Simple questions should stay simple; cross-domain questions need scoped answer combination.',
      choice: 'One answer path for a single domain; bounded answer paths and a final combination step across domains.',
      retainedResponsibility: 'Evaluate path choice, compare shaped output with supplied values, and monitor semantic errors.',
    },
  ],
  operatingRuleLabel: 'Operating rule',
  operatingRuleDetail:
    'Language stages interpret and explain; conventional code determines what data is available and what the number is.',
};

export const ASTRAEUS_TECHNICAL_OVERVIEW: AstraeusTechnicalOverviewContent = {
  id: 'astraeus-technical-overview',
  title: 'Each boundary has a different input, control, and failure',
  thesis:
    'A routing error, an entitlement error, a calculation error, and a misleading explanation are different failures and need different evidence.',
  caption:
    'The technical responsibility split. Model-mediated stages interpret and explain; deterministic code owns authorization and calculation; a responsible user reviews the output.',
  caveat:
    'This table describes the declared application path. It does not prove that every integration follows it or that typed interfaces alone prevent sensitive data from reaching another surface.',
  headingLevel: 3,
  columnLabels: ['Input and output', 'Control evidence', 'Failure to test', 'Owner'],
  outputLabel: 'Output',
  responsibilities: [
    {
      name: 'Request interpretation',
      owner: 'Model-mediated',
      input: 'Supported user question and reviewed domain descriptions become validated request metadata.',
      output: 'Validated request metadata',
      evidence: 'Schemas, scope tests, payload inspection, and measured routing behavior.',
      failure: 'Misrouting, malformed fields, or sensitive text supplied directly in the question.',
    },
    {
      name: 'Entitlement and calculation',
      owner: 'Deterministic',
      input: 'Validated metadata, caller context, current entitlement state, and versioned governed data become authorized aggregates.',
      output: 'Authorized structured aggregates',
      evidence: 'Mapping tests, filter checks, calculation regressions, hierarchy-version checks, and route-coverage tests.',
      failure: 'Stale catalog, missing mapping, hierarchy drift, calculation defect, or an alternate unfiltered path.',
    },
    {
      name: 'Answer shaping',
      owner: 'Model-mediated',
      input: 'Authorized aggregates and a response contract become a user-facing answer.',
      output: 'Reviewable response',
      evidence: 'Structured-output validation, value comparison, representative evaluations, and monitoring.',
      failure: 'Changed value, omitted qualifier, unsupported interpretation, or sensitive aggregate handling.',
    },
  ],
  humanRuleLabel: 'Human boundary',
  humanRuleDetail: 'The generated response remains an aid to a responsible user, not the owner of the decision.',
};

export const ASTRAEUS_PERMISSION_CASCADE: AstraeusPermissionCascadeContent = {
  id: 'astraeus-permission-cascade',
  title: 'Authorization becomes a query filter through five inspectable handoffs',
  thesis:
    'Each handoff translates and bounds the resolved scope for the next representation. A missing, stale, or invalid relation must stop or flag the path rather than widen it.',
  caption:
    'The permission-to-filter path from current caller scope to a validated parameterized query filter. Each relation needs its own evidence and failure test.',
  caveat:
    'This is an application authorization path, not a network boundary or proof of complete enforcement. Every supported delivery path still has to be tested for the same check.',
  headingLevel: 3,
  handoffLabels: ['Receives', 'Review evidence', 'If it fails'],
  stages: [
    {
      number: '01',
      title: 'Domain scope',
      receives: 'Current caller context and the governed entitlement catalog.',
      records: 'Resolved supported domains and the catalog version used.',
      failure: 'Unknown or unavailable scope stops the path.',
    },
    {
      number: '02',
      title: 'Access groups',
      receives: 'The resolved domain scope.',
      records: 'Current group relationships used by the request.',
      failure: 'Missing or stale relationships do not broaden access.',
    },
    {
      number: '03',
      title: 'Authorized entities',
      receives: 'The current access-group result.',
      records: 'The governed entities included in the resolved scope.',
      failure: 'Unresolved entities are excluded and surfaced.',
    },
    {
      number: '04',
      title: 'Cost-centre leaves',
      receives: 'Authorized entities and the applicable hierarchy version.',
      records: 'The leaf identifiers available to the calculation.',
      failure: 'Hierarchy mismatch stops or flags the request.',
    },
    {
      number: '05',
      title: 'Parameterized filter',
      receives: 'Only the resolved leaf identifiers.',
      records: 'The validated filter reference used by the controlled path.',
      failure: 'A filter that does not validate is not executed.',
    },
  ],
  failClosedLabel: 'Failure rule',
  failClosedDetail:
    'Do not infer a broader scope. Stop, surface the failed relation, and resolve the catalog or hierarchy evidence before calculation.',
};

export const ASTRAEUS_EVENT_MODEL: AstraeusEventModelContent = {
  id: 'astraeus-event-model',
  title: 'Events explain movement that two snapshots can hide',
  thesis:
    'Snapshots answer where headcount stood. Paired movement records explain how it changed and whether a transfer nets within or moves across rollups.',
  caption:
    'Three conceptual movement states show what snapshots reveal, what event evidence adds, and when incomplete evidence must return to reconciliation.',
  caveat:
    'Netting depends on correctly paired, de-duplicated movement records and the hierarchy version in effect. The figure illustrates the rule; it is not evidence that source data is complete.',
  headingLevel: 3,
  scenarioControlLabel: 'Choose a movement-evidence state',
  columnLabels: ['Snapshot view', 'Movement evidence', 'Rollup result', 'Review action'],
  scenarios: [
    {
      id: 'within-rollup',
      label: 'Within one rollup',
      summary: 'A movement changes two child scopes but not their shared parent total.',
      snapshotFinding: 'The shared parent total is unchanged at the two reporting points.',
      eventFinding: 'A paired move-out and move-in connects the source child to the destination child.',
      rollupFinding: 'The source child decreases, the destination child increases, and the shared parent nets to no change.',
      reviewAction: 'Use the paired movement to explain the internal change and reconcile it against the snapshots.',
    },
    {
      id: 'across-rollups',
      label: 'Across two rollups',
      summary: 'A movement changes both the child scopes and their different parent totals.',
      snapshotFinding: 'One parent ends lower and another ends higher, but the snapshots do not identify the link.',
      eventFinding: 'The paired movement connects a source child under one parent to a destination child under another.',
      rollupFinding: 'The source parent decreases and the destination parent increases.',
      reviewAction: 'Use the paired movement and the applicable hierarchy version to explain both parent changes.',
    },
    {
      id: 'evidence-gap',
      label: 'Evidence gap',
      summary: 'An incomplete or mismatched record cannot support a safe netting conclusion.',
      snapshotFinding: 'The totals differ, but the snapshots do not establish why.',
      eventFinding: 'One side is missing, duplicated, late, or associated with a different hierarchy version.',
      rollupFinding: 'No reliable parent-level net can be asserted from the available evidence.',
      reviewAction: 'Pause the explanation and reconcile the movement and hierarchy evidence before using the result.',
    },
  ],
};

[
  ASTRAEUS_CASE_OVERVIEW,
  ASTRAEUS_BUILDER_CONTRAST,
  ASTRAEUS_PRACTITIONER_DECISIONS,
  ASTRAEUS_TECHNICAL_OVERVIEW,
  ASTRAEUS_PERMISSION_CASCADE,
  ASTRAEUS_EVENT_MODEL,
].forEach((spec) => validateVisualizationSpec(spec));
