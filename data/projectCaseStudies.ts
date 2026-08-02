export interface OptionConsidered {
  option: string;
  prosAndCons: string;
  chosen: boolean;
}

export interface CaseStudySection {
  context: string;
  myRole: string;
  stakeholders: string;
  challenge: string;
  optionsConsidered: OptionConsidered[];
  decision: string;
  implementation: string;
  impact: string;
  inProduction: string;
  lessonsLearned: string;
}

export interface CaseStudyTLDR {
  /** The business problem in one sentence — what was broken, for whom */
  problem: string;
  /** The architectural or strategic call, one sentence — what you chose and why */
  decision: string;
  /** The outcome in one sentence — ideally a canonical metric + scale of reach */
  impact: string;
}

export interface CaseStudy {
  projectId: string;
  timeline: string;
  era: string;
  status?: 'shipped' | 'in-progress';
  statusLabel?: string;
  leadershipCallout?: string;
  /** Optional 3-bullet TL;DR rendered at the top of the case study page
   *  for skimmer / exec-audience readers. When unset, page opens with
   *  Context as before. */
  tldr?: CaseStudyTLDR;
  /** Optional sequencing / strategic-judgment narrative — short paragraph
   *  that contextualizes this project within the broader portfolio arc.
   *  Rendered after the Context section when set. */
  sequencing?: string;
  sections: CaseStudySection;
  // Canonical formal deep-dive post (Track 1: Technical Explorations).
  blogPostSlug?: string;
  // Builder-register companion post (Track 2: Building in Practice).
  // Semantically distinct: same system, different register.
  companionBlogPostSlug?: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    projectId: 'combustion-tuning',
    timeline: '2016 – 2019',
    era: 'Foundation',
    tldr: {
      problem:
        'One 900MW generating unit at the 1,800MW Maizuru coal-fired power station in Japan needed a data-driven way to evaluate combustion settings across noisy, high-dimensional operating data while keeping plant operators in control.',
      decision:
        'Built a Digital Twin — 84 independent regression models across 90+ sensors — with Particle Swarm Optimization proposing bounded candidate settings for plant-operator review.',
      impact:
        '$3M/year in savings from an operator-reviewed combustion-tuning system.',
    },
    sections: {
      context:
        'Kansai Electric owns and operates the 1,800MW Maizuru coal-fired power station in Japan. This project focused on one of its two 900MW generating units. The unit had 90+ sensors generating operational data, and the project used that history to model combustion behavior and produce tuning recommendations for operators.',
      myRole:
        'Data Scientist on a 3-person R&D team within TCS, partnered with MHPS (Mitsubishi Hitachi Power Systems). I owned the full ML pipeline: data collection from plant sensors, feature engineering, model development, optimization, and the feedback loop with plant operators. This was my first end-to-end ML project at scale.',
      stakeholders:
        'Kansai Electric (station owner and operator), MHPS engineering team (equipment and combustion-domain expertise), TCS delivery leadership (project governance), and Maizuru plant operators (end users who adjusted settings based on our recommendations).',
      challenge:
        'The core difficulty was multi-objective optimization under real-world constraints. We needed to simultaneously minimize NOx, SOx, and CO emissions while maintaining thermal efficiency — objectives that often conflict. The sensor data was noisy, high-dimensional (90+ inputs), and the unit operated under varying load conditions. Any model recommendations had to be trustworthy enough for operators to act on in a live 900MW generating unit.',
      optionsConsidered: [
        {
          option: 'Single comprehensive model predicting all outputs',
          prosAndCons: 'Simpler to maintain, but couldn\'t capture the distinct dynamics of each emission type. Poor accuracy on competing objectives.',
          chosen: false,
        },
        {
          option: '84 independent regression models + Particle Swarm Optimization',
          prosAndCons: 'More complex to build, but each model specializes. PSO can explore the multi-dimensional input space to find configurations that optimize across all objectives simultaneously.',
          chosen: true,
        },
        {
          option: 'Physics-based simulation (first principles modeling)',
          prosAndCons: 'Would require deep combustion engineering expertise and wouldn\'t adapt to plant-specific drift. Data-driven approach learns the actual plant behavior.',
          chosen: false,
        },
      ],
      decision:
        'We chose 84 independent regression models with PSO because each model could specialize on its prediction target while PSO handled the multi-objective search. The models served as objective functions — PSO explored bounded controllable-setting combinations, conditioned on observed plant state. This let the team represent explicit trade-offs without treating sensor readings as actuators.',
      implementation:
        'Built 84 independent regression models mapping observed state and candidate settings to emission and efficiency targets. Applied model selection using k-fold cross-validation with R², RMSE, MAPE, and fold variance stability as criteria. Then used Particle Swarm Optimization with the trained models as objective functions, exploring the bounded controllable-setting space. Results were delivered as candidate control settings for plant-operator review.',
      impact:
        '$3M in annual cost savings attributed to the combustion-tuning program. This project led to two Star of the Month awards (Nov 2017, Jan 2019).',
      inProduction:
        'The model was deployed as an operational tool at the plant, with operators reviewing recommended settings during combustion-tuning cycles. Subsequent sensor observations could be reviewed against the recommendations; feedback alone did not imply an automatic model update.',
      lessonsLearned:
        'This project taught me that the hardest part of ML is often the action boundary. Getting plant operators to assess recommendations required translating model outputs into concrete control settings and preserving their authority to accept, modify, or reject them. I later reused the questions around observation, estimation, choice, and action as a design heuristic — not as a claim that enterprise AI inherits control-system guarantees.',
    },
    blogPostSlug: 'closed-loop',
  },
  {
    projectId: 'document-intelligence',
    timeline: '2021 – 2022',
    era: 'Cloud ML',
    tldr: {
      problem:
        'Checkbox detection within Humana\'s insurance-document workflow sat at ~70% accuracy with Document AI alone, requiring manual review for that component.',
      decision:
        'Combined Document AI OCR with OpenCV pixel-level checkbox localization and a Random Forest checked/unchecked classifier within the Google Cloud workflow.',
      impact:
        '99.95% checkbox-detection accuracy for that component, up from the ~70% Document AI-only baseline. This is not a full-pipeline accuracy figure.',
    },
    sections: {
      context:
        'Humana\'s document-understanding workflow included structured forms whose checkboxes were not captured reliably by Document AI alone. The checkbox-detection component was measuring about 70% accuracy, leaving a meaningful manual-verification burden. Other document extraction work from this period is separate from the checkbox metric reported here.',
      myRole:
        'ML Engineer on Quantiphi\'s client delivery team, responsible for implementing the checkbox-detection component within a broader Google Cloud document-understanding workflow. I combined OCR output with OpenCV localization and a Random Forest classifier; deployment and the surrounding client workflow were delivered with the wider team. I also contributed to a separate inventory analytics workstream using SQL and Tableau for an enterprise retail client.',
      stakeholders:
        'Humana document-operations stakeholders, the Quantiphi delivery team, and Google Cloud partner engineers supporting the platform.',
      challenge:
        'Checkboxes are small, near-binary visual elements whose state can be lost when a general OCR service reduces a page to text and layout. The component needed to preserve Document AI\'s document context while adding pixel-level localization and a classifier specialized for checked-versus-unchecked state.',
      optionsConsidered: [
        {
          option: 'Document AI checkbox output alone',
          prosAndCons: 'Kept the pipeline simple and preserved OCR context, but the checkbox task remained at the ~70% baseline.',
          chosen: false,
        },
        {
          option: 'Document AI + OpenCV + Random Forest',
          prosAndCons: 'Retained Document AI for OCR and structure, added pixel-level checkbox localization with OpenCV, and specialized the final checked/unchecked decision with a Random Forest classifier.',
          chosen: true,
        },
      ],
      decision:
        'Use each component for the part it could support: Document AI for OCR and document structure, OpenCV for pixel-level checkbox localization, and Random Forest for checked-versus-unchecked classification. The narrow task boundary also keeps the reported accuracy attached to the component it actually measured.',
      implementation:
        'Document AI produced OCR and structural context for each form. OpenCV then localized checkbox regions at pixel level, and engineered visual features fed a Random Forest classifier that distinguished checked from unchecked states. The component output was rejoined with the surrounding document structure for the broader workflow.',
      impact:
        'Improved checkbox-detection accuracy from a ~70% Document AI-only baseline to 99.95%, reducing manual verification for that field type. The number applies only to checkbox detection; it does not describe OCR, entity extraction, or end-to-end document-pipeline accuracy.',
      inProduction:
        'Delivered on Google Cloud as part of Humana\'s document-understanding workflow, with the checkbox component feeding its classified state into the surrounding document process.',
      lessonsLearned:
        'A narrow model can materially improve a larger workflow when its boundary is explicit. The equally important reporting lesson is to keep an excellent component score attached to its task, baseline, and review surface rather than letting it become a claim about the entire pipeline.',
    },
  },
  {
    projectId: 'commodity-tax',
    timeline: '2022 – 2023',
    era: 'Enterprise Analytics',
    tldr: {
      problem:
        'RBC\'s Commodity Tax return process consumed finance teams for months per cycle — manual General Ledger extraction, reconciliation, and error-prone return preparation.',
      decision:
        'PySpark pipeline for GL data extraction paired with Tableau dashboards — not only as output, but as a transparency layer for inspecting configured stages and recorded transformations.',
      impact:
        'Months → 90 minutes per cycle on a roughly $600M tax allocation. CFO Group RBC Quarterly Team Award (Q4 2023). The delivery helped establish credibility for subsequent AI initiatives in the CFO Group.',
    },
    sequencing:
      'Commodity Tax was the cascade origin. When I joined the CFO Group in 2022, nobody had asked me to build AI — I was hired to automate a tax process. Delivering that in under a year, with dashboards the CFO could audit, earned the credibility to propose Aegis v1 (Big 6 bank benchmarking, 2024), then refactor it into Aegis v2 in a concurrent 2-week sprint (2025), then Astraeus (production 2025), then conceive PAR Assist and build it end-to-end after handing the concept to the 2025 Amplify cohort for problem-space ideation (pilot launched April 2026). Each project underwrote the next one\'s scope. The Commodity Tax wasn\'t about tax — it was about proving I could deliver production systems in regulated finance before asking for license to build something ambitious.',
    blogPostSlug: 'commodity-tax-provenance',
    companionBlogPostSlug: 'commodity-tax-cfo-trust',
    leadershipCallout:
      'This was my first project at RBC — and I treated it as an audition. By choosing Tableau as a transparency layer (not just an output), I gave finance stakeholders a way to inspect configured stages and recorded lineage. The delivery helped build the credibility to propose Aegis, Astraeus, and PAR Assist. The months-to-90-minutes metric became a concrete result to discuss with CFO leadership.',
    sections: {
      context:
        'The Commodity Tax return process within RBC\'s CFO Group was a massive manual effort — finance teams spent months each cycle extracting data from General Ledger journals, reconciling figures, and preparing tax returns. The process was error-prone, time-consuming, and consumed significant analyst bandwidth that could be directed at higher-value work.',
      myRole:
        'Lead developer and primary stakeholder liaison. I owned the technical solution end-to-end and was the bridge between the finance team (who understood the tax process) and the AI team (who could automate it). This was my first project at RBC and an important credibility-building delivery.',
      stakeholders:
        'CFO Group finance team (tax analysts and managers), Enterprise Finance leadership, Director AI (governance and priority alignment).',
      challenge:
        'The tax process was deeply embedded in manual workflows that had accumulated years of institutional knowledge — undocumented edge cases, manual overrides, and tribal knowledge about which GL accounts mapped to which tax categories. Automating it meant not just building a pipeline, but understanding and codifying that institutional knowledge.',
      optionsConsidered: [
        {
          option: 'Full custom automation from scratch',
          prosAndCons: 'Maximum control but high risk — would take months to build and might miss edge cases embedded in the existing process.',
          chosen: false,
        },
        {
          option: 'PySpark pipeline + Tableau dashboards',
          prosAndCons: 'PySpark handles General Ledger extraction at scale; Tableau provides the visibility finance teams need to trust and verify results. Incremental approach — automate extraction first, then add monitoring.',
          chosen: true,
        },
      ],
      decision:
        'We chose PySpark for the heavy data extraction (GL journals are massive) paired with Tableau dashboards for financial KPI monitoring. The dashboards were critical — they gave the finance team visibility into what the automation was doing, which built trust. This wasn\'t just a technical choice; it was a stakeholder management strategy.',
      implementation:
        'Built a PySpark pipeline for General Ledger Journal data extraction at scale, replacing the manual process. Created advanced Tableau dashboards for financial KPI monitoring that gave tax analysts interactive visibility into the data flow. The pipeline codified the institutional knowledge about GL-to-tax-category mappings that had previously lived in spreadsheets and people\'s heads.',
      impact:
        'Reduced the Commodity Tax return process from months to 90 minutes. Recognized with the CFO Group RBC Quarterly Team Award (Q4 2023). The result gave leadership concrete evidence that the team could deliver measurable value and strengthened the case for later AI work.',
      inProduction:
        'Running in production within the CFO Group. The automated pipeline processes each tax cycle, with Tableau dashboards providing ongoing monitoring and verification for the finance team.',
      lessonsLearned:
        'The biggest lesson was that the technical solution is sometimes the easy part. Building trust with finance stakeholders required making configured stages and lineage inspectable — hence Tableau as the transparency layer. The “months to 90 minutes” result helped subsequent proposals, and reinforced that a first project in a new organization is also an audition.',
    },
  },
  {
    projectId: 'aegis',
    timeline: '2024 – 2025',
    era: 'Intelligent Systems',
    tldr: {
      problem:
        'CFO Group analysts benchmarked KPIs against Big 6 Canadian banks manually via Supplementary Financial Packages — hours per query, error-prone, hard to scale.',
      decision:
        'Five-stage pipeline: intent parsing, embeddings-based KPI detection, confidence-gated disambiguation, SQL generation from reviewed templates with parameter binding, then deterministic formatting.',
      impact:
        'Refactored the v1 benchmarking module into the v2 architecture in a focused 2-week sprint — while simultaneously running Astraeus development and the Amplify intern program — then handed it to my direct report, who incorporated it into Aegis v2 with the broader team. v1 had earned the 2025 CFO One RBC Team Award; v2 inherited the trust that made the sprint possible.',
    },
    sections: {
      context:
        'RBC\'s CFO Group needed to benchmark financial KPIs against the Big 6 Canadian banks using Supplementary Financial Packages — publicly available but complex financial disclosures. Aegis v1 was a rules-based benchmarking engine I\'d built and productionized earlier. v2 was a focused refactor of that system: natural language queries to validated SQL, with embeddings-based KPI disambiguation.',
      myRole:
        'Refactored the Aegis v1 benchmarking module into a five-stage v2 pipeline in a focused two-week sprint while simultaneously leading Astraeus development and the Amplify intern program, then handed it to my direct report, who collaborated with the broader team to integrate and productionalize it as Aegis v2. A deliberate sprint: months of research and brainstorming crystallized into two weeks of focused execution.',
      stakeholders:
        'CFO Group leadership (strategic benchmarking consumers), finance analysts (daily users), Director AI (priority alignment across concurrent workstreams).',
      challenge:
        'Financial KPI disambiguation is harder than general text-to-SQL. KPI names in supplementary packages are ambiguous — "CET1 Ratio" might appear under different names across banks, and similar-sounding KPIs can mean very different things. The system needed to handle that ambiguity while constraining the executable SQL surface to reviewed templates and allowed schema elements. And it needed to ship fast — I had a two-week window before other priorities consumed my bandwidth.',
      optionsConsidered: [
        {
          option: 'Extend Aegis v1 with LLM layer on top',
          prosAndCons: 'Lower risk, but v1\'s architecture wasn\'t designed for natural language input. Bolting NLP onto a rules engine creates fragile coupling.',
          chosen: false,
        },
        {
          option: 'Refactor v1 into a five-stage decomposed pipeline',
          prosAndCons: 'Higher initial effort than adding a thin LLM layer, but it preserved the proven product boundary while making each stage testable, deterministic where possible, and LLM-assisted only where needed.',
          chosen: true,
        },
      ],
      decision:
        'The five-stage decomposed pipeline (intent parsing → KPI detection → LLM-assisted disambiguation → guardrailed SQL generation → deterministic formatting) let each stage own a specific concern. Rule-based stages handle the deterministic parts; LLM-assisted stages handle ambiguity — but with confidence thresholds and guardrails. This architecture makes the system auditable and testable despite using LLMs.',
      implementation:
        'Stage 1: constrained JSON-schema generation parses natural language into a typed intent tuple (metric, time, comparison, output format). Stage 2: deterministic embedding similarity search returns a candidate set from the KPI catalog. Stage 3: a confidence gate accepts a dominant candidate or asks an LLM disambiguator to choose using names and definitions; a below-threshold result returns a clarification request. Stage 4: pre-authored, schema-allow-listed SQL templates bind values as parameters, with structural, SELECT-only, parameter-type, and deny-list checks before execution. Stage 5: deterministic formatting uses the output shape fixed at intent-parse time.',
      impact:
        'Refactored the v1 benchmarking module into the production text-to-SQL architecture in two weeks; my direct report then integrated and productionalized it with the broader team as Aegis v2. Reviewed templates, parameter binding, schema checks, confidence-gated clarification, and stage-level tests constrain the failure surface; they remain dependent on configuration, validation coverage, and model calibration. The focused refactor ran concurrently with Astraeus productionization and the Amplify intern program. Its speed came from a shelved-and-resumed architecture—an earlier model had failed the calibration bar, while a later model cleared the held-out evaluation—plus the operational trust v1 had already earned. The 2025 CFO One RBC Team Award recognized v1\u2019s productionization, the precondition for v2\u2019s mandate.',
      inProduction:
        'Running in production within the CFO Group as the primary benchmarking tool. Finance analysts use natural language to query cross-bank KPI comparisons, replacing manual spreadsheet lookups.',
      lessonsLearned:
        'Two weeks sounds fast, but the real work happened in the months before — research, brainstorming, and learning from v1\'s limitations. The sprint was crystallization, not improvisation. I also learned the power of decomposition: by breaking the pipeline into five stages with clear contracts, I could build and test each one independently. The speed came from clarity, not shortcuts.',
    },
    blogPostSlug: 'text-to-sql',
    companionBlogPostSlug: 'aegis-v2-velocity',
  },
  {
    projectId: 'astraeus',
    timeline: '2025 (production Nov 2025)',
    era: 'Intelligent Systems',
    status: 'shipped',
    tldr: {
      problem:
        'CFO Group financial questions — "headcount by division, crossed with open positions, crossed with tenure" — bounced through days of email. The existing workflow did not support interactive arbitrary-combination queries across ~40K leaf-level cost centres with entitlement controls. Earlier attempts had scoped out the dynamic ins-outs question (who joined / left / moved between any two authorized groups) because precomputing the subset-selection space was infeasible.',
      decision:
        'Two-wall architecture. LLM calls handle gate, metadata extraction, answer shaping, and synthesis using scoped metadata or structured aggregates. Between the walls, Cython-compiled Python runs event-level ins-outs math over ~40K leaf-level cost centres, with the permission-to-SQL entitlement cascade applied before compute. Simple queries take one Answer call; cross-domain queries fan out to 3 parallel Answer-stage calls (Compensation Costs / Headcount / Open Positions) plus a final synthesis.',
      impact:
        'Days of email replaced by interactive answers via dashboard, chatbot, and HTML reports. Dynamic ins-outs analysis—previously scoped out at bank scale—is now supported. Production since November 2025, with an accompanying technical note on the architecture.',
    },
    leadershipCallout:
      'I conceived, architected, and built Astraeus, then led its cross-functional productionisation with the engineering services partner. The defining architectural decision was choosing LLM-as-Router over a monolithic agent: the common prototype pattern—broad model access for a faster demo—did not fit the data, entitlement, and calculation constraints. The two-wall architecture reduced the model-facing surface, made handoffs inspectable, and kept numerical calculation on a deterministic path. I stayed ~70% hands-on while partner teams contributed to frontend and infrastructure delivery.',
    sections: {
      context:
        'RBC\'s CFO Group needed a single platform for financial insights (headcount analytics, compensation costs, open positions) serving three delivery channels: interactive dashboard, chatbot, and inbox-ready HTML reports. The data spans ~40,000 cost centres (the shared leaves of two hierarchies, each cost centre representing one or more teams) queryable in any combination, rolling up through ~9,000 parent nodes in an 18-level business-segment hierarchy plus a separate geography hierarchy, with strict entitlement controls so users see only what they\'re authorized to access.',
      myRole:
        'Conceived, architected, and built Astraeus, then led its cross-functional productionisation. I defined the "CFO-ready" vision — at-a-glance, trustworthy insights delivered to the inbox with drill-through across domains — designed the two-wall architecture, built the permission-to-SQL entitlement cascade, and wrote the event-level ins-outs math in Cython-compiled Python. Engineering services partners contributed to frontend and infrastructure delivery. ~70% hands-on.',
      stakeholders:
        'CFO Group leadership (executive consumers), finance analysts and HR teams (daily users), engineering services partner peers (co-delivery on frontend and infrastructure), Director AI (governance and priority), 1 Senior AI Scientist direct report contributing to development, rotating summer interns.',
      challenge:
        'Three simultaneous hard problems. (1) Subset selection: arbitrary-combination queries across roughly 40,000 leaf-level cost centres and 9,000 business-hierarchy rollups create a combinatorial precomputation problem at interactive response times. Previous attempts scoped the feature out. (2) Security: EPM entitlements had to resolve into SQL-level access filters before compute, with checks for catalog freshness and handoff failures. (3) Trust: CFO-grade calculations need a deterministic data path, while model-assisted routing and answer shaping require validation and monitoring at their boundaries.',
      optionsConsidered: [
        {
          option: 'Monolithic LLM agent with direct data access',
          prosAndCons: 'Simpler and faster to demo, but placing underlying records in model context expands the governed exposure surface, model-generated calculations are probabilistic, and model-directed queries alone do not provide the typed trace records finance review requires. Rejected on governance grounds before engineering began.',
          chosen: false,
        },
        {
          option: 'Pre-computed OLAP cube / materialized-view approach',
          prosAndCons: 'The obvious choice for analytics scale, but precomputing every supported subset over roughly 40,000 cost-centre leaves becomes infeasible for dynamic arbitrary-combination ins-outs. Scoped out in earlier attempts at the problem.',
          chosen: false,
        },
        {
          option: 'Traditional BI dashboard without AI',
          prosAndCons: 'Proven, but wouldn\'t deliver chatbot or automated reporting; couldn\'t scale to the drill-through depth leadership asked for. And keeps the ins-outs problem unsolved.',
          chosen: false,
        },
        {
          option: 'Two-wall architecture: LLM intent side → deterministic Cython compute → LLM synthesis side',
          prosAndCons: 'More architecture to design and defend, but it separates model-assisted intent and answer shaping from entitlement and event-level compute. The Cython path evaluates the requested authorized subset over event rows instead of precomputing the subset space, while the permission-to-SQL cascade resolves the authorized input set before compute. Typed contracts, privilege checks, and monitoring remain necessary at the boundaries.',
          chosen: true,
        },
      ],
      decision:
        'The two-wall architecture separates model-assisted work from the deterministic data path. LLM calls parse the natural-language query, route scope, extract structured metadata for up to 3 parallel domain calls, and shape the final answer from approved aggregates. In between, deterministic code resolves permission-to-SQL entitlements (domain permissions → access groups → entities → cost centres → SQL tables), runs event-level ins-outs math in Cython-compiled Python, and applies netting semantics that fold intra-rollup movements to net-zero. The declared contracts allow parsed metadata to cross down and structured aggregates to cross up; record-level inputs stay outside the intended model-call surface and are checked at each handoff.',
      implementation:
        'A custom Python router orchestrates the flow (no off-the-shelf agent framework). Each query uses 5 to 8 LLM calls: 1 gate + 3 parallel domain metadata extracts (compensation costs, headcount, open positions) + 1 answer on the simple path, or 3 parallel Answer-stage calls + 1 synthesis on the cross-domain path. Between them, Cython-compiled Python runs event-level math over employees modeled as join, leave, and transfer events, with netting semantics across arbitrary 40K-leaf combinations. The permission-to-SQL cascade resolves the filtered input set at query time. Transactional storage supports event, entitlement, hierarchy, and trace records. Delivery surfaces include a production dashboard, conversational interface, and HTML reports.',
      impact:
        'Days of email were replaced by interactive answers. Dynamic ins-outs analysis—who joined, left, or transferred between authorized groups over a selected time window—is now supported after previous attempts had scoped it out. Modeling movements as events makes a requested subset an event-filtering and netting problem instead of a requirement to precompute the combinatorial subset space. The architecture currently spans Compensation Costs, Headcount, and Open Positions, with entitlement resolution, typed handoffs, validation, and logging used to constrain the data and model surfaces.',
      inProduction:
        'Running in production since November 2025 across dashboard, conversational, and HTML-report surfaces.',
      lessonsLearned:
        'The architectural lesson: a combinatorial query space does not require a precomputed answer space. Modeling employees as events lets each authorized query filter and net the relevant rows at runtime. The product lesson: LLMs and deterministic code serve different purposes — LLMs for intent, code for governed calculations. Astraeus is now one design reference I use when deciding where model calls end and conventional controls begin.',
    },
    blogPostSlug: 'agentic-ai',
    companionBlogPostSlug: 'astraeus-llm-as-router',
  },
  {
    projectId: 'par-assist',
    timeline: '2025 – Present',
    era: 'Intelligent Systems',
    status: 'shipped',
    tldr: {
      problem:
        'RBC\'s Project Approval Request process is a manual, iterative governance workflow shaped by fragmented templates, sometimes-conflicting policies, and institutional knowledge held by experienced authors.',
      decision:
        'First true agentic AI platform approved for production at the bank, built inside a single-agent governance envelope: LangGraph orchestration, a typed template tool, bounded field-group retrieval, concurrent scoped extraction with ownership-aware merge, and a coverage + follow-ups loop.',
      impact:
        'Pilot launched April 2026; full CFO Group launch across all geographies followed in May 2026. A multi-agent successor is in pilot.',
    },
    leadershipCallout:
      'Conceived PAR Assist, the first true agentic AI platform approved for production at the bank. Handed the concept to 2025 Amplify interns as an ideation exercise to explore the problem space, then built the production system end-to-end: ingestion paths, the LangGraph state graph, the MCP tool layer (template selection, field assignment, conflict resolution, ambiguity detection), transactional workflow state, vector-backed field-group retrieval, and frontend integration. Its pilot launched in April 2026, followed by a full CFO Group launch across all geographies in May.',
    sections: {
      context:
        'Project Approval Requests (PARs) are a critical governance process at RBC for significant initiatives, and drafting them involves metadata, policies, historical examples, and institutional knowledge. I conceived PAR Assist to transform that drafting process. The concept was handed to 2025 Amplify interns as an ideation exercise to explore the problem space; I then built the production system end-to-end as the first true agentic AI platform approved for production at the bank.',
      myRole:
        'Conceived the product vision, designed the agentic architecture, and built the production system end-to-end: ingestion paths, the LangGraph state graph, the MCP tool layer (template selection, field assignment, conflict resolution, ambiguity detection), transactional workflow state, vector-backed field-group retrieval, and frontend integration. Production deployment runs through GFT (RBC\'s Global Functions Technology team) on OpenShift via CI/CD.',
      stakeholders:
        'CFO Group leadership (sponsor), enterprise stakeholders across the bank (PAR authors in every department), Director AI (governance and priority), 2025 Amplify interns (problem-space ideation exploration), GFT (Global Functions Technology, RBC\'s infrastructure team) for OpenShift CI/CD production deployment.',
      challenge:
        'Two problems stacked on top of each other. The domain problem: PARs are not standardized — different templates for different initiative types, conflicting policies, ambiguous fields, institutional knowledge that lives in people\'s heads. The meta problem: this was the first true agentic AI platform approved for production at the bank, and its governance envelope was a single-agent design. The architecture had to support branching dialogs, parallel specialized work, and multi-turn state without multi-agent orchestration, while routing actions through typed contracts that produce structured audit records.',
      optionsConsidered: [
        {
          option: 'Simple RAG chatbot with document retrieval',
          prosAndCons: 'Quick to build, but does not by itself provide the structured workflow state, registered-action tracing, collision review, and follow-up checkpoints needed for PAR drafting.',
          chosen: false,
        },
        {
          option: 'True multi-agent orchestration with specialist sub-agents per field domain',
          prosAndCons: 'Architecturally the cleanest mapping of the problem, but it would not have cleared the single-agent governance envelope approved for the production system.',
          chosen: false,
        },
        {
          option: 'Flat RAG — one embedding index over all chunks',
          prosAndCons: 'Simplest retrieval, but our evaluation surfaced chunks from unrelated fields and templates because retrieval was not scoped by target field. It also lacked an explicit ownership relationship between a retrieved chunk and the fields it could support.',
          chosen: false,
        },
        {
          option: 'LangGraph + MCP tools + two-stage field-group retrieval + scoped parallel extraction',
          prosAndCons: 'LangGraph was picked for maturity and fit with conditional workflows. MCP tools provide typed action contracts and structured dispatch records. Two-stage retrieval organizes knowledge by target field groups rather than source document. A bounded number of group-scoped extraction calls can run concurrently inside a single-agent envelope. Transactional state and vector-backed retrieval support retained workflow data and trace records.',
          chosen: true,
        },
      ],
      decision:
        'PAR drafting is a stateful, branching workflow over a structured form with regulatory audit requirements. LangGraph (picked for maturity and workflow fit; CrewAI/AutoGen were considered but not deeply evaluated) provides the graph engine and retained checkpoints. Template selection is a typed MCP tool with a guided dialog that returns a template identifier with a score and rationale. Retrieval reshapes the knowledge base around the target: stage 1 selects relevant field groups, stage 2 retrieves a bounded candidate set within each group, and compression fits each scoped extraction payload to its context budget. A bounded number of group calls can run concurrently, with one expected owner per target field and collision handling for duplicate or out-of-scope contributions. A coverage analyzer surfaces follow-ups and loops the session through clarification when inputs remain open.',
      implementation:
        'A LangGraph graph orchestrates the session (intake → template → retrieve → extract → merge → coverage → respond), with conditional edges for loops. Registered actions use MCP tools with typed inputs and structured dispatch records. Supported source material passes through approved parsing or OCR-assisted extraction paths. Field groups form a taxonomy over the target template; two-stage similarity search and compression produce bounded, group-scoped payloads. Extraction calls can run concurrently within configured capacity, and an ownership-aware merge routes collisions for review. If the coverage analyzer finds open follow-ups, the session loops to clarification. Transactional workflow state and vector-backed retrieval retain the declared session data and trace records needed by the registered path.',
      impact:
        'Transformed a manual, iterative governance process into a guided drafting session with available field-level source references and a coverage loop for unresolved inputs. Pilot launched April 2026 with the first wave of PAR authors; full CFO Group launch across all geographies followed in May 2026.',
      inProduction:
        'Pilot shipped April 2026; full CFO Group launch across all geographies followed in May 2026. MCP tool calls use typed contracts and structured logs; field-level source references and coverage checks make missing grounding visible. Retained checkpoint, tool, retrieval, and field records support review of the registered session path when the corresponding versions and records are available. A multi-agent successor is in pilot.',
      lessonsLearned:
        'Two lessons, one technical and one organizational. Technical: an early agentic deployment in a regulated environment is not about maximum capability; it is about making the reviewed envelope explicit and preserving reusable contracts. Organizational: handing a concept to interns as an ideation exercise can widen problem-space exploration while the production build follows a separate delivery path. The Amplify cohort explored angles I might otherwise have prioritized later; the production platform was then built against a clear architectural thesis.',
    },
    blogPostSlug: 'enterprise-agentic-ai-architecture',
    companionBlogPostSlug: 'par-assist-building',
  },
];
