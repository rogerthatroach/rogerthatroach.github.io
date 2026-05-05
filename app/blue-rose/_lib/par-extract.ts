/**
 * par-extract — canned extraction-by-filename for the file-attach
 * drafting chain.
 *
 * In a real Phase 2 system this would be:
 *   1. OCR over the uploaded doc (pdf/docx/pptx/png)
 *   2. Field extraction via N parallel scoped LLM calls per field-group
 *   3. Dict-union merge against the schema
 *
 * For the POC we lookup the filename against a small set of patterns
 * and return pre-authored extraction outcomes — values + provenance
 * source-passages — that mirror what a real extraction would yield
 * for the seeded scenarios. This keeps the demo feeling deterministic
 * for stakeholders who try the same upload twice.
 */

export interface ExtractedFieldValue {
  value: string | number | boolean;
  /** Source passage from the document, shown highlighted in the modal. */
  source: string;
  /** Page reference shown in the modal header (mock). */
  page: number;
}

export interface ExtractionResult {
  /** The user-uploaded filename, surfaced in the overlay + source modal. */
  filename: string;
  /** Mock page count, surfaced as "extracted N pages" in the overlay. */
  pages: number;
  /** Brief description of the document, shown in the overlay verdict. */
  documentLabel: string;
  /** Field key → extracted value + source passage + page number. */
  fields: Record<string, ExtractedFieldValue>;
}

// ── Hero extraction: Vendor MSA (CRM platform) ──────────────────────

const VENDOR_MSA_CRM: Omit<ExtractionResult, 'filename'> = {
  pages: 14,
  documentLabel: 'Acme CRM Vendor Master Services Agreement',
  fields: {
    request_title: {
      value: 'Acme CRM Platform Onboarding',
      source:
        'This Master Services Agreement is entered into as of February 15, 2026, between RBC Personal & Commercial Banking ("Customer") and Acme Software Inc. ("Vendor") for the provision of Acme CRM Platform — onboarding services, licenses, and integration support.',
      page: 1,
    },
    request_category: {
      value: 'Project Expenditure',
      source:
        'Engagement classified as Project Expenditure under the customer\'s capital framework — multi-year build with measurable benefits realization.',
      page: 1,
    },
    sponsor_segment: {
      value: 'Personal & Commercial Banking',
      source:
        'Sponsoring business unit: Personal & Commercial Banking. Project sponsor will be the VP of Sales (P&CB).',
      page: 2,
    },
    sponsor_unit: {
      value: 'P&CB - Sales',
      source:
        'Within the segment, accountability sits with P&CB Sales operations as the platform consumer.',
      page: 2,
    },
    classification: {
      value: 'Technology',
      source:
        'Engagement type: Technology. The platform is a third-party SaaS solution requiring integration with existing marketing automation and data warehouse infrastructure.',
      page: 2,
    },
    executive_sponsor: {
      value: 'Maya Chen, VP of Sales (P&CB)',
      source:
        'The executive sponsor for this engagement is Maya Chen, VP of Sales, Personal & Commercial Banking.',
      page: 3,
    },
    initiative_type: {
      value: 'Change-the-Bank',
      source:
        'Strategic categorization: Change-the-Bank initiative — replaces existing spreadsheet-based sales tracking with platform-based automation.',
      page: 3,
    },
    par_contact: {
      value: 'Daniel Reyes',
      source:
        'PAR coordination contact: Daniel Reyes, Strategy & Planning Office.',
      page: 4,
    },
    opening_statement: {
      value:
        'P&CB Sales requests an expenditure of CAD $1.8M to onboard the Acme CRM platform, replacing the legacy spreadsheet-based sales tracking system. The new platform delivers pipeline visibility, automated reporting, and improved collaboration across the sales organization.',
      source:
        '§3.1 Scope and Purpose. P&CB Sales requests an expenditure of CAD $1.8M over 18 months to onboard the Acme CRM platform, replacing the existing spreadsheet-based sales tracking system. The Acme platform delivers (a) pipeline visibility across all field reps, (b) automated reporting through Tableau integration, (c) improved collaboration via Slack-bridge connectors, and (d) mobile field-rep access.',
      page: 4,
    },
    overview: {
      value:
        'The current sales tracking system relies on multiple Excel spreadsheets across regional teams. This creates: no single source of truth, manual data-entry errors, difficulty generating cross-region reports, poor pipeline visibility for management, and lost sales opportunities due to lack of follow-up tracking. The Acme platform addresses these via contact + account management, opportunity tracking, sales forecasting, custom dashboards, mobile access, and integration with existing marketing automation. Cross-border data residency: vendor primary processing region is US-East with Canadian region scheduled Q4 2026.',
      source:
        '§3.2 Current State and Drivers. The current sales tracking environment consists of regional Excel workbooks maintained by individual sales managers. Issues include: (a) no single source of truth — reports must be manually reconciled across 8+ workbooks, (b) data-entry errors compound monthly, (c) leadership cannot get an enterprise-wide pipeline view in less than 3 business days. §3.3 Vendor Infrastructure. Vendor primary processing region is US-East-2 (Virginia). Canadian region (ca-central-1) is scheduled for Q4 2026 general availability. SCCs executed; SOC 2 Type II + ISO 27001 verified.',
      page: 5,
    },
    description: {
      value:
        'Implementation of Acme CRM Platform across the P&CB sales organization with cross-border processing controls. Includes data migration from existing spreadsheets, integration with Tableau and existing marketing automation, custom dashboard development, mobile access provisioning, and full user training across all sales tiers.',
      source:
        '§4.1 Scope of Implementation. Implementation covers: (a) full data migration from 12 source workbooks, (b) integration with Tableau analytics platform, (c) bidirectional sync with Marketo marketing automation, (d) custom dashboard development for 3 distinct user roles (rep / manager / leadership), (e) mobile-rep provisioning for ~340 field representatives, (f) training across all sales tiers in 4 cohorts.',
      page: 7,
    },
    benefits_qualitative: {
      value:
        'Single source of truth for customer data; improved cross-team collaboration; better forecasting confidence; reduced manual reporting overhead; faster onboarding for new sales hires.',
      source:
        '§5.1 Qualitative Benefits. (a) Single source of truth for all customer data. (b) Improved cross-team collaboration through shared opportunity views. (c) Better forecasting confidence through structured pipeline progression. (d) Reduced manual reporting overhead — reports auto-generate. (e) Faster onboarding for new sales hires through standardized workflow templates.',
      page: 8,
    },
    success_metrics: {
      value:
        '25% increase in sales productivity (deals-per-rep). 15% improvement in win rate (Q1 vs Q3 cohort). Forecast accuracy ±5% (vs current ±20%). 80% reduction in manual data entry hours.',
      source:
        '§5.2 Quantitative Success Metrics. Target outcomes within 12 months of go-live: (1) 25% increase in sales productivity measured via deals-closed-per-rep, baseline established Q1 2026 vs Q3 2026 cohort. (2) 15% improvement in win rate. (3) Forecast accuracy within ±5% confidence interval (current state: ±20%). (4) 80% reduction in manual data-entry hours per the timesheet study.',
      page: 8,
    },
    options_considered: {
      value:
        'Acme CRM Platform (recommended). Microsoft Dynamics 365. HubSpot CRM. Build in-house on existing data platform.',
      source:
        '§6.1 Options Considered. Four options were evaluated against the criteria of (a) integration footprint, (b) total cost of ownership over 5 years, (c) vendor stability, (d) mobile experience, (e) regulatory alignment. Option 1: Acme CRM Platform — recommended. Option 2: Microsoft Dynamics 365. Option 3: HubSpot CRM. Option 4: In-house build on the existing data platform.',
      page: 9,
    },
    recommended_option: {
      value:
        'Acme CRM Platform — best fit for our integration footprint with existing marketing automation and data warehouse.',
      source:
        '§6.2 Recommended Option. Acme CRM Platform is recommended. Rationale documented in §6.3.',
      page: 9,
    },
    rationale: {
      value:
        'Acme ecosystem already integrated with Marketo, Slack, and the data warehouse. Vendor familiarity reduces training cost. Best-in-class mobile experience for field sales. Cost is mid-range across options but TCO is lowest after factoring integration savings.',
      source:
        '§6.3 Rationale. (a) Acme already integrates with Marketo (marketing), Slack (collaboration), and the enterprise data warehouse — eliminates ~$240K in integration work for the alternatives. (b) Vendor familiarity reduces training cost vs Dynamics 365. (c) Acme mobile experience consistently ranks first in third-party reviews. (d) Cost is mid-range; TCO over 5 years is lowest after factoring integration savings ($1.8M Acme vs $2.1M Dynamics, vs $2.4M build).',
      page: 10,
    },
    strategic_alignment: {
      value:
        'Maps to RBC\'s "Exceptional Client Experience" enterprise priority (richer client context for sales reps). Maps to "Digital Transformation" (replaces manual workflow with platform automation). Maps to "Operational Excellence" via measurable productivity gains.',
      source:
        '§7.1 Enterprise Strategic Alignment. The initiative aligns with three enterprise priorities: (i) Exceptional Client Experience — richer client context enables better service, (ii) Digital Transformation — replaces manual workflow with platform automation, (iii) Operational Excellence — productivity gains are measurable and tied to forecast accuracy.',
      page: 11,
    },
    enterprise_priority: {
      value: 'Digital Transformation',
      source:
        'Primary enterprise priority alignment: Digital Transformation. Secondary: Exceptional Client Experience.',
      page: 11,
    },
    total_expenditure: {
      value: 1800,
      source:
        '§8.1 Total Expenditure (CAD K). Total program cost: CAD $1,800K over 18 months.',
      page: 12,
    },
    expenditure_y1: {
      value: 1100,
      source:
        '§8.2 Year 1 Expenditure: CAD $1,100K (covers licenses, migration, integration, and 60% of training).',
      page: 12,
    },
    expenditure_y2: {
      value: 700,
      source:
        '§8.3 Year 2 Expenditure: CAD $700K (covers ongoing licenses, mobile rollout to remaining cohorts, and benefits-realization tracking).',
      page: 12,
    },
    funding_source: {
      value: 'Capital Budget',
      source:
        '§8.4 Funding Source. Allocated from the 2026-2027 Capital Budget under the P&CB Strategic Initiatives line.',
      page: 12,
    },
    risks_summary: {
      value:
        'Risk 1: Data migration quality (inherent High). Risk 2: User adoption (inherent Medium). Risk 3: Vendor dependency lock-in (inherent Low). Residual severities post-mitigation: High → Medium, Medium → Low, Low → Low.',
      source:
        '§9.1 Risk Register. R1 — Data migration quality (inherent High). R2 — User adoption (inherent Medium). R3 — Vendor dependency lock-in (inherent Low). Residual severities post-mitigation: R1 High→Medium, R2 Medium→Low, R3 Low→Low.',
      page: 13,
    },
    mitigation_actions: {
      value:
        'R1: Two-phase migration with sandbox validation, dedicated DQ engineer, automated reconciliation reports. R2: Sales-led champions program, tiered training, gamified adoption metrics. R3: Annual contract with renegotiation triggers, data export capability built in.',
      source:
        '§9.2 Mitigation Actions. R1 mitigation: two-phase migration (sandbox-first), dedicated data-quality engineer, automated reconciliation reports against source-of-record. R2 mitigation: sales-led champions program (8 senior reps), tiered training over 4 cohorts, gamified adoption metrics with quarterly leaderboard. R3 mitigation: annual contract terms with explicit renegotiation triggers tied to vendor SLA breaches; data-export capability written into the agreement at §11.4.',
      page: 13,
    },
  },
};

// ── Hero extraction: Capex memo (forklift fleet refresh) ───────────

const CAPEX_FORKLIFT: Omit<ExtractionResult, 'filename'> = {
  pages: 22,
  documentLabel: 'Forklift Fleet Refresh Capital Expenditure Memo',
  fields: {
    request_title: {
      value: 'Forklift Fleet Refresh — Distribution Centers',
      source:
        'CAPEX Request 2026-Q2-007: Forklift Fleet Refresh program covering distribution centers in Mississauga, Calgary, and Halifax.',
      page: 1,
    },
    request_category: {
      value: 'Capital Expenditure',
      source:
        'Request type: Capital Expenditure under the 2026 capex framework, Tier 2 (single-asset class refresh, multi-site).',
      page: 1,
    },
    sponsor_segment: {
      value: 'Global Functions',
      source:
        'Sponsoring segment: Global Functions — Real Estate & Operations.',
      page: 2,
    },
    sponsor_unit: {
      value: 'GF - Finance',
      source:
        'Cost center: GF - Finance, with charge-back to operating units.',
      page: 2,
    },
    classification: {
      value: 'Process',
      source:
        'Classification: Process — operations / warehouse / fleet refresh.',
      page: 2,
    },
    executive_sponsor: {
      value: 'Robert Wilson, CFO',
      source:
        'Executive sponsor: Robert Wilson, CFO (acting per delegated capex authority above $1M).',
      page: 3,
    },
    initiative_type: {
      value: 'Run-the-Bank',
      source:
        'Initiative type: Run-the-Bank — fleet replenishment within ongoing operational lifecycle.',
      page: 3,
    },
    opening_statement: {
      value:
        'Operations requests CAD $1.2M capital expenditure for refreshing 18 forklifts across three distribution centers. Existing units are 9-11 years old, exceed maintenance budget by 38%, and have reported 4 safety incidents in the last 18 months.',
      source:
        '§1 Executive Summary. Operations requests CAD $1.2M for the refresh of 18 forklifts across the Mississauga, Calgary, and Halifax distribution centers. Existing units are 9-11 years of age, are running 38% over the maintenance budget, and have been associated with 4 safety incidents in the last 18 months — necessitating refresh per OEM end-of-life guidance.',
      page: 4,
    },
    description: {
      value:
        'Replace 18 forklifts (8x in Mississauga, 6x in Calgary, 4x in Halifax) with a single-vendor lease arrangement. Includes operator training migration to new safety-monitoring telemetry, sale or disposition of existing units, and 5-year service-and-maintenance package.',
      source:
        '§3 Scope. Replacement of 18 units allocated across the three sites. Single-vendor lease arrangement (4-year term + 1-year renewal option). Includes operator transition training to new safety-monitoring telemetry, disposition of existing units (return-to-OEM credit), and 5-year preventive-maintenance contract.',
      page: 6,
    },
    total_expenditure: {
      value: 1200,
      source: '§8 Financial Summary. Total expenditure CAD $1,200K, capitalized over 4 years.',
      page: 14,
    },
    expenditure_y1: {
      value: 800,
      source: '§8.1 Year 1: CAD $800K (acquisition + transition training).',
      page: 14,
    },
    funding_source: {
      value: 'Capital Budget',
      source: '§8.3 Funded from the 2026 Capital Budget under Operations.',
      page: 14,
    },
    strategic_alignment: {
      value:
        'Operational Excellence — reduces unplanned maintenance hours by 60%, brings safety incident rate below the 1-per-rolling-12-months target.',
      source:
        '§7 Strategic Alignment. Aligns with Operational Excellence: target outcomes are (i) 60% reduction in unplanned maintenance hours; (ii) safety incident rate below 1-per-12-months (current trailing 18 months: 4 incidents); (iii) fleet emissions reduction of 22% per the manufacturer\'s spec.',
      page: 12,
    },
    enterprise_priority: {
      value: 'Operational Excellence',
      source: 'Enterprise priority anchor: Operational Excellence.',
      page: 12,
    },
    risks_summary: {
      value:
        'R1: Operator transition disruption (inherent Medium). R2: Vendor lock-in (inherent Low). R3: Disposition pricing volatility (inherent Low).',
      source:
        '§9.1 Risk Register. R1 Operator transition disruption — inherent Medium. R2 Vendor lock-in over 4-year term — inherent Low. R3 Disposition pricing volatility on existing units — inherent Low.',
      page: 16,
    },
    mitigation_actions: {
      value:
        'R1: Phased rollout site-by-site, parallel-running for 2 weeks, opt-out for veterans during transition. R2: Renewable terms with break-clause; second-source qualified. R3: Disposition timed to OEM credit window; locked pricing.',
      source:
        '§9.2 Mitigations. R1: phased rollout site-by-site over 8 weeks; parallel-running of old + new for 2 weeks per site; opt-out provision for veteran operators during the transition. R2: contract terms include 1-year renewal option with break-clause; second-source vendor pre-qualified. R3: disposition timed to OEM credit window; pricing locked at contract sign.',
      page: 16,
    },
    in_plan: {
      value: 'Yes',
      source:
        '§2 Plan Alignment. This refresh is in the Operations 2026 plan under fleet lifecycle management.',
      page: 5,
    },
  },
};

// ── Generic fallback ────────────────────────────────────────────────

const GENERIC: Omit<ExtractionResult, 'filename'> = {
  pages: 4,
  documentLabel: 'Project funding request (generic)',
  fields: {
    request_title: {
      value: 'Project Funding Request (Untitled)',
      source: 'Document title: Project Funding Request.',
      page: 1,
    },
    request_category: {
      value: 'Project Expenditure',
      source: 'Type: Project Expenditure (default classification per category lookup).',
      page: 1,
    },
    description: {
      value:
        'Funding request extracted from supplied document — please review and refine field-by-field. Diane was unable to identify a strong category match from the filename pattern.',
      source:
        'No clear category match. Defaulting to project expenditure. Recommend the user provide more context via the Ledger or upload a categorized template.',
      page: 2,
    },
  },
};

// ── Lookup ──────────────────────────────────────────────────────────

/**
 * Match the filename against known patterns and return the canned
 * extraction. Generic fallback for unmatched filenames.
 */
export function extractFromFile(filename: string): ExtractionResult {
  const lower = filename.toLowerCase();
  if (lower.includes('vendor') || lower.includes('msa') || lower.includes('crm') || lower.includes('saas')) {
    return { ...VENDOR_MSA_CRM, filename };
  }
  if (
    lower.includes('capex') ||
    lower.includes('forklift') ||
    lower.includes('fleet') ||
    lower.includes('warehouse')
  ) {
    return { ...CAPEX_FORKLIFT, filename };
  }
  return { ...GENERIC, filename };
}

/**
 * Strip the extraction down to a `Record<string, string|number|boolean>`
 * suitable for `batchSetParFields`. Drops the source passages — those
 * stay in the ExtractionResult for the source-highlight modal lookup.
 */
export function valuesFromExtraction(
  extraction: ExtractionResult,
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, entry] of Object.entries(extraction.fields)) {
    out[key] = entry.value;
  }
  return out;
}
