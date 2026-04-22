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
        'Months → 90 minutes per cycle. CFO Quarterly Team Award (Q4 2023). The stakeholder-trust win that opened the door to every subsequent AI initiative at the CFO Group.',
    },
    sequencing:
      'Commodity Tax was the cascade origin. When I joined the CFO Group in 2022, nobody had asked me to build AI — I was hired to automate a tax process. Delivering that in under a year, with dashboards the CFO could audit, earned the credibility to propose Aegis v1 (Big 6 bank benchmarking, 2024), then Aegis v2 (AI-native rewrite, 2 weeks, 2024), then Astraeus (production 2025), then conceive PAR Assist from an intern POC (shipped April 2026). Each project underwrote the next one\'s scope. The Commodity Tax wasn\'t about tax — it was about proving I could deliver production systems in regulated finance before asking for license to build something ambitious.',
    blogPostSlug: 'commodity-tax-cfo-trust',
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
        'Shipped to production in 2 weeks — while simultaneously running Astraeus development and the Amplify internship program. 2025 CFO One RBC Team Award.',
    },
    sections: {
      context:
        'RBC\'s CFO Group needed to benchmark financial KPIs against the Big 6 Canadian banks using Supplementary Financial Packages — publicly available but complex financial disclosures. Aegis v1 was a rules-based benchmarking engine I\'d built and productionized earlier. v2 was the AI-native evolution: natural language queries to validated SQL, with embeddings-based KPI disambiguation.',
      myRole:
        'Sole designer and builder of Aegis v2. I designed the five-stage pipeline architecture, implemented it, and shipped it to production — all within two weeks, while simultaneously leading Astraeus development and the Amplify internship program. This was a deliberate sprint: months of research and brainstorming crystallized into two weeks of focused execution.',
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
        'Stage 1: Rule-based intent parsing decomposes natural language into structured query components. Stage 2: KPI detection maps query terms to a metadata-rich KPI catalog. Stage 3: Embeddings-based similarity search + LLM-assisted disambiguation resolves ambiguous KPI references with confidence thresholds. Stage 4: Guardrailed SQL generation with whitelisting, parameterization, and forbidden keyword filtering. Stage 5: Deterministic formatting ensures consistent output.',
      impact:
        'Shipped a production-grade text-to-SQL benchmarking engine in two weeks. The system provides formal safety guarantees: SQL injection is impossible by construction (parameterized queries + whitelisted schema), disambiguation is bounded by confidence thresholds, and every stage is independently testable. Two weeks, delivered concurrently with Astraeus productionization and the Amplify program — the speed came from crystallizing months of v1 learnings into a decomposed architecture, not from shortcuts.',
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
    timeline: '2024 – Present',
    era: 'Intelligent Systems',
    tldr: {
      problem:
        'CFO Group financial questions — "headcount by division, crossed with open positions, crossed with tenure" — bounced through days of email between analysts and leadership. No interactive system could answer across ~40K factorial combinations with entitlement controls.',
      decision:
        'Deterministic multi-tier agentic framework. Three specialized sub-agents (EPM, Headcount, Open Positions) in parallel. GPT strictly for intent routing; deterministic code for all computation and data access, with millisecond backend slicing.',
      impact:
        'Days of email replaced by seconds-level answers via dashboard, chatbot, and HTML reports. Recognized as a flagship CFO Group AI initiative. Architectural pattern published as a formal whitepaper.',
    },
    leadershipCallout:
      'The defining leadership decision was choosing LLM-as-Router over a monolithic agent. Every instinct said "give the LLM full access and let it figure it out" — it\'s faster to build, easier to demo. But I pushed back because I\'d seen what happens when LLMs touch sensitive financial data in enterprise: non-deterministic outputs, data leakage risk, and no audit trail. The multi-tier architecture took longer to build but delivered what the CFO Group actually needs — trustworthy, auditable, deterministic analytics. I led this cross-functionally with GFT engineering while staying 70% hands-on in the codebase.',
    sections: {
      context:
        'RBC\'s CFO Group needed a single platform for financial insights — headcount analytics, HR costs, open positions — that could serve multiple delivery channels: interactive dashboard, chatbot, and inbox-ready reports. The data spanned ~40,000 employee transits across ~9,000 organizational rollups and ~60,000 geography hierarchy nodes, with strict entitlement controls (users should only see data they\'re authorized to access).',
      myRole:
        'Architect, lead developer, and product visionary. I conceived the "CFO-ready" vision — at-a-glance, trustworthy insights delivered to the inbox with drill-through across data domains. I designed the agentic architecture, built the EPM-to-SQL entitlement model, led cross-functional delivery with GFT (Global Functions Technology), and wrote a significant portion of the codebase. ~70% hands-on.',
      stakeholders:
        'CFO Group leadership (executive consumers), finance analysts and HR teams (daily users), GFT engineering peers (co-delivery on frontend and infrastructure), Director AI (governance and priority), Senior AI Scientist (direct report contributing to development).',
      challenge:
        'Three simultaneous hard problems: (1) Scale — millisecond-level slicing across 40K transits and 60K geographies required a purpose-built event model, not standard OLAP. (2) Security — EPM (Enterprise Performance Management) entitlements needed to translate from cube permissions into SQL-level access controls, and users should never see data outside their authorization scope. (3) LLM constraints — the Command-A model had limitations that a monolithic agent couldn\'t overcome; we needed an architecture that used LLMs for what they\'re good at (intent detection) and deterministic code for everything else.',
      optionsConsidered: [
        {
          option: 'Monolithic LLM agent with full data access',
          prosAndCons: 'Simpler architecture, but violates data confidentiality requirements. LLM would see sensitive financial data, and non-deterministic outputs are unacceptable for CFO-grade analytics.',
          chosen: false,
        },
        {
          option: 'Deterministic multi-tier agentic framework with LLM-as-Router',
          prosAndCons: 'More complex to build, but GPT handles only intent detection and routing — no sensitive data touches the LLM. Deterministic sub-agents (EPM, Headcount, Open Positions) run in parallel and handle all computation. Auditable by design.',
          chosen: true,
        },
        {
          option: 'Traditional BI dashboard without AI',
          prosAndCons: 'Proven approach, but wouldn\'t deliver the chatbot or automated reporting capabilities. Also couldn\'t scale to the drill-through depth the CFO Group needed.',
          chosen: false,
        },
      ],
      decision:
        'The LLM-as-Router architecture was chosen because it solves the fundamental tension between intelligence and trust. GPT detects intent and routes to the appropriate sub-agent; deterministic Python code handles all data access, computation, and response formatting. This means we get the natural language understanding of LLMs without the risks of LLMs touching sensitive data. The three parallel sub-agents (EPM, Headcount, Open Positions) improved accuracy, latency, and resilience over a single monolithic agent.',
      implementation:
        'Built a deterministic multi-tier agentic framework with GPT strictly for intent detection and routing. Three specialized sub-agents run in parallel across EPM, Headcount, and Open Positions domains. Designed an event model at the transactional employee-by-transit level with netting semantics (intra-rollup transfers automatically netted out to prevent double counting). Built EPM-to-SQL entitlement modeling that translates cube permissions → security groups → employees → transits → intuitive SQL tables. Delivered via production dashboard, chatbot interface, and polished HTML headcount reports.',
      impact:
        'Production platform processing ~40,000 transits across ~9,000 rollups with millisecond-level response times. Serves three delivery channels (dashboard, chatbot, reports) from a single architecture. Data confidentiality maintained by design — LLM never sees sensitive data. Recognized as a flagship AI initiative within the CFO Group. Extensible architecture designed to scale across all CFO data domains (Income Statement, Balance Sheet, PAR Financial Analysis, Daily Financial Reporting).',
      inProduction:
        'Running in production within the CFO Group. Dashboard and chatbot are actively used by finance analysts and leadership for headcount analytics and HR cost reporting. HTML reports are generated and distributed for executive consumption.',
      lessonsLearned:
        'The biggest architectural insight was that LLMs and deterministic code serve different purposes — forcing an LLM to do computation it\'s bad at (and giving it data access it shouldn\'t have) is the wrong pattern. The LLM-as-Router approach is now my default for enterprise AI: let LLMs reason about intent, let code handle truth. The EPM-to-SQL entitlement modeling was also a lesson in domain immersion — I had to deeply understand how the bank\'s permission system worked before I could translate it into something the system could enforce.',
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
        'LangGraph agentic orchestration with typed MCP tool contracts and multi-layer RAG. Every field assignment traceable to a source — governance by construction.',
      impact:
        'Shipped April 2026 as a bank-wide platform. Scaled from intern Amplify POC to enterprise product — the largest-scope agentic AI initiative in the CFO Group.',
    },
    leadershipCallout:
      'An intern in the 2025 Amplify program proposed a tool to help with PAR drafting. Most managers would have said "nice idea" and moved on. I recognized the potential — not just for a tool, but for an enterprise platform. I conceived the product vision, designed the agentic architecture, and led the productionization from intern POC to bank-wide platform. This is what leadership looks like in AI: recognizing an idea\'s potential, providing the technical vision to scale it, and creating the environment for it to succeed.',
    sections: {
      context:
        'Project Approval Requests (PARs) are a critical governance process at RBC — every major initiative requires one, and drafting them is a complex, time-consuming process involving metadata, policies, historical examples, and institutional knowledge. The idea originated from the 2025 Amplify internship program, where an intern proposed a tool to help with PAR drafting. I saw the potential to scale it from a prototype to an enterprise-wide platform.',
      myRole:
        'Conceived the product vision, led strategic and technical requirements, designed the agentic architecture, and led the productionization from intern POC to bank-wide enterprise platform. This project represents the full arc: identifying an idea, defining the vision, architecting the system, and driving it to enterprise deployment.',
      stakeholders:
        'CFO Group leadership (sponsor), enterprise stakeholders across the bank (PAR authors in every department), Director AI (governance and priority), Amplify interns (original POC developers), GFT engineering (co-delivery on productionization).',
      challenge:
        'PARs are not standardized — different templates for different initiative types, conflicting policies, ambiguous field requirements, and institutional knowledge that lives in people\'s heads rather than documentation. The system needs to guide users through this complexity while ensuring every field assignment is traceable to a source (policy, historical example, or user input). No hallucination allowed — this is governance documentation.',
      optionsConsidered: [
        {
          option: 'Simple RAG chatbot with document retrieval',
          prosAndCons: 'Quick to build, but can\'t handle the structured workflow of PAR drafting. A chatbot can answer questions but can\'t guide a user through a multi-step form-filling process with validation at each step.',
          chosen: false,
        },
        {
          option: 'LangGraph agentic orchestration with MCP tools and multi-layer RAG',
          prosAndCons: 'More complex architecture, but LangGraph provides stateful orchestration (multi-turn workflow), MCP tools provide typed, auditable actions (template selection, field assignment, conflict resolution, ambiguity checks), and multi-layer RAG provides context from conversation history, uploaded documents, and institutional knowledge.',
          chosen: true,
        },
      ],
      decision:
        'The LangGraph + MCP + multi-layer RAG architecture was chosen because PAR drafting is fundamentally a stateful workflow, not a stateless Q&A. LangGraph maintains conversation state across unbounded turns. MCP tools provide typed, logged actions that create an audit trail. Multi-layer RAG (conversation history, uploaded documents, field assignment prompts) ensures the system draws from the right context at each step. Every field assignment is traceable — governance by design.',
      implementation:
        'LangGraph for agentic orchestration managing the PAR workflow. Four MCP tools: template selection (matching initiative type to PAR template), field assignment (populating fields from metadata and policies), conflict resolution (detecting and resolving contradictory requirements), and ambiguity checks (flagging unclear fields for user clarification). Multi-layer RAG: conversation history (no context loss across turns), uploaded documents (PDF, PPTX, DOCX, TXT with chunking and embedding pipeline), and field assignment prompts (institutional knowledge). PostgreSQL with embeddings for persistent semantic search.',
      impact:
        'Transformed a manual, weeks-long governance process into an AI-guided drafting experience. Scaled from intern POC to bank-wide platform — serving PAR authors across departments. The largest-scope agentic AI initiative in the CFO Group.',
      inProduction:
        'Shipped April 2026 as a bank-wide agentic AI platform. Full audit trails, multi-layer RAG, and typed MCP tool contracts in the production architecture. Ongoing: rollout, adoption, and iteration on enterprise feedback.',
      lessonsLearned:
        'The Amplify program taught me that great ideas can come from anywhere — the key is recognizing potential and creating the environment for it to scale. The intern who proposed the PAR concept didn\'t envision an enterprise platform; that vision came from understanding the bank\'s needs and seeing how the idea could generalize. I also learned that the transition from POC to enterprise product is where most AI initiatives fail — it requires not just technical architecture but stakeholder alignment, governance design, and a clear productionization roadmap.',
    },
    blogPostSlug: 'enterprise-agentic-ai-architecture',
    companionBlogPostSlug: 'par-assist-building',
  },
];
