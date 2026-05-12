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
        'A 900MW coal plant in Japan ran with fuel inefficiency and high emissions — operator settings were calibrated against idealized bench conditions, not the live combustion dynamics the plant actually faced.',
      decision:
        'Built a Digital Twin — 84 regression models across 90+ sensors — optimized by Particle Swarm Optimization to recommend settings in closed loop with plant operators.',
      impact:
        '$3M/year in fuel savings and measurable NOx/SOx/CO reduction. The framework became a replicable template for other industrial clients at TCS.',
    },
    sections: {
      context:
        'Maizuru is a 900MW coal power plant in Japan operated by a major energy company. Combustion inefficiency was costing millions annually in wasted fuel and excessive emissions (NOx, SOx, CO). The plant had 90+ sensors generating continuous operational data, but no systematic way to translate that data into actionable tuning recommendations for operators.',
      myRole:
        'ML Engineer on a 3-person R&D team within TCS, partnered with MHPS (Mitsubishi Hitachi Power Systems). I owned the full ML pipeline: data collection from plant sensors, feature engineering, model development, optimization, and the feedback loop with plant operators. This was my first end-to-end ML project at scale.',
      stakeholders:
        'Japanese energy company (plant owner), MHPS engineering team (domain expertise on combustion dynamics), TCS delivery leadership (project governance), and plant operators (end users who adjusted settings based on our recommendations).',
      challenge:
        'The core difficulty was multi-objective optimization under real-world constraints. We needed to simultaneously minimize NOx, SOx, and CO emissions while maintaining thermal efficiency — objectives that often conflict. The sensor data was noisy, high-dimensional (90+ inputs), and the plant operated under varying load conditions. Any model recommendations had to be trustworthy enough for operators to act on in a live 900MW facility.',
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
        'We chose the 84-model ensemble with PSO because it let each model specialize on its prediction target while PSO handled the multi-objective optimization. The models served as objective functions — PSO explored the input space to find sensor configurations that minimized emissions. This gave us the flexibility to balance competing objectives without hard-coding trade-offs.',
      implementation:
        'Built 84 simultaneous ML regression models mapping sensor inputs to emission and efficiency outputs. Applied rigorous model selection using k-fold cross-validation with R², RMSE, MAPE, and fold variance stability as criteria. Then used Particle Swarm Optimization with the trained models as objective functions, exploring the input parameter space to find configurations that minimized emissions while maintaining efficiency. Results were delivered as recommended sensor settings to plant operators.',
      impact:
        '$3M in annual cost savings through reduced fuel waste and improved combustion efficiency. Measurable reduction in NOx, SOx, and CO emissions. This project directly led to two Star of the Month awards (Nov 2017, Jan 2019) and established the Digital Twin approach as the replicable pattern TCS adopted for other industrial clients.',
      inProduction:
        'The model was deployed as an operational tool at the Maizuru plant, with operators using recommended settings during combustion tuning cycles. The closed-loop feedback (model recommends → operator adjusts → sensors measure → model improves) ran continuously during my tenure.',
      lessonsLearned:
        'This project taught me that the hardest part of ML isn\'t the model — it\'s the feedback loop. Getting plant operators to trust and act on ML recommendations required translating model outputs into terms they understood (specific valve positions, not abstract parameters). The PSO approach also taught me that optimization is a design pattern, not just a technique — a lesson that resurfaced years later in agentic AI.',
    },
    blogPostSlug: 'closed-loop',
    companionBlogPostSlug: 'combustion-tuning-operators',
  },
  {
    projectId: 'document-intelligence',
    timeline: '2021 – 2022',
    era: 'Cloud ML',
    tldr: {
      problem:
        'Insurance claim document verification at Humana sat at ~70% accuracy with Document AI alone — too low for production, forcing expensive manual review.',
      decision:
        'Layered OpenCV pixel-level checkbox detection and a Random Forest classifier on top of Document AI OCR, routed through Vertex AI with BigQuery for downstream analytics.',
      impact:
        '99.95% checkbox accuracy — a production-ready pipeline. The structure-aware approach later informed RAG chunking strategy at RBC.',
    },
    sections: {
      context:
        'Insurance claims processing is document-heavy — claim forms, policy documents, supporting evidence, identity verification. Quantiphi\'s insurance clients were drowning in manual review: adjusters and underwriters spending hours per claim extracting fields from scanned PDFs, photos of damaged property, handwritten forms, and multi-page policy documents. The bottleneck wasn\'t decision-making — it was getting structured data out of unstructured documents fast enough to make decisions at scale.',
      myRole:
        'ML Engineer responsible for designing and building the end-to-end document processing pipeline on Google Cloud. I owned the architecture from ingestion to validated output: choosing which GCP services to compose, building the entity extraction layer, deploying custom and AutoML models via Vertex AI, and tuning the pipeline for cost efficiency at scale. Also led a parallel inventory analytics workstream using SQL and Tableau for enterprise retail clients.',
      stakeholders:
        'Insurance client teams (claims operations managers, underwriting leads), Quantiphi delivery lead and project manager, Google Cloud partner engineering team (platform guidance and co-development support).',
      challenge:
        'Insurance documents are uniquely messy: scanned claim forms with variable layouts, handwritten damage descriptions, photos mixed with text, multi-page policies where the relevant clause is buried on page 47. OCR alone wasn\'t enough — the pipeline needed to understand document structure (which section is this field in?) and handle graceful degradation when scan quality was poor. On top of that, GCP costs scale with volume, so the architecture had to be cost-conscious — over-processing low-confidence documents on expensive custom models would blow the economics.',
      optionsConsidered: [
        {
          option: 'Custom-trained models only',
          prosAndCons: 'Maximum accuracy for specific document types, but required large labeled datasets per client and weeks of training per document format. Didn\'t scale across client variety.',
          chosen: false,
        },
        {
          option: 'Off-the-shelf vendor solution (e.g., ABBYY, Kofax)',
          prosAndCons: 'Fastest to deploy, but limited customization for insurance-specific fields. Vendor lock-in and per-page pricing made it expensive at scale. Couldn\'t handle the client\'s non-standard form layouts.',
          chosen: false,
        },
        {
          option: 'GCP Document AI + Vertex AI hybrid pipeline',
          prosAndCons: 'Document AI handles OCR and structural parsing out of the box; AutoML provides quick-start classification for standard forms; custom Vertex AI models handle edge cases (handwritten fields, damaged scans). Incremental — start with AutoML, upgrade to custom where accuracy demands it.',
          chosen: true,
        },
      ],
      decision:
        'The hybrid pipeline let us deliver value fast while keeping a clear upgrade path. Document AI handled the OCR and structural parsing — it\'s excellent at decomposing pages into fields and tables. AutoML classified document types (claim form vs. policy vs. ID) with minimal training data. For high-value extraction tasks where AutoML accuracy wasn\'t sufficient (e.g., handwritten damage descriptions, non-standard form layouts), we trained custom models on Vertex AI. The tiered approach also controlled costs: AutoML is cheap per-inference, custom models are reserved for documents that need them.',
      implementation:
        'Ingestion layer receives scanned documents (PDFs, images). Document AI performs OCR with structural parsing — extracting not just text but document layout (tables, key-value pairs, form fields). A classification stage routes documents to the appropriate extraction pipeline based on type. Vertex AI models (AutoML for standard forms, custom for edge cases) extract entities: claimant names, policy numbers, damage descriptions, dates, amounts. A validation layer cross-references extracted data against business rules (e.g., policy number format, date ranges, required fields). Structured output is delivered for downstream claims processing.',
      impact:
        'Reduced manual document review time for insurance claims processing. Established a replicable GCP pipeline pattern that Quantiphi could adapt across their insurance client base. The document processing architecture — parsing structure from unstructured sources, tiered model selection, cost-conscious inference — directly informed my later work on RAG pipelines at RBC, where I built chunking and embedding pipelines for PDFs, PPTX, and DOCX.',
      inProduction:
        'Deployed on Google Cloud Platform for active use in insurance claims workflows. The pipeline processed claim documents in production, feeding structured data into downstream adjudication and underwriting systems.',
      lessonsLearned:
        'Two things stayed with me. First, cost-per-inference matters as much as accuracy at scale — we had to architect the pipeline so expensive custom models only ran on documents that needed them, which taught me to think about ML economics, not just ML metrics. Second, document structure is information: knowing which section a field appears in (header vs. body vs. footer) dramatically improves extraction accuracy. This insight resurfaced directly when I built RAG pipelines at RBC — chunking documents by structure rather than fixed token windows was the difference between useful and useless retrieval.',
    },
    blogPostSlug: 'document-intelligence-accuracy-cliff',
  },
  {
    projectId: 'commodity-tax',
    timeline: '2022 – 2023',
    era: 'Enterprise Analytics',
    tldr: {
      problem:
        'RBC\'s Commodity Tax return process consumed finance teams for months per cycle — manual General Ledger extraction, reconciliation, and error-prone return preparation.',
      decision:
        'PySpark pipeline for GL data extraction paired with Tableau dashboards — not as output, but as the transparency layer that let skeptical finance analysts audit every step.',
      impact:
        'Months → 90 minutes per cycle on ~$600M tax allocation. CFO Group RBC Quarterly Team Award (Q4 2023). The stakeholder-trust win that opened the door to every subsequent AI initiative at the CFO Group.',
    },
    sequencing:
      'Commodity Tax was the cascade origin. When I joined the CFO Group in 2022, nobody had asked me to build AI — I was hired to automate a tax process. Delivering that in under a year, with dashboards the CFO could audit, earned the credibility to propose Aegis v1 (Big 6 bank benchmarking, 2024), then Aegis v2 (AI-native rewrite, 2 weeks, 2024), then Astraeus (production 2025), then conceive PAR Assist and build it end-to-end after handing the concept to the 2025 Amplify cohort for problem-space ideation (pilot launched April 2026). Each project underwrote the next one\'s scope. The Commodity Tax wasn\'t about tax — it was about proving I could deliver production systems in regulated finance before asking for license to build something ambitious.',
    blogPostSlug: 'commodity-tax-provenance',
    companionBlogPostSlug: 'commodity-tax-cfo-trust',
    leadershipCallout:
      'This was my first project at RBC — and I treated it as an audition. By choosing Tableau as the transparency layer (not just an output), I gave skeptical finance stakeholders visibility into every step of the automation. The resulting trust didn\'t just deliver Commodity Tax — it opened the door for Aegis, Astraeus, and every AI initiative that followed. The months-to-90-minutes metric became the team\'s calling card with CFO leadership.',
    sections: {
      context:
        'The Commodity Tax return process within RBC\'s CFO Group was a massive manual effort — finance teams spent months each cycle extracting data from General Ledger journals, reconciling figures, and preparing tax returns. The process was error-prone, time-consuming, and consumed significant analyst bandwidth that could be directed at higher-value work.',
      myRole:
        'Lead developer and primary stakeholder liaison. I owned the technical solution end-to-end and was the bridge between the finance team (who understood the tax process) and the AI team (who could automate it). This was my first project at RBC and the one that built the trust needed for everything that followed.',
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
        'Built a PySpark pipeline for General Ledger Journal data extraction at scale, replacing the manual process. Created advanced Tableau dashboards for financial KPI monitoring that gave tax analysts real-time visibility into the data flow. The pipeline codified the institutional knowledge about GL-to-tax-category mappings that had previously lived in spreadsheets and people\'s heads.',
      impact:
        'Reduced the Commodity Tax return process from months to 90 minutes. Recognized with the CFO Group RBC Quarterly Team Award (Q4 2023). More importantly, this project built the stakeholder trust that opened the door to AI — leadership saw that the AI team could deliver tangible, measurable value. Without this win, Astraeus and PAR Assist might never have been greenlit.',
      inProduction:
        'Running in production within the CFO Group. The automated pipeline processes each tax cycle, with Tableau dashboards providing ongoing monitoring and verification for the finance team.',
      lessonsLearned:
        'The biggest lesson was that the technical solution is sometimes the easy part. Building trust with finance stakeholders who were skeptical of automation required showing them every step — hence Tableau as the transparency layer. The "months to 90 minutes" metric became a calling card that opened doors for every subsequent AI initiative. I learned that your first project at a new organization isn\'t just a deliverable; it\'s an audition.',
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
        'Five-stage pipeline: intent parsing, embeddings-based KPI detection, LLM-assisted disambiguation, guardrailed SQL generation, deterministic formatting. SQL injection impossible by construction.',
      impact:
        'Shipped to production in 2 weeks — while simultaneously running Astraeus development and the summer intern program. v1 had earned the 2025 CFO One RBC Team Award; v2 inherited the trust that made the sprint possible.',
    },
    sections: {
      context:
        'RBC\'s CFO Group needed to benchmark financial KPIs against the Big 6 Canadian banks using Supplementary Financial Packages — publicly available but complex financial disclosures. Aegis v1 was a rules-based benchmarking engine I\'d built and productionized earlier. v2 was the AI-native evolution: natural language queries to validated SQL, with embeddings-based KPI disambiguation.',
      myRole:
        'Sole designer and builder of Aegis v2. I designed the five-stage pipeline architecture, implemented it, and shipped it to production — all within two weeks, while simultaneously leading Astraeus development and the summer intern program. This was a deliberate sprint: months of research and brainstorming crystallized into two weeks of focused execution.',
      stakeholders:
        'CFO Group leadership (strategic benchmarking consumers), finance analysts (daily users), Director AI (priority alignment across concurrent workstreams).',
      challenge:
        'Financial KPI disambiguation is harder than general text-to-SQL. KPI names in supplementary packages are ambiguous — "CET1 Ratio" might appear under different names across banks, and similar-sounding KPIs can mean very different things. The system needed to handle this ambiguity reliably while guaranteeing SQL injection safety and schema compliance. And it needed to ship fast — I had a two-week window before other priorities consumed my bandwidth.',
      optionsConsidered: [
        {
          option: 'Extend Aegis v1 with LLM layer on top',
          prosAndCons: 'Lower risk, but v1\'s architecture wasn\'t designed for natural language input. Bolting NLP onto a rules engine creates fragile coupling.',
          chosen: false,
        },
        {
          option: 'Full rebuild with five-stage decomposed pipeline',
          prosAndCons: 'Higher initial effort, but each stage is testable, deterministic where possible, and LLM-assisted only where needed. Clean separation of concerns.',
          chosen: true,
        },
      ],
      decision:
        'The five-stage decomposed pipeline (intent parsing → KPI detection → LLM-assisted disambiguation → guardrailed SQL generation → deterministic formatting) let each stage own a specific concern. Rule-based stages handle the deterministic parts; LLM-assisted stages handle ambiguity — but with confidence thresholds and guardrails. This architecture makes the system auditable and testable despite using LLMs.',
      implementation:
        'Stage 1: GPT-4.1 with constrained JSON-schema generation parses natural language into a typed intent tuple (metric, time, comparison, output format). Stage 2: deterministic embedding similarity search returns a candidate set from the KPI catalog. Stage 3: confidence gate \u2014 if the top candidate dominates by margin, accept; otherwise an LLM disambiguator (with names + definitions only, no values) selects, with a calibrated confidence score, falling back to a clarification request below threshold. Stage 4: SQL generation via pre-authored, schema-whitelisted templates with parameterized binding; defense-in-depth validation (whitelist + AST + SELECT-only + parameter type + deny-list) before execution. Stage 5: deterministic formatting in the output shape fixed at intent-parse time.',
      impact:
        'Shipped a production-grade text-to-SQL benchmarking engine in two weeks. The system provides formal safety guarantees: SQL injection is impossible by construction (parameterized queries + whitelisted schema), disambiguation is bounded by confidence thresholds, and every stage is independently testable. Two weeks, delivered concurrently with Astraeus productionization and the summer intern program — the speed came from a shelved-and-resumed architecture (an earlier prototype against GPT-4o had failed the calibration bar; GPT-4.1 cleared it) plus the operational trust v1 had already earned. The 2025 CFO One RBC Team Award recognized v1\u2019s productionization \u2014 the precondition that made v2\u2019s mandate possible.',
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
        'CFO Group financial questions — "headcount by division, crossed with open positions, crossed with tenure" — bounced through days of email. No interactive system could answer dynamic arbitrary-combination queries across ~40K leaf-level events with entitlement controls. The dynamic ins-outs question (who joined / left / moved between any two arbitrary groups) was off the table — every prior attempt hit the factorial wall.',
      decision:
        'Two-wall architecture. GPT-4.1 handles parse / route / metadata extraction / synthesis only — never touches operational data. Between the walls, Cython-compiled Python runs event-level ins-outs math in milliseconds over ~40K leaf-level events, with the permission-to-SQL entitlement cascade applied before compute. In-scope answers either go straight to a single synthesis call or fan out to up to 3 parallel final subagents (entitlement / Headcount / Open Positions) before combining.',
      impact:
        'Days of email replaced by seconds-level answers via dashboard, chatbot, and HTML reports. Dynamic ins-outs analysis — previously deemed impossible at bank scale — is now default. Production since November 2025; recognized as a flagship CFO Group AI initiative with an accompanying formal whitepaper.',
    },
    leadershipCallout:
      'The defining leadership decision was choosing LLM-as-Router over a monolithic agent. Every instinct around the table said "give the LLM full access and let it figure it out" — faster to build, easier to demo. I pushed back because I\'d seen what happens when LLMs touch sensitive financial data in regulated contexts: non-deterministic outputs, leakage risk, and no audit trail. The two-wall architecture took longer to build but delivers what the CFO Group actually needs — trustworthy, auditable, deterministic analytics. I led this cross-functionally with engineering services partner while staying ~70% hands-on in the codebase.',
    sections: {
      context:
        'RBC\'s CFO Group needed a single platform for financial insights (headcount analytics, HR costs, open positions) serving three delivery channels: interactive dashboard, chatbot, and inbox-ready HTML reports. The data spans ~40,000 employee-level events (leaves) queryable in any combination, rolling up through ~9,000 parent nodes, with strict entitlement controls so users see only what they\'re authorized to access.',
      myRole:
        'Architect, lead developer, and product visionary. Conceived the "CFO-ready" vision — at-a-glance, trustworthy insights delivered to the inbox with drill-through across domains. Designed the two-wall architecture, built the permission-to-SQL entitlement cascade, wrote the event-level ins-outs math with Cython-compiled Python, and led cross-functional delivery with the engineering services partner while writing a significant portion of the codebase. ~70% hands-on.',
      stakeholders:
        'CFO Group leadership (executive consumers), finance analysts and HR teams (daily users), engineering services partner peers (co-delivery on frontend and infrastructure), Director AI (governance and priority), 1 Senior AI Scientist direct report contributing to development, rotating summer interns.',
      challenge:
        'Three simultaneous hard problems. (1) The factorial wall: arbitrary-combination queries across 40K leaf-level events and 9K rollups look combinatorially impossible at dynamic response times. Previous attempts scoped the feature out. (2) Security: enterprise permission entitlements had to translate from cube-level permissions into SQL-level access controls by construction, not post-hoc filters. (3) Trust: this is CFO-grade analytics; non-determinism anywhere in the data path is disqualifying. LLMs had to be on one side of a hard line, data on the other, with no leakage.',
      optionsConsidered: [
        {
          option: 'Monolithic LLM agent with direct data access',
          prosAndCons: 'Simpler + faster to demo. Violates data confidentiality (LLM sees raw rows), non-deterministic outputs unacceptable for CFO-grade numbers, no structural audit trail. Rejected on governance grounds before engineering began.',
          chosen: false,
        },
        {
          option: 'Pre-computed OLAP cube / materialized-view approach',
          prosAndCons: 'The obvious choice for analytics scale. Falls apart at dynamic arbitrary-combination ins-outs: ~40K! combinations is combinatorial explosion long before pre-computation can finish. Scoped out in earlier attempts at the problem.',
          chosen: false,
        },
        {
          option: 'Traditional BI dashboard without AI',
          prosAndCons: 'Proven, but wouldn\'t deliver chatbot or automated reporting; couldn\'t scale to the drill-through depth leadership asked for. And keeps the ins-outs problem unsolved.',
          chosen: false,
        },
        {
          option: 'Two-wall architecture: LLM intent side → deterministic Cython compute → LLM synthesis side',
          prosAndCons: 'More architecture to design and defend, but solves all three problems by construction. LLM reasons about intent only (parse / route / metadata extract / synthesis), never touches data. Event-level ins-outs math in Cython-compiled Python reframes the factorial problem as linear-in-events. permission-to-SQL entitlement cascade applies structurally before any compute, so users see only what they\'re authorized to see.',
          chosen: true,
        },
      ],
      decision:
        'The two-wall architecture resolves the intelligence-vs-trust tension. GPT-4.1 handles the LLM work that benefits from reasoning — parsing the user\'s natural-language query, routing (is this Astraeus-scope?), extracting structured metadata for up to 3 parallel extraction calls (one per domain), and synthesizing the final answer from aggregates (either one synthesis call, or up to 3 parallel final subagents combined). In between, deterministic code handles everything that benefits from determinism — permission-to-SQL entitlement enforcement (domain permissions → access groups → entities → events → SQL tables), event-level ins-outs math in Cython-compiled Python, and netting semantics that fold intra-rollup movements to net-zero. Two walls separate the bands: on the way down, only parsed metadata crosses; on the way back up, only structured aggregates cross. Operational rows never leave the deterministic side.',
      implementation:
        'Custom Python router orchestrates the flow (no off-the-shelf agent framework). Up to 6 LLM calls per query: 1 parse + 1 route + up to 3 metadata extracts (parallel, domain-scoped) + 1 synthesis (path A) OR 3 final parallel subagents then combined (path B). Between: Cython-compiled Python runs the event-level math — employees modeled as join / leave / transfer events, netting semantics, milliseconds even across arbitrary 40K-leaf combinations. permission-to-SQL entitlement cascade applied at query time so the deterministic side can only see what the user is authorized to see. Everything lands in a single Postgres instance: event log, entitlement catalog, business hierarchy, geography hierarchy, and audit trail. Delivery surfaces: production dashboard, chatbot, and polished HTML inbox-ready reports — all generated from the same architecture.',
      impact:
        'Days of email replaced by seconds-level answers. Dynamic ins-outs analysis — who joined, left, or transferred between any two arbitrary groups over any time window — is now the default capability; previous attempts had scoped it out as combinatorially impossible. The reframe (events linear-in-rows, not queries factorial-in-combinations) turned 40K! into tractable. Data confidentiality structural, not aspirational. Extensible architecture scaling across CFO data domains (Headcount, HR Costs, Open Positions today; Income Statement, Balance Sheet, PAR Financial Analysis, Daily Financial Reporting on the roadmap).',
      inProduction:
        'Running in production since November 2025. Dashboard and chatbot actively used by CFO Group leadership, finance analysts, and HR teams. HTML reports distributed for executive consumption.',
      lessonsLearned:
        'The architectural lesson: when a problem looks factorial, check whether the factorial is in the data or in the framing. Astraeus\'s arbitrary-combination queries *look* factorial — and every prior attempt had modelled them as factorial, which is why dynamic ins-outs was deemed impossible. The reframe (model employees as events, let the user\'s query filter the event log at runtime) made the same problem linear-in-rows. The factorial was in the framing, not in the data. The product lesson: LLMs and deterministic code serve different purposes — LLMs for intent, code for truth. The leadership lesson: pushing back on "just give the LLM full access" took longer, but it shipped an architecture that survives stakeholder audit. Astraeus is the pattern I now start every production AI system from at the bank.',
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
        'RBC\'s Project Approval Request process — governance for every major bank initiative — took weeks to draft. Fragmented templates, contradictory policies, and institutional knowledge locked in people\'s heads.',
      decision:
        'First true agentic framework approved for production at the bank, built inside a single-agent governance envelope: LangGraph on a Postgres backbone, template-as-MCP-tool with decision-tree dialog, two-stage field-group retrieval with custom compression, N parallel Sonnet-4.5 extraction calls merging as a dictionary union, coverage + follow-ups loop.',
      impact:
        'Pilot launched April 2026. Enterprise rollout across RBC business lines through Q2/Q3 2026. The largest-scope agentic AI initiative in the CFO Group — and the reference architecture the v2 multi-agent "skills" framework is being built on top of.',
    },
    leadershipCallout:
      'Conceived PAR Assist as the bank\'s first bank-wide production agentic AI platform. Handed the concept to 2025 Amplify interns as an ideation exercise to explore the problem space, then built the production system end-to-end: ETL pipelines, the LangGraph state graph, the MCP tool layer (template selection, field assignment, conflict resolution, ambiguity detection), the PostgreSQL/pgvector store, custom multi-layer RAG, and frontend integration. The single-agent governance envelope, two-stage field-group retrieval, and typed MCP tool registry codify a production-agentic pattern inside RBC\'s regulated quality bar.',
    sections: {
      context:
        'Project Approval Requests (PARs) are a critical governance process at RBC: every major initiative requires one, and drafting them involves metadata, policies, historical examples, and institutional knowledge. I conceived PAR Assist to transform that drafting process. The concept was handed to 2025 Amplify interns as an ideation exercise to explore the problem space; the production platform was then built end-to-end as the bank\'s first true agentic AI deployment, setting the architectural pattern every subsequent agentic system inherits.',
      myRole:
        'Conceived the product vision, designed the agentic architecture, and built the production system end-to-end: ETL pipelines, the LangGraph state graph, the MCP tool layer (template selection, field assignment, conflict resolution, ambiguity detection), the PostgreSQL + pgvector store, custom multi-layer RAG, and frontend integration. Production deployment runs through GFT (RBC\'s Global Functions Technology team) on OpenShift via CI/CD.',
      stakeholders:
        'CFO Group leadership (sponsor), enterprise stakeholders across the bank (PAR authors in every department), Director AI (governance and priority), 2025 Amplify interns (problem-space ideation exploration), GFT (Global Functions Technology, RBC\'s infrastructure team) for OpenShift CI/CD production deployment.',
      challenge:
        'Two problems stacked on top of each other. The domain problem: PARs are not standardized — different templates for different initiative types, conflicting policies, ambiguous fields, institutional knowledge that lives in people\'s heads. The meta problem: this was the first agentic system approved for production at the bank, so the governance envelope was a single-agent design. The architecture had to get agentic behaviour — branching dialogs, parallel specialized work, multi-turn state — without multi-agent orchestration. And every action had to be auditable by construction, not by convention.',
      optionsConsidered: [
        {
          option: 'Simple RAG chatbot with document retrieval',
          prosAndCons: 'Quick to build, but can\'t handle the structured workflow of PAR drafting. A chatbot can answer questions; it can\'t guide a user through a multi-step form-filling process with validation and audit at every step.',
          chosen: false,
        },
        {
          option: 'True multi-agent orchestration with specialist sub-agents per field domain',
          prosAndCons: 'Architecturally the cleanest mapping of the problem, but would not have cleared the single-agent governance envelope in v1. Deferred to v2 as "skills + tools" — same shape, approved scope.',
          chosen: false,
        },
        {
          option: 'Flat RAG — one embedding index over all chunks',
          prosAndCons: 'Simplest retrieval, but top-k against a flat index surfaces chunks from unrelated fields and templates. Scales with corpus size, not field count. Can\'t structurally say "this chunk belongs to risk-and-compliance fields."',
          chosen: false,
        },
        {
          option: 'LangGraph + MCP tools + two-stage field-group retrieval + N parallel extraction + Postgres backbone',
          prosAndCons: 'LangGraph picked for maturity (stable, active, production-deployed). MCP tools make every action a typed, logged contract — audit is structural, not aspirational. Two-stage retrieval organizes knowledge by the target fields the LLM extracts toward, not by source document. N parallel Sonnet-4.5 calls (one per relevant field group, ≤20 fields each with rich metadata) gives multi-agent-like parallelism inside a single-agent envelope. Postgres carries LangGraph checkpoints + logs + raw/mapped content + pgvector embeddings + audit — one store, one provenance graph.',
          chosen: true,
        },
      ],
      decision:
        'PAR drafting is a stateful, branching workflow over a structured form with regulatory audit requirements. LangGraph (picked for maturity over CrewAI/AutoGen, which we considered but didn\'t deeply evaluate) provides the graph engine and wires directly into a Postgres checkpointer for session durability. Template selection is itself an MCP tool with a decision-tree dialog — project type, spend tier, business line, regulatory exposure — returning a typed template-id with confidence and rationale. Retrieval reshapes the knowledge base around the target: field groups aggregate logically related fields across all PAR templates; stage-1 picks relevant groups for the session, stage-2 retrieves top-10 chunks per group, custom compression fits the payload into a Sonnet-4.5 system prompt carrying up to 20 fields of rich metadata. The extraction layer fans out to N parallel calls (one per relevant group), each returning a JSON dictionary with guardrails and few-shot good/bad examples scoped to its group. The merge is a deterministic dictionary union. A coverage analyzer checks the merged state against guidelines + examples, surfaces intelligent follow-ups, and loops the session back through a clarify node when answers are still open.',
      implementation:
        'LangGraph graph orchestrates the session (intake → template → retrieve → extract → merge → coverage → respond), with conditional edges for loops. Template selection, retrieval, compression, extraction, merge, and coverage are all MCP tools — every action typed, logged, and dispatched through the graph engine. Ingestion handles pptx, docx, pdf, txt, and images (OCR via GPT-4-turbo vision). Field groups are a taxonomy over the hundreds of fields across PAR templates; retrieval runs two-stage similarity search with custom compression on top-10 chunks per group. Parallelism = relevant-group count: up to N Sonnet-4.5 calls fire at once, each carrying ≤20 fields + guardrails + few-shot good/bad examples; each returns JSON. Merge is a dict union (groups disjoint by construction). Coverage analyzer gates the draft — if it finds open follow-ups, the session loops to a clarify node before returning to template/extraction. Postgres (with pgvector for retrieval) is the single store: LangGraph checkpoints, tool-invocation logs, raw ingested content, mapped intermediates, embeddings, and the complete audit trail all land in one place.',
      impact:
        'Transformed a manual, multi-week governance process into a guided drafting session with every field cited back to its source. Pilot launched April 2026 with the first wave of PAR authors; enterprise rollout expands across RBC business lines through Q2/Q3 2026. Beyond the direct drafting win, PAR Assist is the reference architecture for agentic AI at the bank — the MCP tool registry, Postgres backbone, and single-agent envelope are the substrate v2 (multi-agent "skills" framework) is being built on. v1 is the part of v2 that already passed review.',
      inProduction:
        'Shipped April 2026 as a bank-wide agentic AI platform. Every MCP tool call is typed and logged; every field value in every draft traces back to the guideline, policy, or few-shot example that grounded it; the full provenance graph for any session is one Postgres query away. Ongoing: enterprise rollout, author feedback loops, and the first steps toward the v2 skills-and-tools composition.',
      lessonsLearned:
        'Two lessons, one technical and one organizational. Technical: in regulated environments, the first agentic deployment is not about maximum capability; it is about building the envelope so the next envelope (larger) inherits without rewrite. Every decision (MCP tool registry, Postgres backbone, field-group taxonomy) was picked so v2 skills compose over the same substrate. v1 is not a throwaway; v1 is the part of v2 that already passed governance review. Organizational: handing a concept to interns as an ideation exercise opens up problem-space exploration without delaying the production build. The Amplify cohort explored angles I might have otherwise prioritized later; the production platform was then built end-to-end against a clear architectural thesis. Most AI POCs die in the transition to enterprise product; the fix is to plan that transition before the POC is written.',
    },
    blogPostSlug: 'enterprise-agentic-ai-architecture',
    companionBlogPostSlug: 'par-assist-building',
  },
];
