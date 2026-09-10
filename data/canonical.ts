/** Shared display values used across portfolio surfaces. */

import { AWARDS } from './awards';

// ═══════════════════════════════════════════════════════════════════
// Values derived from structured portfolio data.
// ═══════════════════════════════════════════════════════════════════

export const AWARDS_COUNT = AWARDS.length;

// ═══════════════════════════════════════════════════════════════════
// CURATED COUNTS (flat — not structurally derivable)
// ═══════════════════════════════════════════════════════════════════

/**
 * RBC production AI systems (3).
 *
 *   1. AI/LLM Drafting Platform — pilot launched April 2026; full CFO Group launch across all geographies May 2026
 *   2. AI/LLM Workforce Analytics Platform — built Mar–Nov 2025; production since Nov 2025
 *   3. Financial Peer Benchmarking Platform — v1 shipped, v2 is a concurrent 2-week refactor of v1 (one product, two revisions)
 *
 * The peer benchmarking v1 and its two-week v2 refactor count as one product,
 * not two.
 */
export const PRODUCTION_SYSTEMS_COUNT = 3;

// ═══════════════════════════════════════════════════════════════════
// CAREER SPAN — DERIVED from stint dates at an explicit publication date
// ═══════════════════════════════════════════════════════════════════

interface CareerStint {
  org: string;
  /** First day of the role (inclusive). */
  start: Date;
  /** Last day of the role (inclusive). Undefined = ongoing as of now. */
  end?: Date;
}

/**
 * Career ranges used to derive the years-of-experience display.
 *
 * Excludes the 2019-09 → 2021-08 gap (Georgian College post-grad +
 * Canada relocation) so the total reflects professional ML work, not
 * calendar elapsed since first job.
 */
const CAREER_STINTS: CareerStint[] = [
  { org: 'TCS',       start: new Date('2016-08-15'), end: new Date('2019-11-30') }, // ~3.3y
  { org: 'Quantiphi', start: new Date('2021-10-01'), end: new Date('2022-09-30') }, // ~1.0y
  { org: 'RBC',       start: new Date('2022-09-15') },                              // ongoing (Sr DS Sep 2022, Lead Apr 2025)
];

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

/**
 * Date through which the public career facts have been reviewed. Keeping this
 * explicit makes identical source produce identical exports; advance it only
 * as part of a factual review.
 */
export const PUBLIC_AS_OF_DATE = '2026-08-30';
const PUBLIC_AS_OF = new Date(`${PUBLIC_AS_OF_DATE}T00:00:00.000Z`);

/**
 * Total professional years of experience as a float, summed across all
 * stints. Ongoing stints (no `end`) use `asOf` (default: the reviewed public
 * as-of date above).
 *
 * Pure function — exported so tests can pass arbitrary `asOf` dates.
 */
export function computeYearsExperience(asOf: Date = PUBLIC_AS_OF): number {
  return CAREER_STINTS.reduce((total, stint) => {
    const end = stint.end ?? asOf;
    return total + (end.getTime() - stint.start.getTime()) / MS_PER_YEAR;
  }, 0);
}

/**
 * Format raw years as a display string. Uses "N+" with N = floor(value) — the
 * at-least-N convention (e.g. "8+ years"), which also mirrors the "8+ years"
 * bar common in job descriptions. Past an integer the value reads as that
 * integer "+". The public display advances only after the as-of date is
 * deliberately reviewed and updated.
 */
export function formatYearsExperience(years: number = computeYearsExperience()): string {
  return `${Math.floor(years)}+`;
}

/** Display string derived deterministically from the reviewed public date. */
export const YEARS_EXPERIENCE = formatYearsExperience();

/**
 * Raw float — for animation/comparison consumers (e.g., MetricsRibbon
 * AnimatedCounter). Display strings should use `YEARS_EXPERIENCE` instead.
 */
export const YEARS_EXPERIENCE_NUMERIC = computeYearsExperience();

// ═══════════════════════════════════════════════════════════════════
// PROJECT HERO METRICS (discrete, display-oriented)
// ═══════════════════════════════════════════════════════════════════

export const DIGITAL_TWIN_SAVINGS = '$3M';
export const DIGITAL_TWIN_MODELS = '84 models';
export const DIGITAL_TWIN_SENSORS = '90+ sensors';

/** Accuracy of the Humana checkbox-detection component, not the full document pipeline. */
export const HUMANA_ACCURACY = '99.95%';
/** Document AI-only baseline for that same checkbox-detection task. */
export const HUMANA_BASELINE_ACCURACY = '~70%';

export const COMMODITY_TAX_EFFICIENCY = 'Months → 90 min';
/** Compact form for 3-slot displays (Hero NUMBER_SEQUENCE) */
export const COMMODITY_TAX_EFFICIENCY_COMPACT = '90 min';

/** Duration of the concurrent peer benchmarking v1-to-v2 refactor. */
export const FINANCIAL_BENCHMARKING_V2_BUILD_TIME = '2 weeks';

/** Public functional name for the peer benchmarking product. */
export const FINANCIAL_BENCHMARKING_NAME = 'Financial Peer Benchmarking Platform';

/** Public functional name for the drafting platform. */
export const DRAFTING_PLATFORM_NAME = 'AI/LLM Drafting Platform';

/** Public functional name and reviewed delivery dates for workforce analytics. */
export const WORKFORCE_ANALYTICS_NAME = 'AI/LLM Workforce Analytics Platform';
export const WORKFORCE_ANALYTICS_BUILD_WINDOW = 'Mar → Nov 2025';
export const WORKFORCE_ANALYTICS_BUILD_WINDOW_LONG = 'March–November 2025';
export const WORKFORCE_ANALYTICS_PRODUCTION_LAUNCH = 'November 2025';

/**
 * AI/LLM workforce analytics domain model.
 *
 * The CFO Group's workforce is modelled as ~40,000 COST CENTRES: the most
 * granular org unit (one cost centre = one or more teams). Cost centres are
 * the shared leaves of TWO hierarchies that roll the same leaves up two ways:
 *   - business-segment hierarchy: 18 levels, ~9,000 rollup nodes
 *   - geographical hierarchy
 * A query names one node in each (e.g. Wealth Management × US); the platform
 * intersects them down to the cost-centre leaves, retrieves from Postgres,
 * and aggregates. It answers compensation cost, headcount, and open position
 * questions across supported, authorized hierarchy scopes.
 */
export const WORKFORCE_ANALYTICS_COST_CENTRES = '~40,000';

/** Rollup nodes in the 18-level business-segment hierarchy, above the leaf cost centres. */
export const WORKFORCE_ANALYTICS_ROLLUPS = '~9,000';

/** Drafting-platform pilot launched April 2026; full CFO Group launch across all geographies May 2026. */
export const PROJECT_APPROVAL_DRAFTING_SCALE = 'Full CFO Group';

// ═══════════════════════════════════════════════════════════════════
// TEAM
// ═══════════════════════════════════════════════════════════════════

export const HANDS_ON_PCT = '~70%';
export const INTERNS_TOTAL = 9;
export const INTERNS_JOINED_MAY_2026 = 2;
