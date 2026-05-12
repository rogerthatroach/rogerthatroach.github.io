'use client';

/**
 * FinancialBenchmarking architecture diagram — used on /projects/financialBenchmarking.
 *
 * Single source of truth: re-exports the "Cascade" diagram built for
 * the formal blog post (`components/blog/diagrams/FinancialBenchmarkingCascade.tsx`).
 * The case study and the blog post render exactly the same architecture
 * visual — any drift is a bug, not a feature. Matches the WorkforceAnalytics +
 * AI/LLM Drafting Platform pattern.
 */

export { default } from '@/components/blog/diagrams/FinancialBenchmarkingCascade';
