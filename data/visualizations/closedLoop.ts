import { validateVisualizationSpec } from './validateVisualizationSpec';

export interface ClosedLoopFigureBase {
  id: string;
  title: string;
  thesis: string;
  headingLevel: 2 | 3 | 4;
  caption: string;
  caveat?: string;
}

export interface ClosedLoopStage {
  id: string;
  number: string;
  question: string;
  title: string;
  actor: string;
  detail: string;
}

export interface ClosedLoopBranch {
  id: string;
  condition: string;
  outcome: string;
  returnDetail: string;
}

export interface ClosedLoopCycleContent extends ClosedLoopFigureBase {
  stages: readonly ClosedLoopStage[];
  boundaryLabel: string;
  boundaryDetail: string;
  branchLabel: string;
  branches: readonly ClosedLoopBranch[];
  returnLabel: string;
  returnDetail: string;
}

export interface ModelCandidateProfile {
  id: string;
  label: string;
  fit: string;
  stability: string;
  reading: string;
  decision: string;
}

export interface ModelSelectionContent extends ClosedLoopFigureBase {
  fixtureLabel: string;
  fixtureNote: string;
  selectionLabel: string;
  fallbackLabel: string;
  focusedLabel: string;
  fieldLabels: readonly [string, string, string];
  candidates: readonly ModelCandidateProfile[];
  defaultCandidateId: string;
  systemBoundaryLabel: string;
  systemBoundaryDetail: string;
}

export interface PsoProcessStep {
  id: string;
  number: string;
  title: string;
  detail: string;
}

export interface PsoSimulationContent extends ClosedLoopFigureBase {
  fixtureLabel: string;
  fixtureNote: string;
  processLabel: string;
  processSteps: readonly PsoProcessStep[];
  searchSpaceLabel: string;
  searchSpaceDescription: string;
  legendLabel: string;
  particleLabel: string;
  retainedLabel: string;
  controlLabels: Readonly<{
    step: string;
    run: string;
    pause: string;
    reset: string;
    runAgain: string;
  }>;
  iterationLabel: string;
  initialStatus: string;
  runningStatus: string;
  pausedStatus: string;
  completeStatus: string;
  maxIterations: number;
  operatorBoundaryLabel: string;
  operatorBoundaryDetail: string;
}

export interface CrossDomainQuestion {
  id: string;
  label: string;
}

export interface CrossDomainAnswer {
  questionId: string;
  detail: string;
}

export interface CrossDomainRow {
  id: string;
  domain: string;
  context: string;
  answers: readonly CrossDomainAnswer[];
  limit: string;
}

export interface AbstractionComparisonContent extends ClosedLoopFigureBase {
  questions: readonly CrossDomainQuestion[];
  rows: readonly CrossDomainRow[];
  limitLabel: string;
  bottomLineLabel: string;
  bottomLine: string;
}

export const CLOSED_LOOP_CYCLE = validateVisualizationSpec<ClosedLoopCycleContent>(
  {
    id: 'closed-loop-cycle',
    title: 'A loop exists only when evidence returns',
    thesis:
      'The optimizer can propose candidate settings, but an operator decides whether the plant changes. Later observations become useful feedback only when they remain linked to what was proposed and applied.',
    headingLevel: 3,
    caption:
      'Observation, estimation, bounded search, operator-gated action, and a conditional evidence return path. A held recommendation does not become evidence about an unapplied setting.',
    caveat:
      'The sequence describes responsibility and evidence flow. It does not imply autonomous control, automatic learning, or a causal conclusion from one before-and-after comparison.',
    stages: [
      {
        id: 'observe',
        number: '01',
        question: 'Observe',
        title: 'Record the current unit state',
        actor: 'Measured input',
        detail: 'Sensors capture temperatures, pressures, flows, load, emissions, and other observed conditions.',
      },
      {
        id: 'estimate',
        number: '02',
        question: 'Estimate',
        title: 'Estimate candidate outcomes',
        actor: '84 regression models',
        detail: 'The models estimate relevant outputs for the observed state and candidate controllable settings.',
      },
      {
        id: 'choose',
        number: '03',
        question: 'Choose',
        title: 'Search within configured bounds',
        actor: 'Particle Swarm Optimization',
        detail: 'PSO searches the permitted setting space and returns a promising candidate rather than a command.',
      },
      {
        id: 'act',
        number: '04',
        question: 'Act',
        title: 'Apply or hold the proposal',
        actor: 'Plant operator',
        detail: 'The operator considers conditions outside the model and remains accountable for changing the plant state.',
      },
      {
        id: 'compare',
        number: '05',
        question: 'Compare',
        title: 'Associate outcome with action',
        actor: 'Recorded evidence',
        detail: 'Later observations are compared with the estimate only when the proposal, actual settings, timing, and context stay linked.',
      },
    ],
    boundaryLabel: 'Operator and action boundary',
    boundaryDetail:
      'Software proposes candidate settings. The accountable operator decides whether any candidate is applied to the generating unit.',
    branchLabel: 'Two valid operating outcomes',
    branches: [
      {
        id: 'applied',
        condition: 'Operator applies a setting',
        outcome: 'The plant enters a new state and sensors record what followed.',
        returnDetail: 'Linked observations can return as evidence for monitoring, review, or a deliberate model update.',
      },
      {
        id: 'held',
        condition: 'Operator holds the proposal',
        outcome: 'The proposed setting does not change the plant.',
        returnDetail: 'Record the decision, but do not treat later readings as evidence about an unapplied proposal.',
      },
    ],
    returnLabel: 'Conditional return path',
    returnDetail:
      'Feedback reaches the next decision only after the recommendation, actual action, evaluation window, and relevant operating context are associated.',
  },
  {
    relationships: [
      {
        name: 'cycle stages',
        referencedIds: ['observe', 'estimate', 'choose', 'act', 'compare'],
        targetIds: ['observe', 'estimate', 'choose', 'act', 'compare'],
      },
    ],
  },
);

export const CLOSED_LOOP_MODEL_SELECTION = validateVisualizationSpec<ModelSelectionContent>(
  {
    id: 'closed-loop-model-selection',
    title: 'Model selection is a two-question review',
    thesis:
      'Average predictive fit and consistency across held-out folds reveal different risks. Select one illustrative profile to see why neither measure alone establishes readiness.',
    headingLevel: 4,
    caption:
      'Four synthetic candidate profiles isolate the fit-versus-stability decision. The balanced profile can advance to bounded system review, not directly to plant action.',
    caveat:
      'These fixed profiles are explanatory fixtures, not production measurements or a reconstruction of the plant evaluation results.',
    fixtureLabel: 'Illustrative fixture',
    fixtureNote:
      'The descriptions are qualitative so the comparison stays focused on the decision pattern rather than invented production scores.',
    selectionLabel: 'Focus candidate',
    fallbackLabel: 'All illustrative candidate readings',
    focusedLabel: 'Focused profile',
    fieldLabels: ['Average fit', 'Fold stability', 'Engineering reading'],
    candidates: [
      {
        id: 'candidate-a',
        label: 'Candidate A',
        fit: 'Strong',
        stability: 'Uneven',
        reading: 'A strong average can hide large changes from one held-out fold to another.',
        decision: 'Do not advance on average fit alone; investigate the unstable folds and their operating conditions.',
      },
      {
        id: 'candidate-b',
        label: 'Candidate B',
        fit: 'Moderate',
        stability: 'Consistent',
        reading: 'Stable behavior can make a useful baseline even when another candidate has a stronger average.',
        decision: 'Keep as a comparison point and test whether its error is acceptable over the intended operating region.',
      },
      {
        id: 'candidate-c',
        label: 'Candidate C',
        fit: 'Strong',
        stability: 'Consistent',
        reading: 'This profile balances the two visible criteria without claiming that the model understands the plant.',
        decision: 'Advance to bounded system review, constraint checks, monitoring design, and operator-facing validation.',
      },
      {
        id: 'candidate-d',
        label: 'Candidate D',
        fit: 'Highest in this fixture',
        stability: 'Mixed',
        reading: 'The headline winner still carries uncertainty that an aggregate score does not explain.',
        decision: 'Investigate before use; peak fit does not override inconsistent evidence or operating-region gaps.',
      },
    ],
    defaultCandidateId: 'candidate-c',
    systemBoundaryLabel: 'What selection does not decide',
    systemBoundaryDetail:
      'A selected regression model contributes estimates to a bounded search. Constraint handling, system monitoring, and operator review remain separate responsibilities.',
  },
  {
    relationships: [
      {
        name: 'default model candidate',
        referencedIds: ['candidate-c'],
        targetIds: ['candidate-a', 'candidate-b', 'candidate-c', 'candidate-d'],
      },
    ],
  },
);

export const CLOSED_LOOP_PSO = validateVisualizationSpec<PsoSimulationContent>({
  id: 'closed-loop-pso',
  title: 'A swarm searches; an operator still decides',
  thesis:
    'The paused first frame shows a seeded set of candidate settings. Step or run the bounded illustration to see sampled positions retain better evidence and move toward promising regions.',
  headingLevel: 4,
  caption:
    'A user-controlled, seeded PSO illustration over an abstract candidate-setting surface. It shows exploration and convergence behavior without asserting a global optimum.',
  caveat:
    'The surface and particle positions are synthetic. The illustration does not reproduce plant telemetry, prove convergence, or authorize a plant action.',
  fixtureLabel: 'Seeded illustration',
  fixtureNote:
    'Sixteen particles explore one abstract two-dimensional slice of a bounded setting space. The real system evaluated candidate settings through the regression models and operating constraints.',
  processLabel: 'What one search iteration does',
  processSteps: [
    {
      id: 'sample',
      number: '01',
      title: 'Evaluate positions',
      detail: 'Treat each particle position as one candidate setting combination.',
    },
    {
      id: 'retain',
      number: '02',
      title: 'Retain better samples',
      detail: 'Each particle keeps its better sampled position; the swarm retains its best sampled position.',
    },
    {
      id: 'move',
      number: '03',
      title: 'Move and explore',
      detail: 'Particles move using their retained evidence while preserving some exploration inside the bounds.',
    },
    {
      id: 'stop',
      number: '04',
      title: 'Stop with a candidate',
      detail: 'The bounded run ends with a promising sampled candidate, not a guarantee or a command.',
    },
  ],
  searchSpaceLabel: 'Abstract candidate-setting search space',
  searchSpaceDescription:
    'Sixteen current sampled candidates move within a bounded synthetic surface. A separate marker identifies the best sampled candidate retained so far.',
  legendLabel: 'Search marker legend',
  particleLabel: 'Current sampled candidate',
  retainedLabel: 'Best sampled candidate retained so far',
  controlLabels: {
    step: 'Step once',
    run: 'Run bounded search',
    pause: 'Pause',
    reset: 'Reset',
    runAgain: 'Run again',
  },
  iterationLabel: 'Search iteration',
  initialStatus: 'Paused at the seeded starting positions.',
  runningStatus: 'The swarm is evaluating and moving candidate settings.',
  pausedStatus: 'Paused with the current sampled positions and retained candidate visible.',
  completeStatus: 'The bounded illustration has stopped with a retained candidate.',
  maxIterations: 24,
  operatorBoundaryLabel: 'Outside the simulation',
  operatorBoundaryDetail:
    'Constraint checks and plant-operator review determine whether a proposed setting is applied, held, or rejected.',
});

const CROSS_DOMAIN_QUESTIONS = [
  { id: 'observe', label: 'Observe' },
  { id: 'estimate', label: 'Estimate or transform' },
  { id: 'choose', label: 'Choose' },
  { id: 'act', label: 'Act' },
  { id: 'return', label: 'Return' },
] as const;

export const CLOSED_LOOP_ABSTRACTION = validateVisualizationSpec<AbstractionComparisonContent>(
  {
    id: 'closed-loop-abstraction',
    title: 'The questions transfer; the mechanisms do not',
    thesis:
      'The same review questions expose different actors, evidence, and stopping points across four domains. Similar labels do not create equivalent autonomy or control guarantees.',
    headingLevel: 3,
    caption:
      'A cross-domain comparison of observation, inference or transformation, choice, action, and return paths. Each row preserves its own operating limit.',
    caveat:
      'The comparison is a design heuristic. It is not a claim that document processing, financial calculation, enterprise workflows, and physical control are mathematically equivalent.',
    questions: CROSS_DOMAIN_QUESTIONS,
    rows: [
      {
        id: 'industrial',
        domain: 'Industrial combustion tuning',
        context: 'Physical system, 2016–2019',
        answers: [
          { questionId: 'observe', detail: 'Sensors record the current generating-unit state.' },
          { questionId: 'estimate', detail: '84 regression models estimate outcomes for candidate settings.' },
          { questionId: 'choose', detail: 'PSO proposes a bounded candidate setting.' },
          { questionId: 'act', detail: 'A plant operator applies, holds, or rejects the proposal.' },
          { questionId: 'return', detail: 'Linked observations support review after an applied action.' },
        ],
        limit: 'Later readings are evidence only when tied to what was proposed and actually applied; they do not create automatic learning or prove causality.',
      },
      {
        id: 'documents',
        domain: 'Document Intelligence',
        context: 'Document workflow, 2021–2022',
        answers: [
          { questionId: 'observe', detail: 'The pipeline receives document pages; components identify the relevant regions.' },
          { questionId: 'estimate', detail: 'Components detect, extract, or classify document elements.' },
          { questionId: 'choose', detail: 'A review workflow accepts, corrects, or routes structured output.' },
          { questionId: 'act', detail: 'A reviewer determines the usable downstream record.' },
          { questionId: 'return', detail: 'Corrections help only when captured at the relevant component and error type.' },
        ],
        limit: 'The 99.95% result applies to checkbox detection, not to the entire document pipeline or every classification decision.',
      },
      {
        id: 'finance',
        domain: 'Commodity Tax',
        context: 'Governed calculation workflow, 2022–2023',
        answers: [
          { questionId: 'observe', detail: 'The pipeline receives recorded General Ledger and reference data.' },
          { questionId: 'estimate', detail: 'Configured rules and arithmetic transform data; this is not model inference.' },
          { questionId: 'choose', detail: 'An analyst investigates evidence and decides whether correction is needed.' },
          { questionId: 'act', detail: 'The analyst corrects, reruns, and reviews the return candidate.' },
          { questionId: 'return', detail: 'Recorded corrections support the next governed rerun.' },
        ],
        limit: 'This is a deterministic calculation and correction cycle, not a learning optimizer or physical feedback controller.',
      },
      {
        id: 'model-assisted',
        domain: 'Model-assisted enterprise workflows',
        context: 'Human-reviewed application workflow',
        answers: [
          { questionId: 'observe', detail: 'The application receives a request and the evidence it is allowed to use.' },
          { questionId: 'estimate', detail: 'Models interpret requests or propose structured content inside controls.' },
          { questionId: 'choose', detail: 'The workflow clarifies, routes, or presents a candidate for review.' },
          { questionId: 'act', detail: 'An accountable user uses, revises, or rejects the output.' },
          { questionId: 'return', detail: 'Approval or correction is not training data by default.' },
        ],
        limit: 'Application controls and human review do not transfer the guarantees of deterministic computation or physical control theory.',
      },
    ],
    limitLabel: 'Operating limit',
    bottomLineLabel: 'Transfer rule',
    bottomLine:
      'Reuse the questions to locate evidence and responsibility. Re-establish the mechanisms, tests, and guarantees separately in every domain.',
  },
  {
    relationships: [
      ...['industrial', 'documents', 'finance', 'model-assisted'].map((rowId) => ({
        name: `${rowId} question coverage`,
        referencedIds: ['observe', 'estimate', 'choose', 'act', 'return'],
        targetIds: CROSS_DOMAIN_QUESTIONS.map((question) => question.id),
      })),
    ],
  },
);
