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
  {
    id: 'par-assist',
    title: 'PAR Assist',
    subtitle: 'Enterprise Agentic AI Platform',
    role: 'Conceived vision, led strategic + technical requirements',
    stack: ['LangGraph', 'MCP', 'PostgreSQL', 'Embeddings', 'Custom RAG'],
    heroMetric: { value: 'Bank-wide', label: 'Target Scale' },
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
  {
    id: 'astraeus',
    title: 'ASTRAEUS',
    subtitle: 'Financial Insights & Analysis Suite',
    role: 'Architect, lead developer, product visionary',
    stack: ['Multi-Agent Framework', 'Text-to-SQL', 'GPT Routing', 'EPM Security'],
    heroMetric: { value: '~40,000', label: 'Transits Processed' },
    caption:
      'Deterministic agentic platform for CFO-grade financial analytics. Three parallel sub-agents, millisecond slicing across 40K transits and 60K geographies. GPT routes intent — deterministic agents handle truth.',
    description:
      'Production-grade platform for CFO-level financial insights — headcount analytics, HR costs, open positions — delivered via dashboard, chatbot, and inbox-ready reports.',
    highlights: [
      'Deterministic multi-tier agentic framework with 3 specialized sub-agents (EPM, Headcount, Open Positions) running in parallel',
      'GPT used strictly for intent detection and routing — no sensitive data leaves the environment',
      'EPM-to-SQL entitlement modeling: cube permissions → security groups → employees → transits → SQL tables',
      '~9,000 rollups, ~60,000 geographies, millisecond slicing across weekly and month-end granularity',
    ],
    palette: { primary: '#3b82f6', glow: 'shadow-blue-500/20', bg: 'from-blue-500/5' },
  },
  {
    id: 'aegis',
    title: 'Aegis v2',
    subtitle: 'Text-to-SQL Benchmarking Engine',
    role: 'Designed + shipped in two weeks',
    stack: ['Text-to-SQL', 'Embeddings', 'Similarity Search', 'Intent Parsing'],
    heroMetric: { value: '2 weeks', label: 'Concept → Production' },
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
  },
  {
    id: 'combustion-tuning',
    title: 'Combustion Tuning',
    subtitle: 'Digital Twin — 900MW Coal Plant',
    role: 'ML Engineer — 3-person R&D team (MHPS / TCS)',
    stack: ['R', 'Python', 'PSO', 'Multi-Output Regression', 'K-Fold CV'],
    heroMetric: { value: '$3M', label: 'Annual Savings' },
    caption:
      'Led ML engineering for combustion tuning at a 900MW coal plant. 84 models across 90+ sensors, optimized via Particle Swarm Optimization to reduce NOx, SOx, CO emissions. $3M annually.',
    description:
      'ML-powered Digital Twin for Maizuru 900MW coal power plant. Built predictive models to optimize combustion, reduce emissions, and improve efficiency.',
    highlights: [
      '90+ plant sensors → feature engineering → 84 simultaneous ML regression models',
      'Rigorous model selection: k-fold cross-validation, R², RMSE, MAPE, fold variance stability',
      'Particle Swarm Optimization: models as objective functions, exploring input space to minimize emissions',
      'Closed-loop: optimal settings → plant operators adjust → $3M/yr saved + reduced NOx/SOx/CO',
    ],
    palette: { primary: '#f59e0b', glow: 'shadow-amber-500/20', bg: 'from-amber-500/5' },
  },
  {
    id: 'commodity-tax',
    title: 'Commodity Tax',
    subtitle: 'Process Automation',
    role: 'Lead developer + stakeholder engagement',
    stack: ['PySpark', 'Tableau', 'General Ledger Extraction'],
    heroMetric: { value: 'Months → 90min', label: 'Processing Time' },
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
  },
];
