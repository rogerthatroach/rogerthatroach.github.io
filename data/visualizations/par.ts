import { validateVisualizationSpec } from './validateVisualizationSpec';

export interface ParFigureBase {
  id: string;
  eyebrow: string;
  title: string;
  thesis: string;
  caption: string;
  caveat?: string;
}

export interface ParFlowStage {
  number: string;
  kind: string;
  title: string;
  detail: string;
}

export interface ParOutcome {
  condition: string;
  title: string;
  detail: string;
}

export interface ParOverviewContent extends ParFigureBase {
  scopeLabel: string;
  scopeDetail: string;
  stages: readonly ParFlowStage[];
  outcomePrompt: string;
  outcomes: readonly ParOutcome[];
  humanLabel: string;
}

export interface ParFieldGroupColumn {
  label: string;
  title: string;
  items: readonly string[];
  note: string;
}

export interface ParFieldGroupContent extends ParFigureBase {
  scopeLabel: string;
  columns: readonly ParFieldGroupColumn[];
  mergeLabel: string;
  mergeRules: readonly string[];
  coverageLabel: string;
  coveragePass: string;
  coverageReturn: string;
}

export interface ParMilestone {
  marker: string;
  title: string;
  detail: string;
}

export interface ParMilestoneContent extends ParFigureBase {
  milestones: readonly ParMilestone[];
  ownershipLabel: string;
  ownershipDetail: string;
}

export interface ParActorStep {
  actor: string;
  action: string;
  result: string;
}

export interface ParActorContent extends ParFigureBase {
  openingLabel: string;
  closingLabel: string;
  steps: readonly ParActorStep[];
}

export interface ParDecision {
  number: string;
  constraint: string;
  choice: string;
  tradeoff: string;
}

export interface ParDecisionContent extends ParFigureBase {
  columnLabels: readonly [string, string, string];
  decisions: readonly ParDecision[];
  footerLabel: string;
  footerDetail: string;
}

export interface ParFormalNode {
  id: string;
  category: string;
  title: string;
  detail: string;
  tool?: string;
}

export interface ParFormalEnvelopeContent extends ParFigureBase {
  humanInput: string;
  humanInputDetail: string;
  humanOutput: string;
  envelopeLabel: string;
  envelopeDetail: string;
  graphLabel: string;
  nodes: readonly ParFormalNode[];
  branchLabel: string;
  pass: ParOutcome;
  return: ParOutcome;
  stateLabel: string;
  stateItems: readonly string[];
  legend: readonly { label: string; detail: string }[];
}

export interface ParFormalFieldLane {
  id: string;
  label: string;
  ownedFields: string;
  evidence: string;
  routine: string;
  result: string;
}

export interface ParFormalFieldGroupContent extends ParFigureBase {
  overlapLabel: string;
  overlapDetail: string;
  evidenceLabel: string;
  routineLabel: string;
  lanes: readonly ParFormalFieldLane[];
  mergeLabel: string;
  mergeDetail: string;
  resultLabel: string;
}

export interface ParTraceStep {
  number: string;
  state: string;
  action: string;
  evidence: string;
}

export interface ParTraceContent extends ParFigureBase {
  columnLabels: readonly [string, string, string];
  steps: readonly ParTraceStep[];
  branchLabel: string;
  pass: ParOutcome;
  return: ParOutcome;
  assumptionsLabel: string;
  assumptions: readonly string[];
}

export const PAR_CASE_STUDY_INTRO = 'Read the architecture at two scales: follow the end-to-end drafting path first, then inspect the bounded work inside one selected field group.';

export const PAR_CASE_OVERVIEW: ParOverviewContent = {
  id: 'par-case-overview',
  eyebrow: 'Case study · system orientation',
  title: 'One agent carries the draft from intake to review',
  thesis: 'The graph owns the workflow. Tool routines perform bounded work. The author owns the decision.',
  caption: 'PAR Assist v1 as a reviewed drafting path: one orchestration scope, bounded tool work, explicit coverage checks, and a human-owned draft.',
  caveat: 'The scope marker records a reviewed application boundary; it does not describe network or data isolation.',
  scopeLabel: 'Single-agent orchestration scope',
  scopeDetail: 'Chooses the next transition, dispatches registered actions, and retains declared state when checkpoints commit.',
  stages: [
    {
      number: '01',
      kind: 'Human input',
      title: 'Frame the request',
      detail: 'The author supplies source material and answers the guided template questions.',
    },
    {
      number: '02',
      kind: 'Agent-owned transition',
      title: 'Choose the route',
      detail: 'The graph records the proposed or author-confirmed template, selects relevant field groups, and retains declared session state when its checkpoint commits.',
    },
    {
      number: '03',
      kind: 'Bounded tool work',
      title: 'Gather candidate fields',
      detail: 'Group-scoped retrieval and extraction routines return typed candidates with references where available.',
    },
    {
      number: '04',
      kind: 'Validation + registered check',
      title: 'Merge, validate, test coverage',
      detail: 'Deterministic schema and ownership checks run before a registered coverage action evaluates open inputs.',
    },
  ],
  outcomePrompt: 'Coverage result',
  outcomes: [
    {
      condition: 'Configured checks pass',
      title: 'Reviewable draft',
      detail: 'Candidate fields, available references, and the retained session return to the author.',
    },
    {
      condition: 'A gap or conflict remains',
      title: 'Clarify, review, resume',
      detail: 'The author answers prioritized follow-ups or reviews a collision; a successfully retained checkpoint lets the same graph resume.',
    },
  ],
  humanLabel: 'Human review is the final gate in this drafting path',
};

export const PAR_FIELD_GROUP_LENS: ParFieldGroupContent = {
  id: 'par-field-group-lens',
  eyebrow: 'Case study · one field-group lens',
  title: 'A field group is a scope, not a specialist agent',
  thesis: 'Evidence and target fields travel together through one bounded routine; workflow control stays with the graph.',
  caption: 'One field-group pass, from configured scope to ownership-aware merge and coverage. Groups may run concurrently where capacity permits; they do not become independent agents.',
  scopeLabel: 'Stage 1 selects a relevant field group',
  columns: [
    {
      label: 'Scope',
      title: 'Target fields',
      items: ['Configured field keys', 'Expected owner group', 'Per-group instructions and checks'],
      note: 'The target shape is known before retrieval begins.',
    },
    {
      label: 'Evidence',
      title: 'Associated references',
      items: ['Policies and guidelines', 'Template material', 'Historical and few-shot examples'],
      note: 'Reference sets may overlap across groups; configured field ownership does not.',
    },
    {
      label: 'Bounded routine',
      title: 'Retrieve, compress, extract',
      items: ['Filter to the selected group', 'Retrieve a bounded candidate set', 'Return schema-checked candidate values'],
      note: 'The routine receives a task and returns data; it does not control the workflow.',
    },
  ],
  mergeLabel: 'Ownership-aware merge',
  mergeRules: [
    'Accept a candidate only for keys owned by its configured group.',
    'Route duplicate, out-of-scope, or schema-invalid contributions for review.',
    'Keep source references with candidates where the path provides them.',
  ],
  coverageLabel: 'Coverage gate',
  coveragePass: 'Required candidates pass configured checks → assemble a draft for author review.',
  coverageReturn: 'Open input or collision remains → ask, review, and resume from a successfully retained checkpoint.',
};

export const PAR_BUILDER_MILESTONES: ParMilestoneContent = {
  id: 'par-builder-milestones',
  eyebrow: 'Delivery arc',
  title: 'A one-page vision became a production platform in five distinct phases',
  thesis: 'Vision, exploration, production work, pilot use, and launch stay separate; ideation does not collapse into production authorship.',
  caption: 'The PAR Assist delivery arc: from a one-page product thesis to a full CFO Group launch across all geographies.',
  milestones: [
    {
      marker: 'Vision',
      title: 'Frame guided drafting',
      detail: 'Milap writes the one-page plan and defines the job as process guidance, not free-form chat.',
    },
    {
      marker: '2025',
      title: 'Explore the problem space',
      detail: 'The Amplify cohort explores possible shapes and sharpens what the product must do.',
    },
    {
      marker: 'Production build',
      title: 'Turn the thesis into a system',
      detail: 'Milap builds the production platform end to end inside the reviewed single-agent scope.',
    },
    {
      marker: 'April 2026',
      title: 'Pilot with authors',
      detail: 'The first wave of authors uses the guided drafting workflow.',
    },
    {
      marker: 'May 2026',
      title: 'Launch across the CFO Group',
      detail: 'The production path expands across all geographies.',
    },
  ],
  ownershipLabel: 'The through-line',
  ownershipDetail: 'Milap frames the concept, uses Amplify to widen the option set, then owns the distinct production build end to end.',
};

export const PAR_BUILDER_ACTORS: ParActorContent = {
  id: 'par-builder-actors',
  eyebrow: 'Author workflow',
  title: 'The author begins and ends the workflow',
  thesis: 'The system organizes the middle: it narrows context, proposes candidate fields, and surfaces gaps and conflicts found by configured checks.',
  caption: 'An actor-centered drafting session. Human intent enters first; a reviewable, revisable result returns last.',
  openingLabel: 'Author starts with intent and source material',
  closingLabel: 'Author reviews, answers follow-ups, and decides what ships',
  steps: [
    {
      actor: 'Author',
      action: 'Provide context',
      result: 'Source material and answers to a short template dialog establish the session.',
    },
    {
      actor: 'One agent',
      action: 'Coordinate the route',
      result: 'The graph dispatches registered template, retrieval, extraction, and coverage work and can resume from a successfully retained checkpoint.',
    },
    {
      actor: 'Tool routines',
      action: 'Work within a field group',
      result: 'Each bounded routine retrieves scoped references and returns typed candidate values.',
    },
    {
      actor: 'Controls',
      action: 'Surface known gaps',
      result: 'Ownership, schema, collision, and coverage checks turn detected gaps into explicit review items.',
    },
    {
      actor: 'Author',
      action: 'Review and revise',
      result: 'The author receives the draft, available references, and follow-up questions.',
    },
  ],
};

export const PAR_PRACTITIONER_DECISIONS: ParDecisionContent = {
  id: 'par-practitioner-decisions',
  eyebrow: 'Decision map',
  title: 'Four operating pressures shaped four architecture choices',
  thesis: 'Each choice solves a specific operating problem and carries a visible maintenance cost.',
  caption: 'The practitioner map: constraint, selected architecture, and the trade-off that remains after the decision.',
  columnLabels: ['Constraint', 'Choice', 'Trade-off retained'],
  decisions: [
    {
      number: '01',
      constraint: 'A drafting session branches, loops, and spans many turns.',
      choice: 'LangGraph for explicit transitions and retained checkpoints.',
      tradeoff: 'A closer workflow fit, with more routing setup and harder branch debugging than a linear chain.',
    },
    {
      number: '02',
      constraint: 'Registered actions need typed, inspectable evidence.',
      choice: 'MCP tools as the declared action boundary.',
      tradeoff: 'A testable dispatch path whose evidence still depends on registry coverage, successful writes, and retention.',
    },
    {
      number: '03',
      constraint: 'Heterogeneous sources and flat retrieval mixed evidence for unrelated target fields.',
      choice: 'Two-stage field-group retrieval with per-group compression.',
      tradeoff: 'More focused context, with a taxonomy and index mappings that must stay current.',
    },
    {
      number: '04',
      constraint: 'Specialized work must remain inside one reviewed agent-shaped scope.',
      choice: 'Bounded group calls plus schema validation and ownership-aware merge.',
      tradeoff: 'Concurrency where capacity permits, without sub-agents, plus explicit collision and ownership logic to maintain.',
    },
  ],
  footerLabel: 'Operating rule',
  footerDetail: 'The graph owns control; tools return bounded results; detected gaps and conflicts return to a person.',
};

export const PAR_FORMAL_ENVELOPE: ParFormalEnvelopeContent = {
  id: 'par-formal-envelope',
  eyebrow: 'System boundary',
  title: 'One graph owns each transition in the reviewed v1 path',
  thesis: 'Concurrent extraction is bounded registered work inside the graph; no routine acquires independent workflow control.',
  caption: 'Figure 1. The v1 graph, its reviewed application scope, registered tool work, retained state, and human review boundary.',
  caveat: 'The scope marker records a reviewed application boundary; it does not describe network or data isolation, or imply zero data exposure.',
  humanInput: 'Author input',
  humanInputDetail: 'Enters the reviewed path; no tool routine owns the session.',
  humanOutput: 'Author review',
  envelopeLabel: 'Reviewed v1 application scope',
  envelopeDetail: 'One agent retains workflow control',
  graphLabel: 'Graph-owned transition sequence',
  nodes: [
    { id: 'intake', category: 'Graph node', title: 'Intake', detail: 'Normalize approved inputs and retain source references where available.' },
    { id: 'template', category: 'Graph node', title: 'Template', detail: 'Record the proposed or author-confirmed template.', tool: 'Registered action · typed proposal, score, and rationale' },
    { id: 'groups', category: 'Graph node', title: 'Select groups', detail: 'Choose the field-group scopes relevant to this session.' },
    { id: 'extract', category: 'Graph node', title: 'Retrieve + extract', detail: 'Dispatch scoped calls and validate their typed candidate dictionaries.', tool: 'Bounded registered work · runs concurrently where capacity permits' },
    { id: 'merge', category: 'Graph node', title: 'Merge', detail: 'Apply schema checks and the configured owner map.', tool: 'Registered action · deterministic ownership and collision checks' },
    { id: 'coverage', category: 'Graph node', title: 'Coverage', detail: 'Evaluate the registered coverage result and choose the next edge.', tool: 'Registered action · coverage report and prioritized follow-ups' },
  ],
  branchLabel: 'Coverage chooses the next edge',
  pass: {
    condition: 'Configured checks clear',
    title: 'Assemble a reviewable draft',
    detail: 'Return candidate fields and available references for human review.',
  },
  return: {
    condition: 'Input, conflict, or check remains open',
    title: 'Clarify → retain → resume',
    detail: 'Ask a prioritized question and continue from a successfully committed checkpoint.',
  },
  stateLabel: 'Retained state rail',
  stateItems: ['template choice', 'candidate fields', 'conflicts', 'coverage report', 'pending follow-ups', 'registered action references'],
  legend: [
    { label: 'Solid', detail: 'graph-owned state transition' },
    { label: 'Dashed', detail: 'subordinate registered action' },
    { label: 'Heavy rule', detail: 'human input or review gate' },
  ],
};

export const PAR_FORMAL_FIELD_GROUP: ParFormalFieldGroupContent = {
  id: 'par-formal-field-group',
  eyebrow: 'Retrieval and merge',
  title: 'Configured field ownership is disjoint; evidence may overlap',
  thesis: 'The configured owner map constrains which group may write each target field, while one source may support several groups.',
  caption: 'Figure 2. Two abstract selected groups show overlapping reference evidence, separate owned field sets, bounded routines, and convergence through the configured owner map.',
  caveat: 'The contract depends on current taxonomy and index mappings, enforced group filters, schema validation, and review of out-of-scope contributions.',
  overlapLabel: 'Shared evidence association',
  overlapDetail: 'One reviewed source passage may be associated with both selected groups. Evidence overlap does not transfer field ownership.',
  evidenceLabel: 'Evidence association',
  routineLabel: 'Bounded routine',
  lanes: [
    {
      id: 'group-a',
      label: 'Selected group A',
      ownedFields: 'Configured field set A',
      evidence: 'Group-A references + shared passage',
      routine: 'Retrieve → compress → extract',
      result: 'Typed candidates for field set A',
    },
    {
      id: 'group-b',
      label: 'Selected group B',
      ownedFields: 'Configured field set B',
      evidence: 'Group-B references + shared passage',
      routine: 'Retrieve → compress → extract',
      result: 'Typed candidates for field set B',
    },
  ],
  mergeLabel: 'Configured owner map',
  mergeDetail: 'Accept only keys owned by the contributing group; flag duplicate, out-of-scope, or schema-invalid contributions for review.',
  resultLabel: 'Validated merged candidates',
};

export const PAR_FORMAL_TRACE: ParTraceContent = {
  id: 'par-formal-trace',
  eyebrow: 'Execution trace',
  title: 'Coverage decides whether the graph advances or asks',
  thesis: 'The normal path is inspectable only when the declared actions commit and the corresponding versions and records are retained.',
  caption: 'Figure 3. A conditional execution trace from template choice to author review, including the clarification loop and its operating assumptions.',
  columnLabels: ['State after step', 'Action or control', 'Review evidence'],
  steps: [
    {
      number: '01',
      state: 'Template choice retained',
      action: 'Template selection',
      evidence: 'Typed result, score, rationale, and record when the call commits.',
    },
    {
      number: '02',
      state: 'Relevant field groups active',
      action: 'Scoped retrieval',
      evidence: 'Group filter, bounded candidate references, and request metadata where retained.',
    },
    {
      number: '03',
      state: 'Group candidate dictionaries available',
      action: 'Scoped extraction',
      evidence: 'Typed outputs and schema-validation results where retained.',
    },
    {
      number: '04',
      state: 'Candidate fields ownership-merged',
      action: 'Deterministic merge control',
      evidence: 'Configured owner map plus collision and out-of-scope flags.',
    },
    {
      number: '05',
      state: 'Coverage report and follow-ups retained',
      action: 'Coverage analysis',
      evidence: 'Configured checks, open questions, and the committed action record.',
    },
  ],
  branchLabel: 'Conditional transition',
  pass: {
    condition: 'Configured threshold met; no follow-ups remain',
    title: 'Assemble a draft',
    detail: 'Return candidate fields and available references for author review.',
  },
  return: {
    condition: 'A required input, conflict, or check remains open',
    title: 'Clarify and resume',
    detail: 'Ask a prioritized question, retain the answer, and continue through the same graph.',
  },
  assumptionsLabel: 'This trace remains conditional on',
  assumptions: [
    'successful state and action-record writes',
    'complete registry coverage for the declared path',
    'current taxonomy, ownership, and retrieval mappings',
    'retention of the state, reference, and tool versions needed for review',
  ],
};

[
  PAR_CASE_OVERVIEW,
  PAR_FIELD_GROUP_LENS,
  PAR_BUILDER_MILESTONES,
  PAR_BUILDER_ACTORS,
  PAR_PRACTITIONER_DECISIONS,
  PAR_FORMAL_ENVELOPE,
  PAR_FORMAL_FIELD_GROUP,
  PAR_FORMAL_TRACE,
].forEach((spec) => validateVisualizationSpec(spec));
