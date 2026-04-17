export interface NowItem {
  lead: string;
  body: string;
  // ISO date of last meaningful edit. Build-time warning fires if >60 days old.
  updatedAt: string;
}

export const NOW_BUILDING: NowItem[] = [
  {
    lead: 'Rolling out PAR Assist.',
    body: 'Shipped April 2026 as a bank-wide agentic AI platform. Now driving adoption across departments and iterating on enterprise feedback. LangGraph orchestration, MCP tools, multi-layer RAG.',
    updatedAt: '2026-04-17',
  },
  {
    lead: 'Scaling Astraeus to new CFO data domains.',
    body: 'Extending millisecond-level financial analytics beyond headcount into Income Statement, Balance Sheet, and Daily Financial Reporting.',
    updatedAt: '2026-03-30',
  },
  {
    lead: 'Growing the team.',
    body: "Two new interns joining May 2026, continuing the pipeline that turned an intern\u2019s idea into a bank-wide production system.",
    updatedAt: '2026-04-17',
  },
];

// Build-time staleness check. Fires a console warning during production
// builds if any item hasn't been touched in >60 days. No runtime cost.
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
  const THRESHOLD_DAYS = 60;
  const threshold = Date.now() - THRESHOLD_DAYS * 24 * 60 * 60 * 1000;
  for (const item of NOW_BUILDING) {
    if (new Date(item.updatedAt).getTime() < threshold) {
      // eslint-disable-next-line no-console
      console.warn(
        `[NOW_BUILDING] Stale: "${item.lead}" (updatedAt ${item.updatedAt}, >${THRESHOLD_DAYS}d old). Refresh or remove.`,
      );
    }
  }
}
