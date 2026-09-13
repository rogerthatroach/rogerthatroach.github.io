import {
  COMMODITY_TAX_EFFICIENCY,
  DIGITAL_TWIN_SAVINGS,
  DRAFTING_PLATFORM_NAME,
  FINANCIAL_BENCHMARKING_NAME,
  HUMANA_ACCURACY,
  HUMANA_BASELINE_ACCURACY,
  FUNDING_REQUEST_DRAFTING_SCALE,
  WORKFORCE_ANALYTICS_BUILD_WINDOW,
  WORKFORCE_ANALYTICS_NAME,
} from './canonical';

export interface ProjectPalette {
  /** Bright/saturated — used for text in dark mode, and for tinted bg/border
   *  in both modes. Usually a Tailwind 500-series color. */
  primary: string;
  /** Darker variant — used for text in light mode to meet WCAG AA (4.5:1)
   *  against the light background. Usually a Tailwind 700-series color. */
  primaryLight: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  stack: string[];
  heroMetric: { value: string; label: string };
  caption: string;
  palette: ProjectPalette;
  deepDivePath?: string;
}

/**
 * Projects defined in chronological order (oldest → newest) so the arc
 * narrative reads cleanly in source. Exported reversed at the end so
 * consumers see latest-first (AI/LLM Drafting → Combustion Tuning), which is
 * what recruiters and skimmers expect.
 */
const PROJECTS_CHRONOLOGICAL: Project[] = [
  // Arc 1: Foundation (2016-2019)
  {
    id: 'combustion-tuning',
    title: 'Combustion Tuning',
    subtitle: 'Digital Twin — Maizuru 900 MW Unit',
    role: 'Data Scientist — TCS R&D with MHPS engineering partner',
    stack: ['R', 'Python', 'PSO', 'Regression'],
    heroMetric: { value: DIGITAL_TWIN_SAVINGS, label: 'Annual Savings' },
    caption:
      'Built the ML and optimization path for one 900 MW Maizuru unit: 84 regression models and PSO proposed bounded settings for operator review.',
    palette: { primary: '#fca5a5', primaryLight: '#991b1b' },
    deepDivePath: '/projects/combustion-tuning',
  },
  // Arc 2: Cloud ML (2021-2022)
  {
    id: 'document-intelligence',
    title: 'Document Intelligence',
    subtitle: 'Cloud ML Pipeline — Insurance & Financial Services',
    role: 'ML Engineer — Quantiphi / Google Cloud partnership',
    stack: ['GCP', 'Vertex AI', 'Document AI', 'OpenCV', 'Random Forest'],
    heroMetric: { value: HUMANA_ACCURACY, label: 'Checkbox Accuracy' },
    caption:
      `Implemented a specialized visual path that improved checkbox-detection accuracy from a ${HUMANA_BASELINE_ACCURACY} Document AI-only baseline to ${HUMANA_ACCURACY}.`,
    palette: { primary: '#67e8f9', primaryLight: '#155e75' },
    deepDivePath: '/projects/document-intelligence',
  },
  // Arc 3: Enterprise Analytics (2022-2023)
  {
    id: 'commodity-tax',
    title: 'Commodity Tax',
    subtitle: 'Process Automation — RBC CFO Group',
    role: 'Lead developer + stakeholder engagement',
    stack: ['Dataiku', 'Python', 'PySpark', 'Excel', 'Tableau'],
    heroMetric: { value: COMMODITY_TAX_EFFICIENCY, label: 'Processing Time' },
    caption:
      'Reduced a months-long Commodity Tax workflow to 90 minutes with Python and Spark in Dataiku, saved run data, Excel reports, and dynamic dashboards.',
    palette: { primary: '#fcd34d', primaryLight: '#92400e' },
    deepDivePath: '/projects/commodity-tax',
  },
  // Arc 4: Intelligent Systems (2024-present)
  {
    id: 'financial-peer-benchmarking',
    title: `${FINANCIAL_BENCHMARKING_NAME}`,
    subtitle: 'Guarded Text-to-SQL — RBC CFO Group',
    role: 'Built v1 end-to-end; refactored its benchmarking module for v2 in a 2-week concurrent sprint',
    stack: ['Text-to-SQL', 'Embeddings', 'Similarity Search', 'Intent Parsing'],
    heroMetric: { value: 'Production', label: 'v1 + v2, one product' },
    caption:
      'Built the first version end to end, then refactored its benchmarking module into the five-stage v2 path integrated by the production team.',
    palette: { primary: '#93c5fd', primaryLight: '#1e40af' },
    deepDivePath: '/projects/financial-peer-benchmarking',
  },
  {
    id: 'workforce-analytics',
    title: WORKFORCE_ANALYTICS_NAME,
    subtitle: 'Model-Routed Financial Analytics — RBC CFO Group',
    role: 'Conceived, architected, and built; led cross-functional productionisation',
    stack: ['LLM routing', 'Python', 'Cython', 'SQL', 'Entitlement controls'],
    heroMetric: { value: WORKFORCE_ANALYTICS_BUILD_WINDOW, label: 'Build to production launch' },
    caption:
      'Conceived, architected, and built a production analytics platform that keeps entitlement and calculation in code while models handle bounded language tasks.',
    palette: { primary: '#93c5fd', primaryLight: '#1e40af' },
    deepDivePath: '/projects/workforce-analytics',
  },
  {
    id: 'funding-request-drafting',
    title: `${DRAFTING_PLATFORM_NAME}`,
    subtitle: 'Reviewed Agentic Workflow — RBC CFO Group',
    role: 'Conceived, architected, and built end-to-end',
    stack: ['LangGraph', 'MCP', 'Semantic retrieval', 'Foundation-model API'],
    heroMetric: { value: FUNDING_REQUEST_DRAFTING_SCALE, label: 'May 2026 launch' },
    caption:
      'The platform uses one orchestration graph, bounded tool routines, scoped evidence, coverage checks, and author review to support project funding request drafting.',
    palette: { primary: '#93c5fd', primaryLight: '#1e40af' },
    deepDivePath: '/projects/funding-request-drafting',
  },
];

export const PROJECTS: Project[] = [...PROJECTS_CHRONOLOGICAL].reverse();
