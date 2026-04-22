import {
  PAR_ASSIST_SCALE,
  COMMODITY_TAX_EFFICIENCY,
  DIGITAL_TWIN_SAVINGS,
  HUMANA_ACCURACY,
} from './canonical';

/**
 * A single project highlight within a role. Surfaced in the expanded
 * /resume view; each project gets a one-liner, an optional decision
 * rationale (the "why X over Y" that makes engineering judgment visible
 * to a director-level reader), an optional headline metric, and
 * optional cross-links to a case study and/or blog post.
 */
export interface ProjectHighlight {
  name: string;
  oneLiner: string;
  /**
   * Decision visibility — one line capturing the key architectural call
   * and why. Directors read these as system-level judgment signals.
   * Example: "LangGraph over chains because PAR workflows branch conditionally."
   */
  decisionRationale?: string;
  metric?: { value: string; label: string };
  caseStudyLink?: string;
  blogLink?: string;
}

export interface TimelineNode {
  id: string;
  era: string;
  period: string;
  org: string;
  role: string;
  /** Short summary — rendered in both compact (homepage) and expanded (/resume) views. */
  description: string;
  skills: string[];
  milestone?: string;
  accent: 'blue' | 'emerald' | 'amber' | 'purple' | 'cyan' | 'rose';
  /**
   * Optional path to the company's logo SVG, relative to /public.
   * When set, SkillTimeline renders the logo next to the org name.
   *
   * To add a logo:
   *   1. Source from the company's official brand asset page
   *      (e.g., RBC: https://www.rbc.com/about-us/brand-guidelines)
   *   2. Drop the SVG at public/images/logos/{slug}.svg
   *   3. Set logoPath below. Keep SVGs under ~5KB.
   */
  logoPath?: string;

  // ───────────────────────────────────────────────────────────────
  // Fields below surface ONLY in the expanded /resume view (SkillTimeline
  // with `expanded={true}`). Homepage's compact view ignores them.
  // All optional — a node without these fields degrades gracefully.
  // ───────────────────────────────────────────────────────────────

  /** The single number or claim that captures the role's scope/impact. */
  headlineMetric?: { value: string; label: string };
  /**
   * Why this career move happened, in Milap's voice — 1–3 sentences on
   * the transition and what new scope it unlocked. Director-level readers
   * use these to map trajectory, not just chronology.
   */
  transitionStory?: string;
  /**
   * Team / stakeholder shape — not "managed N people" but the leadership
   * shape: direct reports, mentees, cross-functional peers, hiring
   * involvement. Honest tense (current vs peak).
   */
  teamContext?: string;
  /** Key projects from this role — each a ProjectHighlight with decision rationale. */
  projects?: ProjectHighlight[];
  /** Optional canonical case-study link for this role. */
  caseStudyLink?: string;
  /** Optional canonical blog-post link for this role. */
  blogLink?: string;
}

export const TIMELINE: TimelineNode[] = [
  {
    id: 'rbc-lead',
    era: 'Intelligent Systems',
    period: '2025 – Present',
    org: 'Royal Bank of Canada',
    role: 'AI & Data Science Lead — CFO Group',
    description:
      'Architecting enterprise agentic AI. Conceived PAR Assist (pilot April 2026; enterprise rollout in progress). Productionized Astraeus. Refactored Aegis v1 → v2 in a concurrent 2-week sprint. Led 2025 Amplify intern program. ~70% hands-on.',
    skills: ['LangGraph', 'MCP', 'RAG', 'Text-to-SQL', 'Embeddings', 'React', 'Multi-Agent Orchestration'],
    milestone: `${PAR_ASSIST_SCALE} AI platform`,
    accent: 'purple',
    logoPath: '/images/logos/rbc.svg',
    headlineMetric: {
      value: '2 enterprise platforms',
      label: 'Conceived + architected in 12 months',
    },
    transitionStory:
      'Promoted internally from Senior Data Scientist after 2.5 years — Commodity Tax (months → 90 min), Aegis v1 productionization, Astraeus groundwork. The Lead role added product vision (not just execution), cross-functional leadership of GFT peers, expanded hiring involvement, and ownership of net-new enterprise platforms (PAR Assist originated post-promotion via the Amplify program).',
    teamContext:
      'Current team: 1 Senior AI Scientist direct + 2 interns joining May 2026 (3 total). Cumulative intern scope: 7 managed end-to-end (Amplify 2025 led the conversion of an intern POC → bank-wide product). Cross-functional leadership of GFT senior + junior peers on Astraeus. Contributing to hiring decisions since 2023 (university recruiting, screening, performance reviews). Peak simultaneous management: 5.',
    projects: [
      {
        name: 'PAR Assist',
        oneLiner:
          'Enterprise-wide agentic AI platform guiding PAR drafting across all RBC business lines. Pilot launched April 2026.',
        decisionRationale:
          'LangGraph over plain LangChain chains because PAR workflows branch conditionally (template selection → field assignment → conflict resolution loops back). PostgreSQL + pgvector over vector-DB-only so embeddings stay co-located with relational metadata.',
        metric: { value: 'Pilot April 2026', label: 'Enterprise rollout Q2/Q3 2026' },
        caseStudyLink: '/projects/par-assist',
        blogLink: '/blog/par-assist-building',
      },
      {
        name: 'Astraeus',
        oneLiner:
          'Production analytics platform for CFO Group — dynamic headcount, HR costs, open positions at bank scale with millisecond slicing.',
        decisionRationale:
          'Deterministic agents + GPT for intent routing only — regulated finance cannot tolerate LLM hallucination on numbers. Refactored monolith → 3 parallel sub-agents (EPM / Headcount / Open Positions) because Command-A context limits made a single agent infeasible.',
        metric: { value: '~40K transits', label: 'analyzed in ms' },
        caseStudyLink: '/projects/astraeus',
      },
      {
        name: 'Aegis v2',
        oneLiner:
          'Concurrent 2-week refactor of Aegis v1 into a text-to-SQL-first architecture with KPI disambiguation and guardrails.',
        decisionRationale:
          'Guarded LLM disambiguation over pure semantic search for near-duplicate KPI names. Text-to-SQL with whitelisting + parameterization over free-form generation — schema safety is non-negotiable in regulated finance.',
        metric: { value: '2 weeks', label: 'v1 → v2 refactor sprint' },
        caseStudyLink: '/projects/aegis',
      },
    ],
    caseStudyLink: '/projects/par-assist',
    blogLink: '/blog/par-assist-building',
  },
  {
    id: 'rbc-senior',
    era: 'Enterprise Analytics',
    period: '2022 – 2025',
    org: 'Royal Bank of Canada',
    role: 'Senior Data Scientist — CFO Group',
    description:
      'Overhauled the Commodity Tax process (months → 90 min). Productionized Aegis v1. Built the data foundations for Astraeus. Earned trust with CFO stakeholders.',
    skills: ['PySpark', 'SQL', 'Tableau', 'Financial Modeling', 'Aegis v1'],
    milestone: COMMODITY_TAX_EFFICIENCY,
    accent: 'amber',
    logoPath: '/images/logos/rbc.svg',
    headlineMetric: {
      value: '$600M+',
      label: 'Tax allocation automated (months → 90 min)',
    },
    transitionStory:
      'Joined RBC after Quantiphi seeking financial services depth and a bigger platform than consulting. The Senior DS role at CFO Group delivered C-suite stakeholder access, bank-scale data (Big 6 peer benchmarking, enterprise GL), and the chance to evolve from ML engineering into product-oriented data science. Promotion to Lead came from accumulated trust — Commodity Tax built credibility, Aegis v1 proved product ownership, Astraeus groundwork demonstrated vision.',
    teamContext:
      'Individual contributor progressing toward leadership. Partnered with CFO Group leadership, Commodity Tax team, and finance teams across the bank. Mentored junior data scientists. Built the stakeholder relationships that made Astraeus possible.',
    projects: [
      {
        name: 'Commodity Tax Automation',
        oneLiner:
          '~$250M GST + ~$350M PVAT allocated across the organization; processing time slashed from months to 90 minutes.',
        decisionRationale:
          'PySpark over pandas/plain SQL — General Ledger data is bank-scale (hundreds of millions of rows per tax period). Tableau over custom dashboards — CFO Group muscle memory is Tableau; adoption friction matters more than framework novelty.',
        metric: { value: COMMODITY_TAX_EFFICIENCY, label: 'Processing time' },
        caseStudyLink: '/projects/commodity-tax',
      },
      {
        name: 'Aegis v1',
        oneLiner:
          'Canadian Supplementary Benchmarking engine — derives and compares peer KPIs from Big 6 Canadian banks\' SuppPack data.',
        decisionRationale:
          'Automated SuppPack pulls over manual refresh — SuppPacks publish on staggered schedules across banks; automation catches them on publish. Historical matching logic built into v1 to prevent v2 from inheriting a messy dataset.',
        metric: { value: 'CFO One Team Award', label: '2025 recognition' },
        caseStudyLink: '/projects/aegis',
      },
      {
        name: 'EDS Automation (PAR actual vs. planned)',
        oneLiner:
          'Dynamic RAG system for financial comparisons, widely adopted across the finance team.',
        decisionRationale:
          'Dynamic RAG over static rules — PAR structures vary by business line and evolve over time. A rules engine would ossify; RAG adapts as the corpus grows.',
      },
      {
        name: 'Journal Entry Automation',
        oneLiner:
          'Automated all manual journal entries across the bank via PySpark + CDP with dynamic monitoring dashboards.',
        decisionRationale:
          'PySpark + CDP over Dataiku/other — CDP was the enterprise-sanctioned platform for PII-adjacent workloads. Staying inside the sanctioned boundary avoided a governance fight.',
      },
    ],
  },
  {
    id: 'quantiphi',
    era: 'Cloud ML',
    period: '2021 – 2022',
    org: 'Quantiphi Inc.',
    role: 'Machine Learning Engineer',
    description:
      'Deployed ML models on Google Cloud for insurance and financial clients. Document verification pipelines, Vertex AI, entity extraction at scale.',
    skills: ['GCP', 'Vertex AI', 'AutoML', 'Document AI', 'SQL', 'Tableau'],
    accent: 'cyan',
    headlineMetric: {
      value: HUMANA_ACCURACY,
      label: 'Humana document classification (up from ~70%)',
    },
    transitionStory:
      'After Georgian College (Jan–Aug 2021) I needed a Canadian ML role with cloud depth. Quantiphi was a Google Cloud partner — the fastest on-ramp to production GCP / Vertex AI work, which the bank market was starting to demand. The one-year tenure was intentional: a bridge from pure data science into a major Canadian bank.',
    teamContext:
      'ML engineer on client-facing teams. Deployed production pipelines to Humana (healthcare) and Chick-fil-A (US-wide retail).',
    projects: [
      {
        name: 'Humana Document Understanding',
        oneLiner:
          'Hybrid document pipeline (Document AI + OpenCV + Random Forest) on Google Cloud — detection of checkboxes, handwritten text, and form fields to reduce manual review.',
        decisionRationale:
          'Document AI alone hit ~70% — not production-grade. Hybrid composition: Document AI for OCR + OpenCV for pixel-level checkbox detection + Random Forest for final classification. BigTable (hot lookups) + BigQuery (analytics) over Cloud Storage + CSVs — match storage to access pattern.',
        metric: { value: HUMANA_ACCURACY, label: 'Final pipeline accuracy' },
      },
      {
        name: 'Chick-fil-A Inventory Analytics',
        oneLiner:
          'Multi-million-row inventory analysis across US-wide locations with SQL and Tableau.',
        decisionRationale:
          'Tableau + SQL over a custom data app — operators needed self-serve intelligence; meet them in the tool they already know.',
      },
    ],
  },
  {
    id: 'tcs',
    era: 'Foundation',
    period: '2016 – 2019',
    org: 'Tata Consultancy Services',
    role: 'Data Scientist',
    description:
      'Built a Digital Twin for a 900MW coal power plant in Japan — $3M annual savings. Won 2nd/600 in a computer vision hackathon. Where the ML journey began.',
    skills: ['R', 'Python', 'ggplot2', 'Regression', 'Classification', 'Clustering', 'CNNs', 'TensorFlow'],
    milestone: `${DIGITAL_TWIN_SAVINGS}/year savings`,
    accent: 'emerald',
    logoPath: '/images/logos/tcs.svg',
    headlineMetric: {
      value: DIGITAL_TWIN_SAVINGS,
      label: 'Annual savings — Maizuru 900MW Digital Twin',
    },
    transitionStory:
      'Joined TCS out of B.Eng (Electronics & Communications Engineering, Thapar, 2016). TCS offered the fastest path from engineering generalist to applied ML — specifically the MHPS / Maizuru digital twin opportunity, which was leading-edge industrial AI in 2017. Gave end-to-end ML ownership (ETL to production recommendations), cross-border client delivery (India ↔ Japan), and the closed-loop pattern (sense → model → optimize → act) that every subsequent role has built on.',
    teamContext:
      'Sole data/ML engineer on a 3-person R&D team (mechanical engineer + technical manager + me). Owned the entire pipeline from raw sensor data to optimized control recommendations. Stakeholders: MHPS (Mitsubishi Hitachi Power Systems) SMEs and plant operators at the Maizuru 900MW coal power plant.',
    projects: [
      {
        name: 'Combustion Tuning (Digital Twin)',
        oneLiner:
          '84 regression models across 90+ industrial sensors; Particle Swarm Optimization for closed-loop boiler control recommendations at the Maizuru 900MW coal power plant.',
        decisionRationale:
          'PSO over gradient-based optimization because the objective landscape (coupled boiler dynamics, non-convex, high-dimensional, no analytical gradient) is the metaheuristic fit. 84 separate regression models over one multi-output net because plant operators needed per-variable explainability for MHPS audits.',
        metric: { value: DIGITAL_TWIN_SAVINGS, label: '/year + NOx/SOx/CO reduction' },
        caseStudyLink: '/projects/combustion-tuning',
      },
      {
        name: 'LSTM — Ammonium Bisulphate Deposition',
        oneLiner:
          'Time-series forecasting model predicting air-preheater deposition, critical for plant maintenance planning.',
        decisionRationale:
          'LSTM over classical ARIMA because deposition dynamics have regime-shift memory (upstream chemistry → downstream deposit). ARIMA captures autocorrelation; LSTM captures regime transitions.',
      },
      {
        name: 'Coal Classification (5-algorithm comparison)',
        oneLiner:
          'kMeans, Logistic Regression, Random Forest, SVM, XGBoost — evaluated in parallel to classify coal physicochemical features.',
        decisionRationale:
          'Multi-algorithm comparison surfaced XGBoost as the winner and gave the team defensible reasoning for MHPS. Running 5 in parallel is cheaper than prematurely committing.',
      },
      {
        name: 'Transformer Life Prediction',
        oneLiner:
          'Electrical transformer life prediction using XGBoost on tabular physicochemical data. 85% MAPE accuracy.',
        decisionRationale:
          'XGBoost over deep learning — small tabular data is XGBoost\'s dominant regime.',
      },
      {
        name: 'Math Notation Detection (CV Hackathon, 2019)',
        oneLiner:
          'Deep CNN model to identify mathematical symbols from written text. 2nd out of 600 in TCS Computer Vision Hackathon.',
        decisionRationale:
          'CNN as the standard playbook for visual symbol classification. Project differentiator was training augmentation to handle handwritten symbol variance.',
        metric: { value: '2nd / 600', label: 'TCS CV Hackathon' },
      },
    ],
  },
];
