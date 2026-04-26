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
 * RBC production AI systems (3). Display names are functional descriptors
 * (per 2026-04-25 confidentiality scrub); internal codenames are the
 * "formerly:" trail kept in glossary cross-references.
 *
 *   1. PAR Drafting Assistant     (formerly PAR Assist) — pilot launched April 2026; enterprise rollout in progress
 *   2. CFO Analytics Engine       (formerly Astraeus)   — production since Nov 2025
 *   3. Benchmarking Engine        (formerly Aegis)      — v1 shipped, v2 is a concurrent 2-week refactor of v1 (one product, two revisions)
 *
 * Per 2026-04-21 audit: do NOT present the v2 refactor as an independent 4th product.
 * v2 was a 2-week focused refactor of v1 done alongside PAR + CFO Analytics Engine work.
 */
export const PRODUCTION_SYSTEMS_COUNT = 3;

// ═══════════════════════════════════════════════════════════════════
// CAREER SPAN
// ═══════════════════════════════════════════════════════════════════

/** TCS (3.3y) + Quantiphi (1y) + RBC (3.5y) = ~7.8y; round to 7.5+. */
export const YEARS_EXPERIENCE = '7.5+';

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
 * Benchmarking Engine v2 refactor sprint length. NOT an independent
 * concept-to-production timeline — v2 is a 2-week refactor of v1 done
 * alongside other primary work. Display label should read
 * "v1 → v2 refactor" or similar, NOT "Concept → Production".
 *
 * Formerly: "Aegis v2 build time".
 */
export const BENCHMARKING_V2_BUILD_TIME = '2 weeks';
/** @deprecated alias kept for legacy import sites — see BENCHMARKING_V2_BUILD_TIME. */
export const AEGIS_V2_BUILD_TIME = BENCHMARKING_V2_BUILD_TIME;

/** Events: leaf-level routing / cost-centre records in the CFO Analytics Engine. (Formerly: "transits".) */
export const CFO_ANALYTICS_FACTORIAL_COMBINATIONS = '~40,000';
/** @deprecated alias kept for legacy imports — see CFO_ANALYTICS_FACTORIAL_COMBINATIONS. */
export const ASTRAEUS_FACTORIAL_COMBINATIONS = CFO_ANALYTICS_FACTORIAL_COMBINATIONS;

/** Rollups: intermediate aggregation levels above leaf-level events. */
export const CFO_ANALYTICS_ROLLUPS = '~9,000';
/** @deprecated alias — see CFO_ANALYTICS_ROLLUPS. */
export const ASTRAEUS_ROLLUPS = CFO_ANALYTICS_ROLLUPS;

/** Geography hierarchy size: total nodes in RBC's cost-centre geography tree (hierarchy, not events). */
export const CFO_ANALYTICS_GEOGRAPHIES = '~60,000';
/** @deprecated alias — see CFO_ANALYTICS_GEOGRAPHIES. */
export const ASTRAEUS_GEOGRAPHIES = CFO_ANALYTICS_GEOGRAPHIES;

/** PAR Drafting Assistant pilot launched April 2026; bank-wide rollout in progress through Q2/Q3 2026. */
export const PAR_DRAFTING_SCALE = 'Bank-wide';
/** @deprecated alias — see PAR_DRAFTING_SCALE. */
export const PAR_ASSIST_SCALE = PAR_DRAFTING_SCALE;

// ═══════════════════════════════════════════════════════════════════
// TEAM
// ═══════════════════════════════════════════════════════════════════

export const HANDS_ON_PCT = '~70%';
export const INTERNS_TOTAL = 7;
export const INTERNS_JOINING_MAY_2026 = 2;
