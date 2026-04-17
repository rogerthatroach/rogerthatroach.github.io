export interface Metric {
  value: string;
  numericValue?: number;
  suffix?: string;
  label: string;
  context: string;
}

export const METRICS: Metric[] = [
  { value: '8+', numericValue: 8, suffix: '+', label: 'Years in AI/ML', context: '2016–present' },
  { value: '$3M', numericValue: 3, suffix: 'M', label: 'Cost Savings Delivered', context: 'Digital Twin — annual' },
  { value: '4', numericValue: 4, label: 'Production AI Systems', context: 'PAR Assist, Astraeus, Aegis v1 & v2' },
  { value: '40K+', numericValue: 40, suffix: 'K+', label: 'Factorial Combinations', context: 'Astraeus — on-the-fly millisecond slicing' },
  { value: '2wk', numericValue: 2, suffix: 'wk', label: 'Fastest Delivery', context: 'Aegis v2 — full product' },
  { value: '5', numericValue: 5, label: 'Awards & Recognition', context: 'RBC + TCS' },
] as const;
