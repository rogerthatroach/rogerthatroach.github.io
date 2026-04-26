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
  'PAR Drafting Assistant':
    'Enterprise-wide agentic AI platform guiding Project Approval Request (PAR) drafting at RBC. Bank-wide pilot launched April 2026; rollout through Q2/Q3 2026. (Internally: "PAR Assist".)',
  'CFO Analytics Engine':
    'Production analytics platform for RBC CFO Group — millisecond slicing across ~40K leaf-level events with event-level ins-outs math (Cython-compiled). GPT-4.1 used only for parse / route / metadata extraction / synthesis; deterministic code handles all data access. LLM never touches operational data by construction. (Internally: "Astraeus".)',
  'Benchmarking Engine':
    'Canadian Supplementary Benchmarking engine for peer-bank KPI comparisons (Big 6). v1 productionized 2024 (rules-based). v2 (2025) is a concurrent 2-week refactor — text-to-SQL first with KPI disambiguation, done alongside PAR + CFO Analytics work. 2025 CFO One RBC Team Award. (Internally: "Aegis v1 / v2".)',
  'Commodity Tax':
    '~$250M GST + ~$350M PVAT allocated across the bank. Processing time slashed from months to 90 minutes. Q4 2023 CFO Group Quarterly Team Award.',
  'External Data Service automation':
    'Actual-vs-planned financial comparison system using a dynamic RAG over finance documents. Widely adopted across the finance team. (Internally: "EDS Automation".)',

  // ── Programs ──
  'summer intern program':
    'RBC internal innovation / intern program. I led the 2025 cohort end-to-end: 4 interns across PAR drafting and adjacent projects. The program is what converted the intern PAR POC into a bank-wide initiative.',

  // ── Organizations ──
  'engineering services partner': 'Cross-functional engineering peers — senior + junior — on the CFO Analytics Engine delivery.',
  'CFO Group':
    'Chief Financial Officer\'s Group at RBC — the enterprise finance organization. My home org since joining RBC in 2022.',
  'CFO One RBC Team Award':
    'RBC enterprise-level recognition for LLM/AI impact. Received 2025 for the Benchmarking Engine v1 productionization.',

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
    'Graph-based LLM orchestration library. Picked for the PAR drafting assistant for maturity (most stable orchestrator at evaluation time) and because PAR drafting is a conditional-branching workflow — template selection → field-group retrieval → extraction → coverage loops back on open follow-ups.',
  MCP: 'Model Context Protocol — emerging standard for typed, logged tool contracts. In the PAR drafting assistant every action (template selection, retrieval, compression, extraction, merge, coverage) is an MCP tool dispatched through the graph engine, so auditability is structural, not aspirational.',
  pgvector:
    'PostgreSQL vector-similarity extension. The PAR drafting assistant uses pgvector alongside LangGraph checkpoints + logs + raw/mapped content + audit trail — one Postgres store holds every layer of the session, so the full provenance for any draft is one query away.',
  'field-group retrieval':
    'The PAR drafting assistant\'s two-stage retrieval pattern. Stage 1 picks which logically-related field groups are relevant to the session. Stage 2 runs similarity search within each group for top-10 chunks, then custom compression fits them into a Sonnet-4.5 prompt with up to 20 fields of rich metadata per call.',
  'single-agent envelope':
    'The governance constraint behind the PAR drafting assistant v1 — the first agentic framework approved for production at the bank. One agent, one scope, no multi-agent orchestration. We got multi-agent *behaviour* (N parallel group-scoped extraction calls) through deterministic graph orchestration + MCP tools, inside the single-agent envelope.',
  'GPT-4.1':
    'The model used in the CFO Analytics Engine for all LLM calls (parse, route, metadata extract, synthesis). Chosen for reliability + reasoning at intent-layer scale. Never sees operational data — that lives below the two entitlement + compute walls.',
  event:
    'Leaf-level routing record in the CFO Analytics Engine — the atomic unit the entitlement cascade resolves down to (~40K of them). Event-level ins-outs math (in/out transitions through cost-centre or organizational rollups) is what makes the cross-domain factorial space tractable in milliseconds. (Internally: "transit".)',
  PSO: 'Particle Swarm Optimization — metaheuristic for non-convex high-dimensional objective landscapes without clean analytical gradients. Used at TCS for closed-loop boiler control.',
  'closed-loop':
    'Sense → model → optimize → act. The pattern that repeats across every role in my career, at progressively higher abstraction levels.',
};
