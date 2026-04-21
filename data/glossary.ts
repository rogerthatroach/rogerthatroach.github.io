/**
 * Inline hover glossary for the /resume baseline story view.
 *
 * Terms appearing in role transition stories / team context / project
 * one-liners that benefit from a one-click expansion. The auto-wrapper
 * (`components/resume/story/Glossed.tsx`) matches terms in prose and
 * wraps them in a HoverTerm popover.
 *
 * Guidelines:
 * - Keep detail to ~1–2 sentences — the popover isn't a whole case
 *   study; it's a micro-context hand-off.
 * - Don't duplicate text that's already visible nearby.
 * - Longest matches win (regex sorts terms by length desc).
 */

export const GLOSSARY: Record<string, string> = {
  // ── Products / systems ──
  'AI/LLM Drafting Platform':
    'Enterprise-wide agentic AI platform guiding project funding request drafting. Bank-wide pilot launched April 2026; rollout through Q2/Q3 2026.',
  WorkforceAnalytics:
    'Production analytics platform for CFO Group — millisecond slicing across ~40K transits. GPT for intent routing only; deterministic agents handle all computation.',
  'FinancialBenchmarking v1':
    'Canadian Supplementary Benchmarking engine for peer-bank KPI comparisons (Big 6). Productionized 2024. 2025 CFO One RBC Team Award.',
  'FinancialBenchmarking v2':
    'Concurrent 2-week refactor of v1 — text-to-SQL first with KPI disambiguation. Done alongside AI/LLM Drafting Platform + WorkforceAnalytics work; not an independent delivery.',
  'Commodity Tax':
    '~$250M GST + ~$350M PVAT allocated across the bank. Processing time slashed from months to 90 minutes. Q4 2023 CFO Group Quarterly Team Award.',
  'EDS Automation':
    'PAR actual-vs-planned financial comparison system using a dynamic RAG over finance documents. Widely adopted across the finance team.',

  // ── Programs ──
  'Amplify program':
    'RBC internal innovation program. I led Amplify 2025 end-to-end: 4 interns across AI/LLM Drafting Platform and adjacent projects. The program is what converted the intern PAR POC into a bank-wide initiative.',
  'Amplify 2025':
    'The 2025 cohort of RBC\'s Amplify internship program — 4 interns, led end-to-end. Career guidance → requirement gathering → problem scoping → solution design → implementation → presentation.',

  // ── Organizations ──
  GFT: 'Global Functions Technology — RBC-internal tech arm. I lead cross-functional GFT senior + junior peers on WorkforceAnalytics delivery.',
  'CFO Group':
    'Chief Financial Officer\'s Group at RBC — the enterprise finance organization. My home org since joining RBC in 2022.',
  'CFO One RBC Team Award':
    'RBC enterprise-level recognition for LLM/AI impact. Received 2025 for FinancialBenchmarking v1 productionization.',

  // ── Clients / client systems ──
  Humana:
    'Healthcare client at Quantiphi. I built the hybrid document understanding pipeline (Document AI OCR + OpenCV pixel-level checkbox detection + Random Forest classification) that lifted accuracy from ~70% baseline to 99.95%.',
  'Chick-fil-A':
    'US-wide retail client at Quantiphi. Multi-million-row inventory analytics with SQL + Tableau — self-serve intelligence in the tool operators already used.',
  MHPS: 'Mitsubishi Hitachi Power Systems — Japanese energy client for the Maizuru 900MW combustion tuning digital twin at TCS.',
  'Maizuru 900MW':
    '900MW coal power plant in Maizuru, Japan. Client-side beneficiary of the TCS digital twin — closed-loop optimization reduced NOx/SOx/CO emissions and saved $3M/year.',
  Maizuru:
    'Maizuru, Japan — 900MW coal power plant, site of the TCS combustion tuning digital twin project.',

  // ── Education ──
  'Georgian College':
    'Post-Graduate Certificate in Big Data Analytics (Barrie, Ontario). Jan–Aug 2021 — the bridge from TCS / India into the Canadian ML market.',
  Thapar:
    'Thapar University, Patiala — B.Eng in Electronics & Communications Engineering (2012–2016). The pre-ML engineering foundation.',

  // ── Technical concepts ──
  LangGraph:
    'Graph-based LLM orchestration library. Chosen for AI/LLM Drafting Platform over plain LangChain chains because PAR workflows branch conditionally (template selection → field assignment → conflict resolution loops back).',
  MCP: 'Model Context Protocol — emerging standard for exposing tools to LLM agents. AI/LLM Drafting Platform uses MCP for template selection, field assignment, conflict resolution, ambiguity detection.',
  pgvector:
    'PostgreSQL vector-similarity extension. AI/LLM Drafting Platform uses it alongside relational PAR metadata so embeddings stay co-located with the data they describe.',
  'approved foundation model':
    'An approved pretrained foundation model accessed through internal model endpoints.',
  PSO: 'Particle Swarm Optimization — metaheuristic for non-convex high-dimensional objective landscapes without clean analytical gradients. Used at TCS for closed-loop boiler control.',
  'closed-loop':
    'Sense → model → optimize → act. The pattern that repeats across every role in my career, at progressively higher abstraction levels.',
};
