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
  'PAR Assist':
    'The first true agentic AI platform approved for production at the bank, guiding Project Approval Request (PAR) drafting. Pilot launched April 2026; full CFO Group launch across all geographies followed in May 2026.',
  'Astraeus':
    'Production analytics platform for RBC CFO Group across ~40K leaf-level cost centres. LLM calls handle scoped intent and answer-shaping stages; entitlement and event-level ins-outs computation run in Cython-compiled Python behind typed, validated boundaries.',
  'Aegis':
    'Strategic peer-benchmarking engine over Big 6 Canadian banks\' Supplementary Financial Packages. v1 (Sr DS period): solo end-to-end build that automated extraction and matching despite quarterly SFP schema shifts, the long-standing bottleneck blocking timely peer analysis. v2 (Lead, 2025): 2-week concurrent refactor of the v1 benchmarking module into multi-stage RAG with multi-gate query parsing across bank / parameter / platform / time-period plus text-to-SQL, run in parallel with Astraeus and the Amplify intern program; integrated and productionalized by my direct report with the broader team. 2025 CFO One RBC Team Award for v1.',
  'Commodity Tax':
    '~$600M tax allocation per cycle. Processing time slashed from months to 90 minutes. Q4 2023 CFO Group RBC Quarterly Team Award.',
  'EDS Automation':
    'PAR actual-vs-planned automation built for RBC\'s Enterprise Decision Support team (2022–2023). Custom Python pipeline scheduled in Dataiku, Tableau dashboards for business consumption. Widely adopted across the finance team.',

  // ── Programs ──
  'summer intern program':
    'RBC Amplify internship program. I led the 2025 cohort end-to-end: 4 interns across PAR drafting and adjacent projects. The PAR Assist concept was my vision, given to the interns as an ideation exercise to explore the problem space; the production platform was conceived, architected, and built end-to-end thereafter.',

  // ── Organizations ──
  'engineering services partner': 'Cross-functional engineering peers — senior + junior — on Astraeus delivery.',
  'CFO Group':
    'Chief Financial Officer\'s Group at RBC — the enterprise finance organization. My home org since joining RBC in 2022.',
  'CFO One RBC Team Award':
    'RBC enterprise-level recognition for LLM/AI impact. Received 2025 for Aegis v1 productionization.',

  // ── Clients / client systems ──
  Humana:
    'Healthcare client at Quantiphi. I built a hybrid document understanding pipeline (Document AI OCR + OpenCV pixel-level checkbox detection + Random Forest classification); its checkbox-detection component improved from a ~70% Document AI-only baseline to 99.95%.',
  'Chick-fil-A':
    'US-wide retail client at Quantiphi. Multi-million-row inventory analytics with SQL + Tableau — self-serve intelligence in the tool operators already used.',
  MHPS: 'Mitsubishi Hitachi Power Systems — engineering and equipment partner for the combustion-tuning project on one 900MW unit at Maizuru; Kansai Electric owns and operates the station.',
  'Maizuru 900MW':
    'One 900MW generating unit at Kansai Electric’s 1,800MW Maizuru coal-fired power station in Japan. Site of the TCS combustion-tuning system, which generated operator-reviewed recommendations and delivered $3M/year in savings.',
  Maizuru:
    'Kansai Electric’s 1,800MW coal-fired power station in Maizuru, Japan. The TCS combustion-tuning digital twin project focused on one 900MW generating unit.',

  // ── Education ──
  'Georgian College':
    'Post-Graduate Certificate in Big Data Analytics (Barrie, Ontario). Jan–Aug 2021 — the bridge from TCS / India into the Canadian ML market.',
  Thapar:
    'Thapar University, Patiala — B.Eng in Electronics & Communications Engineering (2012–2016). The pre-ML engineering foundation.',

  // ── Technical concepts ──
  LangGraph:
    'Graph-based LLM orchestration library. Picked for PAR Assist after evaluation for its maturity and fit with a conditional-branching workflow — template selection → field-group retrieval → extraction → coverage loops back on open follow-ups.',
  MCP: 'Model Context Protocol — a protocol for connecting model applications to tools and context through defined interfaces. PAR Assist routes its core workflow actions through typed MCP tools and records structured dispatch metadata for review.',
  pgvector:
    'PostgreSQL vector-similarity extension. It supports PAR Assist\'s vector-backed retrieval alongside retained workflow state and structured trace records.',
  'field-group retrieval':
    'PAR Assist\'s two-stage retrieval pattern. Stage 1 picks which logically related field groups are relevant to the session. Stage 2 retrieves a bounded candidate set within each group, then compression fits each group-scoped extraction payload to its context budget.',
  'single-agent envelope':
    'The governance constraint behind PAR Assist v1 — the first true agentic AI platform approved for production at the bank. One agent, one scope, no multi-agent orchestration. Bounded concurrent group-scoped extraction calls provide specialized work through deterministic graph orchestration + MCP tools, inside the single-agent envelope.',
  'cost centre':
    'The most granular unit in Astraeus\'s org model — one cost centre represents one or more teams (~40K in total). Cost centres are the shared leaves of an 18-level business-segment hierarchy with ~9K rollups and a separate geography hierarchy. Employee events and headcount net over those leaves in Cython-compiled ins-outs math.',
  PSO: 'Particle Swarm Optimization — metaheuristic for non-convex high-dimensional objective landscapes without clean analytical gradients. Used at TCS to generate operator-reviewed boiler-tuning recommendations.',
  'closed-loop':
    'Observe → estimate → choose → act. A bounded set of design questions that can help compare systems across domains, not a claim that they share control-system guarantees.',
};
