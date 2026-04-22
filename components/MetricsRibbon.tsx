'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { METRICS } from '@/data/metrics';

function AnimatedCounter({ value, prefix, suffix, duration = 2 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    if (!isInView || hasAnimated) return;
    setHasAnimated(true);

    const end = value;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * end);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, hasAnimated, value, duration]);

  return (
    <span ref={ref} className="font-mono text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl">
      {prefix}
      {hasAnimated ? count : 0}
      {suffix}
    </span>
  );
}

export default function MetricsRibbon() {
  return (
    <div id="through-line" className="border-y border-border-subtle bg-surface/30">
      <div className="mx-auto max-w-content px-6 md:px-16">
        {/* Through-line: the thesis that ties every system together */}
        <div className="mx-auto max-w-2xl pt-12 text-center sm:pt-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: '200px 0px' }}
            transition={{ duration: 0.7 }}
            className="text-base leading-relaxed text-text-secondary"
          >
            Every system I&apos;ve built follows the same pattern: sense the environment, model it,
            optimize against constraints, and close the loop. At a power plant, that meant sensors
            and Particle Swarm Optimization. In the cloud, document pipelines and Vertex AI. In
            enterprise finance, agentic frameworks where LLMs reason about intent and deterministic
            code handles truth.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: '200px 0px' }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-3 text-base leading-relaxed text-text-secondary"
          >
            The technology changes. The pattern doesn&apos;t.
          </motion.p>
        </div>

        {/* Metrics grid — the proof */}
        <div className="grid grid-cols-2 gap-8 pb-12 pt-10 sm:grid-cols-3 sm:pb-14 lg:grid-cols-6">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1, margin: '200px 0px' }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col"
            >
              {metric.numericValue !== undefined ? (
                <AnimatedCounter value={metric.numericValue} prefix={metric.prefix} suffix={metric.suffix} />
              ) : (
                <span className="font-mono text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl">
                  {metric.value}
                </span>
              )}
              <span className="mt-2 text-xs font-medium text-text-primary">{metric.label}</span>
              <span className="mt-0.5 text-[10px] text-text-tertiary">{metric.context}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
