/**
 * Single source of truth for canonical portfolio facts.
 *
 * DERIVED: counts computed from structural data.
 * FLAT CONSTANTS: irreducible claims sourced from CAREER_KNOWLEDGE_BASE.md
 * and PORTFOLIO_V2_HANDOVER_FINAL.md §9.
 *
 * OUT OF SCOPE:
 *   - MDX blog posts (data/posts/*.mdx) hardcode metrics at publication
 *     time. They are time-stamped artifacts, not live claims — do not
 *     import canonical values in MDX.
 *   - Case study narrative prose (data/projectCaseStudies.ts sections.*).
 *     Prose is authored voice. Discrete display fields only (heroMetric,
 *     milestone, hero summary strings) flow through canonical.
 *
 * RULE when adding a new fact:
 *   1. Derivable from structure? → compute it (e.g. AWARDS.length).
 *   2. Curated claim? → flat constant with an inline comment sourcing it.
 *   3. Prose? → stays where it's written, not here.
 */

import { AWARDS } from './awards';

// ═══════════════════════════════════════════════════════════════════
// DERIVED (drift is structurally impossible — the source is the data)
// ═══════════════════════════════════════════════════════════════════

export const AWARDS_COUNT = AWARDS.length;

// ═══════════════════════════════════════════════════════════════════
// CURATED COUNTS (flat — not structurally derivable)
// ═══════════════════════════════════════════════════════════════════

/**
 * RBC production AI systems (3). Surface names match the resume
 * (per 2026-05-12 portfolio↔resume sync — reverted the Session 14
 * "Prometheus" codename for the agentic platform back to PAR Assist
 * so the portfolio reads the same as the resume).
 *
 *   1. PAR Assist — pilot launched April 2026; enterprise rollout in progress
 *   2. Astraeus   — production since Nov 2025
 *   3. Aegis      — v1 shipped, v2 is a concurrent 2-week refactor of v1 (one product, two revisions)
 *
 * Per 2026-04-21 audit: do NOT present the v2 refactor as an independent 4th product.
 * v2 was a 2-week focused refactor of v1 done alongside PAR Assist + Astraeus work.
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
 * Source of truth for career duration. Years-experience is derived
 * from this — never hardcode a years number elsewhere.
 *
 * Excludes the 2019-09 → 2021-08 gap (Georgian College post-grad +
 * Canada relocation) so the total reflects professional ML work, not
 * calendar elapsed since first job.
 *
 * REFINE: dates below are approximate per existing canonical reconciliation
 * (TCS = 3.3y, Quantiphi = 1.0y). Update with exact start/end as known.
 */
const CAREER_STINTS: CareerStint[] = [
  // Dates from CAREER_KNOWLEDGE_BASE_v2.md §2.1, §2.3, §2.4
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
 * Format raw years as a display string. Uses "nearly N" with N = round(value),
 * matching the conservative framing in CAREER_KNOWLEDGE_BASE_v2.md §6. All
 * common forms (`seven and a half`, `over eight`) collapse to one canonical
 * phrasing. Slightly past an integer (e.g., 8.02) still reads as "nearly 8"
 * until the value crosses N.5, at which point it shifts to "nearly N+1".
 * Re-evaluated per build.
 */
export function formatYearsExperience(years: number = computeYearsExperience()): string {
  return `nearly ${Math.round(years)}`;
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

export const HUMANA_ACCURACY = '99.95%';
export const HUMANA_BASELINE_ACCURACY = '~70%';

export const COMMODITY_TAX_EFFICIENCY = 'Months → 90 min';
/** Compact form for 3-slot displays (Hero NUMBER_SEQUENCE) */
export const COMMODITY_TAX_EFFICIENCY_COMPACT = '90 min';

/**
 * Aegis v2 refactor sprint length. NOT an independent
 * concept-to-production timeline — v2 is a 2-week refactor of v1 done
 * alongside other primary work. Display label should read
 * "v1 → v2 refactor" or similar, NOT "Concept → Production".
 */
export const AEGIS_V2_BUILD_TIME = '2 weeks';

/** Events: leaf-level routing / cost-centre records in Astraeus. (Formerly: "transits".) */
export const ASTRAEUS_FACTORIAL_COMBINATIONS = '~40,000';

/** Rollups: intermediate aggregation levels above leaf-level events. */
export const ASTRAEUS_ROLLUPS = '~9,000';

/** PAR Assist pilot launched April 2026; bank-wide rollout in progress through Q2/Q3 2026. */
export const PROMETHEUS_SCALE = 'Bank-wide';
/** @deprecated alias — see PROMETHEUS_SCALE. Kept so existing consumers keep compiling. */
export const PAR_ASSIST_SCALE = PROMETHEUS_SCALE;

// ═══════════════════════════════════════════════════════════════════
// TEAM
// ═══════════════════════════════════════════════════════════════════

export const HANDS_ON_PCT = '~70%';
export const INTERNS_TOTAL = 7;
export const INTERNS_JOINING_MAY_2026 = 2;
