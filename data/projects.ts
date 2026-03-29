export interface Project {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  stack: string[];
  heroMetric: { value: string; label: string };
  description: string;
  highlights: string[];
  narrative: string;
  deepDivePath?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'par-assist',
    title: 'PAR Assist',
    subtitle: 'Enterprise-Wide Agentic AI Platform',
    role: 'Conceived vision, led strategic + technical requirements',
    stack: ['LangGraph', 'MCP', 'PostgreSQL', 'Embeddings', 'Custom RAG', 'PDF/PPTX/DOCX Processing'],
    heroMetric: { value: 'Bank-wide', label: 'Target Scale' },
    description:
      'Enterprise-wide drafting tool for Project Approval Requests — a critical governance process. Acts as a personal assistant guiding users through each step, utilizing metadata, rules, policies, historical examples, and best practices.',
    highlights: [
      'LangGraph agentic orchestration with MCP tools for template selection, field assignment, conflict resolution, and ambiguity checks',
      'Multi-layer custom/dynamic RAG: conversation history, uploaded documents (PDF, PPTX, DOCX, TXT), and field assignment prompts',
      'Chunking and embedding pipeline for enterprise documents with semantic search',
      'Originated from the Amplify internship program — scaled from intern POC to bank-wide initiative',
    ],
    narrative:
      'Took an intern\'s idea from the Amplify program and turned it into the bank\'s enterprise AI drafting platform.',
    deepDivePath: '/projects/par-assist',
  },
  {
    id: 'astraeus',
    title: 'ASTRAEUS',
    subtitle: 'Financial Insights & Analysis Suite',
    role: 'Architect, lead developer, product visionary',
    stack: ['Multi-Agent Framework', 'Text-to-SQL', 'GPT (Intent Routing)', 'EPM Security Modeling', 'React', 'Tableau'],
    heroMetric: { value: '~40,000', label: 'Transits Processed' },
    description:
      'Production-grade platform for CFO-level financial insights — headcount analytics, HR costs, open positions — delivered via dashboard, chatbot, and inbox-ready reports. Millisecond-level slicing across any time window.',
    highlights: [
      'Deterministic multi-tier agentic framework with 3 specialized sub-agents (EPM, Headcount, Open Positions) running in parallel',
      'GPT used strictly for intent detection and routing — no sensitive data leaves the environment',
      'EPM-to-SQL entitlement modeling: cube permissions → security groups → employees → transits → SQL tables',
      'Event model at transactional employee-by-transit level with automatic reconciliation — eliminates double counting',
      '~9,000 rollups, ~60,000 geographies, millisecond slicing across weekly and month-end granularity',
    ],
    narrative:
      'GPT handles routing. Deterministic agents handle truth. No sensitive data leaks.',
  },
  {
    id: 'aegis',
    title: 'Aegis Benchmarking Engine',
    subtitle: 'Text-to-SQL with LLM-Assisted KPI Disambiguation',
    role: 'Led v1 productionization; designed + shipped v2 in two weeks',
    stack: ['Text-to-SQL', 'Embeddings', 'Similarity Search', 'Intent Parsing', 'Query Decomposition'],
    heroMetric: { value: '2 weeks', label: 'v2 Delivery' },
    description:
      'Strategic benchmarking engine that translates natural language into validated, schema-aware SQL. v2 designed and shipped in two weeks while concurrently advancing Astraeus and the Amplify internship program.',
    highlights: [
      'Intent parsing and query decomposition into logical sub-parts',
      'KPI detection with rich metadata mapping and embeddings-based similarity search for disambiguation',
      'Guarded, LLM-assisted disambiguation — pinpoints intended KPI without exposing sensitive data',
      'Guardrails: whitelisting, parameterization, testability',
      'Codified best practices for reliability, testability, and repeatability under tight platform constraints',
    ],
    narrative:
      'v1 proved it could work. v2 proved it could scale — built in two weeks flat.',
  },
  {
    id: 'digital-twin',
    title: 'Digital Twin',
    subtitle: '900MW Coal Power Plant — Maizuru, Japan',
    role: 'Lead data scientist, end-to-end delivery',
    stack: ['R', 'Python', 'Regression', 'Classification', 'Clustering'],
    heroMetric: { value: '$3M', label: 'Annual Savings' },
    description:
      'ML-powered Digital Twin for a 900MW coal power plant in Maizuru, Japan. Built predictive models that improved operational efficiency and reduced costs, delivering one of TCS\'s landmark applied ML projects.',
    highlights: [
      'End-to-end ML project lifecycle: data collection through to deployment',
      'Regression, classification, and clustering models for operational optimization',
      'Cross-border delivery (India ↔ Japan) for a Japanese energy company',
      'Recognized with two Star of the Month awards for groundbreaking ML research and successful deployment',
    ],
    narrative:
      'Where it all started — taking complex industrial data and turning it into $3M in annual savings.',
  },
  {
    id: 'commodity-tax',
    title: 'Commodity Tax Automation',
    subtitle: 'Tax Return Process Overhaul',
    role: 'Lead developer + stakeholder engagement',
    stack: ['PySpark', 'Tableau', 'General Ledger Data Extraction'],
    heroMetric: { value: 'Months → 90min', label: 'Processing Time' },
    description:
      'Overhauled the Commodity Tax return process, transforming a multi-month manual workflow into a 90-minute automated pipeline. Built advanced Tableau dashboards for financial KPI monitoring.',
    highlights: [
      'PySpark pipeline for General Ledger Journal data extraction at scale',
      'Advanced Tableau dashboards for financial KPI monitoring and stakeholder reporting',
      'Recognized with CFO Group RBC Quarterly Team Award (Q4 2023)',
    ],
    narrative:
      'A flagship win that built trust with CFO stakeholders and opened the door to more ambitious AI projects.',
  },
];
