import {
  COMMODITY_TAX_EFFICIENCY,
  DIGITAL_TWIN_SAVINGS,
  DRAFTING_PLATFORM_NAME,
  FINANCIAL_BENCHMARKING_NAME,
  HANDS_ON_PCT,
  HUMANA_ACCURACY,
  HUMANA_BASELINE_ACCURACY,
  FUNDING_REQUEST_DRAFTING_SCALE,
  WORKFORCE_ANALYTICS_BUILD_WINDOW,
  WORKFORCE_ANALYTICS_COST_CENTRES,
  WORKFORCE_ANALYTICS_NAME,
  WORKFORCE_ANALYTICS_PRODUCTION_LAUNCH,
} from './canonical';

export interface ProjectHighlight {
  name: string;
  oneLiner: string;
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
  description: string;
  skills: string[];
  milestone?: string;
  accent: 'blue' | 'emerald' | 'amber' | 'purple' | 'cyan' | 'rose';
  logoPath?: string;
  logoClass?: string;
  hideOrgNameInHeader?: boolean;
  headlineMetric?: { value: string; label: string };
  transitionStory?: string;
  teamContext?: string;
  projects?: ProjectHighlight[];
  caseStudyLink?: string;
  blogLink?: string;
}

export const CAREER_SCOPE = {
  productionFinanceYears: '3.8',
  agenticLlmYears: '1.5',
  bankProductionSystems: [
    `${DRAFTING_PLATFORM_NAME}`,
    WORKFORCE_ANALYTICS_NAME,
    `${FINANCIAL_BENCHMARKING_NAME}`,
  ] as const,
};

/**
 * The authoritative public career chronology. Keep this concise enough to
 * scan on the homepage and detailed enough to stand alone on /resume.
 */
export const TIMELINE: TimelineNode[] = [
  {
    id: 'rbc-lead',
    era: 'Intelligent Systems',
    period: 'Apr 2025 – Present',
    org: 'Royal Bank of Canada',
    role: 'AI & Data Science Lead · CFO Group',
    description:
      `Conceived, architected, and built the ${WORKFORCE_ANALYTICS_NAME} from March through its ${WORKFORCE_ANALYTICS_PRODUCTION_LAUNCH} launch while guiding the 2025 Amplify cohort and leading a focused two-week v1-to-v2 refactor of the ${FINANCIAL_BENCHMARKING_NAME}. Later drove the ${DRAFTING_PLATFORM_NAME} from concept to full CFO Group launch. Remain ${HANDS_ON_PCT} hands-on across architecture, implementation, evaluation, and production follow-through.`,
    skills: ['LangGraph', 'MCP', 'Semantic retrieval', 'Text-to-SQL', 'Python', 'React'],
    milestone: `${FUNDING_REQUEST_DRAFTING_SCALE} launch`,
    accent: 'purple',
    logoPath: '/images/logos/rbc.svg',
    headlineMetric: {
      value: HANDS_ON_PCT,
      label: 'hands-on across architecture and implementation',
    },
    transitionStory:
      'Promoted after delivering Commodity Tax automation and the first version of the financial peer benchmarking product as a Senior Data Scientist. The Lead role added product direction, cross-functional production delivery, mentoring, and hiring involvement while preserving direct build ownership.',
    teamContext:
      'Current team: one Senior AI Scientist direct report and two interns who joined in May 2026. Contributing to AI/ML hiring since 2023.',
    projects: [
      {
        name: `${DRAFTING_PLATFORM_NAME}`,
        oneLiner:
          'Drove a reviewed, single-agent drafting workflow from a one-page concept to production. It was the first true agentic AI platform approved for production at the bank: pilot in April 2026, then full CFO Group launch across all geographies in May.',
        decisionRationale:
          'A single LangGraph orchestrator owns workflow state and review. Bounded MCP tool routines handle scoped work without being presented as additional agents; missing coverage returns to clarification or human review.',
        metric: { value: 'April → May 2026', label: 'pilot to full CFO Group launch' },
        caseStudyLink: '/projects/funding-request-drafting',
        blogLink: '/blog/funding-request-drafting-platform-building',
      },
      {
        name: WORKFORCE_ANALYTICS_NAME,
        oneLiner:
          `Conceived, architected, and built the platform from March through its ${WORKFORCE_ANALYTICS_PRODUCTION_LAUNCH} launch while leading cross-functional production delivery. It supports authorized questions over ${WORKFORCE_ANALYTICS_COST_CENTRES} cost centres.`,
        decisionRationale:
          'Approved model endpoints interpret intent and shape language. Entitlement-aware deterministic Python performs retrieval and calculation so governed data access and financial arithmetic do not depend on model output.',
        metric: { value: WORKFORCE_ANALYTICS_BUILD_WINDOW, label: 'build to production launch' },
        caseStudyLink: '/projects/workforce-analytics',
      },
      {
        name: `${FINANCIAL_BENCHMARKING_NAME} · v2`,
        oneLiner:
          'Led a focused two-week concurrent refactor of the existing v1 benchmarking product while building the AI/LLM Workforce Analytics Platform and guiding the 2025 Amplify cohort. The production team integrated and released the revised module.',
        decisionRationale:
          'Dense semantic retrieval surfaces candidate metrics; controlled disambiguation resolves near-duplicate names; reviewed SQL templates and parameter binding constrain execution. Ambiguous requests return for clarification.',
        metric: { value: '2 weeks', label: 'concurrent v1-to-v2 refactor' },
        caseStudyLink: '/projects/financial-peer-benchmarking',
      },
    ],
    caseStudyLink: '/projects/funding-request-drafting',
    blogLink: '/blog/funding-request-drafting-platform-building',
  },
  {
    id: 'rbc-senior',
    era: 'Enterprise Analytics',
    period: 'Sep 2022 – Apr 2025',
    org: 'Royal Bank of Canada',
    role: 'Senior Data Scientist · CFO Group',
    description:
      'Built production finance analytics and automation. Reduced Commodity Tax processing from months to 90 minutes and built the first version of the financial peer benchmarking product end to end before promotion to Lead.',
    skills: ['PySpark', 'Python', 'SQL', 'Tableau', 'Financial analytics'],
    milestone: COMMODITY_TAX_EFFICIENCY,
    accent: 'amber',
    logoPath: '/images/logos/rbc.svg',
    headlineMetric: {
      value: '~$600M',
      label: 'allocation supported by Commodity Tax automation',
    },
    transitionStory:
      'Moved from consulting into financial services to work directly with finance stakeholders and own production systems over time. Commodity Tax established delivery credibility; the first version of the peer benchmarking product extended that ownership into applied AI.',
    teamContext:
      'Worked directly with CFO Group leaders, finance subject-matter experts, data partners, and technology teams. Mentored junior contributors and began participating in AI/ML hiring in 2023.',
    projects: [
      {
        name: 'Commodity Tax Automation',
        oneLiner:
          'Rebuilt a manual allocation process as a governed PySpark calculation pipeline with Tableau inspection surfaces, supporting an allocation of ~$600M in 90 minutes instead of months.',
        decisionRationale:
          'PySpark handled the bank-scale calculation path; Tableau gave finance users familiar inspection and correction surfaces. This was deterministic automation, not an LLM or retrieval system.',
        metric: { value: COMMODITY_TAX_EFFICIENCY, label: 'processing time' },
        caseStudyLink: '/projects/commodity-tax',
      },
      {
        name: `${FINANCIAL_BENCHMARKING_NAME} · v1`,
        oneLiner:
          'Built and launched the first version of the Canadian peer benchmarking product, including extraction and historical metric-matching logic for changing quarterly source packages.',
        decisionRationale:
          'The first version established a clean, reviewable history before later retrieval and text-to-SQL improvements were introduced through the v2 refactor.',
        metric: { value: '2025', label: 'production product recognised by a team award' },
        caseStudyLink: '/projects/financial-peer-benchmarking',
      },
    ],
  },
  {
    id: 'quantiphi',
    era: 'Cloud ML',
    period: 'Oct 2021 – Sep 2022',
    org: 'Quantiphi Inc.',
    role: 'Machine Learning Engineer',
    description:
      'Built and deployed cloud document-intelligence systems, combining OCR, computer vision, and classical machine learning for high-volume business workflows.',
    skills: ['GCP', 'Vertex AI', 'OCR', 'OpenCV', 'Random Forest', 'Document intelligence'],
    accent: 'cyan',
    logoPath: '/images/logos/quantiphi.svg',
    headlineMetric: {
      value: HUMANA_ACCURACY,
      label: `checkbox detection accuracy, up from ${HUMANA_BASELINE_ACCURACY}`,
    },
    transitionStory:
      'Moved into a Canadian machine-learning engineering role to deepen production cloud experience and apply earlier computer-vision work to client systems.',
    teamContext:
      'Worked in client-facing engineering teams across healthcare and retail, translating operational document and inventory problems into deployed ML workflows.',
    projects: [
      {
        name: 'Healthcare Document Intelligence',
        oneLiner:
          `Improved checkbox detection from ${HUMANA_BASELINE_ACCURACY} to ${HUMANA_ACCURACY} within a broader document classification and extraction workflow.`,
        decisionRationale:
          'OCR located text and page context, OpenCV localised checkbox regions, and a Random Forest classified checkbox state. The 99.95% result applies only to checkbox detection, not the entire pipeline.',
        metric: { value: HUMANA_ACCURACY, label: 'checkbox detection only' },
        caseStudyLink: '/projects/document-intelligence',
      },
      {
        name: 'Retail Inventory Analytics',
        oneLiner:
          'Developed cloud data and analytics workflows for a large US restaurant network, supporting inventory visibility across locations.',
      },
    ],
  },
  {
    id: 'tcs',
    era: 'Foundation',
    period: 'Aug 2016 – Nov 2019',
    org: 'Tata Consultancy Services',
    role: 'Data Scientist',
    description:
      'Built industrial machine-learning systems for power generation, including a digital twin for one 900 MW generating unit at Kansai Electric\'s 1,800 MW Maizuru coal-fired power station in Japan. Earlier computer-vision work included internal research and hackathons.',
    skills: ['Python', 'Regression', 'PSO', 'Time series', 'Computer vision', 'Industrial ML'],
    milestone: `${DIGITAL_TWIN_SAVINGS}/year savings`,
    accent: 'emerald',
    logoPath: '/images/logos/tcs.svg',
    logoClass: 'h-8 w-auto max-w-[120px] md:h-9 md:max-w-[132px]',
    hideOrgNameInHeader: true,
    headlineMetric: {
      value: `${DIGITAL_TWIN_SAVINGS}/year`,
      label: 'savings attributed to the combustion-tuning system',
    },
    transitionStory:
      'Began in industrial analytics, where recommendations had to respect physical constraints, operator judgment, and plant safety. That foundation shaped later work on bounded, reviewable AI systems.',
    teamContext:
      'Worked with TCS researchers, Mitsubishi Hitachi Power Systems as the engineering and equipment partner, and Kansai Electric as station owner and operator. Plant operators retained the final action decision.',
    projects: [
      {
        name: 'Combustion Tuning Digital Twin',
        oneLiner:
          'Built 84 regression models for plant behaviour and used particle swarm optimisation to propose candidate settings for operator review at one 900 MW Maizuru generating unit.',
        decisionRationale:
          'Separate models represented interacting plant responses; optimisation searched for settings within declared limits. Measurements remained distinct from controllable settings, and operators decided whether to act.',
        metric: { value: `${DIGITAL_TWIN_SAVINGS}/year`, label: 'reported savings' },
        caseStudyLink: '/projects/combustion-tuning',
      },
      {
        name: 'Transformer Life Prediction',
        oneLiner:
          'Modelled transformer health and remaining-life signals from operational time-series data to support maintenance planning.',
      },
      {
        name: 'Mathematical Notation Detection Hackathon',
        oneLiner:
          'Built a computer-vision prototype for mathematical-notation detection that placed second among ~600 participants in an internal hackathon.',
      },
    ],
  },
];
