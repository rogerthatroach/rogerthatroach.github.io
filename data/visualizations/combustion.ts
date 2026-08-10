import { validateVisualizationSpec } from './validateVisualizationSpec';

export interface CombustionFigureBase {
  id: string;
  title: string;
  thesis: string;
  headingLevel: 2 | 3 | 4;
  caption: string;
  caveat?: string;
}

export interface CombustionInputGroup {
  id: string;
  label: string;
  value: string;
  detail: string;
  boundary: string;
  feedsStageIds: readonly string[];
  kind: 'observed' | 'controllable';
}

export interface CombustionProcessStage {
  id: string;
  number: string;
  system: string;
  title: string;
  detail: string;
  output: string;
  control: string;
}

export interface CombustionOperatorDecision {
  id: string;
  label: string;
  detail: string;
}

export interface CombustionCaseFlowContent extends CombustionFigureBase {
  scopeLabel: string;
  scopeDetail: string;
  partnershipLabel: string;
  partnershipDetail: string;
  inputHeading: string;
  inputGroups: readonly CombustionInputGroup[];
  processHeading: string;
  fieldLabels: readonly [string, string];
  stages: readonly CombustionProcessStage[];
  gateLabel: string;
  gateTitle: string;
  gateDetail: string;
  operatorDecisions: readonly CombustionOperatorDecision[];
  actionLabel: string;
  actionDetail: string;
  feedbackLabel: string;
  feedbackDetail: string;
}

export const COMBUSTION_CASE_FLOW: CombustionCaseFlowContent = {
  id: 'combustion-case-flow',
  title: 'From plant observations to an operator-gated adjustment',
  thesis:
    'Observed measurements describe the unit. Controllable settings are bounded candidates. Models and optimization connect the two, but plant operators decide whether any recommendation becomes an adjustment.',
  headingLevel: 3,
  caption:
    'The combustion-tuning recommendation path for one Maizuru generating unit. Observed plant state and controllable settings remain distinct, and later readings support review rather than autonomous control or model updating.',
  caveat:
    'This is a system-responsibility schematic, not live plant telemetry. It shows no automatic actuation, guaranteed optimum, or automatic model update.',
  scopeLabel: 'Plant scope',
  scopeDetail:
    'One 900 MW generating unit at Kansai Electric’s 1,800 MW Maizuru coal-fired power station in Japan.',
  partnershipLabel: 'Operating boundary',
  partnershipDetail:
    'Kansai Electric owns and operates the station. MHPS was the engineering and equipment partner.',
  inputHeading: 'Keep the two input roles separate',
  inputGroups: [
    {
      id: 'observed-state',
      label: 'Observed measurements',
      value: '90+ plant sensors',
      detail:
        'Temperature, pressure, flow, and emissions-related signals describe the unit’s operating state.',
      boundary: 'Read as evidence; these measurements are not settings the optimizer can change.',
      feedsStageIds: ['prepare'],
      kind: 'observed',
    },
    {
      id: 'controllable-settings',
      label: 'Controllable settings',
      value: 'Configured adjustment ranges',
      detail:
        'Candidate values represent plant parameters that can be evaluated within defined limits.',
      boundary: 'Search variables only; a candidate is not a command to the plant.',
      feedsStageIds: ['estimate', 'search'],
      kind: 'controllable',
    },
  ],
  processHeading: 'Recommendation path',
  fieldLabels: ['Produces', 'Control'],
  stages: [
    {
      id: 'prepare',
      number: '01',
      system: 'Feature preparation',
      title: 'Represent the current operating state',
      detail:
        'Clean and transform sensor history and the current observations into model-ready features.',
      output: 'A consistent observed-state representation.',
      control: 'Preserve the distinction between measurements and adjustable parameters.',
    },
    {
      id: 'estimate',
      number: '02',
      system: '84 regression models',
      title: 'Estimate candidate outcomes',
      detail:
        'Independent regression models estimate emissions and efficiency behavior for the observed state and a candidate setting combination.',
      output: 'Comparable estimates for the relevant plant outputs.',
      control: 'Each model remains scoped to its prediction target and validated inputs.',
    },
    {
      id: 'search',
      number: '03',
      system: 'Particle Swarm Optimization',
      title: 'Search the bounded setting space',
      detail:
        'PSO explores candidate combinations and uses the regression estimates to compare competing objectives.',
      output: 'Promising candidates within the configured search space.',
      control: 'Configured ranges and constraints limit what can be proposed; the search does not guarantee a global optimum.',
    },
    {
      id: 'recommend',
      number: '04',
      system: 'Recommendation surface',
      title: 'Present candidate settings for review',
      detail:
        'The system returns candidate settings for operators to assess against the current unit state.',
      output: 'A recommendation, not a plant-control instruction.',
      control: 'No candidate crosses the action boundary without operator judgment.',
    },
  ],
  gateLabel: 'Final action gate',
  gateTitle: 'Plant operators retain the decision',
  gateDetail:
    'Operators assess the candidate against current unit conditions and operating knowledge before deciding what happens next.',
  operatorDecisions: [
    {
      id: 'apply',
      label: 'Apply',
      detail: 'Apply an adjustment through the plant’s operating process.',
    },
    {
      id: 'hold',
      label: 'Hold',
      detail: 'Leave the current settings unchanged.',
    },
    {
      id: 'respond-differently',
      label: 'Choose another response',
      detail: 'Use operator judgment when the recommendation does not fit the present context.',
    },
  ],
  actionLabel: 'Plant action',
  actionDetail:
    'A setting changes only through the operator-controlled operating process.',
  feedbackLabel: 'Later observations',
  feedbackDetail:
    'Subsequent sensor readings can be compared with what was proposed and applied. That return path supports review; it does not by itself retrain a model or close an autonomous control loop.',
};

validateVisualizationSpec(COMBUSTION_CASE_FLOW, {
  relationships: [
    ...COMBUSTION_CASE_FLOW.inputGroups.map((input) => ({
      name: `inputGroups[id=${input.id}].feedsStageIds`,
      referencedIds: input.feedsStageIds,
      targetIds: COMBUSTION_CASE_FLOW.stages.map((stage) => stage.id),
    })),
  ],
});
