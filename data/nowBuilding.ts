export interface NowItem {
  lead: string;
  body: string;
  // ISO date. After this point the item is likely stale and should be refreshed.
  staleAfter: string;
}

export const NOW_BUILDING: NowItem[] = [
  {
    lead: 'Shipping PAR Assist.',
    body: 'An enterprise-wide agentic AI platform that transforms how RBC drafts project approvals across the bank. LangGraph orchestration, MCP tools, multi-layer RAG. Going live April 2026.',
    staleAfter: '2026-04-17',
  },
  {
    lead: 'Scaling Astraeus to new CFO data domains.',
    body: 'Extending millisecond-level financial analytics beyond headcount into Income Statement, Balance Sheet, and Daily Financial Reporting.',
    staleAfter: '2026-06-30',
  },
  {
    lead: 'Growing the team.',
    body: "Two new interns joining May 2026, continuing the pipeline that turned an intern\u2019s idea into a bank-wide production system.",
    staleAfter: '2026-05-31',
  },
];
