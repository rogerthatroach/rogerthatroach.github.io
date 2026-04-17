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

/** RBC production AI systems: PAR Assist, Astraeus, Aegis v1, Aegis v2 */
export const PRODUCTION_SYSTEMS_COUNT = 4;

// ═══════════════════════════════════════════════════════════════════
// CAREER SPAN
// ═══════════════════════════════════════════════════════════════════

export const YEARS_EXPERIENCE = '8+';

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

export const AEGIS_V2_BUILD_TIME = '2 weeks';

export const ASTRAEUS_FACTORIAL_COMBINATIONS = '~40,000';
export const ASTRAEUS_ROLLUPS = '~9,000';
export const ASTRAEUS_GEOGRAPHIES = '~60,000';

export const PAR_ASSIST_SCALE = 'Bank-wide';

// ═══════════════════════════════════════════════════════════════════
// TEAM
// ═══════════════════════════════════════════════════════════════════

export const HANDS_ON_PCT = '~70%';
export const INTERNS_TOTAL = 7;
export const INTERNS_JOINING_MAY_2026 = 2;
