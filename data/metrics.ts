import {
  YEARS_EXPERIENCE,
  DIGITAL_TWIN_SAVINGS,
  PRODUCTION_SYSTEMS_COUNT,
  AWARDS_COUNT,
} from './canonical';

export interface Metric {
  value: string;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  context: string;
}

// Display variants ('40K+', '2wk') deliberately differ from canonical
// long forms ('~40,000', '2 weeks'). MetricsRibbon animates to the
// numericValue and tacks on the suffix, so the short display form is a
// rendering concern, not a truth concern.
export const METRICS: Metric[] = [
  // Years rendered as static text so YEARS_EXPERIENCE's "almost N" form
  // displays cleanly. Other entries with numeric+suffix still animate.
  { value: YEARS_EXPERIENCE, label: 'Years in AI/ML', context: '2016–present' },
  { value: DIGITAL_TWIN_SAVINGS, numericValue: 3, prefix: '$', suffix: 'M', label: 'Cost Savings Delivered', context: 'Digital Twin — annual' },
  { value: String(PRODUCTION_SYSTEMS_COUNT), numericValue: PRODUCTION_SYSTEMS_COUNT, label: 'Production Gen AI Systems', context: 'PAR Assist, Astraeus, Aegis (v1 → v2 refactor)' },
  { value: '40K+', numericValue: 40, suffix: 'K+', label: 'Events Analyzed', context: 'Astraeus — on-the-fly millisecond slicing' },
  { value: '2wk', numericValue: 2, suffix: 'wk', label: 'Fastest Refactor', context: 'Aegis v1 → v2 concurrent sprint' },
  { value: String(AWARDS_COUNT), numericValue: AWARDS_COUNT, label: 'Awards & Recognition', context: 'RBC + TCS' },
] as const;
