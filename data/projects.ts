import {
  DIGITAL_TWIN_SAVINGS,
  HUMANA_ACCURACY,
  COMMODITY_TAX_EFFICIENCY,
  AEGIS_V2_BUILD_TIME,
  ASTRAEUS_COST_CENTRES,
  PAR_ASSIST_SCALE,
} from './canonical';

export interface ProjectPalette {
  /** Bright/saturated — used for text in dark mode, and for tinted bg/border
   *  in both modes. Usually a Tailwind 500-series color. */
  primary: string;
  /** Darker variant — used for text in light mode to meet WCAG AA (4.5:1)
   *  against the light background. Usually a Tailwind 700-series color. */
  primaryLight: string;
  glow: string;
  bg: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  stack: string[];
  heroMetric: { value: string; label: string };
  caption: string;
  description: string;
  highlights: string[];
  palette: ProjectPalette;
  deepDivePath?: string;
}

/**
 * Projects defined in chronological order (oldest → newest) so the arc
 * narrative reads cleanly in source. Exported reversed at the end so
 * consumers see latest-first (PAR Assist → Combustion Tuning), which is
 * what recruiters and skimmers expect.
 */
const PROJECTS_CHRONOLOGICAL: Project[] = [
  // Arc 1: Foundation (2016-2019)
  {
    id: 'combustion-tuning',
    title: 'Combustion Tuning',
    subtitle: 'Digital Twin — Maizuru 900MW Unit',
    role: 'Data Scientist — 3-person TCS R&D team with MHPS engineering partner',
    stack: ['R', 'Python', 'PSO', 'Regression', 'K-Fold CV'],
    heroMetric: { value: DIGITAL_TWIN_SAVINGS, label: 'Annual Savings' },
    caption:
      '$3M/year in savings on one 900MW generating unit at Kansai Electric’s 1,800MW Maizuru coal-fired power station in Japan. Built the ML + optimization stack — 84 regression models, 90+ sensors, and Particle Swarm Optimization producing candidate settings for plant-operator review.',
    description:
      'ML-powered Digital Twin for one 900MW generating unit at the Maizuru coal-fired power station. Built predictive models of combustion behavior and a bounded search process that proposed settings for operator review.',
    highlights: [
      '90+ plant sensors → feature engineering → 84 independent regression models',
      'Rigorous model selection: k-fold cross-validation, R², RMSE, MAPE, fold variance stability',
      'Particle Swarm Optimization: models as objective functions, exploring input space to minimize emissions',
      'Human-gated loop: model-recommended candidate settings → plant-operator review → $3M/year saved',
    ],
    palette: { primary: '#fca5a5', primaryLight: '#991b1b', glow: 'shadow-red-500/20', bg: 'from-red-500/5' },
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
      '99.95% checkbox-detection accuracy for Humana — up from a ~70% Document AI-only baseline for that task. Hybrid pipeline: Document AI OCR, OpenCV pixel-level detection, Random Forest classification on BigTable + BigQuery.',
    description:
      'End-to-end document verification pipeline on Google Cloud. Led the checkbox-detection breakthrough for Humana: layered OpenCV pixel-level detection and Random Forest classification on top of Document AI OCR to improve that component from ~70% to 99.95%.',
    highlights: [
      'Hybrid pipeline: Document AI OCR → OpenCV pixel-level checkbox detection → Random Forest classification — 99.95% checkbox-detection accuracy (up from a ~70% Document AI-only baseline for that task)',
      'Vertex AI deployment: custom and AutoML models for document classification and entity extraction',
      'BigTable + BigQuery backbone for ingestion and analytics at scale',
      'Parallel workstream: multi-million-row inventory analytics with SQL and Tableau for enterprise retail clients',
    ],
    palette: { primary: '#67e8f9', primaryLight: '#155e75', glow: 'shadow-cyan-500/20', bg: 'from-cyan-500/5' },
    deepDivePath: '/projects/document-intelligence',
  },
  // Arc 3: Enterprise Analytics (2022-2023)
  {
    id: 'commodity-tax',
    title: 'Commodity Tax',
    subtitle: 'Process Automation — RBC CFO Group',
    role: 'Lead developer + stakeholder engagement',
    stack: ['PySpark', 'Tableau', 'General Ledger Extraction'],
    heroMetric: { value: COMMODITY_TAX_EFFICIENCY, label: 'Processing Time' },
    caption:
      'Overhauled the Commodity Tax return process from a multi-month manual workflow to a 90-minute automated pipeline. The win that built CFO stakeholder trust and opened the door to AI.',
    description:
      'Transformed the Commodity Tax return process with PySpark pipelines and Tableau dashboards for financial KPI monitoring.',
    highlights: [
      'PySpark pipeline for General Ledger Journal data extraction at scale',
      'Tableau dashboards for financial KPI monitoring (CFO Group adoption vehicle)',
      'Recognized with CFO Group RBC Quarterly Team Award (Q4 2023)',
    ],
    palette: { primary: '#fcd34d', primaryLight: '#92400e', glow: 'shadow-amber-500/20', bg: 'from-amber-500/5' },
    deepDivePath: '/projects/commodity-tax',
  },
  // Arc 4: Intelligent Systems (2024-present)
  {
    id: 'aegis',
    title: 'Aegis v2',
    subtitle: 'Text-to-SQL Peer Benchmarking — RBC CFO Group',
    role: 'Built v1 end-to-end; refactored its benchmarking module for v2 in a 2-week concurrent sprint',
    stack: ['Text-to-SQL', 'Embeddings', 'Similarity Search', 'Intent Parsing'],
    heroMetric: { value: AEGIS_V2_BUILD_TIME, label: 'v1 → v2 refactor' },
    caption:
      'Canadian Big 6 bank peer-benchmarking engine. v1 (Sr DS, solo): built end-to-end to automate extraction and matching despite quarterly Supplementary Financial Package schema shifts, breaking the long-standing peer-analysis bottleneck. v2 (Lead, 2-week concurrent refactor sprint, run in parallel with Astraeus and the Amplify intern program): refactored the v1 benchmarking module into multi-stage RAG with multi-gate query parsing across bank, parameter, platform, and time-period, plus a text-to-SQL layer over rich KPI metadata and embeddings. My direct report and the broader team integrated and productionalized it as Aegis v2. CFO One RBC Team Award (2025) for v1.',
    description:
      'Strategic peer-benchmarking engine for the CFO Group, leveraging Supplementary Financial Package data from the Big 6 Canadian banks. v1 was a solo end-to-end build that automated SFP extraction and matching across quarterly schema shifts. The v2 refactor added multi-stage RAG with multi-gate query parsing, plus text-to-SQL with KPI disambiguation.',
    highlights: [
      'v1 (Sr DS, solo): automated SFP extraction and matching across Big 6 Canadian banks despite quarterly schema shifts, breaking the long-standing peer-analysis bottleneck. CFO One RBC Team Award (2025).',
      'v2 (Lead, 2-week concurrent refactor sprint): refactored the v1 benchmarking module into multi-stage RAG with multi-gate query parsing across bank, parameter, platform, time-period, plus text-to-SQL over rich KPI metadata and embeddings. Integrated and productionalized by my direct report with the broader team.',
      'Intent parsing and query decomposition into logical sub-parts; KPI detection via embeddings-based similarity search for near-duplicate names.',
      'Guarded LLM-assisted disambiguation: pinpoints intended KPI without exposing sensitive data.',
      'Guardrails: whitelisting, parameterization, testability.',
    ],
    palette: { primary: '#93c5fd', primaryLight: '#1e40af', glow: 'shadow-blue-500/20', bg: 'from-blue-500/5' },
    deepDivePath: '/projects/aegis',
  },
  {
    id: 'astraeus',
    title: 'Astraeus',
    subtitle: 'Financial Insights & Analysis Suite — RBC CFO Group',
    role: 'Conceived, architected, and built; led cross-functional productionisation',
    stack: ['LLM router', 'Custom Python router', 'Cython compute', 'Transactional storage', 'EPM'],
    heroMetric: { value: ASTRAEUS_COST_CENTRES, label: 'Cost centres' },
    caption:
      'Production analytics platform for RBC\'s CFO Group. Days of email back-and-forth were replaced by interactive analysis across headcount, compensation costs, and open positions at bank scale. LLM-facing stages operate on scoped metadata and approved aggregates; entitlement and event-level ins-outs computation run in Cython-compiled Python over ~40K leaf-level cost centres.',
    description:
      'Production platform for CFO-level financial insights — headcount analytics, compensation costs, open positions — delivered via dashboard, chatbot, and inbox-ready reports.',
    highlights: [
      'Two-wall architecture: LLM calls handle gate / metadata extraction / answer / synthesis; deterministic Cython-compiled Python handles entitlement + compute. Typed boundaries are intended to keep record-level operational inputs out of model calls.',
      '5 to 8 LLM calls per query across four stages (1 gate + 3 parallel metadata extractions + 1-or-3 answer + 0-or-1 synthesis), with model inputs limited to scoped metadata or structured aggregates. Cross-domain queries fan out to 3 parallel Answer-stage calls (Compensation Costs / Headcount / Open Positions) before a final synthesis.',
      'Event-level ins-outs math: employees are modeled as join, leave, and transfer events; netting semantics fold intra-rollup moves to net zero. This supports dynamic combination analysis that previous attempts had scoped out at this scale.',
      'Permission cascade (domain permissions → access groups → employees → leaf-level cost centres → SQL tables) resolves the allowed input set before compute, with validation and structured logs at the handoffs.',
      '~40K cost-centre leaves shared by two hierarchies: ~9K rollups in the 18-level business-segment hierarchy, plus a separate geography hierarchy.',
      'Transactional storage supports event, entitlement, hierarchy, and trace records for the controlled path.',
    ],
    palette: { primary: '#93c5fd', primaryLight: '#1e40af', glow: 'shadow-blue-500/20', bg: 'from-blue-500/5' },
    deepDivePath: '/projects/astraeus',
  },
  {
    id: 'par-assist',
    title: 'PAR Assist',
    subtitle: 'Enterprise Agentic AI Platform — RBC CFO Group',
    role: 'Conceived, architected, and built end-to-end',
    stack: ['LangGraph', 'MCP', 'Transactional state', 'Vector-backed retrieval', 'Foundation-model API'],
    heroMetric: { value: PAR_ASSIST_SCALE, label: 'May 2026 launch' },
    caption:
      'The first true agentic AI platform approved for production at the bank; launched across the full CFO Group in all geographies in May 2026. Single-agent governance envelope, LangGraph orchestration, template-as-MCP-tool dialog, bounded field-group retrieval, parallel scoped extraction, ownership-aware merge, and a coverage + follow-ups loop.',
    description:
      'Drafting tool for Project Approval Requests — a critical governance process — launched across RBC’s full CFO Group in all geographies. Acts as a personal assistant guiding users through each step, utilizing metadata, rules, policies, historical examples, and best practices.',
    highlights: [
      'First true agentic AI platform approved for production at the bank — branching dialog and bounded concurrent extraction inside a single-agent governance envelope',
      'Two-stage field-group retrieval: stage 1 selects relevant groups; stage 2 retrieves a bounded candidate set within each group before scoped extraction',
      'Parallel group-scoped extraction with one expected owner per target field, explicit collision handling, and a coverage loop for unresolved inputs',
      'MCP tools provide typed action boundaries and structured dispatch records through LangGraph. Transactional storage supports retained workflow state, embeddings, and trace records.',
      'Concept handed to 2025 Amplify interns as an ideation exercise to explore the problem space; production platform conceived, architected, and built end-to-end thereafter.',
    ],
    palette: { primary: '#93c5fd', primaryLight: '#1e40af', glow: 'shadow-blue-500/20', bg: 'from-blue-500/5' },
    deepDivePath: '/projects/par-assist',
  },
];

export const PROJECTS: Project[] = [...PROJECTS_CHRONOLOGICAL].reverse();
