export interface BlogPostMeta {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  /** ISO date of the latest substantive content revision, when different. */
  updated?: string;
  tags: string[];
  readingTime: string;
  abstract: string;
  status: 'published' | 'draft';
  /**
   * The project this post is anchored on. Used by the /blog index to
   * group posts about the same project visually. Leave undefined for
   * cross-cutting pattern posts (e.g., closed-loop) that do not have a
   * single project home.
   *
   * Must match an id in data/projects.ts.
   */
  projectId?:
    | 'par-assist'
    | 'astraeus'
    | 'aegis'
    | 'commodity-tax'
    | 'document-intelligence'
    | 'combustion-tuning';
  /**
   * Register / reader-level tag — rendered on the /blog index as a
   * wabi-sabi glyph in each card's top-right corner, so a reader
   * coming in can see which of a project's multiple posts to open
   * first without opening all of them.
   *
   *   - 'technical'    — architecture + evidence + failure modes
   *   - 'practitioner' — decisions + options considered + rationale
   *   - 'builder'      — chronology + judgment + leadership
   *
   * Posts without this field render no tag.
   */
  register?: 'technical' | 'practitioner' | 'builder';
}

export interface Reference {
  id: number;
  authors: string;
  title: string;
  venue: string;
  year: number;
  url?: string;
}

export interface FurtherReadingItem {
  title: string;
  url: string;
  description: string;
}

export interface BlogPost {
  meta: BlogPostMeta;
  references: Reference[];
  furtherReading: FurtherReadingItem[];
}

export function isPostPublic(post: BlogPost, now: number = Date.now()): boolean {
  return post.meta.status === 'published' && new Date(post.meta.date).getTime() <= now;
}

export function isPostSlugPublic(slug: string | undefined, now: number = Date.now()): boolean {
  if (!slug) return false;
  const post = POSTS.find((p) => p.meta.slug === slug);
  return post ? isPostPublic(post, now) : false;
}

export const POSTS: BlogPost[] = [
  {
    meta: {
      slug: 'agentic-ai',
      title: 'Astraeus: Bounded LLM Roles for Financial Analytics',
      subtitle: 'How intent routing, entitlement filtering, deterministic calculation, and output checks divide responsibility in a production CFO analytics system.',
      date: '2026-03-01',
      tags: ['LLM Routing', 'Entitlements', 'Deterministic Computation', 'Financial Analytics', 'Failure Modes'],
      readingTime: '10 min read',
      abstract:
        'Astraeus places model-mediated intent and answer shaping around a conventional entitlement and calculation path. This note traces the inputs, outputs, controls, and failure modes at each boundary; explains permission-to-SQL translation and the event-versus-snapshot distinction; and states what the production evidence does and does not establish.',
      updated: '2026-08-09',
      status: 'published',
      projectId: 'astraeus',
      register: 'technical',
    },
    references: [
      { id: 3, authors: 'Ouyang, S. et al.', title: 'LLM is Like a Box of Chocolates: the Non-determinism of ChatGPT in Code Generation', venue: 'arXiv preprint arXiv:2308.02828', year: 2023, url: 'https://arxiv.org/abs/2308.02828' },
      { id: 4, authors: 'Li, H. et al.', title: 'Privacy in Large Language Models: Attacks, Defenses and Future Directions', venue: 'arXiv preprint arXiv:2310.10383', year: 2023, url: 'https://arxiv.org/abs/2310.10383' },
    ],
    furtherReading: [
      { title: 'Why I Chose LLM-as-Router Over a Monolithic Agent', url: '/blog/astraeus-llm-as-router', description: 'The builder story about the consequential architecture call and the work required to productionise it.' },
      { title: 'LLM-as-Router in Practice — Four Decisions', url: '/blog/astraeus-llm-as-router-framework', description: 'A decision guide to the alternatives, trade-offs, and residual risks behind the same system.' },
      { title: 'Astraeus — Case Study', url: '/projects/astraeus', description: 'A concise account of the problem, contribution, architecture, operating state, and limits.' },
    ],
  },
  {
    meta: {
      slug: 'text-to-sql',
      title: 'Aegis: A Five-Stage Text-to-SQL Pipeline with Explicit Failure Paths',
      subtitle: 'How semantic candidate retrieval, evaluated clarification, reviewed SQL templates, parameter binding, and database controls constrain financial benchmarking queries.',
      date: '2026-02-08',
      tags: ['Text-to-SQL', 'Semantic Retrieval', 'Ambiguity', 'SQL Safety Controls', 'Failure Paths'],
      readingTime: '9 min read',
      abstract:
        'Aegis separates intent parsing, catalog candidate retrieval, ambiguity handling, reviewed query construction, and deterministic formatting. This note explains the input, output, primary control, and failure response at each stage; treats clarification as a normal outcome; and keeps free-form model output away from database execution.',
      updated: '2026-08-09',
      status: 'published',
      projectId: 'aegis',
      register: 'technical',
    },
    references: [
      { id: 1, authors: 'Pourreza, M. & Rafiei, D.', title: 'DIN-SQL: Decomposed In-Context Learning of Text-to-SQL with Self-Correction', venue: 'NeurIPS', year: 2023 },
      { id: 2, authors: 'Gao, D. et al.', title: 'Text-to-SQL Empowered by Large Language Models: A Benchmark Evaluation', venue: 'VLDB', year: 2024 },
      { id: 3, authors: 'Dong, X. et al.', title: 'C3: Zero-shot Text-to-SQL with ChatGPT', venue: 'arXiv preprint arXiv:2307.07306', year: 2023, url: 'https://arxiv.org/abs/2307.07306' },
      { id: 4, authors: 'Yu, T. et al.', title: 'Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task', venue: 'EMNLP', year: 2018, url: 'https://yale-lily.github.io/spider' },
      { id: 5, authors: 'Reimers, N. & Gurevych, I.', title: 'Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks', venue: 'EMNLP', year: 2019, url: 'https://www.sbert.net/' },
      { id: 7, authors: 'OWASP Foundation', title: 'SQL Injection Prevention Cheat Sheet', venue: 'owasp.org', year: 2023, url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html' },
    ],
    furtherReading: [
      { title: 'Two Weeks, One Refactor: Velocity, Clarity, and Model Readiness', url: '/blog/aegis-v2-velocity', description: 'The builder story about why the focused two-week refactor was possible and how the production team integrated it.' },
      { title: 'Decomposition as Guardrail — Four Decisions', url: '/blog/aegis-decomposition-framework', description: 'The decision guide to decomposition, candidate retrieval, reviewed templates, and clarification trade-offs.' },
      { title: 'Aegis — Case Study', url: '/projects/aegis', description: 'A concise account of the product, contribution boundary, five-stage design, and operating state.' },
    ],
  },
  {
    meta: {
      slug: 'closed-loop',
      title: 'What Happens After a Model Predicts?',
      subtitle: 'Four core design questions plus a feedback test, grounded in operator-reviewed combustion tuning and tested against later enterprise systems.',
      date: '2026-01-15',
      tags: ['PSO', 'Human-in-the-Loop', 'Industrial ML', 'Systems Design', 'Feedback Loops'],
      readingTime: '10 min read',
      abstract:
        'A model output is not yet a useful system. This note starts with 84 regression models, Particle Swarm Optimization, and operator-reviewed combustion settings at Maizuru, then tests four recurring questions—observe, estimate, choose, act—plus a return-path check against later document, finance, and model-assisted workflows. The questions transfer; the mechanisms and guarantees do not.',
      updated: '2026-08-09',
      status: 'published',
      register: 'technical',
    },
    references: [
      { id: 1, authors: 'Kennedy, J. & Eberhart, R.', title: 'Particle Swarm Optimization', venue: 'Proceedings of ICNN\'95 — International Conference on Neural Networks', year: 1995 },
      { id: 2, authors: 'Shi, Y. & Eberhart, R.', title: 'A Modified Particle Swarm Optimizer', venue: 'Proceedings of IEEE International Conference on Evolutionary Computation', year: 1998 },
      { id: 3, authors: 'Poli, R., Kennedy, J. & Blackwell, T.', title: 'Particle Swarm Optimization: An Overview', venue: 'Swarm Intelligence', year: 2007 },
    ],
    furtherReading: [
      { title: 'Particle Swarm Optimization: A Comprehensive Survey', url: 'https://link.springer.com/article/10.1007/s11831-021-09694-4', description: 'Modern survey covering PSO variants, convergence analysis, and multi-objective extensions.' },
      { title: 'Combustion Tuning — Case Study', url: '/projects/combustion-tuning', description: 'The project context, contribution boundary, operator gate, and production outcome behind the industrial example.' },
    ],
  },
  {
    meta: {
      slug: 'enterprise-agentic-ai-architecture',
      title: 'PAR Assist: One Agent, Bounded Tools, Reviewable Drafting',
      subtitle: 'How retained state, field-scoped evidence, ownership-aware merge, coverage checks, and human review shape a production drafting workflow.',
      date: '2026-03-22',
      tags: ['LangGraph', 'MCP', 'Field-Scoped Retrieval', 'Single-Agent Systems', 'Human Review'],
      readingTime: '7 min read',
      abstract:
        'PAR Assist uses one LangGraph orchestrator to guide drafting across retained sessions. Typed MCP tools handle bounded workflow actions; field-scoped retrieval supplies evidence to extraction tasks; ownership-aware merge and coverage checks surface collisions and gaps for author review. The post explains where these controls help, what evidence they preserve, and which failures still require human judgment.',
      updated: '2026-08-09',
      status: 'published',
      projectId: 'par-assist',
      register: 'technical',
    },
    references: [
      { id: 5, authors: 'Anthropic', title: 'Model Context Protocol Specification', venue: 'modelcontextprotocol.io', year: 2024, url: 'https://modelcontextprotocol.io/' },
      { id: 6, authors: 'LangChain, Inc.', title: 'LangGraph: Multi-Actor Applications with LLMs', venue: 'LangChain, Inc.', year: 2024, url: 'https://langchain-ai.github.io/langgraph/' },
      { id: 7, authors: 'Lewis, P. et al.', title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', venue: 'NeurIPS', year: 2020 },
    ],
    furtherReading: [
      { title: 'LangGraph Documentation', url: 'https://langchain-ai.github.io/langgraph/', description: 'Graph-based workflow orchestration with state, conditional routing, and checkpoints.' },
      { title: 'Model Context Protocol (MCP)', url: 'https://modelcontextprotocol.io/', description: 'Typed interfaces for tools and model-accessible capabilities.' },
      { title: 'Retrieval-Augmented Generation', url: 'https://arxiv.org/abs/2005.11401', description: 'The original RAG paper; useful background for retrieval as one component of the workflow.' },
    ],
  },
  {
    meta: {
      slug: 'enterprise-agentic-ai-framework',
      title: 'PAR Assist: Four Decisions Behind a Reviewable Drafting Workflow',
      subtitle:
        'Why one graph owns orchestration, tools stay bounded, evidence is scoped by field group, and missing coverage returns to clarification.',
      date: '2026-04-22',
      tags: ['LangGraph', 'MCP', 'RAG', 'Agentic AI', 'Single-Agent Envelope'],
      readingTime: '10 min read',
      abstract:
        'A decision guide to PAR Assist’s production v1 architecture: single-agent orchestration, typed tool boundaries, field-scoped retrieval, and bounded extraction with ownership-aware merge. It compares the main alternatives, explains the trade-offs, and keeps coverage gaps and human review explicit.',
      updated: '2026-08-09',
      status: 'published',
      projectId: 'par-assist',
      register: 'practitioner',
    },
    references: [
      { id: 1, authors: 'Yao, S. et al.', title: 'ReAct: Synergizing Reasoning and Acting in Language Models', venue: 'ICLR', year: 2023 },
      { id: 2, authors: 'Schick, T. et al.', title: 'Toolformer: Language Models Can Teach Themselves to Use Tools', venue: 'NeurIPS', year: 2023 },
      { id: 3, authors: 'Wang, L. et al.', title: 'A Survey on Large Language Model based Autonomous Agents', venue: 'arXiv preprint arXiv:2308.11432', year: 2023, url: 'https://arxiv.org/abs/2308.11432' },
      { id: 5, authors: 'Anthropic', title: 'Model Context Protocol Specification', venue: 'modelcontextprotocol.io', year: 2024, url: 'https://modelcontextprotocol.io/' },
      { id: 6, authors: 'LangChain, Inc.', title: 'LangGraph: Multi-Actor Applications with LLMs', venue: 'LangChain, Inc.', year: 2024, url: 'https://langchain-ai.github.io/langgraph/' },
      { id: 7, authors: 'Lewis, P. et al.', title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', venue: 'NeurIPS', year: 2020 },
      { id: 10, authors: 'Li, H. et al.', title: 'Privacy in Large Language Models: Attacks, Defenses and Future Directions', venue: 'arXiv preprint arXiv:2310.10383', year: 2023, url: 'https://arxiv.org/abs/2310.10383' },
      { id: 13, authors: 'Mialon, G. et al.', title: 'Augmented Language Models: A Survey', venue: 'Transactions on Machine Learning Research', year: 2023 },
    ],
    furtherReading: [
      { title: 'PAR Assist: One Agent, Bounded Tools, Reviewable Drafting', url: '/blog/enterprise-agentic-ai-architecture', description: 'The technical note on mechanism, evidence boundaries, failure paths, and residual risk.' },
      { title: 'How We Built PAR Assist: From One-Page Vision to Production Platform', url: '/blog/par-assist-building', description: 'The production journey from one-page vision through pilot and full CFO Group launch.' },
    ],
  },
  {
    meta: {
      slug: 'par-assist-building',
      title: 'How We Built PAR Assist: From One-Page Vision to Production Platform',
      subtitle: 'How a one-page vision became a launched drafting platform, and what the journey taught about scope, parallel work, and review boundaries.',
      date: '2026-04-17',
      tags: ['Leadership', 'Agentic AI', 'LangGraph', 'Product Development', 'Team Building'],
      readingTime: '9 min read',
      abstract:
        'The story of how a one-page vision became PAR Assist: an Amplify ideation exercise, a production build, an April 2026 pilot, and full CFO Group launch across all geographies in May. The focus is the product journey, the consequential architecture calls, and three leadership lessons about scoping, parallel execution, and turning vision into a production system.',
      updated: '2026-08-09',
      status: 'published',
      projectId: 'par-assist',
      register: 'builder',
    },
    references: [],
    furtherReading: [
      { title: 'PAR Assist: One Agent, Bounded Tools, Reviewable Drafting', url: '/blog/enterprise-agentic-ai-architecture', description: 'The technical note on context, tool, retrieval, merge, coverage, and review boundaries.' },
      { title: 'What Happens After a Model Predicts?', url: '/blog/closed-loop', description: 'A bounded comparison between industrial PSO and enterprise AI, including what does not transfer across domains.' },
      { title: 'LangGraph Documentation', url: 'https://langchain-ai.github.io/langgraph/', description: 'Official docs for directed-graph workflow orchestration with persistent state.' },
      { title: 'Model Context Protocol (MCP)', url: 'https://modelcontextprotocol.io/', description: 'Open standard for typed tool contracts between AI assistants and external systems.' },
      { title: 'pgvector', url: 'https://github.com/pgvector/pgvector', description: 'Vector similarity search for PostgreSQL, used here as part of a bounded field-group retrieval pattern.' },
    ],
  },
  {
    meta: {
      slug: 'astraeus-llm-as-router',
      title: 'Why I Chose LLM-as-Router Over a Monolithic Agent',
      subtitle:
        'The architecture choice that kept entitlement and financial calculation outside the model, and the production work needed to make that boundary real.',
      date: '2026-04-18',
      tags: ['Leadership', 'Agentic AI', 'Enterprise Architecture', 'Regulated AI', 'Astraeus'],
      readingTime: '7 min read',
      abstract:
        'This is the story of rejecting a monolithic, broad-access agent while building Astraeus, a production analytics platform for the CFO Group. It explains why LLM-as-Router keeps entitlement and calculation outside the model, what the permission-to-SQL work required, and where typed boundaries, tests, logging, and monitoring are still needed because the architecture does not prove its own enforcement.',
      updated: '2026-08-09',
      status: 'published',
      projectId: 'astraeus',
      register: 'builder',
    },
    references: [],
    furtherReading: [
      {
        title: 'Astraeus: Bounded LLM Roles for Financial Analytics',
        url: '/blog/agentic-ai',
        description: 'The technical note on the LLM-as-Router boundary, its controls, evidence, failure paths, and residual risks.',
      },
      {
        title: 'LLM-as-Router in Practice \u2014 Four Decisions',
        url: '/blog/astraeus-llm-as-router-framework',
        description: 'A decision guide to the alternatives, trade-offs, and residual risks behind the same system.',
      },
      {
        title: 'How We Built PAR Assist: From One-Page Vision to Production Platform',
        url: '/blog/par-assist-building',
        description: 'A different system that uses typed MCP tool contracts and registered workflow records rather than Astraeus\u2019s deterministic compute wall.',
      },
      {
        title: 'Astraeus \u2014 Case Study',
        url: '/projects/astraeus',
        description: 'The case study page: context, stakeholders, options considered, the decision rationale, and the production narrative.',
      },
    ],
  },
  {
    meta: {
      slug: 'astraeus-llm-as-router-framework',
      title: 'LLM-as-Router in Practice \u2014 Four Decisions',
      subtitle:
        'Four architecture decisions that separate model-assisted intent and answer shaping from entitlement-aware deterministic calculation.',
      date: '2026-04-23',
      tags: ['Agentic AI', 'LLM-as-Router', 'Cython', 'Entitlement', 'Astraeus'],
      readingTime: '14 min read',
      abstract:
        'Astraeus separates model-assisted intent and answer shaping from a deterministic Cython compute path. This guide compares four decisions: orchestration shape, computation layer, pre-compute entitlement enforcement, and answer strategy. It keeps the alternatives, trade-offs, access-control dependencies, validation, monitoring, and residual risks explicit.',
      updated: '2026-08-09',
      status: 'published',
      projectId: 'astraeus',
      register: 'practitioner',
    },
    references: [],
    furtherReading: [
      {
        title: 'Astraeus: Bounded LLM Roles for Financial Analytics',
        url: '/blog/agentic-ai',
        description: 'The technical note on system responsibilities, entitlement boundaries, production evidence, and failure paths.',
      },
      {
        title: 'Why I Chose LLM-as-Router Over a Monolithic Agent',
        url: '/blog/astraeus-llm-as-router',
        description: 'The delivery story behind the architecture call, including the pressure, scope, and productionisation work.',
      },
      {
        title: 'PAR Assist: Four Decisions Behind a Reviewable Drafting Workflow',
        url: '/blog/enterprise-agentic-ai-framework',
        description: 'A decision guide to single-agent orchestration, bounded tools, field-scoped retrieval, and coverage handling.',
      },
      {
        title: 'LangGraph Documentation',
        url: 'https://langchain-ai.github.io/langgraph/',
        description: 'Directed-graph workflow orchestration with persistent state \u2014 the framework precedent for routing-style orchestration.',
      },
      {
        title: 'Cython: Python with C Performance',
        url: 'https://cython.readthedocs.io/',
        description: 'The compiled-Python toolchain used by the deterministic event-level calculation path.',
      },
      {
        title: 'Astraeus \u2014 Case Study',
        url: '/projects/astraeus',
        description: 'The case study page: context, stakeholders, options considered, the decision rationale, and the production narrative.',
      },
    ],
  },
  {
    meta: {
      slug: 'aegis-decomposition-framework',
      title: 'Decomposition as Guardrail — Four Decisions',
      subtitle:
        'Four decisions that constrain intent parsing, candidate retrieval, ambiguity handling, and reviewed SQL construction.',
      date: '2026-04-26',
      tags: ['Text-to-SQL', 'Decomposition', 'SQL Safety', 'Embeddings', 'Calibration', 'Aegis'],
      readingTime: '13 min read',
      abstract:
        'This guide compares four decisions: decomposed orchestration, semantic KPI candidate retrieval, reviewed SQL templates with parameter binding, and confidence-gated clarification. A six-step query walkthrough and v1-to-v2 comparison show how the boundaries work in practice. The thesis: bound the LLM to intent and judgment under uncertainty; use decomposition as one layer of the guardrail.',
      updated: '2026-08-09',
      status: 'published',
      projectId: 'aegis',
      register: 'practitioner',
    },
    references: [],
    furtherReading: [
      {
        title: 'Aegis: A Five-Stage Text-to-SQL Pipeline with Explicit Failure Paths',
        url: '/blog/text-to-sql',
        description: 'The technical note on the five-stage pipeline, its controls, evidence, and explicit clarification and failure paths.',
      },
      {
        title: 'Two Weeks, One Refactor: Velocity, Clarity, and Model Readiness',
        url: '/blog/aegis-v2-velocity',
        description: 'The narrative of when those calls landed and how a later model cleared the held-out calibration bar for a shelved design.',
      },
      {
        title: 'LLM-as-Router in Practice — Four Decisions',
        url: '/blog/astraeus-llm-as-router-framework',
        description: 'The same family of architectural decisions applied to cross-domain analytics. Aegis and Astraeus share the family resemblance; the load-bearing piece differs.',
      },
      {
        title: 'Aegis — Case Study',
        url: '/projects/aegis',
        description: 'Project case study: context, the cascade architecture, the production narrative.',
      },
    ],
  },
  {
    meta: {
      slug: 'aegis-v2-velocity',
      title: 'Two Weeks, One Refactor: Velocity, Clarity, and Model Readiness',
      subtitle:
        'A focused Aegis v1-to-v2 refactor ran for two weeks while Astraeus was mid-flight and the summer intern program was running; the architecture had been on the shelf for months.',
      date: '2026-04-26',
      tags: ['Leadership', 'Velocity', 'Text-to-SQL', 'Architecture', 'Model Readiness', 'Aegis'],
      readingTime: '7 min read',
      abstract:
        'The v1 benchmarking module was refactored into the v2 architecture in a focused two-week sprint while Astraeus and the 2025 summer intern cohort were also active. Months of prior design and prototyping preceded that window. An earlier model had failed the held-out calibration bar; a later model cleared it, allowing the shelved design to resume. My direct report and the broader team then integrated and productionalized it as Aegis v2. The 2025 CFO One RBC Team Award recognized v1.',
      updated: '2026-08-01',
      status: 'published',
      projectId: 'aegis',
      register: 'builder',
    },
    references: [],
    furtherReading: [
      {
        title: 'Aegis: A Five-Stage Text-to-SQL Pipeline with Explicit Failure Paths',
        url: '/blog/text-to-sql',
        description: 'The technical note on semantic candidate retrieval, clarification, reviewed templates, parameter binding, and database controls.',
      },
      {
        title: 'Why I Chose LLM-as-Router Over a Monolithic Agent',
        url: '/blog/astraeus-llm-as-router',
        description: 'A related router-and-code separation, with different data, query, and disambiguation controls.',
      },
      {
        title: 'Aegis v2 \u2014 Case Study',
        url: '/projects/aegis',
        description: 'The case study page: context, the five-stage architecture, and the production narrative.',
      },
    ],
  },
  {
    meta: {
      slug: 'commodity-tax-cfo-trust-framework',
      title: 'Commodity Tax: Two Decisions Behind a Reviewable Workflow',
      subtitle:
        'Why the pipeline ran on the sanctioned data platform and exposed configured inspection views to the analysts reviewing its output.',
      date: '2026-04-21',
      tags: ['Leadership', 'Decision Making', 'Stakeholder Review', 'PySpark', 'Tableau'],
      readingTime: '9 min read',
      abstract:
        'A decision guide to two choices in the Commodity Tax automation: use PySpark on the sanctioned data platform for repeatable calculation, and provide configured Tableau views for investigation. It compares the alternatives, trade-offs, and residual costs without treating visibility as proof of correctness.',
      updated: '2026-08-09',
      status: 'published',
      projectId: 'commodity-tax',
      register: 'practitioner',
    },
    references: [],
    furtherReading: [
      {
        title: 'How Commodity Tax Built CFO Trust',
        url: '/blog/commodity-tax-cfo-trust',
        description: 'The delivery story behind the first production workflow and its analyst investigation loop.',
      },
      {
        title: 'How We Built PAR Assist: From One-Page Vision to Production Platform',
        url: '/blog/par-assist-building',
        description: 'A later builder story about moving from a one-page vision through pilot and full CFO Group launch.',
      },
      {
        title: 'Commodity Tax — Case Study',
        url: '/projects/commodity-tax',
        description: 'The case study page: context, stakeholders, options considered, decision rationale, production narrative, and lessons learned.',
      },
    ],
  },
  {
    meta: {
      slug: 'commodity-tax-provenance',
      title: 'Commodity Tax: Making a Financial Pipeline Inspectable',
      subtitle:
        'How a five-stage calculation path, recorded lineage, configured Tableau views, and analyst review help investigate a questioned value without treating visibility as proof of correctness.',
      date: '2026-04-26',
      tags: ['Data Lineage', 'Process Automation', 'Tableau', 'Analyst Review', 'Financial Controls'],
      readingTime: '8 min read',
      abstract:
        'The Commodity Tax workflow separates a five-stage calculation path from configured inspection views. This note explains what recorded lineage must retain, how an analyst traces one questioned value, what happens when evidence is missing or inconsistent, and why visibility supports investigation without validating sources, rules, joins, or the return.',
      updated: '2026-08-09',
      status: 'published',
      projectId: 'commodity-tax',
      register: 'technical',
    },
    references: [
      { id: 4, authors: 'Cui, Y., Widom, J. & Wiener, J. L.', title: 'Tracing the Lineage of View Data in a Warehousing Environment', venue: 'ACM Transactions on Database Systems', year: 2000 },
      { id: 5, authors: 'Cheney, J., Chiticariu, L. & Tan, W. C.', title: 'Provenance in Databases: Why, How, and Where', venue: 'Foundations and Trends in Databases', year: 2009 },
    ],
    furtherReading: [
      {
        title: 'How Commodity Tax Built CFO Trust',
        url: '/blog/commodity-tax-cfo-trust',
        description: 'The builder story about the first delivery, the analyst investigation loop, and the credibility earned through production work.',
      },
      {
        title: 'What Happens After a Model Predicts?',
        url: '/blog/closed-loop',
        description: 'A bounded comparison of observation, estimation, decision, action, and feedback across unlike systems.',
      },
      {
        title: 'Commodity Tax — Case Study',
        url: '/projects/commodity-tax',
        description: 'Project case study: context, the five-stage calculation path, configured inspection surfaces, and the analyst-review pattern.',
      },
    ],
  },
  {
    meta: {
      slug: 'commodity-tax-cfo-trust',
      title: 'How Commodity Tax Built CFO Trust',
      subtitle:
        'First project at RBC, first audition — and the architectural decision that turned a months-long manual process into a 90-minute automated one, and a skeptical finance team into the AI team\u2019s strongest sponsors.',
      date: '2026-04-26',
      tags: ['Leadership', 'Stakeholder Management', 'PySpark', 'Tableau', 'Process Automation'],
      readingTime: '7 min read',
      abstract:
        'The story of automating RBC\u2019s Commodity Tax return process from months to 90 minutes across a roughly $600M allocation, and why stakeholder review shaped the architecture. Covers the decision to treat Tableau as a transparency layer rather than only an output, the bounded review pattern it supported, and the cascade of AI initiatives this first project underwrote: Aegis v1, Aegis v2, Astraeus, PAR Assist.',
      updated: '2026-08-01',
      status: 'published',
      projectId: 'commodity-tax',
      register: 'builder',
    },
    references: [],
    furtherReading: [
      {
        title: 'How We Built PAR Assist: From One-Page Vision to Production Platform',
        url: '/blog/par-assist-building',
        description: 'A later builder story about moving from a one-page vision through pilot and full CFO Group launch.',
      },
      {
        title: 'What Happens After a Model Predicts?',
        url: '/blog/closed-loop',
        description: 'A bounded comparison of observation, estimation, decision, action, and feedback across unlike systems.',
      },
      {
        title: 'Commodity Tax — Case Study',
        url: '/projects/commodity-tax',
        description: 'The case study page: context, stakeholders, options considered, decision rationale, production narrative, and lessons learned.',
      },
      {
        title: 'PySpark Documentation',
        url: 'https://spark.apache.org/docs/latest/api/python/',
        description: 'The pipeline backbone used for large-scale General Ledger extraction.',
      },
      {
        title: 'Tableau',
        url: 'https://www.tableau.com/',
        description: 'Used here for configured inspection views that support analyst investigation and review.',
      },
    ],
  },
];
