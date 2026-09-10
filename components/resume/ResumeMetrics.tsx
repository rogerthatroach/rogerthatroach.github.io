import {
  PRODUCTION_SYSTEMS_COUNT,
  YEARS_EXPERIENCE,
} from '@/data/canonical';
import { CAREER_SCOPE } from '@/data/timeline';

/**
 * Four-number headline strip for /resume. Static render (no counter
 * animation) — the homepage MetricsRibbon does the animated version;
 * /resume is a scannable hiring-manager surface where motion adds noise.
 */
const RESUME_METRICS = [
  {
    value: YEARS_EXPERIENCE,
    label: 'Years in Applied AI/ML',
    context: 'Industrial, cloud, and financial systems',
  },
  {
    value: '~4 yrs',
    label: 'Production Finance AI',
    context: 'Regulated financial services',
  },
  {
    value: '18 mo',
    label: 'Agentic and LLM Systems',
    context: 'Architecture through production operation',
  },
  {
    value: String(PRODUCTION_SYSTEMS_COUNT),
    label: 'Bank Production AI Systems',
    context: `${CAREER_SCOPE.bankProductionSystems.join(' · ')} (v1 + v2)`,
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
          <span className="sr-only"> — </span>
          <span className="mt-2 text-xs font-medium text-text-primary">{m.label}</span>
          <span className="sr-only">; </span>
          <span className="mt-0.5 text-xs leading-relaxed text-text-tertiary">
            {m.context}
          </span>
        </div>
      ))}
    </div>
  );
}
