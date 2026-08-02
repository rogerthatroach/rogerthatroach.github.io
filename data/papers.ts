/**
 * Long-form work. Draft entries are explicitly non-citable working notes;
 * published entries may add a versioned PDF and citation metadata.
 */

import { YEARS_EXPERIENCE } from './canonical';

export interface Paper {
  slug: string;
  title: string;
  subtitle?: string;
  abstract: string;
  year: number;
  /** Page count of the published PDF. Never estimate this for drafts. */
  pages?: number;
  /** ISO date when work on a draft started. */
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
    abstract: `Most AI-adoption writing is framed from the builder side — frameworks, benchmarks, and tool choices. This working note is written from inside a bank CFO function: what the constraints actually look like, how decisions get made, which lessons transfer from industrial ML and cloud ML, and where regulated-finance AI diverges. The goal is to hand a useful map to the AI leader joining a bank, and a useful vocabulary to the bank leader hiring one. Across ${YEARS_EXPERIENCE} years, four recurring questions — observe, estimate, choose, act — provide a bounded design heuristic, not a claim that objectives or guarantees transfer between physical, cloud, financial, and agentic systems. No proprietary code or data; patterns only.`,
    year: 2026,
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
      '§3 · The heuristic — observe, estimate, choose, act across four substrates',
      '§4 · The architecture choices — LangGraph, MCP, multi-layer RAG, and why',
      '§5 · The decision layer — options considered, tradeoffs, rationale',
      '§6 · The stakeholder layer — earning trust in regulated finance',
      '§7 · The failure modes — where this breaks, and what to watch',
      '§8 · What transfers — and what remains domain-specific',
      'References · Citations · Further reading',
    ],
    related: [
      {
        title: 'Enterprise Agentic AI Architecture (formal post)',
        url: '/blog/enterprise-agentic-ai-architecture',
        note: 'The formal companion: graph theory + MCP tool contracts.',
      },
      {
        title: 'Closed-loop thinking as a cross-domain design heuristic',
        url: '/blog/closed-loop',
        note: 'The bounded four-question comparison this paper builds on.',
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
