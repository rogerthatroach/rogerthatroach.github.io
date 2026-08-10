import { validateVisualizationSpec } from './validateVisualizationSpec';

export interface DocumentIntelligenceFigureBase {
  id: string;
  title: string;
  thesis: string;
  caption: string;
  caveat?: string;
  headingLevel?: 2 | 3 | 4;
}

export interface DocumentSpecimenRegion {
  id: string;
  kind: 'context' | 'checkbox';
  label: string;
  content: string;
  treatment: string;
  checkboxState?: 'marked' | 'clear';
  checkboxStateLabel?: string;
}

export interface DocumentSpecimen {
  id: string;
  label: string;
  title: string;
  note: string;
  regions: readonly DocumentSpecimenRegion[];
}

export interface DocumentProcessingStage {
  id: string;
  number: string;
  tool: string;
  title: string;
  detail: string;
  scope: string;
  output: string;
  sourceRegionIds: readonly string[];
}

export interface DocumentMetricScope {
  id: string;
  title: string;
  thesis: string;
  measuredTaskLabel: string;
  measuredTask: string;
  comparisonLabel: string;
  baselineLabel: string;
  baselineValue: string;
  resultLabel: string;
  resultValue: string;
  exclusionsLabel: string;
  exclusions: readonly string[];
  note: string;
}

export interface DocumentIntelligenceSpecimenContent extends DocumentIntelligenceFigureBase {
  specimen: DocumentSpecimen;
  flowLabel: string;
  stageFieldLabels: Readonly<{
    scope: string;
    output: string;
  }>;
  stages: readonly DocumentProcessingStage[];
  metricScope: DocumentMetricScope;
}

export const DOCUMENT_INTELLIGENCE_SPECIMEN: DocumentIntelligenceSpecimenContent = {
  id: 'document-intelligence-specimen',
  title: 'Document context stays intact while one element type takes a specialized path',
  thesis:
    'In Humana\'s 2021–22 workflow, Document AI supplied OCR and structure; OpenCV localized checkbox regions, Random Forest classified their state, and the result was rejoined with the document.',
  caption:
    'An illustrative, non-client form showing the component boundary: Document AI provides text and layout context, OpenCV and Random Forest handle checkbox regions, and the classified states return to the document structure.',
  caveat:
    'This is a responsibility map, not a deployment topology. The synthetic form and sequence omit storage, platform, and client-specific implementation detail.',
  headingLevel: 3,
  specimen: {
    id: 'synthetic-form',
    label: 'Synthetic document specimen',
    title: 'Structured form',
    note: 'Illustrative layout only; not a client document.',
    regions: [
      {
        id: 'section-heading',
        kind: 'context',
        label: 'Text region',
        content: 'Section heading',
        treatment: 'Retained as OCR and layout context',
      },
      {
        id: 'instruction-text',
        kind: 'context',
        label: 'Instruction region',
        content: 'Select one applicable response',
        treatment: 'Retained as OCR and layout context',
      },
      {
        id: 'response-a',
        kind: 'checkbox',
        label: 'Checkbox region',
        content: 'Response A',
        treatment: 'Sent through the specialized checkbox path',
        checkboxState: 'marked',
        checkboxStateLabel: 'Marked',
      },
      {
        id: 'response-b',
        kind: 'checkbox',
        label: 'Checkbox region',
        content: 'Response B',
        treatment: 'Sent through the specialized checkbox path',
        checkboxState: 'clear',
        checkboxStateLabel: 'Clear',
      },
    ],
  },
  flowLabel: 'Processing sequence',
  stageFieldLabels: {
    scope: 'Element in scope',
    output: 'Stage output',
  },
  stages: [
    {
      id: 'recover-context',
      number: '01',
      tool: 'Document AI',
      title: 'Recover page context',
      detail: 'Read the page text and retain its structural regions.',
      scope: 'Document text and layout',
      output: 'OCR text and structural context',
      sourceRegionIds: ['section-heading', 'instruction-text', 'response-a', 'response-b'],
    },
    {
      id: 'localize-checkboxes',
      number: '02',
      tool: 'OpenCV',
      title: 'Localize checkbox regions',
      detail: 'Use pixel-level processing on the document image to isolate checkbox regions.',
      scope: 'Document image pixels',
      output: 'Localized checkbox regions and their document positions',
      sourceRegionIds: ['response-a', 'response-b'],
    },
    {
      id: 'classify-state',
      number: '03',
      tool: 'Random Forest',
      title: 'Classify checkbox state',
      detail: 'Classify engineered visual features as checked or unchecked.',
      scope: 'Engineered features from localized checkbox regions',
      output: 'A classified state for each checkbox region',
      sourceRegionIds: ['response-a', 'response-b'],
    },
    {
      id: 'reintegrate',
      number: '04',
      tool: 'Document workflow',
      title: 'Rejoin the document',
      detail: 'Attach each classified state to its original form location.',
      scope: 'Classified checkbox states plus retained document context',
      output: 'Structured form data with surrounding context preserved',
      sourceRegionIds: ['section-heading', 'instruction-text', 'response-a', 'response-b'],
    },
  ],
  metricScope: {
    id: 'document-intelligence-metric-scope',
    title: 'Keep the result attached to its measured task',
    thesis:
      'The comparison covers one component of the larger document workflow, not the workflow as a whole.',
    measuredTaskLabel: 'Measured task',
    measuredTask: 'Checkbox detection',
    comparisonLabel: 'Same task, two implementations',
    baselineLabel: 'Document AI-only baseline',
    baselineValue: '~70%',
    resultLabel: 'Hybrid checkbox component',
    resultValue: '99.95%',
    exclusionsLabel: 'Not measured by this result',
    exclusions: [
      'OCR accuracy',
      'Entity-extraction accuracy',
      'End-to-end document-pipeline accuracy',
    ],
    note:
      'The 99.95% figure applies only to checkbox detection; it does not describe these adjacent tasks or the complete pipeline.',
  },
};

validateVisualizationSpec(DOCUMENT_INTELLIGENCE_SPECIMEN, {
  relationships: DOCUMENT_INTELLIGENCE_SPECIMEN.stages.map((stage) => ({
    name: `stages[id=${stage.id}].sourceRegionIds`,
    referencedIds: stage.sourceRegionIds,
    targetIds: DOCUMENT_INTELLIGENCE_SPECIMEN.specimen.regions.map((region) => region.id),
  })),
});
