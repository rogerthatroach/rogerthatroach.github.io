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
   *   - 'formal'       — technical register with definitions, math, and stated assumptions
   *   - 'practitioner' — decisions + options considered + rationale
   *   - 'builder'      — narrative / director / story register
   *
   * Posts without this field render no tag.
   */
  register?: 'formal' | 'practitioner' | 'builder';
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
      title: 'Agentic Architecture with Bounded LLM Roles for Enterprise Financial Analytics',
      subtitle: 'A Separation-of-Concerns Approach to LLM-Powered Decision Systems',
      date: '2026-03-01',
      tags: ['Agentic AI', 'LLM Routing', 'Enterprise Security', 'Entitlement Modeling'],
      readingTime: '20 min read',
      abstract:
        'We describe an LLM-as-Router architecture that separates natural-language interpretation from entitlement resolution and deterministic calculation. The system works across ~40,000 cost-centre leaves shared by an 18-level business-segment hierarchy with ~9,000 rollups and a geographic hierarchy. Typed interfaces, access controls, validation, logs, tests, and monitoring constrain the model/data boundary; the post states the assumptions and residual risks rather than treating the design as a proof of confidentiality.',
      updated: '2026-08-01',
      status: 'published',
      projectId: 'astraeus',
      register: 'formal',
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
      { title: 'Google SAIF', url: 'https://www.saif.google/secure-ai-framework', description: 'Secure AI Framework for protecting AI systems in production.' },
    ],
  },
  {
    meta: {
      slug: 'text-to-sql',
      title: 'Guardrailed Text-to-SQL for Financial Benchmarking',
      subtitle: 'A Multi-Stage Pipeline with Bounded Safety Properties',
      date: '2026-02-08',
      tags: ['Text-to-SQL', 'Semantic Similarity', 'SQL Injection Prevention', 'Enterprise NLP'],
      readingTime: '18 min read',
      abstract:
        'We present a five-stage decomposed pipeline — intent parsing, KPI detection via embedding similarity, LLM-assisted disambiguation, reviewed-template SQL generation, and deterministic formatting — for converting natural-language financial queries into a constrained query surface. Allowlisted identifiers, parameter binding, structural validation, and confidence-gated clarification provide defense in depth; the post also states the limits of those controls.',
      updated: '2026-08-01',
      status: 'published',
      projectId: 'aegis',
      register: 'formal',
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
      title: 'Closed-Loop Thinking as a Cross-Domain Design Heuristic',
      subtitle: 'From industrial PSO to enterprise AI: what transfers, and what does not',
      date: '2026-01-15',
      tags: ['PSO', 'Closed-Loop Control', 'Digital Twins', 'Systems Thinking', 'Agentic AI'],
      readingTime: '25 min read',
      abstract:
        'We use four questions — observe, estimate, choose, act — as a bounded analogy across industrial optimization, cloud document processing, financial process automation, and enterprise AI. The comparison keeps each system’s different objectives, evidence, controls, and failure modes explicit.',
      updated: '2026-08-01',
      status: 'published',
      register: 'formal',
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
      { title: 'Digital Twins at NIST', url: 'https://www.nist.gov/digital-twins', description: 'NIST resources on digital-twin definitions, engineering, validation, and standardization.' },
      { title: 'LLM Powered Autonomous Agents', url: 'https://lilianweng.github.io/posts/2023-06-23-agent/', description: 'Comprehensive overview of LLM-based agent architectures and their applications.' },
    ],
  },
  {
    meta: {
      slug: 'enterprise-agentic-ai-architecture',
      title: 'Enterprise Agentic AI Architecture: Formal Foundations for LangGraph, MCP, and Field-Group Retrieval',
      subtitle: 'A separation-of-concerns approach to LLM-powered workflow orchestration inside a single-agent governance envelope, with explicit assumptions for context boundaries, tool logging, and field-group retrieval.',
      date: '2026-03-22',
      tags: ['LangGraph', 'MCP', 'RAG', 'Agentic AI', 'PostgreSQL', 'Formal Methods'],
      readingTime: '12 min read',
      abstract:
        'We describe an agentic workflow system as a directed graph with persistent state, typed MCP tool contracts, and two-stage field-group retrieval with bounded, group-scoped extraction calls. The design bounds model context, routes application actions through a typed tool registry, scopes retrieval by field group, and keeps control in a single-agent graph. The post makes the assumptions and residual limits of those controls explicit alongside the production implementation.',
      updated: '2026-08-01',
      status: 'published',
      projectId: 'par-assist',
      register: 'formal',
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
      { title: 'pgvector: Open-Source Vector Similarity Search for PostgreSQL', url: 'https://github.com/pgvector/pgvector', description: 'Extension adding vector similarity search to PostgreSQL for vector-backed retrieval.' },
      { title: 'Weng, L. "LLM Powered Autonomous Agents"', url: 'https://lilianweng.github.io/posts/2023-06-23-agent/', description: 'Comprehensive survey of LLM-based agent architectures, planning, tool use, and memory systems.' },
      { title: 'Microsoft Responsible AI Standard', url: 'https://www.microsoft.com/en-us/ai/responsible-ai', description: 'Framework for responsible AI development and governance controls.' },
    ],
  },
  {
    meta: {
      slug: 'enterprise-agentic-ai-framework',
      title: 'Enterprise Agentic AI Architecture — Practitioner Rewrite',
      subtitle:
        'The same PAR Assist system in practitioner register. Constraints, options considered, and architectural decisions are first-class structure; formal math sits as a bottom appendix for readers who want it.',
      date: '2026-04-22',
      tags: ['LangGraph', 'MCP', 'RAG', 'Agentic AI', 'Single-Agent Envelope'],
      readingTime: '10 min read',
      abstract:
        'PAR Assist — the first true agentic AI platform approved for production at the bank — was architected inside a single-agent governance envelope. LangGraph coordinates retained workflow state, template selection is an MCP tool, two-stage field-group retrieval scopes context, bounded extraction calls feed an ownership-aware merge, and a coverage loop surfaces follow-ups. The post examines the four architectural decisions, their trade-offs, and the assumptions behind the controls.',
      updated: '2026-08-01',
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
      { title: 'Enterprise Agentic AI Architecture (original formal post)', url: '/blog/enterprise-agentic-ai-architecture', description: 'The sibling post — same system, formal register, with definitions, configured design contracts, and explicit operating assumptions. Compare with this rewrite to see the register swap.' },
      { title: 'How We Built PAR Assist (builder story)', url: '/blog/par-assist-building', description: 'The third register — conversational builder story, same architecture.' },
    ],
  },
  {
    meta: {
      slug: 'par-assist-building',
      title: 'How We Built PAR Assist: From One-Page Vision to Production Platform',
      subtitle: 'A builder-register companion to the formal architecture post — the story, decisions, and leadership lessons behind the first true agentic AI platform approved for production at the bank.',
      date: '2026-04-17',
      tags: ['Leadership', 'Agentic AI', 'LangGraph', 'Product Development', 'Team Building'],
      readingTime: '9 min read',
      abstract:
        'The story of how a one-page vision became PAR Assist, the first true agentic AI platform approved for production at the bank (pilot April 2026; full CFO Group launch across all geographies May 2026). The concept was handed to the 2025 Amplify cohort as an ideation exercise to explore the problem space; the production platform was then built end-to-end. Architecture decisions as trade-offs, not theorems: why LangGraph fit the branching workflow, why MCP tools form the action boundary, how field-group retrieval scopes extraction, and how ownership-aware merge and retained trace records support review inside a single-agent governance envelope. Plus three leadership lessons about scoping, parallel execution, and translating vision into shipped systems.',
      updated: '2026-08-01',
      status: 'published',
      projectId: 'par-assist',
      register: 'builder',
    },
    references: [],
    furtherReading: [
      { title: 'Enterprise Agentic AI Architecture (the formal companion)', url: '/blog/enterprise-agentic-ai-architecture', description: 'The formal post that defines the context, tool-boundary, and retrieval-scoping controls and the assumptions they depend on. Same system, different register.' },
      { title: 'Closed-Loop Thinking as a Cross-Domain Design Heuristic', url: '/blog/closed-loop', description: 'A bounded comparison between industrial PSO and enterprise AI, including what does not transfer across domains.' },
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
        'A builder-register companion to the formal Astraeus architecture paper \u2014 the pressure to build the seductive option, and why I didn\u2019t.',
      date: '2026-04-18',
      tags: ['Leadership', 'Agentic AI', 'Enterprise Architecture', 'Regulated AI', 'Astraeus'],
      readingTime: '7 min read',
      abstract:
        'This is the story of rejecting a monolithic, broad-access agent while building Astraeus, a production analytics platform for the CFO Group. It explains why LLM-as-Router keeps entitlement and calculation outside the model, what the permission-to-SQL work required, and where typed boundaries, tests, logging, and monitoring are still needed because the architecture does not prove its own enforcement.',
      updated: '2026-08-01',
      status: 'published',
      projectId: 'astraeus',
      register: 'builder',
    },
    references: [],
    furtherReading: [
      {
        title: 'Agentic Architecture with Bounded LLM Roles (the formal companion)',
        url: '/blog/agentic-ai',
        description: 'The technical companion describing the LLM-as-Router boundary, its controls, assumptions, and residual risks.',
      },
      {
        title: 'LLM-as-Router in Practice (the practitioner rewrite)',
        url: '/blog/astraeus-llm-as-router-framework',
        description: 'The same architecture in practitioner register \u2014 four decisions as first-class structure with options considered, constraint cards, and decision rationale for each.',
      },
      {
        title: 'How We Built PAR Assist',
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
        'A practitioner-register rewrite of the Astraeus architecture. Constraints, options considered, and decision rationale for each of the four calls that separate LLM-as-Router from the seductive monolithic pattern.',
      date: '2026-04-23',
      tags: ['Agentic AI', 'LLM-as-Router', 'Cython', 'Entitlement', 'Astraeus'],
      readingTime: '14 min read',
      abstract:
        'Astraeus separates model-assisted intent and answer shaping from a deterministic Cython compute path. This post compares four decisions: orchestration shape, computation layer, pre-compute entitlement enforcement, and answer/synthesis strategy. It makes the typed boundary, access-control dependencies, validation, logs, tests, monitoring, and residual risks explicit; the builder companion carries the delivery story and the technical companion develops the control analysis.',
      updated: '2026-08-01',
      status: 'published',
      projectId: 'astraeus',
      register: 'practitioner',
    },
    references: [],
    furtherReading: [
      {
        title: 'Agentic Architecture with Bounded LLM Roles (the formal companion)',
        url: '/blog/agentic-ai',
        description: 'The sibling post \u2014 same system, formal register, with definitions, configured design contracts, and explicit operating assumptions. Compare with this rewrite to see the register swap.',
      },
      {
        title: 'Why I Chose LLM-as-Router Over a Monolithic Agent (the builder story)',
        url: '/blog/astraeus-llm-as-router',
        description: 'The third register \u2014 conversational builder narrative, pushback against the seductive option, team + scope detail.',
      },
      {
        title: 'Enterprise Agentic AI Architecture \u2014 Practitioner Rewrite (PAR Assist)',
        url: '/blog/enterprise-agentic-ai-framework',
        description: 'The same register applied to PAR Assist \u2014 MCP tools as the action boundary, field-group retrieval, single-agent envelope.',
      },
      {
        title: 'LangGraph Documentation',
        url: 'https://langchain-ai.github.io/langgraph/',
        description: 'Directed-graph workflow orchestration with persistent state \u2014 the framework precedent for routing-style orchestration.',
      },
      {
        title: 'Cython: Python with C Performance',
        url: 'https://cython.readthedocs.io/',
        description: 'The compiled-Python toolchain behind the event-level ins-outs math.',
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
        'A practitioner-register rewrite of the Aegis architecture. Constraints, options considered, and decision rationale for each of the four calls that separate decomposition-as-guardrail from the single-prompt text-to-SQL pattern.',
      date: '2026-04-26',
      tags: ['Text-to-SQL', 'Decomposition', 'SQL Safety', 'Embeddings', 'Calibration', 'Aegis'],
      readingTime: '13 min read',
      abstract:
        'A practitioner companion to the technical text-to-SQL note and the builder story. It compares four decisions: decomposed orchestration, embedding-based KPI detection, reviewed SQL templates with parameter binding, and confidence-gated clarification. A six-step query walkthrough and v1-to-v2 comparison show how the boundaries work in practice. The thesis: bound the LLM to intent and judgment under uncertainty; use decomposition as one layer of the guardrail.',
      updated: '2026-08-01',
      status: 'published',
      projectId: 'aegis',
      register: 'practitioner',
    },
    references: [],
    furtherReading: [
      {
        title: 'Guardrailed Text-to-SQL (the formal companion)',
        url: '/blog/text-to-sql',
        description: 'The formal paper on the five-stage pipeline: reviewed templates, parameter binding, schema checks, confidence-gated disambiguation, and model readiness as a precondition.',
      },
      {
        title: 'Two Weeks, One Product (the builder companion)',
        url: '/blog/aegis-v2-velocity',
        description: 'The narrative of when those calls landed and how a later model cleared the held-out calibration bar for a shelved design.',
      },
      {
        title: 'LLM-as-Router in Practice (the sister practitioner post)',
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
        title: 'Guardrailed Text-to-SQL (the formal companion)',
        url: '/blog/text-to-sql',
        description: 'The formal paper on the five-stage pipeline: a constrained SQL surface, confidence-gated disambiguation, and schema validation.',
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
      title: 'How Commodity Tax Built CFO Trust — Framework A/B',
      subtitle:
        'The builder story recast around constraints, alternatives, trade-offs, a before-and-after comparison, and a bounded stakeholder-review loop.',
      date: '2026-04-21',
      tags: ['Leadership', 'Framework A/B', 'Stakeholder Management', 'PySpark', 'Tableau'],
      readingTime: '9 min read',
      abstract:
        'A decision-oriented version of the builder post on automating the Commodity Tax process. It examines two pivotal choices—PySpark on CDP and Tableau as a transparency layer—then connects the trade-offs to the before-and-after workflow and a repeatable stakeholder-review pattern.',
      updated: '2026-08-01',
      status: 'published',
      projectId: 'commodity-tax',
      register: 'practitioner',
    },
    references: [],
    furtherReading: [
      {
        title: 'Original builder-register version (for A/B comparison)',
        url: '/blog/commodity-tax-cfo-trust',
        description: 'Same story, pure prose — no framework components. Read side-by-side to see what the framework adds.',
      },
      {
        title: 'How We Built PAR Assist (practitioner companion)',
        url: '/blog/par-assist-building',
        description: 'The other builder-register post in this corpus — same voice, different system. PAR Assist story wouldn\u2019t have happened without the trust built here.',
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
      title: 'Pipeline as Graph Rewrite — A Provenance Algebra for Auditable Process Automation',
      subtitle:
        'Formalizing the architecture behind a regulated-finance automation: five-stage pipeline as composed graph rewrites, Tableau dashboards as a parallel presentation layer derived from the same provenance relation.',
      date: '2026-04-26',
      tags: ['Provenance', 'Process Automation', 'Auditability', 'Graph Rewrites', 'Regulated Finance'],
      readingTime: '15 min read',
      abstract:
        'A technical treatment of the five-stage Commodity Tax pipeline (extract → reconcile → category map → aggregate → return) using graph-rewrite and provenance notation. It separates observed implementation behavior from the assumptions required for lineage reconstruction and replay, then shows how Tableau exposed intermediate states for review. The trust model is presented as a hypothesis informed by the delivery experience, not as a proven quantitative law.',
      updated: '2026-08-01',
      status: 'published',
      projectId: 'commodity-tax',
      register: 'formal',
    },
    references: [
      { id: 1, authors: 'Kimball, R. & Caserta, J.', title: 'The Data Warehouse ETL Toolkit', venue: 'Wiley', year: 2004 },
      { id: 2, authors: 'Ehrig, H. et al.', title: 'Fundamentals of Algebraic Graph Transformation', venue: 'Springer', year: 2006 },
      { id: 3, authors: 'PCAOB', title: 'Auditing Standard No. 5 — An Audit of Internal Control Over Financial Reporting', venue: 'Public Company Accounting Oversight Board', year: 2007 },
      { id: 4, authors: 'Cui, Y., Widom, J. & Wiener, J. L.', title: 'Tracing the Lineage of View Data in a Warehousing Environment', venue: 'ACM Transactions on Database Systems', year: 2000 },
      { id: 5, authors: 'Cheney, J., Chiticariu, L. & Tan, W. C.', title: 'Provenance in Databases: Why, How, and Where', venue: 'Foundations and Trends in Databases', year: 2009 },
      { id: 6, authors: 'COSO', title: 'Internal Control — Integrated Framework', venue: 'Committee of Sponsoring Organizations of the Treadway Commission', year: 2013 },
      { id: 7, authors: 'Lee, J. D. & See, K. A.', title: 'Trust in Automation: Designing for Appropriate Reliance', venue: 'Human Factors', year: 2004 },
    ],
    furtherReading: [
      {
        title: 'How Commodity Tax Built CFO Trust (the builder companion)',
        url: '/blog/commodity-tax-cfo-trust',
        description: 'The narrative of how configured Tableau views gave analysts and the delivery team a shared surface for investigating questioned numbers.',
      },
      {
        title: 'How Commodity Tax Built CFO Trust — Framework A/B (the practitioner companion)',
        url: '/blog/commodity-tax-cfo-trust-framework',
        description: 'The practitioner-register version with explicit constraints, options considered, and decision rationale callouts.',
      },
      {
        title: 'Closed-Loop Thinking as a Cross-Domain Design Heuristic',
        url: '/blog/closed-loop',
        description: 'A bounded observe-estimate-choose-act heuristic across industrial PSO, cloud pipelines, enterprise finance, and AI.',
      },
      {
        title: 'Commodity Tax — Case Study',
        url: '/projects/commodity-tax',
        description: 'Project case study: context, the pipeline + transparency rail, and the stakeholder-review pattern.',
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
        title: 'How We Built PAR Assist (practitioner companion)',
        url: '/blog/par-assist-building',
        description: 'The other builder-register post in this corpus — same voice, different system. PAR Assist story wouldn\u2019t have happened without the trust built here.',
      },
      {
        title: 'Closed-Loop Thinking as a Cross-Domain Design Heuristic',
        url: '/blog/closed-loop',
        description: 'A bounded cross-domain design heuristic spanning industrial PSO, cloud pipelines, enterprise finance, and AI.',
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
