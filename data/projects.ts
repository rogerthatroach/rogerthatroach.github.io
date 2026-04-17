import {
  DIGITAL_TWIN_SAVINGS,
  HUMANA_ACCURACY,
  COMMODITY_TAX_EFFICIENCY,
  AEGIS_V2_BUILD_TIME,
  ASTRAEUS_FACTORIAL_COMBINATIONS,
  PAR_ASSIST_SCALE,
} from './canonical';

export interface ProjectPalette {
  primary: string;
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

export const PROJECTS: Project[] = [
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
    palette: { primary: '#f59e0b', glow: 'shadow-amber-500/20', bg: 'from-amber-500/5' },
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
    palette: { primary: '#06b6d4', glow: 'shadow-cyan-500/20', bg: 'from-cyan-500/5' },
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
      'Advanced Tableau dashboards for financial KPI monitoring',
      'Recognized with CFO Group RBC Quarterly Team Award (Q4 2023)',
    ],
    palette: { primary: '#ef4444', glow: 'shadow-red-500/20', bg: 'from-red-500/5' },
    deepDivePath: '/projects/commodity-tax',
  },
  // Arc 4: Intelligent Systems (2024-present)
  {
    id: 'aegis',
    title: 'Aegis v2',
    subtitle: 'Text-to-SQL Benchmarking Engine — RBC CFO Group',
    role: 'Designed + shipped in two weeks',
    stack: ['Text-to-SQL', 'Embeddings', 'Similarity Search', 'Intent Parsing'],
    heroMetric: { value: AEGIS_V2_BUILD_TIME, label: 'Concept → Production' },
    caption:
      'AI-native benchmarking engine for CFO Group. Natural language to validated SQL via intent parsing, KPI disambiguation, and embeddings. v1 benchmarked Big 6 banks; v2 shipped in two weeks while running Astraeus + Amplify.',
    description:
      'Strategic benchmarking engine for the CFO Group. v1 derives KPIs from Big 6 Canadian banks\' Supplementary Financial Packages. v2 adds intent parsing, text-to-SQL, and embeddings-based KPI disambiguation.',
    highlights: [
      'Intent parsing and query decomposition into logical sub-parts',
      'KPI detection with rich metadata mapping and embeddings-based similarity search for disambiguation',
      'Guarded, LLM-assisted disambiguation — pinpoints intended KPI without exposing sensitive data',
      'Guardrails: whitelisting, parameterization, testability',
    ],
    palette: { primary: '#22c55e', glow: 'shadow-green-500/20', bg: 'from-green-500/5' },
    deepDivePath: '/projects/aegis',
  },
  {
    id: 'astraeus',
    title: 'ASTRAEUS',
    subtitle: 'Financial Insights & Analysis Suite — RBC CFO Group',
    role: 'Architect, lead developer, product visionary',
    stack: ['Multi-Agent Framework', 'Text-to-SQL', 'GPT Routing', 'EPM Security'],
    heroMetric: { value: ASTRAEUS_FACTORIAL_COMBINATIONS, label: 'Factorial Combinations' },
    caption:
      'Production analytics platform for RBC\'s CFO Group. Days of email back-and-forth replaced by seconds-level answers — across headcount, HR costs, and open positions at bank scale. Millisecond slicing under the hood; GPT routes intent, deterministic code handles truth.',
    description:
      'Production-grade platform for CFO-level financial insights — headcount analytics, HR costs, open positions — delivered via dashboard, chatbot, and inbox-ready reports.',
    highlights: [
      'Deterministic multi-tier agentic framework with 3 specialized sub-agents (EPM, Headcount, Open Positions) running in parallel',
      'GPT used strictly for intent detection and routing — no sensitive data leaves the environment',
      'EPM-to-SQL entitlement modeling: cube permissions → security groups → employees → transits → SQL tables',
      '~9,000 rollups, ~60,000 geographies, millisecond slicing across weekly and month-end granularity',
    ],
    palette: { primary: '#3b82f6', glow: 'shadow-blue-500/20', bg: 'from-blue-500/5' },
    deepDivePath: '/projects/astraeus',
  },
  {
    id: 'par-assist',
    title: 'PAR Assist',
    subtitle: 'Enterprise Agentic AI Platform — RBC Bank-wide',
    role: 'Conceived vision, led strategic + technical requirements',
    stack: ['LangGraph', 'MCP', 'PostgreSQL', 'Embeddings', 'Custom RAG'],
    heroMetric: { value: PAR_ASSIST_SCALE, label: 'Target Scale' },
    caption:
      'Enterprise-wide agentic drafting platform for Project Approval Requests. LangGraph orchestration with MCP tools, multi-layer RAG, and semantic search — from intern POC to bank-wide initiative.',
    description:
      'Enterprise-wide drafting tool for Project Approval Requests — a critical governance process. Acts as a personal assistant guiding users through each step, utilizing metadata, rules, policies, historical examples, and best practices.',
    highlights: [
      'LangGraph agentic orchestration with MCP tools for template selection, field assignment, conflict resolution, and ambiguity checks',
      'Multi-layer custom/dynamic RAG: conversation history, uploaded documents (PDF, PPTX, DOCX, TXT), and field assignment prompts',
      'Chunking and embedding pipeline for enterprise documents with semantic search',
      'Originated from the Amplify internship program — scaled from intern POC to bank-wide initiative',
    ],
    palette: { primary: '#8b5cf6', glow: 'shadow-purple-500/20', bg: 'from-purple-500/5' },
    deepDivePath: '/projects/par-assist',
  },
];
