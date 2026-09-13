import {
  DRAFTING_PLATFORM_NAME,
  FINANCIAL_BENCHMARKING_NAME,
  WORKFORCE_ANALYTICS_BUILD_WINDOW_LONG,
  WORKFORCE_ANALYTICS_NAME,
  WORKFORCE_ANALYTICS_PRODUCTION_LAUNCH,
} from './canonical';

export interface CaseStudyDecision {
  selectedApproach: string;
  strongestAlternative?: string;
  crux?: string;
  residualRisk?: string;
}

/**
 * Six optional jobs for a concise case study. A project should populate only
 * the sections that help a reader assess the work; the renderer derives its
 * contents list from the populated fields.
 */
export interface CaseStudyNarrative {
  problem?: string;
  contribution?: string;
  decision?: CaseStudyDecision;
  mechanism?: string;
  outcomeAndState?: string;
  limits?: string;
}

export interface CaseStudy {
  projectId: string;
  timeline: string;
  era: string;
  status?: 'shipped' | 'in-progress';
  statusLabel?: string;
  narrative: CaseStudyNarrative;
  figureHeading?: string;
  // Canonical technical note: mechanism, evidence, and failure paths.
  blogPostSlug?: string;
  // Canonical builder story: chronology, judgment, and leadership.
  companionBlogPostSlug?: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    projectId: 'combustion-tuning',
    timeline: '2016 – 2019',
    era: 'Foundation',
    status: 'shipped',
    narrative: {
      problem:
        'One 900 MW generating unit at Kansai Electric\'s 1,800 MW Maizuru coal-fired power station had noisy operating data and competing emissions and efficiency objectives. Any proposed adjustment also had to preserve the plant operator\'s authority over the unit.',
      contribution:
        'As a Data Scientist on the TCS R&D team working with MHPS engineers, I built the ML and optimization path from plant-data preparation through model selection, candidate search, and operator-facing output. Kansai Electric owned and operated the station; MHPS provided equipment and combustion expertise.',
      decision: {
        selectedApproach:
          'Use 84 independent regression models to estimate candidate outcomes, then search bounded controllable-setting combinations with Particle Swarm Optimization.',
        crux:
          'Observed sensor values described plant state; only configured controllable settings belonged in the search space, and the operator retained the final action decision.',
        residualRisk:
          'The estimates remained sensitive to plant conditions, data quality, model fit, and the configured search bounds.',
      },
      mechanism:
        'Observed plant state and candidate settings entered the regression models. PSO compared predicted emissions and efficiency outcomes within configured ranges, and promising candidates went to an operator for acceptance, adjustment, or rejection.',
      outcomeAndState:
        '$3M in annual savings was attributed to the delivered combustion-tuning program. It operated as an operator-reviewed tool and contributed to two Star of the Month awards.',
      limits:
        'The system proposed settings; it did not actuate the unit autonomously. Later sensor readings could be compared with a recommendation, but a return observation did not imply automatic retraining or guaranteed optimization.',
    },
    blogPostSlug: 'closed-loop',
  },
  {
    projectId: 'document-intelligence',
    timeline: '2021 – 2022',
    era: 'Cloud ML',
    status: 'shipped',
    narrative: {
      problem:
        'Document AI alone measured about 70% accuracy on checkbox detection within Humana\'s insurance-document workflow. Small visual marks were not captured reliably when a page was reduced to text and layout.',
      contribution:
        'As an ML Engineer on Quantiphi\'s client-delivery team, I implemented the checkbox-detection component inside a broader Google Cloud document-understanding workflow. The surrounding deployment and client process were delivered with the wider team.',
      decision: {
        selectedApproach:
          'Keep Document AI for OCR and page structure, add OpenCV for pixel-level checkbox localization, and use a Random Forest classifier for checked-versus-unchecked state.',
        strongestAlternative:
          'Use the general Document AI checkbox output without a specialized visual path.',
        crux:
          'OCR preserved document context, while the small visual control needed localized image features and a task-specific classifier.',
        residualRisk:
          'Performance on checkbox detection did not establish accuracy for OCR, entity extraction, document classification, or the complete workflow.',
      },
      mechanism:
        'Document AI produced OCR and structural context. OpenCV localized checkbox regions, visual features fed the Random Forest classifier, and the classified state was rejoined with the surrounding document structure.',
      outcomeAndState:
        'Checkbox-detection accuracy improved from the roughly 70% Document AI-only baseline to 99.95%. The component was delivered on Google Cloud as part of Humana\'s broader document workflow.',
      limits:
        'The 99.95% figure applies only to checkbox detection. It is not an end-to-end document-pipeline score and does not establish the accuracy of adjacent extraction tasks.',
    },
  },
  {
    projectId: 'commodity-tax',
    timeline: '2022 – 2023',
    era: 'Enterprise Analytics',
    status: 'shipped',
    narrative: {
      problem:
        'The CFO Group\'s Commodity Tax return process took finance teams months per cycle to extract General Ledger records, reconcile differences, apply category mappings, and prepare the return.',
      contribution:
        'As lead developer and stakeholder liaison, I translated the finance team\'s process into a Dataiku scenario combining Python and Spark, with saved run data, Excel reports, and dynamic Tableau dashboards. Finance partners remained responsible for reviewing exceptions and accepting the result.',
      decision: {
        selectedApproach:
          'Retain every run input and intermediate output, with multiple Excel reports and dynamic dashboards at each stage for audit and debugging.',
        crux:
          'Faster calculation was useful only if finance users could locate a questioned value, inspect the available evidence, correct the underlying issue, and rerun the affected path.',
        residualRisk:
          'Reports, dashboards, and retrieved datasets must represent the run being reviewed. Retention makes the work available to inspect; it does not establish source completeness or correct rules.',
      },
      mechanism:
        'Extract, Reconcile, Category Map, Aggregate, and Return summarize a larger Dataiku scenario. Python and Spark perform the processing. Inputs and intermediates are saved in run-date/time folders and corresponding data partitions; Excel reports and dynamic Tableau dashboards support inspection at each stage.',
      outcomeAndState:
        'The production workflow reduced the process from months to 90 minutes for a return involving roughly $600M in tax allocation. The work received the CFO Group RBC Quarterly Team Award in Q4 2023.',
      limits:
        'Analysts and engineers investigate discrepancies and review corrections. Explaining a value can require comparing saved datasets, querying the relevant records, and examining transformation code.',
    },
    blogPostSlug: 'commodity-tax-provenance',
    companionBlogPostSlug: 'commodity-tax-cfo-trust',
  },
  {
    projectId: 'financial-peer-benchmarking',
    timeline: '2024 – 2025',
    era: 'Intelligent Systems',
    status: 'shipped',
    narrative: {
      problem:
        'Quarterly Supplementary Financial Package changes and near-duplicate KPI names made cross-bank peer benchmarking difficult to repeat and scale. Natural-language access added an ambiguity problem that had to stop before unsupported SQL could run.',
      contribution:
        'I built the financial peer benchmarking product’s first version end to end as a Senior Data Scientist. As Lead, I refactored its benchmarking module into the five-stage v2 path during a focused two-week concurrent sprint; my direct report and the broader production team then integrated the module and brought it into production.',
      decision: {
        selectedApproach:
          'Decompose the request into typed intent, catalog candidate retrieval, accept-or-clarify resolution, reviewed query construction with bound values, and deterministic result formatting.',
        crux:
          'Ambiguous KPI names had to return to the analyst rather than flow into query construction, while executable queries remained limited to reviewed patterns and allowed schema elements.',
        residualRisk:
          'The path still depends on catalog quality, retrieval and clarification calibration, configuration coverage, schema freshness, and stage-level tests.',
      },
      mechanism:
        'The first two stages narrow a request to catalog candidates. The third either resolves one supported KPI or asks for clarification. The fourth selects a reviewed query pattern, validates identifiers, and binds values; the fifth formats the known result shape.',
      outcomeAndState:
        `The ${FINANCIAL_BENCHMARKING_NAME} runs in production within the CFO Group as one product across v1 and v2. The 2025 CFO One RBC Team Award recognized the v1 production delivery; v2 is a refactor of that product rather than a separate delivery.`,
      limits:
        'A similarity or model score routes the next action; it is not a probability that the selected KPI is correct. Failed checks or unresolved ambiguity stop the registered path before execution.',
    },
    blogPostSlug: 'text-to-sql',
    companionBlogPostSlug: 'financial-benchmarking-refactor',
  },
  {
    projectId: 'workforce-analytics',
    timeline: WORKFORCE_ANALYTICS_BUILD_WINDOW_LONG,
    era: 'Intelligent Systems',
    status: 'shipped',
    narrative: {
      problem:
        'CFO Group questions across headcount, compensation costs, and open positions had to be answered across authorized combinations of roughly 40,000 cost centres. Precomputing every possible answer was not a suitable design boundary.',
      contribution:
        `From March through the ${WORKFORCE_ANALYTICS_PRODUCTION_LAUNCH} launch, I conceived, architected, and built the ${WORKFORCE_ANALYTICS_NAME}, including the routing, entitlement, and deterministic calculation paths, while leading its cross-functional productionisation. This work ran alongside mentoring the 2025 Amplify cohort and a focused two-week refactor of the ${FINANCIAL_BENCHMARKING_NAME}. Engineering-services partners contributed to frontend and infrastructure delivery.`,
      decision: {
        selectedApproach:
          'Keep model-mediated interpretation and answer shaping at the language edges while deterministic code resolves entitlement, accesses records, and performs the financial calculations.',
        strongestAlternative:
          'Use a broader model-led path that directs data access and performs calculations over underlying records.',
        crux:
          'Language interpretation benefits from model flexibility; authorization and numerical calculation require controlled code paths with inspectable inputs and handoffs.',
        residualRisk:
          'Entitlement freshness, source completeness, configuration, validation coverage, and integration failures remain operating risks at the boundaries.',
      },
      mechanism:
        'A request is routed to the supported domain scope. Code resolves the authorized record set and calculates the requested result for headcount, compensation cost, or open positions; model-facing stages receive scoped metadata or structured aggregates to shape the response.',
      outcomeAndState:
        `The ${WORKFORCE_ANALYTICS_NAME} has run in production for the CFO Group since ${WORKFORCE_ANALYTICS_PRODUCTION_LAUNCH}, answering supported questions about compensation cost, headcount, and open positions within authorized scopes.`,
      limits:
        'The separation reduces the model-facing data surface but does not make boundary failures impossible. Access mappings, source records, calculation rules, and the versions retained for review must still be correct and current.',
    },
    blogPostSlug: 'agentic-ai',
    companionBlogPostSlug: 'workforce-analytics-model-boundary',
  },
  {
    projectId: 'funding-request-drafting',
    timeline: '2025 – Present',
    era: 'Intelligent Systems',
    status: 'shipped',
    narrative: {
      problem:
        'project funding requests are structured governance documents assembled from templates, policies, historical examples, and author knowledge. Missing or conflicting inputs make drafting iterative, and unresolved coverage must remain visible to the author.',
      contribution:
        `I conceived, architected, and built the ${DRAFTING_PLATFORM_NAME} end to end, from ingestion and the LangGraph state graph through bounded MCP tool routines, field-scoped retrieval, merge and coverage handling, and frontend integration. Cross-functional partners supported deployment and operation.`,
      decision: {
        selectedApproach:
          'Give one LangGraph orchestration scope ownership of the reviewed v1 workflow, with bounded tool routines for template guidance, field-scoped evidence, extraction, merge checks, and coverage handling.',
        crux:
          'Concurrent field-group work could improve drafting coverage without giving those routines independent workflow control; the graph and author retained the transition decisions.',
        residualRisk:
          'References, retained state, collision handling, and coverage results remain conditional on configured checks, available evidence, and the corresponding records being present for review.',
      },
      mechanism:
        'The graph carries a session from intake through template guidance, field-group retrieval, bounded extraction, ownership-aware merge, and coverage analysis. Passing checks produces a reviewable draft; missing coverage returns the session to clarification or human review.',
      outcomeAndState:
        `The ${DRAFTING_PLATFORM_NAME} became the first true agentic AI platform approved for production at the bank. Its pilot launched in April 2026, followed by a full CFO Group launch across all geographies in May 2026.`,
      limits:
        'Tool routines propose bounded work inside the graph; they are not independent agents. The author remains responsible for reviewing, revising, and accepting the draft, and unavailable evidence cannot be treated as covered.',
    },
    blogPostSlug: 'enterprise-agentic-ai-architecture',
    companionBlogPostSlug: 'funding-request-drafting-platform-building',
  },
];
