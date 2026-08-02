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
 *   1. PAR Assist — pilot launched April 2026; full CFO Group launch across all geographies May 2026
 *   2. Astraeus   — production since Nov 2025
 *   3. Aegis      — v1 shipped, v2 is a concurrent 2-week refactor of v1 (one product, two revisions)
 *
 * Aegis v1 and its two-week v2 refactor count as one product, not two.
 */
export const PRODUCTION_SYSTEMS_COUNT = 3;

// ═══════════════════════════════════════════════════════════════════
// CAREER SPAN — DERIVED from stint dates (auto-updates per build)
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
 * Total professional years of experience as a float, summed across all
 * stints. Ongoing stints (no `end`) use `asOf` (default: now).
 *
 * Pure function — exported so tests can pass arbitrary `asOf` dates.
 */
export function computeYearsExperience(asOf: Date = new Date()): number {
  return CAREER_STINTS.reduce((total, stint) => {
    const end = stint.end ?? asOf;
    return total + (end.getTime() - stint.start.getTime()) / MS_PER_YEAR;
  }, 0);
}

/**
 * Format raw years as a display string. Uses "N+" with N = floor(value) — the
 * at-least-N convention (e.g. "8+ years"), which also mirrors the "8+ years"
 * bar common in job descriptions. Past an integer the value reads as that
 * integer "+", and advances to "9+" only once a full ninth year completes.
 * Honest because the count is genuinely past N; re-evaluated per build.
 */
export function formatYearsExperience(years: number = computeYearsExperience()): string {
  return `${Math.floor(years)}+`;
}

/** Display string. Re-evaluated at module load (build time for static export). */
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

/** Duration of the concurrent Aegis v1-to-v2 refactor. */
export const AEGIS_V2_BUILD_TIME = '2 weeks';

/**
 * Astraeus domain model.
 *
 * The CFO Group's workforce is modelled as ~40,000 COST CENTRES: the most
 * granular org unit (one cost centre = one or more teams). Cost centres are
 * the shared leaves of TWO hierarchies that roll the same leaves up two ways:
 *   - business-segment hierarchy: 18 levels, ~9,000 rollup nodes
 *   - geographical hierarchy
 * A query names one node in each (e.g. Wealth Management × US); Astraeus
 * intersects them down to the cost-centre leaves, retrieves from Postgres,
 * and aggregates. It answers HR compensation costs (actual vs planned),
 * headcount over time, and employee events (hires, departures, promotions,
 * demotions, lateral moves) across supported, authorized hierarchy scopes.
 */
export const ASTRAEUS_COST_CENTRES = '~40,000';

/** Rollup nodes in the 18-level business-segment hierarchy, above the leaf cost centres. */
export const ASTRAEUS_ROLLUPS = '~9,000';

/** PAR Assist pilot launched April 2026; full CFO Group launch across all geographies May 2026. */
export const PAR_ASSIST_SCALE = 'Full CFO Group';

// ═══════════════════════════════════════════════════════════════════
// TEAM
// ═══════════════════════════════════════════════════════════════════

export const HANDS_ON_PCT = '~70%';
export const INTERNS_TOTAL = 9;
export const INTERNS_JOINED_MAY_2026 = 2;
