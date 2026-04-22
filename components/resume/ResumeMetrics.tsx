import {
  DIGITAL_TWIN_SAVINGS,
  HUMANA_ACCURACY,
  COMMODITY_TAX_EFFICIENCY,
  PRODUCTION_SYSTEMS_COUNT,
} from '@/data/canonical';

/**
 * Four-number headline strip for /resume. Static render (no counter
 * animation) — the homepage MetricsRibbon does the animated version;
 * /resume is a scannable hiring-manager surface where motion adds noise.
 */
const RESUME_METRICS = [
  {
    value: DIGITAL_TWIN_SAVINGS,
    label: 'Cost Savings Delivered',
    context: 'Digital Twin — annual',
  },
  {
    value: HUMANA_ACCURACY,
    label: 'Document Pipeline Accuracy',
    context: 'Humana — up from ~70%',
  },
  {
    value: COMMODITY_TAX_EFFICIENCY,
    label: 'Commodity Tax Processing',
    context: 'RBC CFO — months → 90 min',
  },
  {
    value: String(PRODUCTION_SYSTEMS_COUNT),
    label: 'Production AI Systems',
    context: 'PAR Assist · Astraeus · Aegis',
  },
];

export default function ResumeMetrics() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
      {RESUME_METRICS.map((m) => (
        <div key={m.label} className="flex flex-col">
          <span className="font-mono text-2xl font-bold leading-tight text-text-primary sm:text-3xl md:text-4xl">
            {m.value}
          </span>
          <span className="mt-2 text-xs font-medium text-text-primary">{m.label}</span>
          <span className="mt-0.5 text-[10px] text-text-tertiary">{m.context}</span>
        </div>
      ))}
    </div>
  );
}
