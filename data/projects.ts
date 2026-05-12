import {
  DIGITAL_TWIN_SAVINGS,
  HUMANA_ACCURACY,
  COMMODITY_TAX_EFFICIENCY,
  AEGIS_V2_BUILD_TIME,
  ASTRAEUS_FACTORIAL_COMBINATIONS,
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
    subtitle: 'Digital Twin — 900MW Coal Plant',
    role: 'ML Engineer — 3-person R&D team (MHPS / TCS)',
    stack: ['R', 'Python', 'PSO', 'Multi-Output Regression', 'K-Fold CV'],
    heroMetric: { value: DIGITAL_TWIN_SAVINGS, label: 'Annual Savings' },
    caption:
      '$3M/year in fuel savings at a 900MW coal plant in Japan, plus measurable NOx, SOx, CO reductions. Built the ML + optimization stack — 84 models, 90+ sensors, Particle Swarm Optimization in closed loop with plant operators.',
    description:
      'ML-powered Digital Twin for Maizuru 900MW coal power plant. Built predictive models to optimize combustion, reduce emissions, and improve efficiency.',
    highlights: [
      '90+ plant sensors → feature engineering → 84 simultaneous ML regression models',
      'Rigorous model selection: k-fold cross-validation, R², RMSE, MAPE, fold variance stability',
      'Particle Swarm Optimization: models as objective functions, exploring input space to minimize emissions',
      'Closed-loop: optimal settings → plant operators adjust → $3M/yr saved + reduced NOx/SOx/CO',
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
      '99.95% accuracy on checkbox verification for Humana — up from ~70% with Document AI alone. Hybrid pipeline: Document AI OCR, OpenCV pixel-level detection, Random Forest classification on BigTable + BigQuery.',
    description:
      'End-to-end document verification pipeline on Google Cloud. Led the accuracy breakthrough for Humana: layered OpenCV pixel-level checkbox detection and Random Forest classification on top of Document AI OCR to take verification from ~70% to 99.95%.',
    highlights: [
      'Hybrid accuracy pipeline: Document AI OCR → OpenCV pixel-level checkbox detection → Random Forest classification — 99.95% on Humana checkbox verification (up from ~70% with Document AI alone)',
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
    role: 'Conceived and built end-to-end: v1 (Sr DS, solo) and v2 (Lead, 2-week solo sprint)',
    stack: ['Text-to-SQL', 'Embeddings', 'Similarity Search', 'Intent Parsing'],
    heroMetric: { value: AEGIS_V2_BUILD_TIME, label: 'v2 solo build' },
    caption:
      'Canadian Big 6 bank peer-benchmarking engine, conceived and built end-to-end. v1 (Sr DS, solo): automated extraction and matching despite quarterly Supplementary Financial Package schema shifts, breaking the long-standing peer-analysis bottleneck. v2 (Lead, 2-week solo sprint, run in parallel with Astraeus and the Amplify intern program): multi-stage RAG with multi-gate query parsing across bank, parameter, platform, and time-period, plus a text-to-SQL layer over rich KPI metadata and embeddings. v2 productionalized by direct report. CFO One RBC Team Award (2025) for v1.',
    description:
      'Strategic peer-benchmarking engine for the CFO Group, leveraging Supplementary Financial Package data from the Big 6 Canadian banks. v1 was a solo end-to-end build that automated SFP extraction and matching across quarterly schema shifts. v2 added a multi-stage RAG with multi-gate query parsing, plus text-to-SQL with KPI disambiguation.',
    highlights: [
      'v1 (Sr DS, solo): automated SFP extraction and matching across Big 6 Canadian banks despite quarterly schema shifts, breaking the long-standing peer-analysis bottleneck. CFO One RBC Team Award (2025).',
      'v2 (Lead, 2-week solo sprint): multi-stage RAG with multi-gate query parsing across bank, parameter, platform, time-period, plus text-to-SQL over rich KPI metadata and embeddings. Productionalized by direct report.',
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
    role: 'Conceived, architected, and built end-to-end',
    stack: ['GPT-4.1', 'Custom Python router', 'Cython compute', 'Postgres', 'EPM'],
    heroMetric: { value: ASTRAEUS_FACTORIAL_COMBINATIONS, label: 'Factorial Combinations' },
    caption:
      'Production analytics platform for RBC\'s CFO Group. Days of email back-and-forth replaced by seconds-level answers — across headcount, HR costs, and open positions at bank scale. LLM never touches operational data by construction; event-level ins-outs math runs in Cython-compiled Python, milliseconds over ~40K leaf-level events.',
    description:
      'Production-grade platform for CFO-level financial insights — headcount analytics, HR costs, open positions — delivered via dashboard, chatbot, and inbox-ready reports.',
    highlights: [
      'Two-wall architecture: GPT-4.1 handles parse / route / metadata extraction / synthesis; deterministic Cython-compiled Python handles entitlement + compute. LLM never sees operational data.',
      'Up to 6 LLM calls per query (1 parse + 1 route + up to 3 metadata + 1–3 synthesis) — all on schemas and aggregates, never on rows. In-scope queries fan out to up to 3 final parallel subagents (entitlement / Headcount / Open Positions) then combined.',
      'Event-level ins-outs math: employees modeled as join / leave / transfer events, netting semantics fold intra-rollup moves to net-zero. Enables dynamic arbitrary-combination analysis previously deemed impossible at this scale.',
      'Permission cascade (domain permissions → access groups → employees → leaf-level events → SQL tables) applied before compute — users see only what they\'re authorized to see, structurally.',
      '~40K leaf-level events and ~9K parent rollups, with millisecond-level slicing across any time window.',
      'Single Postgres backbone for event log, entitlement catalog, hierarchies, and audit trail.',
    ],
    palette: { primary: '#93c5fd', primaryLight: '#1e40af', glow: 'shadow-blue-500/20', bg: 'from-blue-500/5' },
    deepDivePath: '/projects/astraeus',
  },
  {
    id: 'par-assist',
    title: 'PAR Assist',
    subtitle: 'Enterprise Agentic AI Platform — RBC Bank-wide',
    role: 'Conceived, architected, and built end-to-end',
    stack: ['LangGraph', 'MCP', 'PostgreSQL + pgvector', 'Sonnet 4.5', 'Field-group RAG'],
    heroMetric: { value: PAR_ASSIST_SCALE, label: 'Target Scale' },
    caption:
      'The bank’s first true agentic AI platform. Single-agent governance envelope, LangGraph on Postgres, template-as-MCP-tool with decision-tree dialog, two-stage field-group retrieval, N parallel Sonnet-4.5 extraction calls merging as dict-union, coverage + follow-ups loop.',
    description:
      'Enterprise-wide drafting tool for Project Approval Requests — a critical governance process. Acts as a personal assistant guiding users through each step, utilizing metadata, rules, policies, historical examples, and best practices.',
    highlights: [
      'First agentic framework approved for production at the bank — agentic behaviour (branching dialog, N parallel extraction) inside a single-agent governance envelope',
      'Two-stage field-group retrieval: stage-1 picks relevant field groups, stage-2 retrieves top-10 chunks per group, custom compression feeds Sonnet-4.5 calls',
      'N parallel extraction calls (one per relevant group, ≤20 fields + guardrails + few-shot good/bad per prompt) merging as a deterministic dict-union',
      'Every action is a typed MCP tool dispatched through LangGraph — auditability structural, not aspirational. One Postgres store for state, logs, embeddings, and audit trail.',
      'Concept handed to 2025 Amplify interns as an ideation exercise to explore the problem space; production platform conceived, architected, and built end-to-end thereafter.',
    ],
    palette: { primary: '#93c5fd', primaryLight: '#1e40af', glow: 'shadow-blue-500/20', bg: 'from-blue-500/5' },
    deepDivePath: '/projects/par-assist',
  },
];

export const PROJECTS: Project[] = [...PROJECTS_CHRONOLOGICAL].reverse();
