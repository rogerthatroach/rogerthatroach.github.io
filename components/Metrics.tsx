'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Section from '@/components/ui/Section';
import { METRICS } from '@/data/metrics';

function AnimatedCounter({ value, suffix, duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * end);

      if (current !== start) {
        start = current;
        setCount(current);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="font-mono text-3xl font-bold text-text-primary sm:text-4xl md:text-metric">
      {isInView ? (
        <>
          {value === 3 && '$'}
          {count}
          {suffix}
        </>
      ) : (
        <span className="opacity-0">0</span>
      )}
    </span>
  );
}

export default function Metrics() {
  return (
    <Section id="metrics" title="By the Numbers">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {METRICS.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col"
          >
            {metric.numericValue !== undefined ? (
              <AnimatedCounter value={metric.numericValue} suffix={metric.suffix} />
            ) : (
              <span className="font-mono text-3xl font-bold text-text-primary sm:text-4xl md:text-metric">
                {metric.value}
              </span>
            )}
            <span className="mt-2 text-sm font-medium text-text-primary">{metric.label}</span>
            <span className="mt-0.5 text-xs text-text-tertiary">{metric.context}</span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
