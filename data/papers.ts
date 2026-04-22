/**
 * Long-form citable artifacts — the audit's P3-4 recommendation.
 * These sit at /papers/[slug] with a landing page and a downloadable
 * PDF at /papers/[slug].pdf.
 *
 * Content-authoring workflow: user drafts the long-form piece, we
 * generate the PDF, drop it in public/papers/, and add an entry here.
 * Status 'draft' → index shows 'Coming {month}'; 'published' → live.
 */

export interface Paper {
  slug: string;
  title: string;
  subtitle?: string;
  abstract: string;
  year: number;
  /** Estimated page count (for display). */
  pages: number;
  /** ISO date when draft started (shows 'Coming {month}' on listing). */
  draftStarted?: string;
  /** ISO date of publication. Required for `published` status. */
  publishedAt?: string;
  status: 'draft' | 'published';
  /** Key topics for discoverability. */
  topics: string[];
  /**
   * Table of contents — rendered on the landing page so readers
   * understand the structure before downloading.
   */
  toc: string[];
  /** Related blog posts / case studies. Cross-link for depth. */
  related?: Array<{ title: string; url: string; note?: string }>;
  /**
   * BibTeX author name — how it should appear in the citation block.
   * Defaults to 'Dhaliwal, Harmilap Singh'.
   */
  bibtexAuthor?: string;
}

export const PAPERS: Paper[] = [
  {
    slug: 'ai-operating-model-cfo',
    title: 'An operating model for AI inside a bank CFO function',
    subtitle:
      'Patterns, constraints, and decisions for building agentic AI inside a regulated financial function.',
    abstract:
      'Most AI-adoption writing is framed from the builder side — frameworks, benchmarks, and tool choices. This paper is written from inside a bank CFO function: what the constraints actually look like, how decisions get made, which patterns transfer from industrial ML and cloud ML, and where regulated-finance AI diverges. The goal is to hand a useful map to the AI leader joining a bank, and a useful vocabulary to the bank leader hiring one. Eight years of pattern — sense, model, optimize, act — applied to physical, cloud, financial, and agentic substrates, with the last substrate worked out in detail. No proprietary code or data; patterns only.',
    year: 2026,
    pages: 12,
    draftStarted: '2026-04-22',
    status: 'draft',
    topics: [
      'Agentic AI',
      'Enterprise finance',
      'CFO function',
      'Regulated AI',
      'LangGraph',
      'MCP',
      'Multi-layer RAG',
      'Decision-making',
      'Stakeholder trust',
    ],
    toc: [
      '§1 · The seat — what a CFO-function AI lead actually sees',
      '§2 · The operating constraints — regulatory, data, and institutional',
      '§3 · The pattern — sense, model, optimize, act across four substrates',
      '§4 · The architecture choices — LangGraph, MCP, multi-layer RAG, and why',
      '§5 · The decision layer — options considered, tradeoffs, rationale',
      '§6 · The stakeholder layer — earning trust in regulated finance',
      '§7 · The failure modes — where this breaks, and what to watch',
      '§8 · The pattern, generalised — transferable lessons to adjacent substrates',
      'References · Citations · Further reading',
    ],
    related: [
      {
        title: 'Enterprise Agentic AI Architecture (formal post)',
        url: '/blog/enterprise-agentic-ai-architecture',
        note: 'The formal companion: graph theory + MCP tool contracts.',
      },
      {
        title: 'Closed-loop optimization as a unifying pattern',
        url: '/blog/closed-loop',
        note: 'The four-substrate pattern this paper builds on.',
      },
      {
        title: 'Commodity Tax — how the CFO Group came to trust AI',
        url: '/blog/commodity-tax-cfo-trust-framework',
        note: 'The stakeholder-trust ground game the paper codifies.',
      },
    ],
  },
];

export function isPaperPublic(p: Paper): boolean {
  return p.status === 'published';
}
