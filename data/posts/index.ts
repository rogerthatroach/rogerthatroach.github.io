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

export const POSTS: BlogPost[] = [
  {
    meta: {
      slug: 'agentic-ai',
      title: 'Deterministic Agentic Architectures for Enterprise Financial Analytics',
      subtitle: 'A Separation-of-Concerns Approach to LLM-Powered Decision Systems',
      date: '2026-03-29',
      tags: ['Agentic AI', 'LLM Routing', 'Enterprise Security', 'Entitlement Modeling'],
      readingTime: '20 min read',
      abstract:
        'We propose a separation-of-concerns architecture — LLM-as-Router — that combines intelligent natural-language understanding with deterministic, auditable computation. The system processes ~40,000 employee transits across ~9,000 organizational rollups with millisecond-level response times, while maintaining formal guarantees on data confidentiality and entitlement enforcement.',
      status: 'published',
    },
    references: [
      { id: 1, authors: 'Schick, T. et al.', title: 'Toolformer: Language Models Can Teach Themselves to Use Tools', venue: 'NeurIPS', year: 2023 },
      { id: 2, authors: 'Patil, S. et al.', title: 'Gorilla: Large Language Model Connected with Massive APIs', venue: 'arXiv preprint', year: 2023 },
      { id: 3, authors: 'Wei, J. et al.', title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models', venue: 'NeurIPS', year: 2022 },
      { id: 4, authors: 'Yao, S. et al.', title: 'ReAct: Synergizing Reasoning and Acting in Language Models', venue: 'ICLR', year: 2023 },
      { id: 5, authors: 'Chase, H.', title: 'LangChain: Building applications with LLMs through composability', venue: 'GitHub', year: 2022 },
      { id: 6, authors: 'Anthropic', title: 'Model Context Protocol Specification', venue: 'anthropic.com', year: 2024 },
      { id: 7, authors: 'Microsoft', title: 'Responsible AI Principles', venue: 'microsoft.com/ai/responsible-ai', year: 2023 },
      { id: 8, authors: 'Google', title: 'Secure AI Framework (SAIF)', venue: 'safety.google', year: 2023 },
      { id: 9, authors: 'Li, J. et al.', title: 'Text-to-SQL Empowered by Large Language Models: A Benchmark Evaluation', venue: 'VLDB', year: 2024 },
      { id: 10, authors: 'Gao, D. et al.', title: 'Text-to-SQL via Decomposed Intention and Neuro-Symbolic Reasoning (DIN-SQL)', venue: 'NeurIPS', year: 2023 },
      { id: 11, authors: 'Wang, L. et al.', title: 'A Survey on Large Language Model based Autonomous Agents', venue: 'arXiv preprint', year: 2023 },
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
      date: '2026-03-29',
      tags: ['Text-to-SQL', 'Semantic Similarity', 'SQL Injection Prevention', 'Enterprise NLP'],
      readingTime: '18 min read',
      abstract:
        'We present a five-stage decomposed pipeline — intent parsing, KPI detection via embedding similarity, LLM-assisted disambiguation, guardrailed SQL generation, and deterministic formatting — for converting natural-language financial queries into validated SQL. The architecture provides formal safety guarantees: injection impossibility by construction, schema compliance, and disambiguation correctness.',
      status: 'published',
    },
    references: [
      { id: 1, authors: 'Li, J. et al.', title: 'Text-to-SQL Empowered by Large Language Models: A Benchmark Evaluation', venue: 'VLDB', year: 2024 },
      { id: 2, authors: 'Gao, D. et al.', title: 'Text-to-SQL via Decomposed Intention and Neuro-Symbolic Reasoning (DIN-SQL)', venue: 'NeurIPS', year: 2023 },
      { id: 3, authors: 'Pourreza, M. & Rafiei, D.', title: 'DAIL-SQL: Optimized Few-Shot Text-to-SQL with LLMs', venue: 'VLDB', year: 2024 },
      { id: 4, authors: 'Yu, T. et al.', title: 'Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL', venue: 'EMNLP', year: 2018 },
      { id: 5, authors: 'Zhong, V. et al.', title: 'Seq2SQL: Generating Structured Queries from Natural Language using Reinforcement Learning', venue: 'arXiv preprint', year: 2017 },
      { id: 6, authors: 'Reimers, N. & Gurevych, I.', title: 'Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks', venue: 'EMNLP', year: 2019 },
      { id: 7, authors: 'OWASP Foundation', title: 'SQL Injection Prevention Cheat Sheet', venue: 'owasp.org', year: 2023 },
      { id: 8, authors: 'Rajkumar, N. et al.', title: 'Evaluating the Text-to-SQL Capabilities of Large Language Models', venue: 'arXiv preprint', year: 2022 },
      { id: 9, authors: 'Wang, B. et al.', title: 'MAC-SQL: Multi-Agent Collaboration for Text-to-SQL', venue: 'arXiv preprint', year: 2024 },
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
      date: '2026-03-29',
      tags: ['PSO', 'Closed-Loop Control', 'Digital Twins', 'Systems Thinking', 'Agentic AI'],
      readingTime: '25 min read',
      abstract:
        'We examine the closed-loop optimization pattern — sense, model, optimize, act — as it manifests across four domains: industrial PSO for combustion tuning at a 900MW coal plant, cloud document processing, financial process automation, and enterprise agentic AI. We demonstrate structural isomorphism across levels and argue that pattern recognition across abstraction levels constitutes a design methodology.',
      status: 'published',
    },
    references: [
      { id: 1, authors: 'Kennedy, J. & Eberhart, R.', title: 'Particle Swarm Optimization', venue: 'IEEE International Conference on Neural Networks', year: 1995 },
      { id: 2, authors: 'Shi, Y. & Eberhart, R.', title: 'A Modified Particle Swarm Optimizer', venue: 'IEEE World Congress on Computational Intelligence', year: 1998 },
      { id: 3, authors: 'Clerc, M. & Kennedy, J.', title: 'The Particle Swarm — Explosion, Stability, and Convergence', venue: 'IEEE Transactions on Evolutionary Computation', year: 2002 },
      { id: 4, authors: 'Grieves, M. & Vickers, J.', title: 'Digital Twin: Mitigating Unpredictable, Undesirable Emergent Behavior in Complex Systems', venue: 'Transdisciplinary Perspectives on Complex Systems', year: 2017 },
      { id: 5, authors: 'Coello Coello, C. A. et al.', title: 'Handling Multiple Objectives with Particle Swarm Optimization', venue: 'IEEE Transactions on Evolutionary Computation', year: 2004 },
      { id: 6, authors: 'Tao, F. et al.', title: 'Digital Twin in Industry: State-of-the-Art', venue: 'IEEE Transactions on Industrial Informatics', year: 2019 },
      { id: 7, authors: 'Yao, S. et al.', title: 'ReAct: Synergizing Reasoning and Acting in Language Models', venue: 'ICLR', year: 2023 },
      { id: 8, authors: 'Chase, H.', title: 'LangChain: Building applications with LLMs through composability', venue: 'GitHub', year: 2022 },
      { id: 9, authors: 'Gamma, E. et al.', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', venue: 'Addison-Wesley', year: 1994 },
      { id: 10, authors: 'Alexander, C.', title: 'A Pattern Language: Towns, Buildings, Construction', venue: 'Oxford University Press', year: 1977 },
      { id: 11, authors: 'Wang, L. et al.', title: 'A Survey on Large Language Model based Autonomous Agents', venue: 'arXiv preprint', year: 2023 },
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
      date: '2026-03-29',
      tags: ['LangGraph', 'MCP', 'RAG', 'Agentic AI', 'PostgreSQL', 'Formal Methods'],
      readingTime: '12 min read',
      abstract:
        'We formalize an agentic workflow system as a directed graph with persistent state, typed MCP tool contracts, and layered retrieval functions. The architecture provides formal guarantees: context isolation (the LLM never observes sensitive data), action boundary enforcement (all agent actions are typed, logged tool invocations), and retrieval scoping (user document indices are session-partitioned with zero cross-contamination). We prove these properties hold by construction and describe a production implementation for enterprise document workflows.',
      status: 'published',
    },
    references: [
      { id: 1, authors: 'Yao, S. et al.', title: 'ReAct: Synergizing Reasoning and Acting in Language Models', venue: 'ICLR', year: 2023 },
      { id: 2, authors: 'Schick, T. et al.', title: 'Toolformer: Language Models Can Teach Themselves to Use Tools', venue: 'NeurIPS', year: 2023 },
      { id: 3, authors: 'Wang, L. et al.', title: 'A Survey on Large Language Model based Autonomous Agents', venue: 'arXiv preprint', year: 2023 },
      { id: 4, authors: 'Wu, Q. et al.', title: 'AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation', venue: 'arXiv preprint', year: 2023 },
      { id: 5, authors: 'Anthropic', title: 'Model Context Protocol Specification', venue: 'modelcontextprotocol.io', year: 2024 },
      { id: 6, authors: 'Chase, H.', title: 'LangGraph: Multi-Actor Applications with LLMs', venue: 'LangChain, Inc.', year: 2024 },
      { id: 7, authors: 'Lewis, P. et al.', title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', venue: 'NeurIPS', year: 2020 },
      { id: 8, authors: 'Guu, K. et al.', title: 'REALM: Retrieval-Augmented Language Model Pre-Training', venue: 'ICML', year: 2020 },
      { id: 9, authors: 'Reimers, N. & Gurevych, I.', title: 'Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks', venue: 'EMNLP', year: 2019 },
      { id: 10, authors: 'Li, H. et al.', title: 'Privacy in Large Language Models: Attacks, Defenses and Future Directions', venue: 'arXiv preprint', year: 2023 },
      { id: 11, authors: 'Patil, S. et al.', title: 'Gorilla: Large Language Model Connected with Massive APIs', venue: 'arXiv preprint', year: 2023 },
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
];
