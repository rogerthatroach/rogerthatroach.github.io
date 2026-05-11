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
  /**
   * Optional Tailwind size class override for the logo. Default:
   * `h-11 w-auto max-w-[160px] md:h-12`. Square-aspect logos (TCS)
   * need a bigger height to match the visual weight of horizontal
   * wordmarks (RBC, Quantiphi) rendered at the default.
   */
  logoClass?: string;
  /**
   * When true, the group header renders the logo + date range only,
   * skipping the org-name text. Useful for companies whose logo IS
   * the wordmark (TCS) — the text next to the logo becomes redundant.
   */
  hideOrgNameInHeader?: boolean;

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
      'Architecting enterprise agentic AI. Conceived, architected, and built Prometheus end-to-end (pilot April 2026; enterprise rollout in progress). Conceived, architected, and built Astraeus end-to-end (production since Nov 2025). Designed and built Aegis v2 in a 2-week solo sprint while running Astraeus and the Amplify intern program in parallel. Shipped ARGUS in May 2026 as a single-weekend solo build for senior bank leadership. Led the 2025 Amplify intern cohort. ~70% hands-on.',
    skills: ['LangGraph', 'MCP', 'RAG', 'Text-to-SQL', 'Embeddings', 'React', 'Multi-Agent Orchestration'],
    milestone: `${PAR_ASSIST_SCALE} AI platform`,
    accent: 'purple',
    logoPath: '/images/logos/rbc.svg',
    headlineMetric: {
      value: '2 enterprise platforms',
      label: 'Conceived + architected in 12 months',
    },
    transitionStory:
      'Promoted internally from Senior Data Scientist after 2.5 years built on Commodity Tax (months → 90 min) and Aegis v1 solo end-to-end productionization. The Lead role added product vision (not just execution), cross-functional leadership of engineering services partners, expanded hiring involvement, and ownership of net-new enterprise platforms: Astraeus development began April 2025 coincident with the promotion, and Prometheus was conceived as my own vision, handed to Amplify interns for problem-space ideation, then built end-to-end as a bank-wide production platform.',
    teamContext:
      'Current team: 1 Senior AI Scientist direct + 2 interns joining May 2026 (3 total). Cumulative intern scope: 7 managed end-to-end (the 2025 Amplify cohort explored the Prometheus problem space via an ideation exercise before I built the production platform end-to-end). Cross-functional leadership of engineering services partners (senior + junior) on Astraeus. Contributing to hiring decisions since 2023 (university recruiting, screening, performance reviews). Peak simultaneous management: 5.',
    projects: [
      {
        name: 'Prometheus',
        oneLiner:
          'Conceived, architected, and built end-to-end: enterprise-wide agentic AI platform guiding PAR drafting across all RBC business lines. Pilot launched April 2026.',
        decisionRationale:
          'LangGraph over plain LangChain chains because PAR workflows branch conditionally (template selection, field assignment, conflict resolution looping back). PostgreSQL + pgvector over vector-DB-only so embeddings stay co-located with relational metadata. Concept handed to Amplify interns as an ideation exercise; production system built end-to-end after the exploration. Production deployment runs through GFT on OpenShift via CI/CD.',
        metric: { value: 'Pilot April 2026', label: 'Enterprise rollout Q2/Q3 2026' },
        caseStudyLink: '/projects/par-assist',
        blogLink: '/blog/par-assist-building',
      },
      {
        name: 'Astraeus',
        oneLiner:
          'Conceived, architected, and built end-to-end: production analytics platform for CFO Group delivering dynamic headcount, HR costs, and open positions at bank scale with millisecond slicing. Production since Nov 2025.',
        decisionRationale:
          'Two-wall architecture. GPT-4.1 on the intent side handles parse, route, metadata extract, and synthesis; never touches data. Cython-compiled Python on the compute side, with permission-to-SQL entitlement cascade applied before compute and event-level ins-outs math that reframes the apparent factorial problem as linear-in-events. Refactored an initial single-model implementation into 3 parallel sub-agents (EPM, Headcount, Open Positions) to break Command-A context limits and unlock all financial domains, improving accuracy, latency, and fault resilience simultaneously. Single Postgres backbone for the event log, entitlement catalog, hierarchies, and audit trail. Production deployment runs through GFT on OpenShift via CI/CD.',
        metric: { value: '~40K leaf-level events', label: 'arbitrary combinations, ms latency' },
        caseStudyLink: '/projects/astraeus',
      },
      {
        name: 'Aegis v2',
        oneLiner:
          '2-week solo design and build, run in parallel with Astraeus and the Amplify intern program. Multi-stage RAG with multi-gate query parsing across bank, parameter, platform, and time-period, plus a text-to-SQL layer over rich KPI metadata and embeddings. Productionalized by direct report.',
        decisionRationale:
          'Guarded LLM disambiguation over pure semantic search for near-duplicate KPI names. Text-to-SQL with whitelisting and parameterization over free-form generation, because schema safety is non-negotiable in regulated finance.',
        metric: { value: '2 weeks', label: 'solo design and build' },
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
      'Overhauled the Commodity Tax process (months → 90 min). Built and productionized Aegis v1 end-to-end (solo): the Big 6 bank peer-benchmarking engine whose SFP extraction automation broke the long-standing peer-analysis bottleneck. Earned trust with CFO stakeholders.',
    skills: ['PySpark', 'SQL', 'Tableau', 'Financial Modeling', 'Aegis v1'],
    milestone: COMMODITY_TAX_EFFICIENCY,
    accent: 'amber',
    logoPath: '/images/logos/rbc.svg',
    headlineMetric: {
      value: '$600M',
      label: 'Tax allocation automated (months → 90 min)',
    },
    transitionStory:
      'Joined RBC after Quantiphi seeking financial services depth and a bigger platform than consulting. The Senior DS role at CFO Group delivered C-suite stakeholder access, bank-scale data (Big 6 peer benchmarking, enterprise GL), and the chance to evolve from ML engineering into product-oriented data science. Promotion to Lead came from accumulated trust: Commodity Tax built credibility, Aegis v1 proved end-to-end product ownership, and Astraeus scoping in early 2025 set the stage for the platform built end-to-end during the Lead role.',
    teamContext:
      'Individual contributor progressing toward leadership. Partnered with CFO Group leadership, Commodity Tax team, and finance teams across the bank. Mentored junior data scientists. Built the stakeholder relationships that made Astraeus possible.',
    projects: [
      {
        name: 'Commodity Tax Automation',
        oneLiner:
          '~$600M tax allocation per cycle; processing time slashed from months to 90 minutes.',
        decisionRationale:
          'PySpark over pandas/plain SQL — General Ledger data is bank-scale (~10–50M rows per cycle, full-period scans needed). Tableau over custom dashboards — CFO Group muscle memory is Tableau; adoption friction matters more than framework novelty.',
        metric: { value: COMMODITY_TAX_EFFICIENCY, label: 'Processing time' },
        caseStudyLink: '/projects/commodity-tax',
      },
      {
        name: 'Aegis v1',
        oneLiner:
          'Solo end-to-end build of the Canadian Supplementary Benchmarking engine, deriving and comparing peer KPIs from Big 6 Canadian banks\' Supplementary Financial Package data.',
        decisionRationale:
          'Automated SFP extraction and matching despite quarterly schema shifts (the long-standing bottleneck that had blocked timely peer analysis). Historical matching logic baked into v1 to prevent v2 from inheriting a messy dataset.',
        metric: { value: 'CFO One RBC Team Award', label: '2025 LLM/AI recognition' },
        caseStudyLink: '/projects/aegis',
      },
      {
        name: 'External Data Service automation (PAR actual vs. planned)',
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
    logoPath: '/images/logos/quantiphi.svg',
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
    // TCS wordmark is ~3.75:1 wide. Even cropped, the rendered width
    // dominated the timeline card on mobile. Shrunk to ~75% of the
    // default (h-8 / md:h-9 vs default h-11 / md:h-12) and capped at
    // max-w-[120px] so it sits visibly smaller than the org name +
    // role-title block alongside it.
    logoClass: 'h-8 w-auto max-w-[120px] md:h-9 md:max-w-[132px]',
    // Logo already carries the "Tata Consultancy Services" wordmark — no
    // need to restate it in text next to it.
    hideOrgNameInHeader: true,
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
