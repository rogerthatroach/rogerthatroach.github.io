export interface BlogPostMeta {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  tags: string[];
  readingTime: string;
  abstract: string;
  status: 'published' | 'draft';
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
      title: 'Deterministic Agentic Architectures for Enterprise Financial Analytics',
      subtitle: 'A Separation-of-Concerns Approach to LLM-Powered Decision Systems',
      date: '2026-03-01',
      tags: ['Agentic AI', 'LLM Routing', 'Enterprise Security', 'Entitlement Modeling'],
      readingTime: '20 min read',
      abstract:
        'We propose a separation-of-concerns architecture — LLM-as-Router — that combines intelligent natural-language understanding with deterministic, auditable computation. The system processes ~40,000 employee transits across ~9,000 organizational rollups with millisecond-level response times, while maintaining formal guarantees on data confidentiality and entitlement enforcement.',
      status: 'published',
    },
    references: [
      { id: 1, authors: 'Zhao, W.X. et al.', title: 'A Survey of Large Language Models', venue: 'arXiv preprint arXiv:2303.18223', year: 2023, url: 'https://arxiv.org/abs/2303.18223' },
      { id: 2, authors: 'Sun, Z. et al.', title: 'TrustLLM: Trustworthiness in Large Language Models', venue: 'arXiv preprint arXiv:2401.05561', year: 2024, url: 'https://arxiv.org/abs/2401.05561' },
      { id: 3, authors: 'Ouyang, S. et al.', title: 'LLM is Like a Box of Chocolates: the Non-determinism of ChatGPT in Code Generation', venue: 'arXiv preprint arXiv:2308.02828', year: 2023, url: 'https://arxiv.org/abs/2308.02828' },
      { id: 4, authors: 'Li, H. et al.', title: 'Privacy in Large Language Models: Attacks, Defenses and Future Directions', venue: 'arXiv preprint arXiv:2310.10383', year: 2023, url: 'https://arxiv.org/abs/2310.10383' },
      { id: 5, authors: 'Yao, S. et al.', title: 'ReAct: Synergizing Reasoning and Acting in Language Models', venue: 'ICLR', year: 2023 },
      { id: 6, authors: 'Schick, T. et al.', title: 'Toolformer: Language Models Can Teach Themselves to Use Tools', venue: 'NeurIPS', year: 2023 },
      { id: 7, authors: 'Rebedea, T. et al.', title: 'NeMo Guardrails: A Toolkit for Controllable and Safe LLM Applications', venue: 'EMNLP (Demo)', year: 2023 },
      { id: 8, authors: 'Pourreza, M. & Rafiei, D.', title: 'DIN-SQL: Decomposed In-Context Learning of Text-to-SQL with Self-Correction', venue: 'NeurIPS', year: 2023 },
      { id: 9, authors: 'Gao, D. et al.', title: 'Text-to-SQL Empowered by Large Language Models: A Benchmark Evaluation', venue: 'VLDB', year: 2024 },
      { id: 10, authors: 'LangChain, Inc.', title: 'LangGraph Documentation', venue: 'langchain-ai.github.io/langgraph', year: 2024, url: 'https://langchain-ai.github.io/langgraph/' },
      { id: 11, authors: 'Wu, Q. et al.', title: 'AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation', venue: 'arXiv preprint arXiv:2308.08155', year: 2023, url: 'https://arxiv.org/abs/2308.08155' },
    ],
    furtherReading: [
      { title: 'LangChain Documentation', url: 'https://docs.langchain.com/', description: 'Framework for building LLM-powered applications with tool use and agent orchestration.' },
      { title: 'Model Context Protocol (MCP)', url: 'https://modelcontextprotocol.io/', description: 'Open standard for connecting AI assistants to external data sources and tools.' },
      { title: 'Microsoft Responsible AI Standard', url: 'https://www.microsoft.com/en-us/ai/responsible-ai', description: 'Framework for responsible AI development in enterprise contexts.' },
      { title: 'Google SAIF', url: 'https://safety.google/cybersecurity-advancements/saif/', description: 'Secure AI Framework for protecting AI systems in production.' },
    ],
  },
  {
    meta: {
      slug: 'text-to-sql',
      title: 'Guardrailed Text-to-SQL for Financial Benchmarking',
      subtitle: 'A Multi-Stage Pipeline with Formal Safety Properties',
      date: '2026-02-08',
      tags: ['Text-to-SQL', 'Semantic Similarity', 'SQL Injection Prevention', 'Enterprise NLP'],
      readingTime: '18 min read',
      abstract:
        'We present a five-stage decomposed pipeline — intent parsing, KPI detection via embedding similarity, LLM-assisted disambiguation, guardrailed SQL generation, and deterministic formatting — for converting natural-language financial queries into validated SQL. The architecture provides formal safety guarantees: injection impossibility by construction, schema compliance, and disambiguation correctness.',
      status: 'published',
    },
    references: [
      { id: 1, authors: 'Pourreza, M. & Rafiei, D.', title: 'DIN-SQL: Decomposed In-Context Learning of Text-to-SQL with Self-Correction', venue: 'NeurIPS', year: 2023 },
      { id: 2, authors: 'Gao, D. et al.', title: 'Text-to-SQL Empowered by Large Language Models: A Benchmark Evaluation', venue: 'VLDB', year: 2024 },
      { id: 3, authors: 'Dong, X. et al.', title: 'C3: Zero-shot Text-to-SQL with ChatGPT', venue: 'arXiv preprint arXiv:2307.07306', year: 2023, url: 'https://arxiv.org/abs/2307.07306' },
      { id: 4, authors: 'Yu, T. et al.', title: 'Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task', venue: 'EMNLP', year: 2018, url: 'https://yale-lily.github.io/spider' },
      { id: 5, authors: 'Reimers, N. & Gurevych, I.', title: 'Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks', venue: 'EMNLP', year: 2019, url: 'https://www.sbert.net/' },
      { id: 6, authors: 'Kadavath, S. et al.', title: 'Language Models (Mostly) Know What They Know', venue: 'arXiv preprint arXiv:2207.05221', year: 2022, url: 'https://arxiv.org/abs/2207.05221' },
      { id: 7, authors: 'OWASP Foundation', title: 'SQL Injection Prevention Cheat Sheet', venue: 'owasp.org', year: 2023, url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html' },
      { id: 8, authors: 'Zhong, V., Xiong, C. & Socher, R.', title: 'Seq2SQL: Generating Structured Queries from Natural Language using Reinforcement Learning', venue: 'arXiv preprint arXiv:1709.00103', year: 2017, url: 'https://arxiv.org/abs/1709.00103' },
      { id: 9, authors: 'Karpukhin, V. et al.', title: 'Dense Passage Retrieval for Open-Domain Question Answering', venue: 'EMNLP', year: 2020 },
    ],
    furtherReading: [
      { title: 'Spider Benchmark Leaderboard', url: 'https://yale-lily.github.io/spider', description: 'Leading benchmark for evaluating text-to-SQL systems on complex, cross-domain queries.' },
      { title: 'OWASP SQL Injection Guide', url: 'https://owasp.org/www-community/attacks/SQL_Injection', description: 'Comprehensive resource on SQL injection attack vectors and prevention strategies.' },
      { title: 'Sentence Transformers', url: 'https://www.sbert.net/', description: 'Library for computing dense vector representations of sentences for semantic similarity.' },
    ],
  },
  {
    meta: {
      slug: 'closed-loop',
      title: 'Closed-Loop Optimization as a Unifying Pattern',
      subtitle: 'From Particle Swarm Optimization in Industrial Systems to Agentic AI in Enterprise Finance',
      date: '2026-01-15',
      tags: ['PSO', 'Closed-Loop Control', 'Digital Twins', 'Systems Thinking', 'Agentic AI'],
      readingTime: '25 min read',
      abstract:
        'We examine the closed-loop optimization pattern — sense, model, optimize, act — as it manifests across four domains: industrial PSO for combustion tuning at a 900MW coal plant, cloud document processing, financial process automation, and enterprise agentic AI. We demonstrate structural isomorphism across levels and argue that pattern recognition across abstraction levels constitutes a design methodology.',
      status: 'published',
    },
    references: [
      { id: 1, authors: 'Kennedy, J. & Eberhart, R.', title: 'Particle Swarm Optimization', venue: 'Proceedings of ICNN\'95 — International Conference on Neural Networks', year: 1995 },
      { id: 2, authors: 'Shi, Y. & Eberhart, R.', title: 'A Modified Particle Swarm Optimizer', venue: 'Proceedings of IEEE International Conference on Evolutionary Computation', year: 1998 },
      { id: 3, authors: 'Poli, R., Kennedy, J. & Blackwell, T.', title: 'Particle Swarm Optimization: An Overview', venue: 'Swarm Intelligence', year: 2007 },
      { id: 4, authors: 'Clerc, M. & Kennedy, J.', title: 'The Particle Swarm — Explosion, Stability, and Convergence in a Multidimensional Complex Space', venue: 'IEEE Transactions on Evolutionary Computation', year: 2002 },
      { id: 5, authors: 'Grieves, M.', title: 'Digital Twin: Manufacturing Excellence through Virtual Factory Replication', venue: 'White Paper, Florida Institute of Technology', year: 2014 },
      { id: 6, authors: 'Tao, F. et al.', title: 'Digital Twin in Industry: State-of-the-Art', venue: 'IEEE Transactions on Industrial Informatics', year: 2019 },
      { id: 7, authors: 'Coello Coello, C.A., Lamont, G.B. & Van Veldhuizen, D.A.', title: 'Evolutionary Algorithms for Solving Multi-Objective Problems', venue: '2nd ed., Springer', year: 2007 },
      { id: 8, authors: 'Deb, K. et al.', title: 'A Fast and Elitist Multiobjective Genetic Algorithm: NSGA-II', venue: 'IEEE Transactions on Evolutionary Computation', year: 2002 },
      { id: 9, authors: 'LangChain, Inc.', title: 'LangGraph Documentation', venue: 'langchain-ai.github.io/langgraph', year: 2024, url: 'https://langchain-ai.github.io/langgraph/' },
      { id: 10, authors: 'Wu, Q. et al.', title: 'AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation', venue: 'arXiv preprint arXiv:2308.08155', year: 2023, url: 'https://arxiv.org/abs/2308.08155' },
      { id: 11, authors: 'Gamma, E., Helm, R., Johnson, R. & Vlissides, J.', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', venue: 'Addison-Wesley', year: 1994 },
    ],
    furtherReading: [
      { title: 'Particle Swarm Optimization: A Comprehensive Survey', url: 'https://link.springer.com/article/10.1007/s11831-021-09694-4', description: 'Modern survey covering PSO variants, convergence analysis, and multi-objective extensions.' },
      { title: 'Digital Twin Engineering', url: 'https://www.nist.gov/el/cyber-physical-systems/digital-twin', description: 'NIST framework for Digital Twin development and standardization.' },
      { title: 'LLM Powered Autonomous Agents', url: 'https://lilianweng.github.io/posts/2023-06-23-agent/', description: 'Comprehensive overview of LLM-based agent architectures and their applications.' },
    ],
  },
  {
    meta: {
      slug: 'enterprise-agentic-ai-architecture',
      title: 'Enterprise Agentic AI Architecture: Formal Foundations for LangGraph, MCP, and Multi-Layer RAG',
      subtitle: 'A separation-of-concerns approach to LLM-powered enterprise workflow orchestration with formal guarantees on context isolation, action auditability, and retrieval scoping.',
      date: '2026-03-22',
      tags: ['LangGraph', 'MCP', 'RAG', 'Agentic AI', 'PostgreSQL', 'Formal Methods'],
      readingTime: '12 min read',
      abstract:
        'We formalize an agentic workflow system as a directed graph with persistent state, typed MCP tool contracts, and layered retrieval functions. The architecture provides formal guarantees: context isolation (the LLM never observes sensitive data), action boundary enforcement (all agent actions are typed, logged tool invocations), and retrieval scoping (user document indices are session-partitioned with zero cross-contamination). We prove these properties hold by construction and describe a production implementation for enterprise document workflows.',
      status: 'published',
    },
    references: [
      { id: 1, authors: 'Yao, S. et al.', title: 'ReAct: Synergizing Reasoning and Acting in Language Models', venue: 'ICLR', year: 2023 },
      { id: 2, authors: 'Schick, T. et al.', title: 'Toolformer: Language Models Can Teach Themselves to Use Tools', venue: 'NeurIPS', year: 2023 },
      { id: 3, authors: 'Wang, L. et al.', title: 'A Survey on Large Language Model based Autonomous Agents', venue: 'arXiv preprint arXiv:2308.11432', year: 2023, url: 'https://arxiv.org/abs/2308.11432' },
      { id: 4, authors: 'Wu, Q. et al.', title: 'AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation', venue: 'arXiv preprint arXiv:2308.08155', year: 2023, url: 'https://arxiv.org/abs/2308.08155' },
      { id: 5, authors: 'Anthropic', title: 'Model Context Protocol Specification', venue: 'modelcontextprotocol.io', year: 2024, url: 'https://modelcontextprotocol.io/' },
      { id: 6, authors: 'LangChain, Inc.', title: 'LangGraph: Multi-Actor Applications with LLMs', venue: 'LangChain, Inc.', year: 2024, url: 'https://langchain-ai.github.io/langgraph/' },
      { id: 7, authors: 'Lewis, P. et al.', title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', venue: 'NeurIPS', year: 2020 },
      { id: 8, authors: 'Guu, K. et al.', title: 'REALM: Retrieval-Augmented Language Model Pre-Training', venue: 'ICML', year: 2020 },
      { id: 9, authors: 'Reimers, N. & Gurevych, I.', title: 'Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks', venue: 'EMNLP', year: 2019, url: 'https://www.sbert.net/' },
      { id: 10, authors: 'Li, H. et al.', title: 'Privacy in Large Language Models: Attacks, Defenses and Future Directions', venue: 'arXiv preprint arXiv:2310.10383', year: 2023, url: 'https://arxiv.org/abs/2310.10383' },
      { id: 11, authors: 'Patil, S. et al.', title: 'Gorilla: Large Language Model Connected with Massive APIs', venue: 'arXiv preprint arXiv:2305.15334', year: 2023, url: 'https://arxiv.org/abs/2305.15334' },
      { id: 12, authors: 'Wei, J. et al.', title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models', venue: 'NeurIPS', year: 2022 },
      { id: 13, authors: 'Mialon, G. et al.', title: 'Augmented Language Models: A Survey', venue: 'Transactions on Machine Learning Research', year: 2023 },
      { id: 14, authors: 'Johnson, J. et al.', title: 'Billion-Scale Similarity Search with GPUs', venue: 'IEEE Transactions on Big Data', year: 2021 },
    ],
    furtherReading: [
      { title: 'LangGraph Documentation', url: 'https://langchain-ai.github.io/langgraph/', description: 'Official docs for building multi-actor applications with LLMs as directed graphs with persistent state.' },
      { title: 'Model Context Protocol (MCP)', url: 'https://modelcontextprotocol.io/', description: 'Open standard for connecting AI assistants to external data sources and tools with typed contracts.' },
      { title: 'pgvector: Open-Source Vector Similarity Search for PostgreSQL', url: 'https://github.com/pgvector/pgvector', description: 'Extension adding vector similarity search to PostgreSQL — the backbone of the unified storage layer.' },
      { title: 'Weng, L. "LLM Powered Autonomous Agents"', url: 'https://lilianweng.github.io/posts/2023-06-23-agent/', description: 'Comprehensive survey of LLM-based agent architectures, planning, tool use, and memory systems.' },
      { title: 'Microsoft Responsible AI Standard', url: 'https://www.microsoft.com/en-us/ai/responsible-ai', description: 'Framework for responsible AI development — relevant to the auditability and context isolation guarantees.' },
    ],
  },
  {
    meta: {
      slug: 'par-assist-building',
      title: 'How We Built PAR Assist: From Intern POC to Bank-Wide Product',
      subtitle: 'A builder-register companion to the formal architecture post — the story, the decisions, and the leadership lessons behind a bank-wide agentic AI platform.',
      date: '2026-04-17',
      tags: ['Leadership', 'Agentic AI', 'LangGraph', 'Product Development', 'Team Building'],
      readingTime: '9 min read',
      abstract:
        'The story of how an intern\u2019s one-page proof-of-concept during the 2025 Amplify program became PAR Assist, a bank-wide agentic AI platform that shipped April 2026. Architecture decisions as trade-offs, not theorems: why LangGraph over chains, why MCP tools as the action boundary, why three RAG layers, why PostgreSQL + pgvector. Plus three leadership lessons about scoping, parallel execution, and trusting the origin of an idea. A conversational companion to the formal post that proves context isolation by construction.',
      status: 'published',
    },
    references: [],
    furtherReading: [
      { title: 'Enterprise Agentic AI Architecture (the formal companion)', url: '/blog/enterprise-agentic-ai-architecture', description: 'The formal post that proves context isolation, action boundary enforcement, and retrieval scoping by construction. Same system, different register.' },
      { title: 'Closed-Loop Optimization as a Unifying Pattern', url: '/blog/closed-loop', description: 'The broader pattern this system follows, traced from PSO on a coal plant to LangGraph agents in enterprise finance.' },
      { title: 'LangGraph Documentation', url: 'https://langchain-ai.github.io/langgraph/', description: 'Official docs for directed-graph workflow orchestration with persistent state.' },
      { title: 'Model Context Protocol (MCP)', url: 'https://modelcontextprotocol.io/', description: 'Open standard for typed tool contracts between AI assistants and external systems.' },
      { title: 'pgvector', url: 'https://github.com/pgvector/pgvector', description: 'Vector similarity search for PostgreSQL — the backbone that unifies structured metadata and embeddings in one transactional store.' },
    ],
  },
  {
    meta: {
      slug: 'astraeus-llm-as-router',
      title: 'Why I Chose LLM-as-Router Over a Monolithic Agent',
      subtitle:
        'A builder-register companion to the formal Astraeus architecture paper \u2014 the pressure to build the seductive option, and why I didn\u2019t.',
      date: '2026-05-22',
      tags: ['Leadership', 'Agentic AI', 'Enterprise Architecture', 'Regulated AI', 'Astraeus'],
      readingTime: '7 min read',
      abstract:
        'The most common architectural mistake in enterprise agentic AI is the one nobody calls a mistake: giving the LLM full access and letting it figure it out. This is the story of pushing back against that pattern when building Astraeus \u2014 RBC\u2019s production analytics platform for the CFO Group \u2014 and what LLM-as-Router actually requires to build at enterprise scale. Four reasons the seductive option fails (non-determinism, data leakage, no audit trail, permission correctness), the entitlement-modeling work that was the real engineering, and why the pattern now underlies every AI system I build at the bank.',
      status: 'draft',
    },
    references: [],
    furtherReading: [
      {
        title: 'Deterministic Agentic Architectures (the formal companion)',
        url: '/blog/agentic-ai',
        description: 'The formal paper proving data-confidentiality and entitlement-safety of the LLM-as-Router architecture under defined threat models.',
      },
      {
        title: 'How We Built PAR Assist',
        url: '/blog/par-assist-building',
        description: 'The same pattern applied to a different system \u2014 typed MCP tool contracts as the audit layer instead of sub-agent isolation.',
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
      slug: 'combustion-tuning-operators',
      title: 'Digital Twin at 900MW: What the Plant Operators Taught Me',
      subtitle:
        'A builder-register companion to the Closed-Loop post \u2014 the stakeholder trust layer behind the $3M/year Digital Twin.',
      date: '2026-06-05',
      tags: ['Leadership', 'Industrial ML', 'Digital Twin', 'Trust Layer', 'TCS'],
      readingTime: '6 min read',
      abstract:
        'Industrial ML is not a modeling problem \u2014 it\u2019s a trust problem with a modeling problem inside it. The story of the Digital Twin at a 900MW coal plant in Japan: 84 regression models across 90+ sensors, Particle Swarm Optimization over the model outputs, and the first iteration of recommendations the plant operators ignored. What it took to build the credibility that made ML recommendations actionable at 900MW, and how the lesson ported to Commodity Tax at RBC six years later.',
      status: 'draft',
    },
    references: [],
    furtherReading: [
      {
        title: 'Closed-Loop Optimization as a Unifying Pattern (the formal companion)',
        url: '/blog/closed-loop',
        description: 'The formal post that traces the sense-model-optimize-act pattern from PSO on a coal plant to agentic AI in enterprise finance. Same pattern, four domains.',
      },
      {
        title: 'Combustion Tuning \u2014 Case Study',
        url: '/projects/combustion-tuning',
        description: 'The case study page: context, technical approach, impact, and the lessons that shaped later work.',
      },
    ],
  },
  {
    meta: {
      slug: 'document-intelligence-accuracy-cliff',
      title: 'The Accuracy Cliff: 70% to 99.95% and Why ML Metrics Aren\u2019t ML Economics',
      subtitle:
        'The hybrid document-verification stack that got Humana\u2019s claims processing to production \u2014 and what it taught me about cost-per-inference as a first-class design concern.',
      date: '2026-06-19',
      tags: ['ML Economics', 'Document AI', 'Hybrid ML', 'Insurance', 'Quantiphi'],
      readingTime: '6 min read',
      abstract:
        'Document verification accuracy is a step function, not a gradient: 70% is unusable, 95% is still unusable, 99.95% enables full automation. The story of getting Humana\u2019s checkbox extraction across that cliff via a hybrid stack \u2014 Document AI for OCR, OpenCV for pixel-level detection, Random Forest for edge cases. Plus two insights that shaped later RAG work at RBC: cost-per-inference matters as much as accuracy at scale, and document structure is itself information.',
      status: 'draft',
    },
    references: [],
    furtherReading: [
      {
        title: 'Document Intelligence \u2014 Case Study',
        url: '/projects/document-intelligence',
        description: 'The case study page: insurance-specific context, OCR challenges, the hybrid pipeline, and how the lessons carried over to RAG design at RBC.',
      },
      {
        title: 'How We Built PAR Assist',
        url: '/blog/par-assist-building',
        description: 'Where the document-structure insight resurfaced: chunking by structure (not fixed token windows) was the difference between useful and useless retrieval.',
      },
    ],
  },
  {
    meta: {
      slug: 'aegis-v2-velocity',
      title: 'Two Weeks, One Product: What Velocity Looks Like When Architecture Is Right',
      subtitle:
        'Aegis v2 shipped in 2 weeks while Astraeus was mid-flight and the Amplify program was running. A post about what makes that possible.',
      date: '2026-07-03',
      tags: ['Leadership', 'Velocity', 'Text-to-SQL', 'Architecture', 'Aegis'],
      readingTime: '6 min read',
      abstract:
        'Aegis v2 shipped in two weeks while Astraeus was mid-flight and the Amplify program was running. The metric is real; the framing that implies the work happened in that window is misleading. The real work happened in the months before. Three preconditions that made the sprint possible: rehearsed architecture, decomposable pipeline, ruthlessly bounded scope. Structurally a descendant of the Astraeus LLM-as-Router pattern \u2014 same family, tighter intent classification.',
      status: 'draft',
    },
    references: [],
    furtherReading: [
      {
        title: 'Guardrailed Text-to-SQL (the formal companion)',
        url: '/blog/text-to-sql',
        description: 'The formal paper on the five-stage pipeline with safety guarantees: injection impossibility by construction, bounded disambiguation, schema compliance.',
      },
      {
        title: 'Why I Chose LLM-as-Router Over a Monolithic Agent',
        url: '/blog/astraeus-llm-as-router',
        description: 'The sister architectural call. Aegis v2 is the same pattern with a tighter intent classification.',
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
      slug: 'commodity-tax-cfo-trust',
      title: 'How Commodity Tax Built CFO Trust',
      subtitle:
        'First project at RBC, first audition — and the architectural decision that turned a months-long manual process into a 90-minute automated one, and a skeptical finance team into the AI team\u2019s strongest sponsors.',
      date: '2026-05-15',
      tags: ['Leadership', 'Stakeholder Management', 'PySpark', 'Tableau', 'Process Automation'],
      readingTime: '6 min read',
      abstract:
        'The story of automating RBC\u2019s Commodity Tax return process from months to 90 minutes \u2014 and why the real deliverable wasn\u2019t the automation but the stakeholder trust it built. Covers the architectural decision to treat Tableau as a transparency layer (not just an output), the stakeholder dynamics of automating institutional knowledge, and the cascade of AI initiatives this first project underwrote: Aegis v1, Aegis v2, Astraeus, PAR Assist.',
      status: 'draft',
    },
    references: [],
    furtherReading: [
      {
        title: 'How We Built PAR Assist (practitioner companion)',
        url: '/blog/par-assist-building',
        description: 'The other builder-register post in this corpus — same voice, different system. The PAR Assist story wouldn\u2019t have happened without the trust built here.',
      },
      {
        title: 'Closed-Loop Optimization as a Unifying Pattern',
        url: '/blog/closed-loop',
        description: 'The underlying pattern traced across industrial PSO, cloud pipelines, enterprise finance, and agentic AI. Commodity Tax sits in the enterprise finance step of the arc.',
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
        title: 'Tableau for Data Engineering Transparency',
        url: 'https://www.tableau.com/',
        description: 'Used here as a trust and audit layer, not just an output surface — the architectural decision that made this project land.',
      },
    ],
  },
];
