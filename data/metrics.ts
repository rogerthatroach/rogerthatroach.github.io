import {
  DIGITAL_TWIN_SAVINGS,
  HUMANA_ACCURACY,
  HUMANA_BASELINE_ACCURACY,
  COMMODITY_TAX_EFFICIENCY,
  PRODUCTION_SYSTEMS_COUNT,
} from './canonical';

export interface Metric {
  value: string;
  label: string;
  context: string;
}

export const METRICS: Metric[] = [
  { value: DIGITAL_TWIN_SAVINGS, label: 'Cost Savings Delivered', context: 'Digital Twin — annual' },
  { value: HUMANA_ACCURACY, label: 'Checkbox Detection Accuracy', context: `Humana — up from ${HUMANA_BASELINE_ACCURACY}` },
  { value: COMMODITY_TAX_EFFICIENCY, label: 'Commodity Tax Processing', context: 'RBC CFO Group' },
  { value: String(PRODUCTION_SYSTEMS_COUNT), label: 'Production AI Systems', context: 'Drafting, workforce analytics, and peer benchmarking (v1 → v2 refactor)' },
] as const;
