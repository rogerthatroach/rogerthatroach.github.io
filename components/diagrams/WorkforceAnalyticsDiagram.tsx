'use client';

/**
 * WorkforceAnalytics architecture diagram — used on /projects/workforceAnalytics.
 *
 * Single source of truth: re-exports the "Cascade" diagram built for
 * the formal blog post (`components/blog/diagrams/WorkforceAnalyticsCascade.tsx`).
 * The case study and the blog post render exactly the same architecture
 * visual — any drift is a bug, not a feature. Matches the PAR pattern
 * where FundingRequestDiagram re-exports AgenticArchitecturePAR.
 */

export { default } from '@/components/blog/diagrams/WorkforceAnalyticsCascade';
