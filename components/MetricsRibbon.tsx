'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { METRICS } from '@/data/metrics';

function AnimatedCounter({ value, prefix, suffix, duration = 2 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  // Keep the final value in the server-rendered HTML. Hydrated clients can
  // animate from zero once the metric enters the viewport, but no-JS and
  // pre-hydration readers always receive the truthful value.
  const [count, setCount] = useState(value);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;
    setCount(0);

    const end = value;
    const startTime = performance.now();
    let animationFrame: number;
    let completed = false;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * end);

      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        completed = true;
        setCount(end);
      }
    }

    animationFrame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrame);
      // React Strict Mode intentionally replays effects in development. Let
      // the replay own a fresh frame rather than leaving the counter at zero
      // after the first setup is cancelled.
      if (!completed) hasAnimated.current = false;
    };
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="font-mono text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl">
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export default function MetricsRibbon() {
  return (
    <section id="through-line" aria-label="Through-line thesis and key metrics" className="border-y border-border-subtle bg-surface/30">
      <div className="mx-auto max-w-content px-6 md:px-16">
        {/* Through-line: a bounded design heuristic across the projects */}
        <div className="mx-auto max-w-2xl pt-12 text-center sm:pt-14">
          <motion.p
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: '200px 0px' }}
            transition={{ duration: 0.7 }}
            className="text-base leading-relaxed text-text-secondary"
          >
            Across these projects I reuse four questions: what is observed, what is estimated, what
            choice follows, and who or what acts. At a power plant, that meant sensors, regression
            models, Particle Swarm Optimization, and plant-operator review. In enterprise finance,
            it means bounded model calls, deterministic calculation paths, and explicit human or
            policy gates.
          </motion.p>
          <motion.p
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: '200px 0px' }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-3 text-base leading-relaxed text-text-secondary"
          >
            The questions recur. The evidence, controls, and guarantees remain domain-specific.
          </motion.p>
        </div>

        {/* Metrics grid — selected outcomes */}
        <div className="grid grid-cols-2 gap-8 pb-12 pt-10 sm:grid-cols-3 sm:pb-14 lg:grid-cols-6">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1, margin: '200px 0px' }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
              className="flex flex-col"
            >
              {metric.numericValue !== undefined ? (
                <AnimatedCounter value={metric.numericValue} prefix={metric.prefix} suffix={metric.suffix} />
              ) : (
                <span className="font-mono text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl">
                  {metric.value}
                </span>
              )}
              <span className="sr-only"> — </span>
              <span className="mt-2 text-xs font-medium text-text-primary">{metric.label}</span>
              <span className="sr-only">; </span>
              <span className="mt-0.5 text-[10px] text-text-tertiary">{metric.context}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
