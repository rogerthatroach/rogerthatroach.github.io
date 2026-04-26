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
 * RBC production AI systems (3). Codenames as the primary surface
 * (per 2026-04-26 codename restore — Prometheus is the new agentic
 * platform name, replacing PAR Assist).
 *
 *   1. Prometheus — pilot launched April 2026; enterprise rollout in progress
 *   2. Astraeus   — production since Nov 2025
 *   3. Aegis      — v1 shipped, v2 is a concurrent 2-week refactor of v1 (one product, two revisions)
 *
 * Per 2026-04-21 audit: do NOT present the v2 refactor as an independent 4th product.
 * v2 was a 2-week focused refactor of v1 done alongside Prometheus + Astraeus work.
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

/** Geography hierarchy size: total nodes in RBC's cost-centre geography tree (hierarchy, not events). */
export const ASTRAEUS_GEOGRAPHIES = '~60,000';

/** Prometheus pilot launched April 2026; bank-wide rollout in progress through Q2/Q3 2026. */
export const PROMETHEUS_SCALE = 'Bank-wide';
/** @deprecated alias — see PROMETHEUS_SCALE. Kept so existing consumers keep compiling. */
export const PAR_ASSIST_SCALE = PROMETHEUS_SCALE;

// ═══════════════════════════════════════════════════════════════════
// TEAM
// ═══════════════════════════════════════════════════════════════════

export const HANDS_ON_PCT = '~70%';
export const INTERNS_TOTAL = 7;
export const INTERNS_JOINING_MAY_2026 = 2;
