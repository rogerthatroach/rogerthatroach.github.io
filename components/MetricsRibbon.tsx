import { METRICS } from '@/data/metrics';

export default function MetricsRibbon() {
  return (
    <section
      id="through-line"
      aria-label="Through-line thesis and key metrics"
      className="scroll-mt-24 border-y border-border-subtle bg-surface/30"
    >
      <div className="mx-auto max-w-content px-6 md:px-16">
        <div className="mx-auto max-w-2xl pt-12 text-center sm:pt-14">
          <p className="text-base leading-relaxed text-text-secondary">
            Across these projects I reuse four questions: what is observed, what is estimated, what
            choice follows, and who or what acts. At a power plant, that meant sensors, regression
            models, Particle Swarm Optimization, and plant-operator review. In enterprise finance,
            it means bounded model calls, deterministic calculation paths, and explicit human or
            policy gates.
          </p>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            The questions recur. The evidence, controls, and guarantees remain domain-specific.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 pb-12 pt-10 sm:pb-14 lg:grid-cols-4">
          {METRICS.map((metric) => (
            <div key={metric.label} className="flex flex-col">
              <span className="font-mono text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl">
                {metric.value}
              </span>
              <span className="sr-only"> — </span>
              <span className="mt-2 text-xs font-medium text-text-primary">{metric.label}</span>
              <span className="sr-only">; </span>
              <span className="mt-0.5 text-xs leading-relaxed text-text-tertiary">
                {metric.context}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
